# orders/serializers.py
from rest_framework import serializers
from .models import Order, OrderItem
from cart.models import CartItem
from shop.models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'image']

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['product', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()
    total_quantity = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'created_at', 'is_paid', 'products', 'address', 'phone_number', 'total_quantity', 'total_price', 'status']

    def get_products(self, obj):
        return [
            {
                "id": item.product.id,
                "name": item.product.name,
                "image": item.product.image if item.product.image else None,
                "quantity": item.quantity,
                "price": item.product.price,
            }
            for item in obj.items.all()
        ]

    def get_total_quantity(self, obj):
        return sum(item.quantity for item in obj.items.all())

    def get_total_price(self, obj):
        total = sum(item.product.price * item.quantity for item in obj.items.all())
        return f"{total:,.2f} ₸".replace(",", " ")
