/* ============================================================
   ECOM - Blog Single (Left Sidebar Version)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* --------------------------------------------------------
       1. Bootstrap Tooltips
    -------------------------------------------------------- */
    document.querySelectorAll('[data-tooltip]').forEach(function (el) {
        new bootstrap.Tooltip(el, {
            title: el.getAttribute('data-tooltip'),
            placement: 'left',
            trigger: 'hover'
        });
    });

    /* --------------------------------------------------------
       2. Off-canvas Mega Menu (يعمل مع أي عنصر يحمل data-panel)
    -------------------------------------------------------- */
    const offcanvas = document.getElementById('fullSidebar');
    if (offcanvas) {
        const catItems = offcanvas.querySelectorAll('.ecom-cat-item');
        const panels   = offcanvas.querySelectorAll('.ecom-panel');

        function activatePanel(panelId) {
            if (!panelId) return;
            catItems.forEach(i => i.classList.toggle('active', i.dataset.panel === panelId));
            panels.forEach(p => p.classList.toggle('active', p.id === panelId));
        }

        catItems.forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();
                activatePanel(item.dataset.panel);
            });
            item.addEventListener('mouseenter', () => activatePanel(item.dataset.panel));
        });
    }

    /* --------------------------------------------------------
       3. Quick View Modal
    -------------------------------------------------------- */
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.quick-view-btn');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        const modal = document.getElementById('quickViewModal');
        if (modal) bootstrap.Modal.getOrCreateInstance(modal).show();
    });

    /* --------------------------------------------------------
       4. زر "See More" لقائمة التصنيفات
    -------------------------------------------------------- */
    const seeMoreBtn = document.getElementById('seeMoreBtn');
    if (seeMoreBtn) {
        seeMoreBtn.addEventListener('click', toggleList);
    }

    /* --------------------------------------------------------
       5. زر "Read More" لنص المقال (إن وُجد لاحقاً)
    -------------------------------------------------------- */
    const toggleBtn = document.getElementById('toggleBtn');
    const textWrapper = document.getElementById('textWrapper');
    if (toggleBtn && textWrapper) {
        toggleBtn.addEventListener('click', function () {
            textWrapper.classList.toggle('expanded');
            toggleBtn.innerHTML = textWrapper.classList.contains('expanded')
                ? 'Read less <span class="arrow">↑</span>'
                : 'Read more <span class="arrow">→</span>';
        });
    }

});


/* ============================================================
   GLOBAL FUNCTIONS (تُستدعى من onclick داخل HTML)
   ============================================================ */

/* ---- قائمة التصنيفات: See More / See Less ---- */
function toggleList() {
    const list = document.getElementById('productCategoriesList');
    const btn  = document.getElementById('seeMoreBtn');
    if (!list || !btn) return;

    list.classList.toggle('open');
    btn.innerHTML = list.classList.contains('open')
        ? 'See Less ▲'
        : 'See More ▼';
}

/* ---- نظام الترقيم (Pagination) ---- */
let currentPage = 1;
const totalPages = 4;

function goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    currentPage = pageNumber;

    // إخفاء كل الصفوف
    document.querySelectorAll('.page-row').forEach(row => {
        row.classList.remove('active');
        row.style.display = 'none';
    });

    // إظهار الصف المطلوب
    const targetRow = document.getElementById('page-' + currentPage);
    if (targetRow) {
        targetRow.classList.add('active');
        targetRow.style.display = 'flex';
    }

    // تحديث أزرار الأرقام
    const pageButtons = document.querySelectorAll('.pagination-container .page-btn');
    for (let i = 1; i <= totalPages; i++) {
        if (pageButtons[i]) {
            pageButtons[i].classList.toggle('active', i === currentPage);
        }
    }

    // تعطيل/تفعيل الأسهم
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.disabled = (currentPage === 1);
    if (nextBtn) nextBtn.disabled = (currentPage === totalPages);
}

function changePage(direction) {
    if (direction === 'prev') goToPage(currentPage - 1);
    else if (direction === 'next') goToPage(currentPage + 1);
}