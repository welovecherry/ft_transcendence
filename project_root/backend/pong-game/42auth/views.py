import requests
from django.shortcuts import redirect, render
from django.conf import settings
from django.contrib.auth import logout

# authorization url를 리턴해주는 함수
def oauth_login(request):
    authorization_url = (
        f"{settings.AUTHORIZATION_URL}"
        f"?client_id={settings.CLIENT_ID}"
        f"&redirect_uri={settings.REDIRECT_URI}"
        f"&response_type=code"
    )
    return JsonResponse(authorization_url)

# authorization code를 전달받고, 전달받은 code를 통해 서버에 post 요청,
# 이후 가공된 data를 front에 json 형태로 전달
def oauth_callback(request):
    authorization_code = request.GET.get('code')
    # 예외 처리 필요

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

    user_data = user_response.json()

    front_data.id = user_data['id']
    front_data.login = user_data['login']
    return JsonResponse(front_data)