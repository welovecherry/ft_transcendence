import random
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json

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
    return JsonResponse(authorization_url)

# authorization code를 전달받고, 전달받은 code를 통해 서버에 post 요청,
# 이후 가공된 data를 front에 json 형태로 전달
def oauth_access(request):
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