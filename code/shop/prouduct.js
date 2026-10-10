const mainImage = document.getElementById('main-image');
const colorName = document.getElementById('color-name');
const addBtn = document.querySelector('.add-to-cart');
const thumbs = document.querySelectorAll('.thumb, .product-gallery-thumb');

thumbs.forEach(function(thumb) {
  thumb.addEventListener('click', function() {

    if (mainImage) {
      mainImage.src = thumb.dataset.image;
    }

    if (colorName && thumb.dataset.color) {
      colorName.textContent = thumb.dataset.color;
    }

    if (addBtn) {
      addBtn.dataset.image = thumb.dataset.image;
      if (thumb.dataset.color) {
        addBtn.dataset.color = thumb.dataset.color;
      }
    }

    thumbs.forEach(function(t) {
      t.classList.toggle('active', t === thumb);
    });
  });
});