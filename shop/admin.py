from django.contrib import admin
from .models import Product, Category, Tag, KeyFeature, Specification
from django.utils.html import format_html

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'preview')
    filter_horizontal = ('tags',)

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="60" height="60" style="object-fit:cover;" />', obj.image)
        return "-"
    preview.short_description = "Изображение"

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', )

class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'color')

class KeyFeatureAdmin(admin.ModelAdmin):
    list_display = ('product', 'text')

class SpecificationAdmin(admin.ModelAdmin):
    list_display = ('product', 'name', 'value')

admin.site.register(Product, ProductAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(KeyFeature, KeyFeatureAdmin)
admin.site.register(Specification, SpecificationAdmin)



