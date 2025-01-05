# api/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('oauth/login/', views.oauth_login, name='oauth_login'),
    path('oauth/access/', views.oauth_access, name='oauth_access'),