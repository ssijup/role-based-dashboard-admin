
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'platform_admin')
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    PLATFORM_ADMIN = 'platform_admin'
    SUPPORT_STAFF = 'support_staff'
    WAREHOUSE_ADMIN = 'warehouse_admin'
    
    ROLE_CHOICES = [
        (PLATFORM_ADMIN, 'Platform Admin'),
        (SUPPORT_STAFF, 'Support Staff'),
        (WAREHOUSE_ADMIN, 'Warehouse Admin'),
    ]
    
    username = None
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=SUPPORT_STAFF)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    
    objects = UserManager()

