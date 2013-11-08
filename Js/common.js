var fps=10;//刷新频率
var columncount=20;//列数
var rowcount=20;//高度
var size=30//大小
ready(function(){
	var theplan=getPlan(columncount,rowcount);
	print.canvas=document.getElementById("mycan");
	print.canvas.width=columncount*size;
	print.canvas.height=rowcount*size;
	var style="position:absolute;left:50%;top:50%;border:1px solid red;"
	style+="width:{0}px;height:{1}px;margin-left:-{2}px;margin-top:-{3}px;";
	style=String.format(style,print.canvas.width,print.canvas.height,parseInt(print.canvas.width/2),parseInt(print.canvas.height/2));
	print.canvas.style.cssText=style;
	print.context=print.canvas.getContext("2d");
	var printplan=theplan.join("\n");
	print(printplan);
	//var terr=new Terrarium(theplan);
	var terr=new LifeLikeTerrarium(theplan);
    setInterval(function(){terr.step()},1000/fps);
});
function print(){
   var result=[];
   forEach(arguments,function(index,value){
       result.push(value);
   });
   result=result.join("");
   var context=print.context;
   var width=print.canvas.width;
   var height=print.canvas.height;
   context.clearRect(0,0,width,height);
   var x=0;
   var y=0;
   for(var i=0;i<result.length;i++)
   {
      var c=result.charAt(i);
	  switch(c){
		case "\n"://换行
		    y+=size;
			x=0;
			break;
		case " "://空
		    context.fillStyle="#fff";
	        context.fillRect(x,y,size,size);
			x+=size;
			break;
	    case "#"://墙
		    context.fillStyle="#000";
	        context.fillRect(x,y,size,size);
		    x+=size;
			break;
		default:
			context.x=x;
			context.y=y;
			drawBug(c);
		    x+=size;
			break;
	  }
   }
   function drawBug(c){
      if(creatureTypes.contains(c)){
	     creatureTypes.get(c).prototype.draw(context);
		 return;
	  }
	  throw new Error("无法识别该字符:"+c);
   }
}
function getPlan(width,height){
   var names=creatureTypes.names();
   var count=names.length+1;
   var arr=[];
   for(var y=0;y<height;y++){
      var tem=[];
	  for(var x=0;x<width;x++)
      {
	     if(y==0||y==height-1)
	     {
		    tem[x]="#";
		 }else if(x==0||x==width-1){
		    tem[x]="#";
		 }else{
		    var rand=Math.RandInt(count);
			if(rand==names.length){
			  tem[x]=" ";
			}else{
			  tem[x]=names[rand];
			}
		 }
	  }
	  arr.push(tem.join(""));
   }
   return arr;
}

//笨虫
function StupidBug(){};
StupidBug.prototype.act=function(sd){
   return {type:"move",direction:"s"};
}
StupidBug.prototype.draw=function(context){
	context.fillStyle="#FF9999";
    context.fillRect(context.x,context.y,size,size);
}
//creatureTypes.register(StupidBug,"o");
//昆虫
function BouncingBug(){
   this.direction="ne";
}
BouncingBug.prototype.act=function(sd){
  if(sd[this.direction]!=" ")
  {
	  this.direction=(this.direction=="ne"?"sw":"ne");
  }
  return {
	  "type":"move",
	  "direction":this.direction
  };
}
BouncingBug.prototype.draw=function(context){
	context.fillStyle="#996699";
    context.fillRect(context.x,context.y,size,size);
}
//creatureTypes.register(BouncingBug,"%");
//新昆虫
function DrunkBug(){}
DrunkBug.prototype.act=function(sd){
    return {type:"move",direction:Math.RandElement(directions.names())};
}
DrunkBug.prototype.draw=function(context){
	context.fillStyle="#FFCCCC";
    context.fillRect(context.x,context.y,size,size);
}
//creatureTypes.register(DrunkBug,"~");

//青苔
function findDirections(surroundings,wanted){
  var found=[];
  directions.each(function(name){
    if(surroundings[name]==wanted)
		found.push(name);
  });
  return found;
}

function Lichen(){
   this.energy=5;
}

Lichen.prototype.act=function(surroundings){
   var emptySpace=findDirections(surroundings," ");
   if(this.energy>=13&&emptySpace.length>0){
     return {type:"reproduce",direction:Math.RandElement(emptySpace)};
   }else if(this.energy<20){
     return {type:"photosynthesize"};
   }else{
     return {type:"wait"};
   }
}
Lichen.prototype.draw=function(context){
	context.fillStyle="green";
    context.fillRect(context.x,context.y,size,size);
}
creatureTypes.register(Lichen,"*");

//食草动物

function LichenEater(){
  this.energy=10;
}

LichenEater.prototype.act=function(surroundings){
   var emptySpace=findDirections(surroundings," ");
   var lichen=findDirections(surroundings,"*");
   if(this.enerty>=30&&emptySpace.length>0){
	 return {type:"reproduce",direction:Math.RandElement(emptySpace)};
   }
   else if(lichen.length>0){
       return {type:"eat",direction:Math.RandElement(lichen)};
   }
   else if(emptySpace.length>0){
       return {type:"move",direction:Math.RandElement(emptySpace)};
   }
       return {type:"wait"};
}

LichenEater.prototype.draw=function(context){
	context.fillStyle="orange";
    context.fillRect(context.x,context.y,size,size);
}
//creatureTypes.register(LichenEater,"c");

//智慧型生物

function CleverLichenEater(){
   this.energy=10;
   this.direction="ne";
}

CleverLichenEater.prototype.act=function(surroundings){
   var emptySpace=findDirections(surroundings," ");
   var lichen=findDirections(surroundings,"*");
   if(surroundings[this.direction]!=" "){
     this.direction=Math.RandElement(emptySpace);
   }
   if(this.energy>=30&&emptySpace.length){
      return {type:"reproduce",direction:Math.RandElement(emptySpace)};
   }
   else if(lichen.length>1){
      return {type:"eat",direction:Math.RandElement(lichen)};
   }
   else if(emptySpace.length>0){
     return {type:"move",direction:this.direction};
   }
   return {type:"wait"};
}

CleverLichenEater.prototype.draw=function(context){
	context.fillStyle="#6AC13F";
    context.fillRect(context.x,context.y,size,size);
}

creatureTypes.register(CleverLichenEater,"d");