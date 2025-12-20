from django.contrib import admin
from .models import Category,Supplier,Medicine,Batch,Transaction

admin.site.register(Category)
admin.site.register(Supplier)
admin.site.register(Medicine)
admin.site.register(Batch)
admin.site.register(Transaction)