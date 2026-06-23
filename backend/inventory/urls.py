from rest_framework.routers import DefaultRouter

from .views import (
    InventoryViewSet,
    StockMovementViewSet,
    PurchaseOrderViewSet,
    PurchaseOrderItemViewSet
)

router = DefaultRouter()

router.register(r'inventory', InventoryViewSet)
router.register(r'stock-movements', StockMovementViewSet)
router.register(r'purchase-orders', PurchaseOrderViewSet)
router.register(r'purchase-order-items', PurchaseOrderItemViewSet)

urlpatterns = router.urls