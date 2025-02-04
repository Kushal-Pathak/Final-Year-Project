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

// Use prepared statements to delete data
$stmt = $conn->prepare("DELETE FROM circuits WHERE user_id = ? AND circuit_id = ?");
$stmt->bind_param("ii", $user_id, $circuit_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        // If a row was deleted, send success response
        header('Content-Type: application/json');
        echo json_encode(["status" => "success", "msg" => "Circuit deleted successfully!"]);
    } else {
        // If no rows were deleted, send error response
        header('Content-Type: application/json');
        echo json_encode(["status" => "error", "message" => "No circuit found with the given ID."]);
    }
} else {
    error_log("Database error: " . $stmt->error);
    header('Content-Type: application/json');
    // Handle query execution error
    echo json_encode(["status" => "error", "message" => "Error deleting circuit: " . $stmt->error]);
}

$stmt->close();
$conn->close();
