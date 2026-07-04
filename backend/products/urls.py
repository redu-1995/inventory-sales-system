from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet,
    SupplierViewSet,
    ProductViewSet,
    ProductExportView,
    ProductImportView,
)

router = DefaultRouter()

router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'suppliers', SupplierViewSet, basename='supplier')
router.register(r'products', ProductViewSet, basename='product')

# Put the custom list FIRST, then append router.urls at the end
urlpatterns = [
    path('products/export/', ProductExportView.as_view(), name='product-export'),
    path('products/import/', ProductImportView.as_view(), name='product-import'),

] + router.urls