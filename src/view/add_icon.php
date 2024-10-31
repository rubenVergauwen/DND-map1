<?php
$host = 'sql7.freesqldatabase.com';
$dbname = 'sql7741790';
$user = 'sql7741790';
$password = 'NCE7vEFkQR';

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);

// Insert new icon
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data['location_name'])) {
    $location_name = $conn->real_escape_string($data['location_name']);
    $loc_x = floatval($data['loc_x']);
    $loc_y = floatval($data['loc_y']);
    $page_url = $conn->real_escape_string($data['page_url']);

    $query = "INSERT INTO icons (location_name, loc_x, loc_y, page_url) VALUES ('$location_name', $loc_x, $loc_y, '$page_url')";

    if ($conn->query($query) === TRUE) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    exit; // Stop further execution after handling POST request
}

// Fetch all icons
// Fetch all icons
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT id, location_name, loc_x, loc_y, page_url FROM icons"; // Include loc_x, loc_y, and page_url
    $result = $conn->query($query);

    $icons = [];
    while ($row = $result->fetch_assoc()) {
        $icons[] = $row;
    }
    echo json_encode($icons);
    exit; // Stop further execution after fetching icons
}


// Delete an icon
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data['id'])) {
    $id = intval($data['id']);
    $query = "DELETE FROM icons WHERE id = $id";

    if ($conn->query($query) === TRUE) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
}

$conn->close();
?>
