/* =====================================================
   Price Filter Only — Slider + Range List
   السلايدر والقائمة يعملان بشكل متبادل (تبديل تلقائي)
   ===================================================== */

(function () {
  'use strict';

  /* ---------- 1) العناصر ---------- */
  const minSlider   = document.getElementById('price-min-slider');
  const maxSlider   = document.getElementById('price-max-slider');
  const sliderRange = document.getElementById('price-slider-range');
  const sliderCont  = document.getElementById('price-slider-container');
  const minValueEl  = document.getElementById('price-min-value');
  const maxValueEl  = document.getElementById('price-max-value');
  const rangesList  = document.getElementById('price-ranges-list');
  const priceHint   = document.getElementById('price-hint');

  if (!minSlider || !maxSlider || !rangesList) {
    console.warn('[Price Filter] عناصر فلتر السعر غير موجودة في الصفحة.');
    return;
  }

  /* ---------- 2) الثوابت ---------- */
  const MIN_PRICE = 0;
  const MAX_PRICE = 3000;
  const STEP      = 10;

  /* ---------- 3) الحالة ---------- */
  const state = {
    minPrice:       MIN_PRICE,
    maxPrice:       MAX_PRICE,
    selectedRanges: new Set(),
    mode:           null   // 'slider' | 'ranges' | null
  };

  /* ---------- 4) المنتجات ---------- */
  const productCards = document.querySelectorAll('.product-card');

  const PRODUCTS = Array.from(productCards).map(card => {
    let price = 0;
    const priceSpan = card.querySelector('.fs-5.fw-bold');
    if (priceSpan) {
      price = parseFloat(priceSpan.textContent.replace(/[^\d.]/g, '')) || 0;
    }
    const wrapper = card.closest('.col-md-3') || card.parentElement;
    return { card, wrapper, price };
  });

  /* =====================================================
     5) السلايدر
     ===================================================== */
  function updateSliderUI() {
    let minVal = parseInt(minSlider.value, 10);
    let maxVal = parseInt(maxSlider.value, 10);

    if (minVal > maxVal - STEP) {
      if (document.activeElement === minSlider) {
        minSlider.value = maxVal - STEP;
        minVal = maxVal - STEP;
      } else {
        maxSlider.value = minVal + STEP;
        maxVal = minVal + STEP;
      }
    }

    state.minPrice = minVal;
    state.maxPrice = maxVal;

    if (minValueEl) minValueEl.textContent = minVal;
    if (maxValueEl) maxValueEl.textContent = maxVal;

    const minPct = (minVal / MAX_PRICE) * 100;
    const maxPct = (maxVal / MAX_PRICE) * 100;

    if (sliderRange) {
      sliderRange.style.left  = minPct + '%';
      sliderRange.style.width = (maxPct - minPct) + '%';
    }

    if (minVal > MAX_PRICE - 400) {
      minSlider.style.zIndex = 5;
      maxSlider.style.zIndex = 4;
    } else {
      maxSlider.style.zIndex = 5;
      minSlider.style.zIndex = 4;
    }
  }

  function resetSlider() {
    minSlider.value = MIN_PRICE;
    maxSlider.value = MAX_PRICE;
    state.minPrice = MIN_PRICE;
    state.maxPrice = MAX_PRICE;
  }

  minSlider.addEventListener('input', () => {
    // عند استخدام السلايدر → نمسح أي مجالات محددة
    if (state.mode === 'ranges') {
      state.selectedRanges.clear();
      syncRangeCheckboxes();
    }
    state.mode = 'slider';
    updateSliderUI();
    updateModeUI();
    applyFilter();
  });

  maxSlider.addEventListener('input', () => {
    if (state.mode === 'ranges') {
      state.selectedRanges.clear();
      syncRangeCheckboxes();
    }
    state.mode = 'slider';
    updateSliderUI();
    updateModeUI();
    applyFilter();
  });

  /* =====================================================
     6) قائمة المجالات
     ===================================================== */
  function syncRangeCheckboxes() {
    rangesList.querySelectorAll('.list-goup-item').forEach(li => {
      const cb = li.querySelector('input[type="checkbox"]');
      const checked = state.selectedRanges.has(li.dataset.rangeId);
      if (cb) cb.checked = checked;
      li.classList.toggle('active-range', checked);
    });
  }

  function handleRangeToggle(rangeId, isChecked) {
    // عند استخدام القائمة → نصفّر السلايدر
    if (state.mode === 'slider') {
      resetSlider();
      updateSliderUI();
    }

    if (isChecked) state.selectedRanges.add(rangeId);
    else           state.selectedRanges.delete(rangeId);

    // إذا لم يبق أي مجال محدد → نعود لوضع null
    state.mode = state.selectedRanges.size > 0 ? 'ranges' : null;

    syncRangeCheckboxes();
    updateModeUI();
    applyFilter();
  }

  rangesList.querySelectorAll('.list-goup-item').forEach(li => {
    const cb = li.querySelector('input[type="checkbox"]');
    if (!cb) return;

    // الضغط على النص (li) يُبدّل الـ checkbox
    li.addEventListener('click', e => {
      if (e.target.tagName !== 'INPUT') {
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change'));
      }
    });

    // تغيير حالة الـ checkbox
    cb.addEventListener('change', () => {
      handleRangeToggle(li.dataset.rangeId, cb.checked);
    });
  });

  /* =====================================================
     7) تحديث مظهر الأوضاع (بدون تعطيل فعلي)
     ===================================================== */
  function updateModeUI() {
    const sliderInactive = state.mode === 'ranges';
    const rangesInactive = state.mode === 'slider';

    if (sliderCont) sliderCont.classList.toggle('disabled', sliderInactive);
    rangesList.classList.toggle('disabled', rangesInactive);

    if (priceHint) {
      if (state.mode === 'slider')      priceHint.textContent = 'Slider mode — list idle';
      else if (state.mode === 'ranges') priceHint.textContent = 'List mode — slider idle';
      else                              priceHint.textContent = '';
    }
  }

  /* =====================================================
     8) منطق الفلترة
     ===================================================== */
  function isInSliderRange(price) {
    return price >= state.minPrice && price <= state.maxPrice;
  }

  function isInSelectedRanges(price) {
    if (state.selectedRanges.size === 0) return true;
    for (const id of state.selectedRanges) {
      const li = rangesList.querySelector(`[data-range-id="${id}"]`);
      if (!li) continue;
      const min = parseFloat(li.dataset.min);
      const max = parseFloat(li.dataset.max);
      if (price >= min && price < max) return true;
    }
    return false;
  }

  function applyFilter() {
    PRODUCTS.forEach(({ wrapper, price }) => {
      let match = true;

      if (state.mode === 'slider')      match = isInSliderRange(price);
      else if (state.mode === 'ranges') match = isInSelectedRanges(price);

      if (wrapper) wrapper.classList.toggle('d-none', !match);
    });
  }

  /* =====================================================
     9) التشغيل الأولي
     ===================================================== */
  updateSliderUI();
  updateModeUI();
  applyFilter();

  console.log('[Price Filter] ✅ Loaded:',
    PRODUCTS.length, 'products |',
    'Slider:', !!minSlider, '|',
    'Ranges:', !!rangesList);

})();