<?
include_once '../connection.php';

$lat = '40.8257625';
$lon = '-96.6851982';
$key = 'd3c36d3019c446ea0dfa6bf2d808e9f4';
$url = "http://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&appid=$key";

$data = json_decode(file_get_contents($url), true);
$temp = $data['main']['temp'] - 273.15;
$temp = ($temp < 0 ? 0 : $temp) + 1;

$query = $connection->prepare('UPDATE stocks SET value = ? WHERE name = "WTHR"');
$query->bind_param('i', $temp);
$query->execute();

$query->close();
$connection->close();

?>
