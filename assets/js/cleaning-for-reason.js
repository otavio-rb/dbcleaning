const autoCompleteJS = new autoComplete({
    data: {
        src: async () => {
            try {
                // Loading placeholder text
                document
                    .getElementById("autoComplete")
                    .setAttribute("placeholder", "Loading...");
                // Fetch External Data Source
                const source = await fetch(
                    "assets/constants/faq-options.json"
                );
                const data = await source.json();
                // Post Loading placeholder text
                document
                    .getElementById("autoComplete")
                    .setAttribute("placeholder", autoCompleteJS.placeHolder);
                // Returns Fetched data
                return data;
            } catch (error) {
                return error;
            }
        },
        keys: ["label"],
        cache: true,
        filter: (list) => {
            // Filter duplicates
            // incase of multiple data keys usage
            const filteredResults = Array.from(
                new Set(list.map((value) => value.match))
            ).map((food) => {
                return list.find((value) => value.match === food);
            });

            return filteredResults;
        }
    },
    placeHolder: "Type keywords to find answers",
    resultsList: {
        element: (list, data) => {
            const info = document.createElement("p");
            if (data.results.length > 0) {
            } else {
                info.innerHTML = `Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong>`;
            }
            list.prepend(info);
        },
        noResults: true,
        maxResults: 15,
        tabSelect: true
    },
    resultItem: {
        element: (item, data) => {
            item.style = "display: flex; justify-content: space-between;";
            item.innerHTML = `
        <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
        ${data.match}
        </span>`;

            item.onclick = () => {
                autoCompleteJS.input.value = data.value.label;
                window.location.href = "./faq.html?q=" + data.value.value;
            }
        },
        highlight: true
    },
    events: {
        input: {
            focus: () => {
                if (autoCompleteJS.input.value.length) autoCompleteJS.start();
            }
        }
    }
});
