<?
include_once 'utils.php';

exitIfNotLoggedIn();

$output = isset($_POST['output']) ? $_POST['output'] : 'html';
$userID = getUserID();
$userCredits = getCredits($userID);

$query = $connection->prepare('
  SELECT stock.id, stock.name, stock.value, stock.description, count(share.id)
  FROM stocks AS stock
  LEFT JOIN shares AS share
  ON share.stock_id = stock.id AND share.user_id = ?
  GROUP BY stock.id
');
$query->bind_param('i', $userID);
$query->execute();
$query->bind_result($stockID, $name, $value, $description, $quantity);

$stocks = array();

while($query->fetch()){
  $stocks[] = array('id'=>$stockID, 'name'=>$name, 'value'=>$value, 'description'=>$description, 'quantity'=>$quantity);
}

if($output == 'json'){
  echo json_encode(array('success'=>true, 'stocks'=>$stocks));
} else {
  include 'components/stocks.php';
}

?>
