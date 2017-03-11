<?
include_once 'user-session.php';

if(!isLoggedIn()){
  exit('{"success":false,"msg":"Not logged in"}');
}

function randomNumber(){
  return (mt_rand() / mt_getrandmax());
}

function makeColor($img){
  $angle1 = randomNumber() * 6.2822; // 2pi
  $angle2 = $angle1 + 1.0472; // pi/3
  $s1 = sin($angle1);
  $b = floor($s1 * sin($angle2) * 100) + 155;
  $g = floor($s1 * cos($angle2) * 100) + 155;
  $r = floor(cos($angle1) * 100) + 155;
  return imagecolorallocate($img, $r, $g, $b);
}

header ('Content-Type: image/png');
$img = imagecreatetruecolor(100,100);
$colors = [makeColor($img), makeColor($img), makeColor($img), makeColor($img)];
imagefilledrectangle($img, 0, 0, 50, 50, $colors[0]);
imagefilledrectangle($img, 0, 50, 50, 100, $colors[1]);
imagefilledrectangle($img, 50, 0, 100, 50, $colors[2]);
imagefilledrectangle($img, 50, 50, 100, 100, $colors[3]);

$save = '../resources/img'.getUserID().'.png';
imagepng($img, $save);
chmod($save, 0755);
?>
