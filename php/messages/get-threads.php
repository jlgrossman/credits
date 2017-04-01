<?
include_once '../utils.php';

exitIfNotLoggedIn();

$id = getUserID();
$output = isset($_POST['output']) ? $_POST['output'] : 'html';

$query = $connection->prepare('
  SELECT user.username, COUNT(message.id)
  FROM messages AS message
  INNER JOIN users AS user
  ON user.id = message.from_id
  WHERE message.to_id = ? AND message.is_read = FALSE
  GROUP BY message.from_id
');
$query->bind_param('i', $id);
$query->execute();
$query->bind_result($user, $unread);

$threads = array();
$totalUnread = 0;

while($query->fetch()){
  $totalUnread += $unread;
  $threads[] = array('from' => $user, 'unread' => $unread);
}

$query->close();
$connection->close();

if($output == 'json'){
  echo json_encode(array('success'=>true, 'unread'=>$totalUnread, 'threads'=>$threads));
} else {
  include '../components/threads.php';
}

?>
