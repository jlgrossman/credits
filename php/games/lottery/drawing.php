<?
include_once '../../connection.php';

$numbers = array(mt_rand()%10, mt_rand()%10, mt_rand()%10);

$query_select = $connection->prepare('
  SELECT pot.value, user.username, COUNT(user.id) FROM tickets AS ticket
  INNER JOIN users AS user ON user.id = ticket.user_id
  INNER JOIN pots AS pot ON pot.name = "lottery"
  WHERE (
    ticket.number0 = ? AND
    ticket.number1 = ? AND
    ticket.number2 = ?
  )
');
$query_select->bind_param('iii', $numbers[0], $numbers[1], $numbers[2]);
$query_select->execute();
$query_select->bind_result($value, $userID, $numberOfWinners);

$query_update = $connection->prepare('
  UPDATE pots, users
  SET
  pots.value = 0,
  users.credits = users.credits + ?
  WHERE
  pots.name = "lottery" AND users.id = ?
');
$query_update->bind_param('ii', $value, $userID);

while($query_select->fetch()){
  $value = $value / $numberOfWinners;
  $query_update->execute();
}

$query_select->close();
$query_update->close();

$connection->query('UPDATE pots SET pots.value = pots.value + 100 WHERE pots.name="lottery"');
$connection->query('DELETE FROM tickets WHERE 1'); // delete all tickets
$connection->close();

?>
