function fetchStaff() {
    //fetch data from '/api/staff' endpoint
    fetch('/api/staff')
    .then(response => response.json())
    .then(data => displayStaff(data))
    .catch(error => console.error('Error fetching staff:', error));
}

function displayStaff(staffArray) {
    //get HTML element with the ID 'staff-data'
    const staffSection = document.getElementById('staff-data');
    //iterate through each staff object in array
    staffArray.forEach(individualStaff => {
        //create new 'div element
        const div = document.createElement('div');
        //set inner HTML of 'div' with staff info
        div.innerHTML = `<p>Staff ID: ${staff.staffId}</p>
                         <p>First Name: ${staff.firstName}</p>
                         <p>Last Name: ${staff.lastName}</p>`;
        //append 'div' to the 'staff-data' section
        staffSection.appendChild(div);
    })
}

document.getElementById('staff-form').addEventListener('submit', function(e) {
    e.preventDefault();
})