define(function(require){
	require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery.dataTables");
	var Table = require("../template/tableTemplate");
	var html = require("text!./addValueServiceMenu.html");
	var statusMg = require("../template/menu");
	var advertisManager = require("./advertisement/list");
	var advertisMedias = require("./medias/list");
	var advertisBroadcast = require("./adbroadcast/list");
    var advertisStatistics = require("../advertisement/adStatistics/table");
    var lotteryConfigurationManage = require("./lotterymanage/list");
    var loadSubNav = require("../loadSubNav");
    var discount_operation_manage = require("./discount/list");
    var discount_perference_manage = require("./perference/list");
	var operationMenu = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
		    this.service=options.service;
            this.element.html(html);
			this.elements = {
                conent_el:"content-operation-menu"
			};
		    this._render();
		    
		},
		
		_render:function(){
			this.renderContent();
		},
		renderContent:function(){
			 //状态
			/*广告投放*/
//              var dl1 ={};
//              dl1.dt="advertisment";
//              dl1.dd=[["ad_publish",true]];//["ad_statistics",false]
//            
//			  var dl2={};
//			  dl2.dt="lottery_manage";
//			  dl2.dd=[["lottery_configuration",true]];
//			 
//			 
//			 var dls=[];
//			 dls.push(dl1);
//			 dls.push(dl2);
			var dls =loadSub('products');
			 
			 this.left = new Table({
				 selector:"#content-operation-menu",
				 dl:dls,
				 events: {
					 click: function(id){
						 if(id == "ad_publish"){//广告投放
                             var ad_manager_array = ["ad_manage"];
                             if(this.payStyleMg){
                                 this.payStyleMg.destroy();
                             }
                             this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":ad_manager_array,
                                 "events": {
                                     click: function(id){
                                    	 $(".main_bd").empty();
                                         $("#user-content").scrollTop(0);
                                         if(id == "ad_manage"){//广告投放

                                             if(this.advertisingMgPage){
                                                 this.advertisingMgPage.destroy();
                                             }
                                             this.advertisingMgPage = new advertisManager({
                                                 "container":".main_bd"
                                             });
                                         }
                                     }
                                 }
                             });
                             $("#ad_manage").click();
                         } else if(id == "ad_medias"){//媒体库
                             var ad_manager_array = ["medias"];
                             if(this.payStyleMg){
                                 this.payStyleMg.destroy();
                             }
                             this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":ad_manager_array,
                                 "events": {
                                     click: function(id){
                                    	 $(".main_bd").empty();
                                         $("#user-content").scrollTop(0);
                                         if(id == "medias"){//媒体库

                                             if(this.advertisingMgPage){
                                                 this.advertisingMgPage.destroy();
                                             }
                                             this.advertisingMgPage = new advertisMedias({
                                                 "container":".main_bd"
                                             });
                                         }
                                     }
                                 }
                             });
                             $("#medias").click();
                         }else if(id == "broadcast"){//播放记录
                             var ad_manager_array = ["broadcast"];
                             if(this.payStyleMg){
                                 this.payStyleMg.destroy();
                             }
                             this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":ad_manager_array,
                                 "events": {
                                     click: function(id){
                                    	 $(".main_bd").empty();
                                         $("#user-content").scrollTop(0);
                                         if(id == "broadcast"){//播放记录

                                             if(this.advertisingMgPage){
                                                 this.advertisingMgPage.destroy();
                                             }
                                             this.advertisingMgPage = new advertisBroadcast({
                                                 "container":".main_bd"
                                             });
                                         }
                                     }
                                 }
                             });
                             $("#broadcast").click();
                         }
                         else if(id == "ad_statistics"){//广告统计
                             var ad_manager_array = ["statistics"];
                             if(this.payStyleMg){
                                 this.payStyleMg.destroy();
                             }
                             this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":ad_manager_array,
                                 "events": {
                                     click: function(id){
                                    	 $(".main_bd").empty();
                                         $("#user-content").scrollTop(0);
                                         if(id == "statistics"){//广告统计

                                             if(this.advertisingMgPage){
                                                 this.advertisingMgPage.destroy();
                                             }
                                             this.advertisingMgPage = new advertisStatistics({
                                                 "container":".main_bd"
                                             });
                                         }
                                     }
                                 }
                             });
                             $("#statistics").click();
                         }else if(id == "lottery_configuration"){
                        	 var lottery_manager = ["lotteryconfig"];
                             if(this.payStyleMg){
                                 this.payStyleMg.destroy();
                             }
                             this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":lottery_manager,
                                 "events": {
                                     click: function(id){
                                    	 $(".main_bd").empty();
                                         $("#user-content").scrollTop(0);
                                         if(id == "lotteryconfig"){//抽奖配置

                                             if(this.lotteryConfiguration){
                                                 this.lotteryConfiguration.destroy();
                                             }
                                             this.lotteryConfiguration = new lotteryConfigurationManage({
                                                 "container":".main_bd"
                                             });
                                         }
                                     }
                                 }
                             });
                             $("#lotteryconfig").click();
                        	 
                         }else if(id == "discount_minus"){//立减
                        	 var lottery_manager = ["discount_operation","discount_drafts","discount_stop"];
                             if(this.payStyleMg){
                                 this.payStyleMg.destroy();
                             }
                             this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":lottery_manager,
                                 "events": {
                                     click: function(id){
                                    	 $(".main_bd").empty();
                                         $("#user-content").scrollTop(0);
                                         if(id == "discount_operation"){
                                        	 if(this.operationConfiguration){
                                                 this.operationConfiguration.destroy();
                                             }
                                             this.operationConfiguration = new discount_operation_manage({
                                                 "container":".main_bd",
                                                 status:2
                                             });
                                         }else if(id == "discount_drafts"){
                                        	 if(this.operationConfiguration){
                                                 this.operationConfiguration.destroy();
                                             }
                                             this.operationConfiguration = new discount_operation_manage({
                                                 "container":".main_bd",
                                                 status:1
                                             });
                                         }else if(id == "discount_stop"){
                                        	 if(this.operationConfiguration){
                                                 this.operationConfiguration.destroy();
                                             }
                                             this.operationConfiguration = new discount_operation_manage({
                                                 "container":".main_bd",
                                                 status:3
                                             });
                                         }
                                     }
                                 }
                             });
                             $("#discount_operation").click();
                         }else if(id == "discount_preferences"){//折扣
                        	 var perference_manager = ["discount_operation","discount_drafts","discount_stop"];
                             if(this.payStyleMg){
                                 this.payStyleMg.destroy();
                             }
                             this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":perference_manager,
                                 "events": {
                                     click: function(id){
                                    	 $(".main_bd").empty();
                                         $("#user-content").scrollTop(0);
                                         if(id == "discount_operation"){
                                        	 if(this.operationConfiguration){
                                                 this.operationConfiguration.destroy();
                                             }
                                             this.operationConfiguration = new discount_perference_manage({
                                                 "container":".main_bd",
                                                 status:2
                                             });
                                         }else if(id == "discount_drafts"){
                                        	 if(this.operationConfiguration){
                                                 this.operationConfiguration.destroy();
                                             }
                                             this.operationConfiguration = new discount_perference_manage({
                                                 "container":".main_bd",
                                                 status:1
                                             });
                                         }else if(id == "discount_stop"){
                                        	 if(this.operationConfiguration){
                                                 this.operationConfiguration.destroy();
                                             }
                                             this.operationConfiguration = new discount_perference_manage({
                                                 "container":".main_bd",
                                                 status:3
                                             });
                                         }
                                     }
                                 }
                             });
                             $("#discount_operation").click();
                         }
					 }
				 }
			 });
		}
	
	});
	return operationMenu;
});