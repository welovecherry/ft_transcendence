from django.urls import path
from sub import views

urlpatterns = [
	path('enroll/', views.enroll_handler, name='enroll_handler'),
	path('match/', views.start_match, name='start_match'),
	path("match/choice/", views.user_choice_match, name='user_choice_match'),
]	