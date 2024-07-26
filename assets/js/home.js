const form = document.querySelector("#instant-quote-form");

form.onsubmit = (e) => {
    e.preventDefault();

    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const phoneNumber = document.querySelector("#phone-number").value;
    const zipCode = document.querySelector("#zip-code").value;

    window.location.href = `./get-a-quote.html?name=${name}&email=${email}&phoneNumber=${phoneNumber}&zipCode=${zipCode}`;
};