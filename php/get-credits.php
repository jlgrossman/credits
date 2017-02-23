<?php
include_once 'user-session.php';
include_once 'connection.php';

$query = $connection->prepare('SELECT credits FROM users WHERE id = ?');
$query->bind_param('i', $users['id']);
$query->execute();
$query->bind_result($credits);

if($query->fetch()){
  $result = array('success' => true, 'msg' => $credits);
} else {
  $result = array('success' => false, 'msg' => 0);
}

echo json_encode($result);
 ?>
