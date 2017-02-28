<?
include_once 'utils.php';

$postName = trim($_POST['name']);
$postPW = trim($_POST['pw']);

if(strlen($name) < $MIN_USERNAME_LENGTH || strlen($pw) < $MIN_PASSWORD_LENGTH){
  exit '{"success":false, "msg":"Invalid data"}'
}

$query = $connection->prepare('SELECT id FROM users WHERE username = ? AND password = ?');
$query->bind_param('ss', $name, $pw);

$name = $conn->real_escape_string($postName);
$pw = $conn->real_escape_string($postPW);

$query->execute();
$query->bind_result($id);

if($query->fetch()){
  $name = $_SESSION["user"] = $postName;
  $_SESSION['id'] = $id;
  $key = $_SESSION['key'] = getKey($id, $postName);
  $result = json_encode(array('success'=>true, 'msg'=>$name, 'key'=>$key));
} else {
  $result = '{"success":false, "msg":"Invalid login"}';
}

$query->close();
$connection->close();

echo $result;

?>
