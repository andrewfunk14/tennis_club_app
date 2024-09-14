from django.urls import path
from . import views

urlpatterns = [
    # URL to render the calendar page
    path('', views.court_schedule_view, name='court-schedule-page'),  # This renders the calendar when you visit /api/courts/

    # API endpoint to get events (for FullCalendar)
    path('schedule/', views.court_schedule_events, name='court_schedule_events'),

    # API endpoint to add a new event
    path('add/', views.add_event, name='add-court-event'),

    # API endpoint to edit an event
    path('edit/<int:event_id>/', views.edit_event, name='edit-court-event'),

    # API endpoint to delete an event
    path('delete/<int:event_id>/', views.delete_event, name='delete-court-event'),
]

