<?
include_once '../../utils.php';

exitIfNotLoggedIn();

$userID = getUserID();
$bet = isset($_POST['bet']) ? intval($_POST['bet']) : 1;
if($bet < 1) $bet = 1;

if(getCredits($userID) < $bet){
  $connection->close();
  exit($errorMessages['insufficentFunds']);
}

$rand = (mt_rand() / mt_getrandmax());

if ($rand < 0.5) {
  $earned = 0;
  $state = 0;
} else if ($rand < 0.7) {
  $earned = round($bet/2);
  $state = 1;
} else if ($rand < 0.85) {
  $earned = $bet;
  $state = 2;
} else if ($rand < 0.9) {
  $earned = round($bet * 1.5);
  $state = 3;
} else if ($rand < 0.95) {
  $earned = $bet * 2;
  $state = 4;
} else if ($rand < 0.975) {
  $earned = $bet * 3;
  $state = 5;
} else if ($rand < 0.99) {
  $earned = $bet * 5;
  $state = 6;
} else {
  $earned = $bet * 10;
  $state = 7;
}

$difference = intval($earned - $bet);

$query = $connection->prepare('UPDATE users SET credits = credits + ? WHERE id = ?');
$query->bind_param('ii', $difference, $userID);
$query->execute();

$query->close();
$connection->close();

echo json_encode(array('success'=>true, 'msg'=>$state, 'credits'=>$earned));

?>
