from django.http import JsonResponse
# Cross-Site Request Forgery (CSRF) : 웹사이트의 취약점을 이용하여 사용자가 의도하지 않은 요청을 통해 다른 사용자의 정보를 변조하는 공격
from django.views.decorators.csrf import csrf_exempt
from .models import Match, User
import json
from django.db.models.functions import Random
from django.db.models import Q

# Enroll API
# POST /api/enroll/
@csrf_exempt # [ ]테스트단계에서만 비활성화 | 배포환경에서는 비활성화 금지
def enroll_choice(request):
	if request.method == 'POST':
		data = json.loads(request.body)
		id = request.user.id
		choice = data.get('choice')
		
		try:
			user = User.objects.get(id=id)
			# get_or_create : 객체 검색. 존재하지 않을 경우 새로운 객체 생성
			# -> (객체[match], 생성여부_Boolean[created]) 반환
			match, created = Match.objects.get_or_create(me=user, other__isnull=True)
			match.me_choice = choice
			match.save()
			return JsonResponse({"enroll_choice:try: message": "Choice saved", "match_id":match.id})
		except User.DoesNotExist:
			return JsonResponse({"enroll_choice:except: error": "User does not exist"}, status=404)

# Enroll API
# GET /api/enroll/
def get_enrollment(request):
	if(request.method == "GET"):
		try:
			match = Match.objects.get(me_id=request.user.id)
			return JsonResponse({
				"me_id": match.me.intra_name,
				"me_choice": match.me_choice
				}, status=200)
		except Match.DoesNotExist:
			return JsonResponse({"get_enrollment:if: error": "NO enrollment found"}, status=404)
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

@csrf_exempt
def enroll_handler(request):
	if request.method == 'POST':
		return enroll_choice(request)
	else:
		return get_enrollment(request)

@csrf_exempt
def start_match(request):
	if request.method == 'POST':
		data = json.loads(request.body)
		user_id = data.get('user_id')

		try:
			user = User.objects.get(id=user_id)
			# 다른 유저들 중에서 랜덤으로 한명 선택
			other_user = Match.objects.filter(~Q(me_id=user_id), me_choicce__isnull=False).order_by(Random()).first().me
			if not other_user:
				return JsonResponse({"error": "No other users found"}, status=404)
			other_user_choice = Match.objects.filter(me=other_user).me_choice

			match = Match.objects.create(
				me=user,
				me_choice=None,
				other=other_user,
				other_choice=other_user_choice)
			
			return JsonResponse({
				"match_id": match.id,
				"me": user.intra_name,
				"me_choice": match.me_choice,
				"other_user": other_user.intra_name,
				"other_user_choice": other_user.me_choice
				}, status=200)
		
		except User.DoesNotExist:
			return JsonResponse({"error": "User not found"}, status=404) # 의미없을것같은 except 다른 예외상황 생각해보기
	return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def user_choice_match(request):
	if request.method == 'POST':
		try:
			data = json.loads(request.body)
			match_id = data.get('match_id')
			
			match = Match.objects.get(id=match_id)
			match.me_choice = data.get('me_choice')
			match.save()
			return JsonResponse({"message": "User choice saved"}, status=200)
		except Match.DoesNotExist:
			return JsonResponse({"error": "Match not found"}, status=404)
		except Exception as e:
			return JsonResponse({"error": str(e)}, status=500)	

