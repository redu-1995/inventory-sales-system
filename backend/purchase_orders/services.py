from django.db import transaction
from inventory.models import Inventory, StockMovement

@transaction.atomic
def receive_purchase_order(purchase_order, user=None):
    """Processes stock ingestion when a PO is marked RECEIVED."""
    if purchase_order.status == 'RECEIVED':
        raise ValueError("This Purchase Order is already received.")

    for item in purchase_order.items.select_related('product'):
        # 1. Update or create Inventory record
        inventory, _ = Inventory.objects.get_or_create(product=item.product)
        inventory.quantity += item.quantity
        inventory.save()

        # 2. Log Stock Movement
        StockMovement.objects.create(
            product=item.product,
            movement_type='IN',
            quantity=item.quantity,
            user=user
        )

    # 3. Update PO Status
    purchase_order.status = 'RECEIVED'
    purchase_order.save()
    return purchase_order