# courts/urls.py
from django.urls import path
from . import views

app_name = 'courts'  # Optional: Set an app namespace

urlpatterns = [
    # URL to render the calendar page
    path('', views.court_schedule_view, name='court_schedule_view'),

    # API endpoint to get events (for FullCalendar)
    path('events/', views.court_schedule_events, name='court_schedule_events'),

    # API endpoint to add a new event
    path('events/add/', views.add_event, name='add_event'),

    # API endpoint to edit an event
    path('events/edit/<int:event_id>/', views.edit_event, name='edit_event'),

    # API endpoint to delete an event
    path('events/delete/<int:event_id>/', views.delete_event, name='delete_event'),
]
