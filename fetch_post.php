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
    header('Content-Type: application/json');
    echo json_encode(["status" => "error", "message" => "Database connection failed."]);
    exit();
}

// Read and decode the JSON data from the request body
$data = json_decode(file_get_contents("php://input"), true);

// Validate the received data
if ($data === null || !isset($data["post_offset"]) || !is_numeric($data["post_offset"])) {
    header('Content-Type: application/json');
    echo json_encode(["status" => "error", "message" => "Invalid or missing data."]);
    $conn->close();
    exit();
}

$post_offset = (int)$data["post_offset"];

// Use prepared statements to query posts and user data
$stmt = $conn->prepare("SELECT 
    posts.post_id,
    posts.post_title,
    posts.post_description,
    posts.circuit,
    posts.user_id,
    posts.post_likes,
    posts.created_at,
    users.first_name
FROM 
    posts
JOIN 
    users 
ON 
    posts.user_id = users.user_id
LIMIT 3 OFFSET ?;");
$stmt->bind_param("i", $post_offset);

if ($stmt->execute()) {
    $result = $stmt->get_result(); // Get the result set from the executed query

    $posts = []; // Initialize an array to hold the results

    // Fetch all rows and add them to the array
    while ($row = $result->fetch_assoc()) {
        // Check if the user_id of the post is the same as the current logged-in user
        $row["mutable"] = $row["user_id"] == $user_id;

        // Check if the current user has liked the post
        $likeStmt = $conn->prepare("SELECT 1 FROM post_likes WHERE post_id = ? AND user_id = ?");
        $likeStmt->bind_param("ii", $row["post_id"], $user_id);
        $likeStmt->execute();
        $likeResult = $likeStmt->get_result();
        $row["liked"] = $likeResult->num_rows > 0; // True if the user has liked the post
        $likeStmt->close();

        $posts[] = $row; // Add the row to the posts array
    }

    header('Content-Type: application/json');
    // Return the data as a JSON response
    echo json_encode(["status" => "success", "posts" => $posts]);
} else {
    error_log("Database error: " . $stmt->error);
    header('Content-Type: application/json');
    // Handle query execution error
    echo json_encode(["status" => "error", "message" => "Unable to fetch posts at the moment."]);
}

$stmt->close();
$conn->close();
