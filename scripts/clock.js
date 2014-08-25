function drawClock(canvas,context){
     ///得到当前系统时间的：时、分、秒
      var now_date=new Date();
      var radius = Math.min(canvas.width/2,canvas.height/2),
           sec=now_date.getSeconds(),
           min=now_date.getMinutes(),
           hour=now_date.getHours();
           hour=hour>=12?hour-12:hour;
     
      //初始化画布
      context.save();
      context.clearRect(0,0,canvas.width,canvas.height);    
      context.translate(canvas.width/2,canvas.height/2);        
      context.scale(0.9,0.9);
	  
	  context.beginPath();
	    context.textAlign="center";
       context.textBaseline="middle";
	   for(var n=1;n<=12;n++)
       { 
	    context.fillStyle="white";
	   context.font="20px Arial";
        var theta=(n-3)*2*Math.PI/12;
        var x=radius*0.7*Math.cos(theta);
        var y=radius*0.7*Math.sin(theta);
		if(n%3==0)
		{
		  context.fillStyle="red";
		  context.font="25px Arial";
		}
        context.closePath();
        context.fillText(n,x,y);
        }   
      context.rotate(-Math.PI/2);
      context.save();

      //小时刻度
      context.strokeStyle="white";
      context.fillStyle="white";
      context.lineWidth=3;
      context.lineCap="round";
      context.beginPath();
      for(var i=0;i<12;i++){
        context.rotate(Math.PI/6);
        context.moveTo(radius-30,0);
        context.lineTo(radius-10,0);
      }
      context.stroke();
      context.restore();
      context.save();
     
      //分钟刻度
	  context.strokeStyle="white";
      context.lineWidth=2;
      context.beginPath();
      for(var i=0;i<60;i++){
        if(i%5!=0){
          context.moveTo(radius-18,0);
          context.lineTo(radius-10,0);
        }
        context.rotate(Math.PI/30);
      }
      context.stroke();
      context.restore();
      context.save();
     
      //画上时针
      context.rotate((Math.PI/6)*hour+(Math.PI/360)*min+(Math.PI/21600)*sec);
	  context.strokeStyle="green";
      context.lineWidth=6;
      context.lineCap="butt";
      context.beginPath();
      context.moveTo(-10,0);
      context.lineTo(radius*0.5	,0);
      context.stroke();
      context.restore();
      context.save();
     
      //分针
      context.rotate((Math.PI/30)*min+(Math.PI/1800)*sec);
      context.strokeStyle="#29A8DE";
      context.lineWidth=4;
      context.lineCap="butt";
      context.beginPath();
      context.moveTo(-20,0);
      context.lineTo(radius*0.6,0);
      context.stroke();
      context.restore();
      context.save();
     
      //秒针
      context.rotate(sec*Math.PI/30);
      context.strokeStyle="yellow";
      context.lineWidth=2;
      context.lineCap="butt";
      context.beginPath();
      context.moveTo(-30,0);
      context.lineTo(radius*0.7,0);
      context.stroke();
      context.restore();
      context.save();
     
      ///表框      
      context.lineWidth=4;
      context.strokeStyle="#882341";
      context.beginPath();
      context.arc(0,0,radius,0,Math.PI*2,true);
      context.stroke();
      context.restore();
      context.restore();
}
