from django.urls import path
from . import views

urlpatterns = [
    path('',views.dashboard,name="dashboard"),
    path('stock_in/',views.stock_in,name="stock_in"),
    path('dispense/',views.dispense,name="dispense"),
    path('reports/',views.reports,name="reports"),
    path('inventory/',views.inventory,name="inventory"),

    #  category ajax url
    path('add_category/',views.add_category,name="add_category"),
    path('delete_category/',views.delete_category,name="delete_category"),
    path('edit_category/',views.edit_category,name="edit_category"),

    #  supplier ajax url
    path('add_supplier/',views.add_supplier,name="add_supplier"),
    path('delete_supplier/',views.delete_supplier,name="delete_supplier"),
    path('edit_supplier/',views.edit_supplier,name="edit_supplier"),


    path('add_medichine/',views.add_medichine,name="add_medichine"),
]
