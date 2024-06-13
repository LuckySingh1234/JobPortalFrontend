$(document).ready(function() {
    const signedInUser = localStorage.getItem('signedInUser');
    if (signedInUser !== null) {
        window.location = "index.html";
    }
});

function signUp() {
    const errorMessage = document.getElementById('signUpErrorMessage');
    errorMessage.textContent = '';

    var firstName = document.getElementById("firstName").value.trim();
    if (!isValidName(firstName)) {
        errorMessage.textContent = 'Customer First Name does not match the pattern';
        return;
    }

    var lastName = document.getElementById("lastName").value.trim();
    if (!isValidName(lastName)) {
        errorMessage.textContent = 'Customer Last Name does not match the pattern';
        return;
    }

    var mobile = document.getElementById("signup_mobile").value.trim();
    if (!isValidMobile(mobile)) {
        errorMessage.textContent = 'Customer Mobile Number does not match the pattern';
        return;
    }

    var email = document.getElementById("signup_email").value.trim();
    if (!isValidEmail(email)) {
        errorMessage.textContent = 'User Email does not match the pattern';
        return;
    }

    var password = document.getElementById("signup_password").value.trim();
    if (!isValidPassword(password)) {
        errorMessage.textContent = 'User Password is Invalid';
        return;
    }

    var interests = [];

    var javaCheckBox = document.getElementById('java');
    if (javaCheckBox.checked) {
        interests.push(javaCheckBox.name);
    }
    var reactJsCheckBox = document.getElementById('reactJs');
    if (reactJsCheckBox.checked) {
        interests.push(reactJsCheckBox.name);
    }
    var djangoCheckBox = document.getElementById('django');
    if (djangoCheckBox.checked) {
        interests.push(djangoCheckBox.name);
    }
    var angularJsCheckBox = document.getElementById('angularJs');
    if (angularJsCheckBox.checked) {
        interests.push(angularJsCheckBox.name);
    }
    var cppCheckBox = document.getElementById('cpp');
    if (cppCheckBox.checked) {
        interests.push(cppCheckBox.name);
    }
    var javaScriptCheckBox = document.getElementById('javaScript');
    if (javaScriptCheckBox.checked) {
        interests.push(javaScriptCheckBox.name);
    }
    var bigDataCheckBox = document.getElementById('bigData');
    if (bigDataCheckBox.checked) {
        interests.push(bigDataCheckBox.name);
    }
    var aiMLCheckBox = document.getElementById('aiML');
    if (aiMLCheckBox.checked) {
        interests.push(aiMLCheckBox.name);
    }
    var networkingCheckBox = document.getElementById('networking');
    if (networkingCheckBox.checked) {
        interests.push(networkingCheckBox.name);
    }
    var androidCheckBox = document.getElementById('android');
    if (androidCheckBox.checked) {
        interests.push(androidCheckBox.name);
    }

    var interestsStr = interests.join(',');

    const formData = {
        firstName: firstName,
        lastName: lastName,
        mobile: mobile,
        email: email,
        password: password,
        interests: interestsStr
    }
    var apiUrl = 'http://localhost:8080/JobPortalBackend/webapi/myresource/addUser';

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
            errorMessage.textContent = 'Error: ' + error;
        }
    });
}

function isValidName(fullName) {
    const fullNameRegex = /^[A-Za-z\s]{1,20}$/;
    return fullNameRegex.test(fullName);
}

function isValidMobile(mobile) {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
}

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    return password !== "";
}
