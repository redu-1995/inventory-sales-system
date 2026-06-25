from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import Category, Supplier, Product
from .serializers import (
    CategorySerializer,
    SupplierSerializer,
    ProductSerializer,
)


class CategoryViewSet(ModelViewSet):
    """
    Handles CRUD operations for Categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer



class SupplierViewSet(ModelViewSet):
    """
    Handles CRUD operations for Suppliers.
    """
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    


class ProductViewSet(ModelViewSet):
    """
    Handles CRUD operations for Products.
    """
    queryset = Product.objects.select_related(
        "category",
        "supplier"
    ).all()

    serializer_class = ProductSerializer
  