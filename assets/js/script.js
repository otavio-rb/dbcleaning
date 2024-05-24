document.addEventListener('DOMContentLoaded', () => {

    const img_center_card_hori = document.querySelector('.img_center_card_hori img');

    if(img_center_card_hori){

        let height_img = img_center_card_hori.getBoundingClientRect().height;

        console.log('height: '+height_img);

        const card_hori = document.querySelectorAll('.card_hori');

        let height_terco = height_img / 3;

        card_hori.forEach((item) => {

            item.style.minHeight = (height_terco - 24)+"px";

        });

    }

    //================== button mobile menu ===================================
    const open_menu_mobile = document.querySelector('.open_menu_mobile');
    const close_menu_mobile = document.querySelector('.close_menu_mobile');
    const nav_menu = document.querySelector('nav.menu');
    open_menu_mobile.addEventListener('click', () => {
        nav_menu.classList.add('open_menu_mobile');
    });
    close_menu_mobile.addEventListener('click', () => {
        nav_menu.classList.remove('open_menu_mobile');
    })

    
    
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