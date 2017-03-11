<?
include_once 'utils.php';

$now = time();
$previous = getUserTime();

if(isLoggedIn() && $previous){
  $diff = $now - $previous;

  // if time difference is approx 10min
  if($diff >= 600 && getCredits(getUserID()) < 10 && giveCredits(getUserID(), 1)) {
    echo '{"success": true, "msg": "1 credit given"}';
  } else {
    echo '{"success": false, "msg": "0 credits given"}';
  }

}

$connection->close();

setUserTime($now);

?>
