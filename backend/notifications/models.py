# notifications/models.py
from django.db import models
from django.conf import settings

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('LOW_STOCK', 'Low Stock Alert'),
        ('OUT_OF_STOCK', 'Out of Stock Alert'),
        ('PURCHASE_ORDER', 'Purchase Order Update'),
        ('SALE', 'New Sale Completed'),
        ('SYSTEM', 'System Notice'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='notifications',
        null=True, 
        blank=True  # Null user means a global notification for all staff/admins
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES, default='SYSTEM')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    link = models.CharField(max_length=255, blank=True, null=True) # Optional URL path (e.g., "/products/42")

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user if self.user else 'Global'}"