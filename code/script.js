var products = document.querySelectorAll(".addtocart");
var productItem= document.querySelector(".cart-list");
var btn = document.querySelector("#cal-btn");
var total= document.querySelector(".total");
var totalPrice = 0;
var productTitle= null


// loop with forEach
products.forEach(function(el){
    el.onclick = function(){
        productTitle = el.getAttribute('title');
        totalPrice += +(el.getAttribute('price'));
        productItem.innerHTML += '<li>' + productTitle + '</li>';

        if (productItem.innerHTML != ''){
            btn.style.display='block';
        }

        btn.onclick = function(){
            total.innerHTML = totalPrice;
        }

    }
})