require.config({
paths: {
"jquery":"jquery",
"lifematrix":"lifematrix"
}
});

require(['jquery','lifematrix'],function($,lifematrix) {
$(document).ready(function() {
	var canvas1 = document.getElementById("lifeCanvas");
    var context1 = canvas1.getContext("2d");
    setInterval(function(){lifematrix.drawLifeMatrix(canvas1,context1)},1000);
	});
});