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