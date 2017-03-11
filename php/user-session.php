<?
session_start();
function isLoggedIn(){
  return isset($_SESSION['id']);
}
function isAdmin(){
  return ($_SESSION['user'] == 'Admin' || $_SESSION['user'] == 'Jarrod' || $_SESSION['user'] == 'Josh');
}
function getUserName(){
  return isLoggedIn() ? $_SESSION['user'] : 'none';
}
function setUserName($value){
  $_SESSION['user'] = $value;
}
function getUserID(){
  return isLoggedIn() ? intval($_SESSION['id']) : 0;
}
function setUserID($value){
  $_SESSION['id'] = $value;
}
function getUserTime(){
  return isset($_SESSION['time']) ? intval($_SESSION['time']) : 0;
}
function setUserTime($value){
  $_SESSION['time'] = $value;
}
?>
