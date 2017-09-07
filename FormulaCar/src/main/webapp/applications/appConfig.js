define(function(require){
	require("cloud/base/cloud");
            var organ = {
                    name : "organ",
                    order:5,
                    defaultOpen:false,
                    subNavs : [{
                        name : "organ",
                        order:0,
                        defaultOpen:true,
                        url : "./organization/table"
                    },{
                        name : "organStat",
                        order:1,
                        defaultOpen:false,
                        url: "./rainbowStatistics/organSta/content"
                    }]
            };
            var mapUrl = "";
            var languge = localStorage.getItem("language");
        	if(languge == "en"){
        		mapUrl = "./monitor/gis_en";
        	}else{
        		mapUrl = "./monitor/gis";
        	}
            //监控
            var monitor = {
                name: "monitor",
                order:0,
                subNavs : [{//电子地图
                    name : "apGis",
                    order:0,
                    defaultOpen:true,
                    //url: "./automat/gis_automat"
                    url: mapUrl
                }]
            };
            //运维
            var operation = {
                    name:"operation",
                    order:1,
                    subNavs : [{
                        name : "operation_manage",
                        order:0,
                        defaultOpen:false, 
                        url: "./operation_manage/operation.js"
                    }]
                };
            //增值服务
            var products = {
                    name:"products",
                    order:3,
                    subNavs : [{
                        name : "products",
                        order:0,
                        defaultOpen:false, 
                        url: "./addValueService_manage/addValueService"
                    }]
                };
           //统计
            var trade={
            		 name:"trade",
                     order:2,
                     subNavs : [{
                         name : "trade",
                         order:0,
                         defaultOpen:false, 
                         url: "./trade_manage/trade.js"
                     }]	
            }
           //系统
            var rainbow_system = {
                name:"rainbow_system",
                order:4,
                subNavs:[{
                    name : "system",
                    order:0,
                    defaultOpen:false,
                    url: "./system_manage/system.js"
                }]
            }



            /*
             * subViews视图的命名(name字段)：以list、overview、gis、scada结尾，不论大小写，
             * 都会截取name的结尾和"nav-sub-view-"连接，形成类名
             * 使用已在nav.css定义的样式；
             * 如果不是以‘list、overview、gis、scada’中任何一个结尾的，则需要自定义样式（依旧是和'nav-sub-view-'组成类名），
             * 可以参考预定义的样式书写，
             * 并将结尾添加到下面这个数组，请在命名的时候有良好的区分
             * */
            var viewName=['list','overview','gis','scada'];
            /*
             * 一级导航的命名（name字段）:以以下列出的8种名称命名(不论大小写)，会和'nav-main-left-app-'连接成类名，
             * 默认使用nav.css里已定义的样式，
             * 以其他名称命名，则需要在nav.css自行添加类名定义样式，并且将名称(name)添加到以下数组中，可以参考预定义的样式书写*/
            var navName=['monitor','operation','trade','products','rainbow_system'];
            /*
             * 二级导航的命名没有要求
             * */
            /*
             * 所有命名请检查国际化
             * navArr:[monitor,operation,trade,products,rainbow_system],
             * */
            var appConfig = {
            		navArr:[],
            		viewName:viewName,
            		navName:navName
            };
	return appConfig;
})