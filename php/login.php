<?
include_once 'utils.php';

$name = trim($_POST['name']);
$pw = trim($_POST['pw']);

if(strlen($name) < $MIN_USERNAME_LENGTH || strlen($pw) < $MIN_PASSWORD_LENGTH){
  exit('{"success":false, "msg":"Invalid display name or username"}');
}

$query = $connection->prepare('SELECT id FROM users WHERE username = ? AND password = ?');
$query->bind_param('ss', $name, $pw);

$query->execute();
$query->bind_result($id);

if($query->fetch()){
  setUserName($name);
  setUserID($id);
  setUserTime(time());
  $result = json_encode(array('success'=>true, 'msg'=>'Logged in', 'data'=>array('name'=>$name, 'id'=>$id)));
} else {
  $result = '{"success":false, "msg":"Invalid login"}';
}

$query->close();
$connection->close();

echo $result;

?>
