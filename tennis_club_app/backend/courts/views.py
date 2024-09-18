# views.py
from django.shortcuts import render
from django.views.decorators.http import require_POST, require_http_methods
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
import json
from django.http import JsonResponse
from .models import Event
from dateutil import parser  # Ensure you have python-dateutil installed
from django.core.exceptions import ValidationError


@login_required
def court_schedule_view(request):
    return render(request, 'court_schedule.html')


@require_http_methods(["GET"])
@login_required
def court_schedule_events(request):
    start_str = request.GET.get('start')
    end_str = request.GET.get('end')

    if start_str and end_str:
        try:
            start = parser.isoparse(start_str)
            end = parser.isoparse(end_str)
        except (ValueError, TypeError) as e:
            return JsonResponse({'status': 'error', 'message': f'Invalid datetime format: {e}'}, status=400)

        # Filter events by the current user
        events = Event.objects.filter(
            user=request.user,
            start__gte=start,
            end__lte=end
        )
    else:
        return JsonResponse({'status': 'error', 'message': 'Start and end parameters are required.'}, status=400)

    events_list = [
        {
            'id': event.id,
            'title': event.title,
            'start': event.start.isoformat(),
            'end': event.end.isoformat(),
            'eventType': event.event_type,
            'userId': event.user.id,
        } for event in events if event.start and event.end
    ]
    return JsonResponse(events_list, safe=False)


@require_POST
@login_required
def add_event(request):
    if request.content_type != 'application/json':
        return JsonResponse({'status': 'error', 'message': 'Invalid Content-Type. Expected application/json.'}, status=400)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON payload.'}, status=400)

    title = data.get('title')
    event_type = data.get('event_type')
    start_str = data.get('start')
    end_str = data.get('end')

    if not title or not start_str or not end_str or not event_type:
        return JsonResponse({'status': 'error', 'message': 'Missing required fields: title, event_type, start, end.'}, status=400)

    try:
        start = parser.isoparse(start_str)
        end = parser.isoparse(end_str)
    except (ValueError, TypeError):
        return JsonResponse({'status': 'error', 'message': 'Invalid date format.'}, status=400)

    event = Event(
        title=title,
        event_type=event_type,
        start=start,
        end=end,
        user=request.user  # Associate the event with the current user
    )

    try:
        event.full_clean()  # Validates the model fields
        event.save()
        return JsonResponse({'status': 'success', 'event_id': event.id}, status=201)
    except ValidationError as e:
        return JsonResponse({'status': 'error', 'message': e.message_dict}, status=400)


@require_http_methods(["PATCH"])
@login_required
def edit_event(request, event_id):
    if request.content_type != 'application/json':
        return JsonResponse({'status': 'error', 'message': 'Invalid Content-Type. Expected application/json.'}, status=400)

    try:
        # Ensure that the event belongs to the current user
        event = Event.objects.get(id=event_id, user=request.user)
    except Event.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Event not found or access denied.'}, status=404)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON payload.'}, status=400)

    title = data.get('title', event.title)
    event_type = data.get('event_type', event.event_type)
    start_str = data.get('start')
    end_str = data.get('end')

    try:
        start = parser.isoparse(start_str) if start_str else event.start
        end = parser.isoparse(end_str) if end_str else event.end
    except (ValueError, TypeError):
        return JsonResponse({'status': 'error', 'message': 'Invalid date format.'}, status=400)

    event.title = title
    event.event_type = event_type
    event.start = start
    event.end = end

    try:
        event.full_clean()
        event.save()
        return JsonResponse({'status': 'success'}, status=200)
    except ValidationError as e:
        return JsonResponse({'status': 'error', 'message': e.message_dict}, status=400)


@require_http_methods(["DELETE"])
@login_required
def delete_event(request, event_id):
    try:
        # Ensure that the event belongs to the current user
        event = Event.objects.get(id=event_id, user=request.user)
        event.delete()
        return JsonResponse({'status': 'success'}, status=200)
    except Event.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Event not found or access denied.'}, status=404)
