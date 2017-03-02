<?
include_once 'user-session.php';

if(!$isLoggedIn){
  exit('{"success":false,"msg":"Not logged in"}');
}

function randomNumber(){
  return (mt_rand() / mt_getrandmax());
}

function makeColor($img){
  $angle1 = randomNumber() * 6.2822;
  $angle2 = randomNumber() * 6.2822;
  $s1 = sin($angle1);
  $r = floor($s1 * sin($angle2) * 100) + 125;
  $g = floor($s1 * cos($angle2) * 100) + 125;
  $b = floor(cos($angle1) * 100) + 125;
  return imagecolorallocate($img, $r, $g, $b);
}

header ('Content-Type: image/png');
$img = imagecreatetruecolor(100,100);
$colors = [makeColor($img), makeColor($img), makeColor($img), makeColor($img)];
imagefilledrectangle($img, 0, 0, 50, 50, $colors[0]);
imagefilledrectangle($img, 0, 50, 50, 100, $colors[1]);
imagefilledrectangle($img, 50, 0, 100, 50, $colors[2]);
imagefilledrectangle($img, 50, 50, 100, 100, $colors[3]);

$save = "imgs/img{$_SESSION['id']}.png";
imagepng($img, $save);
chmod($save, 0755);
?>
