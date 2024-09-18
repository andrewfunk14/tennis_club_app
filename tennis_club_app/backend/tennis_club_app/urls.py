from django.urls import path, include
from django.contrib import admin
from .views import landing_page_view, dashboard_view, custom_logout_view

urlpatterns = [
    # Landing and Dashboard
    path('', landing_page_view, name='landing_page'),  # Make sure to use 'landing_page' here to match the error message

    # Dashboard
    path('dashboard/', dashboard_view, name='dashboard'),

    # Authentication URLs
    path('accounts/logout/', custom_logout_view, name='logout'),
    path('accounts/', include('django.contrib.auth.urls')),
    # Uncomment the following line if using allauth
    # path('accounts/', include('allauth.urls')),

    # App URLs - Ensure each app has 'app_name' defined in their urls.py
    path('api/courts/', include(('courts.urls', 'courts'), namespace='courts')),
    path('api/employees/', include(('employees.urls', 'employees'), namespace='employees')),
    path('api/payments/', include(('payments.urls', 'payments'), namespace='payments')),
    path('api/reports/', include(('reports.urls', 'reports'), namespace='reports')),

    # Admin Site
    path('admin/', admin.site.urls),
]
