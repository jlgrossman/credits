<?php
include_once 'user-session.php';
include_once 'connection.php';

// gets number of credits for a user with a specific id
function getCredits($id){
  global $connection;
  $id = intval($id);
  $query = $connection->prepare('SELECT credits FROM users WHERE id = ?');
  $query->bind_param('i', $id);
  $query->execute();
  $query->bind_result($credits);
  $success = $query->fetch();
  $query->close();
  return ($success ? $credits : -1);
}

 ?>
