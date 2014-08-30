function drawLifeMatrix(canvas,context)
{
	context.strokeStyle="red";
    context.lineWidth=0.8;
     var i,j;
    for(i=0;i<=canvas.width;i+=20)
	{
	   context.beginPath();
	   context.moveTo(i,0);
	   context.lineTo(i,canvas.height);
	   context.stroke();
	}
	
	for(i=0;i<=canvas.height;i+=20)
	{
	   context.beginPath();
	   context.moveTo(0,i);
	   context.lineTo(canvas.width,i);
	   context.stroke();		
	}
}