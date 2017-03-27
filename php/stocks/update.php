<?
include_once '../connection.php';

exitIfNoKey();

$query = $connection->prepare('
  SELECT rand_stock.value, wthr_stock.value
  FROM stocks AS rand_stock
  INNER JOIN stocks AS wthr_stock
  ON 1
  WHERE rand_stock.name = "RAND" AND wthr_stock.name = "WTHR"
');
$query->execute();
$query->bind_result($previousRand, $previousTemp);
$success = $query->fetch();
$query->close();

if($success){

  include_once 'random.php';
  include_once 'weather.php';

}

$connection->close();

?>
