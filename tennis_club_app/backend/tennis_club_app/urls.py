from django.urls import path, include
from .views import landing_page_view, dashboard_view, custom_logout_view

urlpatterns = [
    path('', landing_page_view, name='landing-page'),  # Landing page URL
    path('dashboard/', dashboard_view, name='dashboard'),  # Dashboard URL
    path('accounts/logout/', custom_logout_view, name='logout'),  # Use custom logout view
    path('accounts/', include('django.contrib.auth.urls')),  # Other built-in auth URLs
    # path('accounts/', include('allauth.urls')),
    # Other app URLs
    path('api/courts/', include('courts.urls')),
    path('api/employees/', include('employees.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/reports/', include('reports.urls')),
]