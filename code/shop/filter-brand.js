/* =====================================================
   Brand Filter — Standalone with Fixed Brand List
   -----------------------------------------------------
   البراندات: Apple, Sony, Toshiba, Assus, Samsung
   - مستقل تماماً عن filter-color.js و filter-price.js
   - يبحث عن قائمة Brands تلقائياً (id أو العثور عليها من العنوان)
   - يستخدم كلاس إخفاء خاص (d-none-brand) لتفادي التعارض
   ===================================================== */

(function () {
  'use strict';

  /* =====================================================
     1) البراندات الثابتة (من الصورة)
     ===================================================== */
  const BRANDS = [
    'Apple',
    'Philips',
    'Sony',
    'Toshiba',
    'Assus',
    'Samsung'
  ];

  /* =====================================================
     2) الثوابت
     ===================================================== */
  const PRODUCT_SELECTOR = '.product-card';    // كلاس بطاقة المنتج
  const WRAPPER_SELECTOR = '.col-md-3';        // العمود الحاوي
  const HIDDEN_CLASS     = 'd-none-brand';     // كلاس إخفاء خاص

  /* =====================================================
     3) إيجاد قائمة البراندات في الصفحة
     ===================================================== */
  function findBrandsList() {
    // (أ) بالمعرّف أولاً
    let list = document.getElementById('brands-list');
    if (list) return list;

    // (ب) ابحث عن أي h6 يحتوي كلمة Brand ثم خُذ الـ <ul> التالي
    const headings = document.querySelectorAll('h6');
    for (const h of headings) {
      if (/brand/i.test(h.textContent)) {
        let next = h.nextElementSibling;
        while (next) {
          if (next.tagName === 'UL') return next;
          next = next.nextElementSibling;
        }
      }
    }
    return null;
  }

  const brandsListEl = findBrandsList();
  if (!brandsListEl) {
    console.warn('[Brand Filter] ❌ لم يُعثر على قائمة البراندات في الصفحة.');
    return;
  }
  if (!brandsListEl.id) brandsListEl.id = 'brands-list';

  /* =====================================================
     4) استخراج البراند من كل منتج
     ===================================================== */
  function extractBrand(card) {
    // (1) data-brand
    const dataBrand = (card.dataset.brand || '').trim();
    if (dataBrand) return dataBrand;

    // (2) أي p.text-secondary ليس داخل .text-warning
    const ps = card.querySelectorAll('p.text-secondary');
    for (const p of ps) {
      if (p.closest('.text-warning')) continue;
      const txt = p.textContent.trim();
      if (txt && !/^\(\d+\)$/.test(txt) && !txt.startsWith('$')) return txt;
    }
    return '';
  }

  /* =====================================================
     5) تجميع المنتجات
     ===================================================== */
  const productCards = document.querySelectorAll(PRODUCT_SELECTOR);
  if (productCards.length === 0) {
    console.warn('[Brand Filter] ❌ لا توجد منتجات بـ ' + PRODUCT_SELECTOR);
    return;
  }

  const PRODUCTS = Array.from(productCards).map(card => ({
    wrapper: card.closest(WRAPPER_SELECTOR) || card.parentElement,
    brand:   extractBrand(card)
  }));

  /* =====================================================
     6) الحالة
     ===================================================== */
  const selectedBrands = new Set();

  /* =====================================================
     7) بناء القائمة (من BRANDS الثابتة)
     ===================================================== */
  brandsListEl.innerHTML = BRANDS.map(name => `
    <li class="mb-3 list-unstyled fw-bold text-secondary list-goup-item"
        data-brand="${name}">
      <input type="checkbox" class="me-3 form-check-input me-1">
      ${name}
    </li>
  `).join('');

  /* =====================================================
     8) ربط الأحداث
     ===================================================== */
  brandsListEl.querySelectorAll('.list-goup-item').forEach(li => {
    const cb = li.querySelector('input[type="checkbox"]');
    if (!cb) return;

    // النقر على النص (الـ li) يُبدّل الـ checkbox
    li.addEventListener('click', e => {
      if (e.target.tagName !== 'INPUT') {
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change'));
      }
    });

    // تغيير حالة الـ checkbox
    cb.addEventListener('change', () => {
      const brand = li.dataset.brand;

      if (cb.checked) selectedBrands.add(brand);
      else            selectedBrands.delete(brand);

      li.classList.toggle('active-range', cb.checked);
      applyFilter();
    });
  });

  /* =====================================================
     9) الفلترة
     ===================================================== */
  function applyFilter() {
    let visible = 0;

    PRODUCTS.forEach(({ wrapper, brand }) => {
      // لا يوجد تحديد → الكل يظهر
      // يوجد تحديد → يجب أن يكون البراند ضمن المحددات
      const match = selectedBrands.size === 0 || selectedBrands.has(brand);

      if (wrapper) wrapper.classList.toggle(HIDDEN_CLASS, !match);
      if (match) visible++;
    });

    console.log('[Brand Filter] عرض', visible, 'من', PRODUCTS.length);
  }

  /* =====================================================
     10) تشغيل أولي
     ===================================================== */
  applyFilter();

  console.log('[Brand Filter] ✅ Loaded:',
    PRODUCTS.length, 'products |',
    BRANDS.length, 'brands |',
    'List:', !!brandsListEl);

})();