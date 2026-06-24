from rest_framework import serializers
from django.db import transaction
from decimal import Decimal

from .models import Sale, SaleItem, Payment
from inventory.models import Inventory, StockMovement


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
        # These are read-only because our backend handles pricing calculations internally
        read_only_fields = ['sale', 'unit_price', 'subtotal']


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
        read_only_fields = ['payment_date', 'sale']


class SaleSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.full_name')
    user_name = serializers.ReadOnlyField(source='user.username')

    items = SaleItemSerializer(many=True)
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
        read_only_fields = ['sale_date', 'total_amount', 'user']

    def validate_items(self, value):
        """Step 6: Enforce that an order must contain at least one item."""
        if not value:
            raise serializers.ValidationError("A sale must contain at least one item.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        """
        Step 3: Overriding create() inside an atomic transaction block.
        If any single database operation fails, the entire transaction rolls back.
        """
        # Step 2: Separate the nested array items data from parent payload variables
        items_data = validated_data.pop('items')
        
        # Step 4: Access the logged-in user context populated via perform_create()
        user = validated_data.get('user')

        # Initialize tracking total counter
        running_total = Decimal('0.00')

        # Create the initial master Sale instance (Total temporarily set to 0)
        sale = Sale.objects.create(
            customer=validated_data.get('customer'),
            user=user,
            total_amount=Decimal('0.00'),
            payment_method=validated_data.get('payment_method'),
            status=validated_data.get('status', 'PENDING')
        )

        # Loop through each individual line item
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']

            # Step 4: Handle database table multi-user locking strategy
            try:
                inventory = Inventory.objects.select_for_update().get(product=product)
            except Inventory.DoesNotExist:
                raise serializers.ValidationError(
                    {"error": f"Inventory record missing for item: {product.name}"}
                )

            # Step 4: Stock validation checkpoint
            if inventory.quantity < quantity:
                raise serializers.ValidationError(
                    {"error": f"Insufficient stock for {product.name}. Remaining: {inventory.quantity}"}
                )

            # Calculate item financial statistics natively
            unit_price = product.selling_price
            subtotal = unit_price * quantity
            running_total += subtotal

            # Step 5: Save child line components
            SaleItem.objects.create(
                sale=sale,
                product=product,
                quantity=quantity,
                unit_price=unit_price,
                subtotal=subtotal
            )

            # Step 5: Reduce stock level metrics
            inventory.quantity -= quantity
            inventory.save()

            # Step 5: Log an audit entry tracking stock reduction
            StockMovement.objects.create(
                product=product,
                movement_type='OUT',
                quantity=quantity,
                user=user
            )

        # Finalize structural records
        sale.total_amount = running_total
        
        # Optional Automation: Automatically issue Payment entry if marked as PAID
        if sale.status == 'PAID':
            Payment.objects.create(
                sale=sale,
                amount=running_total,
                payment_method=sale.payment_method
            )
            
        sale.save()
        return sale