# core/serializers.py
from rest_framework import serializers

class ProductSearchResultSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    sku = serializers.CharField()
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

class CustomerSearchResultSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    full_name = serializers.CharField()
    email = serializers.EmailField(required=False)

class SaleSearchResultSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    invoice_number = serializers.CharField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

class GlobalSearchResultSerializer(serializers.Serializer):
    products = ProductSearchResultSerializer(many=True)
    customers = CustomerSearchResultSerializer(many=True)
    sales = SaleSearchResultSerializer(many=True)
    purchase_orders = serializers.ListField(child=serializers.DictField(), default=[])