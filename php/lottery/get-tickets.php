<?
include_once '../utils.php';

exitIfNotLoggedIn();

$userID = getUserId();

$query = $connection->prepare('SELECT number0, number1, number2 FROM tickets WHERE user_id = ?');
$query->bind_param('i', $userID);
$query->execute();
$query->bind_result($number0, $number1, $number2);

$tickets = array();

while($query->fetch()){
  $tickets[] = array($number0, $number1, $number2);
}

$query->close();
$connection->close();

echo json_encode(array('success' => true, 'msg' => $tickets));

?>
