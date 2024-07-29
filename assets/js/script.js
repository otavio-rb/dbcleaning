import zipCodes from "../constants/zip-codes.js";
import Popup from "../class/Popup/Popup.js";

document.addEventListener('DOMContentLoaded', () => {

    const img_center_card_hori = document.querySelector('.img_center_card_hori img');

    if (img_center_card_hori) {

        let height_img = img_center_card_hori.getBoundingClientRect().height;

        console.log('height: ' + height_img);

        const card_hori = document.querySelectorAll('.card_hori');

        let height_terco = height_img / 3;

        card_hori.forEach((item) => {

            item.style.minHeight = (height_terco - 24) + "px";

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


$(document).ready(function () {

    $('.carousel_testimonials').owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: true,
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            600: {
                items: 2
            },
            1000: {
                items: 3
            }
        }
    });

    //service pages ==========================================
    const all_itens = document.querySelectorAll('.all_itens .big_card');
    const switch_default = document.querySelectorAll('.switch_default button');

    if (all_itens && switch_default) {
        switch_default.forEach((item, index) => {

            item.addEventListener('click', () => {

                all_itens.forEach((item2, index2) => {
                    let item_atual = item.getAttribute('data-item');
                    item2.classList.add('d-none');


                    console.log('item atual: ' + item_atual)
                    if (item2.getAttribute('data-item') == item_atual) {
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

const notCoveredPopup = new Popup("Location not covered", "Okay", `
    <h3>We are sorry!</h3>
    <span>We don't have support to your location.</span>    
`)
notCoveredPopup.popupDiv.style.maxHeight = "260px";

const verifyZipCode = (e) => {
    e.preventDefault();
    const zipCodePopup = new Popup("Enter your zip code", "Okay", `
        <div class="form_group">
            <input type="text" placeholder="Insert your zip code" id="popup-zipCode" />    
            <div class="form_error">
                <h3>We are sorry!</h3>
                <span>We don't have support to your location.</span> 
            </div>
        </div>
    `);


    zipCodePopup.popupDiv.style.maxHeight = "280px";
    zipCodePopup.confirm(() => {
        const zipCode = zipCodePopup.main.querySelector("#popup-zipCode");
        if (zipCode.value.length > 0) {
            if (!zipCodes.includes(zipCode.value)) {
                zipCodePopup.main.querySelector(".form_error").style.display = "flex";
                zipCode.classList.add("error");
            } else {
                window.location.href = "./get-a-quote.html"
            }
        }
    }, true);
    zipCodePopup.show();
}

document.querySelector(".right_bottom_header .btn-default").onclick = (e) =>
    verifyZipCode(e);

const floatQuote = document.querySelector(".float_quote");
if (floatQuote !== null) {
    floatQuote.onclick = (e) => verifyZipCode(e);
}

const headerLogo = document.querySelector(".over_logo");
headerLogo.onclick = () => window.location.href = "./index.html";

const instantQuoteForm = document.querySelector(".form_contact form");
const inputs = instantQuoteForm.querySelectorAll("input");
inputs.forEach(input => input.required = true)

instantQuoteForm.onsubmit = (e) => {
    e.preventDefault();
    const inputs = instantQuoteForm.querySelectorAll("input");

    const name = inputs[0].value;
    const email = inputs[1].value;
    const phoneNumber = inputs[2].value;
    const zipCode = inputs[3].value;

    if (!zipCodes.includes(zipCode)) {
        notCoveredPopup.show();
    } else {
        window.location.href = `./get-a-quote.html?name=${name}&email=${email}&phoneNumber=${phoneNumber}&zipCode=${zipCode}`;
    }
}

const loop_carroussel = document.querySelectorAll('.loop_carroussel img');
const palco_image = document.querySelector('.principal_carroussel_item_portfolio img');

if (palco_image) {
    loop_carroussel.forEach((item, index) => {

        item.addEventListener('click', () => {
            let img = item.getAttribute('src');

            palco_image.setAttribute('src', img);
        })

    })
}