"use strict";
var signature = new _signature()

function _signature(){
	this.dom = {};
	this.width = 0;
	this.height = 0;
	this.color = '';
	this.lineWidth = 0;
	this.follow = false;
	this.console = false;
	this.iStyle = 'cursor:pointer;display:block;margin-bottom:10.5px;float:left;margin-right:5px;font-size:14px'
}

var tools = [
	'color',
	'pencil',	
	'paint-brush'
]

// 获取滚动条信息
function getScrollInfo(params){  
    var scroll=0;  
    if(document.documentElement&&document.documentElement[params]){  
        scroll=document.documentElement[params];  
    }else if(document.body){  
        scroll=document.body[params];  
    }  
    return scroll;  
}

_signature.prototype.fnMove = function(event){	
	var e = event || window.event;
	//取消默认事件
	e.preventDefault()
	var x = e.clientX - this.canvas.offsetLeft + getScrollInfo('scrollLeft');
	var y = e.clientY - this.canvas.offsetTop + getScrollInfo('scrollTop');
	this.pen.lineTo(x,y);
	this.pen.stroke();	
}

_signature.prototype.fnDown = function(event){	
	var e = event || window.event; 	
	var x = e.clientX - this.canvas.offsetLeft + getScrollInfo('scrollLeft');
	var y = e.clientY - this.canvas.offsetTop + getScrollInfo('scrollTop');
	//初始化"画笔"
	this.pen = this.canvas.getContext('2d')	
	//绘制开始
	this.pen.beginPath();
	this.pen.strokeStyle = this.color;
    this.pen.fillStyle = this.bg;           
    this.pen.lineWidth = this.lineWidth;
	this.pen.lineTo(x,y);

	var _this = this

	//创建用户滑动轨迹
	document.onmousemove = function(event){
		_this.fnMove(event)
	}	

	//终止签名
	window.addEventListener('mouseup',function(){
		_this.fnUp()
	})	
}

_signature.prototype.fnUp = function(){
	this.pen.closePath();			
	document.onmousemove = '';
}

_signature.prototype.create = function(ele){
	if(this.console){
		var div = document.createElement('div')
		div.classList.add('signature-console')
		div.style.minHeight = 'calc(37px - 12px)'
		div.style.width = 'calc(100% - 20px)'
		div.style.background = 'white'
		div.style.textAlign = 'left'
		div.style.padding = '12px 10px 0px 10px'
		div.style.borderBottom = 'solid 1px #ddd'
		div.innerHTML = `<i onclick="signature.refresh()" style="`+this.iStyle+`" class="fa-refresh fa">&nbsp;refresh</i>`		
		document.querySelector(ele.dom).appendChild(div);
	}
	var c = document.createElement('canvas');
	c.innerHTML = '请升级您的浏览器或者更换您的浏览器。';		
	c.style.background = ele.bg
	c.width = ele.width;
	c.height = this.console ? ele.height - 38 : ele.height;
	document.querySelector(ele.dom).appendChild(c);
	ele.canvas = c
}

_signature.prototype.refresh = function(){
	if(this.pen){
		this.pen.clearRect(0,0,this.canvas.width,this.canvas.height); 
	}	
}

_signature.prototype.config = function(params){
	var _this = this
	params.dom ? function(){
		alert('禁止修改dom')
		return
	}() : function(){
		for(var p in params){			
			_this.tmp[p] = _this[p]							
			_this[p] = params[p]
		}
	}()
}

_signature.prototype.init = function(params){
	if(params.dom){
		this.dom = params.dom;
		this.width = params.width ? params.width : document.querySelector(this.dom).offsetWidth;
		this.height = params.height ? params.height : document.querySelector(this.dom).offsetHeight;
		this.theme = params.theme ? params.theme : 'WB';//WB：经典黑线白底 BW：白线黑底
		this.lineWidth = params.lineWidth ? params.lineWidth : 1;		
		this.tmp = {};
		this.follow = params.follow ? true : false;
		this.console = params.console == false ? false : true
		switch(this.theme){
			case 'WB':				
				this.color = 'black'
				this.bg = 'white'
			break;
			case 'BW':
				this.color = 'white'
				this.bg = 'black'				
			break;
			default:
				this.color = 'black'
				this.bg = 'white'	
			break;
		}
		this.color = params.color ? params.color : this.color
		this.bg = params.bg	? params.bg : this.bg		

		// 初始化canvas
		this.create(this)

		var _this = this

		this.canvas.onmousedown = function(event){			
			_this.fnDown(event)
		}
	}else{
		alert('please add Document')
	}
}	

