from rest_framework import serializers
from .models import Category, Supplier, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "description",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = [
            "id",
            "company_name",
            "contact_person",
            "phone",
            "email",
            "address",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source="category.name")
    supplier_name = serializers.ReadOnlyField(source="supplier.company_name")

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "category_name",
            "supplier",
            "supplier_name",
            "name",
            "sku",
            "barcode",
            "description",
            "cost_price",
            "selling_price",
            "image",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]