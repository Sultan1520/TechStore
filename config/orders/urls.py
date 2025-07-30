# orders/urls.py
from django.urls import path
from .views import OrderViewSet

order_create = OrderViewSet.as_view({'post': 'create'})

urlpatterns = [
    path('checkout/', order_create, name='checkout'),
]
