$(document).ready(function() {
    const successAlert = document.getElementById('successAlert');
    const failureAlert = document.getElementById('failureAlert');
    successAlert.style.display = 'none';
    failureAlert.style.display = 'none';
    
    renderAllCards();
});

function renderAllCards() {
    var apiUrl = 'http://localhost:8080/JobPortalBackend/webapi/myresource/getAllCompanies';

    $.ajax({
        url: apiUrl,
        type: 'GET',
        success: function(response) {
            const allCardsContainer = document.querySelector('#allCardsContainer');
            while (allCardsContainer.firstChild) {
                allCardsContainer.removeChild(allCardsContainer.firstChild);
            }

            if (response === null) {
                return;
            } else {
                response.forEach(item => {
                    const allCardsContainer = document.querySelector('#allCardsContainer')
                    const cardHtml = `
                        <div class="col-md-3 mb-5 ml-5">
                            <div class="card">
                                <img src="${item.imageUrl}" />
                                <p class="heading">
                                ${item.companyName}
                                </p>
                                <a href="company.html?id=${encodeURIComponent(item.companyId)}"><button>View Details</button></a>
                            </div>
                        </div>
                    `;
                    allCardsContainer.innerHTML += cardHtml;
                });
                const signedInAdmin = localStorage.getItem('signedInAdmin');
                if (signedInAdmin !== null) {
                    allCardsContainer.innerHTML += `
                    <div class="col-md-3 mb-5 ml-5 collapsed" data-toggle="modal" data-target="#exampleModal" data-toggle="collapse" aria-expanded="false" aria-controls="collapseTwo">
                        <div class="addCard">
                            <b></b>
                            <div class="content">
                            <p class="title"> + </p>
                            </div>
                        </div>
                    </div>
                `;   
                }
            }
        },
        error: function(xhr, status, error) {
            $('#result').html('<p>An error occurred: ' + error + '</p>');
        }
    });
}

function addCompany() {
    const successAlert = document.getElementById('successAlert');
    const failureAlert = document.getElementById('failureAlert');
    successAlert.style.display = 'none';
    failureAlert.style.display = 'none';

    const companyName = document.getElementById('companyName').value.trim();
    if (companyName === '') {
        failureAlert.innerText = 'Company Name cannot be empty';
        failureAlert.style.display = 'block';
        setTimeout(function() {
            dismissAlert('failureAlert')
        }, 1000);
        return;
    }
    const companyDescription = document.getElementById('companyDescription').value.trim();
    if (companyDescription === '') {
        failureAlert.innerText = 'Company Description cannot be empty';
        failureAlert.style.display = 'block';
        setTimeout(function() {
            dismissAlert('failureAlert')
        }, 1000);
        return;
    }
    const location = document.getElementById('location').value.trim();
    if (location === '') {
        failureAlert.innerText = 'Location cannot be empty';
        failureAlert.style.display = 'block';
        setTimeout(function() {
            dismissAlert('failureAlert')
        }, 1000);
        return;
    }
    const imageUrl = document.getElementById('imageUrl').value.trim();
    if (imageUrl === '') {
        failureAlert.innerText = 'Image URL cannot be empty';
        failureAlert.style.display = 'block';
        setTimeout(function() {
            dismissAlert('failureAlert')
        }, 1000);
        return;
    }

    var apiUrl = 'http://localhost:8080/JobPortalBackend/webapi/myresource/addCompany';
    var formData = {
        companyName: companyName,
        companyDescription: companyDescription,
        location: location,
        imageUrl: imageUrl
    };

    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success === 'true') {
                successAlert.innerText = 'You have successfully added the Company';
                successAlert.style.display = 'block';
                setTimeout(function() {
                    dismissAlert('successAlert')
                }, 1000);
                clearAddCompanyFormFields();
                renderAllCards();
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

function clearAddCompanyFormFields() {
    document.getElementById('companyName').value = '';
    document.getElementById('companyDescription').value = '';
    document.getElementById('location').value = '';
    document.getElementById('imageUrl').value = '';
}

function dismissAlert(alertId) {
    var alert = document.getElementById(alertId);
    setTimeout(function() {
        alert.style.display = 'none';
    })
}

