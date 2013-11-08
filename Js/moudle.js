//变量初始化
var directions=new Dictionary({
    "n":new Point(0,-1),
    "ne":new Point(1,-1),
	"e":new Point(1,0),
	"se":new Point(1,1),
	"s":new Point(0,1),
	"sw":new Point(-1,1),
	"w":new Point(-1,0),
	"nw":new Point(-1,-1)
});

var wall={};
wall.character="#";
wall.draw=function(context){
	context.fillStyle="#000000";
    context.fillRect(context.x,context.y,size,size);
}
function Dictionary(startvalues){
  this.values=startvalues||{};
}

Dictionary.prototype.add=function(name,value){
    this.values[name]=value;
}

Dictionary.prototype.get=function(name){
    return this.values[name];
}

Dictionary.prototype.contains=function(name){
   return Object.prototype.propertyIsEnumerable.call(this.values,name);
}

Dictionary.prototype.each=function(action){
   forEachIn(this.values,action);
}

Dictionary.prototype.names=function(){
  var names=[];
  this.each(function(name,value){
     names.push(name);
  });
  return names;
}

function Point(x,y){
  this.x=x;
  this.y=y;
}

Point.prototype.add=function(other){
  return new Point(this.x+other.x,this.y+other.y);
}

function Grid(width,height){
  this.width=width;
  this.height=height;
  this.cells=new Array(width*height);
}

Grid.prototype.valueAt=function(point){
  return this.cells[point.y*this.width+point.x];
}

Grid.prototype.setValueAt=function(point,value){
  this.cells[point.y*this.width+point.x]=value;
}

Grid.prototype.isInside=function(point){
  return point.x>=0&&point.y>=0&&point.x<this.width&&point.y<this.height;
}

Grid.prototype.moveValue=function(from,to){
  this.setValueAt(to,this.valueAt(from));
  this.setValueAt(from,null);
}

Grid.prototype.each=function(action){
   for(var y=0;y<this.height;y++){
      for(var x=0;x<this.width;x++){
	     var point=new Point(x,y);
		 action(point,this.valueAt(point));
	  }
   }
}
function Terrarium(plan){
   var grid=new Grid(plan[0].length,plan.length);
   for(var y=0;y<plan.length;y++){
      var line=plan[y];
	  for(var x=0;x<line.length;x++){
	    grid.setValueAt(new Point(x,y),elementFromCharacter(line.charAt(x)));
	  }
   }
   this.grid=grid;
}

Terrarium.prototype.listActingCreatures=function(){
  var found=[];
  this.grid.each(function(point,value){
    if(value!=undefined&&value.act){
	  found.push({"object":value,"point":point});
	}
  });
  return found;
}


Terrarium.prototype.listSurroundings=function(center){
  var result={};
  var grid=this.grid;
  directions.each(function(name,direction){
    var place=center.add(direction);
	if(grid.isInside(place)){
	   result[name]=characterFromElement(grid.valueAt(place));
	}else{
	   result[name]="#";
	}
  });
  return result;
}

Terrarium.prototype.toString=function(){
   var characters=[];
   var endOfLine=this.grid.width-1;
   this.grid.each(function(point,value){	
         characters.push(characterFromElement(value));
		 if(point.x==endOfLine)
			 characters.push("\n");
   });
   return characters.join("");
}

Terrarium.prototype.processCreature=function(creature,point){
  var action=creature.act(this.listSurroundings(point));
  if(action.type=="move"&&directions.contains(action.direction)){
     var to=point.add(directions.get(action.direction));
	 if(this.grid.isInside(to)&&this.grid.valueAt(to)==undefined){
	    this.grid.moveValue(point,to);
	 }
  }
  else{
    throw new Error("不支持该动作:"+action.type+":"+action.direction);
  }
}

Terrarium.prototype.step=function(){
  var that=this;
  forEach(this.listActingCreatures(),function(ind,val){
     that.processCreature(val.object,val.point);
  });
  print(that);
}

function LifeLikeTerrarium(plan){
  Terrarium.call(this,plan);
}

LifeLikeTerrarium.prototype=clone(Terrarium.prototype);
LifeLikeTerrarium.prototype.constructor=LifeLikeTerrarium;
LifeLikeTerrarium.prototype.processCreature=function(creature,point){
	var energy,action,self=this;
	function dir(){
	 if(!directions.contains(action.direction))
		 return null;
	 var target=point.add(directions.get(action.direction));
	 if(!self.grid.isInside(target))
		 return null;
	 return target;
	}
	action=creature.act(this.listSurroundings(point));
	switch(action.type){
	  case "move":
	     energy=this.creatureMove(creature,point,dir());	  
	  break;
	  case "eat":
	     energy=this.creatureEat(creature,dir());
	  break;
	  case "photosynthesize":
	     energy=-1;	  
	  break;
	  case "reproduce":
		  energy=this.creatureReproduce(creature,dir());
	  break;
	  case "wait":
		  energy=0.2;
	  break;
	  default:
		  throw new Error("Unsupportted action:"+action.type);
	}
	creature.energy-=energy;
	if(creature.energy<=0)
		this.grid.setValueAt(point,undefined);
}
LifeLikeTerrarium.prototype.creatureMove=function(creature,from,to){
   if(to!=null&&this.grid.valueAt(to)==undefined){
     this.grid.moveValue(from,to);
	 from.x=to.x;
	 from.y=to.y;
   }
   return 1;
}   
LifeLikeTerrarium.prototype.creatureEat=function(creature,source){
   var energy=1;
   if(source!=null){
     var meal=this.grid.valueAt(source);
	 if(meal!=undefined&&meal.energy){
	   this.grid.setValueAt(source,undefined);
	   energy-=meal.energy;
	 }
   }
   return energy;
}
LifeLikeTerrarium.prototype.creatureReproduce=function(creature,target){
   var energy=1;
   if(target!=null&&this.grid.valueAt(target)==nudefined){
     var species=characterFromElement(creature);
	 var baby=elementFromCharacter(species);
	 energy=baby.energy*2;
	 if(creature.energy>=energy)
		 this.grid.setValueAt(target,bady);
   }
   return energy;
}



//生物注册函数
var creatureTypes=new Dictionary();
creatureTypes.register=function(constructor,character){
  constructor.prototype.character=character;
  this.add(character,constructor);
}

//根据字符获取对象
function elementFromCharacter(character){
   if(character==" ")
	   return undefined;
   if(character=="#")
	   return wall;
   if(creatureTypes.contains(character))
	   return new (creatureTypes.get(character))();
   throw new  Error("无法识别该类型:"+character);
}
//根据对象获取字符
function characterFromElement(element){
   if(!element)
	   return " ";
   return element.character;
} 

