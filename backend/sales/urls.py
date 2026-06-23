from rest_framework.routers import DefaultRouter

from .views import (
    SaleViewSet,
    SaleItemViewSet,
    PaymentViewSet
)

router = DefaultRouter()

router.register(r'sales', SaleViewSet, basename='sale')
router.register(r'sale-items', SaleItemViewSet, basename='sale-item')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = router.urls