<?
include_once '../utils.php';

exitIfNotLoggedIn();

$stockID = intval($_POST['stock']);
$userID = getUserID();

if($stockID < 1) {
  $connection->close();
  exit($errorMessages['invalidData']);
}

$query = $connection->prepare('
  SELECT stock.value FROM stocks as stock
  INNER JOIN shares as share
  ON stock.id = share.stock_id
  INNER JOIN users as user
  ON share.user_id = user.id
  WHERE stock.id = ?
');
$query->bind_param('i', $stockID);
$query->execute();
$query->bind_result($value);
$success = $query->fetch();
$query->close();

if(!$success) {
  $connection->close();
  exit('{"success":false,"msg":"No shares exist"}');
}

$query = $connection->prepare('UPDATE users SET credits = credits + ? WHERE id = ?');
$query->bind_param('ii', $value, $userID);
$query->execute();
$query->close();

$query = $connection->prepare('
  DELETE FROM shares
  WHERE stock_id = ? AND user_id = ?
  LIMIT 1
');
$query->bind_param('ii', $stockID, $userID);
$query->execute();
$query->close();
$connection->close();

echo '{"success":true,"msg":"Share sold"}';

?>
