
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
// =======================================================================

const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(function(button) {
    button.addEventListener('click', function() {

        const product = {
            id: button.dataset.id,
            quantity: 1,
            name: button.dataset.name,
            price: button.dataset.price,
            rating: button.dataset.rating,
            reviews: button.dataset.reviews,
            stock: button.dataset.stock,
            brand: button.dataset.brand,
            image: button.dataset.image
        };

        let wish = JSON.parse(localStorage.getItem('wish')) || [];

        const productExists = wish.some(function(item) {
            return item.id === product.id;
        });

        if (!productExists) {
            wish.push(product);
        }

        localStorage.setItem('wish', JSON.stringify(wish));
        updateAllBadges(); 
    });
});

const savedCart = localStorage.getItem('wish');

console.log(savedCart);


const wishList = JSON.parse(savedCart) || [];

console.log(wishList);

wishList.forEach(function(product) {

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
                <span class="badge bg-secondary text-light">${product.stock}</span>
            </div>
            <div class="col-md-2">
                <button
                class="btn btn-outline-primary btn-wishlist-cart"
                data-id="${product.id}">
                    Add To Cart
                </button>
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

const wishlistCartButtons = document.querySelectorAll('.btn-wishlist-cart');
wishlistCartButtons.forEach(function(button) {

    console.log('Wishlist Add To Cart clicked');
    button.addEventListener('click', function() {
        const productId = button.dataset.id;

        const productIndex = wishList.findIndex(function(product) {
    return product.id === productId;
});
const product = wishList[productIndex];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const productExists = cart.some(function(item) {
    return item.id === product.id;
});
if (!productExists) {
    cart.push(product);
}
localStorage.setItem('cart', JSON.stringify(cart));
wishList.splice(productIndex, 1);
localStorage.setItem('wish', JSON.stringify(wishList));
updateAllBadges();
const cartItem = document.querySelector(`.cart-item[data-id="${productId}"]`);
cartItem.remove();

});

});

const removeButtons = document.querySelectorAll('.btn-remove-product');

removeButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const productId = button.dataset.id;
        const productIndex = wishList.findIndex(function(product) {
    return product.id === productId;
    });
        wishList.splice(productIndex, 1);
        localStorage.setItem('wish', JSON.stringify(wishList));
        updateAllBadges(); 

        const cartItem = document.querySelector(`.cart-item[data-id="${productId}"]`);

cartItem.remove();

});

});