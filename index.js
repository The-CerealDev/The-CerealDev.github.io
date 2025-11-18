let nameInp = document.getElementById('participant-name');
let submitBtn = document.getElementById('addParticipant');
let arr = [];
function addParticipant(){
  console.log(nameInp.value);
  person = nameInp.value;
  document.createElement("p")
  if (person === "print"){
    console.log(arr);
  }
  else{
    arr.push(person);
  
  }
  
}
submitBtn.addEventListener("click", addParticipant);
nameInp.addEventListener("keypress", (event)=>{
 
  if (event.key === "Enter"){
    // addParticipant();
    submitBtn.click();
  }
})
