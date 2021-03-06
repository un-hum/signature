"use strict";
function signature() {
	this.dom = {};
	this.width = 0;
	this.height = 0;
	this.color = '';
	this.tname = '';
	this.lineWidth = 0;
	this.follow = false;
	this.console = false;
};

var _device = 0;//设备类型 0：pc，1：phone

var tools = [
	{ icon: 'fa-refresh', name: 'refresh', fn: 'refresh()' },
	{ icon: 'fa-th-large', name: 'color', fn: 'setColor(this)' },
	{ icon: 'fa-eraser', name: 'eraser', fn: 'toggleEraser(this)' },
	{ icon: 'fa-paint-brush', name: 'paint-brush', fn: 'setConfig("lineWidth",10,this)' },
	{ icon: 'fa-arrows-alt', warning: '画板尺寸变化后，内容将丢失', name: 'arrows-alt', fn: 'resize(this,"all")' },
	{ icon: 'fa-download', name: 'download', fn: 'download()' }
];

var color_list = [
	{ color: 'white', name: '白色' },
	{ color: 'black', name: '黑色' },
	{ color: 'yellow', name: '黄色' },
	{ color: '#ffd700', name: '金黄色' },
	{ color: '#292421', name: '象牙黑' },
	{ color: '#ffffcd', name: '白杏仁' },
	{ color: '#d2691e', name: '巧克力色' },
	{ color: '#9933fa', name: '淡紫色' },
	{ color: 'blue', name: '蓝色' },
	{ color: 'red', name: '红色' },
	{ color: '#b03060', name: '栗色' },
];

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
		_device = 1;
	} else {
		_device = 0;
	}
};

// 获取滚动条信息
function getScrollInfo(params) {
	var scroll = 0;
	if (document.documentElement && document.documentElement[params]) {
		scroll = document.documentElement[params];
	} else if (document.body) {
		scroll = document.body[params];
	}
	return scroll;
};

//取消事件冒泡
function stopBubble(e) {
	//一般用在鼠标或键盘事件上
	if (e && e.stopPropagation) {
		//W3C取消冒泡事件
		e.stopPropagation();
	} else {
		//IE取消冒泡事件
		window.event.cancelBubble = true;
	}
};

