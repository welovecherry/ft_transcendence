from django.http import JsonResponse
# Cross-Site Request Forgery (CSRF) : 웹사이트의 취약점을 이용하여 사용자가 의도하지 않은 요청을 통해 다른 사용자의 정보를 변조하는 공격
from django.views.decorators.csrf import csrf_exempt
from .models import Match, User
import json
from django.db.models.functions import Random
from django.db.models import Q
from datetime import datetime

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
				"me_choice": choice
			})
			
		except Exception as e:
			return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def get_enrollment(request):
	if request.method == 'GET':
		try:
			user = request.user
			return JsonResponse({
				"me_choice": user.user_choice
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
            
            # 다른 유저 중 랜덤 선택
            other_user = User.objects.filter(
                ~Q(id=current_user.id),
                choice__isnull=False
            ).order_by(Random()).first()
            
            if not other_user:
                return JsonResponse({"error": "No available users found"}, status=404)

            # Match 객체 생성
            match = Match.objects.create(
                me_id=current_user,
                other_id=other_user,
                other_choice=other_user.choice,
                status='pending',
				created_at=datetime.now()
            )

            return JsonResponse({
                "match_id": match.id, # ** 수민님 해당 부분 추가됐습니다! POST때 match_id 추가해주세요 **
                "other_id": other_user.intra_name,
                "other_choice": other_user.choice
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
            me_choice = data.get('me_choice')

            match = Match.objects.filter(id=match_id, me_id=current_user).first()
            if not match:
                return JsonResponse({"error": "Match not found"}, status=404)

            # 1분 초과 확인
            time_elapsed = (datetime.now() - match.created_at).total_seconds()
            if time_elapsed > 60:
                # 1분 초과된 매치 삭제
                match.delete()
                return JsonResponse({"error": "Match expired"}, status=408)

            # 1분 내라면 상태 업데이트
            match.me_choice = me_choice
            match.status = 'completed'
            match.save()

            return JsonResponse({
                "status": "completed",
            }, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)
