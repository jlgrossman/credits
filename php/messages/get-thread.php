<?
include_once '../utils.php';

exitIfNotLoggedIn();

$me = getUserID();
$them = isset($_POST['user']) ? getId($_POST['user']) : 0;
$markAsRead = isset($_POST['read']);
$output = isset($_POST['output']) ? $_POST['output'] : 'html';

if($me < 1 || $them < 1 || $me == $them){
  $connection->close();
  exit($errorMessages['invalidData']);
}

if($markAsRead){
  $query = $connection->prepare('
    UPDATE messages SET was_read = TRUE
    WHERE messages.to_id = ? AND messages.from_id = ?
  ');
  $query->bind_param('ii', $me, $them);
  $query->execute();
  $query->close();
}

$query = $connection->prepare('
  SELECT message.msg, from_user.username, to_user.username, from_user.id, to_user.id, message.was_read
  FROM messages AS message
  INNER JOIN users AS from_user ON message.from_id = from_user.id
  INNER JOIN users AS to_user ON message.to_id = to_user.id
  WHERE
    (from_user.id = ? AND to_user.id = ?)
    OR
    (to_user.id = ? AND from_user.id = ?)
  ORDER BY message.id DESC
  LIMIT 5
');
$query->bind_param('iiii', $me, $them, $me, $them);
$query->execute();
$query->bind_result($msg, $fromName, $toName, $fromId, $toId, $read);

$messages = array();

while($query->fetch()){
  $from = array('id'=>$fromId, 'name'=>$fromName);
  $to = array('id'=>$toId, 'name'=>$toName);
  $messages[] = array('from' => $from, 'to' => $to, 'msg' => $msg, 'read' => $read);
}

$query->close();
$connection->close();

if($output == 'json'){
  echo json_encode(array('success' => true, 'messages' => $messages));
} else {
  include '../components/messages.php';
}


?>
