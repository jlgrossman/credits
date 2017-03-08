/// <reference path="../utils.ts"/>

ready(function() {

  var scoreTotal = 0;
  const $score = $('.accuracy-game .score span');

  var missClicks = 0;
  var misses = 0;

  var creationTime = 750;
  var targetDuration = 700;
  var targetCount = 0;

  function addTarget(posX, posY) {
    const $target = $('<div>').addClass('target').css('left', posX + '%').css('top', posY + '%');
    $('.accuracy-game .game-board').append($target);

    return $target;
  }

  function newCoordinate() {
    return Math.random() * 90 + 5;
  }

  function targetClick() {
    $(this).remove();
    scoreTotal += 10;
    $score.html(scoreTotal);
    console.log(scoreTotal);
  }

  function missedTarget() {
    $(this).remove();
    misses++;
    if (misses > 2) {
      const $targets = $('.target');
      $targets.each(function() {
        $(this).remove();
      });
    }
  }

  function winLose() {
  }

  function initAccuracy() {
      var targetTimeout = setTimeout(function () {

        targetCount++;

        const newX = newCoordinate();
        const newY = newCoordinate();
        addTarget(newX, newY).delay(10, function (){$(this).addClass('fade')}).on('click', targetClick).delay(7000, missedTarget);

        if (targetCount > 10) {
          creationTime -= 25;
          targetCount = 0;
        }
        initAccuracy();
      }, creationTime);
  }



  initAccuracy();
});
