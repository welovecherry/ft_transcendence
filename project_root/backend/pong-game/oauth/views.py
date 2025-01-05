import random
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.conf import settings
from django.db import IntegrityError
import json
import jwt
import datetime

# Mock data
mock_data = {
    "enroll": [
        {"id": 2, "select": "Scissors"},
        {"id": 3, "select": "Paper"},
        {"id": 4, "select": "Scissors"},
        {"id": 5, "select": "Rock"},
    ],
    "history": [
        {"me_id": 1, "me_select": "Rock", "other_id": 2, "other_select": "Scissors"},
        {"me_id": 2, "me_select": "Paper", "other_id": 3, "other_select": "Rock"},
        {"me_id": 2, "me_select": "Scissors", "other_id": 1, "other_select": "Paper"},
    ]
}

# Helper functions
def find_by_id(data_list, user_id):
    return next((item for item in data_list if item["id"] == user_id), None)

# GET /api/enroll/{user_id}
def get_enroll(request, user_id):
    data = find_by_id(mock_data["enroll"], user_id)
    if data:
        return JsonResponse(data)
    return JsonResponse({}, status=200)

# POST /api/enroll
@csrf_exempt
def post_enroll(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            mock_data["enroll"].append(body)
            return JsonResponse({"message": "User enrolled successfully", "data": body}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)

# GET /api/match/{user_id}
def get_match(request, user_id):
    other_matches = [item for item in mock_data["enroll"] if item["id"] != user_id]
    if other_matches:
        random_match = random.choice(other_matches)
        return JsonResponse(random_match)
    return JsonResponse({"error": "No matches available"}, status=404)

# POST /api/match
@csrf_exempt
def post_match(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            required_fields = {"me_id", "me_select", "other_id", "other_select"}
            if not required_fields.issubset(body):
                return JsonResponse({"error": "Missing required fields"}, status=400)
            mock_data["history"].append(body)
            return JsonResponse({"message": "Match created successfully", "data": body}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)

# GET /api/history/{user_id}
def get_history(request, user_id):
    matches = [
        match for match in mock_data["history"]
        if match["me_id"] == user_id or match["other_id"] == user_id
    ]
    return JsonResponse(matches, safe=False)

# authorization url를 리턴해주는 함수
def oauth_login(request):
    authorization_url = (
        f"{settings.AUTHORIZATION_URL}"
        f"?client_id={settings.CLIENT_ID}"
        f"&redirect_uri={settings.REDIRECT_URI}"
        f"&response_type=code"
    )
    return JsonResponse({"url": authorization_url})

def create_jwt_token(user_info):
    payload = {
        'sub': user_info['id'],
        'username': user_info['login'],
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token

def set_jwt_cookie(response, token):
    response.set_cookie(
        'token', token,
        httponly=True,
        secure=True,
        # samesite='Strict',
        max_age=3600
    )
    return response

def handle_user_registration(user_data):
    try:
        email = user_data.get('email')
        username = user_data.get('login')  # 'login'을 'username'으로 변경

        if not username:
            raise ValueError("Username is missing")

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': username,  # 'login'을 'username'으로 변경
                'is_active': True,
            }
        )
        if created:
            print(f"New user created: {username} ({email})")
        else:
            print(f"User already exists: {username} ({email})")
        return user, created
    except IntegrityError as e:
        print(f"Database integrity error: {e}")
        raise e
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise e

# authorization code를 전달받고, 전달받은 code를 통해 서버에 post 요청,
# 이후 가공된 data를 front에 json 형태로 전달
@csrf_exempt ###임시방편
def oauth_access(request):
    try:
        # 1. Authorization Code 받기
        authorization_code = request.GET.get('code')
        if not authorization_code:
            print("No authorization code received") # 디버깅 메시지
            return JsonResponse({'error': 'Authorization code is missing'}, status=400)
        print(f"Authorization Code: {authorization_code}")

        # 2. Access Token 요청
        token_response = requests.post(
            settings.TOKEN_URL,
            data={
                'grant_type': 'authorization_code',
                'client_id': settings.CLIENT_ID,
                'client_secret': settings.CLIENT_SECRET,
                'code': authorization_code,
                'redirect_uri': settings.REDIRECT_URI,
            },
        )
        if token_response.status_code != 200:
            return JsonResponse(
                {'error': 'Failed to fetch access token'},
                status=token_response.status_code)
        token_data = token_response.json()
        access_token = token_data.get('access_token')
        if not access_token:
            return JsonResponse(
                {'error': 'Access token not received'},
                status=400)
        
        # 3. User Info 요청
        user_response = requests.get(
            settings.USER_INFO_URL,
            headers={'Authorization':f'Bearer {access_token}'},
        )
        if user_response.status_code != 200:
            return JsonResponse(
                {'error': 'Failed to fetch user info'},
                status=user_response.status_code)
        user_data = user_response.json()
        print(f"User Data: {user_data}")

        # 4. DB 연동 (사용자 확인 및 생성)
        user, created = handle_user_registration(user_data)

        # 5. JWT 생성 및 응답
        jwt_token = create_jwt_token(user_data)
        response = JsonResponse({'message': 'Login Success'})
        response = set_jwt_cookie(response, jwt_token)

        return response

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON received'}, status=400)
    except Exception as e:
        print(f"Unexpected error: {e}")
        return JsonResponse({'error': 'An unexpected error occurred'}, status=500)
        