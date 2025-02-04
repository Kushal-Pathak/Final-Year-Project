<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    // Redirect to register if not logged in
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
if ($data === null || !isset($data["post_id"])) {
    header('Content-Type: application/json');
    echo json_encode(["status" => "error", "message" => "Invalid or missing data."]);
    $conn->close();
    exit();
}

$post_id = (int)$data["post_id"];  // Ensure the post_id is an integer

// Use prepared statements to query data
$stmt = $conn->prepare("SELECT circuit FROM posts WHERE post_id = ?");
$stmt->bind_param("i", $post_id);

if ($stmt->execute()) {
    $result = $stmt->get_result(); // Get the result set from the executed query

    if ($row = $result->fetch_assoc()) {
        // Return the circuit data if found
        header('Content-Type: application/json');
        echo json_encode(["status" => "success", "circuit" => $row["circuit"]]);
    } else {
        // Handle the case where no record is found for the given post_id
        header('Content-Type: application/json');
        echo json_encode(["status" => "error", "message" => "Post not found."]);
    }
} else {
    error_log("Database error: " . $stmt->error);
    header('Content-Type: application/json');
    // Handle query execution error
    echo json_encode(["status" => "error", "message" => "Error fetching circuits: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
