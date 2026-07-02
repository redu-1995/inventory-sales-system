from django.urls import path
from .views import (
    DashboardView, 
    LowStockReportView, 
    OutOfStockReportView, 
    TopMovingProductsReportView
)

urlpatterns = [
    path('dashboard/', DashboardView.as_view(), name='dashboard-summary'),
    path('reports/low-stock/', LowStockReportView.as_view(), name='report-low-stock'),
    path('reports/out-of-stock/', OutOfStockReportView.as_view(), name='report-out-of-stock'),
    path('reports/top-moving/', TopMovingProductsReportView.as_view(), name='report-top-moving'),
]