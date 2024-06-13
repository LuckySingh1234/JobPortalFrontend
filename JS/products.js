const categoryParamToCategoryNameMap = {
    'shirt': 'Shirt',
    'tshirt': 'T-Shirt',
    'pant': 'Pant',
    'saree': 'Saree',
    'chudi': 'Chudi'
}

$(document).ready(function() {
    const successAlert = document.getElementById('productAdditionSuccessAlert');
    const failureAlert = document.getElementById('productAdditionFailureAlert');
    successAlert.style.display = 'none';
    failureAlert.style.display = 'none';

    var params = new URLSearchParams(window.location.search);
    var categoryName = params.get('category');

    var apiUrl = 'http://localhost:8080/OnlineStoreAppBackendAPI/webapi/myresource/getProductsByCategory';
    var queryParams = {
        category: categoryName
    };

    $.ajax({
        url: apiUrl,
        type: 'GET',
        data: queryParams,
        success: function(response) {
            // Handle the success response
            if (response === null) {
                return;
            } else {
                response.forEach(item => {
                    const allCardsContainer = document.querySelector('#allCardsContainer')
                    const cardHtml = `
                        <div class="col-md-3 mb-4">
                            <div class="card">
                                <img src="${item.imageUrl}" width="253" height="383" class="card-img-top" alt="Product Image">
                                <div class="card-body">
                                    <p class="card-text product-id">Product ID: ${item.productId}</p>
                                    <p class="card-text product-name">Name: ${item.name}</p>
                                    <p class="card-text product-price">Price: INR ${item.price}</p>
                                    <button class="addToCartBtn btn btn-primary btn-sm" onclick="addToCart(this)">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    `;
                    allCardsContainer.innerHTML += cardHtml;
                });
            }
        },
        error: function(xhr, status, error) {
            // Handle the error response
            $('#result').html('<p>An error occurred: ' + error + '</p>');
        }
    });
});

function addToCart(addToCartBtn) {
    const signedInUserJsonString = localStorage.getItem('signedInUser');
    const signedInUser = JSON.parse(signedInUserJsonString);
    if (signedInUser === null) {
        window.location = '/signin.html';
        return;
    }

    const card = addToCartBtn.closest('.card');

    const productImage = card.querySelector('.card-img-top').getAttribute('src');
    const productIdElement = card.querySelector('.product-id');
    const productId = productIdElement.textContent.replace('Product ID: ', '').trim();
    const productNameElement = card.querySelector('.product-name');
    const productName = productNameElement.textContent.replace('Name: ', '').trim();
    const productPriceElement = card.querySelector('.product-price');
    const productPrice = productPriceElement.textContent.replace('Price: INR', '').trim();
    var params = new URLSearchParams(window.location.search);
    var category = params.get('category');
    var categoryName = categoryParamToCategoryNameMap[category];

    const newProduct = {
        image_url: productImage,
        productId: productId,
        productName: productName,
        category: categoryName,
        price: productPrice,
        quantity: 1
    };

    addItemToUsersCarts(newProduct);
}

function addItemToUsersCarts(newProduct) {
    const successAlert = document.getElementById('productAdditionSuccessAlert');
    const failureAlert = document.getElementById('productAdditionFailureAlert');
    successAlert.style.display = 'none';
    failureAlert.style.display = 'none';

    const signedInUserJsonString = localStorage.getItem('signedInUser');
    const signedInUser = JSON.parse(signedInUserJsonString);
    const localStorageData = localStorage.getItem('usersCarts');
    let data = JSON.parse(localStorageData);
    const email = signedInUser.email
    if (data !== null) {
        if (data.hasOwnProperty(email)) {
            if (Array.isArray(data[email])) {
                const productExists = data[email].some(product => product.productId === newProduct.productId);
                if (!productExists) {
                    data[email].push(newProduct);
                } else {
                    failureAlert.innerText = 'Product with this ID already exists.';
                    failureAlert.style.display = 'block';
                    setTimeout(function() {
                        dismissAlert('productAdditionFailureAlert');
                    }, 1000);
                    return;
                }
            } else {
                data[email] = [newProduct];
            }
        } else {
            data[email] = [newProduct];
        }
    } else {
        data = {[email]: [newProduct]};
    }
    const updatedDataString = JSON.stringify(data);
    localStorage.setItem('usersCarts', updatedDataString);

    successAlert.innerText = 'Product added to cart successfully';
    successAlert.style.display = 'block';
    setTimeout(function() {
        dismissAlert('productAdditionSuccessAlert');
    }, 1000);
}

function dismissAlert(alertId) {
    var alert = document.getElementById(alertId);
    setTimeout(function() {
        alert.style.display = 'none';
    });
}
