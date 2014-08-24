function drawClock(canvas,ctx){ 
 var date=new Date();
 var clockRadius=Math.min(canvas.width/2,canvas.height/2);
 var hours=date.getHours();
 var minutes=date.getMinutes();
 var seconds=date.getSeconds();
 hours=hours>12?hours-12:hours;
 var hour=hours+minutes/60;
 var minute=minutes+seconds/60;
 
 ctx.save();
 ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
 ctx.translate(canvas.width/2,canvas.height/2);
 ctx.scale(0.9,0.9);
 ctx.beginPath();
 ctx.font="36px Arial";
 ctx.fillStyle="#000";
 ctx.textAlign="center";
 ctx.textBaseline="middle";
 for(var n=1;n<=12;n++)
 { 
 var theta=(n-3)*2*Math.PI/12;
  var x=clockRadius*0.7*Math.cos(theta);
  var y=clockRadius*0.7*Math.sin(theta);
  ctx.closePath();
  ctx.fillText(n,x,y);
  }   
  ctx.save();
 var theta=(hour-3)*2*Math.PI/12;
 ctx.rotate(theta);
 ctx.beginPath();
 ctx.moveTo(-15,-5);
 ctx.lineTo(-15,5);
 ctx.lineTo(clockRadius*0.5,1);
 ctx.lineTo(clockRadius*0.5,-1);
 ctx.closePath();
 ctx.fill();
 ctx.restore();
  ctx.save();
 var theta=(minute-15)*2*Math.PI/60;
 ctx.rotate(theta);
 ctx.beginPath();
 ctx.moveTo(-15,-4);
 ctx.lineTo(-15,4);
 ctx.lineTo(clockRadius*0.7,1);
 ctx.lineTo(clockRadius*0.7,-1);
 ctx.closePath();
 ctx.fill();
 ctx.restore();
  ctx.save();
 var theta=(seconds-15)*2*Math.PI/60;
 ctx.rotate(theta);
 ctx.beginPath();
 ctx.moveTo(-15,-3);
 ctx.lineTo(-15,3);
 ctx.lineTo(clockRadius*0.9,1);
 ctx.lineTo(clockRadius*0.9,-1);
 ctx.fillStyle="#f00";
 ctx.closePath();
 ctx.fill();
 ctx.restore();
  ctx.restore();
}