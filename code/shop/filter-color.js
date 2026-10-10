const circles = document.querySelectorAll('.color-circle');
const items = document.querySelectorAll('.product-card');
const allBtn = document.getElementById('clear-filter');
const resultCount = document.getElementById('result-count');
const emptyMessage = document.getElementById('empty-message');

let activeColor = null; // اللون النشط أو null يعني الكل

// الضغط على دائرة لون
circles.forEach(circle => {
  const clickable = circle.closest('a') || circle;
  clickable.addEventListener('click', e => {
    e.preventDefault(); // يمنع إعادة تحميل الصفحة بسبب href=""
    const color = circle.dataset.color;
    // نفس اللون مرة ثانية = إلغاء الفلتر
    activeColor = (activeColor === color) ? null : color;
    applyFilter();
  });
});



function applyFilter() {
  let visible = 0;

  items.forEach(item => {
    const colors = item.dataset.color.split(' ');
    const match = !activeColor || colors.includes(activeColor);

    // نخفي العمود الخارجي كامل حتى ما تبقى فراغات في الشبكة
    const wrapper = item.closest('.col-md-3, .col-12') || item.parentElement;
    if (wrapper) wrapper.classList.toggle('d-none', !match);
    if (match) visible++;
  });

  // تمييز الدائرة النشطة
  circles.forEach(c => {
    c.classList.toggle('active', c.dataset.color === activeColor);
  });
  allBtn.classList.toggle('active', activeColor === null);

  // العدّاد ورسالة عدم وجود نتائج
  resultCount.innerHTML =
    `عرض <strong>${visible}</strong> من أصل <strong>${items.length}</strong> منتج`;
  emptyMessage.classList.toggle('d-none', visible !== 0);
}

applyFilter(); // تشغيل أولي