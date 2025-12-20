from django.urls import path
from . import views

urlpatterns = [
    path('',views.dashboard,name="dashboard"),
    path('stock_in/',views.stock_in,name="stock_in"),
    path('dispense/',views.dispense,name="dispense"),
    path('reports/',views.reports,name="reports"),
    path('inventory/',views.inventory,name="inventory"),
]
