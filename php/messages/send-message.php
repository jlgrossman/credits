<?
include_once '../utils.php';

exitIfNotLoggedIn();

$fromId = getUserID();
$toId = isset($_POST['to']) ? getID($_POST['to']) : 0;
$msg = substr(trim($_POST['msg']),0,280);

if($toId < 1 || $toId == $fromId || strlen($msg) < 1){
  exit($errorMessages['invalidData']);
}

$query = $connection->prepare('SELECT COUNT(id) FROM messages WHERE from_id = ? AND to_id = ? AND is_read = FALSE');
$query->bind_param('ii', $fromId, $toId);
$query->execute();
$query->bind_result($unreadMessages);
$success = $query->fetch();

if($success && $unreadMessages > 30){
  exit($errorMessages['limitReached']);
}

$query = $connection->prepare('INSERT INTO messages (from_id, to_id, msg, is_read) VALUES (?,?,?,FALSE)');
$query->bind_param('iis', $fromId, $toId, $msg);
$query->execute();

$query->close();
$connection->close();

echo '{"success":true,"msg":"Message sent"}';

?>
