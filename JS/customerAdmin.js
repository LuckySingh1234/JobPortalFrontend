document.addEventListener('DOMContentLoaded', (event) => {
    renderCustomers();    
});

function renderCustomers() {
    const tableBody = document.querySelector('#customerAdminTable tbody');
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    var apiUrl = 'http://localhost:8080/OnlineStoreAppBackendAPI/webapi/myresource/getCustomers';

    $.ajax({
        url: apiUrl,
        type: 'GET',
        success: function(response) {
            // Handle the success response
            if (response === null) {
                const customerAdminContent = document.getElementById('customerAdminContent');
                customerAdminContent.innerHTML = `<h2 style="margin-top: 6rem; text-align: center;">No Customers Registered in Store</h2>`;
            } else {
                response.reverse();
                response.forEach(item => {
                    const customerAdminTableBody = document.querySelector('#customerAdminTable tbody');
                    const customerAdminTableBodyHtml = `
                        <tr class="customerRow">
                            <td class="customerId">${item.customerId}</td>
                            <td class="fullName">${item.fullName}</td>
                            <td class="mobile">${item.mobile}</td>
                            <td class="email">${item.email}</td>
                            <td class="password">${item.password}</td>
                            <td class="address">${item.address}</td>
                            <td class="py-2"><button class="editBtn btn btn-warning btn-sm" style="width: 75px;" onclick="updateCustomer(this)">Edit</button></td>
                            <td class="py-2"><button class="removeBtn btn btn-danger btn-sm" style="width: 75px;" onclick="removeCustomerViaTable(this)">Remove</button></td>
                        </tr>
                    `;
                    customerAdminTableBody.innerHTML += customerAdminTableBodyHtml;
                });
            }
        },
        error: function(xhr, status, error) {
            // Handle the error response
        }
    });
}

