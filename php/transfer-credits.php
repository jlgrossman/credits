<?
include_once 'utils.php';

if(!isLoggedIn()) {
  $connection->close();
  exit('{"success":false,"msg":"Not logged in"}');
}

$fromId = getUserID();
$toId = isset($_POST['to']) ? (is_numeric($_POST['to']) ? intval($_POST['to']) : getId($_POST['to'])) : 0;
$amount = intval($_POST['amount']);
$msg = substr($_POST['msg'],0,140);

if($fromId < 1 || $toId < 1 || $amount < 1 || $toId == $fromId){
  $connection->close();
  exit('{"success":false,"msg":"Invalid data"}');
} else if(getCredits($fromId) < $amount){
  $connection->close();
  exit('{"success":false,"msg":"Insufficient funds"}');
}

$query = $connection->prepare('
  UPDATE users SET credits =
  (CASE
      WHEN id = ? THEN credits + ?
      WHEN id = ? THEN credits - ?
      ELSE credits
    END)
');
$query->bind_param('iiii', $toId, $amount, $fromId, $amount);
$query->execute();
$query->close();

$query = $connection->prepare('INSERT INTO transactions (from_id, to_id, amount, message) VALUES (?,?,?,?)');
$query->bind_param('iiis', $fromId, $toId, $amount, $msg);
$query->execute();
$query->close();
$connection->close();

echo '{"success":true,"msg":"Credits transferred"}';
?>
