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
if ($data === null || !isset($data["post_id"])) {
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "Invalid or missing post ID."]);
    $conn->close();
    exit();
}

$post_id = (int)$data["post_id"];

// Check if the post exists and belongs to the user
$stmt = $conn->prepare("SELECT post_id FROM posts WHERE post_id = ? AND user_id = ?");
$stmt->bind_param("ii", $post_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "Post not found or unauthorized action."]);
    $stmt->close();
    $conn->close();
    exit();
}

// Proceed to delete the post
$stmt = $conn->prepare("DELETE FROM posts WHERE post_id = ? AND user_id = ?");
$stmt->bind_param("ii", $post_id, $user_id);

if ($stmt->execute()) {
    header("Content-Type: application/json");
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "Post deleted successfully."]);
} else {
    header("Content-Type: application/json");
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to delete the post: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
