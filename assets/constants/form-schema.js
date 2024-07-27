export const quoteFormSchema = {
    firstName(value, inputContainer) {
        if (value.length == 0) {
            inputContainer.classList.add("error");
            inputContainer.querySelector("input").classList.add("error");
            return true;
        } else {
            inputContainer.classList.remove("error");
            inputContainer.querySelector("input").classList.remove("error");
        }

        return false;
    },

    lastName(value, inputContainer) {
        if (value.length == 0) {
            inputContainer.classList.add("error");
            inputContainer.querySelector("input").classList.add("error");
            return true;
        } else {
            inputContainer.classList.remove("error");
            inputContainer.querySelector("input").classList.remove("error");
        }

        return false;
    },

    email(value, inputContainer) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
            inputContainer.classList.add("error");
            inputContainer.querySelector("input").classList.add("error");
            return true;
        } else {
            inputContainer.classList.remove("error");
            inputContainer.querySelector("input").classList.remove("error");
        }

        return false;
    },

    phone(value, inputContainer) {
        if (value.length == 0) {
            inputContainer.classList.add("error");
            inputContainer.querySelector("input").classList.add("error");
            return true;
        } else {
            inputContainer.classList.remove("error");
            inputContainer.querySelector("input").classList.remove("error");
        }

        return false;
    },

    city(value, inputContainer) {
        if (value.length == 0) {
            inputContainer.classList.add("error");
            inputContainer.querySelector("input").classList.add("error");
            return true;
        } else {
            inputContainer.classList.remove("error");
            inputContainer.querySelector("input").classList.remove("error");
        }

        return false;
    },

    zipCode(value, inputContainer) {
        if (value.length == 0) {
            inputContainer.classList.add("error");
            inputContainer.querySelector("input").classList.add("error");
            return true;
        } else {
            inputContainer.classList.remove("error");
            inputContainer.querySelector("input").classList.remove("error");
        }

        return false;
    },

    address(value, inputContainer) {
        if (value.length == 0) {
            inputContainer.classList.add("error");
            inputContainer.querySelector("input").classList.add("error");
            return true;
        } else {
            inputContainer.classList.remove("error");
            inputContainer.querySelector("input").classList.remove("error");
        }

        return false;
    },

    state(value, inputContainer) {
        if (value.length == 0) {
            inputContainer.classList.add("error");
            inputContainer.querySelector("input").classList.add("error");
            return true;
        } else {
            inputContainer.classList.remove("error");
            inputContainer.querySelector("input").classList.remove("error");
        }

        return false;
    },
}