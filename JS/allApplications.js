document.addEventListener('DOMContentLoaded', function () {
    const signedInAdmin =  localStorage.getItem('signedInAdmin');
    if (signedInAdmin === null) {
        window.location = "index.html";
        return;
    }
    loadAllJobApplications();
});

function loadAllJobApplications() {
    $.ajax({
        url: 'http://localhost:8080/JobPortalBackend/webapi/myresource/getAllUsersJobApplications',
        type: 'GET',
        success: function(response) {
            const acceptedJobApplications = response.filter((item) => item.status === 'ACCEPTED');
            const rejectedJobApplications = response.filter((item) => item.status === 'REJECTED');
            const pendingJobApplications = response.filter((item) => item.status === 'APPLIED');

            $('#acceptedJobApplicationsTable').DataTable().clear().draw().destroy();
            $('#rejectedJobApplicationsTable').DataTable().clear().draw().destroy();
            $('#pendingJobApplicationsTable').DataTable().clear().draw().destroy();

            renderAcceptedJobApplicationsTable(acceptedJobApplications);
            renderRejectedJobApplicationsTable(rejectedJobApplications);
            renderPendingJobApplicationsTable(pendingJobApplications);
        },
        error: function(xhr, status, error) {
            failureAlert.innerText = 'Error: ' + error;
            failureAlert.style.display = 'block';
            setTimeout(function() {
                dismissAlert('failureAlert')
            }, 1000);
        }
    });
}

function renderAcceptedJobApplicationsTable(jobApplications) {
    var tableBody = document.querySelector('#acceptedJobApplicationsTable tbody');
    jobApplications.forEach(function (jobApplication) {
        var row = document.createElement('tr');

        var cellJobId = document.createElement('td');
        cellJobId.textContent = jobApplication.jobId;
        cellJobId.classList.add('hidden');
        cellJobId.classList.add('jobId');
        row.appendChild(cellJobId);

        var cellUserId = document.createElement('td');
        cellUserId.textContent = jobApplication.userId;
        cellUserId.classList.add('hidden');
        cellUserId.classList.add('userId');
        row.appendChild(cellUserId);
        
        var cellName = document.createElement('td');
        cellName.textContent = jobApplication.companyName;
        row.appendChild(cellName);

        var cellName = document.createElement('td');
        cellName.textContent = jobApplication.name;
        row.appendChild(cellName);

        var cellRole = document.createElement('td');
        cellRole.textContent = jobApplication.role;
        row.appendChild(cellRole);

        var cellResume = document.createElement('td');
        cellResume.innerHTML = '<button class="resume-button collapsed" onclick=getResume(this) data-toggle="modal" data-target="#exampleModal" aria-expanded="false" aria-controls="collapseTwo">Resume</button>';
        row.appendChild(cellResume);

        tableBody.appendChild(row);
    });

    $('#acceptedJobApplicationsTable').DataTable();
}

function renderRejectedJobApplicationsTable(jobApplications) {
    var tableBody = document.querySelector('#rejectedJobApplicationsTable tbody');
    jobApplications.forEach(function (jobApplication) {
        var row = document.createElement('tr');

        var cellJobId = document.createElement('td');
        cellJobId.textContent = jobApplication.jobId;
        cellJobId.classList.add('hidden');
        cellJobId.classList.add('jobId');
        row.appendChild(cellJobId);

        var cellUserId = document.createElement('td');
        cellUserId.textContent = jobApplication.userId;
        cellUserId.classList.add('hidden');
        cellUserId.classList.add('userId');
        row.appendChild(cellUserId);
        
        var cellName = document.createElement('td');
        cellName.textContent = jobApplication.companyName;
        row.appendChild(cellName);

        var cellName = document.createElement('td');
        cellName.textContent = jobApplication.name;
        row.appendChild(cellName);

        var cellRole = document.createElement('td');
        cellRole.textContent = jobApplication.role;
        row.appendChild(cellRole);

        var cellResume = document.createElement('td');
        cellResume.innerHTML = '<button class="resume-button collapsed" onclick=getResume(this) data-toggle="modal" data-target="#exampleModal" aria-expanded="false" aria-controls="collapseTwo">Resume</button>';
        row.appendChild(cellResume);

        tableBody.appendChild(row);
    });

    $('#rejectedJobApplicationsTable').DataTable();
}

