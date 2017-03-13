<?
$previousRand = intval($previousRand);

$rand = (mt_rand() / mt_getrandmax()) - 0.5;
$scale = (mt_rand() / mt_getrandmax()) > 0.95 ? 10 : 3.5;
$rand = $previousRand + intval(round($rand * $scale)); // usually move by 0 or 1, sometimes 2

if($rand < 1) $rand = 1;
else if($rand > 15) $rand = 15;

$query = $connection->prepare('UPDATE stocks SET value = ? WHERE name = "RAND"');
$query->bind_param('i', $rand);
$query->execute();
$query->close();

?>
