# orders/admin.py
from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):  # Отображение товаров внутри заказа
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'item_total')

    def item_total(self, obj):
        return f"{obj.product.price * obj.quantity:,.0f} ₸".replace(",", " ")

    item_total.short_description = "Сумма по товару"

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'created_at', 'is_paid', 'total_amount')
    list_editable = ['status']
    list_filter = ('is_paid', 'created_at')
    search_fields = ('user__username',)
    inlines = [OrderItemInline]  # Вложенные товары

    def total_amount(self, obj):
        total = sum(item.product.price * item.quantity for item in obj.items.all())
        return f"{total:,.0f} ₸".replace(",", " ")

    total_amount.short_description = "Общая сумма"
