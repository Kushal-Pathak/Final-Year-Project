<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "User not logged in."]);
    exit();
}
$user_id = (int)$_SESSION['user_id']; // Ensure user_id is an integer

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
if ($data === null || !isset($data["comment_id"]) || !is_numeric($data["comment_id"])) {
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "Invalid or missing comment ID."]);
    $conn->close();
    exit();
}

$comment_id = (int)$data["comment_id"];

// Use a prepared statement to check if the comment exists and belongs to the current user
$stmt = $conn->prepare("SELECT user_id FROM comments WHERE comment_id = ?");
$stmt->bind_param("i", $comment_id);

if ($stmt->execute()) {
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        // No comment found with the given ID
        header("Content-Type: application/json");
        echo json_encode(["status" => "error", "message" => "Comment not found."]);
    } else {
        $row = $result->fetch_assoc();

        if ((int)$row['user_id'] !== $user_id) { // Use strict comparison
            // The comment does not belong to the logged-in user
            header("Content-Type: application/json");
            echo json_encode(["status" => "error", "message" => "You are not authorized to delete this comment."]);
        } else {
            // The comment belongs to the current user; delete it
            $deleteStmt = $conn->prepare("DELETE FROM comments WHERE comment_id = ?");
            $deleteStmt->bind_param("i", $comment_id);

            if ($deleteStmt->execute()) {
                header("Content-Type: application/json");
                echo json_encode(["status" => "success", "message" => "Comment deleted successfully."]);
            } else {
                header("Content-Type: application/json");
                echo json_encode(["status" => "error", "message" => "Failed to delete comment: " . $deleteStmt->error]);
            }

            $deleteStmt->close();
        }
    }
} else {
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "Failed to query comment: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
