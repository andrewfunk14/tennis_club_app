# models.py
from django.db import models

class Event(models.Model):
    title = models.CharField(max_length=255)
    start = models.DateTimeField()
    end = models.DateTimeField()

    def __str__(self):
        return self.title
