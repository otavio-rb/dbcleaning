function changeValue(delta, event) {
    event.preventDefault()
    const input = document.getElementById('number-input-bed');
    let currentValue = parseInt(input.value, 10);

    console.log(currentValue)

    let newValue = currentValue + delta;

    if(newValue < 0){
        input.value = 0;
    }else{
        input.value = newValue;
    }
    
}

function changeValueBathrooms(delta, event) {
    event.preventDefault()
    const input = document.getElementById('number-input-bath');
    let currentValue = parseFloat(input.value, 10);

    console.log(currentValue)

    let newValue = currentValue + delta;

    if(newValue < 0){
        input.value = 0;
    }else{
        input.value = newValue;
    }
    
}

function changeValueSquare(delta, event) {
    event.preventDefault()
    const input = document.getElementById('number-input-square');
    let currentValue = parseFloat(input.value, 10);

    console.log(currentValue)

    let newValue = currentValue + delta;

    if(newValue < 0){
        input.value = 0;
    }else{
        input.value = newValue;
    }
    
}


const over_card_select = document.querySelectorAll('.over_card_select');

over_card_select.forEach((item, index) => {
    item.addEventListener('click', () => {

        if(!item.classList.contains('active')){

            over_card_select.forEach((item2) => {
                item2.classList.remove('active');
                item2.querySelector('.over_checkbox input').checked = false
            })

            over_card_select[index].classList.add('active');
        }
    })
})

const card_select2 = document.querySelectorAll('.card_select2');

card_select2.forEach((item, index) => {
    item.addEventListener('click', () => {

        if(!item.classList.contains('active')){

            card_select2.forEach((item2) => {
                item2.classList.remove('active');
            })

            card_select2[index].classList.add('active');
        }
    })
})


const card_select3 = document.querySelectorAll('.card_select3');

card_select3.forEach((item, index) => {
    item.addEventListener('click', () => {

        if(!item.classList.contains('active')){

            card_select3.forEach((item2) => {
                item2.classList.remove('active');
            })

            card_select3[index].classList.add('active');
        }
    })
})