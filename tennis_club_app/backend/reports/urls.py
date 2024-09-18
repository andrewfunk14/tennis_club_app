from django.urls import path
from . import views

app_name = 'reports'  # Add this line

urlpatterns = [
    path('generate/', views.report_generate_view, name='report-generate'),
    path('view/', views.report_view, name='report-view'),
]
