from rest_framework import serializers
from django.db import transaction
from .models import Inventory, StockMovement, PurchaseOrder, PurchaseOrderItem

class InventorySerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    sku = serializers.ReadOnlyField(source='product.sku')
    category_name = serializers.ReadOnlyField(source='product.category.name')

    class Meta:
        model = Inventory
        fields = ['id', 'product', 'product_name', 'sku', 'category_name', 'quantity', 'reorder_level', 'updated_at']
        read_only_fields = ['updated_at']


class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    user_name = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = StockMovement
        fields = [
            'id', 'product', 'product_name', 'movement_type', 
            'quantity', 'user', 'user_name', 'created_at'
        ]
        read_only_fields = ['created_at', 'user']

    def validate_quantity(self, value):
        """Enforce that all recorded movement steps pass positive counts."""
        if value <= 0:
            raise serializers.ValidationError("Quantity must be a positive integer greater than zero.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        """
        Processes stock alterations dynamically based on movement_type rules.
        Wraps operations inside an atomic transaction block.
        """
        product = validated_data['product']
        movement_type = validated_data['movement_type']
        qty = validated_data['quantity']
        
        # Pull the authenticated user context from request parameters
        user = self.context['request'].user

        # Fetch or initialize the target inventory row using select_for_update to lock it
        inventory, created = Inventory.objects.select_for_update().get_or_create(
            product=product,
            defaults={'quantity': 0, 'reorder_level': 10}
        )

        # Apply specific math actions based on system logic flows
        if movement_type == 'IN':
            inventory.quantity += qty

        elif movement_type == 'OUT':
            if inventory.quantity < qty:
                raise serializers.ValidationError(
                    {"quantity": f"Insufficient stock for {product.name}. Available: {inventory.quantity}"}
                )
            inventory.quantity -= qty

        elif movement_type == 'ADJUST':
            # For manual corrections, the quantity field represents the *new exact balance*
            inventory.quantity = qty

        else:
            raise serializers.ValidationError({"movement_type": "Invalid movement type requested."})

        # Commit stock balance adjustment to database
        inventory.save()

        # Save and return the stock movement log entry
        movement = StockMovement.objects.create(
            product=product,
            movement_type=movement_type,
            quantity=qty,
            user=user
        )
        return movement


# Purchase Order mappings remain clean as they are handled during state updates
class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = PurchaseOrderItem
        fields = ['id', 'purchase_order', 'product', 'product_name', 'quantity', 'cost_price']


class PurchaseOrderSerializer(serializers.ModelSerializer):
    supplier_name = serializers.ReadOnlyField(source='supplier.name')
    items = PurchaseOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = ['id', 'supplier', 'supplier_name', 'user', 'total_amount', 'status', 'order_date', 'items']
        read_only_fields = ['order_date', 'user']
    @transaction.atomic
    def update(self, instance, validated_data):
        """
        Interceptors state updates. If status changes to 'RECEIVED',
        it triggers inventory increases and logs automated stock movements.
        """
        old_status = instance.status
        new_status = validated_data.get('status', old_status)

        # Execute our automation ONLY when shifting to RECEIVED from a non-received state
        if new_status == 'RECEIVED' and old_status != 'RECEIVED':
            
            # Fetch all item lines associated with this Purchase Order
            po_items = instance.items.all() # assumes related_name='items' on PurchaseOrderItem
            
            for item in po_items:
                product = item.product
                quantity_received = item.quantity

                # Lock the inventory row to prevent race conditions during updates
                inventory, created = Inventory.objects.select_for_update().get_or_create(
                    product=product,
                    defaults={'quantity': 0, 'reorder_level': 10}
                )

                # Step 1: Increase inventory quantity metrics
                inventory.quantity += quantity_received
                inventory.save()

                # Step 2: Create automated StockMovement audit log (IN)
                StockMovement.objects.create(
                    product=product,
                    movement_type='IN',
                    quantity=quantity_received,
                    user=self.context['request'].user
                )

        # Call the standard DRF super method to save all basic field updates
        return super().update(instance, validated_data)