function viewCustomer() {
    clearPreviousAlerts();

    const customerId = document.getElementById('customerId').value.trim();
    if (!isValidCustomerId(customerId)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Customer Id does not match the pattern';
        alert.style.display = 'block';
        return;
    }

    var apiUrl = 'http://localhost:8080/OnlineStoreAppBackendAPI/webapi/myresource/getCustomerById';
    var formData = {
        customerId: customerId
    };

    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success === 'true') {
                document.getElementById('customerId').value = response.customerId;
                document.getElementById('fullName').value = response.fullName;
                document.getElementById('mobile2').value = response.mobile;
                document.getElementById('email2').value = response.email;
                document.getElementById('password').value = response.password;
                document.getElementById('address').value = response.address;
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

function addCustomer() {
    clearPreviousAlerts();

    const customerId = document.getElementById('customerId').value.trim();
    if (customerId !== '') {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'You cannot provide Customer Id while adding customer';
        alert.style.display = 'block';
        return;
    }

    const fullName = document.getElementById('fullName').value.trim();
    if (!isValidName(fullName)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Customer Name does not match the pattern';
        alert.style.display = 'block';
        return;
    }

    const mobile = document.getElementById('mobile2').value.trim();
    if (!isValidMobile(mobile)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Customer Mobile Number does not match the pattern';
        alert.style.display = 'block';
        return;
    }

    const email = document.getElementById('email2').value.trim();
    if (!isValidEmail(email)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Customer Email does not match the pattern';
        alert.style.display = 'block';
        return;
    }

    const password = document.getElementById('password').value.trim();
    if (!isValidPassword(password)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Customer Password is Invalid';
        alert.style.display = 'block';
        return;
    }

    const address = document.getElementById('address').value.trim();
    if (!isValidAddress(address)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Customer Address is Invalid';
        alert.style.display = 'block';
        return;
    }

    var apiUrl = 'http://localhost:8080/OnlineStoreAppBackendAPI/webapi/myresource/addCustomer';
    var formData = {
        customerId: customerId,
        fullName: fullName,
        mobile: mobile,
        email: email,
        password: password,
        address: address
    };

    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success === 'true') {
                document.getElementById('customerId').value = "";
                document.getElementById('fullName').value = "";
                document.getElementById('mobile2').value = "";
                document.getElementById('email2').value = "";
                document.getElementById('password').value = "";
                document.getElementById('address').value = "";
                const alert = document.getElementById('success-alert');
                alert.innerText = "Customer Added Successfully";
                alert.style.display = 'block';
                renderCustomers();
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

function editCustomer() {
    clearPreviousAlerts();
    const customerId = document.getElementById('customerId').value.trim();
    if (!isValidCustomerId(customerId)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Customer Id does not match the pattern';
        alert.style.display = 'block';
        return;
    }

    const fullName = document.getElementById('fullName').value.trim();
    if (!isValidName(fullName)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Customer Name does not match the pattern';
        alert.style.display = 'block';
        return;
    }

    const mobile = document.getElementById('mobile2').value.trim();
    if (!isValidMobile(mobile)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Mobile Number should contain only 10 digits';
        alert.style.display = 'block';
        return;
    }

    const email = document.getElementById('email2').value.trim();
    if (!isValidEmail(email)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Customer E-mail is invalid';
        alert.style.display = 'block';
        return;
    }

    const password = document.getElementById('password').value.trim();
    if (!isValidPassword(password)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Customer Password is Invalid';
        alert.style.display = 'block';
        return;
    }

    const address = document.getElementById('address').value.trim();
    if (!isValidAddress(address)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Customer Address is Invalid';
        alert.style.display = 'block';
        return;
    }

    var apiUrl = 'http://localhost:8080/OnlineStoreAppBackendAPI/webapi/myresource/editCustomer';
    var formData = {
        customerId: customerId,
        fullName: fullName,
        mobile: mobile,
        email: email,
        password: password,
        address: address
    };

    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success === 'true') {
                document.getElementById('customerId').value = "";
                document.getElementById('fullName').value = "";
                document.getElementById('mobile2').value = "";
                document.getElementById('email2').value = "";
                document.getElementById('password').value = "";
                document.getElementById('address').value = "";
                const alert = document.getElementById('success-alert');
                alert.innerText = "Customer Edited Successfully";
                alert.style.display = 'block';
                renderCustomers();
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

 function removeCustomerViaTable(removeViaTableBtn) {
    clearPreviousAlerts();

    const customerRow = removeViaTableBtn.closest('.customerRow');
    const customerIdElement = customerRow.querySelector('.customerId');
    const customerId = customerIdElement.textContent;

    var apiUrl = 'http://localhost:8080/OnlineStoreAppBackendAPI/webapi/myresource/removeCustomer';
    var formData = {
        customerId: customerId
    };

    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success === 'true') {
                document.getElementById('customerId').value = "";
                document.getElementById('fullName').value = "";
                document.getElementById('mobile2').value = "";
                document.getElementById('email2').value = "";
                document.getElementById('password').value = "";
                document.getElementById('address').value = "";
                const alert = document.getElementById('success-alert');
                alert.innerText = "Customer Removed Successfully";
                alert.style.display = 'block';
                renderCustomers();
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

function updateCustomer(editBtn) {
    clearPreviousAlerts();

    const customerRow = editBtn.closest('.customerRow');
    
    const customerIdElement = customerRow.querySelector('.customerId');
    const customerId = customerIdElement.textContent;
    document.getElementById('customerId').value = customerId;

    const fullNameElement = customerRow.querySelector('.fullName');
    const fullName = fullNameElement.textContent;
    document.getElementById('fullName').value = fullName;

    const mobileElement = customerRow.querySelector('.mobile');
    const mobile = mobileElement.textContent.trim();
    document.getElementById('mobile2').value = mobile;

    const emailElement = customerRow.querySelector('.email');
    const email = emailElement.textContent;
    document.getElementById('email2').value = email;

    const passwordElement = customerRow.querySelector('.password');
    const password = passwordElement.textContent;
    document.getElementById('password').value = password;

    const addressElement = customerRow.querySelector('.address');
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

function isValidCustomerId(customerId) {
    const customerIdRegex = /^C#[0-9]{5}$/;
    return customerIdRegex.test(customerId);
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

function isValidAddress(address) {
    return address !== "";
}
