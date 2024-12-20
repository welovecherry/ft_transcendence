from django.shortcuts import render
from django.http import JsonResponse

# 홈 페이지를 렌더링하는 함수
def home(request):
    return render(request, 'pong/home.html')

# 유저 닉네임 등록 뷰
def register_nickname(request):
    if request.method == "POST":
        nickname = request.POST.get('nickname', '').strip()
        if not nickname:
            return JsonResponse({"error": "닉네임을 입력하세요."}, status=400)

        if 'users' not in request.session:
            request.session['users'] = []

        users = request.session['users']
        if nickname in users:
            return JsonResponse({"error": "이미 등록된 닉네임입니다."}, status=400)

        users.append(nickname)
        request.session['users'] = users
        return JsonResponse({"message": "닉네임이 등록되었습니다!", "users": users})

    return JsonResponse({"error": "Invalid request."}, status=400)

# 게임 시작 뷰
def start_game(request):
    if request.method == "POST":
        users = request.session.get('users', [])
        if len(users) < 2:
            return JsonResponse({"error": "유저가 2명 이상이어야 게임을 시작할 수 있습니다."}, status=400)

        return JsonResponse({"message": "게임을 시작합니다!"})
    
    return JsonResponse({"error": "Invalid request."}, status=400)