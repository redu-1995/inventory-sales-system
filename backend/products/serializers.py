# products/serializers.py
from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True) # Useful for dashboard cards

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'product_count']


class ProductSerializer(serializers.ModelSerializer):
    # Read-only representation string for your UI table dropdowns/views
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'sku', 'category', 'category_name', 
            'brand', 'purchase_price', 'selling_price', 'image', 
            'description', 'created_at', 'updated_at'
        ]