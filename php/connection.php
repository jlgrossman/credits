<?
$connection = new mysqli('host', 'username', 'pw', 'db');
function exitIfNoKey(){
  if(!(isset($_GET['key']) && $_GET['key'] == 'example')){
    die('{"success": false, "msg": "Invalid key"}');
  }
}

if($connection->connect_error){
    die(json_encode(array('success' => false, 'msg' => $connection->connect_error)));
}
?>
