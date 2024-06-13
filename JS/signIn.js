$(document).ready(function() {
    let signedInUser = localStorage.getItem('signedInUser');
    if (signedInUser !== null) {
        window.location = "index.html";
        return;
    }
});

function userLogin() {
    const errorMessage = document.getElementById('signInErrorMessage');
    errorMessage.textContent = '';

    var email = document.getElementById("signin_email").value.trim();
    if (email==="") {
        errorMessage.textContent = 'Please specify your email';
        return;
    }
    if (!isValidEmail(email)) {
        errorMessage.textContent = 'Email format is incorrect';
        return;
    }

    var password = document.getElementById("signin_password").value.trim();
    if (!isValidPassword) {
        errorMessage.textContent = 'Please specify your password';
        return;
    }
    
    const formData = {
        email: email,
        password: password
    };
    var apiUrl = 'http://localhost:8080/JobPortalBackend/webapi/myresource/userLogin';

    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.userId !== undefined) {
                document.getElementById('signin_email').value = '';
                document.getElementById('signin_password').value = '';
                saveSignedInUser(response);

                window.location = "index.html";
            } else {
                errorMessage.textContent = 'Log in failed';
            }
        },
        error: function(xhr, status, error) {
            errorMessage.textContent = 'Error: ' + error;
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    return password !== "";
}

function saveSignedInUser(response) {
    localStorage.setItem('signedInUser', JSON.stringify(response));
}
