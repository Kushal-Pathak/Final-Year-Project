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
if ($data === null || !isset($data["post_id"]) || !isset($data["comment_offset"]) || !is_numeric($data["comment_offset"])) {
    header('Content-Type: application/json');
    echo json_encode(["status" => "error", "message" => "Invalid or missing data."]);
    $conn->close();
    exit();
}

$post_id = (int)$data["post_id"];
$comment_offset = (int)$data["comment_offset"];
$limit = 4; // Number of comments to fetch at a time for pagination

// Use prepared statements to query data
$stmt = $conn->prepare("SELECT 
    comments.comment_description, 
    comments.comment_id,
    users.first_name,
    comments.user_id,
    comments.post_id
FROM 
    comments
JOIN 
    users 
ON 
    comments.user_id = users.user_id
WHERE 
    comments.post_id = ?
LIMIT ? OFFSET ?;");

// Bind parameters: `post_id`, `limit`, and `comment_offset`
$stmt->bind_param("iii", $post_id, $limit, $comment_offset);

if ($stmt->execute()) {
    $result = $stmt->get_result(); // Get the result set from the executed query

    $comments = []; // Initialize an array to hold the results

    // Fetch all rows and add them to the array
    while ($row = $result->fetch_assoc()) {
        // Check if the comment was posted by the current user
        if ($row['user_id'] == $user_id) {
            $row['mutable'] = true;
        } else {
            $row['mutable'] = false;
        }
        unset($row['user_id']); // Remove `user_id` if not needed in the response
        $comments[] = $row;
    }
    header('Content-Type: application/json');
    // Return the data as a JSON response
    echo json_encode(["status" => "success", "comments" => $comments]);
} else {
    error_log("Database error: " . $stmt->error);
    header('Content-Type: application/json');
    // Handle query execution error
    echo json_encode(["status" => "error", "message" => "Unable to fetch comments at the moment."]);
}

$stmt->close();
$conn->close();
?>
