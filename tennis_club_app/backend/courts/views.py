from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.utils.dateparse import parse_datetime
from .models import Event

def court_schedule_view(request):
    return render(request, 'court_schedule.html')

def court_schedule_events(request):
    events = list(Event.objects.values('id', 'title', 'start_time', 'end_time'))
    for event in events:
        event['start'] = event.pop('start_time')
        event['end'] = event.pop('end_time')
    return JsonResponse(events, safe=False)

@csrf_exempt
def add_event(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            title = data.get('title')
            start_time = parse_datetime(data.get('start'))
            end_time = parse_datetime(data.get('end'))
            event = Event.objects.create(title=title, start_time=start_time, end_time=end_time)
            return JsonResponse({'status': 'success', 'event_id': event.id}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def edit_event(request, event_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        event = get_object_or_404(Event, id=event_id)
        event.title = data.get('title', event.title)
        event.start_time = parse_datetime(data.get('start', event.start_time.isoformat()))
        event.end_time = parse_datetime(data.get('end', event.end_time.isoformat()))
        event.save()
        return JsonResponse({'status': 'success'}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def delete_event(request, event_id):
    if request.method == 'POST':
        event = get_object_or_404(Event, id=event_id)
        event.delete()
        return JsonResponse({'status': 'success'}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=400)
