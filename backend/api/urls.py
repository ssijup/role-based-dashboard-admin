
from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/', views.login_view, name='login'),
    path('auth/user/', views.user_view, name='user'),
    path('auth/logout/', views.logout_view, name='logout'),
]

