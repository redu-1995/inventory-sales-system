from rest_framework import serializers
from django.db import transaction
from .models import Inventory, StockMovement

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
    
    # OVERRIDE: Change the field validation to allow 0 or any integer temporarily 
    # so DRF does not reject the initial payload before running our custom logic.
    quantity = serializers.IntegerField()

    class Meta:
        model = StockMovement
        fields = [
            'id', 'product', 'product_name', 'movement_type', 
            'quantity', 'user', 'user_name', 'created_at'
        ]
        read_only_fields = ['created_at', 'user']

    def validate(self, data):
        """
        Validates the user payload input BEFORE doing any database math.
        """
        movement_type = data.get('movement_type')
        qty = data.get('quantity')

        # 1. Standard actions (IN / OUT) must use a positive payload quantity
        if movement_type in ['IN', 'OUT']:
            if qty <= 0:
                raise serializers.ValidationError(
                    {"quantity": "Operational quantity must be a positive number greater than zero."}
                )

        # 2. Reconcile / Audit actions (ADJUST) must be a non-negative absolute target balance
        elif movement_type == 'ADJUST':
            if qty < 0:
                raise serializers.ValidationError(
                    {"quantity": "Physical stock level cannot be negative."}
                )
        else:
            raise serializers.ValidationError({"movement_type": "Invalid operational movement type."})

        return data

    @transaction.atomic
    def create(self, validated_data):
        """
        Executes database state adjustments safely for all three operations.
        """
        product = validated_data['product']
        movement_type = validated_data['movement_type']
        qty = validated_data['quantity']
        user = self.context['request'].user

        # Fetch or safely initialize the inventory tracker
        inventory, created = Inventory.objects.select_for_update().get_or_create(
            product=product,
            defaults={'quantity': 0, 'reorder_level': 10}
        )

        # This will store the final positive integer written to the StockMovement table log
        final_log_qty = qty

        if movement_type == 'IN':
            inventory.quantity += qty
            final_log_qty = qty  # Keep the positive number for the log

        elif movement_type == 'OUT':
            if inventory.quantity < qty:
                raise serializers.ValidationError(
                    {"quantity": f"Insufficient warehouse stock for {product.name}. Available: {inventory.quantity}"}
                )
            inventory.quantity -= qty
            final_log_qty = qty  # Keep the positive number for the log

        elif movement_type == 'ADJUST':
            # Compute difference: [New Count] - [Current DB stock]
            discrepancy = qty - inventory.quantity
            
            # The log entry must capture the absolute variation value as a positive integer 
            # to accommodate database model properties safely.
            final_log_qty = abs(discrepancy)
            
            # Override the current inventory with the absolute physical target level
            inventory.quantity = qty

        # 1. Update the master inventory balance row
        inventory.save()

        # 2. Write the transaction history row using a clean positive count
        movement = StockMovement.objects.create(
            product=product,
            movement_type=movement_type,
            quantity=final_log_qty,  # Always a positive integer >= 0
            user=user
        )
        return movement

# Purchase Order mappings remain clean as they are handled during state updates
# class PurchaseOrderItemSerializer(serializers.ModelSerializer):
#     product_name = serializers.ReadOnlyField(source='product.name')

#     class Meta:
#         model = PurchaseOrderItem
#         fields = ['id', 'purchase_order', 'product', 'product_name', 'quantity', 'cost_price']


# from django.db import transaction


# class PurchaseOrderItemSerializer(serializers.ModelSerializer):
#     product_name = serializers.ReadOnlyField(source='product.name')

#     class Meta:
#         model = PurchaseOrderItem
        # 'purchase_order' is removed from read_only/required fields during nested creation
        # because the parent serializer will assign it automatically.
#         fields = ['id', 'product', 'product_name', 'quantity', 'cost_price']


# class PurchaseOrderSerializer(serializers.ModelSerializer):
#     supplier_name = serializers.ReadOnlyField(source='supplier.name')
#     # 1. Removed read_only=True to allow receiving items during POST requests
#     items = PurchaseOrderItemSerializer(many=True)

    # class Meta:
    #     model = PurchaseOrder
    #     fields = ['id', 'supplier', 'supplier_name', 'user', 'total_amount', 'status', 'order_date', 'items']
    #     read_only_fields = ['order_date', 'user', 'total_amount']

    # @transaction.atomic
    # def create(self, validated_data):
    #     # Extract the nested items payload
    #     items_data = validated_data.pop('items')
        
    #     # Pull current authenticated user from request context (if using authentication)
    #     request = self.context.get('request')
    #     user = request.user if request and request.user.is_authenticated else None

    #     # 2. Create the parent Purchase Order instance
    #     purchase_order = PurchaseOrder.objects.create(
    #         user=user,
    #         **validated_data
    #     )

    #     total = 0

    #     # 3. Create nested Purchase Order Items & compute totals
    #     for item_data in items_data:
    #         PurchaseOrderItem.objects.create(
    #             purchase_order=purchase_order,
    #             **item_data
    #         )
    #         # Accumulate cost calculation
    #         total += item_data['quantity'] * item_data['cost_price']

    #     # 4. Save computed total
    #     purchase_order.total_amount = total
    #     purchase_order.save()

    #     return purchase_order

    # @transaction.atomic
    # def update(self, instance, validated_data):
    #     """
    #     Intercepts state updates. If status changes to 'RECEIVED',
    #     it triggers inventory increases and logs automated stock movements.
    #     """
    #     old_status = instance.status
    #     new_status = validated_data.get('status', old_status)

    #     # Execute our automation ONLY when shifting to RECEIVED from a non-received state
    #     if new_status == 'RECEIVED' and old_status != 'RECEIVED':
    #         # Fetch all item lines associated with this Purchase Order
    #         po_items = instance.items.all() 
            
    #         for item in po_items:
    #             product = item.product
    #             quantity_received = item.quantity

    #             # Lock the inventory row to prevent race conditions during updates
    #             inventory, created = Inventory.objects.select_for_update().get_or_create(
    #                 product=product,
    #                 defaults={'quantity': 0, 'reorder_level': 10}
    #             )

    #             # Step 1: Increase inventory quantity metrics
    #             inventory.quantity += quantity_received
    #             inventory.save()

    #             # Step 2: Create automated StockMovement audit log (IN)
    #             request = self.context.get('request')
    #             user = request.user if request and request.user.is_authenticated else None
                
    #             StockMovement.objects.create(
    #                 product=product,
    #                 movement_type='IN',
    #                 quantity=quantity_received,
    #                 user=user
    #             )

    #     # Call the standard DRF super method to save all basic field updates
    #     return super().update(instance, validated_data)