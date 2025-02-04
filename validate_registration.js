function validate(e) {
  e.preventDefault();
  const firstname = document.querySelector("#firstName");
  const lastname = document.querySelector("#lastName");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  const confirmPassword = document.querySelector("#confirmPassword");

  if (!firstname.value) {
    alert("Enter first name!");
    firstname.focus();
  } else if (!isOnlyLetters(firstname.value)) {
    alert("Enter valid first name!");
    firstname.focus();
  } else if (!lastname.value) {
    alert("Enter last name!");
    lastname.focus();
  } else if (!isOnlyLetters(lastname.value)) {
    alert("Enter valid last name!");
    lastname.focus();
  } else if (!email.value) {
    alert("Email can't be empty!");
    email.focus();
  } else if (!isValidEmail(email.value)) {
    alert("Email is invalid!");
    email.focus();
  } else if (!password.value) {
    alert("Password can't be empty!");
    password.focus();
  } else if (password.value.length < 3) {
    alert("Password must be at least 3 characters long!");
    password.focus();
  } else if (!confirmPassword.value) {
    alert("Confirm password can't be empty!");
    confirmPassword.focus();
  } else if (password.value !== confirmPassword.value) {
    alert("Password and confirm password should match!");
    confirmPassword.focus();
  } else {
    // If everything is valid, submit the form
    document.querySelector("form").submit();
  }
}

function isOnlyLetters(str) {
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const charCode = char.charCodeAt(0);

    // Check if character is not a letter
    if (
      !(charCode >= 65 && charCode <= 90) && // Uppercase letters
      !(charCode >= 97 && charCode <= 122)
    ) {
      // Lowercase letters
      return false;
    }
  }
  return true; // All characters are letters
}

function isValidEmail(email) {
  // Basic email validation: check for the presence of "@" and "."
  const atSymbolIndex = email.indexOf("@");
  const dotIndex = email.lastIndexOf(".");

  return (
    atSymbolIndex > 0 && // "@" is not the first character
    dotIndex > atSymbolIndex + 1 && // "." comes after "@"
    dotIndex < email.length - 1 // "." is not the last character
  );
}
