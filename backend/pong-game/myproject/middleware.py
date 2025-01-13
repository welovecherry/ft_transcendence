from django.http import JsonResponse
import jwt
from django.conf import settings
from django.urls import resolve
from sub.models import User

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 로그인, 회원가입 API는 인증을 건너뛰기
        # 예시로 로그인, 회원가입 URL을 제외한 모든 요청에 대해서만 인증 처리
        public_endpoints = ['/health/', '/api/oauth/login/', '/api/oauth/access/']
        current_url = resolve(request.path_info).url_name
        
        # 로그인, 회원가입 API 요청이면 인증 절차를 건너뛰기
        if request.path in public_endpoints:
            return self.get_response(request)

        # 쿠키에서 토큰 가져오기
        token = request.COOKIES.get('token')

        if not token:
            return JsonResponse({"error": "Unauthorized"}, status=401)  # 토큰이 없으면 바로 401 반환

        try:
            # 토큰 검증
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user = User.objects.get(id=payload.get('sub'))  # DB에서 사용자 조회
            request.user = user  # request 객체에 사용자 정보 추가
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token has expired"}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=401)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)

        response = self.get_response(request)
        return response
