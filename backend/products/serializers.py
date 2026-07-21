from rest_framework import serializers
from django.db import transaction
from .models import Category, Supplier, Product
from inventory.models import Inventory


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
    category_name = serializers.CharField(source='category.name', read_only=True)
    supplier_name = serializers.ReadOnlyField(source="supplier.company_name")
    
    # Read & Write mapped fields from Inventory model
    quantity = serializers.IntegerField(
        source="inventory.quantity", 
        required=False, 
        allow_null=True,
        default=0
    )
    reorder_level = serializers.IntegerField(
        source="inventory.reorder_level", 
        required=False, 
        allow_null=True,
        default=10
    )

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
            "quantity",
            "reorder_level",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    @transaction.atomic
    def create(self, validated_data):
        # Extract nested inventory data (populated from quantity & reorder_level)
        inventory_data = validated_data.pop("inventory", {})

        # 1. Create the Product instance first
        product = Product.objects.create(**validated_data)

        # 2. Extract initial values or fallback to defaults set in field definition
        quantity = inventory_data.get("quantity", 0)
        reorder_level = inventory_data.get("reorder_level", 10)

        # 3. Create connected Inventory record
        Inventory.objects.create(
            product=product,
            quantity=quantity,
            reorder_level=reorder_level
        )

        return product

    @transaction.atomic
    def update(self, instance, validated_data):
        # Extract nested inventory data if sent in PATCH/PUT payload
        inventory_data = validated_data.pop("inventory", {})

        # 1. Update Product model fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # 2. Update or Create connected Inventory record
        if inventory_data:
            inventory, _ = Inventory.objects.get_or_create(product=instance)
            
            if "quantity" in inventory_data:
                inventory.quantity = inventory_data["quantity"]
            if "reorder_level" in inventory_data:
                inventory.reorder_level = inventory_data["reorder_level"]
                
            inventory.save()

        return instance