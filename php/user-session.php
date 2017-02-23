<?php
session_start();
$user = array(
  'name' => $_SESSION['user'],
  'id' => intval($_SESSION['id'])
);
 ?>
