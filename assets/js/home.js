import zipCodes from "../constants/zip-codes.js";
import Popup from "../class/Popup/Popup.js";

const notCoveredPopup = new Popup("Location not covered", "Okay", `
    <h3>We are sorry!</h3>
    <span>We don't have support to your location.</span>    
`);
notCoveredPopup.popupDiv.style.maxHeight = "260px";

const form = document.querySelector("#instant-quote-form");


form.onsubmit = (e) => {
    e.preventDefault();

    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const phoneNumber = document.querySelector("#phone-number").value;
    const zipCode = document.querySelector("#zip-code").value;

    if (!zipCodes.includes(zipCode)) {
        notCoveredPopup.show();
    } else {
        window.location.href = `./get-a-quote.html?name=${name}&email=${email}&phoneNumber=${phoneNumber}&zipCode=${zipCode}`;
    }
};