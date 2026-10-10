/* ============================================================
   ECOM - DASHBOARD SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ==========================================================
    // 1. تبويب الويشليست (Wishlist) - جلب وعرض المنتجات
    // ==========================================================
    const wishlistBody = document.getElementById('wishlist-body');
    const emptyWishlistMsg = document.getElementById('empty-wishlist-msg');

    function renderWishlist() {
        if (!wishlistBody) return;

        // جلب البيانات من ذاكرة المتصفح (localStorage)
        let wishlist = JSON.parse(localStorage.getItem('myWishlist')) || [];

        if (wishlist.length === 0) {
            wishlistBody.innerHTML = '';
            emptyWishlistMsg.style.display = 'block';
            return;
        }

        emptyWishlistMsg.style.display = 'none';
        wishlistBody.innerHTML = ''; 

        wishlist.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.image || 'https://via.placeholder.com/50'}" class="product-thumb" alt="${item.name}">
                        <div>
                            <div class="fw-bold text-dark" style="font-size: 14px;">${item.name}</div>
                            <div class="text-warning" style="font-size: 12px;">⭐⭐⭐⭐⭐ <span class="text-muted">(4.5)</span></div>
                        </div>
                    </div>
                </td>
                <td class="fw-bold text-dark">$${item.price}</td>
                <td><span class="stock-badge">${item.stock || 'In Stock'}</span></td>
                <td><button class="btn-add-cart">Add to Cart</button></td>
                <td>
                    <button class="btn-remove" onclick="removeFromWishlist('${item.id}')" title="Remove">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            wishlistBody.appendChild(tr);
        });
    }

    // دالة حذف منتج من الويشليست (متاحة عالمياً ليتم استدعاؤها من الـ HTML)
    window.removeFromWishlist = function(id) {
        let wishlist = JSON.parse(localStorage.getItem('myWishlist')) || [];
        wishlist = wishlist.filter(item => item.id !== id);
        localStorage.setItem('myWishlist', JSON.stringify(wishlist));
        renderWishlist();
    };

    // تشغيل دالة عرض الويشليست عند تحميل الصفحة
    renderWishlist();


    // ==========================================================
    // 2. تبويب الطلبات (Orders) - عرض الطلبات
    // ==========================================================
    const ordersContainer = document.getElementById('ordersContainer');

    // بيانات تجريبية للطلبات (يمكن استبدالها ببيانات حقيقية من API)
    const ordersData = [
        {
            id: "EWFDSAFI321655",
            date: "18 September 2022",
            status: "Delivery in progress",
            items: [
                { name: "Samsung 36\" French door 28 cu. ft. Smart Energy Star Refrigerator", qty: "01", price: "$2.51", img: "https://via.placeholder.com/60" },
                { name: "Samsung 36\" French door 28 cu. ft. Smart Energy Star Refrigerator", qty: "01", price: "$2.51", img: "https://via.placeholder.com/60" }
            ]
        },
        {
            id: "EWFDSAFI321656",
            date: "18 September 2022",
            status: "Delivered",
            items: [
                { name: "Samsung 36\" French door 28 cu. ft. Smart Energy Star Refrigerator", qty: "01", price: "$2.51", img: "https://via.placeholder.com/60" },
                { name: "Samsung 36\" French door 28 cu. ft. Smart Energy Star Refrigerator", qty: "01", price: "$2.51", img: "https://via.placeholder.com/60" }
            ]
        },
        {
            id: "EWFDSAFI321657",
            date: "18 September 2022",
            status: "Canceled",
            items: [
                { name: "Samsung 36\" French door 28 cu. ft. Smart Energy Star Refrigerator", qty: "01", price: "$2.51", img: "https://via.placeholder.com/60?text=Error" },
                { name: "Samsung 36\" French door 28 cu. ft. Smart Energy Star Refrigerator", qty: "01", price: "$2.51", img: "https://via.placeholder.com/60?text=Error" }
            ]
        }
    ];

    function renderOrders() {
        if (!ordersContainer) return;
        ordersContainer.innerHTML = '';

        ordersData.forEach(order => {
            // تحديد لون الشارة
            let badgeClass = '';
            if (order.status === 'Delivery in progress') badgeClass = 'badge-orange';
            else if (order.status === 'Delivered') badgeClass = 'badge-green';
            else if (order.status === 'Canceled') badgeClass = 'badge-red';

            // بناء صفوف المنتجات
            let itemsHTML = '';
            order.items.forEach(item => {
                itemsHTML += `
                    <div class="item-row">
                        <div class="item-image">
                            <img src="${item.img}" alt="Product">
                        </div>
                        <div class="item-title">${item.name}</div>
                        <div class="item-quantity">Quantity: ${item.qty}</div>
                        <div class="item-price">${item.price}</div>
                    </div>
                `;
            });

            // بناء بطاقة الطلب
            const orderCardHTML = `
                <div class="order-card">
                    <div class="order-header">
                        <div class="header-left">
                            <span class="order-id">Order ID: #${order.id}</span>
                            <span class="order-date">Date: ${order.date}</span>
                        </div>
                        <div class="header-right">
                            <span class="status-badge ${badgeClass}">${order.status}</span>
                            <button class="view-btn">View Order</button>
                        </div>
                    </div>
                    <div class="order-items">
                        ${itemsHTML}
                    </div>
                </div>
            `;

            ordersContainer.insertAdjacentHTML('beforeend', orderCardHTML);
        });
    }

    // تشغيل دالة عرض الطلبات عند تحميل الصفحة
    renderOrders();


    // ==========================================================
    // 3. تبويب الإعدادات (Settings) - التفاعل مع النماذج
    // ==========================================================
    const saveBtn = document.getElementById('saveBtn');
    const defaultBtn = document.getElementById('defaultBtn');

    // التعامل مع زر "Save change"
    if (saveBtn) {
        saveBtn.addEventListener('click', function(event) {
            event.preventDefault(); // منع إعادة تحميل الصفحة
            
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            
            if (!fullname || !email) {
                alert('Please fill in all required fields marked with *');
                return;
            }
            
            alert('Changes saved successfully!');
            // هنا يمكنك إرسال البيانات إلى الخادم باستخدام fetch
        });
    }

    // التعامل مع زر "Set as Default"
    if (defaultBtn) {
        defaultBtn.addEventListener('click', function() {
            const originalText = this.innerText;
            this.innerText = 'Setting...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerText = 'Default Set!';
                this.style.backgroundColor = '#10b981';
                this.style.color = '#ffffff';
                this.style.borderColor = '#10b981';
                
                setTimeout(() => {
                    this.innerText = originalText;
                    this.style.backgroundColor = '#ffffff';
                    this.style.color = '#2c3e50';
                    this.style.borderColor = '#cbd5e1';
                    this.disabled = false;
                }, 2000);
            }, 800);
        });
    }

    // التحقق من صحة الإدخالات في الوقت الفعلي (اختياري)
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.style.borderColor = '#10b981'; // لون أخضر عند الملء
            } else {
                this.style.borderColor = '#cbd5e1'; // لون رمادي عند الفراغ
            }
        });
    });

});