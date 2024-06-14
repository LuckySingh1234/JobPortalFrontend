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
            failureAlert.innerText = 'Error: ' + error;
            failureAlert.style.display = 'block';
            setTimeout(function() {
                dismissAlert('failureAlert')
            }, 1000);
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
            renderJobs(response);
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

function renderJobs(response) {
    const jobAccordion = document.querySelector('#jobAccordion');
    while (jobAccordion.firstChild) {
        jobAccordion.removeChild(jobAccordion.firstChild);
    }
    const addJobBtnContainer = document.querySelector('#addJobBtnContainer');
    if (addJobBtnContainer !== null) {
        addJobBtnContainer.remove();
    }


    if (response === null) {
        return;
    } else {
        if(response.length !== 0) {
            response.forEach(item => {
                const changedJobId = item.jobId.replace(/#/g, '-');;
                const jobAccordionContainer = document.querySelector('#jobAccordion');
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
                                <div class="col-12">
                                    <button style="display: none;" type="button" class="btn btn-danger w-100 jobRemoveBtn" onclick=removeJob(this)>Remove</button>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                `;
                jobAccordionContainer.innerHTML += cardHtml;
            });
        } else {
            const cardHtml = `<h4 class='text-center'> No Jobs posted from this company yet</h4>`;
            const jobAccordionContainer = document.querySelector('#jobAccordion');
            jobAccordionContainer.innerHTML += cardHtml;
        }
        const signedInAdmin = localStorage.getItem('signedInAdmin');
        if (signedInAdmin !== null) {
            const jobDetailsContainer = document.querySelector('#jobDetailsContainer')
            jobDetailsContainer.innerHTML += `
                <div class="card mb-5" id="addJobBtnContainer">
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
        if (signedInAdmin !== null) {
            const jobRemoveButtons = document.getElementsByClassName('jobRemoveBtn');
            const buttonsArray = Array.from(jobRemoveButtons);
            buttonsArray.forEach(element => {
                element.style.display = 'block';
            });
        }
    }
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

function addJob() {
    const successAlert = document.getElementById('successAlert');
    const failureAlert = document.getElementById('failureAlert');
    successAlert.style.display = 'none';
    failureAlert.style.display = 'none';

    const jobTitle = document.getElementById('jobTitle').value.trim();
    if (jobTitle === '') {
        failureAlert.innerText = 'Job Title cannot be empty';
        failureAlert.style.display = 'block';
        setTimeout(function() {
            dismissAlert('failureAlert')
        }, 1000);
        return;
    }
    const jobDescription = document.getElementById('jobDescription').value.trim();
    if (jobDescription === '') {
        failureAlert.innerText = 'Job Description cannot be empty';
        failureAlert.style.display = 'block';
        setTimeout(function() {
            dismissAlert('failureAlert')
        }, 1000);
        return;
    }
    const package = document.getElementById('package').value.trim();
    if (package === '') {
        failureAlert.innerText = 'Package being offered cannot be empty';
        failureAlert.style.display = 'block';
        setTimeout(function() {
            dismissAlert('failureAlert')
        }, 1000);
        return;
    }
    const experience = document.getElementById('experience').value.trim();
    if (experience === '') {
        failureAlert.innerText = 'Experience cannot be empty';
        failureAlert.style.display = 'block';
        setTimeout(function() {
            dismissAlert('failureAlert')
        }, 1000);
        return;
    }

    var skills = [];

    var javaCheckBox = document.getElementById('java');
    if (javaCheckBox.checked) {
        skills.push(javaCheckBox.name);
    }
    var reactJsCheckBox = document.getElementById('reactJs');
    if (reactJsCheckBox.checked) {
        skills.push(reactJsCheckBox.name);
    }
    var djangoCheckBox = document.getElementById('django');
    if (djangoCheckBox.checked) {
        skills.push(djangoCheckBox.name);
    }
    var angularJsCheckBox = document.getElementById('angularJs');
    if (angularJsCheckBox.checked) {
        skills.push(angularJsCheckBox.name);
    }
    var cppCheckBox = document.getElementById('cpp');
    if (cppCheckBox.checked) {
        skills.push(cppCheckBox.name);
    }
    var javaScriptCheckBox = document.getElementById('javaScript');
    if (javaScriptCheckBox.checked) {
        skills.push(javaScriptCheckBox.name);
    }
    var bigDataCheckBox = document.getElementById('bigData');
    if (bigDataCheckBox.checked) {
        skills.push(bigDataCheckBox.name);
    }
    var aiMLCheckBox = document.getElementById('aiML');
    if (aiMLCheckBox.checked) {
        skills.push(aiMLCheckBox.name);
    }
    var networkingCheckBox = document.getElementById('networking');
    if (networkingCheckBox.checked) {
        skills.push(networkingCheckBox.name);
    }
    var androidCheckBox = document.getElementById('android');
    if (androidCheckBox.checked) {
        skills.push(androidCheckBox.name);
    }

    if (skills.length === 0) {
        failureAlert.innerText = 'Please select some required skills';
        failureAlert.style.display = 'block';
        setTimeout(function() {
            dismissAlert('failureAlert')
        }, 1000);
        return;
    }

    var skillsStr = skills.join(',');

    var params = new URLSearchParams(window.location.search);
    var companyId = params.get('id');

    var apiUrl = 'http://localhost:8080/JobPortalBackend/webapi/myresource/addJob';
    var formData = {
        companyId: companyId,
        jobTitle: jobTitle,
        jobDescription: jobDescription,
        package: package,
        experience: experience,
        skills: skillsStr
    };

    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success === 'true') {
                successAlert.innerText = 'You have successfully added the Job';
                successAlert.style.display = 'block';
                setTimeout(function() {
                    dismissAlert('successAlert')
                }, 1000);
                clearAddJobFormFields();
                fetchAllJobsByCompanyId(companyId);
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

function removeJob(removeJobBtn) {
    const successAlert = document.getElementById('successAlert');
    const failureAlert = document.getElementById('failureAlert');
    successAlert.style.display = 'none';
    failureAlert.style.display = 'none';

    const card = removeJobBtn.closest('.card');
    const jobId = card.querySelector('.jobId').id.replace('-', '#');
    
    const formData = {
        jobId: jobId,
    }

    var params = new URLSearchParams(window.location.search);
    var companyId = params.get('id');

    $.ajax({
        url: 'http://localhost:8080/JobPortalBackend/webapi/myresource/removeJob',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success === 'true') {
                successAlert.innerText = 'You have Successfully Removed this Job';
                successAlert.style.display = 'block';
                setTimeout(function() {
                    dismissAlert('successAlert')
                }, 1000);
                fetchAllJobsByCompanyId(companyId);
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

function clearAddJobFormFields() {
    document.getElementById('jobTitle').value = '';
    document.getElementById('jobDescription').value = '';
    document.getElementById('package').value = '';
    document.getElementById('experience').value = '';

    document.getElementById('java').checked = false;
    document.getElementById('reactJs').checked = false;
    document.getElementById('django').checked = false;
    document.getElementById('angularJs').checked = false;
    document.getElementById('cpp').checked = false;
    document.getElementById('javaScript').checked = false;
    document.getElementById('bigData').checked = false;
    document.getElementById('aiML').checked = false;
    document.getElementById('networking').checked = false;
    document.getElementById('android').checked = false;
}
