function showProducts(section) {
    
    document.querySelectorAll('.products-section').forEach(sec => {
        sec.style.display = 'none';
    });

    document.getElementById(section).style.display = 'block';
}