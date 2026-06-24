from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import User, Role
from .serializers import UserSerializer, RoleSerializer


class RoleViewSet(ModelViewSet):
    """
    CRUD operations for Roles.
    Inherits global RoleBasedPermission fallback (Admin Only).
    """
    queryset = Role.objects.all()
    serializer_class = RoleSerializer


class UserViewSet(ModelViewSet):
    """
    CRUD operations for Users.
    Inherits global RoleBasedPermission fallback (Admin Only).
    """
    queryset = User.objects.select_related('role').all()
    serializer_class = UserSerializer


class CustomLoginView(TokenObtainPairView):
    """
    Public endpoint allowing users to authenticate and receive JWT tokens.
    """
    permission_classes = [AllowAny]


class CustomTokenRefreshView(TokenRefreshView):
    """
    Public endpoint allowing clients to refresh expired JWT access tokens.
    """
    permission_classes = [AllowAny]