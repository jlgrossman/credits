<?
session_start();
unset($_SESSION['user']);
unset($_SESSION['id']);
unset($_SESSION['time']);
echo '{"success":true,"msg":"Logged out"}';
?>
