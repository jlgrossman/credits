<?
include_once '../connection.php';

$lat = '40.8257625';
$lon = '-96.6851982';
$key = 'd3c36d3019c446ea0dfa6bf2d808e9f4';
$url = "http://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&appid=$key";

$query = $connection->prepare('SELECT value FROM stocks WHERE name = "WTHR"');
$query->execute();
$query->bind_result($previous);
$success = $query->fetch();
$query->close();

$previous = intval($previous);

$data = json_decode(file_get_contents($url), true);
$temp = intval((($data['main']['temp'] - 273.15) * 1.8 + 32)/2);
$temp = ($temp < 0 ? 0 : $temp) + 1;

$diff = abs($temp - $previous);

if($success && $diff < 10){
  $query = $connection->prepare('UPDATE stocks SET value = ? WHERE name = "WTHR"');
  $query->bind_param('i', $temp);
  $query->execute();
  $query->close();
}

$connection->close();


?>
