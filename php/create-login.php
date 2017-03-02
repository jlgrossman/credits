<?
include_once 'utils.php';

$postName = trim($_POST['name']);
$postPW = trim($_POST['pw']);

if(strlen($name) < $MIN_USERNAME_LENGTH) exit '{"success":false, "msg":"Display name is too short"}';
if(strlen($pw) < $MIN_PASSWORD_LENGTH) exit '{"success":false, "msg":"Username is too short"}';

$query = $connection->prepare('SELECT id FROM users WHERE username = ? OR password = ?');

$query->bind_param("ss", $name, $pw);

$name = $conn->real_escape_string($postName);
$pw = $conn->real_escape_string($postPW);

$query->execute();
$query->bind_result($id);

if($query->fetch()){
  $query->close();
  exit '{"success":false, "msg":"Login already exists"}';
}

$query->close();

$query = $connection->prepare('INSERT INTO users (username, password, credits) VALUES (?, ?, 10)');
$query->bind_param('ss', $name, $pw);
$query->execute();

$id = $connection->insert_id;

$query->close();
$connection->close();

$_SESSION["user"] = $postName;
$_SESSION['id'] = $id;

include_once 'create-image.php';

echo json_encode(array('success'=>true, 'msg'=>'Account created', 'data'=>array('name'=>$postName, 'id'=>$id)));
?>
