<?
include_once 'utils.php';

exitIfNotLoggedIn();

$stockID = $_POST['stock'];
$userID = getUserID();

if($stockID < 1) {
  $connection->close();
  exit('{"success":false,"msg":"Invalid data"}');
}

$query = $connection->prepare('
  SELECT stock.value FROM stocks AS stock
  INNER JOIN users AS user ON
  stock.value <= user.credits
  WHERE stock.id = ? AND user.id = ?
');
$query->bind_param('ii', $stockID, $userID);
$query->execute();
$query->bind_result($price);
$success = $query->fetch();
$query->close();

if(!$success) {
  $connection->close();
  exit('{"success":false,"msg":"Insufficient funds"}');
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
