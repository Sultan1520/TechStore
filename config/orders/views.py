# orders/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import CartItem

class OrderViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request):
        user = request.user
        cart_items = CartItem.objects.filter(user=user)
        address = request.data.get('address')
        phone_number = request.data.get('phone_number')

        if not address or not phone_number:
            return Response({'error': 'Укажите адрес и номер телефона'}, status=status.HTTP_400_BAD_REQUEST)

        if not cart_items.exists():
            return Response({'error': 'Корзина пуста'}, status=status.HTTP_400_BAD_REQUEST)

        if not cart_items.exists():
            return Response({'error': 'Корзина пуста'}, status=400)

        order = Order.objects.create(
            user=user,
            address=address,
            phone_number=phone_number
        )

        for item in cart_items:
            order.items.create(product=item.product, quantity=item.quantity)
        cart_items.delete()

        return Response(OrderSerializer(order).data, status=201)

    def list(self, request):
        # Список заказов только для текущего пользователя
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
