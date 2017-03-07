/// <reference path="../utils.ts"/>

ready(function() {

  var scoreTotal = 0;
  const $score = $('.accuracy-game .score span');

  var newTargetTime = 1000;
  var targetDuration = 750;
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

  function initAccuracy() {
    var newTargets = setInterval(function(){
      targetCount++;

      const newX = newCoordinate();
      const newY = newCoordinate();
      addTarget(newX, newY).delay(10, function (){$(this).addClass('fade')}).on('click', targetClick);

      if (targetCount > 5) {
        newTargetTime -= 25;
        targetCount = 0;
      }
    }, newTargetTime);
  }

  initAccuracy();
});
