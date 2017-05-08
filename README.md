signature

使用该插件需要引入
 * http://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css  //工具箱图标
 * signature.css //基础样式
 * signature.js //基础样式

基本配置项 signature.init(params:{})
 * 初始化配置

signature.init({

    dom:'', //必填 选择签名板容器
    width:'', //选填 定义签名板宽度，默认为容器宽度
    height:'', //选填 定义签名板高度，默认为容器高度
    theme:'', //选填 默认经典黑白 WB：经典黑线白底 BW：白线黑底
    lineWidth:'', //选填 线条粗细 默认1
    console:'' //选填 顶部控制台 默认true
    
})

添加工具 signature.createTools(params:{},fn:function(){}) 
 * 在signature.createTools中你可以自定义属于你的工具
 * icon中填下的类在 http://fontawesome.dashgame.com 中寻找

signature.createTools({

    icon:'', //填写font awesome类(默认类为fa-gear)
    name:'', //定义的按钮名称
    warning:'', //选填 提示信息
    class:'' //选填 额外要添加的类
    
},function(signature){

    /*
     * 点击按钮你要干的事情
     * 默认有一个参数为signature，该参数可获取实例化下的所有对象属性和方法
     */
    
})

多个签名板
 * 创建多个签名板时要注意第二个签名板必填tname参数

var signature2 = new _signature()

signature2.init({

	dom:'.signature2',
	tname:'signature2' //指定所属
	
})	

演示地址：http://www.unhum.com

未来版本预览：1.集成vue2