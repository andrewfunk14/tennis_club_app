from django.urls import path
from . import views

urlpatterns = [
    path('process/', views.payment_process_view, name='payment-process'),
    path('history/', views.payment_history_view, name='payment-history'),
]
