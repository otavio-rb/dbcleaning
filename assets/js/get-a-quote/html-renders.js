const HTML = {
    init(formData) {
        this.formData = formData;
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
};