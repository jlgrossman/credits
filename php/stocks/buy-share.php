<?
include_once '../utils.php';

exitIfNotLoggedIn();

$stockID = $_POST['stock'];
$userID = getUserID();

if($stockID < 1) {
  $connection->close();
  exit($errorMessages['invalidData']);
}

$query = $connection->prepare('
  SELECT stock.value, COUNT(share.id) FROM stocks AS stock
  INNER JOIN users AS user ON
  stock.value <= user.credits
  INNER JOIN shares AS share ON
  share.stock_id = stock.id AND share.user_id = user.id
  WHERE stock.id = ? AND user.id = ?
');
$query->bind_param('ii', $stockID, $userID);
$query->execute();
$query->bind_result($price, $count);
$success = $query->fetch();
$query->close();

if(!$success || is_null($price)) {
  $connection->close();
  exit($errorMessages['insufficentFunds']);
} else if($count >= $MAX_SHARES) {
  $connection->close();
  exit('{"success":false,"msg":"Share limit reached"}');
}

$query = $connection->prepare('INSERT INTO shares (stock_id, user_id) VALUES (?,?)');
$query->bind_param('ii', $stockID, $userID);
$query->execute();
$query->close();

$query = $connection->prepare('UPDATE users SET credits = credits - ? WHERE id = ?');
$query->bind_param('ii', $price, $userID);
$query->execute();
$query->close();

$connection->close();

echo '{"success":true,"msg":"Share purchased"}';

?>
