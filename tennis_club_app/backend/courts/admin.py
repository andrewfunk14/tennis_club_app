# admin.py
from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'event_type', 'user', 'start', 'end')
    list_filter = ('event_type', 'user', 'start')
    search_fields = ('title', 'location', 'user__username')
