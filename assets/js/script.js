document.addEventListener('DOMContentLoaded', () => {

    const img_center_card_hori = document.querySelector('.img_center_card_hori img');

    let height_img = img_center_card_hori.getBoundingClientRect().height;

    console.log('height: '+height_img);

    const card_hori = document.querySelectorAll('.card_hori');

    let height_terco = height_img / 3;

    card_hori.forEach((item) => {

        item.style.minHeight = (height_terco - 24)+"px";

    });
    
});


$(document).ready(function(){
    
    $('.carousel_testimonials').owlCarousel({
      loop:true,
      margin:20,
      nav:false,
      dots: true,
      responsive:{
          0:{
              items:1
          },
          600:{
              items:2
          },
          1000:{
              items:3
          }
      }
  })

})