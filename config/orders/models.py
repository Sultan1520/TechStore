# orders/models.py
from django.db import models
from django.conf import settings
from shop.models import Product

class Order(models.Model):
    STATUS_CHOICES = [
        ('processing', 'Обрабатывается'),
        ('shipped', 'В пути'),
        ('delivered', 'Доставлен'),
        ('cancelled', 'Отменён'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_paid = models.BooleanField(default=False)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='processing')

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
