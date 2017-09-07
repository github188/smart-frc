define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../template/tableTemplate");
    var html = require("text!./operationMenu.html");
    var statusMg = require("../template/menu");
    //var time_status_dayMg = require("./status/time_status/statistics/statistics"); 
    var time_status_dayMg = require("./status/statistics/statistics");
    var alarm_listMg = require("./status/alarm/list/list");//告警------列表
    var alarm_historyMg = require("./status/alarm/history/history");//告警------历史记录
    var automat_lists = require("./vendingMachine/list");//售货机管理------列表
    var another_automat_lists= require("./vendingMachine/listFlag");//售货机状态转换------列表
    var template_Mg = require("./channelTemplate/list");//料道模板
    var automat_model = require("./model/list"); //售货机管理-----机型
    var automat_add = require("./automat/automat_manage/group/group");//售后机管理------分组
    var automat_site_lists = require("./automat/automat_site_manage/siteList");   //点位管理  -- 点位列表 
    var dispatching_manage_staff = require("./dispatching/manage/staff/staff");   //配送---管理 -- 人员
    var dispatching_manage_share = require("./dispatching/manage/share/share");   //配送---管理----分配
    var dispatching_record_lists = require("./dispatching/record/list/list");   //配送---记录---列表
    var Replenishment = require("./replenishment/goods/replenishment");//商品补货
    var DeviceReplenishment = require("./replenishment/device/deviceReplenishment");//售货机补货
    var pro_Mg = require("../products_manage/product/list/list");
    var proType_Mg = require("../products_manage/product_type/list/list");
    var under_way_Mg = require("../products_manage/promotion/underWay/list");
    var end_Mg = require("../products_manage/promotion/end/list");
    var tradeMg = require("../trade_manage/tradeDetail/list/list");
    var codeMg = require("./code/list");
    
    var settleMg = require("./settle/list");
    var nosettleMg = require("./settle/nolist");
    
    var flowStat = require("../reports/flow/flowList/content");
    var flowChart = require("../reports/flow/chart/content");
    var replenishmentRecord = require("./replenishment/record/list");
    var reconciliationRecord = require("./replenishment/reconciliation/list");
    
    var replenishStatement = require("./replenishment/statement/list");
    
    var replenishmentRecordOld = require("./replenishment/recordold/list");
    var replenishPlan = require("./replenishment/plan/list");
    
    var salesVolumeRecord = require("./replenishment/salesvolume/list");
    var area_Mg = require("./area/list");
    var line_Mg = require("./line/list");
    var upgradementRecord = require("./deviceUpgrade/list");//远程升级
    var dominateInboxList = require("./inboxMan/control/inboxList");//远程升级
    var dictionary_Mg = require("./dictionary/list");//字典维护
    var loadSubNav = require("../loadSubNav");
    var Service = require("./service");
    var operationMenu = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.service = options.service;
            this.element.html(html);
            this.elements = {
                conent_el: "content-operation-menu"
            };
            this._render();

        },
        _render: function() {
            this.renderContent();
           /* if(permission.app("automat_alarm").read){//判断是否有查看告警列表权限
            	this.renderAlarmTips();
                var self = this;
                var timer = setInterval(function(){
                	
                	if(!$("#nav-main-left-app-operation").hasClass("header-icon-on")){//判断是否离开"运维"页面
                		clearInterval(timer);//清除任务
                	}else{
                		self.renderAlarmTips();
                	}

                },120000);
            }*/
            
        },
       renderAlarmTips: function(){
    	   
    	   var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
           var roleType = permission.getInfo().roleType;
           Service.getLinesByUserId(userId,function(linedata){
                var lineIds=[];
                if(linedata.result && linedata.result.length>0){
	    			  for(var i=0;i<linedata.result.length;i++){
	    				  lineIds.push(linedata.result[i]._id);
	    			  }
                }
                if(roleType == 51){
               	 lineIds = [];
                 }
                if(roleType != 51 && lineIds.length == 0){
               	    lineIds = ["000000000000000000000000"];
	            }

	           	Service.getAlarmList(0, -1,0,2,null,null, "",null,lineIds,"1",function(data) {
	     				
	     				var total = data.total;
	     				
	     				if(total > 0){
	     					if(total > 99){
	         					total = "...";
	         				}
	     					$("#automat_alarm").html("");
	     		            $("#automat_alarm").append("<div style=' width:18px; height:18px; background-color:#F00; border-radius:25px;margin-left:40px;float:left;margin-top: 0px;'><span style='height:18px; line-height:18px; display:block;  font-size: 12px; color:#FFF; text-align:center'>"+total+"</span></div>");
	     		            $("#automat_alarm").append("<div style='margin-left:60px;'><a style='padding: 0 0 0 3px;'>事件列表</a></div>");
	     					
	     				}
	     		});
                
           });
    	   
       },
        renderContent: function() {
//            //状态
//            var dl2 = {};
//            dl2.dt = "status";
//            dl2.dd = [["automat_alarm", true]];
//            //售货机管理 ["channel_template", true], 
//            var dl1 = {};
//            dl1.dt = "manager";
//            dl1.dd = [["automat_list", true],["regional_management", true],["line_management", true],["automat_site_manager",true],["model_list", true],["channel_template", true], ["product_manage", true]];//,["product_type_management", true]["model_list", true],["products_activity",true] //促销管理
//            //交易
//            var dl3 = {};
//            dl3.dt = "auto_trade";
//            dl3.dd = [["automat_trade_detail", true], ["trade_claim_number", true]];
//            //补货
//            var dl4 = {};
//            dl4.dt = "replenishment_management";
//            dl4.dd = [["replenishment_record", true], ["reconciliation_man", true], ["sales_volume", true]];
//
//            //设备管理
//            var dl5 = {};
//            dl5.dt = "auto_device_management";
//            dl5.dd = [["automat_dominate", true],["automat_promote", true]];
//
//            //根据权限判断，是否授权入口
//            var statusAuth = permission.app("_status");
//            var dls = [];
//            dls.push(dl1);
//            dls.push(dl3);
//            dls.push(dl5);
//            if (statusAuth.read) {
//                dls.push(dl2);
//            }
//            dls.push(dl4);
           
        	var dls =loadSub('operation');

            this.left = new Table({
                selector: "#content-operation-menu",
                dl: dls,
                events: {
                    click: function(id) {
                        if (id == "real_time_status") {//实时状态 
                            var status_Array = ["automat_day"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": status_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "automat_day") {//当天
                                            if (this.historyPage) {
                                                this.historyPage.destroy();
                                            }
                                            if (this.dayPage) {
                                                this.dayPage.destroy();
                                            }
                                            this.dayPage = new time_status_dayMg({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#automat_day").click();
                        } else if (id == "automat_alarm") {//告警 "automat_history"
                            var alarm_Array = ["automat_alarmlist"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": alarm_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "automat_alarmlist") {//告警列表
                                            if (this.alarm_listPage) {
                                                this.alarm_listPage.destroy();
                                            }
                                            this.alarm_listPage = new alarm_listMg({
                                                "container": ".main_bd"
                                            });
                                        } else if (id == "automat_history") {//告警历史记录
                                            if (this.automat_historyPage) {
                                                this.automat_historyPage.destroy();
                                            }
                                            this.automat_historyPage = new alarm_historyMg({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#automat_alarmlist").click();
                        } else if (id == "automat_replenishment") {//补货
                            var replenishment_Array = ["replenishment_details", "replenishment_device_details"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": replenishment_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (this.replenishment_lists) {
                                            this.replenishment_lists.destroy();
                                        }
                                        if (this.replenishment_device_lists) {
                                            this.replenishment_device_lists.destroy();
                                        }
                                        if (id == "replenishment_details") {
                                            this.replenishment_lists = new Replenishment({
                                                "container": ".main_bd"
                                            });
                                        } else if (id == "replenishment_device_details") {
                                            this.replenishment_device_lists = new DeviceReplenishment({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#replenishment_details").click();
                        }else if(id=="automat_site_manager"){
                            var alarm_Array = ["site_list"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": alarm_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "site_list") {
                                            if (this.site_lists) {
                                                this.site_lists.destroy();
                                            }
                                            this.site_lists = new automat_site_lists({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#site_list").click();
                        }else if (id == "automat_list") {//售货机列表
                        	var listFlag = true;
                            var alarm_Array = ["smart_vending_list","unsmart_vending_list"];//,"smart_vending_status_list"
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": alarm_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
	                                    if(document.getElementById("shu")) { 
	                                    	$("#shu").remove();
	                                    }
	                                   
	                                    var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
	                                    var roleType = permission.getInfo().roleType;
	                                    Service.getLinesByUserId(userId,function(linedata){
	                                    	var lineIds = [];
	                                    	if(linedata && linedata.result && linedata.result.length>0){
	                                    		for(var i=0;i<linedata.result.length;i++){
	                                    			lineIds.push(linedata.result[i]._id);
	                                    		}
	                                    	}
	                                    	if(roleType == 51){
	               		                	 lineIds = [];
	               		                  }
	                                    	if(roleType != 51 && lineIds.length == 0){
	                       	                    lineIds = ["000000000000000000000000"];
	                       	                }
	                                        	 
                                        	 Service.getCount({"lineId":lineIds},function(data){
 		                                        var insertHtml="<div id='shu' style='float:right;margin-right:10px;'>"+
 		                                        "<div style='float: left; margin-top: 5px;'><img id='sum' src='./operation_manage/images/4.png' style='width:15px;height:20px'/></div>"+
 		                        				"<div style='float: left; margin-left: 5px;'><label>"+locale.get('total')+"</label><label>"+data.count+"</label></div>"+
 		                        				 "<div style='float: left; margin-top: 5px; margin-left: 10px;'><img id='sum' src='./operation_manage/images/1.png' style='width:15px;height:20px'/></div>"+
 		                        				"<div style='float: left;margin-left: 5px;'><label style='color:green;'>"+locale.get('online')+"：</label><label>"+data.countOnline+"</label></div>"+
 		                        				 "<div style='float: left; margin-top: 5px;margin-left: 10px;'><img id='sum' src='./operation_manage/images/2.png' style='width:15px;height:20px'/></div>"+
 		                        				"<div style='float: left;margin-left: 5px;'><label style='color:grey;'>"+locale.get('offline')+"：</label><label>"+data.countOffline+"</label></div>"+
 		                        				"</div>";
 		                                        $("#all").append(insertHtml); 
 	                                        });
	                                    	
	                                    })
                                        
                                        //添加切换视图按钮
//                                        if(document.getElementById("smartReset")) { 
//                                           $("#smartReset").remove();
//                                        }
//                                        var languge = localStorage.getItem("language");
//                                        if (languge == "en") {
//                                        	$("#smart_vending_list").append("<div id='smartReset' style='margin-top:-48px; margin-left:200px'>"+
//                                 					"<a id='resetBtn' class='cloud-button cloud-button-icon-only' title=''>"+
//                                 						"<i class='cloud-button-item cloud-button-img cloud-icon-reset cloud-icon-default'></i>"+
//                                 					"</a></div>");
//                                        }else{
//                                        	$("#smart_vending_list").append("<div id='smartReset' style='margin-top:-48px; margin-left:150px'>"+
//                                 					"<a id='resetBtn' class='cloud-button cloud-button-icon-only' title=''>"+
//                                 						"<i class='cloud-button-item cloud-button-img cloud-icon-reset cloud-icon-default'></i>"+
//                                 					"</a></div>");
//                                        }
                                        
                                        //给切换视图按钮绑定事件
//                                        $("#smartReset").bind("click", function() {
//                                       	    if(listFlag){
//                                       	    	listFlag=false;
//                                       	    }else{
//                                       	    	listFlag=true;
//                                       	    }
//                                        });
                                        if (id == "smart_vending_list") {
                                        	if (this.automat_lists) {
                                                this.automat_lists.destroy();
                                            }
                                        	if(listFlag){
                                        		this.automat_lists = new automat_lists({
                                                    "container": ".main_bd"
                                                });
                                        	}else{
                                        		 this.automat_lists = new another_automat_lists({//售货机状态转换
                                                     "container": ".main_bd"
                                                 });
                                        	}
                                                     
                                        }else if(id == "unsmart_vending_list"){
                                        	if (this.automat_lists) {
                                                this.automat_lists.destroy();
                                            }
                                            this.automat_lists = new automat_lists({
                                                "container": ".main_bd",
                                                 onlineType:1            //未认证售货机列表
                                            });
                                        }
//                                        else if(id == "smart_vending_status_list"){
//                                        	 if (this.automat_lists) {
//                                                 this.automat_lists.destroy();
//                                             }
//                                        	 this.automat_lists = new another_automat_lists({//售货机状态转换
//                                                 "container": ".main_bd"
//                                             });
//                                        }
                                    }
                                }
                            });
                            $("#smart_vending_list").click();
                        }else if(id == "regional_management"){//区域管理
                        	var areaMan_Array = ["automat_area_manage"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": areaMan_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "automat_area_manage") {//区域列表
                                            if (this.area_listPage) {
                                                this.area_listPage.destroy();
                                            }
                                            this.area_listPage = new area_Mg({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#automat_area_manage").click();
                        }else if(id == "line_management"){//线路管理
                        	var lineMan_Array = ["line_man_list"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": lineMan_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "line_man_list") {//线路列表
                                            if (this.line_listPage) {
                                                this.line_listPage.destroy();
                                            }
                                            this.line_listPage = new line_Mg({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#line_man_list").click();
                        }else if (id == "channel_template") {//料道模板
                            var proMan_Array = ["channel_template_list"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": proMan_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "channel_template_list") {//列表
                                            if (this.template_listPage) {
                                                this.template_listPage.destroy();
                                            }
                                            this.template_listPage = new template_Mg({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#channel_template_list").click();
                        } else if (id == "product_manage") {//商品列表
                            var proMan_Array = ["smart_vending_product_list"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
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
                        }else if (id == "product_type_management") {//商品类型列表
                        	
                            var proTypeMan_Array = ["smart_vending_product_type_list"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": proTypeMan_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "smart_vending_product_type_list") {//列表
                                            if (this.productType_listPage) {
                                                this.productType_listPage.destroy();
                                            }
                                            this.productType_listPage = new proType_Mg({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#smart_vending_product_type_list").click();
                        } else if (id == "model_list") {//机型列表
                            var alarm_Array = ["smart_vending_model_list"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
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
                                        }
                                    }
                                }
                            });
                            $("#smart_vending_model_list").click();
                        } else if (id == "products_activity") {
                            var priceMan_Array = ["product_under_way", "product_end"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": priceMan_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "product_under_way") {//进行中
                                            if (this.under_way_listPage) {
                                                this.under_way_listPage.destroy();
                                            }
                                            this.under_way_listPage = new under_way_Mg({
                                                "container": ".main_bd"
                                            });
                                        } else if (id == "product_end") {//已结束
                                            if (this.end_listPage) {
                                                this.end_listPage.destroy();
                                            }
                                            this.end_listPage = new end_Mg({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#product_under_way").click();
                        }  
                        else if(id == "dictionary_maintenance"){//字典维护
                            var maintenance_array = ["smart_dictionary_maintenance_list"];
                            if(this.statusMg){
                                this.statusMg.destroy();
                            }
                            this.statusMg=new statusMg({
                                "container":"#col_slide_main",
                                "lis":maintenance_array,
                                "events": {
                                    click: function(id){
                                   	 $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if(id == "smart_dictionary_maintenance_list"){//字典维护

                                            if(this.dictionaryPage){
                                                this.dictionaryPage.destroy();
                                            }
                                            this.dictionaryPage = new dictionary_Mg({
                                                "container":".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#smart_dictionary_maintenance_list").click();
                        }
                        else if (id == "automat_trade_detail") {
                            var proMan_Array = ["trade_list"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": proMan_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "trade_list") {//列表
                                            if (this.trade_list) {
                                                this.trade_list.destroy();
                                            }
                                            this.trade_list = new tradeMg({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#trade_list").click();
                        } else if (id == "trade_claim_number") {//取货码
                            var proMan_Array = ["code_list"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": proMan_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "code_list") {//列表
                                            if (this.code_list) {
                                                this.code_list.destroy();
                                            }
                                            this.code_list = new codeMg({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#code_list").click();

                        }else if (id == "settle_management") {//结算
                            var proMan_Array = ["settle_list"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": proMan_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "settle_list") {//列表
                                            if (this.settle_list) {
                                                this.settle_list.destroy();
                                            }
                                            this.settle_list = new settleMg({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#settle_list").click();

                        }else if (id == "not_settle_management") {//结算
                        	
                            var proMan_Array = ["not_settle_list"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": proMan_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "not_settle_list") {//列表
                                            if (this.nosettle_list) {
                                                this.nosettle_list.destroy();
                                            }
                                            this.nosettle_list = new nosettleMg({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#not_settle_list").click();

                        }
                        else if (id == "traffic_statistics") {//流量统计
                            var flow_manager_array = ["traffic_statistics_reports", "traffic_statistics_curve"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": flow_manager_array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "traffic_statistics_reports") {//配置项
                                            if (this.flowStatMgPage) {
                                                this.flowStatMgPage.destroy();
                                            }
                                            this.flowStatMgPage = new flowStat({
                                                "container": ".main_bd"
                                            });
                                        }
                                        else if (id == "traffic_statistics_curve") {//配置项
                                            if (this.flowChartMgPage) {
                                                this.flowChartMgPage.destroy();
                                            }
                                            this.flowChartMgPage = new flowChart({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#traffic_statistics_reports").click();
                        } else if(id == "automat_promote"){//升级
                        	var upgrade_manager_array = ["upgrade_list"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": upgrade_manager_array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "upgrade_list") {
                                            if (this.upgradementList) {
                                                this.upgradementList.destroy();
                                            }
                                            this.upgradementList = new upgradementRecord({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#upgrade_list").click();
                        }else if(id == "automat_dominate"){//远程控制
                        	 var flow_manager_array = ["automat_dominate_list"];
                             if (this.statusMg) {
                                 this.statusMg.destroy();
                             }
                             this.statusMg = new statusMg({
                                 "container": "#col_slide_main",
                                 "lis": flow_manager_array,
                                 "events": {
                                     click: function(id) {
                                         $(".main_bd").empty();
                                         $("#user-content").scrollTop(0);
                                         if (id == "automat_dominate_list") {
                                             if (this.dominateList) {
                                                 this.dominateList.destroy();
                                             }
                                             this.dominateList = new dominateInboxList({
                                                 "container": ".main_bd"
                                             });
                                         }
                                     }
                                 }
                             });
                             $("#automat_dominate_list").click();
                            
                        } else if (id == "replenishment_record") {//补货记录
                            var flow_manager_array = ["replenishment_record_list"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": flow_manager_array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "replenishment_record_list") {
                                            if (this.replenishmentList) {
                                                this.replenishmentList.destroy();
                                            }
                                            this.replenishmentList = new replenishmentRecord({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#replenishment_record_list").click();
                        } else if (id == "replenish_statement") {//对账
                            var flow_manager_array = ["replenish_statement_list"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": flow_manager_array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "replenish_statement_list") {
                                            if (this.replenishmentList) {
                                                this.replenishmentList.destroy();
                                            }
                                            this.replenishStatementList = new replenishStatement({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#replenish_statement_list").click();
                        }else if (id == "replenishment_record_old") {//补货记录
                            var flow_manager_array = ["replenishment_record_list"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": flow_manager_array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "replenishment_record_list") {
                                            if (this.replenishmentListOld) {
                                                this.replenishmentListOld.destroy();
                                            }
                                            this.replenishmentListOld = new replenishmentRecordOld({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#replenishment_record_list").click();
                        }else if (id == "replenish_status") {//库存状态
                            var flow_manager_array = ["replenish_status_list"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
	                            "container": "#col_slide_main",
	                            "lis": flow_manager_array,
	                            "events": {
	                                click: function(id) {
	                                    $(".main_bd").empty();
	                                    $("#user-content").scrollTop(0);
	                                    if (id == "replenish_status_list") {
	                                        if (this.reconciliationList) {
	                                            this.reconciliationList.destroy();
	                                        }
	                                        this.reconciliationList = new reconciliationRecord({
	                                            "container": ".main_bd"
	                                        });
	                                    }
	                                }
	                            }
                            });
                            $("#replenish_status_list").click();
                        }else if (id == "replenish_plan") {//补货计划
                            var flow_manager_array = ["replenish_plan_list"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
	                            "container": "#col_slide_main",
	                            "lis": flow_manager_array,
	                            "events": {
	                                click: function(id) {
	                                    $(".main_bd").empty();
	                                    $("#user-content").scrollTop(0);
	                                    if (id == "replenish_plan_list") {
	                                        if (this.replenishplanList) {
	                                            this.replenishplanList.destroy();
	                                        }
	                                        this.replenishplanList = new replenishPlan({
	                                            "container": ".main_bd"
	                                        });
	                                    }
	                                }
	                            }
                            });
                            $("#replenish_plan_list").click();
                        }else if(id == "sales_volume"){//销量
                        	var flow_manager_array = ["sales_volume_list","sales_volume_list_history"];
                            if (this.statusMg) {
                                this.statusMg.destroy();
                            }
                            this.statusMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": flow_manager_array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "sales_volume_list") {
                                            if (this.salesVolumeList) {
                                                this.salesVolumeList.destroy();
                                            }
                                            this.salesVolumeList = new salesVolumeRecord({
                                                "container": ".main_bd",
                                                type:0
                                            });
                                        }else if(id == "sales_volume_list_history"){
                                        	 if (this.historysalesVolumeList) {
                                                 this.historysalesVolumeList.destroy();
                                             }
                                             this.historysalesVolumeList = new salesVolumeRecord({
                                                 "container": ".main_bd",
                                                 type:1
                                             });
                                        }
                                    }
                                }
                            });
                            $("#sales_volume_list").click();
                        }
                    }
                }
            });
        }

    });
    return operationMenu;
});