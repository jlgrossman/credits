<?
session_start();
unset($_SESSION["user"]);
unset($_SESSION["id"]);
echo '{"success":true,"msg":"Logged out"}';
?>
