$(document).ready(function() {
    const signedInManager = localStorage.getItem('signedInManager');
    if (signedInManager !== null) {
        window.location = "managerFunctionalities.html";
    }
});

function signUp() {
    const errorMessage = document.getElementById('signUpErrorMessage');
    errorMessage.textContent = '';

    var email = document.getElementById("signup_email").value.trim();
    if (!isValidEmail(email)) {
        errorMessage.textContent = 'Manager Email does not match the pattern';
        return;
    }

    var password = document.getElementById("signup_password").value.trim();
    if (!isValidPassword(password)) {
        errorMessage.textContent = 'Manager Password is Invalid';
        return;
    }

    const formData = {
        email: email,
        password: password
    }
    var apiUrl = 'http://localhost:8080/OnlineStoreAppBackendAPI/webapi/myresource/addManager';

    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success === 'true') {
                document.getElementById('signup_email').value = '';
                document.getElementById('signup_password').value = '';

                window.location = "signin.html"
            } else {
                errorMessage.textContent = response.errorMessage;
            }
        },
        error: function(xhr, status, error) {
            // Handle error
            errorMessage.textContent = 'Error: ' + error;
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    return password !== "";
}
