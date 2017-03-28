/// <reference path="../../utils.ts"/>

ready(function() {
  var canvas = ($('#accuracy-board')[0] as HTMLCanvasElement).getContext('2d');


  const canvasWidth = 640;
  const canvasHeight = 400;
  const targetRadius = 20;

  function randomPos(max_x, max_y) {
    return {
      x: Math.random() * (max_x - 2 * targetRadius) + targetRadius,
      y: Math.random() * (max_y - 2 * targetRadius) + targetRadius,
      radius: targetRadius
    };
  }

  function drawTarget(circle){
		canvas.beginPath();
		canvas.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
		canvas.fillStyle = 'black';
		canvas.fill();
	}

  var newTarget = window.setInterval(function() {
    var target = randomPos(canvasWidth, canvasHeight);

    function loop(){
  		canvas.clearRect(0, 0, canvasWidth, canvasHeight);
  		target.radius -= 0.1;
  		if(target.radius < 0) target.radius = 0;
  		else drawTarget(target);
  		requestAnimationFrame(loop);
  	}

  	loop();
  }, 500);
});
