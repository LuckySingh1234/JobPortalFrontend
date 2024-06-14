$(document).ready(function() {
    const successAlert = document.getElementById('successAlert');
    const failureAlert = document.getElementById('failureAlert');
    successAlert.style.display = 'none';
    failureAlert.style.display = 'none';

    var params = new URLSearchParams(window.location.search);
    var companyId = params.get('id');
    var apiUrl = 'http://localhost:8080/JobPortalBackend/webapi/myresource/getCompanyById';
    var queryParams = {
        id: companyId
    };
    $.ajax({
        url: apiUrl,
        type: 'GET',
        data: queryParams,
        success: function(response) {
            if (response === null) {
                return;
            } else {
                const companyName =  document.getElementById('companyName');
                companyName.textContent = 'Company Name: ' + response.companyName;
                const companyImageUrl =  document.getElementById('companyImageUrl');
                companyImageUrl.setAttribute('src', response.imageUrl);
                const companyDescription = document.getElementById('companyDescription');
                companyDescription.textContent = response.companyDescription;
                const companyLocation = document.getElementById('companyLocation');
                companyLocation.textContent = response.location;
                fetchAllJobsByCompanyId(companyId);
            }
        },
        error: function(xhr, status, error) {
            $('#result').html('<p>An error occurred: ' + error + '</p>');
        }
    });
});

function fetchAllJobsByCompanyId(companyId) {
    var apiUrl = 'http://localhost:8080/JobPortalBackend/webapi/myresource/getAllJobsByCompanyId';
    var queryParams = {
        id: companyId
    };
    $.ajax({
        url: apiUrl,
        type: 'GET',
        data: queryParams,
        success: function(response) {
            if (response === null) {
                return;
            } else {
                response.forEach(item => {
                    const changedJobId = item.jobId.replace(/#/g, '-');;
                    const jobDetailsContainer = document.querySelector('#jobAccordion')
                    const cardHtml = `
                        <div class="card">
                            <div class="card-header" id="headingOne">
                                <h2 class="mb-0">
                                    <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#${changedJobId}" aria-expanded="true" aria-controls="${changedJobId}">
                                    ${item.roleTitle}
                                    </button>
                                </h2>
                            </div>
                            <div id="${changedJobId}" class="collapse jobId" aria-labelledby="headingOne" data-parent="#jobAccordion">
                            <div class="card-body">
                                <div class="row mt-3">
                                    <div class="col-4">
                                        <h6>Role Description</h6>
                                    </div>
                                    <div class="col-8">
                                        <p class="text-justify">${item.roleDescription}</p>
                                    </div>
                                    <div class="col-4">
                                        <h6>Required Skills</h6>
                                    </div>
                                    <div class="col-8">
                                        <p>${item.requiredSkills}</p>
                                    </div>
                                    <div class="col-4">
                                        <h6>Required Experience</h6>
                                    </div>
                                    <div class="col-8">
                                        <p>${item.requiredExperience}</p>
                                    </div>
                                    <div class="col-4">
                                        <h6>Package Offered</h6>
                                    </div>
                                    <div class="col-8">
                                        <p>${item.jobPackage}</p>
                                    </div>
                                    <div class="col-12">
                                        <button type="button" class="btn btn-success w-100 jobApplyBtn" onclick=applyJob(this)>Apply</button>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    `;
                    jobDetailsContainer.innerHTML += cardHtml;
                });
                const signedInAdmin = localStorage.getItem('signedInAdmin');
                if (signedInAdmin !== null) {
                    jobDetailsContainer.innerHTML += `
                        <div class="card mb-5">
                            <div class="card-header" id="headingTwo" style="background-color: #3177e0;">
                            <h2 class="mb-0">
                                <button class="btn btn-link btn-block text-left collapsed text-center text-white font-weight-bolder" data-toggle="modal" data-target="#exampleModal" style="font-size: larger;" type="button" data-toggle="collapse" aria-expanded="false" aria-controls="collapseTwo">
                                Add Job
                                </button>
                            </h2>
                            </div>
                        </div>
                    `;
                    const jobApplyButtons = document.getElementsByClassName('jobApplyBtn');
                    const buttonsArray = Array.from(jobApplyButtons);
                    buttonsArray.forEach(element => {
                        element.style.display = 'none';
                    });
                }
            }
        },
        error: function(xhr, status, error) {
            $('#result').html('<p>An error occurred: ' + error + '</p>');
        }
    });
}

function applyJob(applyJobBtn) {
    const successAlert = document.getElementById('successAlert');
    const failureAlert = document.getElementById('failureAlert');
    successAlert.style.display = 'none';
    failureAlert.style.display = 'none';

    let signedInUser = localStorage.getItem('signedInUser');
    if (signedInUser === null) {
        window.location = "signin.html";
        return;
    }

    const card = applyJobBtn.closest('.card');
    const jobId = card.querySelector('.jobId').id.replace('-', '#');
    
    const userId = JSON.parse(localStorage.getItem('signedInUser')).userId;

    const formData = {
        jobId: jobId,
        userId: userId
    }

    $.ajax({
        url: 'http://localhost:8080/JobPortalBackend/webapi/myresource/applyJob',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success === 'true') {
                successAlert.innerText = 'You have Successfully Applied to this Job';
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
