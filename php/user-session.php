<?php
session_start();
$isLoggedIn = isset($_SESSION['id']);
$user = array(
  'name' => ($isLoggedIn ? $_SESSION['user'] : 'none'),
  'id' => ($isLoggedIn ? intval($_SESSION['id']) : 0),
);
$isAdmin = ($user['name'] == 'Admin' || $user['name'] == 'Jarrod');
 ?>
