function validate(e) {
  e.preventDefault(); // Prevent default form submission

  // Get email and password input fields
  const old_password = document.querySelector("#old-password");
  const new_password = document.querySelector("#new-password");
  const confirm_new_password = document.querySelector("#confirm-new-password");

  // Validation checks
  if (!old_password.value) {
    alert("Old password can't be empty!");
    old_password.focus();
  } else if (old_password.value.length < 3) {
    alert("Old password must be at least 3 characters long!");
    old_password.focus();
  } else if (!new_password.value) {
    alert("New password can't be empty!");
    new_password.focus();
  } else if (new_password.value.length < 3) {
    alert("New password must be at least 3 characters long!");
    new_password.focus();
  } else if (confirm_new_password.value !== new_password.value) {
    alert("New password and confirm new password must match!");
    confirm_new_password.focus();
  } else {
    // If everything is valid, submit the form
    document.querySelector("form").submit();
  }
}
