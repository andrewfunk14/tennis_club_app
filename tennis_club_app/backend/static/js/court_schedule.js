document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var modal = document.getElementById("eventModal");
    var span = document.getElementsByClassName("close")[0];
    var form = document.getElementById("eventForm");
    var deleteBtn = document.getElementById("deleteEventBtn");
    var currentEvent;

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        editable: true,
        events: '/api/schedule/',
        select: function(info) {
            openModal('Add Event', info.startStr, info.endStr);
        },
        eventClick: function(info) {
            currentEvent = info.event;
            openModal('Edit Event', info.event.startStr, info.event.endStr, info.event.title);
        }
    });

    calendar.render();

    function openModal(title, start, end, eventTitle = '') {
        document.getElementById("modal-title").textContent = title;
        document.getElementById("event-title").value = eventTitle;
        document.getElementById("event-start-date").value = start.split('T')[0];
        document.getElementById("event-start-time").value = start.split('T')[1] || '00:00';
        document.getElementById("event-end-date").value = end.split('T')[0];
        document.getElementById("event-end-time").value = end.split('T')[1] || '00:00';
        deleteBtn.style.display = eventTitle ? "block" : "none";
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    form.onsubmit = function(e) {
        e.preventDefault();
        var eventData = {
            title: document.getElementById("event-title").value,
            start: document.getElementById("event-start-date").value + 'T' + document.getElementById("event-start-time").value,
            end: document.getElementById("event-end-date").value + 'T' + document.getElementById("event-end-time").value
        };

        if (currentEvent) {
            // Update existing event
            fetch(`/api/events/edit/${currentEvent.id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(eventData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    currentEvent.remove();
                    calendar.addEvent(eventData);
                    modal.style.display = "none";
                }
            });
        } else {
            // Add new event
            fetch('/api/events/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(eventData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    calendar.addEvent(eventData);
                    modal.style.display = "none";
                }
            });
        }
    }

    deleteBtn.onclick = function() {
        if (currentEvent) {
            fetch(`/api/events/delete/${currentEvent.id}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    currentEvent.remove();
                    modal.style.display = "none";
                }
            });
        }
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});