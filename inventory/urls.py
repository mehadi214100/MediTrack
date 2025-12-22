from django.urls import path
from . import views

urlpatterns = [
    path('',views.dashboard,name="dashboard"),
    path('stock_in/',views.stock_in,name="stock_in"),
    path('dispense/',views.dispense,name="dispense"),
    path('reports/',views.reports,name="reports"),
    path('inventory/',views.inventory,name="inventory"),
    path('add_category/',views.add_category,name="add_category"),
    path('delete_category/',views.delete_category,name="delete_category"),
    path('edit_category/',views.edit_category,name="edit_category"),
]
