from decimal import Decimal

from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate

from customers.models import Customer
from products.models import Category, Product, Supplier
from reports.views import ExportViewSet
from sales.models import Payment, Sale, SaleItem
from users.models import User


class SalesExportReportTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='cashier', password='password123')
        self.customer = Customer.objects.create(full_name='Abebe Bekele', phone='0911223344')
        self.category = Category.objects.create(name='Electronics')
        self.supplier = Supplier.objects.create(company_name='Tech Supply')
        self.product = Product.objects.create(
            category=self.category,
            supplier=self.supplier,
            name='Laptop',
            sku='LAP-001',
            cost_price='500.00',
            selling_price='700.00',
        )

    def test_sales_export_uses_sale_summary_row(self):
        sale = Sale.objects.create(
            invoice_number='INV-001',
            customer=self.customer,
            user=self.user,
            payment_method='Cash',
            status='PARTIAL',
            tax_amount=Decimal('50.00'),
            discount_amount=Decimal('25.00'),
            total_amount=Decimal('575.00'),
        )
        SaleItem.objects.create(
            sale=sale,
            product=self.product,
            quantity=2,
            unit_price=Decimal('275.00'),
            subtotal=Decimal('550.00'),
        )
        Payment.objects.create(
            sale=sale,
            amount=Decimal('300.00'),
            payment_method='Cash',
        )

        factory = APIRequestFactory()
        request = factory.get('/reports/export/sales/', {'file_format': 'csv'})
        force_authenticate(request, user=self.user)

        response = ExportViewSet.as_view({'get': 'sales'})(request)

        self.assertEqual(response.status_code, 200)
        content = response.content.decode('utf-8')
        self.assertIn('Invoice Number', content)
        self.assertIn('Subtotal', content)
        self.assertIn('Amount Paid', content)
        self.assertIn('Balance Due', content)
        self.assertIn('INV-001', content)
        self.assertIn('Abebe Bekele', content)
        self.assertIn('PARTIAL', content)
