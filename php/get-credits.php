<?php
include_once 'user-session.php';
include_once 'connection.php';

// use session id if no post id is given
$id = isset($_POST['id']) ? intval($_POST['id']) : $user['id'];

$query = $connection->prepare('SELECT credits FROM users WHERE id = ?');
$query->bind_param('i', $id);
$query->execute();
$query->bind_result($credits);

if($query->fetch()){
  $result = array('success' => true, 'msg' => $credits);
} else {
  $result = array('success' => false, 'msg' => 0);
}

$query->close();

echo json_encode($result);
 ?>
