<?php
  // Moves uploaded video file to a uploads folder
  $target_path = "./" . basename($_FILES["file"]["name"]);
  $moved = move_uploaded_file($_FILES["file"]["tmp_name"], $target_path );
  if( $moved ) {
    echo '{ "success": true }';
  } else {
    echo "Not uploaded because of error #".$_FILES["file"]["error"];
  }
?>