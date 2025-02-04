<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "User not logged in."]);
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
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Read and decode the JSON data from the request body
$data = json_decode(file_get_contents("php://input"), true);

// Validate the received data
if ($data === null || !isset($data["post_title"]) || !isset($data["post_description"]) || !isset($data["circuit"])) {
    header("Content-Type: application/json");
    echo json_encode([
        "status" => "error",
        "message" => "Cannot add post, invalid or missing input data.",
        "received_data" => json_encode($data) // Log received data for debugging
    ]);
    $conn->close();
    exit();
}

// Extract and sanitize data
$post_title = trim($data["post_title"]);
$post_description = trim($data["post_description"]);
$circuit = $data["circuit"];

// Validate JSON format for 'circuit' if necessary
if (!is_string($circuit) || json_decode($circuit) === null) {
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "Invalid JSON format for 'circuit'."]);
    $conn->close();
    exit();
}

// Check if the fields are empty
if (empty($post_title) || empty($post_description) || empty($circuit)) {
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "Post fields cannot be empty."]);
    $conn->close();
    exit();
}

// Use prepared statements to insert data
$stmt = $conn->prepare("INSERT INTO posts (post_title, post_description, circuit, user_id) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "Statement preparation failed: " . $conn->error]);
    $conn->close();
    exit();
}

// Bind the parameters
$stmt->bind_param("sssi", $post_title, $post_description, $circuit, $user_id);

// Execute and respond
if ($stmt->execute()) {
    header("Content-Type: application/json");
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "Post added successfully!"]);
} else {
    header("Content-Type: application/json");
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to add post: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
