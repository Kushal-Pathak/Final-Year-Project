<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "User not logged in."]);
    exit();
}
$user_id = (int)$_SESSION['user_id']; // Get the logged-in user's ID

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
if ($data === null || !isset($data["comment_description"]) || !isset($data["comment_id"]) || !is_numeric($data["comment_id"])) {
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "Invalid or missing input data."]);
    $conn->close();
    exit();
}

$comment_description = trim($data["comment_description"]);
$comment_id = (int)$data["comment_id"];

// Ensure the comment description is not empty
if (empty($comment_description)) {
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "Comment description cannot be empty."]);
    $conn->close();
    exit();
}

// Check if the comment exists and belongs to the logged-in user
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

        if ((int)$row['user_id'] !== $user_id) {
            // The comment does not belong to the logged-in user
            header("Content-Type: application/json");
            echo json_encode(["status" => "error", "message" => "You are not authorized to edit this comment."]);
        } else {
            // Update the comment
            $updateStmt = $conn->prepare("UPDATE comments SET comment_description = ? WHERE comment_id = ?");
            $updateStmt->bind_param("si", $comment_description, $comment_id);

            if ($updateStmt->execute()) {
                header("Content-Type: application/json");
                echo json_encode(["status" => "success", "message" => "Comment updated successfully."]);
            } else {
                header("Content-Type: application/json");
                echo json_encode(["status" => "error", "message" => "Failed to update comment: " . $updateStmt->error]);
            }

            $updateStmt->close();
        }
    }
} else {
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "Failed to query comment: " . $stmt->error]);
}

$stmt->close();
$conn->close();
