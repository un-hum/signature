添加工具 signature.createTools(params:{},fn:function(){}) 
 * 在signature.createTools中你可以自定义属于你的工具
 * icon中填下的类在http://fontawesome.dashgame.com/中寻找

signature.createTools({

    icon:'', //填写font awesome类

    name:'', //定义的按钮名称

    warning:'', //选填 提示信息

    class:'', //选填 额外要添加的类
    
},function(){

    //点击按钮你要干的事情
    
})


演示地址：http://www.unhum.com

近期版本预览：1.完善工具块,2.兼容移动端touch

未来版本预览：1.集成vue2,2.集成angular

注意：1.当前页面中最多定义一个