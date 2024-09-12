from django.urls import path
from . import views

urlpatterns = [
    path('generate/', views.report_generate_view, name='report-generate'),
    path('view/', views.report_view, name='report-view'),
]
