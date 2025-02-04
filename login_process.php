<?php
// Database credentials
$host = "localhost";
$username = "root";
$password_db = "";
$database = "dl_simulator_db";

// Start session to store user data on successful login
session_start();

// Establish a database connection
$conn = new mysqli($host, $username, $password_db, $database);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get email and password from the form
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    // Simple validation for empty fields
    if (empty($email) || empty($password)) {
        $msg = urlencode("Email and password are required!");
        header("Location: info.php?msg=$msg&source=login");
        exit;
    }

    // Check if the email exists in the database
    $query = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($query);

    if ($result->num_rows == 1) {
        // Fetch user data
        $user = $result->fetch_assoc();
        // Verify the password
        if (password_verify($password, $user['password'])) {
            // Save user data in session
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['user_name'] = $user['first_name'];

            // Redirect to index.php
            header("Location: index.php");
            exit;
        } else {
            // Invalid password
            $msg = urlencode("Invalid password. Please try again.");
            header("Location: info.php?msg=$msg&source=login");
            exit;
        }
    } else {
        // Email not found
        $msg = urlencode("No account found with this email.");
        header("Location: info.php?msg=$msg&source=login");
        exit;
    }
}

// Close the connection
$conn->close();
