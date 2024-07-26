import Toast from "../class/Toast/Toast.js";
import servicesData, { details, extraRooms, frequencyPopupDetails } from "../constants/services.js";
import Popup from "../class/Popup/Popup.js";

const toast = new Toast(5000);

const page = {
  formData: {
    bedrooms: 0,
    bathrooms: 0,
    squareFootage: "",
    basement: false,
    propertyType: "-",
    service: "-",
    frequency: "-",
    additionalServices: {},
    name: "",
    phone: "",
    email: "",
    streetName: "",
    number: "",
    floorOrUnit: "",
    zipCode: "",
    city: "",
    state: "",
    howHearAboutUs: "",
    projectDetails: "",
    isGift: false,
    houseIs: "empty",
    houseEmptyConfirmation: false,
    addressLine: "",
    addressLine2: ""
  },

  init() {
    this.form = document.querySelector("#quote-form");
    this.form.onSubmit = (e) => onSubmit(e);

    this.additionalFees = 0;
    this.totalValue = 0;
    this.extraRooms = [];
    this.currentFormStep = 1;

    document.querySelector("#bed-minus").onclick = () => this.changeValue(-1);
    document.querySelector("#bed-plus").onclick = () => this.changeValue(1);
    document.querySelector("#bath-minus").onclick = () =>
      this.changeValueBathrooms(-0.5);
    document.querySelector("#bath-plus").onclick = () =>
      this.changeValueBathrooms(0.5);
    document.getElementById("number-input-square").onchange = (e) =>
      this.changeValueSquareFoot(e);
    document.querySelector("#apply-discout-button").onclick = () =>
      this.applyDiscount();

    this.nextStepButton = document.querySelector("#next-form-step");
    this.nextStepButton.onclick = () => this.nextFormStep();

    this.previousStepButton = document.querySelector("#previous-form-step");
    this.previousStepButton.onclick = () => this.previousFormStep();

    const center = { lat: 50.064192, lng: -130.605469 };
    // Create a bounding box with sides ~10km away from the center point
    const defaultBounds = {
      north: center.lat + 0.1,
      south: center.lat - 0.1,
      east: center.lng + 0.1,
      west: center.lng - 0.1,
    };

    this.googleAutocompletePlaces();
    this.getUrlValues();
    this.renderQuoteSummary();
    this.frequencyCardFunc();
    this.fieldObserver();
  },

  getUrlValues() {
    const params = new URLSearchParams(document.location.search);
    const name = params.get("name");
    const email = params.get("email");
    const phone = params.get("phoneNumber");
    const zipCode = params.get("zipCode");

    document.querySelector("#name").value = name;
    this.formData.name = name;

    document.querySelector("#email").value = email;
    this.formData.email = email;

    document.querySelector("#phone-number").value = phone;
    this.formData.phone = phone;

    document.querySelector("#zipCode").value = zipCode;
    this.formData.zipCode = zipCode;
  },

  googleAutocompletePlaces() {
    const center = { lat: 50.064192, lng: -130.605469 };
    const defaultBounds = {
      north: center.lat + 0.1,
      south: center.lat - 0.1,
      east: center.lng + 0.1,
      west: center.lng - 0.1,
    };

    const input = document.querySelector("#address1");
    const input2 = document.querySelector("#address2");

    const options = {
      bounds: defaultBounds,
      componentRestrictions: { country: "us" },
      fields: ["address_components", "geometry", "icon", "name"],
      strictBounds: false,
    };
    const autocomplete1 = new google.maps.places.Autocomplete(input, options);
    autocomplete1.setFields(["place_id", "geometry", "name"]);

    autocomplete1.addListener("place_changed", (e) => {
      const place = autocomplete1.getPlace();
      let postCode;
      console.log(place)
      document.querySelector("#city").value = "";
      document.querySelector("#state").value = "";
      document.querySelector("#zipCode").value = "";

      this.formData.city = "";
      this.formData.state = "";
      this.formData.zipCode = "";
      this.formData.addressLine = "";
      this.formData.addressLine2 = "";

      for (const component of place.address_components) {
        const componentType = component.types[0];
        switch (componentType) {
          // case "route": {
          //   address1 += component.short_name;
          //   break;
          // }

          case "postal_code": {
            postCode = `${component.long_name}`;
            break;
          }

          case "postal_code_suffix": {
            postCode = `${postCode}-${component.long_name}`;
            break;
          }

          case "locality":
            (document.querySelector("#city")).value =
              component.long_name;
            this.formData.city = component.long_name;
            break;

          case "administrative_area_level_1": {
            (document.querySelector("#state")).value =
              component.long_name;
            this.formData.state = component.long_name;
            break;
          }
        }
      }
      if (!!postCode) {
        document.querySelector("#zipCode").value = postCode;
        this.formData.zipCode = postCode;
      }
      this.formData.addressLine = input.value;
      input2.focus();
    });
  },

  hasFormErrors() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;
    if (this.currentFormStep === 1 && this.formData.squareFootage == 0 || this.formData.bathrooms == 0 || this.formData.bedrooms == 0) {
      toast.error("Fill in all required fields!");
      return true;
    } else if (this.currentFormStep === 1 && this.formData.bedrooms == 5 && this.formData.bathrooms < 3) {
      toast.error("For a house with 5 bedrooms, a minimum value of 3 bathrooms is required.");
      return true;
    } else if (this.currentFormStep === 1 && this.formData.bedrooms == 6 && this.formData.bathrooms < 4) {
      toast.error("For a house with 6 bedrooms, a minimum value of 4 bathrooms is required.");
      return true;
    } else if (this.currentFormStep === 1 && this.formData.bedrooms == 7 && this.formData.bathrooms < 5) {
      toast.error("For a house with 7 bedrooms, a minimum value of 5 bathrooms is required.");
      return true;
    } else if (this.currentFormStep === 2 && this.formData.frequency == "-") {
      toast.error("Choose a frequency for the service!")
      return true;
    } else if (this.currentFormStep === 3 && this.formData.service == "recurringCleaning") {
      toast.error("Choose a cleaning service type!");
      return true;
    } else if (this.currentFormStep === 5 && this.formData.name.length == 0) {
      toast.error("Fill in all required fields!");
      return true;
    } else if (this.currentFormStep === 5 && !nameRegex.test(this.formData.name)) {
      toast.error("Enter your full name. Only characters!");
      return true;
    } else if (this.currentFormStep === 5 && this.formData.email.length == 0) {
      toast.error("Fill in all required fields!");
      return true;
    } else if (this.currentFormStep === 5 && !emailRegex.test(this.formData.email)) {
      toast.error("This email is invalid!");
      return true;
    } else if (this.currentFormStep === 6 && this.formData.addressLine.length == 0) {
      toast.error("Fill in all required fields!");
      return true;
    } else if (this.currentFormStep === 6 && this.formData.zipCode.length == 0) {
      toast.error("Fill in all required fields!");
      return true;
    } else if (this.currentFormStep === 6 && this.formData.city.length == 0) {
      toast.error("Fill in all required fields!");
      return true;
    }

    return false;
  },

  async nextFormStep() {
    if (this.hasFormErrors()) return;

    if (this.currentFormStep === 8) {
      await this.onSubmit();

      return;
    }

    if (this.currentFormStep < 8) {
      const curElement = document.querySelector("#form-step-" + this.currentFormStep);
      let nextElement = document.querySelector("#form-step-" + (this.currentFormStep + 1));

      this.currentFormStep++;

      // Step 4 = Extras Add-ons; Step 3 skips when frequency is 'One Time'
      if (this.currentFormStep === 3) {
        if (this.formData.frequency === "One Time") {
          this.renderServices();
        } else {
          this.currentFormStep = 4;
          nextElement = document.querySelector("#form-step-4");
          this.renderExtras();
        }
      }

      this.onStepChange(curElement, nextElement);
    };

    console.log(this.formData)

  },

  previousFormStep() {
    if (this.currentFormStep > 1) {
      const curElement = document.querySelector("#form-step-" + this.currentFormStep);
      let previousElement = document.querySelector("#form-step-" + (this.currentFormStep - 1));

      document.querySelector("#form-buttons").style.position = "static";

      if (this.currentFormStep === 8) {
        for (let i = 1; i <= 7; i++) {
          document.querySelector("#form-step-" + i).style.display = "none";
        }

        document.querySelector("#form-step-7").style.display = "block";
      }

      this.currentFormStep--;


      //Step 3 skips when frequency is 'One Time'; Step 4 = Extras Add-ons;
      if (this.currentFormStep === 3) {
        if (this.formData.frequency !== "One Time") {
          this.currentFormStep = 2;
          previousElement = document.querySelector("#form-step-2");
        } else {

        }
      }

      this.nextStepButton.innerHTML = "Continue";

      this.onStepChange(curElement, previousElement);
    }
  },

  onStepChange(curElement, nextElement, action) {
    curElement.classList.add("out");

    setTimeout(() => {
      curElement.style.display = "none";
      curElement.classList.remove("out");

      nextElement.style.display = "block";
      nextElement.classList.add("in");
    }, 489);

    if (this.currentFormStep >= 1) {
      this.previousStepButton.style.display = "block";
    }

    if (this.currentFormStep === 1) {
      this.previousStepButton.style.display = "none";
    }
    document.querySelector("#final-step-cta").style.display = "none";
    if (this.currentFormStep === 8) {
      document.querySelector("#final-step-cta").style.display = "block";
      document.querySelector("#form-buttons").style.position = "sticky";
      this.nextStepButton.innerHTML = "Submit";

      for (let i = 1; i <= 7; i++) {
        document.querySelector("#form-step-" + i).style.display = "block";

        if (this.formData.frequency !== "One Time") {
          document.querySelector("#form-step-3").style.display = "none";
        }
      }
    }

    if (this.currentFormStep === 4) {
      this.renderExtras();
    }

    window.scrollTo(0, 200);
    document.querySelector(".filled").style.width = this.currentFormStep * (100 / 8) + "%";
  },

  renderServices() {
    const servicesContainer = document.querySelector("#services-container");
    servicesContainer.innerHTML = "";

    for (const service in servicesData) {
      const curService = servicesData[service];
      const card = document.createElement("div");
      card.dataset.service = service;
      card.className = "over_card_select";

      const main = document.createElement("div");

      const label = document.createElement("label");
      label.className = "card_select";
      label.htmlFor = service + "-radio";
      label.innerHTML = `
        <input type="radio" name="type_service" id="${service}-radio" />
        ${curService.svg}
        <p>${curService.name}</p>
        <span class="service-details">Details</span>
      `;

      const checkboxContainer = document.createElement("div");
      checkboxContainer.className = "over_checkbox g-5";
      checkboxContainer.innerHTML = `
        <label for="${service}-1">
          <input
            type="radio"
            class="service-checkbox"
            checked="true"
            name="property"
            data-service="${service}"
            value="empty"
            required
            id="${service}-1"
          />
          <span>Property is empty</span>
        </label>
        <label for='${service}-2'>
          <input
            type="radio"
            class="service-checkbox"
            value="occupied"
            name="property"
            data-service="${service}"
            required
            id="${service}-2"
          />
          <span>Property is occupied</span>
        </label>
        `;


      if (this.formData.service === card.dataset.service) {
        card.classList.add("active");
      }

      main.onclick = () => {
        this.formData.service = card.dataset.service;
        this.formData.additionalServices = {};
        this.additionalFees = 0;
        this.renderServices();
        this.renderQuoteSummary();

        if (this.currentFormStep === 8) {
          this.renderExtras();
        }

        this.getQuoteTotalValue();
      }

      if (service !== "recurringCleaning") {
        main.appendChild(label);
        if (service === "moveInAndOut" || service === "postConstruction")
          card.appendChild(checkboxContainer);
        card.appendChild(main);
        servicesContainer.appendChild(card);
      }
    }

    const radioInputs = document.querySelectorAll(".service-checkbox");

    radioInputs.forEach(radio => {
      radio.onchange = (e) => {
        this.formData.houseIs = e.target.value;

        if (e.target.value === "occupied" && e.target.dataset.service === "moveInAndOut") {
          const popup = new Popup("Select a deep cleaning instead", "Okay", `
              <span>Oops! It looks like your property is occupied. Please select our <b>Deep Cleaning</b> service instead.</span>
            `,);
          popup.show();
          popup.popupDiv.style.maxHeight = "260px"
          this.formData.houseIs = "empty";
          document.querySelector("#moveInAndOut-1").checked = true;
          popup.confirm(() => {
            this.formData.service = "deepCleaning";
            this.renderServices();
          })
        }

        this.getQuoteTotalValue();
      }
    });

    const serviceDetails = document.querySelectorAll(".service-details");

    serviceDetails.forEach((d) => {
      d.onclick = () => {
        const detailsPopup = new Popup("Details", "Okay", `
          <span><span class="title">Initial Deep Cleaning:</span> Your first session includes a comprehensive deep cleaning from top to bottom and left to right. For the complete checklist, please refer to the Deep Cleaning card.</span>
          <span><span class="title">Regular Cleanings:</span> DB will maintain the high standards set during the initial deep cleaning with recurring regular cleanings, covering all essentials for a clean environment.</span>
          <div class="d-flex g-5 justify-center w-100">
            <img width="20" src="/img/stars.png" />  
              What's included in your Deep Cleaning
            <img width="20" src="/img/stars.png" />
          </div>
          
        `, () => {

        });

        const topicsContainer = document.createElement("div");

        for (let detail of details) {
          const detailDiv = document.createElement("div");
          detailDiv.className = "d-flex f-column g-15";
          detailDiv.style.marginBottom = "10px";
          detailDiv.innerHTML = `<h3 class="color-azul-destaque">${detail.name}</h3>`

          for (let topic of detail.topics) {
            const topicDiv = document.createElement("div");
            topicDiv.className = "d-flex align-center g-10 nowrap";

            topicDiv.innerHTML = `
              <img src="/img/icon/check.png" />
              <span>${topic}</span>
            `;

            detailDiv.appendChild(topicDiv);
          }

          topicsContainer.appendChild(detailDiv);
        }

        detailsPopup.injectInMain(topicsContainer);
        detailsPopup.show();
      }
    })

    this.fieldObserver();
  },

  handleExtraRoom(extra, div) {
    if (div.classList.contains("active")) {
      for (let room of this.extraRooms) {
        if (typeof room.currentValue === "number") {
          this.additionalFees -= room.currentValue;
        } else {
          this.additionalFees -= room.currentValue(this.formData.squareFootage, this.formData.frequency === "One Time" ? false : true);
        }
      }

      delete this.formData.additionalServices[extra.name];
      this.extraRooms = [];

      div.classList.remove("active");

      this.renderQuoteSummary();

      return;
    }

    const ExtraRoomPopup = new Popup("Choose Extra Room", "Okay", `
      <span class="title">Select a extra room</span>
      <div class="d-flex f-column g-10" id="area-type-container">

      </div>
    `);

    let areaType = "interior";
    const areaTypeContainer = ExtraRoomPopup.main.querySelector("#area-type-container");

    const renderLabels = () => {
      for (let areaType in extraRooms) {
        const areaContainer = document.createElement("div");
        console.log(areaType)
        areaContainer.innerHTML = `<span class="title">${areaType === "exterior" ? "Exterior" : "Interior"}</span>`
        areaContainer.className = "d-flex f-column g-5";
        for (let idx in extraRooms[areaType]) {
          const room = extraRooms[areaType][idx];
          const roomDiv = document.createElement("label");
          roomDiv.className = "d-flex g-10 pointer";

          roomDiv.innerHTML = `   
            <input name="extra-room-checkbox" data-areaType='${areaType}' type="checkbox" id="${room.id}" value='${idx}' />
            <label class="pointer" for="${room.id}">${room.name}</label>
          `;

          areaContainer.appendChild(roomDiv);
        }
        areaTypeContainer.appendChild(areaContainer);
      }
    }

    ExtraRoomPopup.confirm(() => {
      const allCheckedExtraRoom = ExtraRoomPopup.main.querySelectorAll("input[name=extra-room-checkbox]:checked");
      if (allCheckedExtraRoom.length > 0) {
        this.extraRooms = [];
        allCheckedExtraRoom.forEach(roomNode => {
          console.log(extraRooms[roomNode.dataset.areatype][roomNode.value])
          this.extraRooms.push(extraRooms[roomNode.dataset.areatype][roomNode.value]);
        })

        this.formData.additionalServices[extra.name] = this.extraRooms;

        for (let room of this.extraRooms) {
          if (typeof room.currentValue === "number") {
            this.additionalFees += room.currentValue;
          } else {
            this.additionalFees += room.currentValue(this.formData.squareFootage, this.formData.frequency === "One Time" ? false : true);
          }
        }

        div.classList.add("active");

        this.renderQuoteSummary();
      }
    });

    renderLabels();

    ExtraRoomPopup.show();
  },

  renderExtras() {
    const recommendedContainer = document.querySelector("#recommended-container");
    const additionalContainer = document.querySelector("#additional-container");

    recommendedContainer.innerHTML = "";
    additionalContainer.innerHTML = "";

    const selectedService = servicesData[this.formData.service];

    for (let extra of selectedService.extras) {
      const div = document.createElement("div");
      div.dataset.additionalservice = extra.name;
      div.className = "card_select3";
      div.innerHTML = `
    ${extra.recommended ? `<img class="recommended-star" width="16" height="16" src="/img/recommended-star.png">` : ""}

      <input
        type="radio"
        name="${extra.name}"
        id="${extra.name}"
      />

    ${extra.svg}

    <p>${extra.name}</p>
`;
      if (extra.recommended) {
        div.classList.add("recommended")
      };

      if (Object.keys(this.formData.additionalServices).includes(extra.name)) {
        div.classList.add("active");
      }

      div.onclick = () => {
        if (extra.name === "Extra Room") {
          this.handleExtraRoom(extra, div);
          return;
        }
        if (Object.keys(this.formData.additionalServices).includes(extra.name)) {
          delete this.formData.additionalServices[extra.name];

          if (typeof extra.currentValue === "number") {
            this.additionalFees -= extra.currentValue;
          } else {
            this.additionalFees -= extra.currentValue(this.formData.squareFootage, this.formData.frequency === "One Time" ? false : true);
          }

          div.classList.remove("active");
        } else {
          this.formData.additionalServices[extra.name] = extra;
          console.log(this.formData.additionalServices)

          if (typeof extra.currentValue === "number") {
            this.additionalFees += extra.currentValue;
          } else {
            this.additionalFees += extra.currentValue(this.formData.squareFootage, this.formData.frequency === "One Time" ? false : true);
          }

          div.classList.add("active");
        }
        this.renderQuoteSummary();
      }
      if (extra.recommended) {
        recommendedContainer.appendChild(div)
      } else {
        additionalContainer.appendChild(div);
      }
    }

  },

  fieldObserver() {
    const allFields = document.querySelectorAll(".field");
    allFields.forEach((item, idx) => {
      item.onchange = (e) => {
        console.log(e);
        if (e.target.type === "checkbox") {
          this.formData[item.dataset.key] = e.target.checked;
        } else {
          this.formData[item.dataset.key] = e.target.value;
        }
        this.renderQuoteSummary();
      };
    });
  },

  getBaseValue() {
    let totalValue = 0;
    let totalRecurringValue = 0;
    let initialDeepCleaningValue = 150;
    let otcValue = 150;

    if (this.formData.bedrooms == 1 && this.formData.bathrooms == 1) {
      switch (this.formData.frequency) {
        case "Weekly":
          totalRecurringValue = 150;
          break;
        case "Every 2 Weeks":
          totalRecurringValue = 160;
          break;
        case "Every 4 Weeks":
          totalRecurringValue = 260;
          break;
        case "One Time":
          totalRecurringValue = 150;
          break;
      }
    } else {
      switch (this.formData.frequency) {
        case "Weekly":
          totalRecurringValue = 140;
          break;
        case "Every 2 Weeks":
          totalRecurringValue = 150;
          break;
        case "Every 4 Weeks":
          totalRecurringValue = 250;
          break;
        case "One Time":
          totalRecurringValue = 150;
          break;
      }
    }
    console.log(totalRecurringValue)
    if (this.formData.bedrooms >= 6 || this.formData.bathrooms >= 6) {
      totalValue = (this.formData.bedrooms * 12) + (this.formData.bathrooms * 16) + totalRecurringValue;
      initialDeepCleaningValue += (this.formData.bedrooms * 12) + (this.formData.bathrooms * 16);
      otcValue += (this.formData.bedrooms * 12) + (this.formData.bathrooms * 16);
    } else if (this.formData.bedrooms < 6 || this.formData.bedrooms < 6) {
      totalValue = (this.formData.bedrooms * 10) + (this.formData.bathrooms * 15) + totalRecurringValue;
      initialDeepCleaningValue += (this.formData.bedrooms * 10) + (this.formData.bathrooms * 15);
      otcValue += (this.formData.bedrooms * 10) + (this.formData.bathrooms * 15);
    }

    if (this.formData.frequency === "-" && this.formData.service === "-") {
      if (totalValue < 150)
        totalValue = 150;

      return { totalValue, totalRecurringValue, initialDeepCleaning: initialDeepCleaningValue }
    }

    totalRecurringValue = totalValue;

    const multiplier = servicesData[this.formData?.service]?.multiplier;

    if (!!multiplier) {
      if (typeof multiplier === "number") {
        initialDeepCleaningValue *= multiplier;
        otcValue *= multiplier;
      } else {
        const isOccupied = this.formData.houseIs === "empty" ? false : true;
        initialDeepCleaningValue *= multiplier(isOccupied);
        otcValue *= multiplier(isOccupied)
      }
    }

    if (this.formData.frequency === "One Time") {
      totalValue = otcValue;
    } else {
      totalValue += initialDeepCleaningValue;
    }

    return { totalValue, totalRecurringValue, initialDeepCleaning: initialDeepCleaningValue }
  },

  getQuoteTotalValue(discount = 0) {
    const { totalValue, totalRecurringValue, initialDeepCleaning } = this.getBaseValue();

    // É um plano recorrente
    if (this.formData.frequency !== "One Time" && this.formData.frequency !== "-") {
      this.totalValue = initialDeepCleaning;
    } else {
      this.totalValue = totalValue;
      this.totalValue += this.additionalFees;
    }

    this.totalValue -= discount;

    const fakePrice = document.querySelector("#fake-price");
    const servicePrice = document.querySelector("#service-price");
    const totalValueText = document.querySelector("#total-value");

    if (this.formData.frequency !== "One Time") {
      document.querySelector("#initial-deep-cleaning").innerHTML = `$ ${initialDeepCleaning}`;
      document.querySelector("#recurring-value").innerHTML = `$ ${totalRecurringValue + this.additionalFees}`;
    }

    if (this.formData.frequency === "Weekly") {
      fakePrice.innerHTML = `$ ${Number(totalRecurringValue * 1.25).toFixed(2)}`
    } else if (this.formData.frequency === "Every 2 Weeks") {
      fakePrice.innerHTML = `$ ${(totalRecurringValue * 1.1765).toFixed(2)}`;
    } else {
      fakePrice.innerHTML = "";
    }


    if (this.formData.frequency !== "-")
      servicePrice.innerHTML = `$ ${totalRecurringValue.toFixed(0, 2)}`;
    if(this.formData.frequency === "One Time"){
      servicePrice.innerHTML = `$ ${(totalRecurringValue * 2.5).toFixed(0,2)}`
    }

    totalValueText.innerHTML = this.totalValue.toFixed(2);
  },

  changeValue(delta) {
    const input = document.getElementById("number-input-bed");
    let currentValue = parseInt(input.value, 10);
    let newValue = currentValue + delta;
    if (newValue <= 7) {


      if (newValue < 0) {
        input.value = 0;
      } else {
        input.value = newValue;
      }

      document.getElementById("bedrooms-count").innerHTML = input.value;
      this.formData.bedrooms = input.value;

      this.getQuoteTotalValue();
    } else {
      toast.error("Maximum bedrooms limit.");
    }
  },

  changeValueBathrooms(delta) {
    const input = document.getElementById("number-input-bath");
    let currentValue = parseFloat(input.value, 10);

    let newValue = currentValue + delta;
    if (newValue <= 5) {

      if (newValue < 0) {
        input.value = 0;
      } else {
        input.value = newValue;
      }

      document.getElementById("bathrooms-count").innerHTML = input.value;
      this.formData.bathrooms = input.value;

      this.getQuoteTotalValue();
    } else {
      toast.error("Maximum bathrooms limit.");
    }
  },

  changeValueSquareFoot(e) {
    const select = document.getElementById("number-input-square");
    console.log(Number(select.value));
    if (e.target.value < 0 || e.target.value === "" || isNaN(e.target.value)) {
      select.value = 0;
    }
    this.formData.squareFootage = Number(e.target.value);
    this.extraRoom = [];
    this.formData.additionalServices = [];
    this.getQuoteTotalValue();
    this.renderQuoteSummary();
  },

  async applyDiscount() {
    const couponCode = document.querySelector("#discount-code");
    if (this.totalValue > 0) {
      if (couponCode.value.length > 0) {
        document.querySelector("#subtotal").style.display = "block";
        this.getQuoteTotalValue(20);
        const div = document.querySelector("#discount-row");
        const price = document.querySelector("#discount-value");
        price.innerHTML = `-$ ${Number(20).toFixed(2)}`;
        div.style.display = "flex";

        toast.success("Coupon applied.");
      } else {
        toast.error("The Coupon entered is invalid or does not exist.");
      }
    }
    // try {
    //   const response = axios.get(
    //     `${ process.env.DATABASE_URL } /coupons?code=${couponCode}`
    //   );

    //   if (response.data.status === 200) {
    //     this.getQuoteTotalValue(response.data.discountValue);
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  },

  async onSubmit() {
    try {
      const response = await axios.post(
        `${process.env.DATABASE_URL}/quote`,
        this.formData
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("The quote was sent successfully.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Error creating quote.");
      console.error(error);
    }
  },

  renderQuoteSummary() {
    const extrasContainer = document.querySelector("#extras");
    extrasContainer.innerHTML = "";

    document.querySelector("#bedrooms-count").innerHTML =
      this.formData.bedrooms;
    document.querySelector("#bathrooms-count").innerHTML =
      this.formData.bathrooms;

    if (this.formData.frequency !== "-") {
      document.querySelector("#frequency").innerHTML = " - " + this.formData.frequency;
    }

    const extras = this.formData.additionalServices;
    if (Object.keys(extras).length > 0) {
      for (let key in extras) {
        if (key === "Extra Room") {
          for (let extraRoom of extras[key]) {
            const extraDiv = document.createElement("div");
            let value;
            if (typeof extraRoom.currentValue === "number") {
              value = extraRoom.currentValue;
            } else {
              value = extraRoom.currentValue(this.formData.squareFootage, this.formData.frequency === "One Time" ? false : true);
            }

            extraDiv.className = "d-flex justify-between"
            extraDiv.innerHTML = `
              <span class="title-one-summary"> - ${key === "Extra Room" ? "Extra Room: " : ""} ${extraRoom.name}</span>
              <div class="d-flex g-10">
                ${!!extraRoom?.beforePromoValue ? `<span class="weight-400 dashed-text">$${extraRoom?.beforePromoValue}</span>` : ""}
                <span class="weight-600 color-gray-4">$${value}</span>
              </div>
            `;

            extrasContainer.appendChild(extraDiv);
          }
        } else {
          const extra = extras[key];
          const extraDiv = document.createElement("div");

          let value;
          if (typeof extra.currentValue === "number") {
            value = extra.currentValue;
          } else {
            value = extra.currentValue(this.formData.squareFootage, this.formData.frequency === "One Time" ? false : true);
          }


          extraDiv.className = "d-flex justify-between"
          extraDiv.innerHTML = `
          <span class="title-one-summary"> - ${extra.name}</span>
          <div class="d-flex g-10">
            ${!!extra.beforePromoValue ? `<span class="weight-400 dashed-text">$${extra.beforePromoValue}</span>` : ""}
            <span class="weight-600 color-gray-4">$${value}</span>
          </div>
        `;

          extrasContainer.appendChild(extraDiv);
        }
      }
    } else {
      document.querySelector("#extras").innerHTML = " - ";
    }

    const recurringCleanValues = document.querySelector("#recurring-clean-values");
    if (this.formData.frequency === "One Time" || this.formData.frequency === "-") {
      recurringCleanValues.style.display = "none"
    } else {
      recurringCleanValues.style.display = "block"
    }

    this.getQuoteTotalValue();
  },

  frequencyCardFunc() {
    const card_select2 = document.querySelectorAll("#frequency-container .over_card_select");
    card_select2.forEach((item, index) => {
      item.addEventListener("click", () => {
        if (!item.classList.contains("active")) {
          card_select2.forEach((item2) => {
            item2.classList.remove("active");
          });
          const currentCard = card_select2[index];
          currentCard.classList.add("active");
          this.formData.frequency = currentCard.dataset.frequency;
          this.additionalFees = 0;

          if (this.formData.frequency !== "One Time") {
            this.formData.additionalServices = {};
            this.formData.service = "recurringCleaning";
            document.querySelector("#additional-caption").style.display = "block";
            document.querySelector("#subtotal").style.display = "block";
            this.getQuoteTotalValue();
          }

          if (this.formData.frequency === "One Time") {
            document.querySelector("#additional-caption").style.display = "none";
            document.querySelector("#subtotal").style.display = "none";
            this.formData.service = "deepCleaning";
          }

          if (this.currentFormStep === 8) {
            if (this.formData.frequency === "One Time") {
              document.querySelector("#form-step-3").style.display = "block";
              this.formData.additionalServices = {};
              this.renderServices();
            } else {
              document.querySelector("#form-step-3").style.display = "none";
            }

            this.getQuoteTotalValue();
            this.renderExtras();
          }

          this.renderQuoteSummary();
        }
      });
    });

    const frequencyDetails = document.querySelectorAll(".frequency-details");
    frequencyDetails.forEach(detail => {
      detail.onclick = () => {
        const detailPopup = new Popup("Details", "Okay", frequencyPopupDetails[detail.dataset.frequency])
        detailPopup.show();
      }
    })
  },

};

window.onload = () => page.init();
