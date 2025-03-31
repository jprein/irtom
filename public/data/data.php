<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fileName = $_SERVER['HTTP_X_FILE_NAME'] ?? 'irtom.csv';
    $csvContent = file_get_contents('php://input');

    if (file_put_contents($fileName, $csvContent)) {
        echo json_encode(['success' => true, 'message' => 'File uploaded successfully.']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to save the file.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}