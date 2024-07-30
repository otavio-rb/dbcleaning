document.addEventListener('DOMContentLoaded', () => {

    const head_cleaning_checklist = document.getElementById('head_cleaning_checklist');

    let width_head_cleaning_checklist = head_cleaning_checklist.getBoundingClientRect().width;

    const th_cleaning_checklist = head_cleaning_checklist.querySelectorAll('.th_cleaning_checklist');

    let width_items = 0;

    let width_col_normal = [];

    const col_first_body_cleaning_checklist = document.querySelectorAll('.col_first_body_cleaning_checklist');

    // ================ soma o valor de todas as colunas ====================================
    th_cleaning_checklist.forEach((item, index) => {

        let width_th_cleaning_checklist = item.getBoundingClientRect().width;

        width_items += width_th_cleaning_checklist;

        width_col_normal[index] = width_th_cleaning_checklist;

    });
    // ================ soma o valor de todas as colunas ====================================

    col_first_body_cleaning_checklist.forEach((item) => {

        item.style.width = (width_head_cleaning_checklist - width_items) + "px";

    });

    const row_single = document.querySelectorAll('.row_single');

    row_single.forEach((item, index) => {

        let col_normal = item.querySelectorAll('.col_normal');

        col_normal.forEach((item2) => {
            item2.style.width = width_col_normal[0] + "px";
        })

    });

})

const initMap = async () => {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.952583, lng: -75.165222 },
        zoom: 10,
        zoomControl: false,
        minZoom: 10,
        maxZoom: 14,
        mapId: "31e547c798d4d6aa",
    });

    await placeMarkers(map);
};

const placeMarkers = async (map) => {
    const response = await fetch("assets/constants/zip-code.json");
    const json = await response.json();
    console.log(json);
    const alreadyPlaced = [];
    for (const state in json) {
        const currentState = json[state];
        for (const city of currentState) {
            if (!alreadyPlaced.includes(city.primary_city)) {
                const { AdvancedMarkerElement } = await google.maps.importLibrary("marker")
                const marker = new AdvancedMarkerElement({
                    map: map,
                    position: {
                        lat: city.latitude,
                        lng: city.longitude
                    },
                    title: city.couty,
                });
                alreadyPlaced.push(city.primary_city);
            }
        }
    }
}

window.onload = () => initMap(); 