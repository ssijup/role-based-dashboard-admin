
from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/', views.login_view, name='login'),
    path('auth/user/', views.user_view, name='user'),
    path('auth/logout/', views.logout_view, name='logout'),
    
    # Warehouse URLs
    path('warehouses/', views.WarehouseAPIView.as_view(), name='warehouse-list'),
    path('warehouses/<int:pk>/', views.WarehouseDetailAPIView.as_view(), name='warehouse-detail'),
    
    # Announcement URLs
    path('announcements/', views.AnnouncementAPIView.as_view(), name='announcement-list'),
    path('announcements/<int:pk>/', views.AnnouncementDetailAPIView.as_view(), name='announcement-detail'),
]
