import Toast from "../class/Toast/Toast.js";
import servicesData, { serviceDetails, extraRooms, frequencyPopupDetails } from "../constants/services.js";
import Popup from "../class/Popup/Popup.js";
import { quoteFormSchema } from "../constants/form-schema.js";
import zipCodes, { DE, NJ, PA, Philadelphia } from "../constants/zip-codes.js";
import services from "../constants/services.js";

const toast = new Toast(5000);

const limitPopup = new Popup("Let’s Schedule Your Free On-Site Visit!", "Schedule a Free Visit",
  `
  <span>
   For larger homes, we offer personalized on-site visits to give you the most accurate quote. Please complete the form below, and we'll arrange a convenient time to visit.
  </span>
  <form id="schedule-visit-form" class="grid col-2">
    <div class="form_group_field_33 w-100">
        <label for="name">Name*</label>
          <input
            type="text"
            data-key="name"
            id="name"
            class="field"
            placeholder=""
            required
          />
          <div class="form_error">
            Name is required
          </div>
      </div>
      <div class="form_group_field_33 w-100">
        <label for="email">Email*</label>
          <input
            type="email"
            data-key="email"
            id="email"
            class="field"
            placeholder=""
            required
          />
          <div class="form_error">
            Email is required
          </div>
      </div>
      <div class="form_group_field_33 w-100">
        <label for="phone">Phone*</label>
          <input
            type="text"
            data-key="phone"
            id="phone"
            class="field"
            placeholder=""
            required
          />
          <div class="form_error">
            Phone is required
          </div>
      </div>
      <div class="form_group_field_33 w-100">
        <label for="address">Service address*</label>
          <input
            type="text"
            data-key="address"
            id="address-schedule"
            class="field"
            placeholder=""
            required
          />
          <div class="form_error">
            Address required
          </div>
      </div>
      <div class="form_group_field_33 w-100 d-flex f-column">
        <span>Day</span>
        <div class="d-flex g-10 w-100">
          <label class="d-flex align-center pointer" for="monday">
              <input
                type="checkbox"
                name="availability-day"
                value="monday"
                required
                id="monday"
              />
              <span>Monday</span>
            </label>
        </div>
        <div class="d-flex g-10">
          <label class="d-flex align-center pointer" for="tuesday">
            <input
              type="checkbox"
              name="availability-day"
              value="tuesday"
              required
              id="tuesday"
            />
            <span>Tuesday</span>
          </label>
        </div>

        <div class="d-flex g-10">
          <label class="d-flex align-center pointer" for="wednesday">
            <input
              type="checkbox"
              name="availability-day"
              value="wednesday"
              required
              id="wednesday"
            />
            <span>Wednesday</span>
          </label>
        </div>

        <div class="d-flex g-10">
          <label class="d-flex align-center pointer" for="thursday">
            <input
              type="checkbox"
              name="availability-day"
              value="thursday"
              required
              id="thursday"
            />
            <span>Thursday</span>
          </label>
        </div>

        <div class="d-flex g-10">
          <label class="d-flex align-center pointer" for="friday">
            <input
              type="checkbox"
              name="availability-day"
              value="friday"
              required
              id="friday"
            />
            <span>Friday</span>
          </label>
        </div>
      </div>
      <div class="form_group_field_33 w-100 f-column d-flex">
        <span>Time frame</span>
        <label class="d-flex align-center pointer" for="morning">
            <input
              type="checkbox"
              name="availability-time"
              value="morning"
              required
              id="morning"
            />
            <span>Morning</span>
          </label>
          <label class="d-flex align-center pointer" for="afternoon">
            <input
              type="checkbox"
              name="availability-time"
              value="afternoon"
              required
              id="afternoon"
            />
            <span>Afternoon</span>
          </label>
      </div>
     
    </form >
  `);

