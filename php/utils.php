<?
include_once 'user-session.php';
include_once 'connection.php';

$MIN_USERNAME_LENGTH = 3;
$MIN_PASSWORD_LENGTH = 6;
$MAX_SHARES = 30;

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

// deposit credits into user id account from bank
function giveCredits($id, $amount){
  global $connection;
  $id = intval($id);
  $amount = intval($amount);
  $query = $connection->prepare('UPDATE users SET credits = credits + ? WHERE id = ?');
  $query->bind_param('ii', $amount, $id);
  $success = $query->execute();
  $query->close();
  return $success;
}

// gets user id from username
function getId($name){
  global $connection;
  if(is_null($name)) return 0;

  $query = $connection->prepare('SELECT id FROM users WHERE username = ?');
  $query->bind_param('s', $name);
  $query->execute();
  $query->bind_result($id);
  if($query->fetch()) return $id;
  else return -1;
}

// gets src of user ImagickPixel
function getUserImage($id){
  if($id < 1) $id = 1;
  return "resources/img$id.png";
}

// exits if not logged in
function exitIfNotLoggedIn(){
  global $connection;
  if(!isLoggedIn()) {
    $connection->close();
    exit('{"success":false,"msg":"Not logged in"}');
  }
}

$errorMessages = array(
  'insufficentFunds' => '{"success":false,"msg":"Insufficient funds"}',
  'invalidData' => '{"success":false,"msg":"Invalid data"}'
)
?>
