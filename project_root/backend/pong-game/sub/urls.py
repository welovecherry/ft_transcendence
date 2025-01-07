from django.urls import path
from sub import views

urlpatterns = [
	path('enroll/', views.enroll_handler, name='enroll_handler'),
	path('match/', views.match_handler, name='match_handler'),
	path("history/", views.history, name='history'),
]