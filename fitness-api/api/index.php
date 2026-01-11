<?php

require_once __DIR__ . '/../lib/file-handler.php';
require_once __DIR__ . '/../lib/validator.php';

// CORS headers are handled in .htaccess to prevent duplicates
header('Content-Type: application/json; charset=utf-8');

// Prevent caching to ensure fresh data
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$handler = new FileHandler();
$validator = new Validator();

try {
    switch ($method) {
        case 'GET':
            $data = $handler->readEntries();
            echo json_encode([
                'success' => true,
                'entries' => $data['entries'],
                'count' => count($data['entries']),
                'version' => $data['version']
            ]);
            break;

        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);

            if (!$input) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid JSON'
                ]);
                exit;
            }

            // Validate input
            $validation = $validator->validateEntry($input);

            if (!$validation['valid']) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Validation failed',
                    'details' => $validation['errors']
                ]);
                exit;
            }

            // Append entry
            $result = $handler->appendEntry($input);

            if ($result['success']) {
                http_response_code(201);
                echo json_encode($result);
            } else {
                if ($result['error'] === 'duplicate') {
                    http_response_code(409);
                    echo json_encode([
                        'success' => false,
                        'error' => 'Entry already exists for date ' . $input['date']
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode([
                        'success' => false,
                        'error' => 'Failed to save entry: ' . $result['error']
                    ]);
                }
            }
            break;

        default:
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'error' => 'Method not allowed'
            ]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Internal server error'
    ]);
    error_log("API Error: " . $e->getMessage());
}
