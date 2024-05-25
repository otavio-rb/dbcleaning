const row_faq_over = document.querySelectorAll('.row_faq_over');

row_faq_over.forEach((item, index) => {

    let height_row = item.querySelector('p').getBoundingClientRect().height;
    console.log(height_row);

    item.querySelector('.control_row_faq').addEventListener('click', () => {

        if(row_faq_over[index].querySelector('p').classList.contains('open_row_faq')){
            row_faq_over[index].querySelector('p').classList.remove('open_row_faq');
            row_faq_over[index].querySelector('.control_row_faq img.open').classList.remove('d-none');
            row_faq_over[index].querySelector('.control_row_faq img.close').classList.add('d-none');
            item.classList.remove('active')
        }else{
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

