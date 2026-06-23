from rest_framework.routers import DefaultRouter

from .views import (
    SaleViewSet,
    SaleItemViewSet,
    PaymentViewSet
)

router = DefaultRouter()

router.register(r'sales', SaleViewSet)
router.register(r'sale-items', SaleItemViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = router.urls