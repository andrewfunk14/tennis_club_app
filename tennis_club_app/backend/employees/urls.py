from django.urls import path
from . import views

app_name = 'employees'  # Add this line

urlpatterns = [
    path('manage/', views.employee_management_view, name='employee-management'),
    path('list/', views.employee_list_view, name='employee-list'),
]
