<?php

class FileHandler {
    private $dataFile;

    public function __construct() {
        $this->dataFile = __DIR__ . '/../data/entries.json';
    }

    public function readEntries() {
        if (!file_exists($this->dataFile)) {
            return $this->initializeFile();
        }

        $contents = file_get_contents($this->dataFile);
        $data = json_decode($contents, true);

        if ($data === null) {
            error_log("Failed to parse JSON file");
            return $this->initializeFile();
        }

        return $data;
    }

    public function appendEntry($entry) {
        $data = $this->readEntries();

        // Check for duplicate date
        foreach ($data['entries'] as $existing) {
            if ($existing['date'] === $entry['date']) {
                return ['success' => false, 'error' => 'duplicate'];
            }
        }

        // Add timestamp and ID
        $entry['timestamp'] = date('c');
        $entry['id'] = $entry['timestamp'];

        $data['entries'][] = $entry;
        $data['last_updated'] = date('c');

        // Write atomically using temp file
        $temp = $this->dataFile . '.tmp';
        $json = json_encode($data, JSON_PRETTY_PRINT);

        if ($json === false) {
            error_log("Failed to encode JSON");
            return ['success' => false, 'error' => 'encode_failed'];
        }

        if (file_put_contents($temp, $json) === false) {
            error_log("Failed to write temp file");
            return ['success' => false, 'error' => 'write_failed'];
        }

        if (!rename($temp, $this->dataFile)) {
            error_log("Failed to rename temp file");
            @unlink($temp);
            return ['success' => false, 'error' => 'rename_failed'];
        }

        return ['success' => true, 'entry' => $entry];
    }

    private function initializeFile() {
        $data = [
            'version' => '1.0',
            'created' => date('c'),
            'last_updated' => date('c'),
            'entries' => []
        ];

        // Ensure directory exists
        $dir = dirname($this->dataFile);
        if (!is_dir($dir)) {
            mkdir($dir, 0775, true);
        }

        file_put_contents($this->dataFile, json_encode($data, JSON_PRETTY_PRINT));
        return $data;
    }
}
