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
if ($data === null || !isset($data["circuit_name"]) || !isset($data["circuit"])) {
    echo json_encode(["status" => "error", "message" => "Invalid or missing data."]);
    $conn->close();
    exit();
}

// Extract and sanitize data
$circuit_name = $data["circuit_name"];
$circuit = $data["circuit"];

// Use prepared statements to insert data
$stmt = $conn->prepare("INSERT INTO circuits (circuit_name, circuit, user_id) VALUES (?, ?, ?)");
$stmt->bind_param("ssi", $circuit_name, $circuit, $user_id);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "Circuit saved successfully!"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Error saving circuit: " . $stmt->error]);
}

$stmt->close();
$conn->close();
