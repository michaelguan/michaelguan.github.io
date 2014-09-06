require.config({
paths: {
"jquery":"jquery",
"clock":"clock",
"lifematrix":"lifematrix",
"math":"math.min"
}
});

require(['jquery','clock','lifematrix','math'],function($,clock,lifematrix,math) {
$(document).ready(function() {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");    
    setInterval(function(){clock.drawClock(canvas,context)},1000);
	var canvas1 = document.getElementById("lifeCanvas");
    var context1 = canvas1.getContext("2d");
    setInterval(function(){lifematrix.drawLifeMatrix(canvas1,context1)},1000);
	canvas.addEventListener('mousemove',function (e) {
	   $("#x").val(e.clientX-canvas.getBoundingClientRect().left*(canvas.width/canvas.getBoundingClientRect().width));
	   $("#y").val(e.clientY-canvas.getBoundingClientRect().top*(canvas.width/canvas.getBoundingClientRect().height));
	});
	});
});