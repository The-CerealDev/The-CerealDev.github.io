let nameInp = document.getElementById('nameInp');
let subBtn = document.getElementById('submitBtn');
let form = document.getElementById('inputForm');
let nameHolder = document.getElementById('nameList');

function summit(event){
    event.preventDefault();
    console.log("sups");
    let input = document.createTextNode("1");
    nameHolder.appendChild(input);
    form.style.backgroundColor="black";
}
form.addEventListener("submit",summit);