const page = {
  formData: {
    bedrooms: 0,
    bathrooms: 0,
    squareFootage: "1",
    basement: false,
    propertyType: "-",
    service: "-",
    frequency: "-",
    additionalServices: {},
    firstName: "",
    lastName: "",
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
    addressLine2: "",
    smallAppliances: 0,
  },

  init() {
    this.form = document.querySelector("#quote-form");
    this.form.addEventListener("submit", (e) => this.onSubmit(e));

    this.additionalFees = 0;
    this.totalValue = 0;
    this.extraRooms = [];
    this.currentFormStep = 1;

    const bedroomInput = document.querySelector("#number-input-bed");
    const bathroomInput = document.querySelector("#number-input-bath");

    document.querySelector("#bed-minus").onclick = () => this.changeValue(-1, bedroomInput, 7, "bedrooms");
    document.querySelector("#bed-plus").onclick = () => this.changeValue(1, bedroomInput, 7, "bedrooms");
    document.querySelector("#bath-minus").onclick = () =>
      this.changeValue(-0.5, bathroomInput, 6, "bathrooms");
    document.querySelector("#bath-plus").onclick = () =>
      this.changeValue(0.5, bathroomInput, 6, "bathrooms");
    document.getElementById("number-input-square").onchange = (e) =>
      this.changeValueSquareFoot(e);
    document.querySelector("#apply-discout-button").onclick = () =>
      this.applyDiscount();
    document.querySelector("#howHearAboutUs").addEventListener("change", (e) => {
      this.formData.howHearAboutUs = e.target.value;
    });

    this.nextStepButton = document.querySelector("#next-form-step");
    this.nextStepButton.onclick = () => this.nextFormStep();

    this.previousStepButton = document.querySelector("#previous-form-step");
    this.previousStepButton.onclick = () => this.previousFormStep();

    limitPopup.setConfirmCallback(async () => {
      try {
        page.validateStepInformations(limitPopup.main);

        await page.scheduleVisit();
      } catch (error) {
        console.error('Error scheduling visit:', error);
      }
    });

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

  async scheduleVisit() {
    const form = document.getElementById('schedule-visit-form');

    if (!form) {
      console.error('Form not found');
      return;
    }

    const checkedDays = limitPopup.main.querySelectorAll("input[name=availability-day]:checked");
    const checkedTimes = limitPopup.main.querySelectorAll("input[name=availability-time]:checked");

    if (checkedTimes.length === 0 && checkedDays.length > 0) {
      toast.error("Please, select a availability time.");
      return;
    } else {
      let availabityTime = "";

      checkedDays.forEach((day, idx) => {
        let value = day.value;
        console.log(idx)
        availabityTime += `${value}${(parseInt(idx) == checkedDays.length - 2 ? " and " : (parseInt(idx) == checkedDays.length - 1 ? " " : ", "))}`
        console.log(value)
      })

      if (checkedTimes.length == 1) {
        availabityTime += `in the ${checkedTimes[0].value}`
      }
      if (checkedTimes.length > 1) {
        availabityTime += `in the ${checkedTimes[0].value} and ${checkedTimes[1].value}`;
      }

      console.log(availabityTime);
    }

    const data = {};
    form.querySelectorAll('[data-key]').forEach(element => {
      const key = element.getAttribute('data-key');
      data[key] = element.value;
    });

    if (Object.keys(data).length === 0) {
      console.error('No form data collected');
      toast.error('Please fill out the form before submitting');
      return;
    }

    const response = await fetch(`https://wwua7dlp7liv5ck4gy7lgbbwym0fmcvw.lambda-url.us-east-1.on.aws/email/schedule-visit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      toast.success('Visit request made successfully');
      limitPopup.hide();
      window.location.href = "./index.html?redirect=true";
      return true;
    } else {
      if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
        toast.error(result.errors[0].msg);
      } else {
        toast.error(result.error || 'Failed to schedule visit');
      }
      throw new Error('Failed to schedule visit');
    }
  },

  async getUrlValues() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const email = params.get("email");
    const phone = params.get("phoneNumber");
    const zipCode = params.get("zipCode");

    if (!!name) {
      const nameArray = name.split(" ");
      document.querySelector("#first-name").value = nameArray[0];
      this.formData.firstName = nameArray[0];

      document.querySelector("#last-name").value = nameArray[1];
      this.formData.lastName = nameArray[1];
    }

    if (!!email) {
      document.querySelector("#email").value = email;
      this.formData.email = email;
    }

    if (!!phone) {
      document.querySelector("#phone-number").value = phone;
      this.formData.phone = phone;
    }
    if (!!zipCode) {
      document.querySelector("#zipCode").value = zipCode;
      this.formData.zipCode = zipCode;

      this.getStateTaxes();
    }

    if (!!zipCode) {
      try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=AIzaSyDwHGD2GD27gaVCFupJl-IbjtlV6y6Ijho`);
        const json = await response.json();
        const mostSimiliar = json.results[0];
        for (const component of mostSimiliar.address_components) {
          const componentType = component.types[0];
          switch (componentType) {
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

      } catch (error) {
        console.error("Error on google geocoder request:", error);
      }
    }
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

    input.onchange = (e) => {
      this.formData.addressLine = e.target.value;
    };

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
      this.validateStepInformations();
      input2.focus();
    });
  },

  getStateTaxes() {
    const isDE = DE.includes(this.formData.zipCode);
    const isNJ = NJ.includes(this.formData.zipCode);
    const isPA = PA.includes(this.formData.zipCode);
    const isPhiladelphia = Philadelphia.includes(this.formData.zipCode);
    let taxValue = 0;
    let label = "Taxes";

    if (isPhiladelphia) {
      taxValue = 8;
      label = "Philadelphia Sale Tax"
    } else if (isNJ) {
      taxValue = 6.625
      label = "NJ Sale Tax"
    } else if (isPA && !isPhiladelphia) {
      taxValue = 6;
      label = "PA Sale Tax"
    } else if (isDE) {
      taxValue = 0;
      label = "DE Sale Tax - Exempt"
    }

    document.querySelector("#taxes-summary").style.display = "flex";
    document.querySelector("#taxes-label").innerHTML = " - " + label;
    document.querySelector("#taxes").innerHTML = taxValue + "%";

    return taxValue;
  },

  hasFormErrors() {
    if (this.currentFormStep === 1 && this.formData.squareFootage == "" || this.formData.bathrooms == 0 || this.formData.bedrooms == 0) {
      toast.error("Fill in all required fields!");
      return true;
    } else if (this.currentFormStep === 2 && this.formData.frequency == "-") {
      toast.error("Choose a frequency for the service!")
      return true;
    } else if (this.currentFormStep === 3 && this.formData.service == "recurringCleaning") {
      toast.error("Choose a cleaning service type!");
      return true;
    }

    return false;
  },

  validateStepInformations(container) {
    let currentStep;
    let allStepFields;
    const formErrors = [];
    if (container) {
      allStepFields = container.querySelectorAll(".field");
    } else {
      if (this.currentFormStep == 8) {
        allStepFields = document.querySelectorAll(".field");
      } else {
        currentStep = document.querySelector("#form-step-" + this.currentFormStep);
        allStepFields = currentStep.querySelectorAll(".field")
      }
    }

    allStepFields.forEach(field => {
      const parent = field.parentElement;
      const value = field.value;
      const schema = quoteFormSchema[field.dataset.key];
      if (typeof schema === "function") {
        const validation = schema(value, parent);
        formErrors.push(validation);
      }
    });

    return formErrors.includes(true);
  },

  async nextFormStep() {
    if (this.validateStepInformations() || this.hasFormErrors()) return;

    if (this.currentFormStep === 8) {
      if (!this.validateStepInformations()) {
        await this.onSubmit();
      }
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


    if (this.currentFormStep < 8) {
      setTimeout(() => {
        curElement.style.display = "none";
        curElement.classList.remove("out");

        nextElement.style.display = "block";
        nextElement.classList.add("in");
      }, 489);
    }

    if (this.currentFormStep >= 1) {
      this.previousStepButton.style.display = "block";
    }

    if (this.currentFormStep === 1) {
      this.previousStepButton.style.display = "none";
    }
    document.querySelector("#final-step-cta").style.display = "none";
    if (this.currentFormStep === 8) {
      document.querySelector("#final-step-cta").style.display = "block";
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
        <span class="service-details" data-service="${service}">Details</span>
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

    const serviceDetailsSpan = document.querySelectorAll(".service-details");

    serviceDetailsSpan.forEach((d) => {
      const details = serviceDetails[d.dataset.service];
      d.onclick = () => {
        const detailsPopup = new Popup(details.title, "Okay", details.bodyContent, () => {

        });

        detailsPopup.show();
      }
    })

    this.fieldObserver();
  },

  handleExtraRoom(extra, div) {
    const sqft = this.formData.squareFootage === 'Up to 1000' ? 1000 : this.formData.squareFootage === '6001+' ? 6001 : this.formData.squareFootage.split("-").map(n => Number(n.trim()))[1];

    if (div.classList.contains("active")) {
      this.extraRooms.forEach(room => {
        const roomValue = typeof room.currentValue === "number"
          ? room.currentValue
          : room.currentValue(sqft);
        this.additionalFees -= roomValue;
      });

      delete this.formData.additionalServices[extra.name];
      this.extraRooms = [];
      div.classList.remove("active");
      this.renderQuoteSummary();
      return;
    }

    const ExtraRoomPopup = new Popup("Choose Extra Room", "Okay", `
      <span class="title">Select extra rooms</span>
      <div class="d-flex f-column g-10" id="area-type-container"></div>
    `);

    const areaTypeContainer = ExtraRoomPopup.main.querySelector("#area-type-container");

    for (let areaType in extraRooms) {
      const areaContainer = document.createElement("div");
      areaContainer.innerHTML = `<span class="title">${areaType === "exterior" ? "Exterior" : "Interior"}</span>`;
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

    ExtraRoomPopup.confirm(() => {
      const sqft = this.formData.squareFootage === 'Up to 1000' ? 1000 : this.formData.squareFootage === '6001+' ? 6001 : this.formData.squareFootage.split("-").map(n => Number(n.trim()))[1];
      const allCheckedExtraRoom = ExtraRoomPopup.main.querySelectorAll("input[name=extra-room-checkbox]:checked");
      if (allCheckedExtraRoom.length > 0) {
        this.extraRooms = Array.from(allCheckedExtraRoom).map(roomNode =>
          extraRooms[roomNode.dataset.areatype][roomNode.value]
        );

        this.formData.additionalServices[extra.name] = this.extraRooms;

        this.extraRooms.forEach(room => {
          const roomValue = typeof room.currentValue === "number"
            ? room.currentValue
            : room.currentValue(sqft);
          this.additionalFees += roomValue;
        });

        div.classList.add("active");
        this.renderQuoteSummary();
      }
    });

    ExtraRoomPopup.show();
  },


  handleSmallAppliances(extra, div) {
    if (div.classList.contains("active")) {
      const addOnData = this.formData.additionalServices[extra.name];
      if (typeof extra.currentValue === "number") {
        this.additionalFees -= addOnData.currentValue;
      }
      delete this.formData.additionalServices[extra.name];
      div.classList.remove("active");
      this.renderQuoteSummary();

      return;
    }

    const appliancesPopup = new Popup("Enter the number of small appliances", "Okay", `
      <span>Please specify the number of small appliances (e.g, blender, air fryer) you would like us to handwash.</span>
      <div class="d-flex justify-center w-100"> 
        <div style="max-width: 200px" class="count_num">
          <button type="button" class="less" id="appliances-minus">
            -
          </button>
          <input
            type="text"
            id="number-small-appliances"
            value="0"
            readonly
          />
          <button type="button" class="plus" id="appliances-plus">
            +
          </button>
        </div>
      </div>
    `);
    appliancesPopup.popupDiv.style.maxHeight = "280px";
    appliancesPopup.confirm(() => {
      const appliancesInput = appliancesPopup.main.querySelector("#number-small-appliances");
      const value = parseInt(appliancesInput.value);
      if (value > 0) {
        this.formData.additionalServices[extra.name] = {
          ...extra,
          currentValue: value * 10,
        };
        this.additionalFees += value * 10;
        div.classList.add("active");
        this.renderQuoteSummary();
      }
    });
    appliancesPopup.show();

    const appliancesInput = appliancesPopup.main.querySelector("#number-small-appliances");
    appliancesPopup.main.querySelector("#appliances-minus").onclick = () => this.changeValue(-1, appliancesInput, 999);
    appliancesPopup.main.querySelector("#appliances-plus").onclick = () => this.changeValue(1, appliancesInput, 999);
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
    ${extra.recommended ? `<svg class="recommended-star" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>` : ""}

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
        const sqft = this.formData.squareFootage === 'Up to 1000' ? 1000 : this.formData.squareFootage === '6001+' ? 6001 : this.formData.squareFootage.split("-").map(n => Number(n.trim()))[1];

        if (extra.name === "Extra Room") {
          this.handleExtraRoom(extra, div);
          return;
        }
        if (extra.name === "Handwash Small Appliances") {
          this.handleSmallAppliances(extra, div);
          return;
        }

        if (Object.keys(this.formData.additionalServices).includes(extra.name)) {
          delete this.formData.additionalServices[extra.name];

          if (typeof extra.currentValue === "number") {
            this.additionalFees -= extra.currentValue;
          } else {
            this.additionalFees -= extra.currentValue(sqft);
          }

          div.classList.remove("active");
        } else {
          this.formData.additionalServices[extra.name] = extra;

          if (typeof extra.currentValue === "number") {
            this.additionalFees += extra.currentValue;
          } else {
            this.additionalFees += extra.currentValue(sqft);
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
        if (e.target.type === "checkbox") {
          this.formData[item.dataset.key] = e.target.checked;
        } else {
          this.formData[item.dataset.key] = e.target.value;
        }

        if (item.dataset.key === "zipCode") {
          this.getStateTaxes();
        }

        this.validateStepInformations();
        this.renderQuoteSummary();
      };
    });
  },

  getBaseValue() {
    let totalValue = 0;
    let totalRecurringValue = 0;
    let initialDeepCleaningValue = 150;
    let otcValue = 150;
    let isFixedPrices = this.formData.bedrooms == 1 && this.formData.bathrooms <= 1

    if (isFixedPrices) {
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

    let fakeBedrooms = this.formData.bedrooms;
    let fakeBathrooms = this.formData.bathrooms;

    if (this.formData.bedrooms == 5 && this.formData.bathrooms < 3) {
      fakeBedrooms = 5;
      fakeBathrooms = 3;
    } else if (this.formData.bedrooms == 6 && this.formData.bathrooms < 4) {
      fakeBedrooms = 6;
      fakeBathrooms = 4;
    } else if (this.formData.bedrooms == 7 && this.formData.bathrooms < 5) {
      fakeBedrooms = 7;
      fakeBathrooms = 5
    }

    if (this.formData.bedrooms >= 6 || this.formData.bathrooms >= 6) {
      totalValue = (fakeBedrooms * 12) + (fakeBathrooms * 16) + totalRecurringValue;
      initialDeepCleaningValue += (fakeBedrooms * 12) + (fakeBathrooms * 16);
      otcValue += (fakeBedrooms * 12) + (fakeBathrooms * 16);
    }
    if (this.formData.bedrooms < 6 && this.formData.bathrooms < 6) {
      totalValue = (fakeBedrooms * 10) + (fakeBathrooms * 15) + totalRecurringValue;
      initialDeepCleaningValue += (fakeBedrooms * 10) + (fakeBathrooms * 15);
      otcValue += (fakeBedrooms * 10) + (fakeBathrooms * 15);
    }

    if (this.formData.frequency === "-" && this.formData.service === "-") {
      if (totalValue < 150)
        totalValue = 150;

      return { totalValue, totalRecurringValue, initialDeepCleaning: initialDeepCleaningValue }
    }

    if (!isFixedPrices && this.formData.frequency !== "One Time") {
      totalRecurringValue = totalValue;
    }

    const multiplier = servicesData[this.formData?.service]?.multiplier;
    let multiplierValue = 2.5;

    if (!!multiplier) {
      if (typeof multiplier === "number") {
        initialDeepCleaningValue *= multiplier;
        otcValue *= multiplier;
        multiplierValue = multiplier;
      } else {
        const isOccupied = this.formData.houseIs === "empty" ? false : true;
        initialDeepCleaningValue *= multiplier(isOccupied);
        otcValue *= multiplier(isOccupied)
        multiplierValue = multiplier(isOccupied)
      }
    }

    if (this.formData.frequency === "One Time") {
      totalValue = otcValue;
    } else {
      totalValue += initialDeepCleaningValue;
    }
    return {
      totalValue,
      totalRecurringValue,
      initialDeepCleaning: initialDeepCleaningValue,
      multiplier: multiplierValue,
      otcValue
    }
  },

  getQuoteTotalValue(discount = 0) {
    const { totalValue, totalRecurringValue, initialDeepCleaning, multiplier } = this.getBaseValue();

    // É um plano recorrente
    if (this.formData.frequency !== "One Time" && this.formData.frequency !== "-") {
      this.totalValue = initialDeepCleaning;
    } else {
      this.totalValue = totalValue;
      this.totalValue += this.additionalFees;
    }

    this.totalValue -= discount;

    if (this.formData.bedrooms == 0 && this.formData.bathrooms == 0 && this.formData.frequency == "-") {
      this.totalValue = 0;
    }

    this.recurringValue = totalRecurringValue;
    this.initialDeepCleaning = initialDeepCleaning;

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
      servicePrice.innerHTML = `$ ${totalRecurringValue.toFixed(2)}`;
    if (this.formData.frequency === "One Time") {
      servicePrice.innerHTML = `$ ${totalValue.toFixed(2)}`
    }

    totalValueText.innerHTML = this.totalValue.toFixed(2);
  },

  changeValue(delta, input, max, key) {
    let currentValue = Number(input.value);
    let newValue = currentValue + delta;
    if (newValue <= max) {
      if (newValue < 0) {
        input.value = 0;
      } else {
        input.value = newValue;
      }

      if (key)
        this.formData[key] = input.value;

      this.getQuoteTotalValue();
      this.renderQuoteSummary();
    } else if (key == "bathrooms" || key == "bedrooms") {
      limitPopup.show();

      const addressInput = limitPopup.main.querySelector("#address-schedule");

      const center = { lat: 50.064192, lng: -130.605469 };
      const defaultBounds = {
        north: center.lat + 0.1,
        south: center.lat - 0.1,
        east: center.lng + 0.1,
        west: center.lng - 0.1,
      };

      const options = {
        bounds: defaultBounds,
        componentRestrictions: { country: "us" },
        fields: ["address_components", "geometry", "icon", "name"],
        strictBounds: false,
      };

      const autocomplete = new google.maps.places.Autocomplete(addressInput, options);
      autocomplete.setFields(["place_id", "geometry", "name"]);

      limitPopup.main.querySelectorAll("input").forEach(input => {
        input.onchange = () => this.validateStepInformations(limitPopup.main);
      })
    }
  },

  changeValueSquareFoot(e) {
    const select = document.getElementById("number-input-square");
    if (e.target.value === "") {
      select.value = 0;
    }
    this.formData.squareFootage = e.target.value;
    this.extraRoom = [];
    this.additionalFees = 0;
    this.formData.additionalServices = [];
    this.getQuoteTotalValue();
    this.renderExtras();
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
    const loader = document.createElement('img');
    loader.src = "assets/img/loader.svg";
    try {
      this.formData.addressLine = document.querySelector("#address1").value;

      this.nextStepButton.appendChild(loader);
      this.nextStepButton.disabled = true;
      this.nextStepButton.style.opacity = 0.6;

      const addOns = Object.keys(this.formData.additionalServices)
        .filter(key => key !== "Extra Room")
        .map(key => key);

      const extraRooms = this.formData.additionalServices["Extra Room"]
        ? this.formData.additionalServices["Extra Room"].map(room => room.name)
        : [];

      const requestData = {
        name: `${this.formData.firstName} ${this.formData.lastName}`,
        email: this.formData.email,
        phoneNumber: this.formData.phone,
        addressLine1: this.formData.addressLine,
        addressLine2: this.formData.addressLine2,
        city: this.formData.city,
        stateProvince: this.formData.state,
        zipPostalCode: this.formData.zipCode,
        isGift: this.formData.isGift,
        heardAboutUs: this.formData.howHearAboutUs,
        projectDetails: this.formData.projectDetails,
        bedrooms: parseInt(this.formData.bedrooms),
        bathrooms: parseFloat(this.formData.bathrooms),
        squareFootage: this.formData.squareFootage,
        serviceFrequency: this.formData.frequency,
        serviceType: this.formData.service,
        propertyStatus: this.formData.houseIs,
        addOns: addOns,
        extraRooms: extraRooms,
        discountCoupon: document.querySelector("#discount-code").value,
        totalPrice: this.totalValue,
        recurringValue: this.recurringValue,
      };

      const response = await fetch(`https://wwua7dlp7liv5ck4gy7lgbbwym0fmcvw.lambda-url.us-east-1.on.aws/email/request-quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        toast.success("The quote request was sent successfully.");
        window.location.href = "./index.html?redirect=true";
      } else {
        const errorData = await response.json();
        const firstError = errorData.errors && errorData.errors.length > 0 ? errorData.errors[0].msg : "Error sending quote request.";
        toast.error(firstError);
      }
    } catch (error) {
      console.error('Error sending quote request:', error);
      toast.error("An error occurred while sending the quote request.");
    }

    this.nextStepButton.removeChild(loader);
    this.nextStepButton.disabled = false;
    this.nextStepButton.style.opacity = 1;
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

    if (this.formData.frequency === "One Time" && this.formData.service !== "-") {
      document.querySelector("#frequency").innerHTML = ` - ${this.formData.frequency}: ${services[this.formData.service].name}`;
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
              const sqft = this.formData.squareFootage === 'Up to 1000' ? 1000 : this.formData.squareFootage === '6001+' ? 6001 : this.formData.squareFootage.split("-").map(n => Number(n.trim()))[1];
              value = extraRoom.currentValue(sqft);
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
            const sqft = this.formData.squareFootage === 'Up to 1000' ? 1000 : this.formData.squareFootage === '6001+' ? 6001 : this.formData.squareFootage.split("-").map(n => Number(n.trim()))[1];
            value = extra.currentValue(sqft);
          }


          extraDiv.className = "d-flex justify-between"
          extraDiv.innerHTML = `
          <span class="title-one-summary"> - ${extra.name.replace("*", "")}</span>
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
        const detailPopup = new Popup(detail.dataset.frequency, "Okay", frequencyPopupDetails[detail.dataset.frequency])
        detailPopup.show();
      }
    })
  },

};

window.onload = () => page.init();
