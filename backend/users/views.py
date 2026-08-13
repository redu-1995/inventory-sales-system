from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from .models import User, Role
from .serializers import MyTokenObtainPairSerializer, UserSerializer, RoleSerializer


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


class MyTokenObtainPairView(TokenObtainPairView):
    # Tell this view to use your custom role-injecting serializer
    serializer_class = MyTokenObtainPairSerializer


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = (request.data.get('username') or '').strip()
        new_password = request.data.get('new_password') or ''
        confirm_password = request.data.get('confirm_password') or ''

        if not username:
            return Response({'detail': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not new_password or not confirm_password:
            return Response({'detail': 'Please provide your new password and confirmation.'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'detail': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password)
        except ValidationError as exc:
            return Response({'detail': exc.messages[0]}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(username=username).first()
        if not user:
            return Response({'detail': 'We could not find an account with that username.'}, status=status.HTTP_404_NOT_FOUND)

        user.set_password(new_password)
        user.save(update_fields=['password'])

        return Response(
            {'detail': 'Your password was updated successfully. You can now sign in with your new password.'},
            status=status.HTTP_200_OK,
        )