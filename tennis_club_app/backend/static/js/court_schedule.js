// court_schedule.js
document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const modal = document.getElementById('eventModal');
    const form = document.getElementById('eventForm');
    const deleteBtn = document.getElementById('deleteEventBtn');
    const closeModalBtn = modal.querySelector('.close');
    let currentEvent = null;
    let startDatePicker;
    let endDatePicker;

    // Define the base URL to match the backend
    const EVENTS_BASE_URL = '/api/courts/events/';

    // Define a mapping of event types to specific colors
    const eventTypeColors = {
        'group': '#007bff', // Default Bootstrap Blue
        'private': '#2e8b57', // Green
        'camp': '#EDC948', // Yellow
        'tournament': '#76B7B2', // Teal
        'social': '#F28E2B', // Orange
        'matchplay': '#E15759', // Red
        'other': '#B07AA1'  // Purple
    };

    // Populate time options on page load
    populateTimeOptions('start');
    populateTimeOptions('end');

    // Initialize FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        timeZone: 'local',
        headerToolbar: {
            left: 'today prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        selectable: true,
        editable: true,
        events: EVENTS_BASE_URL,

        eventDidMount: function (info) {
            // Use the eventTypeColors mapping to set the color
            const eventType = info.event.extendedProps.eventType;
            const color = eventTypeColors[eventType] || '#888'; // Default color if event type not found
            info.el.style.backgroundColor = color;
            info.el.style.borderColor = color;
        },

        select: function (info) {
            currentEvent = null;
            openModal('Add Booking', info.start, info.end);
        },
        eventClick: function (info) {
            currentEvent = info.event;
            openModal(
                'Edit Booking',
                info.event.start,
                info.event.end,
                info.event.title,
                info.event.extendedProps.eventType // Pass eventType when editing
            );
        },
        eventDrop: function (info) {
            // Handle event drag-and-drop
            updateEventData(info.event);
        },
        eventResize: function (info) {
            // Handle event resize
            updateEventData(info.event);
        }
    });


    calendar.render();


    // Initialize Flatpickr on the date input fields
    startDatePicker = flatpickr("#event-start-date", {
        dateFormat: "l, F j, Y", // Format: "Tuesday, September 17, 2024"
    });

    endDatePicker = flatpickr("#event-end-date", {
        dateFormat: "l, F j, Y",
    });

    // Function to open the modal
    function openModal(title, start = null, end = null, eventTitle = '', eventType = '') {
        document.getElementById("modal-title").textContent = title;
        document.getElementById("event-title").value = eventTitle;

        // Set the event type if provided
        const eventTypeSelect = document.getElementById('event-type');
        if (eventTypeSelect) {
            eventTypeSelect.value = eventType || '';
        }

        let startDateTime, endDateTime;

        if (start && end) {
            // Use provided start and end times
            startDateTime = new Date(start);
            endDateTime = new Date(end);

            // Check if times are all-day (midnight)
            if (startDateTime.getHours() === 0 && startDateTime.getMinutes() === 0 && endDateTime.getHours() === 0 && endDateTime.getMinutes() === 0) {
                // Adjust start time
                const now = new Date();
                if (startDateTime.toDateString() === now.toDateString()) {
                    // If selected date is today, set start time to now rounded up to next 15 minutes
                    const minutes = 15 * Math.ceil(now.getMinutes() / 15);
                    startDateTime.setHours(now.getHours(), minutes, 0, 0);
                } else {
                    // Set start time to 9 AM on the selected date
                    startDateTime.setHours(9, 0, 0, 0);
                }
                // Set end time to one hour after start time
                endDateTime = new Date(startDateTime.getTime() + (60 * 60 * 1000));
            }
        } else {
            // Set default start time to now, rounded up to the next 15 minutes
            startDateTime = new Date();
            const minutes = 15 * Math.ceil(startDateTime.getMinutes() / 15);
            startDateTime.setMinutes(minutes);
            startDateTime.setSeconds(0);

            // Set default end time to one hour after start time
            endDateTime = new Date(startDateTime.getTime() + (60 * 60 * 1000));
        }

        // Set the date fields using Flatpickr
        startDatePicker.setDate(startDateTime, true);
        endDatePicker.setDate(endDateTime, true);

        // Populate the time selectors with local time values
        setTimeSelectors('start', startDateTime);
        setTimeSelectors('end', endDateTime);

        deleteBtn.style.display = currentEvent ? "inline-block" : "none"; // Show delete button only when editing
        modal.style.display = "block";
    }

    function setTimeSelectors(prefix, dateObj) {
        const hours24 = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        const ampm = hours24 >= 12 ? 'PM' : 'AM';
        document.getElementById(`${prefix}-hour`).value = hours24 % 12 || 12;
        document.getElementById(`${prefix}-minute`).value = String(minutes).padStart(2, '0');
        document.getElementById(`${prefix}-ampm`).value = ampm;
    }

    // Close modal when clicking the "X" or outside the modal
    closeModalBtn.onclick = closeModal;
    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    };

    function closeModal() {
        modal.style.display = "none";
        form.reset();
        startDatePicker.clear();
        endDatePicker.clear();
    }

    // Form submission for adding/editing events
    form.onsubmit = function (e) {
        e.preventDefault();
        const eventTitle = document.getElementById('event-title').value.trim();
        const eventType = document.getElementById('event-type').value;

        if (!eventTitle) {
            alert('Please enter a booking title.');
            return;
        }

        if (!eventType) {
            alert('Please select an event type.');
            return;
        }

        const startDate = startDatePicker.selectedDates[0];
        const endDate = endDatePicker.selectedDates[0];

        if (!startDate || !endDate) {
            alert('Please select start and end dates.');
            return;
        }

        const eventStartTime = getTimeIn24HourFormat(
            document.getElementById('start-hour').value,
            document.getElementById('start-minute').value,
            document.getElementById('start-ampm').value
        );

        const eventEndTime = getTimeIn24HourFormat(
            document.getElementById('end-hour').value,
            document.getElementById('end-minute').value,
            document.getElementById('end-ampm').value
        );

        // Combine date and time to create a local datetime string
        const localStartDateTimeString = `${formatDate(startDate)}T${eventStartTime}:00`;
        const localEndDateTimeString = `${formatDate(endDate)}T${eventEndTime}:00`;

        // Create local Date objects
        const localStartDateTime = new Date(localStartDateTimeString);
        const localEndDateTime = new Date(localEndDateTimeString);

        // Validate that end time is after start time
        if (localEndDateTime <= localStartDateTime) {
            alert('End time must be after start time.');
            return;
        }

        // Convert local Date objects to ISO strings
        const startDateTimeISO = localStartDateTime.toISOString();
        const endDateTimeISO = localEndDateTime.toISOString();

        const eventData = {
            title: eventTitle,
            event_type: eventType, // Include event_type in the data sent to the server
            start: startDateTimeISO,
            end: endDateTimeISO
        };

        const url = currentEvent ? `${EVENTS_BASE_URL}edit/${currentEvent.id}/` : `${EVENTS_BASE_URL}add/`;
        const method = currentEvent ? 'PATCH' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(eventData)
        })
            .then(response => response.json().then(data => ({ status: response.status, body: data })))
            .then(result => {
                if (result.status === 201 || result.body.status === 'success') {
                    calendar.refetchEvents();
                    closeModal();
                } else {
                    alert(result.body.message || 'An error occurred while saving the event.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while saving the event.');
            });
    };

    // Delete event
    deleteBtn.onclick = function () {
        if (currentEvent) {
            if (!confirm('Are you sure you want to delete this booking?')) {
                return;
            }
            fetch(`${EVENTS_BASE_URL}delete/${currentEvent.id}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        calendar.refetchEvents();
                        closeModal();
                    } else {
                        return response.json().then(data => {
                            alert(data.message || 'An error occurred while deleting the event.');
                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while deleting the event.');
                });
        }
    };

    // Helper Functions
    function populateTimeOptions(prefix) {
        const hourSelect = document.getElementById(`${prefix}-hour`);
        const minuteSelect = document.getElementById(`${prefix}-minute`);
        const ampmSelect = document.getElementById(`${prefix}-ampm`);

        // Clear existing options if any
        hourSelect.innerHTML = '';
        minuteSelect.innerHTML = '';
        ampmSelect.innerHTML = '';

        // Populate hours (1 to 12)
        for (let i = 1; i <= 12; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.text = i;
            hourSelect.appendChild(option);
        }

        // Populate minutes (00, 15, 30, 45)
        for (let i = 0; i < 60; i += 15) {
            const option = document.createElement('option');
            option.value = String(i).padStart(2, '0');
            option.text = String(i).padStart(2, '0');
            minuteSelect.appendChild(option);
        }

        // Populate AM/PM
        ['AM', 'PM'].forEach(ampm => {
            const option = document.createElement('option');
            option.value = ampm;
            option.text = ampm;
            ampmSelect.appendChild(option);
        });
    }

    function getTimeIn24HourFormat(hour, minute, ampm) {
        hour = parseInt(hour);
        if (ampm === 'PM' && hour !== 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    function formatDate(dateObj) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                const trimmedCookie = cookie.trim();
                if (trimmedCookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(trimmedCookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Update event data after drag-and-drop or resize
    function updateEventData(event) {
        const eventData = {
            title: event.title, // Use the existing title
            event_type: event.extendedProps.eventType, // Include event_type
            start: event.start.toISOString(),
            end: event.end ? event.end.toISOString() : null
        };

        fetch(`${EVENTS_BASE_URL}edit/${event.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(eventData)
        })
            .then(response => response.json().then(data => ({ status: response.status, body: data })))
            .then(result => {
                if (result.body.status !== 'success') {
                    alert(result.body.message || 'An error occurred while updating the event.');
                    calendar.refetchEvents(); // Revert changes on error
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while updating the event.');
                calendar.refetchEvents(); // Revert changes on error
            });
    }
});
