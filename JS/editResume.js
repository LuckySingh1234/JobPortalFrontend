$(document).ready(function() {
    const successAlert = document.getElementById('successAlert');
    const failureAlert = document.getElementById('failureAlert');
    successAlert.style.display = 'none';
    failureAlert.style.display = 'none';

    const signedInUser = localStorage.getItem('signedInUser');
    if (signedInUser === null) {
        window.location = "signin.html";
        return;
    }

    document.getElementById('name').addEventListener('input', function() {
        document.getElementById('display-name').innerText = this.value || 'Applicant Name';
    });

    document.getElementById('dob').addEventListener('input', function() {
        document.getElementById('display-dob').innerText = `Date of Birth: ${this.value}`;
    });
    
    document.getElementById('email2').addEventListener('input', function() {
        document.getElementById('display-email').innerText = `Email: ${this.value}`;
    });
    
    document.getElementById('institutionName').addEventListener('input', function() {
        document.getElementById('display-institution').innerText = this.value || 'Institution Name';
    });
    
    document.getElementById('degree').addEventListener('input', function() {
        document.getElementById('display-degree').innerText = `Degree: ${this.value}`;
    });
    
    document.getElementById('yearOfGraduation').addEventListener('input', function() {
        document.getElementById('display-grad-year').innerText = `Year of Graduation: ${this.value}`;
    });
    
    document.getElementById('companyName').addEventListener('input', function() {
        document.getElementById('display-company').innerText = this.value || 'Company Name';
    });
    
    document.getElementById('role').addEventListener('input', function() {
        document.getElementById('display-role').innerText = `Role: ${this.value}`;
    });
    
    document.getElementById('duration').addEventListener('input', function() {
        document.getElementById('display-duration').innerText = `Duration: ${this.value}`;
    });
    
    document.getElementById('responsibilities').addEventListener('input', function() {
        const responsibilities = this.value.split('\n');
        const responsibilitiesList = document.getElementById('display-responsibilities');
        responsibilitiesList.innerHTML = ''; // Clear previous responsibilities
        responsibilities.forEach(responsibility => {
            const li = document.createElement('li');
            li.innerText = responsibility;
            responsibilitiesList.appendChild(li);
        });
    });
});

function saveResume() {
    const successAlert = document.getElementById('successAlert');
    const failureAlert = document.getElementById('failureAlert');
    successAlert.style.display = 'none';
    failureAlert.style.display = 'none';

    const signedInUser = localStorage.getItem('signedInUser');
    const userId = JSON.parse(localStorage.getItem('signedInUser')).userId;

    const name = document.getElementById('name').value.trim();
    const dob = document.getElementById('dob').value.trim();
    const email2 = document.getElementById('email2').value.trim();
    const institutionName = document.getElementById('institutionName').value.trim();
    const degree = document.getElementById('degree').value.trim();
    const yearOfGraduation = document.getElementById('yearOfGraduation').value.trim();
    const companyName = document.getElementById('companyName').value.trim();
    const role = document.getElementById('role').value.trim();
    const duration = document.getElementById('duration').value.trim();
    const responsibilities = document.getElementById('responsibilities').value.trim();


    const formData = {
        userId: userId,
        name: name,
        dob: dob,
        email: email2,
        institutionName: institutionName,
        degree: degree,
        yearOfGraduation: yearOfGraduation,
        companyName: companyName,
        role: role,
        duration: duration,
        responsibilities: responsibilities
    }

    $.ajax({
        url: 'http://localhost:8080/JobPortalBackend/webapi/myresource/saveResume',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success === 'true') {
                successAlert.innerText = 'You have Successfully Saved your resume';
                successAlert.style.display = 'block';
                setTimeout(function() {
                    dismissAlert('successAlert')
                }, 1000);
            } else {
                failureAlert.innerText = response.errorMessage;
                failureAlert.style.display = 'block';
                setTimeout(function() {
                    dismissAlert('failureAlert')
                }, 1000);
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

function dismissAlert(alertId) {
    var alert = document.getElementById(alertId);
    setTimeout(function() {
        alert.style.display = 'none';
    })
}
