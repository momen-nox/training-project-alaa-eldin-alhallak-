
// 1. عند تحميل الصفحة، أول شي بنجيب العناصر من الـ HTML بواسطة الـ ID
let cartBadge = document.getElementById("cart-count");
let wishlistBadge = document.getElementById("wishlist-count");

// 2. بنجيب الأرقام القديمة المخزنة بالـ localStorage
let savedCart = parseInt(localStorage.getItem("cart")) || 0;
let savedWishlist = parseInt(localStorage.getItem("wishlist")) || 0;

// 3. بنعرض الأرقام فوراً بالهيدر أول ما نفتح الصفحة
if (cartBadge) {
    cartBadge.textContent = savedCart;
}
if (wishlistBadge) {
    wishlistBadge.textContent = savedWishlist;
}

// ----------------------------------------------------

// 4. جلب جميع أزرار "إضافة للسلة"
let cartButtons = document.querySelectorAll(".btn-add-cart");

// 5. عمل استماع لكل زر من أزرار السلة بشكل عادي ومباشر
cartButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
        // نمنع الانتقال الفوري عشان ما يعيد تحميل الصفحة قبل ما يزيد الرقم
        event.preventDefault();

        // أ) جلب الرقم الحالي وزيادته 1
        let currentCart = parseInt(localStorage.getItem("cart")) || 0;
        let newCartCount = currentCart + 1;

        // ب) حفظ الرقم الجديد بالذاكرة
        localStorage.setItem("cart", newCartCount);

        // ج) تحديث الرقم بالهيدر فوراً قدام عينك بدون ريفرش
        if (cartBadge) {
            cartBadge.textContent = newCartCount;
        }

        // د) الانتقال للصفحة المطلوبة بعد ما تحدث الرقم
        let targetUrl = button.getAttribute("href");
        if (targetUrl && targetUrl !== "#") {
            window.location.href = targetUrl;
        }
    });
});

// ----------------------------------------------------

// 6. جلب جميع أزرار "المفضلة" (القلب)
let wishlistButtons = document.querySelectorAll(".hover-actions a:first-child");

// 7. عمل استماع لكل زر من أزرار المفضلة
wishlistButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
        // نمنع الانتقال الفوري
        event.preventDefault();

        // أ) جلب الرقم الحالي وزيادته 1
        let currentWishlist = parseInt(localStorage.getItem("wishlist")) || 0;
        let newWishlistCount = currentWishlist + 1;

        // ب) حفظ الرقم الجديد بالذاكرة
        localStorage.setItem("wishlist", newWishlistCount);

        // ج) تحديث الرقم بالهيدر فوراً
        if (wishlistBadge) {
            wishlistBadge.textContent = newWishlistCount;
        }

        // د) الانتقال للصفحة المطلوبة
        let targetUrl = button.getAttribute("href");
        if (targetUrl && targetUrl !== "#") {
            window.location.href = targetUrl;
        }
    });
});

var products = document.querySelectorAll(".addtocart");
var productItem = document.querySelector(".cart-list");
var btn = document.querySelector("#cal-btn");
var total = document.querySelector(".total");
var totalPrice = 0;
var productTitle = null


// loop with forEach
products.forEach(function (el) {
    el.onclick = function () {
        productTitle = el.getAttribute('title');
        totalPrice += +(el.getAttribute('price'));
        productItem.innerHTML += '<li>' + productTitle + '</li>';

        if (productItem.innerHTML != '') {
            btn.style.display = 'block';
        }

        btn.onclick = function () {
            total.innerHTML = totalPrice;
        }

    }
})



