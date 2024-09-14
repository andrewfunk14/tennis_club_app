# views.py
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
from .models import Event
import json
from django.utils.dateparse import parse_datetime
from django.views.decorators.http import require_POST


def court_schedule_view(request):
    return render(request, 'court_schedule.html')

def court_schedule_events(request):
    events = Event.objects.all()
    events_list = []
    for event in events:
        events_list.append({
            'id': event.id,
            'title': event.title,
            'start': event.start.isoformat(),
            'end': event.end.isoformat(),
        })
    return JsonResponse(events_list, safe=False)


@csrf_protect
@require_POST
def add_event(request):
    data = json.loads(request.body)
    title = data.get('title')
    start = parse_datetime(data.get('start'))
    end = parse_datetime(data.get('end'))

    # Save the event in the database
    event = Event.objects.create(title=title, start=start, end=end)
    return JsonResponse({'status': 'success', 'event_id': event.id})


@csrf_protect
@require_POST
def edit_event(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
        data = json.loads(request.body)
        event.title = data.get('title', event.title)
        event.start = parse_datetime(data.get('start'))
        event.end = parse_datetime(data.get('end'))
        event.save()
        return JsonResponse({'status': 'success'})
    except Event.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Event not found'}, status=404)


@csrf_protect
@require_POST
def delete_event(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
        event.delete()
        return JsonResponse({'status': 'success'})
    except Event.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Event not found'}, status=404)
