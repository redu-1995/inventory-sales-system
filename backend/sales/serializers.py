from rest_framework import serializers
from django.db import transaction
from decimal import Decimal

from .models import Sale, SaleItem, Payment
from inventory.models import Inventory, StockMovement


class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = SaleItem
        fields = ['id', 'sale', 'product', 'product_name', 'quantity', 'unit_price', 'subtotal']
        read_only_fields = ['sale', 'unit_price', 'subtotal']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'sale', 'amount', 'payment_method', 'payment_date']
        read_only_fields = ['payment_date']

    @transaction.atomic
    def create(self, validated_data):
        payment = super().create(validated_data)
        sale = payment.sale

        total_paid = sum(p.amount for p in sale.payments.all())
        
        if total_paid >= sale.total_amount:
            sale.status = 'PAID'
        elif total_paid > Decimal('0.00'):
            sale.status = 'PARTIAL'
        else:
            sale.status = 'UNPAID'
            
        sale.save()
        return payment


class SaleSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.full_name')
    user_name = serializers.ReadOnlyField(source='user.username')

    items = SaleItemSerializer(many=True)
    payments = PaymentSerializer(many=True, read_only=True)

    # Optional explicit fields to handle frontend overrides safely
    sale_date = serializers.DateTimeField(required=False)
    tax_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, write_only=True)
    discount_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, write_only=True)

    class Meta:
        model = Sale
        fields = [
            'id', 'customer', 'customer_name', 'user', 'user_name',
            'tax_amount', 'discount_amount', 'total_amount', 
            'payment_method', 'status', 'sale_date', 'items', 'payments',
        ]
        read_only_fields = ['user']

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("A sale must contain at least one item.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Safely extract extra calculation values sent from frontend
        tax_amount = validated_data.pop('tax_amount', Decimal('0.00'))
        discount_amount = validated_data.pop('discount_amount', Decimal('0.00'))
        sale_date = validated_data.get('sale_date', None)

        # Get request user safely
        request = self.context.get('request')
        user = request.user if request and hasattr(request, 'user') else None

        # 1. Create Sale Instance
        sale_kwargs = {
            'customer': validated_data.get('customer'),
            'user': user,
            'payment_method': validated_data.get('payment_method'),
            'status': validated_data.get('status', 'UNPAID'),
            'total_amount': Decimal('0.00'),
        }

        # Check if tax/discount exist as concrete attributes on your Sale model
        if hasattr(Sale, 'tax_amount'):
            sale_kwargs['tax_amount'] = tax_amount
        if hasattr(Sale, 'discount_amount'):
            sale_kwargs['discount_amount'] = discount_amount
        if sale_date:
            sale_kwargs['sale_date'] = sale_date

        sale = Sale.objects.create(**sale_kwargs)

        running_subtotal = Decimal('0.00')

        # 2. Process Items & Update Inventory
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']

            try:
                inventory = Inventory.objects.select_for_update().get(product=product)
            except Inventory.DoesNotExist:
                raise serializers.ValidationError({"error": f"Inventory missing for {product.name}"})

            if inventory.quantity < quantity:
                raise serializers.ValidationError({"error": f"Insufficient stock for {product.name}. Stock: {inventory.quantity}"})

            unit_price = item_data.get('unit_price') or product.selling_price
            subtotal = unit_price * quantity
            running_subtotal += subtotal

            SaleItem.objects.create(
                sale=sale,
                product=product,
                quantity=quantity,
                unit_price=unit_price,
                subtotal=subtotal
            )

            # Deduct inventory & record movement
            inventory.quantity -= quantity
            inventory.save()

            StockMovement.objects.create(
                product=product, 
                movement_type='OUT', 
                quantity=quantity, 
                user=user
            )

        # 3. Final Total Calculation: Subtotal + Tax - Discount
        calculated_total = max(Decimal('0.00'), (running_subtotal + tax_amount) - discount_amount)
        sale.total_amount = calculated_total

        # 4. Handle Immediate Payment record if marked PAID
        if sale.status == 'PAID':
            Payment.objects.create(
                sale=sale, 
                amount=calculated_total, 
                payment_method=sale.payment_method
            )

        sale.save()
        return sale