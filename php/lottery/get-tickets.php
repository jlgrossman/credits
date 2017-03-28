<?
include_once '../utils.php';

exitIfNotLoggedIn();

$output = isset($_POST['output']) ? $_POST['output'] : 'html';
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

if($output == 'json'){
  echo json_encode(array('success' => true, 'tickets' => $tickets));
} else {
  include '../components/tickets.php';
}

?>
