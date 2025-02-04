<?php
// Start session to access user session data
session_start();
$pwdlen = 3;

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    $msg = urlencode("User not logged in.");
    header("Location: info.php?msg=$msg&source=login&btntxt=Login");
    exit();
}

$user_id = $_SESSION['user_id'];

// Database credentials
$host = "localhost";
$username = "root";
$password_db = "";
$database = "dl_simulator_db";

// Establish a database connection
$conn = new mysqli($host, $username, $password_db, $database);

// Check the connection
if ($conn->connect_error) {
    $msg = urlencode("Database connection failed.");
    header("Location: info.php?msg=$msg&source=change_password");
    exit();
}

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get input fields from the form
    $old_password = trim($_POST['old_password'] ?? '');
    $new_password = trim($_POST['new_password'] ?? '');
    $confirm_new_password = trim($_POST['confirm_new_password'] ?? '');

    // Validate input fields
    if (empty($old_password) || empty($new_password) || empty($confirm_new_password)) {
        $msg = urlencode("All fields are required.");
        header("Location: info.php?msg=$msg&source=change_password");
        exit();
    }

    if ($new_password !== $confirm_new_password) {
        $msg = urlencode("Passwords do not match.");
        header("Location: info.php?msg=$msg&source=change_password");
        exit();
    }

    if (strlen($new_password) < $pwdLen) {
        $msg = urlencode("Password must be at least 8 characters long.");
        header("Location: info.php?msg=$msg&source=change_password");
        exit();
    }

    // Check if the old password is correct
    $query = "SELECT password FROM users WHERE user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $msg = urlencode("User not found.");
        header("Location: info.php?msg=$msg&source=change_password");
        exit();
    }

    $user = $result->fetch_assoc();
    if (!password_verify($old_password, $user['password'])) {
        $msg = urlencode("Old password is incorrect.");
        header("Location: info.php?msg=$msg&source=change_password");
        exit();
    }

    // Hash the new password
    $new_password_hash = password_hash($new_password, PASSWORD_BCRYPT);

    // Update the password in the database
    $updateQuery = "UPDATE users SET password = ? WHERE user_id = ?";
    $updateStmt = $conn->prepare($updateQuery);
    $updateStmt->bind_param("si", $new_password_hash, $user_id);

    if ($updateStmt->execute()) {
        $msg = urlencode("Password updated successfully.");
        header("Location: info.php?msg=$msg&source=index");
        exit();
    } else {
        $msg = urlencode("Failed to update password.");
        header("Location: info.php?msg=$msg&source=change_password");
        exit();
    }
}

// Close the database connection
$conn->close();
