const btn_switch_page = document.querySelectorAll('.head_swith_page .btn_switch_page');
const single_switch_page = document.querySelectorAll('.select_switch_page .single_switch_page');

btn_switch_page.forEach((item, index) => {

    item.addEventListener('click', () => {

        single_switch_page.forEach((item2) => {
            item2.classList.remove('active')
        });

        btn_switch_page.forEach((item3) => {
            item3.classList.remove('active')
        });
        single_switch_page[index].classList.add('active');
        btn_switch_page[index].classList.add('active')

    });

});