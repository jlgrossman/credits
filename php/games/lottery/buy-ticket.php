<?
include_once '../../utils.php';

exitIfNotLoggedIn();

$TICKET_PRICE = 50;
$MAX_TICKETS = 100;

$userID = getUserId();
$numbers = isset($_POST['numbers']) ? $_POST['numbers'] : '';
$numbers = explode(',', $numbers);

for($i = 0; $i < 3; $i++) $numbers[$i] = intval($numbers[$i]);

if(sizeof($numbers) != 3){
  $connection->close();
  exit($errorMessages['invalidData']);
} else if(getCredits($userID) < $TICKET_PRICE){
  $connection->close();
  exit($errorMessages['insufficentFunds']);
}

$query = $connection->prepare('SELECT COUNT(id) FROM tickets WHERE user_id = ?');
$query->bind_param('i', $userID);
$query->execute();
$query->bind_result($count);
$query->fetch();
$query->close();

if($count >= $MAX_TICKETS){
  $connection->close();
  exit('{"success":false,"msg":"Ticket limit reached"}');
}

$query = $connection->prepare('INSERT INTO tickets (user_id, number0, number1, number2) VALUES (?,?,?,?)');
$query->bind_param('iiii', $userID, $numbers[0], $numbers[1], $numbers[2]);
$query->execute();
$query->close();

$query = $connection->prepare('
  UPDATE pots, users
  SET
  pots.value = pots.value + ?,
  users.credits = users.credits - ?
  WHERE
  pots.name = "lottery" AND users.id = ?
');
$query->bind_param('iii', $TICKET_PRICE, $TICKET_PRICE, $userID);
$query->execute();
$query->close();

$connection->close();

echo '{"success":true,"msg":"Ticket purchased"}';

?>
