console.log("public/script.js is loaded");

// Check if the code is running in a browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Client-side code

    function fetchStaff() {
        fetch('/staff')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                displayStaff(data);
            })
            .catch(error => console.error('Error fetching staff data:', error));
    }

    function displayStaff(staff) {
        const staffSection = document.getElementById('staff-data');
        staff.forEach(appointment => {
            const div = document.createElement('div');
            div.innerHTML = `<p>Staff ID: ${appointment.staffId}</p>`;
            // Add more details as needed
            staffSection.appendChild(div);
        });
    }

    document.getElementById('staff-form').addEventListener('submit', function (e) {
        e.preventDefault();

        // Gather form data
        const formData = new FormData(e.target);
        const staffData = {
            staffID: formData.get('staffId'), // replace 'staffId' with the actual form field name
            // add more properties as needed
        };

        // Send a POST request to the server
        fetch('/api/add-staff', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(staffData),
        })
            .then(response => response.json())
            .then(data => {
                // Optionally update the UI or perform other actions
                console.log('Staff added successfully:', data);
            })
            .catch(error => console.error('Error adding staff:', error));
    });

    // Initial fetch when the page loads
    fetchStaff();
} else {
    // Server-side code
    console.error("This script is intended to run in a browser environment.");
}