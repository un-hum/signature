"use strict";
function _signature(){
	this.dom       = {};
	this.width     = 0;
	this.height    = 0;
	this.color     = '';
	this.lineWidth = 0;
	this.follow    = false;
	this.console   = false;	
}

var _device = 0;//设备类型 0：pc，1：phone

var tools = [
	{icon: 'fa-refresh',name: 'refresh',fn: 'signature.refresh()'},
	{icon: 'fa-th-large',name: 'color',fn: 'signature.setColor(this)'},
	{icon: 'fa-eraser',name: 'eraser',fn: 'signature.toggleEraser(this)'},
	{icon: 'fa-paint-brush',name: 'paint-brush',fn: 'signature.setConfig("lineWidth",10,this)'},
	{icon: 'fa-arrows-alt',warning:'画板尺寸变化后，内容将丢失',name: 'arrows-alt',fn:'signature.resize(this,"all")'}
]

var color_list = [
	{color: 'white',name: '白色'},
	{color: 'black',name: '黑色'},
	{color: 'yellow',name: '黄色'},
	{color: '#ffd700',name: '金黄色'},
	{color: '#292421',name: '象牙黑'},
	{color: '#ffffcd',name: '白杏仁'},
	{color: '#d2691e',name: '巧克力色'},
	{color: '#9933fa',name: '淡紫色'},
	{color: 'blue',name: '蓝色'},
	{color: 'red',name: '红色'},
	{color: '#b03060',name: '栗色'},
]

//获取当前设备
function getDevice() {
  var sUserAgent = navigator.userAgent.toLowerCase();
  var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
  var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
  var bIsMidp = sUserAgent.match(/midp/i) == "midp";
  var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
  var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
  var bIsAndroid = sUserAgent.match(/android/i) == "android";
  var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
  var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
  if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
    _device = 1
  } else {
    _device = 0
  }
}

