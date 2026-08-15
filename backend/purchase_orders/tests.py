from datetime import date, timedelta

from django.test import TestCase

from products.models import Category, Product, Supplier
from purchase_orders.serializers import PurchaseOrderSerializer


class PurchaseOrderSerializerTests(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name='Office Supplies')
        self.supplier = Supplier.objects.create(company_name='Acme Supply')
        self.product = Product.objects.create(
            category=self.category,
            supplier=self.supplier,
            name='Notebook',
            sku='NB-001',
            cost_price='10.00',
            selling_price='15.00',
        )

    def test_expected_delivery_cannot_be_in_the_past(self):
        serializer = PurchaseOrderSerializer(
            data={
                'supplier': self.supplier.id,
                'expected_delivery': (date.today() - timedelta(days=1)).isoformat(),
                'items': [
                    {
                        'product': self.product.id,
                        'quantity': 2,
                        'cost_price': '10.00',
                    }
                ],
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn('expected_delivery', serializer.errors)
        self.assertIn('past', str(serializer.errors['expected_delivery']))
