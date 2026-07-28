from decimal import Decimal
from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from django.conf import settings
from customers.models import Customer
from products.models import Product


class Sale(models.Model):
    STATUS_CHOICES = (
        ('PAID', 'Paid'),
        ('PARTIAL', 'Partial'),
        ('UNPAID', 'Unpaid'),
    )
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='sales')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    
    # Optional tax and discount fields with safe defaults
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    payment_method = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='UNPAID')
    sale_date = models.DateTimeField(default=timezone.now)

    @property
    def paid_amount(self):
        """Calculates total amount paid by summing all related Payment records."""
        return sum(payment.amount for payment in self.payments.all())

    @property
    def remaining_amount(self):
        """Calculates remaining balance."""
        return max(Decimal('0.00'), self.total_amount - self.paid_amount)
    def recalculate_total(self):
        """Calculates total_amount by summing all child item subtotals (+ tax - discount)."""
        items_subtotal = sum(item.subtotal for item in self.items.all())
        new_total = (items_subtotal + self.tax_amount) - self.discount_amount
        
        # Prevent negative totals
        self.total_amount = max(Decimal('0.00'), new_total)
        self.save(update_fields=['total_amount'])

    def __str__(self):
        return f"Sale #{self.id} - {self.customer.full_name}"


class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        # 1. Fallback to product selling_price if unit_price isn't passed explicitly
        if self.unit_price is None and self.product:
            self.unit_price = self.product.selling_price

        # 2. Force mathematically accurate subtotal (Quantity * Unit Price)
        self.subtotal = Decimal(str(self.quantity)) * Decimal(str(self.unit_price))
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"


class Payment(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    payment_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment of {self.amount} for Sale #{self.sale.id}"


# ==========================================
# SIGNALS: Keep Sale.total_amount updated
# ==========================================

@receiver([post_save, post_delete], sender=SaleItem)
def update_sale_total_on_item_change(sender, instance, **kwargs):
    """Automatically refreshes the parent Sale total whenever an item is added, saved, or deleted."""
    if instance.sale_id:
        instance.sale.recalculate_total()