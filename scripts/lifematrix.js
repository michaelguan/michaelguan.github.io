define(function() {
return {
"drawLifeMatrix":function(canvas,context){
    context.clearRect(0,0,canvas.width,canvas.height); 
	context.strokeStyle="#2288AC";
	context.fillStyle="red";
    context.lineWidth=0.8;
     var i,j;
     context.save();
    for(i=0;i<=canvas.width;i+=20)
	{
	   if(i==canvas.width/2)
	   {
	      context.strokeStyle="white";	
	   }
	   context.beginPath();
	   context.moveTo(i,0);
	   context.lineTo(i,canvas.height);
	   context.stroke();
	   context.restore();
	}
	
	context.strokeStyle="#C7B422";
	context.save();
	for(i=0;i<=canvas.height;i+=20)
	{
           if(i==canvas.height/2)
	   {
	      context.strokeStyle="white";	
	   }
	   context.beginPath();
	   context.moveTo(0,i);
	   context.lineTo(canvas.width,i);
	   context.stroke();
	    context.restore();
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
};
});
