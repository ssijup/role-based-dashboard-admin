
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, Warehouse, Announcement
from .serializers import (
    UserSerializer, LoginSerializer, WarehouseSerializer, AnnouncementSerializer
)
from .permissions import IsPlatformAdmin, IsAdminUser

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = authenticate(email=email, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'token': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_view(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    # Blacklist token logic could be added here
    return Response(status=status.HTTP_204_NO_CONTENT)

class WarehouseAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        warehouses = Warehouse.objects.all()
        serializer = WarehouseSerializer(warehouses, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = WarehouseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WarehouseDetailAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get_object(self, pk):
        try:
            return Warehouse.objects.get(pk=pk)
        except Warehouse.DoesNotExist:
            return None

    def get(self, request, pk):
        warehouse = self.get_object(pk)
        if not warehouse:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = WarehouseSerializer(warehouse)
        return Response(serializer.data)

    def put(self, request, pk):
        warehouse = self.get_object(pk)
        if not warehouse:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = WarehouseSerializer(warehouse, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        warehouse = self.get_object(pk)
        if not warehouse:
            return Response(status=status.HTTP_404_NOT_FOUND)
        warehouse.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AnnouncementAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        announcements = Announcement.objects.all().order_by('-created_at')
        serializer = AnnouncementSerializer(announcements, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AnnouncementSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AnnouncementDetailAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get_object(self, pk):
        try:
            return Announcement.objects.get(pk=pk)
        except Announcement.DoesNotExist:
            return None

    def get(self, request, pk):
        announcement = self.get_object(pk)
        if not announcement:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = AnnouncementSerializer(announcement)
        return Response(serializer.data)

    def put(self, request, pk):
        announcement = self.get_object(pk)
        if not announcement:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = AnnouncementSerializer(announcement, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        announcement = self.get_object(pk)
        if not announcement:
            return Response(status=status.HTTP_404_NOT_FOUND)
        announcement.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
