document.addEventListener('DOMContentLoaded', function () {
    const signedInUser = localStorage.getItem('signedInUser');
    if (signedInUser === null) {
        window.location = "signin.html";
        return;
    }

    const userId = JSON.parse(localStorage.getItem('signedInUser')).userId;
    const formData = {
        userId: userId
    }

    $.ajax({
        url: 'http://localhost:8080/JobPortalBackend/webapi/myresource/getAllJobApplicationsByUserId',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            renderJobApplicationsTable(response);
        },
        error: function(xhr, status, error) {
            failureAlert.innerText = 'Error: ' + error;
            failureAlert.style.display = 'block';
            setTimeout(function() {
                dismissAlert('failureAlert')
            }, 1000);
        }
    });
});

function renderJobApplicationsTable(jobApplications) {
    var tableBody = document.querySelector('#jobApplicationsTable tbody');
    jobApplications.forEach(function (jobApplication) {
        var row = document.createElement('tr');

        var cellJobId = document.createElement('td');
        cellJobId.textContent = jobApplication.jobId;
        cellJobId.classList.add('hidden');
        row.appendChild(cellJobId);
        
        var cellName = document.createElement('td');
        cellName.textContent = jobApplication.companyName;
        row.appendChild(cellName);

        var cellRole = document.createElement('td');
        cellRole.textContent = jobApplication.role;
        row.appendChild(cellRole);

        var cellReject = document.createElement('td');
        cellReject.innerHTML = jobApplication.status;
        row.appendChild(cellReject);

        tableBody.appendChild(row);
    });

    $('#jobApplicationsTable').DataTable();
}
