//javascript 文件
var ready=(function(){
    var funcs=[];
	var isready=false;
	function handler(){
	    for(var i=0;i<funcs.length;i++){
		   funcs[i].call(document);
		}
		funcs=null;
		isready=true;
	}
	if(window.attachEvent){
		window.attachEvent("onload",handler);
	}else{
		window.addEventListener("load",handler,false);
	}
	return function(f){
	    if(isready)
			f.call(document);
		else
			funcs.push(f);
	};
})();
String.format=function(str){
   var args=Array.prototype.slice.call(arguments,1);
   var reg=/\{(\d+)\}/g;
   str=str.replace(reg,function(m,i){
      return args[i];
   });
   return str;
}
function Direction(values){
   this.values=values||{};
}
Direction.prototype.add=function(name,value){
   this.values[name]=value;
}
Direction.prototype.get=function(name){
   return this.values[name];
}
Direction.prototype.contains=function(name){
   return Object.prototype.propertyIsEnumerable.call(this.values,name);
}
Direction.prototype.each=function(action){
      for(var name in this.values){
	       if(Object.prototype.propertyIsEnumerable.call(this.values,name)){
		        action(values[name]);
		   }
	  }
}
function createCanvas(width,height)
{
   var canvas=[];
   function Init(){
	 this.sources=new Direction();
	 this.FPS=1;
	 this.id=String.format("canvas{0}",canvas.length);
	 canvas.push(this.id);
	 this.width=width;
	 this.height=height;
     this.canvas=document.createElement("canvas");
	 this.canvas.setAttribute("id",this.id);
	 this.canvas.setAttribute("width",width);
	 this.canvas.setAttribute("height",height);
	 this.canvas.style.cssText=this.getStyle();
	 this.context=this.canvas.getContext("2d");
   }
   Init.prototype.getStyle=function(){
	  this.left=Math.floor(this.width/2);
	  this.top=Math.floor(this.height/2);
	  var style="border:1px solid red;position:absolute;left:50%;top:50%;width:{0}px;height:{1}px;margin-left:-{2}px;margin-top:-{3}px;";
      return String.format(style,this.width,this.height,this.left,this.top);
   }
   Init.prototype.setSize=function(width,height){
     this.width=width;
	 this.height=height;
	 this.canvas.setAttribute("width",width);
	 this.canvas.setAttribute("height",height);
	 this.canvas.style.cssText=this.getStyle();
   }
   Init.prototype.start=function(){
	  if(this.draw){
		var that=this;
		this.cleartime=setInterval(function(){
		   that.draw();
		},1000/this.FPS);
	  }
   }
   Init.prototype.stop=function(){
     if(this.cleartime){
	    clearInterval(this.cleartime);
	 }
   }
   Init.prototype.addsource=function(name,obj){
       this.sources.add(name,fun);
   }
   Init.prototype.draw=function(){
        
   }
   return new Init();
}