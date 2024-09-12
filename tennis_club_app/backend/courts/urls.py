from django.urls import path
from . import views

urlpatterns = [
    path('', views.court_schedule_view, name='court-schedule-page'),
    path('api/schedule/', views.court_schedule_events, name='court-schedule'),
    path('api/events/add/', views.add_event, name='add-event'),
    path('api/events/edit/<int:event_id>/', views.edit_event, name='edit-event'),
    path('api/events/delete/<int:event_id>/', views.delete_event, name='delete-event'),
]