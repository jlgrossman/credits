<?
include_once 'user-session.php';
include_once 'connection.php';

$MIN_USERNAME_LENGTH = 3;
$MIN_PASSWORD_LENGTH = 6;

// gets number of credits for a user with a specific id
function getCredits($id){
  global $connection;
  $id = intval($id);
  $query = $connection->prepare('SELECT credits FROM users WHERE id = ?');
  $query->bind_param('i', $id);
  $query->execute();
  $query->bind_result($credits);
  $success = $query->fetch();
  $query->close();
  return ($success ? $credits : -1);
}

// gets user id from username
function getId($name){
  global $connection;
  if(is_null($name)) return 0;

  $query = $connection->prepare('SELECT id FROM users WHERE username = ?');
  $query->bind_param('s', $name);
  $name = $connection->real_escape_string($name);
  $query->execute();
  $query->bind_result($id);
  if($query->fetch()) return $id;
  else return -1;
}

?>
