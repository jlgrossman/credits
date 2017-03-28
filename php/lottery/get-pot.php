<?
include_once '../connection.php';

if($result = $connection->query('SELECT value FROM pots WHERE name = "lottery"')){
  $val = $result->fetch_array()[0];
  echo json_encode(array('success' => true, 'msg' => $val));
} else {
  echo '{"success":false, "msg":"Error"}';
}

$connection->close();

?>
