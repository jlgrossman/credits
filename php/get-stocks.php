<?
include_once 'connection.php';

$output = isset($_POST['output']) ? $_POST['output'] : 'html';

$query = $connection->prepare('SELECT id, name, value, description FROM stocks');
$query->execute();
$query->bind_result($id, $name, $value, $description);

$stocks = array();

while($query->fetch()){
  $stocks[] = array('id'=>$id, 'name'=>$name, 'value'=>$value, 'description'=>$description);
}

if($output == 'json'){
  echo json_encode(array('success'=>true, 'shares'=>$shares));
} else {
  include 'components/stocks.php';
}

?>
