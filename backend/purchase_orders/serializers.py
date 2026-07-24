from rest_framework import serializers
from django.db import transaction
from .models import PurchaseOrder, PurchaseOrderItem
from products.models import Product, Supplier
from inventory.models import Inventory, StockMovement


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    # Map directly to Product.name
    product_name = serializers.CharField(source='product.name', read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = PurchaseOrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'cost_price', 'subtotal']

    def get_subtotal(self, obj):
        return obj.quantity * obj.cost_price

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0.")
        return value

    def validate_cost_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Cost price must be greater than 0.")
        return value


class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True)
    
    # Corrected: Match Supplier.company_name and handle null values safely
    supplier_name = serializers.CharField(
        source='supplier.company_name', 
        read_only=True, 
        default=''
    )
    user_name = serializers.CharField(
        source='user.username', 
        read_only=True, 
        default=''
    )

    class Meta:
        model = PurchaseOrder
        fields = [
            'id',
            'supplier',
            'supplier_name',
            'user',
            'user_name',
            'status',
            'expected_delivery',
            'notes',
            'total_amount',
            'order_date',
            'items',
        ]
        read_only_fields = ['total_amount', 'user', 'order_date']

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("At least one purchase order item is required.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        # 1. Create Purchase Order Shell
        purchase_order = PurchaseOrder.objects.create(
            user=user,
            total_amount=0,
            **validated_data
        )

        # 2. Create Items & Calculate Total Amount
        total_amount = 0
        for item_data in items_data:
            item = PurchaseOrderItem.objects.create(
                purchase_order=purchase_order,
                **item_data
            )
            total_amount += item.quantity * item.cost_price

        purchase_order.total_amount = total_amount
        purchase_order.save(update_fields=['total_amount'])

        return purchase_order

    @transaction.atomic
    def update(self, instance, validated_data):
        if instance.status in ['RECEIVED', 'CANCELLED']:
            raise serializers.ValidationError(
                f"Cannot update a purchase order that is already {instance.status.lower()}."
            )

        items_data = validated_data.pop('items', None)
        new_status = validated_data.get('status', instance.status)

        # 1. Update basic fields (supplier, expected_delivery, notes)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # 2. Re-create items if provided in request
        if items_data is not None:
            instance.items.all().delete()
            total_amount = 0
            for item_data in items_data:
                PurchaseOrderItem.objects.create(purchase_order=instance, **item_data)
                total_amount += item_data['quantity'] * item_data['cost_price']
            instance.total_amount = total_amount

        # 3. Increase stock & create movement on 'RECEIVED'
        if new_status == 'RECEIVED' and instance.status != 'RECEIVED':
            request = self.context.get('request')
            user = request.user if request and request.user.is_authenticated else None

            for item in instance.items.select_related('product'):
                inventory, _ = Inventory.objects.get_or_create(product=item.product)
                inventory.quantity += item.quantity
                inventory.save(update_fields=['quantity', 'updated_at'])

                StockMovement.objects.create(
                    product=item.product,
                    movement_type='IN',
                    quantity=item.quantity,
                    user=user
                )

        instance.save()
        return instance