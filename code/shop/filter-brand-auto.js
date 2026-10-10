/* =====================================================
   Brand Filter — Auto Build from Products
   يبني القائمة تلقائياً من البراندات الموجودة في المنتجات
   ===================================================== */
(function () {
  'use strict';

  const PRODUCT_SELECTOR = '.product-card';
  const WRAPPER_SELECTOR = '.col-md-3';
  const HIDDEN_CLASS     = 'd-none-brand';

  /* ---------- 1) إيجاد قائمة البراندات ---------- */
  function findBrandsList() {
    let list = document.getElementById('brands-list');
    if (list) return list;

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
    console.warn('[Brand Filter] ❌ لم يُعثر على قائمة البراندات.');
    return;
  }
  if (!brandsListEl.id) brandsListEl.id = 'brands-list';

  /* ---------- 2) استخراج البراند من كل منتج ---------- */
  function extractBrand(card) {
    // 1) data-brand
    if (card.dataset.brand) {
      const b = card.dataset.brand.trim();
      if (b) return b;
    }

    // 2) أي p.text-secondary ليس داخل .text-warning
    //    أو أي عنصر نصي صغير يحتوي اسم براند
    const ps = card.querySelectorAll('p.text-secondary, p');
    for (const p of ps) {
      if (p.closest('.text-warning')) continue;
      if (p.closest('.hover-actions')) continue;
      const txt = p.textContent.trim();
      // استبعاد: أرقام، أسعار، تقييمات، نصوص طويلة
      if (!txt) continue;
      if (txt.startsWith('$')) continue;
      if (/^\(\d+\)$/.test(txt)) continue;
      if (txt.length > 25) continue;
      if (/^\d/.test(txt)) continue;
      return txt;
    }
    return '';
  }

  /* ---------- 3) تجميع المنتجات ---------- */
  const productCards = document.querySelectorAll(PRODUCT_SELECTOR);
  if (productCards.length === 0) {
    console.warn('[Brand Filter] ❌ لا توجد منتجات.');
    return;
  }

  const PRODUCTS = Array.from(productCards).map(card => ({
    wrapper: card.closest(WRAPPER_SELECTOR) || card.parentElement,
    brand:   extractBrand(card)
  }));

  /* ---------- 4) إحصاء البراندات ---------- */
  const brandCounts = new Map();
  PRODUCTS.forEach(({ brand }) => {
    if (!brand) return;
    brandCounts.set(brand, (brandCounts.get(brand) || 0) + 1);
  });

  console.log('[Brand Filter] 📋 البراندات المكتشفة:',
    Array.from(brandCounts.entries()));

  if (brandCounts.size === 0) {
    brandsListEl.innerHTML =
      '<li class="list-unstyled text-secondary small">لا توجد براندات</li>';
    return;
  }

  /* ---------- 5) الحالة ---------- */
  const selectedBrands = new Set();

  /* ---------- 6) بناء القائمة (من البراندات المكتشفة) ---------- */
  const sorted = Array.from(brandCounts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]));

  brandsListEl.innerHTML = sorted.map(([name, count]) => `
    <li class="mb-3 list-unstyled fw-bold text-secondary list-goup-item"
        data-brand="${name}">
      <input type="checkbox" class="me-3 form-check-input me-1">
      ${name} <span class="text-muted fw-normal">(${count})</span>
    </li>
  `).join('');

  /* ---------- 7) الأحداث ---------- */
  brandsListEl.querySelectorAll('.list-goup-item').forEach(li => {
    const cb = li.querySelector('input[type="checkbox"]');
    if (!cb) return;

    li.addEventListener('click', e => {
      if (e.target.tagName !== 'INPUT') {
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change'));
      }
    });

    cb.addEventListener('change', () => {
      const brand = li.dataset.brand;
      if (cb.checked) selectedBrands.add(brand);
      else            selectedBrands.delete(brand);
      li.classList.toggle('active-range', cb.checked);
      applyFilter();
    });
  });

  /* ---------- 8) الفلترة ---------- */
  function applyFilter() {
    let visible = 0;
    PRODUCTS.forEach(({ wrapper, brand }) => {
      const match = selectedBrands.size === 0 || selectedBrands.has(brand);
      if (wrapper) wrapper.classList.toggle(HIDDEN_CLASS, !match);
      if (match) visible++;
    });
    console.log('[Brand Filter] عرض', visible, 'من', PRODUCTS.length);
  }

  /* ---------- 9) تشغيل ---------- */
  applyFilter();

  console.log('[Brand Filter] ✅ Loaded:',
    PRODUCTS.length, 'products |',
    brandCounts.size, 'brands');

})();