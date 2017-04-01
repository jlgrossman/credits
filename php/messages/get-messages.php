<?
include_once '../utils.php';

exitIfNotLoggedIn();

$id = getUserID();
$fromId = isset($_POST['from']) ? getID($_POST['from']) : 0;
$output = isset($_POST['output']) ? $_POST['output'] : 'html';

if($fromId < 1){
  exit($errorMessages['invalidData']);
}

$query = $connection->prepare('
  SELECT message.msg, user.username
  FROM messages AS message
  INNER JOIN users AS user
  ON user.id = message.from_id
  WHERE (
    message.from_id = ? AND
    message.to_id = ? AND
    message.is_read = FALSE
  )
  ORDER BY message.id DESC
');
$query->bind_param('ii', $fromId, $id);
$query->execute();
$query->bind_result($message, $user);

$messages = array();

while($query->fetch()){
  $messages[] = $message;
}

$query->close();

$query = $connection->prepare('UPDATE messages SET is_read = TRUE WHERE from_id = ? AND to_id = ?');
$query->bind_param('ii', $fromId, $id);
$query->execute();

$query->close();
$connection->close();

if($output == 'json'){
  echo json_encode(array('success'=>true, 'msg'=>$messages, 'from'=>$user));
} else {
  include '../components/messages.php';
}

?>
