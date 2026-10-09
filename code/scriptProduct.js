const mainImage = document.getElementById('main-image');
const colorName = document.getElementById('color-name');
const addBtn = document.querySelector('.add-to-cart');

// ============ زر الصور على اليمين و اليسار=============
const options = document.querySelectorAll('.thumb, .swatch');

function selectImage(image, color) {
    // ==================تغيير الصورة الكبيرة========================
    mainImage.src = image;

    //   ===============مشان نغير اسم اللون=================
    if (color) {
        colorName.textContent = color;
    }

    // =================تغيير بيانات الزر========================
    if (addBtn) {
        addBtn.dataset.image = image;
        if (color) {
            addBtn.dataset.color = color;
        }
    }

    //===================تغيير مسار الصورة الى الصورة يلي اخترتها=========================
    options.forEach(function (option) {
        option.classList.toggle('active', option.dataset.image === image);
    });
}

options.forEach(function (option) {
    option.addEventListener('click', function () {
        selectImage(option.dataset.image, option.dataset.color);
    });
});