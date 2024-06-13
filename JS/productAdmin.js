const categoryParamToCategoryNameMap = {
    'shirt': 'Shirt',
    'tshirt': 'T-Shirt',
    'pant': 'Pant',
    'saree': 'Saree',
    'chudi': 'Chudi'
}

const categoryNameToCategoryParamMap = {
    'Shirt': 'shirt',
    'T-Shirt': 'tshirt',
    'Pant': 'pant',
    'Saree': 'saree',
    'Chudi': 'chudi'
}

document.addEventListener('DOMContentLoaded', (event) => {
    renderProducts("ALL");    
    document.getElementById('category-filter').addEventListener('change', function() {
        renderProducts(this.value);
    });
});

function renderProducts(category) {
    const tableBody = document.querySelector('#productAdminTable tbody');
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    var apiUrl = 'http://localhost:8080/OnlineStoreAppBackendAPI/webapi/myresource/getProductsByCategory';
    var queryParams = {
        category: category
    };

    $.ajax({
        url: apiUrl,
        type: 'GET',
        data: queryParams,
        success: function(response) {
            // Handle the success response
            if (response === null) {
                const productAdminContent = document.getElementById('productAdminContent');
                productAdminContent.innerHTML = `<h2 style="margin-top: 6rem; text-align: center;">No Products in Store</h2>`;
            } else {
                response.reverse();
                response.forEach(item => {
                    const productAdminTableBody = document.querySelector('#productAdminTable tbody');
                    const productAdminTableBodyHtml = `
                        <tr class="productRow">
                            <td><img class="imageUrl" src=${item.imageUrl} width="50" height="50" alt="Product Image"></td>
                            <td class="productId">${item.productId}</td>
                            <td class="name">${item.name}</td>
                            <td class="category">${categoryParamToCategoryNameMap[item.category]}</td>
                            <td class="stockQuantity">${item.stockQuantity}</td>
                            <td class="price">INR ${parseFloat(item.price).toFixed(2)}</td>
                            <td><button class="editBtn btn btn-warning btn-sm" style="width: 75px;" onclick="updateProduct(this)">Edit</button></td>
                            <td><button class="removeBtn btn btn-danger btn-sm" style="width: 75px;" onclick="removeProductViaTable(this)">Remove</button></td>
                        </tr>
                    `;
                    productAdminTableBody.innerHTML += productAdminTableBodyHtml;
                });
            }
        },
        error: function(xhr, status, error) {
            // Handle the error response
        }
    });
}

