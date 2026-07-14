from rest_framework.routers import DefaultRouter

from .views import (
    InventoryViewSet,
    StockMovementViewSet,
    PurchaseOrderViewSet,
    PurchaseOrderItemViewSet,
    InventoryExportViewSet
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

router.register(
    r'purchase-orders',
    PurchaseOrderViewSet,
    basename='purchase-order'
)

router.register(
    r'purchase-order-items',
    PurchaseOrderItemViewSet,
    basename='purchase-order-item'
)
router.register(r'exports', InventoryExportViewSet, basename='inventory-export')
urlpatterns = router.urls