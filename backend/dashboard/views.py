from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework import status

from .services import DashboardService
from .serializers import DashboardSerializer


class DashboardView(APIView):
    def get(self, request):
        dashboard_data = DashboardService.get_dashboard_data()
        serializer = DashboardSerializer(dashboard_data)
        return Response(serializer.data, status=status.HTTP_200_OK)