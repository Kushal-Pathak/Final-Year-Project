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
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Read and decode the JSON data from the request body
$data = json_decode(file_get_contents("php://input"), true);

// Validate the received data
if ($data === null || !isset($data["post_id"]) || !is_numeric($data["post_id"])) {
    echo json_encode(["status" => "error", "message" => "Invalid or missing data."]);
    $conn->close();
    exit();
}

$post_id = (int)$data["post_id"];

// Use prepared statements to check if the post is already liked by the user
$stmt = $conn->prepare("SELECT 1 FROM post_likes WHERE post_id = ? AND user_id = ?");
$stmt->bind_param("ii", $post_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Unlike the post if it's already liked
    $stmt = $conn->prepare("DELETE FROM post_likes WHERE post_id = ? AND user_id = ?");
    $stmt->bind_param("ii", $post_id, $user_id);

    if ($stmt->execute()) {
        // Decrement the likes count in the posts table
        $updateStmt = $conn->prepare("UPDATE posts SET post_likes = post_likes - 1 WHERE post_id = ?");
        $updateStmt->bind_param("i", $post_id);
        $updateStmt->execute();
        $updateStmt->close();

        // Get the updated total likes
        $likesStmt = $conn->prepare("SELECT post_likes FROM posts WHERE post_id = ?");
        $likesStmt->bind_param("i", $post_id);
        $likesStmt->execute();
        $likesResult = $likesStmt->get_result();
        $likesRow = $likesResult->fetch_assoc();
        $total_likes = $likesRow['post_likes'];
        $likesStmt->close();

        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "action" => "unliked",
            "message" => "Post unliked successfully.",
            "total_likes" => $total_likes
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Error unliking the post: " . $stmt->error]);
    }
} else {
    // Like the post if it's not already liked
    $stmt = $conn->prepare("INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $post_id, $user_id);

    if ($stmt->execute()) {
        // Increment the likes count in the posts table
        $updateStmt = $conn->prepare("UPDATE posts SET post_likes = post_likes + 1 WHERE post_id = ?");
        $updateStmt->bind_param("i", $post_id);
        $updateStmt->execute();
        $updateStmt->close();

        // Get the updated total likes
        $likesStmt = $conn->prepare("SELECT post_likes FROM posts WHERE post_id = ?");
        $likesStmt->bind_param("i", $post_id);
        $likesStmt->execute();
        $likesResult = $likesStmt->get_result();
        $likesRow = $likesResult->fetch_assoc();
        $total_likes = $likesRow['post_likes'];
        $likesStmt->close();

        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "action" => "liked",
            "message" => "Post liked successfully.",
            "total_likes" => $total_likes
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Error liking the post: " . $stmt->error]);
    }
}

$stmt->close();
$conn->close();
?>
