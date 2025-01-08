from django.http import JsonResponse
# Cross-Site Request Forgery (CSRF) : 웹사이트의 취약점을 이용하여 사용자가 의도하지 않은 요청을 통해 다른 사용자의 정보를 변조하는 공격
from django.views.decorators.csrf import csrf_exempt
from .models import Match, User
import json
from django.db.models.functions import Random
from django.db.models import Q
from django.utils import timezone

@csrf_exempt
def enroll_handler(request):
	if request.method == 'POST':
		return enroll_choice(request)
	else:
		return get_enrollment(request)

@csrf_exempt
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

@csrf_exempt
def get_enrollment(request):
	if request.method == 'GET':
		try:
			user = request.user
			return JsonResponse({
				"choice": user.choice
			}, status=200)
		except Exception as e:
			return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def match_handler(request):
	if request.method == 'POST':
		return check_match(request)
	else:
		return start_match(request)

@csrf_exempt
def start_match(request):
    if request.method == 'GET':
        try:
            current_user = request.user
            
            # choice가 있는 유저만 선택
            other_user = User.objects.filter(
                ~Q(id=current_user.id),
                choice__isnull=False
            ).order_by(Random()).first()
            
            if not other_user:
                return JsonResponse({"error": "No available users found"}, status=404)

            # other_choice를 즉시 저장
            other_choice = other_user.choice
            
            # Match 객체 생성
            match = Match.objects.create(
                me_id=current_user,
                other_id=other_user,
                other_choice=other_choice,  # 저장된 값 사용
                status='pending'
            )

            return JsonResponse({
                "match_id": match.id,
                "other_id": other_user.intra_name,
                "other_choice": other_choice
            }, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
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
            time_elapsed = (timezone.now() - match.created_at).total_seconds()
            if time_elapsed > 60:
                match.delete()
                return JsonResponse({"error": "Match expired"}, status=408)

            # 매치가 생성된 후에 other_user의 choice 초기화
            match.other_id.choice = None
            match.other_id.save()
            
            # 매치 상태 업데이트
            match.me_choice = me_choice
            match.me_id.choice = me_choice
            match.status = 'completed'
            match.save()

            # 매치가 완료된 경우에만 other_user의 choice를 None으로 초기화
            if match.status == 'completed':
                # match.other_id.choice = None
                match.other_id.save()

            return JsonResponse({
                "other_choice_intra": match.other_id.intra_name,
                "choice": me_choice,
                "other_choice": match.other_choice,
            }, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def history_handler(request):
    if request.method == 'GET':
        try:
            current_user = request.user
            
            # 완료된 매치만 가져오기
            matches = Match.objects.filter(
                Q(other_id=current_user),
                status='completed'
            ).order_by('-created_at')
            
            history_list = []
            for match in matches:
                history_list.append({
                    "me_choice": match.me_choice,
                    "other_choice": match.other_choice
                })
            
            return JsonResponse(history_list, safe=False)
            
        except Exception as e:
            print("History error:", str(e))
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)
