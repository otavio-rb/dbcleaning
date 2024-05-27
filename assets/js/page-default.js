$(document).ready(function(){
    
    $('.loop_carroussel').owlCarousel({
      loop:true,
      margin:20,
      nav:false,
      dots: true,
      responsive:{
          0:{
              items:2
          },
          600:{
              items:2
          },
          1000:{
              items:4
          }
      }
    });

    $('.carroussel_services').owlCarousel({
        loop:true,
        margin:20,
        nav:true,
        dots: false,
        responsive:{
            0:{
                items:1,
                nav: false
            },
            600:{
                items:2
            },
            1000:{
                items:2
            }
        }
      });

  const loop_carroussel = document.querySelectorAll('.loop_carroussel img');

  loop_carroussel.forEach((item, index) => {

    item.addEventListener('click', () => {

        loop_carroussel.forEach((item2) => {
            item2.classList.remove('active')
        })

        loop_carroussel[index].classList.add('active')
        
    });

  });

})