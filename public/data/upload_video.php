<?php
// upload.php
// Handles BOTH:
// 1) Simple upload (your original behavior)
// 2) Chunked upload (uploadId + chunkIndex + totalChunks)

// Directory = same folder where this PHP file is located
$saveDir = __DIR__;

function normalizeWebmFilename(string $name): string {
    $base = basename($name);
    // Remove one or more trailing ".webm" so we can append exactly once.
    $withoutRepeatedWebm = preg_replace('/(?:\.webm)+$/i', '', $base);
    return $withoutRepeatedWebm . '.webm';
}

// Must receive a file
if (!isset($_FILES["vidfile"])) {
    http_response_code(400);
    echo "No file uploaded (expected field 'vidfile').";
    exit;
}

// Check whether we are receiving chunk metadata
$isChunked = isset($_POST["uploadId"], $_POST["chunkIndex"], $_POST["totalChunks"]);

if ($isChunked) {
    // -----------------------
    // CHUNKED UPLOAD HANDLER
    // -----------------------

    $uploadId         = $_POST["uploadId"];
    $chunkIndex       = intval($_POST["chunkIndex"]);
    $totalChunks      = intval($_POST["totalChunks"]);
    $originalFilename = isset($_POST["originalFilename"]) ? $_POST["originalFilename"] : "recording.webm";

    $tmpName = $_FILES["vidfile"]["tmp_name"];

    // Temporary file where chunks accumulate
    $tempPath = $saveDir . "/" . $uploadId . ".part";

    if ($chunkIndex === 0) {
        // First chunk = overwrite/create new file
        if (!move_uploaded_file($tmpName, $tempPath)) {
            http_response_code(500);
            echo "Failed to write first chunk.";
            exit;
        }
    } else {
        // Append next chunk
        $in  = fopen($tmpName, "rb");
        $out = fopen($tempPath, "ab");

        if ($in && $out) {
            while ($buff = fread($in, 4096)) {
                fwrite($out, $buff);
            }
        }

        if ($in) fclose($in);
        if ($out) fclose($out);
        @unlink($tmpName);
    }

    // If this is the last chunk, rename .part file to final filename
    if ($chunkIndex === $totalChunks - 1) {
        $finalFilename = normalizeWebmFilename($originalFilename);
        $finalPath = $saveDir . "/" . $finalFilename;

        if (!rename($tempPath, $finalPath)) {
            http_response_code(500);
            echo "Failed to finalize file.";
            exit;
        }

        echo "Chunked upload complete: " . basename($finalPath);
    } else {
        echo "Chunk {$chunkIndex} of {$totalChunks} received.";
    }

    exit;
}

// -----------------------
// SIMPLE UPLOAD HANDLER
// (your old behavior)
// -----------------------

$originalFilename = normalizeWebmFilename($_FILES["vidfile"]["name"]);

$targetPath = $saveDir . "/" . basename($originalFilename);

if (move_uploaded_file($_FILES["vidfile"]["tmp_name"], $targetPath)) {
    echo "Simple upload complete: " . basename($originalFilename);
} else {
    http_response_code(500);
    echo "Failed to save uploaded file.";
}
?>
