# api/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.oauth_login, name='oauth_login'),
    path('access/', views.oauth_access, name='oauth_access'),
]
