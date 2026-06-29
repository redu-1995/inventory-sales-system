from rest_framework import serializers
from .models import User, Role
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = [
            'id',
            'name',
            'description',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class UserSerializer(serializers.ModelSerializer):

    role = serializers.CharField(source="role.name", read_only=True)

    role_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),
        source="role",
        write_only=True
    )

    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "password",
            "first_name",
            "last_name",
            "email",
            "phone",
            "status",
            "created_at",

            "role",
            "role_id",
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # 1. Inject the username into the token payload
        token['username'] = user.username  

        # 2. Inject the role (Keep your existing role logic here)
        if hasattr(user, 'role') and user.role:
            token['role'] = str(user.role).upper()
        else:
            token['role'] = "STAFF"

        return token