from django.urls import path
from . import views

urlpatterns = [
    path('manage/', views.employee_management_view, name='employee-management'),
    path('list/', views.employee_list_view, name='employee-list'),
]
