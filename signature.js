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
}

var tools = [
	{icon:'fa-refresh',name:'refresh',fn:'signature.refresh()'},
	{icon:'fa-th-large',name:'color',fn:'signature.setColor(this)'},
	{icon:'fa-paint-brush',name:'paint-brush',fn:'signature.setConfig("lineWidth",10,this)'}
]

var color_list = [
	{color:'white',name:'白色'},
	{color:'black',name:'黑色'},
	{color:'yellow',name:'黄色'},
	{color:'#ffd700',name:'金黄色'},
	{color:'#292421',name:'象牙黑'},
	{color:'#ffffcd',name:'白杏仁'},
	{color:'#d2691e',name:'巧克力色'},
	{color:'#9933fa',name:'淡紫色'},
	{color:'blue',name:'蓝色'},
	{color:'red',name:'红色'},
	{color:'#b03060',name:'栗色'},
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

//取消事件冒泡
function stopBubble(e){
  //一般用在鼠标或键盘事件上
  if(e && e.stopPropagation){
  	//W3C取消冒泡事件
  	e.stopPropagation();
  }else{
  	//IE取消冒泡事件
  	window.event.cancelBubble = true;
  }
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
		// 初始化工具栏
		for(var i = 0;i<tools.length;i++){
			var _i = document.createElement('i')
			_i.setAttribute('onclick',tools[i].fn)
			_i.classList.add(tools[i].icon)
			_i.classList.add('fa')
			_i.innerHTML = '<span>' + tools[i].name + '</span>'
			div.appendChild(_i)
		}
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

_signature.prototype.active = function(ele,status,fn){
	if(status){
		fn()
	}else{
		ele.classList.contains('active') ? ele.classList.remove('active') : ele.classList.add('active')
	}
}

_signature.prototype.selectColor = function(ele,color,event){
	var e = event || window.event
	var _this = this
	// 取消事件冒泡
	stopBubble(e)	
	ele.classList.contains('select') ? function(){
			ele.classList.remove('select')
			_this.color = _this.tmp.color
	}() : function(){
		for(var i = 0;i < document.querySelectorAll('.signature-set-color > div').length;i++){
			document.querySelectorAll('.signature-set-color > div')[i].classList.remove('select')	
		}
		document.querySelector('.signature-set-color').style.display = 'none';
		_this.color = color
		ele.classList.add('select')
	}()
}

_signature.prototype.setColor = function(ele){
	// 添加样式
	this.active(ele,true,function(){
		if(document.querySelector('.signature-set-color .select')){
			ele.querySelector('.signature-set-color').style.display = 'block'
		}else{
			ele.classList.contains('active') ? ele.classList.remove('active') : ele.classList.add('active')
		}
	})
	if(ele.classList.contains('active')){		
		if(ele.querySelector('.signature-set-color')){
			ele.querySelector('.signature-set-color').style.display = 'block'
		}else{
			// 创建颜色框
			var div = document.createElement('div')		
			div.classList.add('signature-set-color')
			div.style.width = this.width / 3 + 'px'
			for(var i = 0;i<color_list.length;i++){
				var color = document.createElement('div')
				color.classList.add('color')
				color.title = color_list[i].name
				color.setAttribute('onclick','signature.selectColor(this,"' + color_list[i].color + '",event)')
				color.style.background = color_list[i].color				
				div.appendChild(color)
			}
			ele.appendChild(div)
		}
	}else{		
		ele.querySelector('.signature-set-color').style.display = 'none'
		this.color = this.tmp.color
	}
}

_signature.prototype.setConfig = function(params,num,ele){
	var _this = this
	if(ele.classList.contains('active')){
		ele.classList.remove('active')		
		_this[params] = _this.tmp[params]			
	}else{
		ele.classList.add('active')	
        _this[params] = num	
	}
}

_signature.prototype.config = function(params){
	params.dom ? function(){
		alert('禁止修改dom')
		return
	}() : function(){
		for(var p in params){									
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
		this.lineWidth = params.lineWidth ? params.lineWidth : 1			
		this.follow = params.follow ? true : false;
		this.console = params.console == false ? false : true
		this.tmp = {}
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

		// 记录原有属性
		for(var x in this){
			this.tmp[x] = this[x]
		}		
		var _this = this

		this.canvas.onmousedown = function(event){			
			_this.fnDown(event)
		}
	}else{
		alert('please add Document')
	}
}	

