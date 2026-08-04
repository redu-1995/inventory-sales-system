# notifications/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from notifications.models import Notification

# 1 & 2. Low Stock & Out of Stock Alerts
from products.models import Product

@receiver(post_save, sender=Product)
def product_stock_alerts(sender, instance, **kwargs):
    reorder_level = getattr(instance, 'reorder_level', 5)
    
    if instance.quantity == 0:
        Notification.objects.create(
            user=None,
            notification_type='OUT_OF_STOCK',
            title='Out of Stock Alert',
            message=f'{instance.name} is completely out of stock.',
            link=f'/inventory?search={instance.name}'
        )
    elif instance.quantity <= reorder_level:
        Notification.objects.create(
            user=None,
            notification_type='LOW_STOCK',
            title='Low Stock Warning',
            message=f'{instance.name} has only {instance.quantity} units left.',
            link=f'/inventory?search={instance.name}'
        )

# 3. Purchase Order Received
from purchase_orders.models import PurchaseOrder

@receiver(post_save, sender=PurchaseOrder)
def purchase_order_received_alert(sender, instance, **kwargs):
    if instance.status == 'RECEIVED':
        Notification.objects.create(
            user=None,
            notification_type='PURCHASE_ORDER',
            title='Purchase Order Received',
            message=f'PO #{instance.id} has been received and added to inventory.',
            link=f'/purchase-orders?search={instance.id}'
        )

# 4. New Sale Completed
from sales.models import Sale

@receiver(post_save, sender=Sale)
def new_sale_alert(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=None,
            notification_type='SALE',
            title='New Sale Completed',
            message=f'Sale #{instance.id} completed. Total: {instance.total_amount:.2f} ETB',
            link=f'/sales?search={instance.id}'
        )

# 5. Payment Received (Partial or Full)
from sales.models import Payment

@receiver(post_save, sender=Payment)
def payment_received_alert(sender, instance, created, **kwargs):
    if created:
        customer_name = instance.sale.customer.full_name if instance.sale.customer else "Guest"
        Notification.objects.create(
            user=None,
            notification_type='PAYMENT',
            title='Payment Received',
            message=f'{customer_name} paid {instance.amount:.2f} ETB on Sale #{instance.sale.id}.',
            link=f'/sales?search={instance.sale.id}'
        )

# 6. New Customer Added
from customers.models import Customer

@receiver(post_save, sender=Customer)
def new_customer_alert(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=None,
            notification_type='CUSTOMER',
            title='New Customer Added',
            message=f'Customer {instance.full_name} was registered.',
            link=f'/customers?search={instance.full_name}'
        )