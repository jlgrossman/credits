<?
include_once 'user-session.php';

exitIfNotLoggedIn();

function makeColor($img){
  $angle1 = (mt_rand() / mt_getrandmax()) * 6.2822; // 2pi
  $angle2 = $angle1 + 1.0472; // pi/3
  $s1 = sin($angle1);
  $b = floor($s1 * sin($angle2) * 100) + 155;
  $g = floor($s1 * cos($angle2) * 100) + 155;
  $r = floor(cos($angle1) * 100) + 155;
  return imagecolorallocate($img, $r, $g, $b);
}

header ('Content-Type: image/png');
$img = imagecreatetruecolor(100,100);
imagefilledrectangle($img, 0, 0, 50, 50, makeColor($img));
imagefilledrectangle($img, 0, 50, 50, 100, makeColor($img));
imagefilledrectangle($img, 50, 0, 100, 50, makeColor($img));
imagefilledrectangle($img, 50, 50, 100, 100, makeColor($img));

$save = '../resources/img'.getUserID().'.png';
imagepng($img, $save);
chmod($save, 0755);
?>
