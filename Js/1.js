//javascript 文件
    var img=new Image();
	img.src="image/mytest1.jpg";
    ready(function(){
	   var mycanvas=createCanvas(600,500);
	   document.body.appendChild(mycanvas.canvas);
	   mycanvas.x=0;
	   mycanvas.y=0;
	   mycanvas.xx=2;
	   mycanvas.yy=1;
	   var imgwidth=150;
	   var imgheight=150;
	   mycanvas.max=mycanvas.width-imgwidth;
	   mycanvas.may=mycanvas.height-imgheight;
	   mycanvas.draw=function(){
	        var context=this.context;
			context.clearRect(this.x,this.y,imgwidth,imgheight);
			this.x+=this.xx;
			this.y+=this.yy;
			context.drawImage(img,this.x,this.y);
			if(this.x>this.max){
			    this.xx=-2;
			}else if(this.x<0){
			   this.xx=2;
			}
			if(this.y>this.may){
			   this.yy=-1;
			}else if(this.y<0){
			   this.yy=1;
			}
			context.clearRect(10,10,60,20);
			context.fillStyle="red";
			context.font="bold 15px 宋体";
			context.textAlign="left";
			context.textBaseline="top";
			context.fillText(this.x+":"+this.y,10,10);
	   }
	   mycanvas.FPS=40;
	   mycanvas.start();
	});