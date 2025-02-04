<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: register.php");
    exit();
}
$user_id = $_SESSION['user_id'];

// Database connection details
$host = "localhost";
$username = "root";
$password = "";
$dbname = "dl_simulator_db";

// Connect to the database
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Read and decode the JSON data from the request body
$data = json_decode(file_get_contents("php://input"), true);

// Validate the received data
if ($data === null || !isset($data["circuit_id"])) {
    header('Content-Type: application/json');
    echo json_encode(["status" => "error", "message" => "Invalid or missing data."]);
    $conn->close();
    exit();
}

$circuit_id = (int)$data["circuit_id"];
// Use prepared statements to query data
$stmt = $conn->prepare("SELECT circuit FROM circuits WHERE user_id = ? AND circuit_id = ?");
$stmt->bind_param("ii", $user_id, $circuit_id);

if ($stmt->execute()) {
    $result = $stmt->get_result(); // Get the result set from the executed query

    $circuits = []; // Initialize an array to hold the results

    // Fetch the first row
    $row = $result->fetch_assoc();

    header('Content-Type: application/json');
    // Return the data as a JSON response
    echo json_encode(["status" => "success", "circuit" => $row["circuit"]]);
} else {
    error_log("Database error: " . $stmt->error);
    header('Content-Type: application/json');
    // Handle query execution error
    echo json_encode(["status" => "error", "message" => "Error fetching circuits: " . $stmt->error]);
}

$stmt->close();
$conn->close();
