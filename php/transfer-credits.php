<?php
include_once 'utils.php';

$fromId = isset($_POST['from']) ? intval($_POST['from']) : $user['id'];
$toId = isset($_POST['to']) ? intval($_POST['to']) : $user['id'];
$amount = intval($_POST['amount']);
$key = $_POST['key'];

if($key != getKey($fromId)){
  exit('{"success":false,"msg":"Invalid key"}');
} else if($fromId < 1 || $toId < 1 || $amount < 1){
  exit('{"success":false,"msg":"Invalid data"}');
} else if(getCredits($fromId) < $amount){
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

echo '{"success":true,"msg":"Credits transferred"}';
 ?>
