$(document).ready(function() {
    const signedInManager = localStorage.getItem('signedInManager');
    if (signedInManager !== null) {
        window.location = "managerFunctionalities.html";
    }
});

function signInAsManager() {
    const errorMessage = document.getElementById('signInErrorMessage');
    errorMessage.textContent = '';

    var email = document.getElementById("signin_email").value.trim();
    if (email.trim()==null || email.trim()==""|| email===" ") {
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

    $.ajax({
        url: 'http://localhost:8080/OnlineStoreAppBackendAPI/webapi/myresource/managerLogin',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.signedInManager === undefined) {
                $('#apiResponse').html("Log in failed");
            } else {
                saveToLocalStorage("signedInManager", response.signedInManager);
                document.getElementById("signin_email").value = "";
                document.getElementById("signin_password").value = "";
                $('#apiResponse').html('Login Successful');
                window.location = "managerFunctionalities.html";
            }
        },
        error: function(xhr, status, error) {
            // Handle error
            $('#apiResponse').css('color', 'red');
            $('#apiResponse').html('Error: ' + error);
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

function saveToLocalStorage(key, value) {
    localStorage.setItem(key, value);
}
