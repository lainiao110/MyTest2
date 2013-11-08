var ready=(function(){
    var readystate=false;
	var funcs=[];
	function handler(e){
	  if(readystate)
		  return;
	  if(e.type='readystatechange'&&document.readyState!=="complete")
		  return;
	  for(var i=0;i<funcs.length;i++){
	     funcs[i].call(document);
	  }
	  readystate=true;
	  funcs=null;
	}
	if(document.addEventListener){
	   document.addEventListener("DOMContentLoaded",handler,false);
	   document.addEventListener("readystatechange",handler,false);
	   window.addEventListener("load",handler,false);
	}else{
	   document.attachEvent("onreadystatechange",handler);
	   window.attachEvent("onload",handler);
	}
	return function(f){
	   if(readystate)
		   f.call(document);
	   else
		   funcs.push(f);
	}
})();

String.format=function(str){
   var reg=/\{(\d+)\}/g;
   var args=Array.prototype.slice.call(arguments,1);
   str=str.replace(reg,function(ma,ind){
       return args[ind];
   });
   return str 
}

Math.RandInt=function(below){
  return Math.floor(Math.random()*below);
}

Math.RandElement=function(arr){
   if(arr.length==0)
	   throw new Error("这个数组是空的");
   var index=Math.RandInt(arr.length);
   return arr[index];
}
function bind(func,object){
  return function(){
    return func.apply(object,arguments);
  }
}

function forEachIn(obj,action){
  for(var name in obj){
     if(Object.prototype.propertyIsEnumerable.call(obj,name)){
	      action(name,obj[name]);
	 }
  }
}

function forEach(arr,action){
  for(var i=0,len=arr.length;i<len;i++){
     action(i,arr[i]);
  }
}

function registerEventHandler(node,event,handler){
  if(typeof node.addEventListener=="function")
	  node.addEventListener(event,handler,false);
  else
	  node.attachEvent("on"+event,handler);
}

function unregisterEventHander(node,event,handler){
   if(typeof node.removeEventListener == "function")
	   node.removeEventListener(event,handler,false);
   else
	   node.detachEvent("on"+event,handler);
}

function clone(obj){
   function parent(){}
   parent.prototype=obj;
   return new parent();
} 
