from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory, force_authenticate

from inventory.models import Inventory
from users.models import Role
from .models import Category, Product, Supplier
from .views import ProductExportView


class ProductExportViewTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.role = Role.objects.create(name="Manager")
        self.user = get_user_model().objects.create_user(
            username="manager",
            email="manager@example.com",
            password="password123",
            role=self.role,
        )
        self.category = Category.objects.create(name="Electronics")
        self.supplier = Supplier.objects.create(company_name="Tech Supply")
        self.product = Product.objects.create(
            category=self.category,
            supplier=self.supplier,
            name="Wireless Mouse",
            sku="WM-001",
            cost_price="10.00",
            selling_price="20.00",
        )
        Inventory.objects.create(product=self.product, quantity=3, reorder_level=5)

    def test_export_view_returns_excel_for_low_stock(self):
        request = self.factory.get("/products/export/", {"stock_status": "LOW_STOCK"})
        force_authenticate(request, user=self.user)

        response = ProductExportView.as_view()(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response["Content-Type"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        self.assertIn('attachment; filename="export.xlsx"', response["Content-Disposition"])
