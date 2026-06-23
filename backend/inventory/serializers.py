from rest_framework import serializers
from .models import (
    Inventory,
    StockMovement,
    PurchaseOrder,
    PurchaseOrderItem
)


class InventorySerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = Inventory
        fields = [
            'id',
            'product',
            'product_name',
            'quantity',
            'reorder_level',
            'updated_at'
        ]
        read_only_fields = ['updated_at']


class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    user_name = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = StockMovement
        fields = [
            'id',
            'product',
            'product_name',
            'movement_type',
            'quantity',
            'user',
            'user_name',
            'created_at'
        ]
        read_only_fields = ['created_at']


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = PurchaseOrderItem
        fields = [
            'id',
            'purchase_order',
            'product',
            'product_name',
            'quantity',
            'cost_price'
        ]


class PurchaseOrderSerializer(serializers.ModelSerializer):
    supplier_name = serializers.ReadOnlyField(source='supplier.name')
    items = PurchaseOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = [
            'id',
            'supplier',
            'supplier_name',
            'user',
            'total_amount',
            'status',
            'order_date',
            'items'
        ]
        read_only_fields = ['order_date']