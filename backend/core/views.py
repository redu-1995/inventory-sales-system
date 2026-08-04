# core/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .services import SearchService
from .serializers import GlobalSearchResultSerializer

class GlobalSearchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '')
        results = SearchService.search_all(query=query)
        serializer = GlobalSearchResultSerializer(results)
        return Response(serializer.data, status=status.HTTP_200_OK)