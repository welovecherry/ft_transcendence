from django.http import JsonResponse
# Cross-Site Request Forgery (CSRF) : 웹사이트의 취약점을 이용하여 사용자가 의도하지 않은 요청을 통해 다른 사용자의 정보를 변조하는 공격
from django.views.decorators.csrf import csrf_exempt
from .models import Match, User
import json
from django.db.models.functions import Random
from django.db.models import Q

@csrf_exempt # [ ]테스트단계에서만 비활성화 | 배포환경에서는 비활성화 금지
def enroll_choice(request):
	if request.method == 'POST':
		try:
			data = json.loads(request.body)
			
			choice = data.get('choice')
			user = request.user
			
			user.user_choice = choice
			user.save()
			
			return JsonResponse({
				"me_choice": choice
			})
			
		except Exception as e:
			return JsonResponse({"error": str(e)}, status=500)

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
def enroll_handler(request):
	if request.method == 'POST':
		return enroll_choice(request)
	else:
		return get_enrollment(request)

@csrf_exempt
def match_handler(request):
	if request.method == 'POST':
		return create_match(request)
	else:
		return start_match(request)

@csrf_exempt
def start_match(request):
	if request.method == 'GET':
		try:
			current_user = request.user
			
			# 현재 사용자를 제외한 다른 사용자들 중에서 랜덤으로 한명 선택
			other_user = User.objects.filter(
				~Q(id=current_user.id),
				user_choice__isnull=False
			).order_by(Random()).first()
			
			if not other_user:
				return JsonResponse({"error": "No available users found"}, status=404)
			
			return JsonResponse({
				"other_id": other_user.intra_name,
				"other_choice": other_user.user_choice
			}, status=200)
		
		except Exception as e:
			return JsonResponse({"error": str(e)}, status=500)
	
	return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def create_match(request):
	if request.method == 'POST':
		try:
			me = request.user
			data = json.loads(request.body)
			other_id = data.get('other_id')
			
			other_user = User.objects.get(intra_name=other_id)  # intra_name으로 조회
			
			# 매치 생성
			match = Match.objects.create(
				me=me,
				other=other_user,
				me_choice=me.user_choice,
				other_choice=other_user.user_choice
			)
			
			# 양쪽 사용자의 choice 초기화
			me.user_choice = None
			other_user.user_choice = None
			me.save()
			other_user.save()
			
			return JsonResponse({
				"other_id": other_user.intra_name,
				"me_choice": match.me_choice,
				"other_choice": match.other_choice
			}, status=200)
			
		except User.DoesNotExist:
			return JsonResponse({"error": "Other user not found"}, status=404)
		except Exception as e:
			return JsonResponse({"error": str(e)}, status=500)
	
	return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def history(request):
	if request.method == 'GET':
		data = json.loads(request.body)
		
		user_id = data.get('user_id')

		
