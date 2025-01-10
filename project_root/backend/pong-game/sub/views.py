from django.http import JsonResponse
from .models import Match, User
import json
from django.db.models.functions import Random
from django.db.models import Q
from django.utils import timezone
from django.db import transaction

def enroll_handler(request):
	if request.method == 'POST':
		return enroll_choice(request)
	else:
		return get_enrollment(request)

def enroll_choice(request):
	if request.method == 'POST':
		try:
			data = json.loads(request.body)
			
			choice = data.get('choice')
			user = request.user
			
			user.choice = choice
			user.save()
			
			return JsonResponse({
				"choice": choice
			})
			
		except Exception as e:
			return JsonResponse({"error": str(e)}, status=500)

def get_enrollment(request):
	if request.method == 'GET':
		try:
			user = request.user
			return JsonResponse({
				"choice": user.choice
			}, status=200)
		except Exception as e:
			return JsonResponse({"error": str(e)}, status=500)

def match_handler(request):
	if request.method == 'POST':
		return check_match(request)
	else:
		return start_match(request)

def start_match(request):
    if request.method == 'GET':
        try:
            with transaction.atomic():
                current_user = request.user
                
                # 현재 사용자가 주체인 매치가 있는지 확인
                existing_match = Match.objects.filter(
                    me_id=current_user,
                    status='pending'
                ).first()
                
                if existing_match:
                    # 기존 매치가 유효하면 해당 매치 정보를 반환
                    time_elapsed = (timezone.now() - existing_match.updated_at).total_seconds()
                    if time_elapsed <= 60:
                        existing_match.updated_at = timezone.now()
                        existing_match.save(update_fields=['updated_at'])
                        return JsonResponse({
                            "match_id": existing_match.id,
                            "other_id": existing_match.other_id.intra_name,
                            "other_choice": existing_match.other_choice,
                            "me_id": current_user.intra_name
                        }, status=200)
                    else:
                        # 1분이 초과된 경우 매치 삭제
                        existing_match.delete()

                # 새로운 매치 생성
                other_user = User.objects.select_for_update().filter(
                    ~Q(id=current_user.id),
                    choice__isnull=False
                ).order_by(Random()).first()
                
                if not other_user:
                    return JsonResponse({"error": "No available users found"}, status=404)

                other_choice = other_user.choice
                
                match = Match.objects.create(
                    me_id=current_user,
                    other_id=other_user,
                    other_choice=other_choice,
                    status='pending'
                )

                return JsonResponse({
                    "match_id": match.id,
                    "other_id": other_user.intra_name,
                    "other_choice": other_choice,
                    "me_id": current_user.intra_name
                }, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)

def check_match(request):
    if request.method == 'POST':
        try:
            current_user = request.user
            data = json.loads(request.body)
            match_id = data.get('match_id')
            me_choice = data.get('choice')

            match = Match.objects.filter(id=match_id, me_id=current_user).first()
            if not match:
                return JsonResponse({"error": "Match not found"}, status=404)

            # 1분 초과 확인
            time_elapsed = (timezone.now() - match.updated_at).total_seconds()
            if time_elapsed > 60:
                match.delete()
                return JsonResponse({"error": "Match expired"}, status=408)

            # 매치 상태 업데이트
            match.me_choice = me_choice
            match.status = 'completed'
            match.save()

            if match.status == 'completed':
                match.other_id.choice = None
                match.other_id.save()

            return JsonResponse({
                "other_choice_intra": match.other_id.intra_name,
                "choice": me_choice,
                "other_choice": match.other_choice,
            }, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)

def history_handler(request):
    if request.method == 'GET':
        try:
            current_user = request.user
            
            # 완료된 매치만 가져오기
            matches = Match.objects.filter(
                Q(me_id=current_user) | Q(other_id=current_user),
                status='completed'
            ).order_by('-created_at')
            
            history_list = []
            for match in matches:
                if match.me_id == current_user:
                    history_list.append({
                        "me_choice": match.other_choice,
                        "other_choice": match.me_choice
                    })
                else:
                    history_list.append({
                        "me_choice": match.me_choice,
                        "other_choice": match.other_choice
                    })
            
            return JsonResponse(history_list, safe=False)
            
        except Exception as e:
            print("History error:", str(e))
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)
