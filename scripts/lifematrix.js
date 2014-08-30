function drawLifeMatrix(canvas,context)
{
    context.clearRect(0,0,canvas.width,canvas.height); 
	context.strokeStyle="white";
	context.fillStyle="red";
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
	
	context.fillRect(2,2,18,18);
	context.fillRect(2,22,18,18);
	
	var now_date=new Date();
	var year=now_date.getFullYear();
	var sec=now_date.getSeconds();
	var month=now_date.getMonth()+1;
	
	for(i=1;i<=(year-1986)*12+month;i++)
	{
	      if(i==(year-1986)*12+month)
		  {
				context.fillStyle=sec%2?"yellow":"green";
		  }
		  context.fillRect(20*parseInt(((i-1)/24))+2,20*((i-1)%24)+2,18,18);
	}
}