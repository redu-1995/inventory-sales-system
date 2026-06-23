from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import Sale, SaleItem, Payment
from .serializers import (
    SaleSerializer,
    SaleItemSerializer,
    PaymentSerializer
)


class SaleViewSet(ModelViewSet):
    """
    Handles CRUD operations for Sales.
    """
    queryset = Sale.objects.select_related(
        'customer',
        'user'
    ).prefetch_related(
        'items',
        'payments'
    )

    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SaleItemViewSet(ModelViewSet):
    """
    Handles CRUD operations for Sale Items.
    """
    queryset = SaleItem.objects.select_related(
        'sale',
        'product'
    )

    serializer_class = SaleItemSerializer
    permission_classes = [IsAuthenticated]


class PaymentViewSet(ModelViewSet):
    """
    Handles CRUD operations for Payments.
    """
    queryset = Payment.objects.select_related('sale')

    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]