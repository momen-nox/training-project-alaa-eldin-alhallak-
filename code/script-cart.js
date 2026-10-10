
function updateBadge(storageKey, badgeId) {
    const items = JSON.parse(localStorage.getItem(storageKey)) || [];
    const badge = document.getElementById(badgeId);

    if (badge) {
        badge.textContent = items.length;
    }
}

function updateAllBadges() {
    updateBadge('wish', 'wish-count');
    updateBadge('cart', 'cart-count');
}

updateAllBadges(); 
// ========================================================================

const savedCart = localStorage.getItem('cart');

console.log(savedCart);


const cart = JSON.parse(savedCart) || [];

let cartTotal = 0;

console.log(cart);

cart.forEach(function(product) {

    cartTotal += product.price * product.quantity;

const cartProducts = document.querySelector('#cart-products');

if (cartProducts) {
    cartProducts.innerHTML += `
    <div class="border rounded p-3 cart-item" data-id="${product.id}">
        <div class="row align-items-center">

            <div class="col-md-4">
                <div class="d-flex align-items-center">
                    <img src="${product.image}" style="width: 100px;" class="me-3">

                    <div>
                        <h6>${product.name}</h6>

                        <div class="text-warning">
                            ★★★★★
                            <span class="text-secondary">(${product.reviews})</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-2">
                <span class="fw-bold">$${product.price}</span>
            </div>
            
            <div class="col-md-2">
                <button
                    class="btn btn-outline-secondary btn-decrease"
                    data-id="${product.id}">
                    -
                </button>

                    <span class="mx-2 quantity" data-id="${product.id}">
                        ${product.quantity}
                    </span>
                   

                <button
                    class="btn btn-outline-primary btn-increase"
                    data-id="${product.id}">
                    +
                </button>

            </div> 

            <div class="col-md-2">
                <span class="fw-bold product-total-price" data-id="${product.id}">
                    $${product.price * product.quantity}
                </span>
            </div>

            <div class="col-md-2 text-end">
                <button
                    class="btn btn-outline-danger btn-remove-product"
                    data-id="${product.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>




        </div>
    </div>
`;
}});

const cartTotalElement = document.querySelector('#cart-total');
cartTotalElement.textContent = `$${cartTotal}`;

const increaseButtons = document.querySelectorAll('.btn-increase');
increaseButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const productId = button.dataset.id;
        const productIndex = cart.findIndex(function(product) {
    return product.id === productId;
});

if (!cart[productIndex].quantity) {
    cart[productIndex].quantity = 1;
}

cart[productIndex].quantity++;
const quantity = document.querySelector(`.quantity[data-id="${productId}"]`);

quantity.textContent = cart[productIndex].quantity;

const productTotalPrice = document.querySelector(`.product-total-price[data-id="${productId}"]`);
productTotalPrice.textContent = `$${cart[productIndex].price * cart[productIndex].quantity}`;

cartTotal = 0;
cart.forEach(function(product) {
    cartTotal += product.price * product.quantity;
});
cartTotalElement.textContent = `$${cartTotal}`;

console.log('productId:', productId);
console.log('quantity element:', quantity);

localStorage.setItem('cart', JSON.stringify(cart));
console.log(quantity.textContent);
});

});

const decreaseButtons = document.querySelectorAll('.btn-decrease');
decreaseButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const productId = button.dataset.id;
        const productIndex = cart.findIndex(function(product) {
            
    return product.id === productId;
});
if (cart[productIndex].quantity > 1) {
    cart[productIndex].quantity--;
}
const quantity = document.querySelector(`.quantity[data-id="${productId}"]`);
quantity.textContent = cart[productIndex].quantity;

const productTotalPrice = document.querySelector(`.product-total-price[data-id="${productId}"]`);
productTotalPrice.textContent = `$${cart[productIndex].price * cart[productIndex].quantity}`;

cartTotal = 0;

cart.forEach(function(product) {
    cartTotal += product.price * product.quantity;
});

cartTotalElement.textContent = `$${cartTotal}`;

localStorage.setItem('cart', JSON.stringify(cart));

    });
});





const removeButtons = document.querySelectorAll('.btn-remove-product');

removeButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const productId = button.dataset.id;
        const productIndex = cart.findIndex(function(product) {
    return product.id === productId;
    });
        cart.splice(productIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateAllBadges(); 

        const cartItem = document.querySelector(`.cart-item[data-id="${productId}"]`);

cartItem.remove();

});

});





const checkoutBtn = document.getElementById('checkout-btn');

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {

        // إذا السلة فاضية لا ننتقل
        if (cart.length === 0) {
            alert('السلة فارغة');
            return;
        }

        window.location.href = 'checkout.html';
    });
}