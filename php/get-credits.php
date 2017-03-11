<?
include_once 'utils.php';

// use session id if no post id is given
$credits = getCredits(getUserID());

if($credits >= 0){
  $result = array('success' => true, 'msg' => $credits);
} else {
  $result = array('success' => false, 'msg' => 0);
}

$connection->close();

echo json_encode($result);
?>
