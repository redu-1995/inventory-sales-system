# core/urls.py
from django.urls import path
from .views import DashboardView, LowStockReportView, TopMovingProductsReportView

urlpatterns = [
    path('dashboard/', DashboardView.as_view(), name='dashboard-summary'),
    path('reports/low-stock/', LowStockReportView.as_view(), name='report-low-stock'),
    path('reports/top-products/', TopMovingProductsReportView.as_view(), name='report-top-products'),
]