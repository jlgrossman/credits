<?php
include_once 'user-session.php';
include_once 'connection.php';

$fromId = isset($_POST['from']) ? intval($_POST['from']) : $user['id'];
$toId = isset($_POST['to']) ? intval($_POST['to']) : $user['id'];
$amount = intval($_POST['amount']);

if($fromId < 1 || $toId < 1 || $amount < 1){
  exit('{"success":false,"msg":"Invalid data"}');
}

$query = $connection->prepare('SELECT id FROM users WHERE id = ? AND credits < ?');
$query->bind_params('ii', $from, $amount);
$query->execute();

if($query->fetch()){
  exit('{"success":false,"msg":"Insufficient funds"}');
}

$query->close();

$query = $connection->prepare('UPDATE users SET credits = credits + ? WHERE id = ?');
$query->bind_params('ii', $amount, $to);
$query->execute();
$query->close();

$query = $connection->prepare('UPDATE users SET credits = credits - ? WHERE id = ?');
$query->bind_params('ii', $amount, $from);
$query->execute();
$query->close();

echo '{"success":true,"msg":"Credits transferred"}';

 ?>
