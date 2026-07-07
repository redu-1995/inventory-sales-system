from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from products.models import Category, Product, Supplier
from users.models import User
from .models import Inventory


class InventorySummaryEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.client.force_authenticate(user=self.user)

        category = Category.objects.create(name="Electronics")
        supplier = Supplier.objects.create(company_name="Acme Supply")

        product_in_stock = Product.objects.create(
            category=category,
            supplier=supplier,
            name="Keyboard",
            sku="KB-001",
            cost_price=100.00,
            selling_price=150.00,
        )
        product_out_of_stock = Product.objects.create(
            category=category,
            supplier=supplier,
            name="Mouse",
            sku="MS-001",
            cost_price=50.00,
            selling_price=80.00,
        )

        Inventory.objects.create(product=product_in_stock, quantity=5, reorder_level=10)
        Inventory.objects.create(product=product_out_of_stock, quantity=0, reorder_level=5)

    def test_summary_endpoint_returns_aggregated_metrics(self):
        response = self.client.get(reverse('inventory-list'), {'summary': 'true'})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['total_stock_units'], 5)
        self.assertEqual(response.json()['low_stock'], 1)
        self.assertEqual(response.json()['out_of_stock'], 1)
        self.assertEqual(response.json()['inventory_value'], 500.0)

    def test_inventory_list_filters_by_category_and_status(self):
        response = self.client.get(reverse('inventory-list'), {'category': 'Electronics', 'status': 'LOW_STOCK'})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]['category_name'], 'Electronics')
        self.assertEqual(response.json()[0]['quantity'], 5)
