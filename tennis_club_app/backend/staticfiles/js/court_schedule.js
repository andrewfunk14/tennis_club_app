/* global FullCalendar */
/* global $ */

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var modal = document.getElementById("addEventModal");
    var span = document.getElementsByClassName("close")[0];
    var editingEventId = null;  // Store the ID of the event being edited

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        timeZone: 'local',
        events: '/schedule/',  // Fetch events from your endpoint

        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay,listWeek'
        },

        selectable: true,
        select: function(info) {
            // Open modal when a day is selected
            document.getElementById("event-start-date").value = info.startStr.split('T')[0];
            document.getElementById("event-end-date").value = info.endStr.split('T')[0];
            editingEventId = null;
            document.getElementById('deleteEventBtn').style.display = 'none';  // Hide delete button for new events
            modal.style.display = "flex";  // Show modal
        },

        editable: true,
        eventClick: function(info) {
            // Edit existing event
            editingEventId = info.event.id;
            document.getElementById("event-title").value = info.event.title;
            document.getElementById("event-start-date").value = info.event.start.toISOString().split('T')[0];
            document.getElementById("event-end-date").value = info.event.end ? info.event.end.toISOString().split('T')[0] : info.event.start.toISOString().split('T')[0];
            document.getElementById('deleteEventBtn').style.display = 'inline-block';  // Show delete button for editing
            modal.style.display = "flex";  // Show modal
        },

        eventDrop: function(info) {
            // Drag-and-drop event update
            updateEvent(info.event);
        },

        eventResize: function(info) {
            // Resize event update
            updateEvent(info.event);
        }
    });

    calendar.render();

    // Close modal functionality
    span.onclick = function() {
        modal.style.display = "none";  // Close modal
        editingEventId = null;
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";  // Close modal if clicked outside
            editingEventId = null;
        }
    }

    // Handle form submission for adding or editing events
    $('#addEventForm').submit(function(event) {
        event.preventDefault();

        var title = $('#event-title').val();
        var startDate = $('#event-start-date').val();
        var startHour = $('#event-start-time').val();
        var endDate = $('#event-end-date').val();
        var endHour = $('#event-end-time').val();

        var eventData = {
            title: title,
            start: startDate + 'T' + startHour,
            end: endDate + 'T' + endHour
        };

        var url = editingEventId ? '/api/courts/events/edit/' + editingEventId + '/' : '/api/courts/events/add/';
        
        $.ajax({
            url: url,
            method: 'POST',
            data: eventData,
            success: function() {
                calendar.refetchEvents();  // Refresh the events on the calendar
                modal.style.display = "none";  // Close the modal
                editingEventId = null;  // Reset the event ID
            },
            error: function(response) {
                alert('There was an error saving the event.');
            }
        });
    });

    // Delete event
    $('#deleteEventBtn').click(function() {
        if (editingEventId && confirm('Are you sure you want to delete this event?')) {
            $.ajax({
                url: '/api/courts/events/delete/' + editingEventId + '/',
                method: 'POST',
                success: function() {
                    calendar.refetchEvents();  // Refresh the events on the calendar
                    modal.style.display = "none";  // Close the modal
                    editingEventId = null;  // Reset the event ID
                },
                error: function(response) {
                    alert('There was an error deleting the event.');
                }
            });
        }
    });

    // Update event function
    function updateEvent(event) {
        $.ajax({
            url: '/api/courts/events/edit/' + event.id + '/',
            method: 'POST',
            data: {
                title: event.title,
                start: event.start.toISOString(),
                end: event.end ? event.end.toISOString() : null
            },
            success: function() {
                calendar.refetchEvents();
            },
            error: function(response) {
                alert('There was an error updating the event.');
            }
        });
    }
});
