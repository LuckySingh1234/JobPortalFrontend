$(document).ready(function() {
    var apiUrl = 'http://localhost:8080/JobPortalBackend/webapi/myresource/getAllCompanies';

    $.ajax({
        url: apiUrl,
        type: 'GET',
        success: function(response) {
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
                allCardsContainer.innerHTML += `
                    <div class="col-md-3 mb-5 ml-5">
                        <div class="addCard" onclick="handleClick()">
                            <b></b>
                            <div class="content">
                            <p class="title"> + </p>
                            </div>
                        </div>
                    </div>
                `;
            }
        },
        error: function(xhr, status, error) {
            $('#result').html('<p>An error occurred: ' + error + '</p>');
        }
    });
});
