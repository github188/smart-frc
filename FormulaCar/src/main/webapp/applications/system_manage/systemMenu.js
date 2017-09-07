define(function(require){
	require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery.dataTables");
	var Table = require("../template/tableTemplate");
	var html = require("text!./systemMenu.html");
	var statusMg = require("../template/menu");
	var wechat_Mg =require("./payMan/wechat_pay/configuration");
	var baidu_Mg=require("./payMan/baidu_pay/configuration");
	var alipay_Mg=require("./payMan/ali_pay/configuration");
	var user_Mg=require("./userMan/user/list");
	//var roleManager = require("../system/role/table");
	var roleManager = require("./roleMan/role/list");
    var privilegeManager = require("../system/group/group");
	var operating_log_Mg=require("./logMan/operating/list");
	var areaManager = require("./areaMan/area/list");
	var cardManager= require("./cardMan/card/list");
	var facebookMge= require("./facebookMan/facebook/configuration");
	var cardSet_Mg= require("./cardMan/card/config");
	var applypay_Mg= require("./payMan/applePay/configuration");
	var google_Mg= require("./payMan/googleWallet/configuration");
	var facebook_Mg= require("./payMan/facebook/configuration");
	var oidManagement = require("./oidMan/oid/list");
    var advertisManager = require("../advertisement/advertising/table");
    var advertisStatistics = require("../advertisement/adStatistics/table");
    var version_Mg  = require("./versionMan/version/list");
    var versionDistribution_Mg  = require("./versionMan/distribution/list");
    var versionDown_Mg = require("./versionDown/list");
    var Abc_Mg = require("./payMan/AbcPay/configuration");
    
    var bestpay_Mg = require("./payMan/best_pay/configuration");
    var jdpay_Mg = require("./payMan/jd_pay/configuration");
    
    var loadSubNav = require("../loadSubNav");
    var versionShare_Mg = require("./versionDown/share/list");
    var pro_Mg = require("../products_manage/product/list/list");
    var automat_model = require("../operation_manage/model/list");
    var undo_model = require("../operation_manage/model/untreated/list");
	var systemMenu = Class.create(cloud.Component,{
		
		initialize:function($super,options){
			$super(options);
		    this.service=options.service;
            this.element.html(html);
			this.elements = {
                conent_el:"content-system-menu"
			};
		    this._render();
		    
		},
		
		_render:function(){
			this.renderContent();
			
		},
		renderContent:function(){
//			 /*区域*/
//			 var dl1={};
//			 dl1.dt="oid_manage";
//			 dl1.dd=[["oid_list",true]];
//			 
//			 /*用户*/
//			 var dl3={};
//			 dl3.dt="user";
//			 dl3.dd=[["user_manage",true]];
//			 
//			 //权限设置
//			 var dl2={};
//			 dl2.dt="permission_settings";
//			// dl2.dd=[["role_manage",true],["group_management",true]];
//			 dl2.dd=[["role_manage",true]];
//			 
//			 /*支付管理*/
//			 var dl4={};
//			 dl4.dt="automat_pay_manage";
//			// dl3.dd=[["automat_wx_pay",true],["automat_alipay",true],["automat_baifubao",true],["automat_union_flash_pay",true]];
//			// dl4.dd=[["automat_wx_pay",true],["automat_alipay",true],["automat_baifubao",true],["automat_applePay",true],["automat_googleWallet",true],["automat_facebookpayment",true]];
//			 dl4.dd=[["automat_wx_pay",true],["automat_alipay",true],["automat_baifubao",true]];
//			 /*日志*/
//			 var dl5={};
//			 dl5.dt="smart_log";
//			 dl5.dd=[["log",true]];
//			 /*活动*/
//			 var dl6 ={};
//			 dl6.dt="sys_activity";
//			 dl6.dd=[["sys_card",true],["facebook",true]];
//			 //APP版本管理
//             var dl7 = {};
//             dl7.dt="appVersions_man";
//             dl7.dd=[["versions_man",true],["version_distribution",true]];
//			 //APP版本下载
//             var dl8 = {};
//             dl8.dt="appVersions_down";
//             dl8.dd=[["versions_down_list",true]];
//             
//			 var dls=[];
//			 var currentHost=window.location.hostname;//服务器域名
			 var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
			 var dl1 = {};
	         dl1.dt = "product_manage";//商品管理
	         dl1.dd = [["product_manage", true]];//商品管理
	         var dl2 = {};
	         dl2.dt = "model_list";//机型管理
	         dl2.dd = [["model_list", true]];
	         
//			 dls.push(dl2);
//			 dls.push(dl3);
//			 dls.push(dl4);
//			 if(oid == '0000000000000000000abcde'){
//            	 dls.push(dl7);
//             }else{
//            	 dls.push(dl8);
//             }
//             dls.push(dl5);
//			// dls.push(dl6);
			var dls =loadSub('rainbow_system');
			if(oid == '0000000000000000000abcde'){
           	   dls.push(dl1);
           	   dls.push(dl2);
            }
			 this.left = new Table({
				 selector:"#content-system-menu",
				 dl:dls,
				 events: {
					 click: function(id){
						  if(id == "versions_man"){//app版本管理
							  var wechatMan_Array=["versions_set"];
	                			 if(this.payStyleMg){
	             					this.payStyleMg.destroy();
	             			     }
	                			 this.payStyleMg=new statusMg({
	                                 "container":"#col_slide_main",
	                                 "lis":wechatMan_Array,
	                                 "events": {
	                					 click: function(id){
	                						 $(".main_bd").empty();
	                						 $("#user-content").scrollTop(0);
	                  						 if(id == "versions_set"){
	                  							 if(this.versionMgPage){
	                            					this.versionMgPage.destroy();
	                            			     }
	                 							 this.versionMgPage = new version_Mg({
	                 								"container":".main_bd"
	                 							 });
	                  						 }
	                					 }
	                                 }
	                			 });
	                			 $("#versions_set").click();
						  }else if(id == "version_distribution"){//app版本分配
							     var wechatMan_Array=["version_distribution_list"];
	                			 if(this.payStyleMg){
	             					this.payStyleMg.destroy();
	             			     }
	                			 this.payStyleMg=new statusMg({
	                                 "container":"#col_slide_main",
	                                 "lis":wechatMan_Array,
	                                 "events": {
	                					 click: function(id){
	                						 $(".main_bd").empty();
	                						 $("#user-content").scrollTop(0);
	                  						 if(id == "version_distribution_list"){
	                  							 if(this.versionDistributionPage){
	                            					this.versionDistributionPage.destroy();
	                            			     }
	                 							 this.versionDistributionPage = new versionDistribution_Mg({
	                 								"container":".main_bd"
	                 							 });
	                  						 }
	                					 }
	                                 }
	                			 });
	                			 $("#version_distribution_list").click();
						  }else if(id =="versions_down_list"){//app版本下载
							  var wechatMan_Array=["version_down"];
	                			 if(this.payStyleMg){
	             					this.payStyleMg.destroy();
	             			     }
	                			 this.payStyleMg=new statusMg({
	                                 "container":"#col_slide_main",
	                                 "lis":wechatMan_Array,
	                                 "events": {
	                					 click: function(id){
	                						 $(".main_bd").empty();
	                						 $("#user-content").scrollTop(0);
	                  						 if(id == "version_down"){
	                  							 if(this.versionDownPage){
	                            					this.versionDownPage.destroy();
	                            			     }
	                 							 this.versionDownPage = new versionDown_Mg({
	                 								"container":".main_bd"
	                 							 });
	                  						 }
	                					 }
	                                 }
	                			 });
	                			 $("#version_down").click();
							  
						  }else if(id =="versions_share_list"){//app版本分配记录
							  var shareMan_Array=["version_share"];
	                			 if(this.payStyleMg){
	             					this.payStyleMg.destroy();
	             			     }
	                			 this.payStyleMg=new statusMg({
	                                 "container":"#col_slide_main",
	                                 "lis":shareMan_Array,
	                                 "events": {
	                					 click: function(id){
	                						 $(".main_bd").empty();
	                						 $("#user-content").scrollTop(0);
	                  						 if(id == "version_share"){
	                  							 if(this.versionSharePage){
	                            					this.versionSharePage.destroy();
	                            			     }
	                 							 this.versionSharePage = new versionShare_Mg({
	                 								"container":".main_bd"
	                 							 });
	                  						 }
	                					 }
	                                 }
	                			 });
	                			 $("#version_share").click();
							  
						  }else if(id == "automat_wx_pay"){//微信支付
                			 var wechatMan_Array=["wechat_set"];
                			 if(this.payStyleMg){
             					this.payStyleMg.destroy();
             			     }
                			 this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":wechatMan_Array,
                                 "events": {
                					 click: function(id){
                						 $(".main_bd").empty();
                						 $("#user-content").scrollTop(0);
                  						 if(id == "wechat_set"){//配置项
                  							 if(this.wechatMgPage){
                            					this.wechatMgPage.destroy();
                            			     }
                 							 this.wechatMgPage = new wechat_Mg({
                 								"container":".main_bd"
                 							 });
                  						 }
                					 }
                                 }
                			 });
                			 $("#wechat_set").click();
                		 }else if(id == "automat_baifubao"){//百度钱包
                			 var baiduMan_Array=["baidu_set"];
                			 if(this.payStyleMg){
             					this.payStyleMg.destroy();
             			     }
                			 this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":baiduMan_Array,
                                 "events": {
                					 click: function(id){
                						 $(".main_bd").empty();
                						 $("#user-content").scrollTop(0);
                  						 if(id == "baidu_set"){//配置项
                  							 if(this.baiduMgPage){
                            					this.baiduMgPage.destroy();
                            			     }
                 							 this.baiduMgPage = new baidu_Mg({
                 								"container":".main_bd"
                 							 });
                  						 }
                					 }
                                 }
                			 });
                			 $("#baidu_set").click();
                		 }else if(id == "automat_alipay"){//支付宝
                			 var alipayMan_Array=["alipay_set"];
                			 if(this.payStyleMg){
             					this.payStyleMg.destroy();
             			     }
                			 this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":alipayMan_Array,
                                 "events": {
                					 click: function(id){
                						 $(".main_bd").empty();
                						 $("#user-content").scrollTop(0);
                  						 if(id == "alipay_set"){//配置项
                  							 if(this.alipayMgPage){
                            					this.alipayMgPage.destroy();
                            			     }
                 							 this.alipayMgPage = new alipay_Mg({
                 								"container":".main_bd"
                 							 });
                  						 }
                					 }
                                 }
                			 });
                			 $("#alipay_set").click();
                		 }else if(id == "automat_best_pay"){//翼支付
                			 var bestpayMan_Array=["bestpay_set"];
                			 if(this.payStyleMg){
             					this.payStyleMg.destroy();
             			     }
                			 this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":bestpayMan_Array,
                                 "events": {
                					 click: function(id){
                						 $(".main_bd").empty();
                						 $("#user-content").scrollTop(0);
                  						 if(id == "bestpay_set"){//配置项
                  							 if(this.bestpayMgPage){
                            					this.bestpayMgPage.destroy();
                            			     }
                 							 this.bestpayMgPage = new bestpay_Mg({
                 								"container":".main_bd"
                 							 });
                  						 }
                					 }
                                 }
                			 });
                			 $("#bestpay_set").click();
                		 }else if(id == "automat_jd_pay"){//京东支付
                			 var jdpayMan_Array=["jdpay_set"];
                			 if(this.payStyleMg){
             					this.payStyleMg.destroy();
             			     }
                			 this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":jdpayMan_Array,
                                 "events": {
                					 click: function(id){
                						 $(".main_bd").empty();
                						 $("#user-content").scrollTop(0);
                  						 if(id == "jdpay_set"){//配置项
                  							 if(this.jdpayMgPage){
                            					this.jdpayMgPage.destroy();
                            			     }
                 							 this.jdpayMgPage = new jdpay_Mg({
                 								"container":".main_bd"
                 							 });
                  						 }
                					 }
                                 }
                			 });
                			 $("#jdpay_set").click();
                		 }else if(id == "automat_abcpay"){
                			 var alipayMan_Array=["googleWallet_set"];
                			 if(this.payStyleMg){
             					this.payStyleMg.destroy();
             			     }
                			 this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":alipayMan_Array,
                                 "events": {
                					 click: function(id){
                						 $(".main_bd").empty();
                						 $("#user-content").scrollTop(0);
                  						 if(id == "googleWallet_set"){//配置项
                  							 if(this.alipayMgPage){
                            					this.alipayMgPage.destroy();
                            			     }
                 							 this.alipayMgPage = new Abc_Mg({
                 								"container":".main_bd"
                 							 });
                  						 }
                					 }
                                 }
                			 });
                			 $("#googleWallet_set").click();
                		 }else if(id == "automat_applePay"){//apple pay
                			 var unionPayMan_Array=["applypay_set"];
                			 if(this.payStyleMg){
             					this.payStyleMg.destroy();
             			     }
                			 this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":unionPayMan_Array,
                                 "events": {
                					 click: function(id){
                						 $(".main_bd").empty();
                						 $("#user-content").scrollTop(0);
                  						 if(id == "applypay_set"){//配置项
                  							 if(this.applePayMgPage){
                             					this.applePayMgPage.destroy();
                             			     }
                  							 this.applePayMgPage = new applypay_Mg({
                  								"container":".main_bd"
                  							 });
                  						 }
                					 }
                                 }
                			 });
                			 $("#applypay_set").click();
                		 }else if(id == "automat_googleWallet"){//google pay
                			 var unionPayMan_Array=["googleWallet_set"];
                			 if(this.payStyleMg){
             					this.payStyleMg.destroy();
             			     }
                			 this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":unionPayMan_Array,
                                 "events": {
                					 click: function(id){
                						 $(".main_bd").empty();
                						 $("#user-content").scrollTop(0);
                  						 if(id == "googleWallet_set"){//配置项
                  							 if(this.googleMgPage){
                             					this.googleMgPage.destroy();
                             			     }
                  							 this.googleMgPage = new google_Mg({
                  								"container":".main_bd"
                  							 });
                  						 }
                					 }
                                 }
                			 });
                			 $("#googleWallet_set").click();
                		 }else if(id == "automat_facebookpayment"){//facebook
                			 var unionPayMan_Array=["facebooks_set"];
                			 if(this.payStyleMg){
             					this.payStyleMg.destroy();
             			     }
                			 this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":unionPayMan_Array,
                                 "events": {
                					 click: function(id){
                						 $(".main_bd").empty();
                						 $("#user-content").scrollTop(0);
                  						 if(id == "facebooks_set"){//配置项
                  							 if(this.facebookMgPage){
                             					this.facebookMgPage.destroy();
                             			     }
                  							 this.facebookMgPage = new facebook_Mg({
                  								"container":".main_bd"
                  							 });
                  						 }
                					 }
                                 }
                			 });
                			 $("#facebooks_set").click();
                		 }else if(id == "user_manage"){//用户
                			 var user_Array=["userList"];
                			 if(this.payStyleMg){
             					this.payStyleMg.destroy();
             			     }
                			 this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":user_Array,
                                 "events": {
                					 click: function(id){
                						 $(".main_bd").empty();
                						 $("#user-content").scrollTop(0);
                  						 if(id == "userList"){//配置项
                  							if(this.userMgPage){
                            					this.userMgPage.destroy();
                            			     }
                 							 this.userMgPage = new user_Mg({
                 								"container":".main_bd"
                 							 });
                  						 }
                					 }
                                 }
                			 });
                			 $("#userList").click();
                		 }else if(id == "role_manage"){ //角色管理
                			 var role_manager_array = ["roleList"];
                			 if(this.payStyleMg){
              					this.payStyleMg.destroy();
              			     }
                			 this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":role_manager_array,
                                 "events": {
                					 click: function(id){
                						 
                						 $(".main_bd").empty();
                						 $("#user-content").scrollTop(0);
                  						 if(id == "roleList"){//配置项
                  							if(this.roleMgPage){
                            					this.roleMgPage.destroy();
                            			     }
                 							 this.roleMgPage = new roleManager({
                 								"container":".main_bd"
                 							 });
                  						 }
                					 }
                                 }
                			 });
                			 $("#roleList").click();
                		 }
                         else if(id == "group_management"){//权限分组
                             var privilege_manager_array = ["authority_manage"];
                             if(this.payStyleMg){
                                 this.payStyleMg.destroy();
                             }
                             this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":privilege_manager_array,
                                 "events": {
                                     click: function(id){
                                    	 
                                         $(".main_bd").empty();
                                         $("#user-content").scrollTop(0);
                                         if(id == "authority_manage"){//配置项
                                             if(this.privilegeMgPage){
                                                 this.privilegeMgPage.destroy();
                                             }
                                             this.privilegeMgPage = new privilegeManager({
                                                 "container":".main_bd"
                                             });
                                         }
                                     }
                                 }
                             });
                             $("#authority_manage").click();
                         }else if (id == "product_manage") {//商品列表
	                            var proMan_Array = ["smart_vending_product_list"];
	                            if (this.payStyleMg) {
	                                this.payStyleMg.destroy();
	                            }
	                            this.payStyleMg = new statusMg({
	                                "container": "#col_slide_main",
	                                "lis": proMan_Array,
	                                "events": {
	                                    click: function(id) {
	                                        $(".main_bd").empty();
	                                        
	                                        $("#user-content").scrollTop(0);
	                                        if (id == "smart_vending_product_list") {//列表
	                                            if (this.product_listPage) {
	                                                this.product_listPage.destroy();
	                                            }
	                                            this.product_listPage = new pro_Mg({
	                                                "container": ".main_bd"
	                                            });
	                                        }
	                                    }
	                                }
	                            });
	                            $("#smart_vending_product_list").click();
	                        }else if (id == "model_list") {//机型列表
	                            var alarm_Array = ["smart_vending_model_list","undo_model_list"];
	                            if (this.payStyleMg) {
	                                this.payStyleMg.destroy();
	                            }
	                            this.payStyleMg = new statusMg({
	                                "container": "#col_slide_main",
	                                "lis": alarm_Array,
	                                "events": {
	                                    click: function(id) {
	                                        $(".main_bd").empty();
	                                        $("#user-content").scrollTop(0);
	                                        if (id == "smart_vending_model_list") {  //  机型
	                                            $("li").css("margin-top", "0px");
	                                            if (this.automat_add) {
	                                                this.automat_add.destroy();
	                                            }
	                                            if (this.automat_set) {
	                                                this.automat_set.destroy();
	                                            }
	                                            if (this.automat_lists) {
	                                                this.automat_lists.destroy();
	                                            }
	                                            this.automat_set = new automat_model({
	                                                "container": ".main_bd"
	                                            });
	                                        }else if(id == "undo_model_list"){
	                                        	 $("li").css("margin-top", "0px");
		                                            if (this.model_set) {
		                                                this.model_set.destroy();
		                                            }
		                                            this.model_set = new undo_model({
		                                                "container": ".main_bd"
		                                            });
	                                        }
	                                    }
	                                }
	                            });
	                            $("#smart_vending_model_list").click();
	                        }else if(id == "log"){//日志
                			 var operating_log_Array=["operating_log"];
                			 if(this.payStyleMg){
             					this.payStyleMg.destroy();
             			     }
                			 this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":operating_log_Array,
                                 "events": {
                					 click: function(id){
                						 $(".main_bd").empty();
                						 $("#user-content").scrollTop(0);
                  						 if(id == "operating_log"){//操作日志
                  							if(this.operating_logMgPage){
                            					this.operating_logMgPage.destroy();
                            			     }
                 							 this.operating_logMgPage = new operating_log_Mg({
                 								"container":".main_bd"
                 							 });
                  						 }
                					 }
                                 }
                			 });
                			 $("#operating_log").click();
                		 }else if(id == "automat_area_manage"){//区域
                			 var role_manager_array = ["area_list"];
                			 if(this.payStyleMg){
              					this.payStyleMg.destroy();
              			     }
                			 this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":role_manager_array,
                                 "events": {
                					 click: function(id){
                						 $(".main_bd").empty();
                						 $("#user-content").scrollTop(0);
                  						 if(id == "area_list"){//配置项
                  							if(this.areaMgPage){
                            					this.areaMgPage.destroy();
                            			     }
                 							 this.areaMgPage = new areaManager({
                 								"container":".main_bd"
                 							 });
                  						 }
                					 }
                                 }
                			 });
                			 $("#area_list").click();
                		 }else if(id == "sys_card"){//胸牌
                			 var card_manager_array = ["sys_card_list","prePaidCard_set"];
                			 if(this.payStyleMg){
              					this.payStyleMg.destroy();
              			     }
                			 this.payStyleMg=new statusMg({
                                 "container":"#col_slide_main",
                                 "lis":card_manager_array,
                                 "events": {
                					 click: function(id){
                						 $(".main_bd").empty();
                						 $("#user-content").scrollTop(0);
                  						 if(id == "sys_card_list"){
                  							if(this.cardMgPage){
                            					this.cardMgPage.destroy();
                            			     }
                 							 this.cardMgPage = new cardManager({
                 								"container":".main_bd"
                 							 });
                  						 }else  if(id == "prePaidCard_set"){//配置项
                  							 if(this.cardSetPage){
                             					this.cardSetPage.destroy();
                             			     }
                  							 this.cardSetPage = new cardSet_Mg({
                  								"container":".main_bd"
                  							 });
                   						 }
                					 }
                                 }
                			 });
                			 $("#sys_card_list").click();
                		 }else if(id == "facebook"){//facebook
                			 var facebook_Array=["facebook_set"];
                			 if(this.payStyleMg){
               					this.payStyleMg.destroy();
               			     }
							 this.payStyleMg=new statusMg({
								 "container":"#col_slide_main",
								 "lis":facebook_Array,
								 "events": {
									 click: function(id){
										 if(id == "facebook_set"){
											 $(".main_bd").empty();
											 $("#user-content").scrollTop(0);
	              							 if(this.facebookMge){
	                        					this.facebookMge.destroy();
	                        			     }
	              							if(this.cardMgPage){
                            					this.cardMgPage.destroy();
                            			     }
	             							 this.facebookMge = new facebookMge({
	             								"container":".main_bd"
	             							 });
										 }
									 }
								 }
							 });
							 $("#facebook_set").click();
						 }else if(id == "oid_list"){//机构管理
							 var oid_Array=["oid_all_list"];
                			 if(this.payStyleMg){
               					this.payStyleMg.destroy();
               			     }
							 this.payStyleMg=new statusMg({
								 "container":"#col_slide_main",
								 "lis":oid_Array,
								 "events": {
									 click: function(id){
										 if(id == "oid_all_list"){
											 $(".main_bd").empty();
											 $("#user-content").scrollTop(0);
	              							 if(this.oidMge){
	                        					this.oidMge.destroy();
	                        			     }
	             							 this.oidMge = new oidManagement({
	             								"container":".main_bd"
	             							 });
										 }
									 }
								 }
							 });
							 $("#oid_all_list").click();
						 }
                         /*else if(id == "ad_publish"){//广告投放
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
                         }*/
                	 }
				 }
			 });
		}
	
	});
	return systemMenu;
});