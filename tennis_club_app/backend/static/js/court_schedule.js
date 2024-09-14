// court_schedule.js
document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const modal = document.getElementById('eventModal');
    const form = document.getElementById('eventForm');
    const deleteBtn = document.getElementById('deleteEventBtn');
    const closeModalBtn = modal.querySelector('.close');
    let currentEvent = null;

    // Populate time options on page load
    populateTimeOptions('start');
    populateTimeOptions('end');

    // Initialize FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        timeZone: 'local', // Use 'local' to display times in the user's local time zone
        headerToolbar: {
            left: 'today prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        selectable: true,
        editable: true,
        events: '/api/courts/schedule/', // Fetch events from the server
        select: function (info) {
            currentEvent = null;
            openModal('Add Booking', info.startStr, info.endStr);
        },
        eventClick: function (info) {
            currentEvent = info.event;
            openModal('Edit Booking', info.event.startStr, info.event.endStr, info.event.title);
        }
    });

    calendar.render();

    // Function to open the modal
    function openModal(title, start, end, eventTitle = '') {
        document.getElementById("modal-title").textContent = title;
        document.getElementById("event-title").value = eventTitle;

        // Convert the UTC times to local times
        const startDateTime = new Date(start);
        const endDateTime = new Date(end);

        // Set the date fields using the local date
        document.getElementById("event-start-date").value = startDateTime.toLocaleDateString('en-CA'); // 'en-CA' ensures YYYY-MM-DD format
        document.getElementById("event-end-date").value = endDateTime.toLocaleDateString('en-CA');

        // Populate the time selectors with local time values
        setTimeSelectors('start', startDateTime);
        setTimeSelectors('end', endDateTime);

        deleteBtn.style.display = currentEvent ? "block" : "none"; // Show delete button only for editing
        modal.style.display = "block";
    }

    // Modify the setTimeSelectors function to take a Date object and convert it to local time
    function setTimeSelectors(prefix, dateObj) {
        const hours24 = dateObj.getHours(); // Use local hours
        const minutes = dateObj.getMinutes(); // Use local minutes
        const ampm = hours24 >= 12 ? 'PM' : 'AM';
        const hours12 = hours24 % 12 || 12; // Convert 24-hour to 12-hour format

        document.getElementById(`${prefix}-hour`).value = hours12;
        document.getElementById(`${prefix}-minute`).value = String(minutes).padStart(2, '0');
        document.getElementById(`${prefix}-ampm`).value = ampm;
    }

    // Close modal when clicking the "X" or outside the modal
    closeModalBtn.onclick = closeModal;
    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    }

    // Function to close the modal
    function closeModal() {
        modal.style.display = "none";
    }

    // Form submission for adding/editing events
    form.onsubmit = function (e) {
        e.preventDefault();
        const eventTitle = document.getElementById('event-title').value;
        const eventStartDate = document.getElementById('event-start-date').value;
        const eventEndDate = document.getElementById('event-end-date').value;

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
        const localStartDateTimeString = `${eventStartDate}T${eventStartTime}:00`;
        const localEndDateTimeString = `${eventEndDate}T${eventEndTime}:00`;

        // Create local Date objects
        const localStartDateTime = new Date(localStartDateTimeString);
        const localEndDateTime = new Date(localEndDateTimeString);

        // Convert local Date objects to UTC ISO strings
        const startDateTimeUTC = localStartDateTime.toISOString(); // Automatically converted to UTC
        const endDateTimeUTC = localEndDateTime.toISOString(); // Automatically converted to UTC

        const eventData = {
            title: eventTitle,
            start: startDateTimeUTC, // Use UTC datetime
            end: endDateTimeUTC // Use UTC datetime
        };

        const url = currentEvent ? `/api/courts/edit/${currentEvent.id}/` : '/api/courts/add/';
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
            body: JSON.stringify(eventData)
        }).then(response => response.json()).then(data => {
            if (data.status === 'success') {
                if (currentEvent) {
                    currentEvent.remove();
                    calendar.addEvent({ ...eventData, id: currentEvent.id });
                } else {
                    calendar.addEvent({ ...eventData, id: data.event_id });
                }
                closeModal();
            }
        });
    }

    // Delete event
    deleteBtn.onclick = function () {
        if (currentEvent) {
            fetch(`/api/courts/delete/${currentEvent.id}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken') // Include the CSRF token in headers
                }
            }).then(response => response.json()).then(data => {
                if (data.status === 'success') {
                    currentEvent.remove();
                    closeModal();
                }
            });
        }
    }

    // Helper Functions
    function populateTimeOptions(prefix) {
        const hourSelect = document.getElementById(`${prefix}-hour`);
        const minuteSelect = document.getElementById(`${prefix}-minute`);
        const ampmSelect = document.getElementById(`${prefix}-ampm`);

        // Populate hours
        for (let i = 1; i <= 12; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.text = i;
            hourSelect.appendChild(option);
        }

        // Populate minutes
        for (let i = 0; i < 60; i += 15) {
            const option = document.createElement('option');
            option.value = String(i).padStart(2, '0');
            option.text = String(i).padStart(2, '0');
            minuteSelect.appendChild(option);
        }

        // Set default minute value to "00"
        minuteSelect.value = "00";

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

    function convert24HourTo12Hour(hour) {
        hour = parseInt(hour);
        return hour % 12 === 0 ? 12 : hour % 12;
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
