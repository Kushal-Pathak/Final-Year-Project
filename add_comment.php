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
    echo json_encode(["status" => "error", "message" => "Database connection failed."]);
    exit();
}

// Read and decode the JSON data from the request body
$data = json_decode(file_get_contents("php://input"), true);

// Validate the received data
if ($data === null || !isset($data["comment_description"]) || !isset($data["post_id"])) {
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "Invalid or missing data."]);
    $conn->close();
    exit();
}

// Extract and sanitize data
$cmt_txt = trim($data["comment_description"]);
$post_id = intval($data["post_id"]);

// Check if the comment text is empty
if (empty($cmt_txt)) {
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "Comment text cannot be empty."]);
    $conn->close();
    exit();
}

// Use prepared statements to insert data
$stmt = $conn->prepare("INSERT INTO comments (comment_description, post_id, user_id) VALUES (?, ?, ?)");
if (!$stmt) {
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "Statement preparation failed."]);
    $conn->close();
    exit();
}
$stmt->bind_param("ssi", $cmt_txt, $post_id, $user_id);

if ($stmt->execute()) {
    header("Content-Type: application/json");
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "Comment added successfully!"]);
} else {
    header("Content-Type: application/json");
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to add comment."]);
}

$stmt->close();
$conn->close();
