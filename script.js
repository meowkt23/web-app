function fetchStaff() {
    // Fetch data from '/api/staff' endpoint
    fetch('/api/staff')
        .then(response => response.json())
        .then(data => displayStaff(data))
        .catch(error => console.error('Error fetching staff:', error));
}

function displayStaff(staffArray) {
    // Get HTML element with the ID 'staff-data'
    const staffSection = document.getElementById('staff-data');
    // Iterate through each staff object in the array
    staffArray.forEach(individualStaff => {
        // Create a new 'div' element
        const div = document.createElement('div');
        // Set inner HTML of 'div' with staff info
        div.innerHTML = `<p>Staff ID: ${individualStaff.staffId}</p>
                         <p>First Name: ${individualStaff.firstName}</p>
                         <p>Last Name: ${individualStaff.lastName}</p>`;
        // Append 'div' to the 'staff-data' section
        staffSection.appendChild(div);
    });
}

// Add an event listener to the form with the ID 'staff-form'
document.getElementById('staff-form').addEventListener('submit', function (e) {
    // Prevent the default form submission behavior
    e.preventDefault();
    // The code within this function will be executed when the form is submitted
    // Add your form submission logic or other actions here
});
