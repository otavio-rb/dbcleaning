document.addEventListener('DOMContentLoaded', () => {

    const head_cleaning_checklist = document.getElementById('head_cleaning_checklist');

    let width_head_cleaning_checklist = head_cleaning_checklist.getBoundingClientRect().width;

    const th_cleaning_checklist = head_cleaning_checklist.querySelectorAll('.th_cleaning_checklist');

    console.log('width: '+width_head_cleaning_checklist);

    let width_items = 0;

    let width_col_normal = [];
    
    const col_first_body_cleaning_checklist = document.querySelectorAll('.col_first_body_cleaning_checklist');

    // ================ soma o valor de todas as colunas ====================================
    th_cleaning_checklist.forEach((item, index) => {

        let width_th_cleaning_checklist = item.getBoundingClientRect().width;

        width_items += width_th_cleaning_checklist;

        console.log('width_th_cleaning_checklist: '+width_th_cleaning_checklist);
        console.log('Soma: '+width_items);

        width_col_normal[index] = width_th_cleaning_checklist;

    });
    // ================ soma o valor de todas as colunas ====================================

    col_first_body_cleaning_checklist.forEach((item) => {

        item.style.width = (width_head_cleaning_checklist - width_items)+"px";

    });

    const row_single = document.querySelectorAll('.row_single');

    console.log('row_single: '+row_single.length);

    row_single.forEach((item, index) => {

        let col_normal = item.querySelectorAll('.col_normal');

        console.log('item: '+(index+1))

        col_normal.forEach((item2) => {
            item2.style.width = width_col_normal[0]+"px";
        })

    });

})
