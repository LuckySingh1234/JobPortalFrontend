$(document).ready(function() {
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
                            <div id="${changedJobId}" class="collapse show" aria-labelledby="headingOne" data-parent="#jobAccordion">
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
                                        <button type="button" class="btn btn-success w-100">Apply</button>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    `;
                    jobDetailsContainer.innerHTML += cardHtml;
                });
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
            }
        },
        error: function(xhr, status, error) {
            $('#result').html('<p>An error occurred: ' + error + '</p>');
        }
    });
}
