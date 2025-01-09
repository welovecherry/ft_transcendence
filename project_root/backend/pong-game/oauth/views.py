import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from sub.models import User
from django.conf import settings
from django.db import IntegrityError
import json
import jwt
import datetime

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
        'sub': str(user_info.id),
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
        intra_name = user_data.get('login')  # 'login'을 'username'으로 변경

        if not intra_name:
            raise ValueError("Username is missing")

        user, created = User.objects.get_or_create(
            intra_name= intra_name,
        )
        if created:
            print(f"New user created: {intra_name}")
        else:
            print(f"User already exists: {intra_name}")
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
        jwt_token = create_jwt_token(user)
        response = JsonResponse({'message': 'Login Success'})
        response = set_jwt_cookie(response, jwt_token)

        return response

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON received'}, status=400)
    except Exception as e:
        print(f"Unexpected error: {e}")
        return JsonResponse({'error': 'An unexpected error occurred'}, status=500)


def oauth_check(request):
    return JsonResponse({"status": "ok"})
