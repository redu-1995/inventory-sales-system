# backend/reports/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReportViewSet, ExportViewSet

router = DefaultRouter()
router.register(r'', ReportViewSet, basename='reports')

urlpatterns = [
    # 1. Dedicated standalone export router/paths
    path('export/sales/', ExportViewSet.as_view({'get': 'sales'}), name='export-sales'),
    path('export/inventory/', ExportViewSet.as_view({'get': 'inventory'}), name='export-inventory'),
    path('export/stock-movements/', ExportViewSet.as_view({'get': 'stock_movements'}), name='export-stock-movements'),
    path('export/customers/', ExportViewSet.as_view({'get': 'customers'}), name='export-customers'),
    path('export/purchases/', ExportViewSet.as_view({'get': 'purchases'}), name='export-purchases'),

    # 2. Main DRF router endpoints
    path('', include(router.urls)),
]