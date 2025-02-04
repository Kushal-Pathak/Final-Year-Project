function validate(e) {
  e.preventDefault(); // Prevent default form submission

  // Get email and password input fields
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");

  // Validation checks
  if (!email.value) {
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
  } else {
    // If everything is valid, submit the form
    document.querySelector("form").submit();
  }
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
