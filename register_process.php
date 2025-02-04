<?php
// Database credentials
$host = "localhost"; 
$username = "root";  
$password_db = "";   
$database = "dl_simulator_db";

// Establish a connection to the database
$conn = new mysqli($host, $username, $password_db, $database);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form values using $_POST
    $firstName = $_POST['firstName'] ?? '';
    $lastName = $_POST['lastName'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirmPassword'] ?? '';

    // Ensure passwords match
    if ($password !== $confirmPassword) {
        $msg = urlencode("Passwords do not match!");
        header("Location: info.php?msg=$msg&type=register");
        exit;
    }

    // Hash the password before saving
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    try {
        // Prepare the SQL query to insert data
        $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $firstName, $lastName, $email, $hashedPassword);

        // Execute the query
        if ($stmt->execute()) {
            $msg = urlencode("Registration successful!");
            header("Location: info.php?msg=$msg&source=login&btntxt=LogIn");
            exit;
        }
    } catch (mysqli_sql_exception $e) {
        if ($conn->errno === 1062) { // Duplicate entry error code
            $msg = urlencode("Email is already registered!");
        } else {
            $msg = urlencode("An error occurred. Please try again.");
        }
        header("Location: info.php?msg=$msg&source=register");
        exit;
    } finally {
        // Close the statement
        if (isset($stmt)) {
            $stmt->close();
        }
    }
}

// Close the connection
$conn->close();
?>