_signature.prototype = {
	fnMove: function (event) {
		var e = event || window.event;
		if (_device == 1) e = e.touches[0];
		var position = {
			left: document.querySelector(this.dom).offsetLeft,
			top: this.canvas.offsetTop
		};
		var x = (_device == 0 ? e.clientX : e.pageX) - position.left + getScrollInfo('scrollLeft');
		var y = (_device == 0 ? e.clientY : e.pageY) - position.top + getScrollInfo('scrollTop');
		this.pen.lineTo(x, y);
		this.pen.stroke();
	},
	createTools: function (params, fn) {
		if (!params) {
			alert('请填写相关参数');
			return
		};

		if (this.console) {
			var _SIGNATURE = this;
			// 用户自定义添加工具
			var CONSOLE = document.querySelector(this.dom).querySelector('.signature-console');
			var i = document.createElement('i');
			i.onclick = fn ? function () { fn(_SIGNATURE) } : function () { alert('请填写方法') };
			i.innerHTML = '<span>' + (params.name ? params.name : 'Untitled tool') + '</span>';
			i.setAttribute('class', params.icon ? params.icon + ' fa' : 'fa-gear fa');
			if (params.class) {
				i.classList.add(tools[i].class);
			}
			if (params.warning) {
				var warning = document.createElement('div');
				warning.innerHTML = params.warning;
				warning.classList.add('signature-warning');
				i.appendChild(warning);
			}
			CONSOLE.appendChild(i);
		}
	},
	download: function () {
		var type = 'png';
		var imgData = this.canvas.toDataURL();
		// 修改图片类型,强制下载
		var _fixType = function (type) {
			type = type.toLowerCase().replace(/jpg/i, 'jpeg');
			var r = type.match(/png|jpeg|bmp|gif/)[0];
			return 'image/' + r;
		};
		imgData = imgData.replace(_fixType(type), 'image/octet-stream');
		// 保存图片到本地
		var saveFile = function (data, filename) {
			var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
			save_link.href = data;
			save_link.download = filename;

			var event = document.createEvent('MouseEvents');
			event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			save_link.dispatchEvent(event);
		};
		// 设置图片名称
		var filename = 'signature_' + (new Date()).getTime() + '.' + type;
		// download
		saveFile(imgData, filename);
	},
	fnDown: function (event) {
		var e = event || window.event;
		var _dom = document.querySelector(this.dom);
		var position = {
			left: document.querySelector(this.dom).offsetLeft,
			top: this.canvas.offsetTop
			// - (this.console ? : 0)
		};
		if (_device == 1) e = e.touches[0];
		var x = (_device == 0 ? e.clientX : e.pageX) - position.left + getScrollInfo('scrollLeft');
		var y = (_device == 0 ? e.clientY : e.pageY) - position.top + getScrollInfo('scrollTop');
		//初始化"画笔"
		this.pen = this.canvas.getContext('2d');
		//绘制开始
		this.pen.beginPath();
		if (_dom.querySelector('.signature-console')) {
			this.pen.strokeStyle = _dom.querySelector('.fa-eraser').classList.contains('active') ? this.bg : this.color;
			this.pen.lineWidth = _dom.querySelector('.fa-eraser').classList.contains('active') ? this.lineWidth + 4 : this.lineWidth - 1;
		} else {
			this.pen.strokeStyle = this.color;
			this.pen.lineWidth = this.lineWidth - 1;
		}
		this.pen.shadowBlur = 1;
		this.pen.shadowColor = this.color;

		if (_dom.querySelector('.signature-console')) {
			_dom.querySelector('.fa-eraser').classList.contains('active') ? this.pen.shadowColor = this.bg : this.pen.shadowColor = this.color;
		}

		this.pen.lineTo(x, y);

		var _this = this;

		//创建用户滑动轨迹
		_device == 0 ? document.onmousemove = function (event) {
			_this.fnMove(event);
		} : document.addEventListener('touchmove', function (event) {
			//取消默认事件
			event.preventDefault();
			_this.fnMove(event);
		});

		//终止签名
		window.addEventListener(_device == 0 ? 'mouseup' : 'touchend', function (event) {
			_this.fnUp(event);
		});
	},
	fnUp: function () {
		this.pen.closePath();
		document.onmousemove = '';
	},
	toggleEraser(ele) {
		this.active(ele);
	},
	create: function (ele) {
		var _this = this;
		if (this.console) {
			var div = document.createElement('div');
			div.classList.add('signature-console');
			// 初始化工具栏
			for (var i = 0; i < tools.length; i++) {
				var _i = document.createElement('i');
				_i.setAttribute('onclick', _this.tname + '.' + tools[i].fn);
				_i.classList.add(tools[i].icon);
				_i.classList.add('fa');
				_i.innerHTML = '<span>' + tools[i].name + '</span>';
				if (tools[i].class) {
					_i.classList.add(tools[i].class);
				}
				if (tools[i].warning) {
					var warning = document.createElement('div');
					warning.innerHTML = tools[i].warning;
					warning.classList.add('signature-warning');
					_i.appendChild(warning);
				}
				div.appendChild(_i);
			}
			document.querySelector(ele.dom).appendChild(div);
			//记录控制台高度
			_this.consoleHeight = document.querySelector(this.dom).querySelector('.signature-console').clientHeight;
		}
		var c = document.createElement('canvas');
		c.innerHTML = '请升级您的浏览器或者更换您的浏览器。';
		c.style.background = ele.bg;
		c.width = ele.width;
		c.height = this.console ? ele.height - _this.consoleHeight : ele.height;
		document.querySelector(ele.dom).appendChild(c);
		ele.canvas = c;

		// 相应容器变化
		window.addEventListener('resize', function () {
			if (_this.width != document.querySelector(_this.dom).offsetWidth) {
				_this.canvas.width = document.querySelector(_this.dom).offsetWidth;
				_this.width = document.querySelector(_this.dom).offsetWidth;
				setTimeout(function () {
					console.log(0);
				}, 0)
			}
		})
	},
	refresh: function () {
		if (this.pen) {
			this.pen.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	},
	active: function (ele, status, fn) {
		if (status == true) {
			fn();
		} else {
			ele.classList.contains('active') ? ele.classList.remove('active') : ele.classList.add('active');
		}
	},
	selectColor: function (ele, color, event) {
		var e = event || window.event;
		var _this = this;
		// 取消事件冒泡
		stopBubble(e);
		ele.classList.contains('select') ? function () {
			ele.classList.remove('select');
			_this.color = _this.tmp.color;
		}() : function () {
			var _dom = document.querySelector(_this.dom);
			for (var i = 0; i < _dom.querySelectorAll('.signature-set-color > div').length; i++) {
				_dom.querySelectorAll('.signature-set-color > div')[i].classList.remove('select');
			}
			_dom.querySelector('.signature-set-color').style.display = 'none';
			_this.color = color;
			ele.classList.add('select');
		}()
	},
	setColor: function (ele) {
		var _this = this;
		var signature_set_color = ele.querySelector('.signature-set-color');
		// 添加样式
		this.active(ele, true, function () {
			if (ele.querySelector('.signature-set-color .select')) {
				signature_set_color.style.display = 'block';
			} else {
				ele.classList.contains('active') ? ele.classList.remove('active') : ele.classList.add('active');
			}
		});
		if (ele.classList.contains('active')) {
			if (signature_set_color) {
				signature_set_color.style.display = 'block';
			} else {
				// 创建颜色框
				var div = document.createElement('div');
				div.classList.add('signature-set-color');
				div.style.width = Math.ceil((this.width / 2 - 10) / 34) * 34 + 'px';
				for (var i = 0; i < color_list.length; i++) {
					var color = document.createElement('div');
					color.classList.add('color');
					color.title = color_list[i].name;
					color.setAttribute('onclick', this.tname + '.selectColor(this,"' + color_list[i].color + '",event)');
					color.style.background = color_list[i].color;
					div.appendChild(color);
				}
				ele.appendChild(div);
			}
		} else {
			signature_set_color.style.display = 'none';
			this.color = this.tmp.color;
		}
	},
	setConfig: function (params, num, ele) {
		var _this = this;
		if (ele.classList.contains('active')) {
			ele.classList.remove('active');
			_this[params] = _this.tmp[params];
		} else {
			ele.classList.add('active');
			_this[params] = num;
		}
	},
	config: function (params) {
		params.dom ? function () {
			alert('禁止修改dom');
			return
		}() : function () {
			for (var p in params) {
				_this[p] = params[p];
			}
		}()
	},
	resize: function (ele, w, j) {
		var _this = this;
		_this.active(ele, true, function () {
			var _dom = document.querySelector(_this.dom);
			if (ele.classList.contains('active')) {
				ele.classList.remove('active');
				_dom.classList.remove('signature-full');
				_this.canvas.width = _this.tmp.width;
				_this.canvas.height = _this.console ? _this.tmp.height - _this.consoleHeight : _this.tmp.height;
			} else {
				ele.classList.add('active');
				if (w == 'all') {
					_dom.classList.add('signature-full');
					_this.canvas.width = document.documentElement.clientWidth;
					_this.canvas.height = document.documentElement.clientHeight;
				} else {
					_dom.style.width = w;
					_dom.style.height = h;
					_this.canvas.width = document.documentElement.clientWidth;
					_this.canvas.height = document.documentElement.clientHeight;
				}
			}
		})
	},
	init: function (params) {
		if (params.dom) {
			this.dom = params.dom;
			this.width = params.width ? params.width : document.querySelector(this.dom).offsetWidth;
			this.height = params.height ? params.height : document.querySelector(this.dom).offsetHeight;
			this.theme = params.theme ? params.theme : 'WB'; //WB：经典黑线白底 BW：白线黑底
			this.lineWidth = params.lineWidth ? params.lineWidth : 1;
			this.follow = params.follow ? true : false;
			this.console = params.console == false ? false : true;
			this.consoleHeight = 0;
			this.eraser = false;
			this.tname = params.tname ? params.tname : 'signature';
			this.tmp = {};
			switch (this.theme) {
				case 'WB':
					this.color = 'black';
					this.bg = 'white';
					break;
				case 'BW':
					this.color = 'white';
					this.bg = 'black';
					break;
				default:
					this.color = 'black';
					this.bg = 'white';
					break;
			}
			this.color = params.color ? params.color : this.color;
			this.bg = params.bg ? params.bg : this.bg;

			// 初始化canvas
			this.create(this);

			// 记录原有属性
			for (var x in this) {
				this.tmp[x] = this[x];
			}
			var _this = this;

			getDevice();

			this.canvas.addEventListener(_device == 0 ? 'mousedown' : 'touchstart', function (event) {
				//取消默认事件
				event.preventDefault();
				_this.fnDown(event);
			})
		} else {
			alert('please add Document');
		}
	}
};
