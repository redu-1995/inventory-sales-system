from rest_framework import serializers
from .models import Sale, SaleItem, Payment


class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = SaleItem
        fields = [
            'id',
            'sale',
            'product',
            'product_name',
            'quantity',
            'unit_price',
            'subtotal',
        ]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id',
            'sale',
            'amount',
            'payment_method',
            'payment_date',
        ]
        read_only_fields = ['payment_date']


class SaleSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.full_name')
    user_name = serializers.ReadOnlyField(source='user.username')

    items = SaleItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)

    class Meta:
        model = Sale
        fields = [
            'id',
            'customer',
            'customer_name',
            'user',
            'user_name',
            'total_amount',
            'payment_method',
            'status',
            'sale_date',
            'items',
            'payments',
        ]
        read_only_fields = ['sale_date']