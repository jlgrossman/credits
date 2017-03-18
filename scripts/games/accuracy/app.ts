/// <reference path="../../utils.ts"/>

ready(function() {

  var scoreTotal:number = 0;
  const $score:$ = $('.accuracy-game .score span');
  const $gameBoard:$ = $('.accuracy-game .game-board');

  var misses:number = 0;

  var creationTime:number = 750;
  var targetDuration:number = 700;
  var targetCount:number = 0;
  var targetTimeout;

  function addTarget(posX:number, posY:number) {
    const $target:$ = $('<div>').addClass('target').css('left', posX + '%').css('top', posY + '%');
    $gameBoard.append($target);
    return $target;
  }

  function newCoordinate() {
    return Math.random() * 90 + 5;
  }

  function targetClick() {
    $(this).remove();
    scoreTotal += 10;
    $score.text(scoreTotal);
    console.log(scoreTotal);
  }

  function missedTarget() {
    const $this:$ = $(this);
    $(this).remove();
    if (++misses > 2) {
      $('.target').remove();
    }
  }

  function winLose() {
  }

  function initAccuracy() {
      targetTimeout = setTimeout(function () {

        const newX:number = newCoordinate();
        const newY:number = newCoordinate();
        addTarget(newX, newY).delay(10, function (){$(this).addClass('fade')}).on('click', targetClick).delay(7000, missedTarget);

        if (++targetCount > 10) {
          creationTime -= 25;
          targetCount = 0;
        }

        initAccuracy();

      }, creationTime);
  }

  initAccuracy();
});
