// ================= دوال تحديث العدد عند الأيقونات =================
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

const cart = JSON.parse(localStorage.getItem('cart')) || [];

const orderItems = document.querySelector('#order-items');
const orderSubtotal = document.querySelector('#order-subtotal');
const orderTotal = document.querySelector('#order-total');

let total = 0;

// إذا السلة فاضية
if (cart.length === 0) {
    orderItems.innerHTML = `<p class="text-secondary mb-0">Your cart is empty</p>`;
}

cart.forEach(function (product) {

    const itemTotal = product.price * product.quantity;
    total += itemTotal;


    orderItems.innerHTML += `
        <div class="border rounded p-3 mb-3 d-flex align-items-center gap-3">

            <img src="${product.image}"
                 alt="${product.name}"
                 class="img-fluid flex-shrink-0"
                 style="width: 90px;">

            <div class="flex-grow-1">
                <h6 class="fw-bold mb-1" style="color: rgba(52, 52, 116, 0.809);">
                    ${product.name}
                </h6>

                <div class="text-warning small">
                    ★★★★★
                    <span class="text-secondary">(${product.reviews})</span>
                </div>
            </div>

            <div class="text-primary fw-bold">x${product.quantity}</div>

            <div class="fw-bold fs-5 text-end" style="color: rgba(52, 52, 116, 0.809);">
                $${itemTotal.toFixed(2)}
            </div>

        </div>
    `;
});


if (orderSubtotal) {
    orderSubtotal.textContent = `$${total.toFixed(2)}`;
}
orderTotal.textContent = `$${total.toFixed(2)}`;


const applyBtn = document.getElementById('apply-btn');

if (applyBtn) {
    applyBtn.addEventListener('click', function () {

        localStorage.removeItem('cart');


        orderItems.innerHTML = `<p class="text-secondary mb-0">Your cart is empty</p>`;

        if (orderSubtotal) {
            orderSubtotal.textContent = '$0.00';
        }
        orderTotal.textContent = '$0.00';

        // نحدّث الرقم عند أيقونة السلة
        updateAllBadges();
    });
}