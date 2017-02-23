<?php
session_start();
$user = array(
  'name' => $_SESSION['user'],
  'id' => $_SESSION['id']
);

 ?>
