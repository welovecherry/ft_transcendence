import random
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
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

# authorization code를 전달받고, 전달받은 code를 통해 서버에 post 요청,
# 이후 가공된 data를 front에 json 형태로 전달
@csrf_exempt ###임시방편
def oauth_access(request):
    try:
        authorization_code = request.GET.get('code')
        
        if authorization_code:
            print(f"Authorization Code: {authorization_code}")
        else:
            print("No authorization code received")

        # authorization_code = request.POST.get('code')
        # 예외 처리 필요
        # print(authorization_code);

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

        # 예외 처리, 구현 필요
        # if token_response.status_code != 200:
        #     return (error)

        token_data = token_response.json()
        access_token = token_data.get('access_token')

        user_response = requests.get(
            settings.USER_INFO_URL,
            headers={'Authorization': f'Bearer {access_token}'},
        )

        # 예외 처리, 구현 필요
        # if user_response.status_code != 200:
        #     return (error)
    except json.JSONDecodeError:
        print("Invalid JSON data")
    except Exception as e:
        print(f"Unexpected error: {e}")

    user_data = user_response.json()
    jwt_token = create_jwt_token(user_data)
    response = JsonResponse({'message': 'Login Success'})
    response = set_jwt_cookie(response, jwt_token)

    # DB 확인 후 존재하는 유저인지, 없으면 새로 등록하는 로직 추가 필요

    return response
