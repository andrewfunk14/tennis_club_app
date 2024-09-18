# models.py
from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

# Define choices for event types
EVENT_TYPE_CHOICES = [
    ('group', 'Group Lesson'),
    ('private', 'Private Lesson'),
    ('camp', 'Camp'),
    ('tournament', 'Tournament'),
    ('social', 'Social'),
    ('Matchplay', 'Matchplay'),
    ('other', 'Other'),
    # Add more event types as needed
]

class Event(models.Model):
    title = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    event_type = models.CharField(max_length=50, choices=EVENT_TYPE_CHOICES)
    start = models.DateTimeField()
    end = models.DateTimeField()
    location = models.CharField(max_length=255, null=True, blank=True)

    def clean(self):
        if self.start is None or self.end is None:
            raise ValidationError('Start and end times cannot be None.')
        if self.end <= self.start:
            raise ValidationError('End time must be after start time.')

    def __str__(self):
        return f"{self.title} ({self.event_type}) on {self.start.strftime('%Y-%m-%d %H:%M')}"

    class Meta:
        ordering = ['start']
