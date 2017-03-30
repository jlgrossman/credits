<?
include_once '../utils.php';

exitIfNotLoggedIn();

$fromId = getUserID();
$toId = isset($_POST['to']) ? getId($_POST['to']) : 0;
$msg = substr(trim($_POST['msg']),0,280);

if($fromId < 1 || $toId < 1 || $toId == $fromId || strlen($msg) < 1){
  $connection->close();
  exit($errorMessages['invalidData']);
}

$query = $connection->prepare('INSERT INTO messages (from_id, to_id, msg, was_read) VALUES (?, ?, ?, FALSE)');
$query->bind_param('iis', $fromId, $toId, $msg);
$query->execute();
$query->close();
$connection->close();

echo '{"success":true,"msg":"Message sent"}';

?>
