export default class Popup {
    constructor(title = "Popup", buttonTitle = "Okay", bodyContent, onConfirm = () => { }) {
        this._overlay = document.createElement("div");
        this.popupDiv = document.createElement("div");

        this.title = title;
        this.buttonTitle = buttonTitle;
        this.bodyContent = bodyContent;
        this.onConfirm = onConfirm;

        this.#initializeAndSetStyles();
    }

    #initializeAndSetStyles() {
        this._overlay.className = "popup__overlay";
        this.popupDiv.className = "popup-div";

        this._header = document.createElement("div");
        this._header.className = "popup__header";
        this._header.innerHTML = `
            <span className="header__title">${this.title}</span>
        `;

        const closeButton = document.createElement("div");
        closeButton.innerHTML = `
            <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.20988 6.5L11.7388 1.97109C11.8205 1.89216 11.8857 1.79775 11.9305 1.69336C11.9754 1.58896 11.999 1.47669 12 1.36308C12.001 1.24946 11.9793 1.13679 11.9363 1.03164C11.8933 0.926484 11.8297 0.83095 11.7494 0.750611C11.669 0.670273 11.5735 0.606739 11.4684 0.563716C11.3632 0.520694 11.2505 0.499045 11.1369 0.500032C11.0233 0.50102 10.911 0.524624 10.8066 0.569467C10.7023 0.61431 10.6078 0.679495 10.5289 0.761217L6 5.29012L1.47109 0.761217C1.30972 0.605355 1.09358 0.519111 0.869234 0.521061C0.644888 0.52301 0.430283 0.612997 0.27164 0.77164C0.112997 0.930283 0.0230102 1.14489 0.0210607 1.36923C0.0191112 1.59358 0.105355 1.80972 0.261217 1.97109L4.79012 6.5L0.261217 11.0289C0.179495 11.1078 0.11431 11.2023 0.0694668 11.3066C0.0246235 11.411 0.00101956 11.5233 3.23065e-05 11.6369C-0.000954946 11.7505 0.020694 11.8632 0.0637164 11.9684C0.106739 12.0735 0.170273 12.169 0.250611 12.2494C0.33095 12.3297 0.426484 12.3933 0.531639 12.4363C0.636794 12.4793 0.749464 12.501 0.863076 12.5C0.976687 12.499 1.08896 12.4754 1.19336 12.4305C1.29775 12.3857 1.39216 12.3205 1.47109 12.2388L6 7.70988L10.5289 12.2388C10.6903 12.3946 10.9064 12.4809 11.1308 12.4789C11.3551 12.477 11.5697 12.387 11.7284 12.2284C11.887 12.0697 11.977 11.8551 11.9789 11.6308C11.9809 11.4064 11.8946 11.1903 11.7388 11.0289L7.20988 6.5Z" fill="#9CA3AF"/>
            </svg>
        `;
        closeButton.onclick = () => this.hide();

        this.main = document.createElement("div");
        this.main.className = "popup__main";
        this.main.innerHTML = this.bodyContent;

        this._footer = document.createElement("div");
        this._footer.className = "popup__footer";

        this.confirmButton = document.createElement("button");
        this.confirmButton.className = "btn-default btn-blue btn-hover btn-blue-hover";
        this.confirmButton.innerHTML = this.buttonTitle;
        this.confirmButton.onclick = () => this.hide();

        this._header.appendChild(closeButton);
        this._footer.appendChild(this.confirmButton);
        this.popupDiv.appendChild(this._header);
        this.popupDiv.appendChild(this.main);
        this.popupDiv.appendChild(this._footer);
    }

    injectInMain(html) {
        this.main.appendChild(html);
    }

    show() {
        this._overlay.appendChild(this.popupDiv);
        document.body.appendChild(this._overlay);
    }

    handleConfirm() {
        this.onConfirm();
        this.hide();
    }

    confirm(func, skipHide) {
        this.confirmButton.onclick = () => {
            if (!skipHide) {
                this.hide();
            }
            func()
        };
    }

    hide() {
        document.body.removeChild(this._overlay);
    }
}