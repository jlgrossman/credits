<?
include_once 'utils.php';

$now = time();

if($isLoggedIn && isset($_SESSION['time'])){
  $previous = intval($_SESSION['time']);
  $diff = $now - $previous;

  // if time difference is approx 10min
  if($diff >= 600 && getCredits($user['id']) < 10 && giveCredits($user['id'], 1)) {
    echo '{"success": true, "msg": "1 credit given"}';
  } else {
    echo '{"success": false, "msg": "0 credits given"}';
  }

}

$connection->close();

$_SESSION['time'] = $now;

?>