function viewProduct() {
    clearPreviousAlerts();

    const productId = document.getElementById('productId').value.trim();
    if (!isValidProductId(productId)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Product Id does not match the pattern';
        alert.style.display = 'block';
        return;
    }

    var apiUrl = 'http://localhost:8080/OnlineStoreAppBackendAPI/webapi/myresource/getProductById';
    var formData = {
        productId: productId
    };

    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success === 'true') {
                document.getElementById('productId').value = response.productId;
                document.getElementById('name2').value = response.name;
                document.getElementById('price').value = response.price;
                document.getElementById('stockQuantity').value = response.stockQuantity;
                document.getElementById('category').value = response.category;
                document.getElementById('imageUrl').value = response.imageUrl;
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

function addProduct() {
    clearPreviousAlerts();

    const productId = document.getElementById('productId').value.trim();
    // if (!isValidProductId(productId)) {
    //     const alert = document.getElementById('failure-alert');
    //     alert.innerText = 'Product Id does not match the pattern';
    //     alert.style.display = 'block';
    //     return;
    // }
    if (productId !== '') {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'You cannot provide Product Id while adding product';
        alert.style.display = 'block';
        return;
    }

    const name = document.getElementById('name2').value.trim();
    if (!isValidProductName(name)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Product Name does not match the pattern';
        alert.style.display = 'block';
        return;
    }

    const price = document.getElementById('price').value.trim();
    if (!isValidPrice(price)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Product Price should a positive decimal value';
        alert.style.display = 'block';
        return;
    }

    const stockQuantity = document.getElementById('stockQuantity').value.trim();
    if (!isValidStockQuantity(stockQuantity)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Product Stock Quantity should a positive integer value';
        alert.style.display = 'block';
        return;
    }

    const category = document.getElementById('category').value.trim();
    if (!isValidCategory(category)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Product Category is Invalid';
        alert.style.display = 'block';
        return;
    }

    const imageUrl = document.getElementById('imageUrl').value.trim();

    var apiUrl = 'http://localhost:8080/OnlineStoreAppBackendAPI/webapi/myresource/addProduct';
    var formData = {
        name: name,
        price: price,
        stockQuantity: stockQuantity,
        category: category,
        imageUrl: imageUrl
    };

    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success === 'true') {
                document.getElementById('productId').value = "";
                document.getElementById('name2').value = "";
                document.getElementById('price').value = "";
                document.getElementById('stockQuantity').value = "";
                document.getElementById('category').value = "";
                document.getElementById('imageUrl').value = "";
                const alert = document.getElementById('success-alert');
                alert.innerText = "Product Added Successfully";
                alert.style.display = 'block';
                renderProducts(document.getElementById('category-filter').value);
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

function editProduct() {
    clearPreviousAlerts();
    const productId = document.getElementById('productId').value.trim();
    if (!isValidProductId(productId)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Product Id does not match the pattern';
        alert.style.display = 'block';
        return;
    }

    const name = document.getElementById('name2').value.trim();
    if (!isValidProductName(name)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Product Name does not match the pattern';
        alert.style.display = 'block';
        return;
    }

    const price = document.getElementById('price').value.trim();
    if (!isValidPrice(price)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Product Price should a positive decimal value';
        alert.style.display = 'block';
        return;
    }

    const stockQuantity = document.getElementById('stockQuantity').value.trim();
    if (!isValidStockQuantity(stockQuantity)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Product Stock Quantity should a positive integer value';
        alert.style.display = 'block';
        return;
    }

    const category = document.getElementById('category').value.trim();
    if (!isValidCategory(category)) {
        const alert = document.getElementById('failure-alert');
        alert.innerText = 'Product Category is Invalid';
        alert.style.display = 'block';
        return;
    }

    const imageUrl = document.getElementById('imageUrl').value.trim();

    var apiUrl = 'http://localhost:8080/OnlineStoreAppBackendAPI/webapi/myresource/editProduct';
    var formData = {
        productId: productId,
        name: name,
        price: price,
        stockQuantity: stockQuantity,
        category: category,
        imageUrl: imageUrl
    };

    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success === 'true') {
                document.getElementById('productId').value = "";
                document.getElementById('name2').value = "";
                document.getElementById('price').value = "";
                document.getElementById('stockQuantity').value = "";
                document.getElementById('category').value = "";
                document.getElementById('imageUrl').value = "";
                const alert = document.getElementById('success-alert');
                alert.innerText = "Product Edited Successfully";
                alert.style.display = 'block';
                renderProducts(document.getElementById('category-filter').value);
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

 function removeProductViaTable(removeViaTableBtn) {
    clearPreviousAlerts();

    const productRow = removeViaTableBtn.closest('.productRow');
    const productIdElement = productRow.querySelector('.productId');
    const productId = productIdElement.textContent;

    var apiUrl = 'http://localhost:8080/OnlineStoreAppBackendAPI/webapi/myresource/removeProduct';
    var formData = {
        productId: productId
    };

    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success === 'true') {
                document.getElementById('productId').value = "";
                document.getElementById('name2').value = "";
                document.getElementById('price').value = "";
                document.getElementById('stockQuantity').value = "";
                document.getElementById('category').value = "";
                document.getElementById('imageUrl').value = "";
                const alert = document.getElementById('success-alert');
                alert.innerText = "Product Removed Successfully";
                alert.style.display = 'block';
                renderProducts(document.getElementById('category-filter').value);
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

function updateProduct(editBtn) {
    clearPreviousAlerts();

    const productRow = editBtn.closest('.productRow');
    
    const productIdElement = productRow.querySelector('.productId');
    const productId = productIdElement.textContent;
    document.getElementById('productId').value = productId;

    const productNameElement = productRow.querySelector('.name');
    const productName = productNameElement.textContent;
    document.getElementById('name2').value = productName;

    const priceElement = productRow.querySelector('.price');
    const price = priceElement.textContent.replace('INR', '').trim();
    document.getElementById('price').value = price;

    const stockQuantityElement = productRow.querySelector('.stockQuantity');
    const stockQuantity = stockQuantityElement.textContent;
    document.getElementById('stockQuantity').value = stockQuantity;

    const categoryElement = productRow.querySelector('.category');
    const category = categoryElement.textContent;
    document.getElementById('category').value = categoryNameToCategoryParamMap[category];

    const imageUrlElement = productRow.querySelector('.imageUrl');
    const imageUrl = imageUrlElement.getAttribute('src');
    document.getElementById('imageUrl').value = imageUrl;

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

function isValidProductId(productId) {
    const productIdRegex = /^P#[0-9]{5}$/;
    return productIdRegex.test(productId);
}

function isValidProductName(productName) {
    const productNameRegex = /^[A-Za-z0-9\s-]{1,20}$/;
    return productNameRegex.test(productName);
}

function isValidPrice(price) {
    const floatPattern = /^(?!0\d)\d+(\.\d+)?$/;
    const num = Number(price);
    return floatPattern.test(price) && num > 1;
}

function isValidStockQuantity(stockQuantity) {
    const num = Number(stockQuantity);
    return Number.isInteger(num) && num > 0;
}

function isValidCategory(category) {
    return categoryParamToCategoryNameMap.hasOwnProperty(category);
}
