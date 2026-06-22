# sales/serializers.py
from rest_framework import serializers
from .models import Sale, SaleItem, Payment
from customers.serializers import CustomerSerializer
from users.serializers import UserSerializer

class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = SaleItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'subtotal']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'sale', 'amount_paid', 'payment_method', 'payment_status', 'transaction_date']


class SaleSerializer(serializers.ModelSerializer):
    # Accept a list of nested dictionary objects inside 'items' key
    items = SaleItemSerializer(many=True, read_only=False, required=False)
    
    # Read-only references for populating explicit detail screens in UI
    customer_details = CustomerSerializer(source='customer', read_only=True)
    salesperson_details = UserSerializer(source='salesperson', read_only=True)

    class Meta:
        model = Sale
        fields = [
            'id', 'invoice_number', 'customer', 'customer_details', 
            'salesperson', 'salesperson_details', 'total_amount', 
            'tax', 'discount', 'grand_total', 'status', 'created_at', 'items'
        ]
        read_only_fields = ['invoice_number', 'salesperson', 'grand_total']