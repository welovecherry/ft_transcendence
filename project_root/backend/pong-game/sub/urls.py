from django.urls import path
from sub.views import enroll_handler

urlpatterns = [
	# GET 요청 : 특정 유저의 선택값 가져오기
	path('enroll/', enroll_handler, name='enroll_handler'),
	# POST 요청 : 유저의 선택값 저장
	# path('enroll/', enroll_choice, name='enroll_choice'),
]