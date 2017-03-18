<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<?
include_once '../../utils.php';
include_once '../engine.php';

getFiles('slot-machine');
?>
<section class="slot-machine-game game">
  <h1>Slot Machine</h1>
  <div class="credit-count"><?=getCredits(getUserID());?></div>
  <div class="slots">
    <div class="slot slot-0"><div class="row row-0"></div><div class="row row-1"></div><div class="row row-2"></div></div>
    <div class="slot slot-1"><div class="row row-0"></div><div class="row row-1"></div><div class="row row-2"></div></div>
    <div class="slot slot-2"><div class="row row-0"></div><div class="row row-1"></div><div class="row row-2"></div></div>
    <div class="slot slot-3"><div class="row row-0"></div><div class="row row-1"></div><div class="row row-2"></div></div>
  </div>
  <input class="bet" placeholder="Bet" type="text" />
  <button class="spin-btn">Spin</button>
</section>
