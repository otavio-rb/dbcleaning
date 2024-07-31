import zipCodes from "../constants/zip-codes.js";
import Popup from "../class/Popup/Popup.js";

const notCoveredPopup = new Popup("Location not covered", "Okay", `
    <h3>We are sorry!</h3>
    <span>We don't have support to your location.</span>    
`);
notCoveredPopup.popupDiv.style.maxHeight = "260px";

const redirectPopup = new Popup("Quote sent successfully", "Okay", `
    <h4>Thanks for Your Request!</h4>
    <span>We’ve got your details! One of our team members will be in touch shortly to discuss the next steps.</span>    
`);
redirectPopup.confirm(() => {
    window.location.href = "./index.html"
})
redirectPopup.popupDiv.style.maxHeight = "270px";

const form = document.querySelector("#instant-quote-form");
if (form !== null) {
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
}

const verifyURL = () => {
    const params = new URLSearchParams(document.location.search);
    const isRedirect = params.get("redirect");

    if(isRedirect){
        redirectPopup.show();
    }
};

window.onload = () => verifyURL();