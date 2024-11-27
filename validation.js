
  // Function to validate the form
  function validateForm(event) {
    // Prevent the default form submission
    event.preventDefault();

    // Get form values
    const firstNameField = document.getElementById("firstName");
    const lastNameField = document.getElementById("lastName");
    const emailField = document.getElementById("email");
    const phoneField = document.getElementById("phone");
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirmPassword");

    const firstName = firstNameField.value.trim();
    const lastName = lastNameField.value.trim();
    const email = emailField.value.trim();
    //const phone = phoneField.value.trim();
    const password = passwordField.value.trim();
    const confirmPassword = confirmPasswordField.value.trim();

    // Regular expressions for validation
    const nameRegex = /^[A-Za-z]+$/; // Alphabetic only
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
    //const phoneRegex = /^9\d{9}$/; // Starts with 9 and is 10 digits long

    // Validation checks
    if (!nameRegex.test(firstName)) {
      alert("First Name must be non-empty and contain only alphabetic characters.");
      firstNameField.focus();
      return false;
    }

    if (!nameRegex.test(lastName)) {
      alert("Last Name must be non-empty and contain only alphabetic characters.");
      lastNameField.focus();
      return false;
    }

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      emailField.focus();
      return false;
    }

    // if (!phoneRegex.test(phone)) {
    //   alert("Phone number must start with 9 and be exactly 10 digits long.");
    //   phoneField.focus();
    //   return false;
    // }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      passwordField.focus();
      return false;
    }

    if (password !== confirmPassword) {
      alert("Password and Confirm Password must match.");
      confirmPasswordField.focus();
      return false;
    }

    // If all validations pass, allow form submission
    alert("Form submitted successfully!");
    document.querySelector("form").submit();
  }

  // Attach the validateForm function to the form's submit event
  document.querySelector("form").addEventListener("submit", validateForm);

