<?
include_once '../../connection.php';

$numbers = array(mt_rand()%10, mt_rand()%10, mt_rand()%10);

$query = $connection->prepare('
  SELECT pot.value, user.name FROM tickets AS ticket
  INNER JOIN users AS user ON user.id = ticket.user_id
  INNER JOIN pots AS pot ON pot.name = "lottery"
  WHERE (
    ticket.number0 = ? AND
    ticket.number1 = ? AND
    ticket.number2 = ?
  )
');
$query->bind_param('iii', $numbers[0], $numbers[1], $numbers[2]);
$query->execute();
$query->bind_result($value, $userID);
$success = $query->fetch();
$query->close();

if($success){

  $query = $connection->prepare('UPDATE users SET credits = credits + ? WHERE id = ?');
  $query->bind_param('ii', $value, $userID);
  $query->execute();
  $query->close();

}

$connection->query('DELETE FROM tickets WHERE 1'); // delete all tickets
$connection->close();

?>
