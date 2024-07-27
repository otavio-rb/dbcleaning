import zipCodes from "../constants/zip-codes.js";
import Popup from "../class/Popup/Popup.js";
import Toast from "../class/Toast/Toast.js";

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
        nav: false,
        dots: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1000: {
                items: 3
            }
        }
    })

});


const submenu_footer_li = document.querySelectorAll('.submenu .min-has-children > a');
const submenu_footer_ul = document.querySelectorAll('.submenu .min-has-children .min-submenu');

submenu_footer_li.forEach((item, index) => {

    item.addEventListener('click', (e) => {

        e.preventDefault();
        submenu_footer_ul[index].classList.toggle('open_submenu')

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
if(floatQuote !== null){
    floatQuote.onclick = (e) => verifyZipCode(e);
}

const headerLogo = document.querySelector(".over_logo");
headerLogo.onclick = () => window.location.href = "./index.html";