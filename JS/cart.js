$(document).ready(renderCartItems);

function renderCartItems() {
    const alert = document.getElementById('cart-alert');
    alert.style.display = 'none';

    const tableBody = document.querySelector('#cartTable tbody');
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    const cartItems = getUsersCartsData();
    if (cartItems === null || cartItems.length === 0) {
        const cartPageContent = document.getElementById('cartPageContent');
        cartPageContent.innerHTML = `<h2 style="margin-top: 6rem; text-align: center;">No Products in Cart</h2>`;
    } else {
        let totalAmount = 0;
        cartItems.forEach(item => {
            const totalPrice = parseFloat(item.price) * parseInt(item.quantity);

            const cartTableBody = document.querySelector('#cartTable tbody');
            const cartTableBodyHtml = `
            <tr class="productRow">
                <td class="productId" style="display: none;">${item.productId}</td>
                <td><img src=${item.image_url} width="50" height="50" alt="Product Image"></td>
                <td>${item.productName}</td>
                <td>${item.category}</td>
                <td>
                    <button class="quantity-btn decrease-btn" onclick="updateQuantity(this, -1)">-</button>
                    ${item.quantity}
                    <button class="quantity-btn increase-btn" onclick="updateQuantity(this, 1)">+</button>
                </td>
                <td>INR ${parseFloat(item.price).toFixed(2)}</td>
                <td>INR ${parseFloat(totalPrice).toFixed(2)}</td>
                <td><button class="removeFromCartBtn btn btn-primary btn-sm" onclick="removeFromCart(this)">Remove</button></td>
            </tr>
            `;
            cartTableBody.innerHTML += cartTableBodyHtml;
            totalAmount += totalPrice;
        });
        const totalAmountDomELement = document.querySelector('#totalAmount')
        totalAmountDomELement.innerHTML = `<h5>Total Amount: INR ${totalAmount.toFixed(2)}</h5>`;
    }
}

function getUsersCartsData() {
    const signedInUserJsonString = localStorage.getItem('signedInUser');
    const signedInUser = JSON.parse(signedInUserJsonString);
    const email = signedInUser.email;

    const localStorageData = localStorage.getItem('usersCarts');
    const usersCarts = JSON.parse(localStorageData);
    if (usersCarts !== null) {
        if (usersCarts.hasOwnProperty(email)) {
            if (Array.isArray(usersCarts[email])) {
                return usersCarts[email];
            } else {
                return null;
            }
        } else {
            return null;
        }
    } else {
        return null;
    }
}

function updateQuantity(qtyUpdateBtn, qty) {
    const signedInUserJsonString = localStorage.getItem('signedInUser');
    const signedInUser = JSON.parse(signedInUserJsonString);
    const email = signedInUser.email;

    const productRow = qtyUpdateBtn.closest('.productRow');
    const productIdElement = productRow.querySelector('.productId');
    const productId = productIdElement.textContent;

    let cartItems = getUsersCartsData();
    const product = cartItems.find(item => item.productId === productId);
    const newQty = product.quantity + qty;
    if (newQty > 5) {
        const alert = document.getElementById('cart-alert');
        alert.innerText = 'Quantity cannot exceed 5';
        alert.style.display = 'block';
        setTimeout(function() {
            dismissAlert('cart-alert');
        }, 1000);
        return;
    }
    if (newQty === 0) {
        const alert = document.getElementById('cart-alert');
        alert.innerText = 'Quantity cannot be less than 1';
        alert.style.display = 'block';
        setTimeout(function() {
            dismissAlert('cart-alert');
        }, 1000);
        return;
    }
    cartItems.forEach(item => {
        if (item.productId === productId) {
            item.quantity = newQty;
        }
    });
    let allUsersCarts = JSON.parse(localStorage.getItem('usersCarts'));
    allUsersCarts[email] = cartItems;
    localStorage.setItem('usersCarts', JSON.stringify(allUsersCarts));
    renderCartItems();
}

function removeFromCart(removeFromCartBtn) {
    const signedInUserJsonString = localStorage.getItem('signedInUser');
    const signedInUser = JSON.parse(signedInUserJsonString);
    const email = signedInUser.email;

    const productRow = removeFromCartBtn.closest('.productRow');
    const productIdElement = productRow.querySelector('.productId');
    const productId = productIdElement.textContent;

    let cartItems = getUsersCartsData();
    const filteredCartItems = cartItems.filter(item => item.productId !== productId);

    let allUsersCarts = JSON.parse(localStorage.getItem('usersCarts'));
    allUsersCarts[email] = filteredCartItems;
    localStorage.setItem('usersCarts', JSON.stringify(allUsersCarts));
    renderCartItems();
}

function dismissAlert(alertId) {
    var alert = document.getElementById(alertId);
    setTimeout(function() {
        alert.style.display = 'none';
    });
}
