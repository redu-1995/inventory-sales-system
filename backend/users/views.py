from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import User, Role
from .serializers import (
    UserSerializer,
    RoleSerializer
)


class RoleViewSet(ModelViewSet):
    """
    CRUD operations for Roles
    """
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]


class UserViewSet(ModelViewSet):
    """
    CRUD operations for Users
    """
    queryset = User.objects.select_related('role').all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]