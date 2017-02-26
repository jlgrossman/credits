<?
include_once 'user-session.php';
include_once 'connection.php';

// gets number of credits for a user with a specific id
function getCredits($id){
  global $connection;
  $id = intval($id);
  $query = $connection->prepare('SELECT credits FROM users WHERE id = ?');
  $query->bind_param('i', $id);
  $query->execute();
  $query->bind_result($credits);
  $success = $query->fetch();
  $query->close();
  return ($success ? $credits : -1);
}

// gets user key for validation
function getKey($id, $name = NULL){
    global $connection;
    if(is_null($name)){
      $id = intval($id);
      $query = $connection->prepare('SELECT username FROM users WHERE id = ?');
      $query->bind_param('i', $id);
      $query->execute();
      $query->bind_result($name);
      if(!$query->fetch()) return -1;
      $query->close();
    }

    $result = '';
    $name = strtoupper($name);
    for($i = 0; $i < strlen($name); $i++){
        $val = ord(substr($name,$i,1)) + $id * ($i+1);
        while($val > 90){
            $val = 65 + ($val - 90);
        }
        $result .= dechex($val);
    }
    return $result;
}

 ?>
