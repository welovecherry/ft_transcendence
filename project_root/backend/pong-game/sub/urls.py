from django.urls import path
from sub import views

urlpatterns = [
	path('enroll/', views.enroll_handler, name='enroll_handler'),
	path('startmatch/', views.start_match, name='start_match'),
	path('match/', views.check_match, name='check_match'),
	path('history/', views.history_handler, name='history_handler'),
] 