function renderPendingJobApplicationsTable(jobApplications) {
    var tableBody = document.querySelector('#pendingJobApplicationsTable tbody');
    jobApplications.forEach(function (jobApplication) {
        var row = document.createElement('tr');

        var cellJobId = document.createElement('td');
        cellJobId.textContent = jobApplication.jobId;
        cellJobId.classList.add('hidden');
        cellJobId.classList.add('jobId');
        row.appendChild(cellJobId);

        var cellUserId = document.createElement('td');
        cellUserId.textContent = jobApplication.userId;
        cellUserId.classList.add('hidden');
        cellUserId.classList.add('userId');
        row.appendChild(cellUserId);
        
        var cellName = document.createElement('td');
        cellName.textContent = jobApplication.companyName;
        row.appendChild(cellName);

        var cellName = document.createElement('td');
        cellName.textContent = jobApplication.name;
        row.appendChild(cellName);

        var cellRole = document.createElement('td');
        cellRole.textContent = jobApplication.role;
        row.appendChild(cellRole);

        var cellResume = document.createElement('td');
        cellResume.innerHTML = '<button class="resume-button collapsed" onclick=getResume(this) data-toggle="modal" data-target="#exampleModal" aria-expanded="false" aria-controls="collapseTwo">Resume</button>';
        row.appendChild(cellResume);

        var cellAccept = document.createElement('td');
        cellAccept.innerHTML = '<button class="accept-button" onclick=acceptApplication(this)>Accept</button>';
        row.appendChild(cellAccept);

        var cellReject = document.createElement('td');
        cellReject.innerHTML = '<button class="reject-button" onclick=rejectApplication(this)>Reject</button>';
        row.appendChild(cellReject);

        tableBody.appendChild(row);
    });

    $('#pendingJobApplicationsTable').DataTable();
}

function acceptApplication(acceptBtn) {
    const row = acceptBtn.closest('tr');
    const jobId = row.querySelector('.jobId').innerText;
    const userId = row.querySelector('.userId').innerText;

    const formData = {
        jobId: jobId,
        userId: userId,
        status: 'ACCEPTED'
    }

    changeJobApplicationStatus(formData);
}

function rejectApplication(acceptBtn) {
    const row = acceptBtn.closest('tr');
    const jobId = row.querySelector('.jobId').innerText;
    const userId = row.querySelector('.userId').innerText;

    const formData = {
        jobId: jobId,
        userId: userId,
        status: 'REJECTED'
    }

    changeJobApplicationStatus(formData);
}

function changeJobApplicationStatus(formData) {
    $.ajax({
        url: 'http://localhost:8080/JobPortalBackend/webapi/myresource/updateJobApplicationStatus',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            loadAllJobApplications();
        },
        error: function(xhr, status, error) {
            failureAlert.innerText = 'Error: ' + error;
            failureAlert.style.display = 'block';
            setTimeout(function() {
                dismissAlert('failureAlert')
            }, 1000);
        }
    });
}

function getResume(resumeBtn) {
    const row = resumeBtn.closest('tr');
    const userId = row.querySelector('.userId').innerText;
    const formData = {
        userId: userId
    }
    $.ajax({
        url: 'http://localhost:8080/JobPortalBackend/webapi/myresource/getResumeByUserId',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.name !== null) {
                document.getElementById('display-name').innerText = response.name || 'Applicant Name';
            }
            if (response.dob !== null) {
                document.getElementById('display-dob').innerText = `Date of Birth: ${response.dob}`;
            }
            if (response.email !== null) {
                document.getElementById('display-email').innerText = `Email: ${response.email}`;
            }
            if (response.institutionName !== null) {
                document.getElementById('display-institution').innerText = response.institutionName || 'Institution Name';
            }
            if (response.degree !== null) {
                document.getElementById('display-degree').innerText = `Degree: ${response.degree}`;
            }
            if (response.yearOfGraduation !== null) {
                document.getElementById('display-grad-year').innerText = `Year of Graduation: ${response.yearOfGraduation}`;
            }
            if (response.companyName !== null) {
                document.getElementById('display-company').innerText = response.companyName || 'Company Name';
            }
            if (response.role !== null) {
                document.getElementById('display-role').innerText = `Role: ${response.role}`;
            }
            if (response.duration !== null) {
                document.getElementById('display-duration').innerText = `Duration: ${response.duration}`;
            }
            if (response.responsibilities) {
                const responsibilities = response.responsibilities.split('\n');
                const responsibilitiesList = document.getElementById('display-responsibilities');
                responsibilitiesList.innerHTML = '';
                responsibilities.forEach(responsibility => {
                    const li = document.createElement('li');
                    li.innerText = responsibility;
                    responsibilitiesList.appendChild(li);
                });
            }
        },
        error: function(xhr, status, error) {
            failureAlert.innerText = 'Error: ' + error;
            failureAlert.style.display = 'block';
            setTimeout(function() {
                dismissAlert('failureAlert')
            }, 1000);
        }
    });
}
