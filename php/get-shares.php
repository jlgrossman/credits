<?
include_once 'utils.php';

exitIfNotLoggedIn();

$id = getUserID();
$output = isset($_POST['output']) ? $_POST['output'] : 'html';

$query = $connection->prepare('
  SELECT stock.id, stock.name, stock.description, stock.value, COUNT(stock.id) FROM shares AS share
  INNER JOIN stocks AS stock ON stock.id = share.stock_id
  WHERE user_id = ? GROUP BY stock.id;
');
$query->bind_param('i', $id);
$query->execute();
$query->bind_result($stockID, $stockName, $stockDescription, $stockValue, $quantity);

$shares = array();

while($query->fetch()){
  $shares[] = array('id'=>$stockID, 'name'=>$stockName, 'description'=>$stockDescription, 'value'=>$stockValue, 'quantity'=>$quantity);
}

$query->close();
$connection->close();

if($output == 'json'){
  echo json_encode(array('success'=>true, 'shares'=>$shares));
} else {
  include 'components/shares.php';
}


?>
