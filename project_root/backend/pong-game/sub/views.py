from django.http import JsonResponse
# Cross-Site Request Forgery (CSRF) : 웹사이트의 취약점을 이용하여 사용자가 의도하지 않은 요청을 통해 다른 사용자의 정보를 변조하는 공격
from django.views.decorators.csrf import csrf_exempt
from .models import Match, User
import json

# TODO: 테스트단계에서만 비활성화 | 배포환경에서는 비활성화 금지
@csrf_exempt
# [ ] : example_view 함수의 내용을 수정하여 API 서버가 정상적으로 동작하는지 확인
def example_view(request):
	return JsonResponse({"message": "Hello, World!"})

# Enroll API
# POST /api/enroll/
@csrf_exempt # [ ]테스트단계에서만 비활성화 | 배포환경에서는 비활성화 금지
def enroll_choice(request):
	if request.method == 'POST':
		data = json.loads(request.body)
		user_id = data.get('user_id')
		choice = data.get('choice')
		
		try:
			user = User.objects.get(id=user_id)
			# get_or_create : 객체 검색. 존재하지 않을 경우 새로운 객체 생성
			# -> (객체[match], 생성여부_Boolean[created]) 반환
			match, created = Match.objects.get_or_create(me=user, other__isnull=True)
			match.me_choice = choice
			match.save()
			return JsonResponse({"enroll_choice:try: message": "Choice saved", "match_id":match.id})
		except User.DoesNotExist:
			return JsonResponse({"enroll_choice:except: error": "User does not exist"}, status=404)
		
	else:
		user_id = request.GET.get('user_id')
		return JsonResponse({"enroll_choice:else: error": "Invalid request method"}, status=405)

# Enroll API
# GET /api/enroll/<int:user_id>/
def get_enrollment(request, user_id):
	if(request.method == "GET"):
		try:
			match = Match.objects.get(me_id=user_id)
			return JsonResponse({
				"me_id": match.me.id,
				"me_choice": match.me_choice
				}, status=200)
		except Match.DoesNotExist:
			return JsonResponse({"get_enrollment:if: error": "NO enrollment found"}, status=404)
	else:
		return JsonResponse({"get_enrollment:else: error": "Invalid"}, status=500)
					    # "Invalid request method"}, status=405)
			# user = User.objects.get(id=user_id)
	# 		match = Match.objects.filter(me=user, other__isnull=True).first()
	# 		return JsonResponse({
	# 			"me_id": match.me.id,
	# 			"me_choice": match.me_choice
	# 		}. status=200)
	# 	if match:
	# 		return JsonResponse({"me_id": user.id, "me_choice": match.me_choice})
	# 	return JsonResponse({"error": "NO enrollment found"}, status=404)
	# except User.DoseNotExist:
	# 	return JsonResponse({"error": "User does not exist"}, status=404)