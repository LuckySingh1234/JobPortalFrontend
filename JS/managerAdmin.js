document.addEventListener('DOMContentLoaded', (event) => {
    renderManagers();    
});

function renderManagers() {
    const tableBody = document.querySelector('#managerAdminTable tbody');
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    var apiUrl = 'http://localhost:8080/OnlineStoreAppBackendAPI/webapi/myresource/getManagers';

    $.ajax({
        url: apiUrl,
        type: 'GET',
        success: function(response) {
            // Handle the success response
            if (response === null) {
                const managerAdminContent = document.getElementById('managerAdminContent');
                managerAdminContent.innerHTML = `<h2 style="margin-top: 6rem; text-align: center;">No Managers Registered in Store</h2>`;
            } else {
                response.reverse();
                response.forEach(item => {
                    const managerAdminTableBody = document.querySelector('#managerAdminTable tbody');
                    const managerAdminTableBodyHtml = `
                        <tr class="managerRow">
                            <td class="email">${item.email}</td>
                            <td class="password">${item.password}</td>
                            <td class="py-2"><button class="editBtn btn btn-warning btn-sm" style="width: 75px;" onclick="updateManager(this)">Edit</button></td>
                            <td class="py-2"><button class="removeBtn btn btn-danger btn-sm" style="width: 75px;" onclick="removeManagerViaTable(this)">Remove</button></td>
                        </tr>
                    `;
                    managerAdminTableBody.innerHTML += managerAdminTableBodyHtml;
                });
            }
        },
        error: function(xhr, status, error) {
            // Handle the error response
        }
    });
}

function viewManager() {
    clearPreviousAlerts();

    const email = document.getElementById('email2').value.trim();
    if (!isValidEmail(email)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Manager email does not match the pattern';
        alert.style.display = 'block';
        return;
    }

    var apiUrl = 'http://localhost:8080/OnlineStoreAppBackendAPI/webapi/myresource/getManagerByEmail';
    var formData = {
        email: email
    };

    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success === 'true') {
                document.getElementById('email2').value = response.email;
                document.getElementById('password').value = response.password;
            } else {
                const alert = document.getElementById('failure-alert');
                alert.innerText = response.errorMessage;
                alert.style.display = 'block';
            }
        },
        error: function(xhr, status, error) {
            // Handle error
            const alert = document.getElementById('failure-alert');
            alert.innerText = 'Error: ' + error;
            alert.style.display = 'block';
        }
    });
}

function addManager() {
    clearPreviousAlerts();

    const email = document.getElementById('email2').value.trim();
    if (!isValidEmail(email)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Manager Email does not match the pattern';
        alert.style.display = 'block';
        return;
    }

    const password = document.getElementById('password').value.trim();
    if (!isValidPassword(password)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Manager Password is Invalid';
        alert.style.display = 'block';
        return;
    }

    var apiUrl = 'http://localhost:8080/OnlineStoreAppBackendAPI/webapi/myresource/addManager';
    var formData = {
        email: email,
        password: password
    };

    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success === 'true') {
                document.getElementById('email2').value = "";
                document.getElementById('password').value = "";
                const alert = document.getElementById('success-alert');
                alert.innerText = "Manager Added Successfully";
                alert.style.display = 'block';
                renderManagers();
            } else {
                const alert = document.getElementById('failure-alert');
                alert.innerText = response.errorMessage;
                alert.style.display = 'block';
            }
        },
        error: function(xhr, status, error) {
            // Handle error
            const alert = document.getElementById('failure-alert');
            alert.innerText = 'Error: ' + error;
            alert.style.display = 'block';
        }
    });
}

function editManager() {
    clearPreviousAlerts();

    const email = document.getElementById('email2').value.trim();
    if (!isValidEmail(email)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Manager E-mail is invalid';
        alert.style.display = 'block';
        return;
    }

    const password = document.getElementById('password').value.trim();
    if (!isValidPassword(password)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Manager Password is Invalid';
        alert.style.display = 'block';
        return;
    }

    var apiUrl = 'http://localhost:8080/OnlineStoreAppBackendAPI/webapi/myresource/editManager';
    var formData = {
        email: email,
        password: password
    };

    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success === 'true') {
                document.getElementById('email2').value = "";
                document.getElementById('password').value = "";
                const alert = document.getElementById('success-alert');
                alert.innerText = "Manager Edited Successfully";
                alert.style.display = 'block';
                renderManagers();
            } else {
                const alert = document.getElementById('failure-alert');
                alert.innerText = response.errorMessage;
                alert.style.display = 'block';
            }
        },
        error: function(xhr, status, error) {
            // Handle error
            const alert = document.getElementById('failure-alert');
            alert.innerText = 'Error: ' + error;
            alert.style.display = 'block';
        }
    });
}


 function removeManagerViaTable(removeViaTableBtn) {
    clearPreviousAlerts();

    const managerRow = removeViaTableBtn.closest('.managerRow');
    const emailElement = managerRow.querySelector('.email');
    const email = emailElement.textContent;

    var apiUrl = 'http://localhost:8080/OnlineStoreAppBackendAPI/webapi/myresource/removeManager';
    var formData = {
        email: email
    };

    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success === 'true') {
                document.getElementById('email2').value = "";
                document.getElementById('password').value = "";
                const alert = document.getElementById('success-alert');
                alert.innerText = "Manager Removed Successfully";
                alert.style.display = 'block';
                renderManagers();
            } else {
                const alert = document.getElementById('failure-alert');
                alert.innerText = response.errorMessage;
                alert.style.display = 'block';
            }
        },
        error: function(xhr, status, error) {
            // Handle error
            const alert = document.getElementById('failure-alert');
            alert.innerText = 'Error: ' + error;
            alert.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
 }

function updateManager(editBtn) {
    clearPreviousAlerts();

    const managerRow = editBtn.closest('.managerRow');
    
    const managerIdElement = managerRow.querySelector('.managerId');
    const managerId = managerIdElement.textContent;
    document.getElementById('managerId').value = managerId;

    const fullNameElement = managerRow.querySelector('.fullName');
    const fullName = fullNameElement.textContent;
    document.getElementById('fullName').value = fullName;

    const mobileElement = managerRow.querySelector('.mobile');
    const mobile = mobileElement.textContent.trim();
    document.getElementById('mobile2').value = mobile;

    const emailElement = managerRow.querySelector('.email');
    const email = emailElement.textContent;
    document.getElementById('email2').value = email;

    const passwordElement = managerRow.querySelector('.password');
    const password = passwordElement.textContent;
    document.getElementById('password').value = password;

    const addressElement = managerRow.querySelector('.address');
    const address = addressElement.textContent;
    document.getElementById('address').value = address;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clearPreviousAlerts() {
    const successAlert = document.getElementById('success-alert');
    successAlert.style.display = 'none';

    const failureAlert = document.getElementById('failure-alert');
    failureAlert.style.display = 'none';
}

function dismissAlert(alertId) {
    var alert = document.getElementById(alertId);
    setTimeout(function() {
        alert.style.display = 'none';
    });
}

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    return password !== "";
}
