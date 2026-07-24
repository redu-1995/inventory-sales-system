from rest_framework.routers import DefaultRouter

from .views import (
    InventoryViewSet,
    LowStockAlertViewSet,
    StockMovementViewSet,
   
    InventoryExportViewSet,
    InventoryAnalyticsViewSet
    
)

router = DefaultRouter()

router.register(
    r'inventory',
    InventoryViewSet,
    basename='inventory'
)

router.register(
    r'stock-movements',
    StockMovementViewSet,
    basename='stock-movement'
)


router.register(r'exports', InventoryExportViewSet, basename='inventory-export')

router.register(
    r'low-stock-alerts', 
    LowStockAlertViewSet,
    basename='low-stock-alerts'
)

router.register(r'analytics', InventoryAnalyticsViewSet, basename='inventory-analytics')
urlpatterns = router.urls