// 获取滚动条信息
function getScrollInfo(params){  
    var scroll=0;  
    if(document.documentElement && document.documentElement[params]){  
        scroll = document.documentElement[params];  
    }else if(document.body){  
        scroll = document.body[params];  
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

_signature.prototype = {
	fnMove:function(event){
		var e = event || window.event;
		if(_device == 1) e = e.touches[0]
		var x = (_device == 0 ? e.clientX : e.pageX) - this.canvas.offsetLeft + getScrollInfo('scrollLeft');
		var y = (_device == 0 ? e.clientY : e.pageY) - this.canvas.offsetTop + getScrollInfo('scrollTop');
		this.pen.lineTo(x,y);
		this.pen.stroke();		
	},
	createTools:function(params,fn){		
		if(!params){
			alert('请填写相关参数')
			return
		}

		if(this.console){		
			var _SIGNATURE = this
			// 用户自定义添加工具
			var CONSOLE = document.querySelector('.signature-console')
			var i = document.createElement('i')			
			i.onclick = fn ? fn(_SIGNATURE) : function(){alert('请填写方法')};
			i.innerHTML =  '<span>' + (params.name ? params.name : 'Untitled tool') + '</span>'
			i.setAttribute('class',params.icon ? params.icon + ' fa' : 'fa-gear fa')
			if(params.class){
				i.classList.add(tools[i].class)
			}				
			if(params.warning){
				var warning = document.createElement('div')
				warning.innerHTML = params.warning
				warning.classList.add('signature-warning')
				i.appendChild(warning)
			}				
			CONSOLE.appendChild(i)
		}		
	},
	fnDown:function(event){
		var e = event || window.event; 	
		if(_device == 1) e = e.touches[0]
		var x = (_device == 0 ? e.clientX : e.pageX) - this.canvas.offsetLeft + getScrollInfo('scrollLeft');
		var y = (_device == 0 ? e.clientY : e.pageY) - this.canvas.offsetTop + getScrollInfo('scrollTop');
		//初始化"画笔"
		this.pen = this.canvas.getContext('2d')	
		//绘制开始
		this.pen.beginPath();
		if(document.querySelector('.signature-console')){
			this.pen.strokeStyle = document.querySelector('.fa-eraser').classList.contains('active') ? this.bg : this.color;      
	    	this.pen.lineWidth   = document.querySelector('.fa-eraser').classList.contains('active') ? this.lineWidth + 4 : this.lineWidth - 1;
		}else{
			this.pen.strokeStyle = this.color
			this.pen.lineWidth = this.lineWidth - 1
		}
		this.pen.shadowBlur  = 1;
		this.pen.shadowColor = this.color;
		
		if(document.querySelector('.signature-console')){
			document.querySelector('.fa-eraser').classList.contains('active') ? this.pen.shadowColor = this.bg : this.pen.shadowColor = this.color
		}

		this.pen.lineTo(x,y);

		var _this = this

		//创建用户滑动轨迹
		_device == 0 ? document.onmousemove = function(event){
			_this.fnMove(event)
		} : document.addEventListener('touchmove',function(event){
			//取消默认事件
		    event.preventDefault()		
			_this.fnMove(event)
		})

		//终止签名
		window.addEventListener(_device == 0 ? 'mouseup' : 'touchend',function(event){
			//取消默认事件
		    event.preventDefault()
			_this.fnUp(event)
		})	
	},
	fnUp:function(){
		this.pen.closePath();			
		document.onmousemove = '';
	},
	createArc:function(event){
		var e = event || window.event
		pen.beginPath();
		pen.arc(e.clientX, e.clientY, this.tmp.lineWidth/2, 0, Math.PI * 2, true);
		pen.closePath();
		pen.fillStyle = this.tmp.bg
		pen.fill();
	},
	toggleEraser(ele){
		this.active(ele)
	},
	create:function(ele){
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
				if(tools[i].class){
					_i.classList.add(tools[i].class)
				}				
				if(tools[i].warning){
					var warning = document.createElement('div')
					warning.innerHTML = tools[i].warning
					warning.classList.add('signature-warning')
					_i.appendChild(warning)
				}
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
	},
	refresh:function(){
		if(this.pen){
			this.pen.clearRect(0,0,this.canvas.width,this.canvas.height); 
		}
	},
	active:function(ele,status,fn){
		if(status == true){
			fn()
		}else{
			ele.classList.contains('active') ? ele.classList.remove('active') : ele.classList.add('active')
		}
	},
	selectColor:function(ele,color,event){
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
	},
	setColor:function(ele){
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
	},
	setConfig:function(params,num,ele){
		var _this = this
		if(ele.classList.contains('active')){
			ele.classList.remove('active')		
			_this[params] = _this.tmp[params]			
		}else{
			ele.classList.add('active')	
	        _this[params] = num	
		}
	},
	config:function(params){
		params.dom ? function(){
			alert('禁止修改dom')
			return
		}() : function(){
			for(var p in params){									
				_this[p] = params[p]
			}
		}()
	},
	resize:function(ele,w,j){
		var _this = this
		_this.active(ele,true,function(){
			if(ele.classList.contains('active')){
				ele.classList.remove('active')
				document.querySelector(_this.dom).classList.remove('signature-full')
				_this.canvas.width  = _this.tmp.width
				_this.canvas.height = _this.console ? _this.tmp.height - 38 : _this.tmp.height;
			}else{
				ele.classList.add('active')
				if(w == 'all'){
					document.querySelector(_this.dom).classList.add('signature-full')
					_this.canvas.width  = document.documentElement.clientWidth
					_this.canvas.height = document.documentElement.clientHeight - 38
				}else{
					document.querySelector(_this.dom).style.width  = w;
					document.querySelector(_this.dom).style.height = h;
					_this.canvas.width  = document.documentElement.clientWidth
					_this.canvas.height = document.documentElement.clientHeight - 38
				}				
			}
		})		
	},
	init:function(params){
		if(params.dom){		
			this.dom       = params.dom
			this.width     = params.width ? params.width : document.querySelector(this.dom).offsetWidth
			this.height    = params.height ? params.height : document.querySelector(this.dom).offsetHeight
			this.theme     = params.theme ? params.theme : 'WB' //WB：经典黑线白底 BW：白线黑底
			this.lineWidth = params.lineWidth ? params.lineWidth : 1			
			this.follow    = params.follow ? true : false
			this.console   = params.console == false ? false : true
			this.eraser    = false
			this.tmp       = {}
			switch(this.theme){
				case 'WB':				
					this.color = 'black'
					this.bg    = 'white'
				break;
				case 'BW':
					this.color = 'white'
					this.bg    = 'black'				
				break;
				default:
					this.color = 'black'
					this.bg    = 'white'	
				break;
			}
			this.color = params.color ? params.color : this.color
			this.bg    = params.bg	? params.bg : this.bg		

			// 初始化canvas
			this.create(this)

			// 记录原有属性
			for(var x in this){
				this.tmp[x] = this[x]
			}		
			var _this = this

			getDevice()

			this.canvas.addEventListener(_device == 0 ? 'mousedown' : 'touchstart',function(event){							
				//取消默认事件
			    event.preventDefault()				
				_this.fnDown(event)				
			})
		}else{
			alert('please add Document')
		}		
	}
}

var signature = new _signature()