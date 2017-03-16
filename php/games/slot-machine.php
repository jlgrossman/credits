<?
include_once '../utils.php';

exitIfNotLoggedIn();

$userID = getUserID();
$bet = intval($_POST['bet']);

if(getCredits($userID) < $bet){
  $connection->close();
  exit('{"success":false,"msg":"Insufficient funds"}');
}

$rand = (mt_rand() / mt_getrandmax());

if ($rand < 0.4) {
  $earned = 0;
} else if ($rand < 0.6) {
  $earned = round($bet/2);
} else if ($rand < 0.8) {
  $earned = $bet;
} else if ($rand < 0.9) {
  $earned = round($bet * 1.5);
} else if ($rand < 0.95) {
  $earned = $bet * 2;
} else if ($rand < 0.975) {
  $earned = $bet * 3;
} else if ($rand < 0.99) {
  $earned = $bet * 5;
} else {
  $earned = $bet * 10;
}

$difference = intval($earned - $bet);

$query = $connection->prepare('UPDATE users SET credits = credits + ? WHERE id = ?');
$query->bind_param('ii', $difference, $userID);
$query->execute();

$query->close();
$connection->close();

echo json_encode(array('success'=>true, 'credits'=>$earned));

?>
