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
      nav:true,
      dots: true,
      responsive:{
          0:{
              items:1,
              nav: false
          },
          600:{
              items:2
          },
          1000:{
              items:3
          }
      }
  });

  //service pages ==========================================
  const all_itens = document.querySelectorAll('.all_itens .big_card');
  const switch_default = document.querySelectorAll('.switch_default button');

  if(all_itens && switch_default){
    switch_default.forEach((item, index) => {

        item.addEventListener('click', () => {

            all_itens.forEach((item2, index2) => {
                let item_atual = item.getAttribute('data-item');
                item2.classList.add('d-none');


                console.log('item atual: '+item_atual)
                if(item2.getAttribute('data-item') == item_atual){
                    item2.classList.remove('d-none');
                }
            });

            switch_default.forEach((item3) => {
                item3.classList.remove('active')
            })

            switch_default[index].classList.add('active')

        });

    });
  }

});


const submenu_footer_li = document.querySelectorAll('.submenu .min-has-children > a');
const submenu_footer_ul = document.querySelectorAll('.submenu .min-has-children .min-submenu');

submenu_footer_li.forEach((item, index) => {

    item.addEventListener('click', (e) => {

        e.preventDefault();
        item.querySelector('.arrow-down').classList.toggle('rotate-180')
        submenu_footer_ul[index].classList.toggle('open_submenu');

    });

});

const loop_carroussel = document.querySelectorAll('.loop_carroussel img');
const palco_image = document.querySelector('.principal_carroussel_item_portfolio img');

if(palco_image){
    loop_carroussel.forEach((item, index) => {

        item.addEventListener('click', () => {
            let img = item.getAttribute('src');

            palco_image.setAttribute('src', img);
        })

    })
}