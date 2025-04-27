
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Warehouse, Announcement, Category, SubCategory

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'role')
        read_only_fields = ('id',)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']

class SubCategorySerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'category', 'category_name', 'description', 'created_at', 'updated_at']

        model = Warehouse
        fields = ['id', 'city', 'latitude', 'longitude', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class AnnouncementSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    
    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'created_by', 'created_by_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
