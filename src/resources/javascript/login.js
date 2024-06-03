function openModal() {
  /* Note that you do NOT have to do a document.getElementById anywhere in this exercise. Use the elements below */
  var myInput = document.getElementById("r_password");
  var confirmMyInput = document.getElementById("cpsw");
  var letter = document.getElementById("letter");
  var capital = document.getElementById("capital");
  var number = document.getElementById("number");
  var symbol = document.getElementById("symbol"); 
  var length = document.getElementById("length");
  var match = document.getElementById("match");

  // When the user starts to type something inside the password field
  myInput.onkeyup = function () {
    console.log("helllooo");

    var lowerCaseLetters = /^(?=.*[a-z]).+$/; // : Fill in the regular expression for lowerCaseLetters
    var upperCaseLetters = /^(?=.*[A-Z]).+$/; // : Fill in the regular expression for upperCaseLetters
    var numbers = /^(?=.*[0-9]).+$/; // Fill in the regular expression for digits // Fill in the regular expression for symbols
     // : Change the minimum length to what what it needs to be in the question
        /*
         - So first read up on classList.  
         - Perform a console.log(letter.classList) and check the array that you see. By default the first time, there should be just 1 element and it should be
         "invalid". "invalid" is a class that is present in login.css. 
         - Below, there are a bunch of if blocks and else blocks.
         - Each if block means that some successful condition is satisfied for our password condition. So the red cross need to be converted to a check mark.
         - Each else block stands for a failed condition, so the green check mark needs to be a red cross again.
         - All that you need to do is, in each of the blocks, fill in the correct classNames for the remove and the add methods.
         */

    // Validate lowercase letters
    if (myInput.value.match(lowerCaseLetters)) {
      letter.classList.remove("invalid");
      letter.classList.add("valid");
    } else {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
    }

    // Validate capital letters
    if (myInput.value.match(upperCaseLetters)) {
      capital.classList.remove("invalid");
      capital.classList.add("valid");
    } else {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
    }

    // Validate numbers
    if (myInput.value.match(numbers)) {
      number.classList.remove("invalid");
      number.classList.add("valid");
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
    }

  };;


  confirmMyInput.onkeyup = function () {


    var passEqualsConfPass = false     
    
    if(myInput.value == confirmMyInput.value){
      passEqualsConfPass = true
    }
    
    
    if (passEqualsConfPass) {
      match.classList.remove("invalid");
      match.classList.add("valid");
    } else {
      match.classList.remove("valid");
      match.classList.add("invalid");
    }

    enableButton(letter, capital, number, length, match);
  };
}

function enableButton(letter, capital, number, length, match) {
  var button = document.getElementById("my_submit_button");
  var condition = false;
  if(capital.classList.value == "valid" &&
  letter.classList.value == "valid" &&
  match.classList.value == "valid" ){
    condition = true;
  }

  if (condition) {
    button.disabled = false;
  }
  else{
    button.disabled = true;
  }
}

