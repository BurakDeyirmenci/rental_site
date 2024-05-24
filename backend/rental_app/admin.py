from django.contrib import admin
from .models import *

admin.site.register(ProductModel)
admin.site.register(Brand)
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Rental)