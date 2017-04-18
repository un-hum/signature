!(function(){
	window.addEventListener('load',function(){
		var _signature = document.querySelector('#signature') ? document.querySelector('#signature') : document.querySelector('.signature');
		var canvasInfo = {
			width:_signature.getAttribute('width') ? _signature.getAttribute('width') : 500,
			height:_signature.getAttribute('height') ? _signature.getAttribute('height') : 800,
			color:_signature.getAttribute('color') ? _signature.getAttribute('color') : 'black',
			lineWidth:_signature.getAttribute('lineWidth') ? parseInt(_signature.getAttribute('lineWidth')) : 1,
			lastX:0,
			lastY:0,
		}
		
		//初始化画布
		createCanvas();
		//获得canvas元素
		var canvas = document.querySelector('#signature canvas') ? document.querySelector('#signature canvas') : document.querySelector('.signature canvas');
		var context = canvas.getContext('2d');
		//记录用户单击鼠标
		canvas.onmousedown = function(event){
			var e = event || window.event;		
			var x = e.clientX - canvas.offsetLeft;
			var y = e.clientY - canvas.offsetTop;
			//绘制开始
			context.beginPath();
			context.strokeStyle = canvasInfo.color;
		    context.fillStyle = canvasInfo.color;
		    context.lineWidth = canvasInfo.lineWidth;
			context.lineTo(x,y);
			//创建用户滑动轨迹
			document.onmousemove = function(event){
				var e = event || window.event;
				var x = e.clientX - canvas.offsetLeft;
				var y = e.clientY - canvas.offsetTop;
				context.lineTo(x,y);
				context.stroke();
				//记录绘制的点
				canvasInfo = {
					lastX:x,
					lastY:y,
				}
			}
		}
		//终止签名
		canvas.onmouseup = function(){
			context.closePath();			
			document.onmousemove = '';
		}
		
		//绘制触点圆
		function brushwork(x,y){
			context.beginPath();
			context.arc(x,y,canvasInfo.lineWidth/2,0,Math.PI*2,true);
			context.closePath();
			context.fillStyle = canvasInfo.color;
			context.fill();
		}
		
		//初始化配置并创建canvas
		function createCanvas(){
			var c = document.createElement('canvas');
			c.innerHTML = '请升级您的浏览器或者更换您的浏览器。';
			c.width = canvasInfo.width;
			c.height = canvasInfo.height;
			_signature.appendChild(c);
		}	
	})
})()
