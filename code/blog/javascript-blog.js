/* ============================================================
   ECOM - SCRIPT.JS (النسخة النهائية والمصححة)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ==========================================================
    // 1. TOOLTIPS
    // ==========================================================
    document.querySelectorAll('[data-tooltip]').forEach(function (el) {
        new bootstrap.Tooltip(el, {
            title: el.getAttribute('data-tooltip'),
            placement: 'left',
            trigger: 'hover'
        });
    });

    // ==========================================================
    // 2. TOOLBAR BUTTONS (Grid/List) & DROPDOWNS
    // ==========================================================
    const gridBtn = document.getElementById('gridBtn');
    const listBtn = document.getElementById('listBtn');

    if (gridBtn) {
        gridBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.classList.add('active');
            if(listBtn) listBtn.classList.remove('active');
        });
    }

    if (listBtn) {
        listBtn.addEventListener('click', function() {
            window.location.href = 'blog-list.html'; // تأكد من وجود هذا الملف
            this.classList.add('active');
            if(gridBtn) gridBtn.classList.remove('active');
        });
    }

    // ==========================================================
    // 3. تحديث النصوص في القوائم المنسدلة (Sort by / Show)
    // ==========================================================
    const sortBySelect = document.getElementById('sortBy');
    const sortByLabel = document.getElementById('sortByLabel');

    if (sortBySelect && sortByLabel) {
        sortBySelect.addEventListener('change', function() {
            sortByLabel.textContent = this.options[this.selectedIndex].text;
        });
    }

    const showItemsSelect = document.getElementById('showItems');
    const showItemsLabel = document.getElementById('showItemsLabel');

    if (showItemsSelect && showItemsLabel) {
        showItemsSelect.addEventListener('change', function() {
            showItemsLabel.textContent = this.options[this.selectedIndex].text;
        });
    }

    // ==========================================================
    // 4. SCROLL BUTTONS (للمنتجات الأفقية إن وجدت)
    // ==========================================================
    var scrollStep = 300;
    function bindScrollButtons(prevId, nextId, contentId) {
        var prevBtn = document.getElementById(prevId);
        var nextBtn = document.getElementById(nextId);
        var contentEl = contentId ? document.getElementById(contentId) : null;
        if (!prevBtn || !nextBtn) return;

        function getActiveRow() {
            var container = contentEl || document;
            var activePane = container.querySelector('.tab-pane.active');
            if (!activePane) return null;
            return activePane.querySelector('.row.g-3');
        }

        function updateButtons() {
            var row = getActiveRow();
            if (!row) return;
            prevBtn.disabled = row.scrollLeft <= 0;
            nextBtn.disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 1;
        }

        prevBtn.addEventListener('click', function () {
            var row = getActiveRow();
            if (row) row.scrollBy({ left: -scrollStep, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', function () {
            var row = getActiveRow();
            if (row) row.scrollBy({ left: scrollStep, behavior: 'smooth' });
        });

        var container = contentEl || document;
        container.querySelectorAll('.row.g-3').forEach(function (row) {
            row.addEventListener('scroll', updateButtons);
        });

        window.addEventListener('resize', updateButtons);
        updateButtons();
    }

    bindScrollButtons('scrollPrevBtn1', 'scrollNextBtn1', 'trendingTabContent');
    bindScrollButtons('scrollPrevBtn2', 'scrollNextBtn2', 'fridgeTabContent');
    bindScrollButtons('scrollPrevBtn3', 'scrollNextBtn3', 'newSectionTabContent');
    bindScrollButtons('scrollPrevBtn5', 'scrollNextBtn5', 'fifthTabContent');


    // ==========================================================
    // 5. TABS FADE
    // ==========================================================
    document.querySelectorAll('.nav[role="tablist"] button[data-bs-toggle="tab"]').forEach(function (tab) {
        tab.addEventListener('hide.bs.tab', function (e) {
            var target = e.target.getAttribute('data-bs-target');
            if (!target) return;
            var pane = document.querySelector(target);
            if (pane) pane.classList.remove('show');
        });

        tab.addEventListener('shown.bs.tab', function () {
            var target = tab.getAttribute('data-bs-target');
            if (!target) return;
            var pane = document.querySelector(target);
            if (!pane) return;
            pane.classList.add('show');
            var row = pane.querySelector('.row.g-3');
            if (row) row.scrollLeft = 0;
        });
    });


    // ==========================================================
    // 6. OFF-CANVAS MEGA MENU
    // ==========================================================
    var offcanvas = document.getElementById('fullSidebar');
    if (offcanvas) {
        var catItems = offcanvas.querySelectorAll('.ecom-cat-item');
        var panels   = offcanvas.querySelectorAll('.ecom-panel');

        function activatePanel(panelId) {
            if (!panelId) return;
            catItems.forEach(function (i) {
                i.classList.toggle('active', i.dataset.panel === panelId);
            });
            panels.forEach(function (p) {
                p.classList.toggle('active', p.id === panelId);
            });
        }

        catItems.forEach(function (item) {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                activatePanel(this.dataset.panel);
            });
            item.addEventListener('mouseenter', function () {
                activatePanel(this.dataset.panel);
            });
        });
    }

    // ==========================================================
    // 7. QUICK VIEW MODAL
    // ==========================================================
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.quick-view-btn');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        var modal = document.getElementById('quickViewModal');
        if (modal) {
            bootstrap.Modal.getOrCreateInstance(modal).show();
        }
    });

}); // نهاية DOMContentLoaded


/* ==========================================================
   PAGINATION (الترقيم بين الصفحات)
   ⚠️ تم وضع هذه الدوال خارج DOMContentLoaded لتكون في النطاق العام
   وتعمل مع onclick في ملف HTML
   ========================================================== */

window.currentPage = 1;
const totalPages = 4; // عدد الصفحات (الصفوف)

window.goToPage = function(pageNumber) {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    window.currentPage = pageNumber;

    // 1. إخفاء جميع الصفوف
    document.querySelectorAll('.page-row').forEach(row => {
        row.classList.remove('active');
        row.style.display = 'none'; // إجبار الإخفاء
    });

    // 2. إظهار الصف المطلوب
    const targetRow = document.getElementById('page-' + window.currentPage);
    if (targetRow) {
        targetRow.classList.add('active');
        targetRow.style.display = 'flex'; // إجبار الإظهار (مهم جداً لأن Bootstrap يستخدم flex)
    }

    // 3. تحديث أزرار الأرقام
    const pageButtons = document.querySelectorAll('.pagination-container .page-btn');
    for (let i = 1; i <= totalPages; i++) {
        if (pageButtons[i]) {
            if (i === window.currentPage) {
                pageButtons[i].classList.add('active');
            } else {
                pageButtons[i].classList.remove('active');
            }
        }
    }

    // 4. تعطيل/تفعيل الأسهم
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.disabled = (window.currentPage === 1);
    if (nextBtn) nextBtn.disabled = (window.currentPage === totalPages);

    // 5. التمرير لقسم المنتجات
    const blogSection = document.getElementById('blog-grid-section');
    if (blogSection) {
        window.scrollTo({ 
            top: blogSection.offsetTop - 100, 
            behavior: 'smooth' 
        });
    }
}

window.changePage = function(direction) {
    if (direction === 'prev') {
        window.goToPage(window.currentPage - 1);
    } else if (direction === 'next') {
        window.goToPage(window.currentPage + 1);
    }
}