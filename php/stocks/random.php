<?
$previousRand = intval($previousRand);

$rand = intval(((mt_rand() / mt_getrandmax()) * 30 + $previousRand)/2);

$query = $connection->prepare('UPDATE stocks SET value = ? WHERE name = "RAND"');
$query->bind_param('i', $rand);
$query->execute();
$query->close();

?>
