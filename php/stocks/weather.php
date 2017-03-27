<?
include_once '../connection.php';

exitIfNoKey();

$lat = '40.8257625';
$lon = '-96.6851982';
$key = 'd3c36d3019c446ea0dfa6bf2d808e9f4';
$url = "http://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&appid=$key";

$previousTemp = intval($previousTemp);

$data = json_decode(file_get_contents($url), true);
$temp = intval((($data['main']['temp'] - 273.15) * 1.8 + 32)/2);
$temp = ($temp < 0 ? 0 : $temp) + 1;

$diff = abs($temp - $previousTemp);

// safeguard for webservice failure
if($diff < 10){
  $query = $connection->prepare('UPDATE stocks SET value = ? WHERE name = "WTHR"');
  $query->bind_param('i', $temp);
  $query->execute();
  $query->close();
}

?>
