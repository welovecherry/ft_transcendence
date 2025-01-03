# api/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('enroll/<int:user_id>/', views.get_enroll, name='get_enroll'),
    path('enroll/', views.post_enroll, name='post_enroll'),
    path('match/<int:user_id>/', views.get_match, name='get_match'),
    path('match/', views.post_match, name='post_match'),
    path('history/<int:user_id>/', views.get_history, name='get_history'),
    path('oauth/login/', views.oauth_login, name='oauth_login'),
    path('oauth/access/', views.oauth_access, name='oauth_access'),
]
