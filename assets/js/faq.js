const row_faq_over = document.querySelectorAll('.row_faq_over');

row_faq_over.forEach((item, index) => {

    let height_row = item.querySelector('p').getBoundingClientRect().height;

    item.addEventListener('click', () => {

        if (row_faq_over[index].querySelector('p').classList.contains('open_row_faq')) {
            row_faq_over[index].querySelector('p').classList.remove('open_row_faq');
            row_faq_over[index].querySelector('.control_row_faq img.open').classList.remove('d-none');
            row_faq_over[index].querySelector('.control_row_faq img.close').classList.add('d-none');
            item.classList.remove('active')
        } else {
            row_faq_over.forEach((item2) => {

                item2.querySelector('p').classList.remove('open_row_faq');
                item2.querySelector('.control_row_faq img.open').classList.remove('d-none');
                item2.querySelector('.control_row_faq img.close').classList.add('d-none');

            });
            row_faq_over[index].querySelector('.control_row_faq img.open').classList.add('d-none');
            row_faq_over[index].querySelector('.control_row_faq img.close').classList.remove('d-none');
            row_faq_over[index].querySelector('p').classList.add('open_row_faq')
            item.classList.add('active')
        }

    })

});

const getUrlValues = () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");

    if (window.location.pathname === "/help-center.html") {
        return;
    } else {
        openQueryFaq(query);
    }
}

const openQueryFaq = (query) => {
    const allFaqs = document.querySelectorAll("[data-key]");

    allFaqs.forEach((faq) => {
        if (faq.dataset.key === query) {
            window.scrollTo({
                top: faq.offsetTop - 100,
                behavior: "smooth"
            })
            faq.querySelector('.control_row_faq img.open').classList.add('d-none');
            faq.querySelector('.control_row_faq img.close').classList.remove('d-none');
            faq.querySelector('p').classList.add('open_row_faq')
            faq.classList.add('active')
        }
    })
}

window.onload = () => getUrlValues();