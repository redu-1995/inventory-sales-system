# inventory/serializers.py
from rest_framework import serializers
from .models import Inventory
from products.serializers import ProductSerializer

class InventorySerializer(serializers.ModelSerializer):
    # Dynamic field to check if item drops below critical thresholds
    stock_status = serializers.SerializerMethodField()
    # Pull in comprehensive child details if required on certain requests
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = Inventory
        fields = [
            'id', 'product', 'product_details', 'quantity', 
            'minimum_stock_level', 'stock_status', 'last_restocked'
        ]

    def get_stock_status(self, obj):
        if obj.quantity <= 0:
            return "Out of Stock"
        elif obj.quantity <= obj.minimum_stock_level:
            return "Low Stock"
        return "In Stock"