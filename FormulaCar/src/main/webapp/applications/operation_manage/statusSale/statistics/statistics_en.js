define(function(require) {
    var cloud = require("cloud/base/cloud");
    var Button = require("cloud/components/button");
    var validator = require("cloud/components/validator");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/resources/css/jquery.multiselect.css");
    var html = require("text!./statistics.html");
    var NoticeBar=require("./notice-bar");
    require("./css/default.css");
    var TimeTable = require("./table/timeContent");
    var TradeTable = require("./table/tradeContent");
    var DashBoard = require("../../../components/dashweight/dashboard");
    require("cloud/components/chart");
    var Service = require("./service");
    require("../../../trade_manage/statistics/css/style.css");
    var trade = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.payId = null;
            this.elements = {
        		bar : {
					id : "statistics_bar",
					"class" : null
				},
                head: {
                    id: "tradeHead",
                    "class": null
                }
                
            };
                        
            this.element.html(html);
            locale.render({element: this.element});
            
		    $("#payAmount").mouseover(function (){
		    	$("#payAmount").css("opacity","0.6");
		    	$("#payAlert").css("display","block");
			}).mouseout(function (){
				$("#payAmount").css("opacity","1");
				$("#payAlert").css("display","none");
			});
		    
		    $("#paySum").mouseover(function (){
		    	$("#paySum").css("opacity","0.6");
		    	$("#payAlertSum").css("display","block");
			}).mouseout(function (){
				$("#paySum").css("opacity","1");
				$("#payAlertSum").css("display","none");
			});
		    
            this._render();
        },
        _render: function() {
            //this.getAssetIdOfLine();
        	$("#trade").css("width",$(".wrap").width());
			$("#statistics_bar").css("width",$(".wrap").width());
			
			$("#trade").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#trade").height();
		    var barHeight = $("#statistics_bar").height()*2;
			var tableHeight=listHeight - barHeight;
			$("#trade_detail_table").css("height",tableHeight);
        	this.renderHtml();
        	this._renderNoticeBar();
        	
        	localStorage.setItem("contentHeight",$("#col_slide_main").height());
        	//$("#trade").css("height",($("#col_slide_main").height() - $(".main_hd").height() -35));
        	
			$("#statistics_tabs").tabs();
			$("#tabs-time").click(function(){
				$("#time_detail_table").css("height",$("#trade_sta_list_table-table").height()+$("#trade_sta_list_paging").height());
			});
			$("#tabs-trade").click(function(){
				$("#trade_detail_table").css("height",$("#trade_list_table-table").height()+$("#trade_list_paging").height());
			});
			//$("#trade_detail_table").css("height",10+$("#trade_list_table-table").height()+$(".paging-page-box").height());
            //this.getPayStyleList();

			
			
        },
        _renderNoticeBar:function(){ 
        	 var self=this;
        	 var noticeBar = new NoticeBar({
        		 selector: $("#statistics_bar"),
        		 events:{
        			 query: function(){

                         self.executeSearch(function(startTime, endTime, assetId) {
                             var selectedId = $("#reportType").find("option:selected").val();
                             if (selectedId == "1") {
                                 self.getEveryDay(startTime, endTime, assetId);
                                 //self.tradeTable.setDataTable(startTime, endTime, assetId);
                             } else if (selectedId == "2") {
                                // self.getEveryMonth(startTime, endTime, assetId);
                                self.getCustomDay(startTime, endTime, assetId);
                                 //self.tradeTable.setDataTable(startTime, endTime, assetId);
                             } else if (selectedId == "3") {
                                 self.getEveryYear(startTime, endTime, assetId);
                                 //self.tradeTable.setDataTable(startTime, endTime, assetId);
                             }else if (selectedId == "4") {
                                 self.getCustomDay(startTime, endTime, assetId);
                                 //self.tradeTable.setDataTable(startTime, endTime, assetId);
                             }
                         });
                     
        			 },
        			 exReport: function(){

	                        self.executeSearch(function(start, end, assetId) {
	                            var language = locale._getStorageLang() === "en" ? 1 : 2;
	                            var host = cloud.config.FILE_SERVER_URL;
	                            var time = Date.parse(new Date())/1000;
	                            //var now = time;
	                            var reportName = "report.xlsx";
	                            var path = "/home/statistic/"+time+"/"+reportName;
	                            var url = host + "/api/vmreports/getTradeExcel?report_name=" + reportName + "&path=" + path + "&access_token=" + cloud.Ajax.getAccessToken();
	                            /*var url = host + "/api/vmreports/trade/summary?access_token=" + cloud.Ajax.getAccessToken();
	                            var parameter = "";
	                            if (start != null && end != null) {
	                                parameter = "&startTime=" + start + "&endTime=" + end;
	                            } 
	                            if (assetId != null) {
	                                parameter += "&assetIds=" + assetId;
	                            }
	                            parameter += "&time=" + time;*/
	                            
	                            var areaId = $("#userarea").multiselect("getChecked").map(function() {//
	                                return this.value;
	                            }).get();
	                            var lineId = $("#userline").multiselect("getChecked").map(function() {//
	                                return this.value;
	                            }).get();
	                            var lineFlag = 1;
	                            if(areaId.length != 0){
	                            	if($("#userline").find("option").length <=0){
	                                	lineFlag = 0;
	                                }
	                            }
	                            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
	                            var roleType = permission.getInfo().roleType;
	                            Service.getAreaByUserId(userId,function(areadata){
                                    
	                            	var areaIds=[];
	                                if(areadata && areadata.result && areadata.result.area && areadata.result.area.length>0){
	                                	areaIds = areadata.result.area;
	                                }
	                                
                                    if(roleType == 51){
                                    	areaIds = [];
	                                }
	                                if(areaId.length != 0){
	                                	areaIds = areaId;
	                                }
	                                
	                                if(roleType != 51 && areaIds.length == 0){
	                                	areaIds = ["000000000000000000000000"];
	                                }
	                                
	                                cloud.Ajax.request({
	                	   	    	      url:"api/automatline/list",
	                			    	  type : "GET",
	                			    	  parameters : {
	                			    		  areaId: areaIds,
	                			    		  cursor:0,
	                			    		  limit:-1
	                	                  },
	                			    	  success : function(linedata) {
	                			    		 var lineIds=[];
	                			    		 if(linedata && linedata.result && linedata.result.length>0){
	                			    			  for(var i=0;i<linedata.result.length;i++){
	                			    				  lineIds.push(linedata.result[i]._id);
	                			    			  }
	                		                 }
	                			    		 if(roleType == 51 && areaId.length == 0){
	               			    			     lineIds = [];
		               			              }
		               			    		  if(lineId.length != 0){
		               			    			  lineIds = lineId;
		               			    		  }else{
		               			    			  if(lineFlag == 0){
		               			    				  lineIds = ["000000000000000000000000"];
		               			    			  }
		               			    		  }
		               			    		  
		               			    		  if(roleType != 51 && lineIds.length == 0){
		               			    			   lineIds = ["000000000000000000000000"];
		               			    		  }
	                			             self.lineIds = lineIds;
	                			             var uid = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
	                	                     var userName= cloud.storage.sessionStorage("accountInfo").split(",")[2].split(":")[1];
	                	                     var language = locale._getStorageLang() === "en" ? 1 : 2;  
			                                 Service.createStatisticExcel(uid,userName,start,end,time,assetId,lineIds,language,"report.xlsx",function(data){
			                                 	
			                                	 if(data.status == "doing" && data.operation == "export"){
			                                 		dialog.render({lang: "export_large_task"});
			                                 	 }else if(data.status == "failure" && data.operation == "export"){
			                                 		dialog.render({lang: "export_large_task_exit"});
			                                 	}else{ 
			                                 		
			                                 		var len = $("#buttonDiv").find("a").length;
			                                 		var id = $("#buttonDiv").find("a").eq(len-1).attr("id");
			                                 		$("#"+id).html("");
			                                 		if(document.getElementById("bexport")!=undefined){
			                                 			$("#bexport").show();
			                                 		}else{
			                                 			$("#"+id).after("<span style='margin-left:6px;' id='bexport'>"+locale.get({lang:"being_export"})+"</span>");
			                                 		}
			                                 		$("#"+id).hide();
			                                 		
			                                 		var timer = setInterval(function(){
			                                         	
			                                         	Service.findTradeExcel(time,"report.txt",function(data){
			                                         	
			                                         		if(data.onlyResultDTO.result.res == "ok"){
			                                         			
			                                         			cloud.util.ensureToken(function() {
			         					                            window.open(url, "_self");
			         					                        });
			                                         			clearInterval(timer);
			                                         			$("#"+id).html("");
			                                         			if($("#bexport")){
			                                         				$("#bexport").hide();
			                                         			}
			                                             		$("#"+id).append("<span class='cloud-button-item cloud-button-text'>"+locale.get({lang:"role_e"})+"</span>");
			                                             		$("#"+id).show();
			                                         		}
			                                         	})
			                 					               
			                 				            
			                 							
			                 						},5000);
			                                 	}
			                                 	
			                                 });
	                			    	}
	                                });
	                               
	                            });
	                        });
	                    
					  }
        		 	}
				});
		},
        getPayStyleList: function(){
        	var self = this;
        	var languge = localStorage.getItem("language");
        	if(languge == "en"){
        		$("#swingCard").css("margin-left","93px");
        		$("#pos").css("margin-left","46px");
        		$("#oneCard").css("margin-left","46px");
        		$("#baifubao").parent().find('label').css("margin-left","-80px");
        		$("#baifubao").css("margin-left","8px");
        		$("#soundWave").parent().find('label').css("margin-left","-90px");
        		$("#soundWave").css("margin-left","46px");
        		$("#game").css("margin-left","113px");
        	}
//        	Service.getPayList(function(data) {
//
////                self.payId = data.result._id;
//                var payList = data.result.payStyle;
//                if(payList.length > 0){
//                	for(var i=0;i<payList.length;i++){
//                    	var paystyle = payList[i];
//                    	$("#"+paystyle).val(1);
//                    	$("#"+paystyle).attr("checked",true);
//                    	
//                    }
//                }
//
//            });
        	
        },
        getAssetIdOfLine: function() {
            var self = this;
            $("#trade").mask();
            Service.getAssetIdInfoByline(function(data) {
                var lineData = data; 
                self.renderHtml();

            });
        },
        renderHtml: function() {
/*            $("#reportType").append("<option value='1' selected='selected'>" + locale.get({lang: "daily_chart"}) + "</option>");
            $("#reportType").append("<option value='2'>" + locale.get({lang: "monthly_report"}) + "</option>");
            $("#reportType").append("<option value='3'>" + locale.get({lang: "year_report"}) + "</option>");
            $("#reportType").append("<option value='4'>" + locale.get({lang: "custom_report"}) + "</option>");
            $("#summary_month").val("");
            $("#summary_year").val("");
            $("#trade").unmask();*/

            this.renderEvent();
            //this.renderSelect();
            this.loadData();
        },
        renderEvent: function() {
            var self = this;
            $("#payStylelist").mouseover(function (){
		    	$("#payStylelist").css("opacity","1");
			}).mouseout(function (){
				$("#payStylelist").css("opacity","0.8");
			});
            $("#payStylelist").bind('click',function(){
            	
            	var bh = $("body").height(); 
        		var bw = $("body").width(); 
        		$("#fullbg").css({ 
        		height:bh, 
        		width:bw, 
        		display:"block" 
        		}); 
        		$("#dialog").show();
            	
            });
            $("#product-config-save").bind('click',function(){
            	
            	var payStyle = [];

            	$("#payList_div input").each(function(){
            	    if ($(this).is(':checked')) {
            	    	payStyle.push($(this).attr("id"));
            	    } 

            	});
            	var paydata = {
            			payStyle:payStyle
            	}

            	if(self.payId != null){
            		Service.updatePayList(self.payId,paydata,function(data) {
                		if (data.error_code == null && data.result) {						
                			$("#fullbg,#dialog").hide();
                			self.executeSearch(function(startTime, endTime, assetId) {
                                var selectedId = $("#reportType").find("option:selected").val();
                                if (selectedId == "1") {
                                    self.getEveryDay(startTime, endTime, assetId);
                                    //self.tradeTable.setDataTable(startTime, endTime, assetId);
                                } else if (selectedId == "2") {
                                    self.getEveryMonth(startTime, endTime, assetId);
                                    //self.tradeTable.setDataTable(startTime, endTime, assetId);
                                } else if (selectedId == "3") {
                                    self.getEveryYear(startTime, endTime, assetId);
                                    //self.tradeTable.setDataTable(startTime, endTime, assetId);
                                }else if (selectedId == "4") {
                                    self.getCustomDay(startTime, endTime, assetId);
                                    //self.tradeTable.setDataTable(startTime, endTime, assetId);
                                }
                            });
    					}else{
    						dialog.render({lang: "add_pay_list_error"});
    						return ;
    						
    					}
                		
                	});
            	}else{
            		Service.addPayList(paydata,function(data) {
                		if (data.error_code == null && data.result) {						
                			$("#fullbg,#dialog").hide();
                			self.executeSearch(function(startTime, endTime, assetId) {
                                var selectedId = $("#reportType").find("option:selected").val();
                                if (selectedId == "1") {
                                    self.getEveryDay(startTime, endTime, assetId);
                                    //self.tradeTable.setDataTable(startTime, endTime, assetId);
                                } else if (selectedId == "2") {
                                    self.getEveryMonth(startTime, endTime, assetId);
                                    //self.tradeTable.setDataTable(startTime, endTime, assetId);
                                } else if (selectedId == "3") {
                                    self.getEveryYear(startTime, endTime, assetId);
                                    //self.tradeTable.setDataTable(startTime, endTime, assetId);
                                }else if (selectedId == "4") {
                                    self.getCustomDay(startTime, endTime, assetId);
                                    //self.tradeTable.setDataTable(startTime, endTime, assetId);
                                }
                            });
    					}else{
    						dialog.render({lang: "add_pay_list_error"});
    						return ;
    						
    					}
                		
                	});
            	}
            	
            	
            	$("#fullbg,#dialog").hide();
            });
            
            $("#product-config-cancel").bind('click',function(){
            	
            	$("#fullbg,#dialog").hide();
            });
                      
            
        },
        executeSearch: function(callback) {
        	var self=this;
            var byDate = "";
            var byMonth = "";
            var byYear = "";
            var startTime = '';
            var endTime = '';
            var selectedId = $("#reportType").find("option:selected").val();
            if (selectedId == "1") {
                byDate = $("#summary_date").val();//日
            } else if (selectedId == "2") {
                byMonth = $("#summary_month").val();//月
            } else if (selectedId == "3") {
                byYear = $("#summary_year").val();//年
            } else if (selectedId == "4") { //自定义
            	var define_startTime = $("#summary_startTime").val();
            	var define_endTime = $("#summary_endTime").val();
                startTime = (new Date(define_startTime +" 00:00:00")).getTime() / 1000;
                endTime = (new Date(define_endTime + " 23:59:59")).getTime() / 1000;  
            }
            
            var areaId = $("#userarea").multiselect("getChecked").map(function() {//
                return this.title;
            }).get();
            var lineId = $("#userline").multiselect("getChecked").map(function() {//
                return this.title;
            }).get();
            var assetId = $(".combox_input").val();
            
//            console.log(assetId);
            //var assetId = $("#searchValue_orderNo").val();
           
            //日报表
            if (byDate) {
                startTime = (new Date(byDate + " 00:00:00")).getTime() / 1000;
                endTime = (new Date(byDate + " 23:59:59")).getTime() / 1000;
            }
            
           
            //月报表
            if (byMonth) {
            	var year = byMonth.split('/')[0];
            	
                var months = byMonth.split('/')[1];
            	var  maxday = new Date(year,months,0).getDate();
            	
                if (months == 1 || months == 3 || months == 5 || months == 7 || months == 8 || months == 10 || months == 12) {
                    startTime = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                    endTime = (new Date(byMonth + "/31" + " 23:59:59")).getTime() / 1000;
                } else if (months == 2) {
                    startTime = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                    endTime = (new Date(byMonth + "/" +maxday+ " 23:59:59")).getTime() / 1000;
                } else {
                    startTime = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                    endTime = (new Date(byMonth + "/30" + " 23:59:59")).getTime() / 1000;
                }
            }
            //年报表
            if (byYear) {
                startTime = (new Date(byYear + "/01/01" + " 00:00:00")).getTime() / 1000;
                endTime = (new Date(byYear + "/12/31" + " 23:59:59")).getTime() / 1000;
            }

            callback(startTime, endTime, assetId);

        },
        loadData: function() {
            var myDate = new Date();
            var full = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var date = full + "/" + month + "/" + day;
            var startTime = (new Date(date + " 00:00:00")).getTime() / 1000;
            var endTime = (new Date(date + " 23:59:59")).getTime() / 1000;

            this.getEveryDay(startTime, endTime, null);
            //this.rendTradeTable(startTime, endTime, null, data);
//            this.tradeTable.setDataTable(startTime, endTime, null);
        },
        rendTradeTable: function(startTime, endTime, assetId, data) {
			$("#trade_detail_table").html("");
			$("#time_detail_table").html("");
			this.tradeTable = new TradeTable({
				"container":"#trade_detail_table",
				 startTime:startTime,
	             endTime:endTime,
	             assetId:assetId,
	             data:data
			});
			this.timeTable = new TimeTable({
				"container":"#time_detail_table",
	             startTime:startTime,
	             endTime:endTime,
	             assetId:assetId,
	             data:data
			});
			$("#trade_detail_table").css("height",$("#trade_list_table-table").height()+$("#trade_list_paging").height());
			$("#time_detail_table").css("height",$("#trade_sta_list_table-table").height()+$("#trade_sta_list_paging").height());
//            this.tradeTable = new TradeTable({
//                selector: "#" + this.elements.footer.id,
//                startTime:startTime,
//                endTime:endTime,
//                assetId:assetId,
//                data:data
//               // "container": "#tradeContent"
//            });
        },
        renderChart: function(data) {
        	
        	var amount = data.result[0].amountOnLine + data.result[0].amountOutLine;
            var sum = data.result[0].sumOnLine + data.result[0].sumOutLine;
            $("#amount").text(amount.toFixed(2));
            $("#sum").text(sum);
   
            $("#payStyleTr").empty();
            $("#colorPayStyleTr").empty();
            $("#payAlert").empty();
            $("#payAlertSum").empty();
            $("#payStyleSumTr").empty();
                    
            var payStyle = data.result[0].payStyle;
            
            var payStylesum = data.result[0].payStylesum;
            
            var Wechat_amount = (payStyle[0][1] * 100).toFixed(2);
            var Alipay_amount = (payStyle[1][1] * 100).toFixed(2);
            var BaifuBao_amount = (payStyle[2][1] * 100).toFixed(2);
            var other_amount = (payStyle[3][1] * 100).toFixed(2); //现金
            var SoundWave_amount = (payStyle[4][1] * 100).toFixed(2);
            var SwingCard_amount = (payStyle[5][1] * 100).toFixed(2);
            var Pos_amount = (payStyle[6][1] * 100).toFixed(2);
            var OneCard_amount = (payStyle[7][1] * 100).toFixed(2);
            var Abc_amount = (payStyle[8][1] * 100).toFixed(2);
            var Game_amount = (payStyle[9][1] * 100).toFixed(2);
            var VipPay_amount = (payStyle[10][1] * 100).toFixed(2);//会员支付
            var BestPay_amount = (payStyle[11][1] * 100).toFixed(2);//翼支付
            var JDPay_amount = (payStyle[12][1] * 100).toFixed(2);//京东支付
            var WechatBarcode_amount = (payStyle[13][1] * 100).toFixed(2);//微信反扫
            var AlipayBarcode_amount = (payStyle[14][1] * 100).toFixed(2);//支付宝反扫
            var OtherPay_amount = (payStyle[15][1] * 100).toFixed(2);//其他
            var Unionpay_amount = (payStyle[16][1] * 100).toFixed(2);//银联
            
            
            
            var Wechat_sum = (payStylesum[0][1] * 100).toFixed(2);
            var Alipay_sum = (payStylesum[1][1] * 100).toFixed(2);  
            var BaifuBao_sum = (payStylesum[2][1] * 100).toFixed(2); 
            var other_sum = (payStylesum[3][1] * 100).toFixed(2);
            var SoundWave_sum = (payStylesum[4][1] * 100).toFixed(2);
            var SwingCard_sum = (payStylesum[5][1] * 100).toFixed(2);
            var Pos_sum = (payStylesum[6][1] * 100).toFixed(2);
            var OneCard_sum = (payStylesum[7][1] * 100).toFixed(2);
            var Abc_sum = (payStylesum[8][1] * 100).toFixed(2);
            var Game_sum = (payStylesum[9][1] * 100).toFixed(2);
            var VipPay_sum = (payStylesum[10][1] * 100).toFixed(2);//会员
            
            var BestPay_sum = (payStylesum[11][1] * 100).toFixed(2);//翼支付
            var JDPay_sum = (payStylesum[12][1] * 100).toFixed(2);//京东支付
            var WechatBarcode_sum = (payStylesum[13][1] * 100).toFixed(2);//微信反扫
            var AlipayBarcode_sum = (payStylesum[14][1] * 100).toFixed(2);//支付宝反扫
            var OtherPay_sum = (payStylesum[15][1] * 100).toFixed(2);//其他
            var Unionpay_sum = (payStylesum[16][1] * 100).toFixed(2);//银联
            
            
            
            var countrow = 0;
            if (Unionpay_amount != 0.00) {
            	if(countrow >=3){
            		$("#payAlert").append("<span>"+ locale.get({lang: "UnionPay_payment"}) +":</span><span>&nbsp;"+payStyle[16][2]/100+"￥&nbsp;("+Unionpay_amount+"%)</span><br>");
            		$("#payAlertSum").append("<span>"+ locale.get({lang: "UnionPay_payment"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[16][2]+"&nbsp;&nbsp;("+Unionpay_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
					countrow = 0;
				}else{
					$("#payAlert").append("<span>"+ locale.get({lang: "UnionPay_payment"}) +":</span><span>&nbsp;"+payStyle[16][2]/100+"￥&nbsp;("+Unionpay_amount+"%)</span>&nbsp;&nbsp;");
					$("#payAlertSum").append("<span>"+ locale.get({lang: "UnionPay_payment"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[16][2]+"&nbsp;&nbsp;("+Unionpay_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
					countrow++;
				}
            	
                $("#payStyleTr").append("<td width='" + Unionpay_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #00CD00;'></div></td>");
                $("#payStyleSumTr").append("<td width='" + Unionpay_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #00CD00;'></div></td>");
                $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #00CD00;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "UnionPay_payment"}) +"</span></td>");
            } 
            
            if (Wechat_amount != 0.00) {
            	if(countrow >=3){
            		$("#payAlert").append("<span>"+ locale.get({lang: "we_chat"}) +":</span><span>&nbsp;"+payStyle[0][2]/100+"￥&nbsp;("+Wechat_amount+"%)</span><br>");
            		$("#payAlertSum").append("<span>"+ locale.get({lang: "we_chat"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[0][2]+"&nbsp;&nbsp;("+Wechat_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
					countrow = 0;
				}else{
					$("#payAlert").append("<span>"+ locale.get({lang: "we_chat"}) +":</span><span>&nbsp;"+payStyle[0][2]/100+"￥&nbsp;("+Wechat_amount+"%)</span>&nbsp;&nbsp;");
					$("#payAlertSum").append("<span>"+ locale.get({lang: "we_chat"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[0][2]+"&nbsp;&nbsp;("+Wechat_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
					countrow++;
				}
            	
                $("#payStyleTr").append("<td width='" + Wechat_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #00CD00;'></div></td>");
                $("#payStyleSumTr").append("<td width='" + Wechat_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #00CD00;'></div></td>");
                $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #00CD00;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_wx_pay"}) +"</span></td>");
            } 

            if (Alipay_amount != 0.00) {
            	if(countrow >=3){
            		$("#payAlert").append("<span>"+ locale.get({lang: "alipay"}) +":</span><span>&nbsp;"+payStyle[1][2]/100+"￥&nbsp;("+Alipay_amount+"%)</span><br>");
            		$("#payAlertSum").append("<span>"+ locale.get({lang: "alipay"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[1][2]+"&nbsp;&nbsp;("+Alipay_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            		countrow = 0;
				}else{
					$("#payAlert").append("<span>"+ locale.get({lang: "alipay"}) +":</span><span>&nbsp;"+payStyle[1][2]/100+"￥&nbsp;("+Alipay_amount+"%)</span>&nbsp;&nbsp;");
					$("#payAlertSum").append("<span>"+ locale.get({lang: "alipay"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[1][2]+"&nbsp;&nbsp;("+Alipay_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
					countrow++;
				}
            	
                $("#payStyleTr").append("<td width='" + Alipay_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #FD6B6C;'></div></td>");
                $("#payStyleSumTr").append("<td width='" + Alipay_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #FD6B6C;'></div></td>");
                $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #FD6B6C;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_alipay"}) +"</span></td>");
            } 

            if (other_amount != 0.00) {
            	if(countrow >=3){
            		$("#payAlert").append("<span>"+ locale.get({lang: "cash"}) +":</span><span>&nbsp;"+payStyle[3][2]/100+"￥&nbsp;("+other_amount+"%)</span><br>");
            		$("#payAlertSum").append("<span>"+ locale.get({lang: "cash"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[3][2]+"&nbsp;&nbsp;("+other_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            		countrow = 0;
				}else{
					$("#payAlert").append("<span>"+ locale.get({lang: "cash"}) +":</span><span>&nbsp;"+payStyle[3][2]/100+"￥&nbsp;("+other_amount+"%)</span>&nbsp;&nbsp;");
					$("#payAlertSum").append("<span>"+ locale.get({lang: "cash"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[3][2]+"&nbsp;&nbsp;("+other_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
					countrow++;
				}
            	
                $("#payStyleTr").append("<td width='" + other_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #ACCCBD;'></div></td>");
                $("#payStyleSumTr").append("<td width='" + other_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #ACCCBD;'></div></td>");
                $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #ACCCBD;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_cash_payment"}) +"</span></td>");
            } 
            
            if (BaifuBao_amount != 0.00) {
            	if(countrow >=3){
            		$("#payAlert").append("<span>"+ locale.get({lang: "baifubao"}) +":</span><span>&nbsp;"+payStyle[2][2]/100+"￥&nbsp;("+BaifuBao_amount+"%)</span><br>");
            		$("#payAlertSum").append("<span>"+ locale.get({lang: "baifubao"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[2][2]+"&nbsp;&nbsp;("+BaifuBao_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            		countrow = 0;
				}else{
					$("#payAlert").append("<span>"+ locale.get({lang: "baifubao"}) +":</span><span>&nbsp;"+payStyle[2][2]/100+"￥&nbsp;("+BaifuBao_amount+"%)</span>&nbsp;&nbsp;");
					$("#payAlertSum").append("<span>"+ locale.get({lang: "baifubao"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[2][2]+"&nbsp;&nbsp;("+BaifuBao_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
					countrow++;
				}
            	
                $("#payStyleTr").append("<td width='" + BaifuBao_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #BCBD91;'></div></td>");
                $("#payStyleSumTr").append("<td width='" + BaifuBao_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #BCBD91;'></div></td>");
                $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #BCBD91;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_baifubao"}) +"</span></td>");
            }
            if (SoundWave_amount != 0.00) {
            	if(countrow >=3){
            		$("#payAlert").append("<span>"+ locale.get({lang: "trade_soundware"}) +":</span><span>&nbsp;"+payStyle[4][2]/100+"￥&nbsp;("+SoundWave_amount+"%)</span><br>");
            		$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_soundware"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[4][2]+"&nbsp;&nbsp;("+SoundWave_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            		countrow = 0;
				}else{
					$("#payAlert").append("<span>"+ locale.get({lang: "trade_soundware"}) +":</span><span>&nbsp;"+payStyle[4][2]/100+"￥&nbsp;("+SoundWave_amount+"%)</span>&nbsp;&nbsp;");
					$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_soundware"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[4][2]+"&nbsp;&nbsp;("+SoundWave_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
					countrow++;
				}
            	
                $("#payStyleTr").append("<td width='" + SoundWave_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #CDAD00;'></div></td>");
                $("#payStyleSumTr").append("<td width='" + SoundWave_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #CDAD00;'></div></td>");
                $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #CDAD00;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_soundwave_pay"}) +"</span></td>");
            }
            if (SwingCard_amount != 0.00) {
            	if(countrow >=3){
            		$("#payAlert").append("<span>"+ locale.get({lang: "trade_swing_card"}) +":</span><span>&nbsp;"+payStyle[5][2]/100+"￥&nbsp;("+SwingCard_amount+"%)</span><br>");
            		$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_swing_card"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[5][2]+"&nbsp;&nbsp;("+SwingCard_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            		countrow = 0;
				}else{
					$("#payAlert").append("<span>"+ locale.get({lang: "trade_swing_card"}) +":</span><span>&nbsp;"+payStyle[5][2]/100+"￥&nbsp;("+SwingCard_amount+"%)</span>&nbsp;&nbsp;");
					$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_swing_card"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[5][2]+"&nbsp;&nbsp;("+SwingCard_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
					countrow++;
				}
                $("#payStyleTr").append("<td width='" + SwingCard_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #FFD700;'></div></td>");
                $("#payStyleSumTr").append("<td width='" + SwingCard_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #FFD700;'></div></td>");
                $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #FFD700;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_swingcard_pay"}) +"</span></td>");
            }
            if (Pos_amount != 0.00) {
            	if(countrow >=3){
            		$("#payAlert").append("<span>"+ locale.get({lang: "trade_pos_mach"}) +":</span><span>&nbsp;"+payStyle[6][2]/100+"￥&nbsp;("+Pos_amount+"%)</span><br>");
            		$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_pos_mach"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[6][2]+"&nbsp;&nbsp;("+Pos_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            		countrow = 0;
				}else{
					$("#payAlert").append("<span>"+ locale.get({lang: "trade_pos_mach"}) +":</span><span>&nbsp;"+payStyle[6][2]/100+"￥&nbsp;("+Pos_amount+"%)</span>&nbsp;&nbsp;");
					$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_pos_mach"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[6][2]+"&nbsp;&nbsp;("+Pos_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
					countrow++;
				}
            	
                $("#payStyleTr").append("<td width='" + Pos_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #EE1289;'></div></td>");
                $("#payStyleSumTr").append("<td width='" + Pos_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #EE1289;'></div></td>");
                $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #EE1289;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_pos_pay"}) +"</span></td>");
            }
            if (OneCard_amount != 0.00) {
            	if(countrow >=3){
            		$("#payAlert").append("<span>"+ locale.get({lang: "one_card_solution"}) +":</span><span>&nbsp;"+payStyle[7][2]/100+"￥&nbsp;("+OneCard_amount+"%)</span><br>");
            		$("#payAlertSum").append("<span>"+ locale.get({lang: "one_card_solution"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[7][2]+"&nbsp;&nbsp;("+OneCard_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            		countrow = 0;
				}else{
					$("#payAlert").append("<span>"+ locale.get({lang: "one_card_solution"}) +":</span><span>&nbsp;"+payStyle[7][2]/100+"￥&nbsp;("+OneCard_amount+"%)</span>&nbsp;&nbsp;");
					$("#payAlertSum").append("<span>"+ locale.get({lang: "one_card_solution"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[7][2]+"&nbsp;&nbsp;("+OneCard_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
					countrow++;
				}
                $("#payStyleTr").append("<td width='" + OneCard_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #F4A460;'></div></td>");
                $("#payStyleSumTr").append("<td width='" + OneCard_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #F4A460;'></div></td>");
                $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #F4A460;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_onecard_pay"}) +"</span></td>");
            }
            if (Abc_amount != 0.00) {
            	if(countrow >=3){
            		$("#payAlert").append("<span>"+ locale.get({lang: "trade_abc"}) +":</span><span>&nbsp;"+payStyle[8][2]/100+"￥&nbsp;("+Abc_amount+"%)</span><br>");
            		$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_abc"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[8][2]+"&nbsp;&nbsp;("+Abc_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            		countrow = 0;
				}else{
					$("#payAlert").append("<span>"+ locale.get({lang: "trade_abc"}) +":</span><span>&nbsp;"+payStyle[8][2]/100+"￥&nbsp;("+Abc_amount+"%)</span>&nbsp;&nbsp;");
					$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_abc"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[8][2]+"&nbsp;&nbsp;("+Abc_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
					countrow++;
				}
                $("#payStyleTr").append("<td width='" + Abc_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #C0FF3E;'></div></td>");
                $("#payStyleSumTr").append("<td width='" + Abc_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #C0FF3E;'></div></td>");
                $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #C0FF3E;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_abc_palm_bank"}) +"</span></td>");
            }
            if (Game_amount != 0.00) {
            	if(countrow >=3){
            		$("#payAlert").append("<span>"+ locale.get({lang: "trade_game"}) +":</span><span>&nbsp;"+payStyle[9][2]/100+"￥&nbsp;("+Game_amount+"%)</span><br>");
            		$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_game"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[9][2]+"&nbsp;&nbsp;("+Game_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            		countrow = 0;
				}else{
					$("#payAlert").append("<span>"+ locale.get({lang: "trade_game"}) +":</span><span>&nbsp;"+payStyle[9][2]/100+"￥&nbsp;("+Game_amount+"%)</span>&nbsp;&nbsp;");
					$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_game"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[9][2]+"&nbsp;&nbsp;("+Game_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
					countrow++;
				}
                $("#payStyleTr").append("<td width='" + Game_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #9F79EE;'></div></td>");
                $("#payStyleSumTr").append("<td width='" + Game_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #9F79EE;'></div></td>");
                $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #9F79EE;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_game_pay"}) +"</span></td>");
            }else{
            	if(Game_sum != 0.00){
            		if(countrow >=3){
                		//$("#payAlert").append("<span>"+ locale.get({lang: "trade_game"}) +":</span><span>&nbsp;"+payStyle[9][2]/100+"￥&nbsp;("+Game_amount+"%)</span><br>");
                		$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_game"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[9][2]+"&nbsp;&nbsp;("+Game_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
                		countrow = 0;
    				}else{
    					//$("#payAlert").append("<span>"+ locale.get({lang: "trade_game"}) +":</span><span>&nbsp;"+payStyle[9][2]/100+"￥&nbsp;("+Game_amount+"%)</span>&nbsp;&nbsp;");
    					$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_game"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[9][2]+"&nbsp;&nbsp;("+Game_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
    					countrow++;
    				}
            		$("#payStyleSumTr").append("<td width='" + Game_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #9F79EE;'></div></td>");
                    $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #9F79EE;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_game_pay"}) +"</span></td>");
            	}
            }
            if (OtherPay_amount != 0.00) {
            	if(countrow >=3){
            		$("#payAlert").append("<span>"+ locale.get({lang: "other"}) +":</span><span>&nbsp;"+payStyle[15][2]/100+"￥&nbsp;("+OtherPay_amount+"%)</span><br>");
            		$("#payAlertSum").append("<span>"+ locale.get({lang: "other"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[15][2]+"&nbsp;&nbsp;("+OtherPay_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            		countrow = 0;
				}else{
					$("#payAlert").append("<span>"+ locale.get({lang: "other"}) +":</span><span>&nbsp;"+payStyle[15][2]/100+"￥&nbsp;("+OtherPay_amount+"%)</span>&nbsp;&nbsp;");
					$("#payAlertSum").append("<span>"+ locale.get({lang: "other"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[15][2]+"&nbsp;&nbsp;("+OtherPay_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
					countrow++;
				}
                $("#payStyleTr").append("<td width='" + OtherPay_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #9C9C9C;'></div></td>");
                $("#payStyleSumTr").append("<td width='" + OtherPay_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #9C9C9C;'></div></td>");
                $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #9C9C9C;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_other"}) +"</span></td>");
            }
            if (VipPay_amount != 0.00) {
            	if(countrow >=3){
            		$("#payAlert").append("<span>"+ locale.get({lang: "trade_vip"}) +":</span><span>&nbsp;"+payStyle[10][2]/100+"￥&nbsp;("+VipPay_amount+"%)</span><br>");
            		$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_vip"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[10][2]+"&nbsp;&nbsp;("+VipPay_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            		countrow = 0;
				}else{
					$("#payAlert").append("<span>"+ locale.get({lang: "trade_vip"}) +":</span><span>&nbsp;"+payStyle[10][2]/100+"￥&nbsp;("+VipPay_amount+"%)</span>&nbsp;&nbsp;");
					$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_vip"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[10][2]+"&nbsp;&nbsp;("+VipPay_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
					countrow++;
				}
                $("#payStyleTr").append("<td width='" + VipPay_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #FF34B3;'></div></td>");
                $("#payStyleSumTr").append("<td width='" + VipPay_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #FF34B3;'></div></td>");
                $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #FF34B3;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_vip"}) +"</span></td>");
            }else{
            	if(VipPay_sum != 0.00){
            		if(countrow >=3){
            			$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_vip"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[10][2]+"&nbsp;&nbsp;("+VipPay_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            			countrow = 0;
    				}else{
    					$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_vip"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[10][2]+"&nbsp;&nbsp;("+VipPay_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
    					countrow++;
    				}
            		$("#payStyleSumTr").append("<td width='" + VipPay_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #FF34B3;'></div></td>");
                    $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #FF34B3;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_vip"}) +"</span></td>");
            	}
            }
            if (BestPay_amount != 0.00) {
            	if(countrow >=3){
            		$("#payAlert").append("<span>"+ locale.get({lang: "trade_best_pay"}) +":</span><span>&nbsp;"+payStyle[11][2]/100+"￥&nbsp;("+BestPay_amount+"%)</span><br>");
            		$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_best_pay"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[11][2]+"&nbsp;&nbsp;("+BestPay_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            		countrow = 0;
				}else{
					$("#payAlert").append("<span>"+ locale.get({lang: "trade_best_pay"}) +":</span><span>&nbsp;"+payStyle[11][2]/100+"￥&nbsp;("+BestPay_amount+"%)</span>&nbsp;&nbsp;");
					$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_best_pay"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[11][2]+"&nbsp;&nbsp;("+BestPay_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
					countrow++;
				}
                $("#payStyleTr").append("<td width='" + BestPay_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #7A67EE;'></div></td>");
                $("#payStyleSumTr").append("<td width='" + BestPay_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #7A67EE;'></div></td>");
                $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #FF34B3;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_best_pay"}) +"</span></td>");
            }else{
            	if(BestPay_sum != 0.00){
            		if(countrow >=3){
            			$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_best_pay"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[11][2]+"&nbsp;&nbsp;("+BestPay_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            			countrow = 0;
    				}else{
    					$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_best_pay"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[11][2]+"&nbsp;&nbsp;("+BestPay_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
    					countrow++;
    				}
            		$("#payStyleSumTr").append("<td width='" + BestPay_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #7A67EE;'></div></td>");
                    $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #7A67EE;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_best_pay"}) +"</span></td>");
            	}
            }
            if (JDPay_amount != 0.00) {
            	if(countrow >=3){
            		$("#payAlert").append("<span>"+ locale.get({lang: "trade_jd_pay"}) +":</span><span>&nbsp;"+payStyle[12][2]/100+"￥&nbsp;("+JDPay_amount+"%)</span><br>");
            		$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_jd_pay"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[12][2]+"&nbsp;&nbsp;("+JDPay_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            		countrow = 0;
				}else{
					$("#payAlert").append("<span>"+ locale.get({lang: "trade_jd_pay"}) +":</span><span>&nbsp;"+payStyle[12][2]/100+"￥&nbsp;("+JDPay_amount+"%)</span>&nbsp;&nbsp;");
					$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_jd_pay"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[12][2]+"&nbsp;&nbsp;("+JDPay_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
					countrow++;
				}
                $("#payStyleTr").append("<td width='" + JDPay_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #DB7093;'></div></td>");
                $("#payStyleSumTr").append("<td width='" + JDPay_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #DB7093;'></div></td>");
                $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #DB7093;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_jd_pay"}) +"</span></td>");
            }else{
            	if(JDPay_sum != 0.00){
            		if(countrow >=3){
            			$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_jd_pay"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[12][2]+"&nbsp;&nbsp;("+JDPay_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            			countrow = 0;
    				}else{
    					$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_jd_pay"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[12][2]+"&nbsp;&nbsp;("+JDPay_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
    					countrow++;
    				}
            		$("#payStyleSumTr").append("<td width='" + JDPay_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #DB7093;'></div></td>");
                    $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #DB7093;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_jd_pay"}) +"</span></td>");
            	}
            }
            if (WechatBarcode_amount != 0.00) {
            	if(countrow >=3){
            		$("#payAlert").append("<span>"+ locale.get({lang: "wechat_reversescan_pay"}) +":</span><span>&nbsp;"+payStyle[13][2]/100+"￥&nbsp;("+WechatBarcode_amount+"%)</span><br>");
            		$("#payAlertSum").append("<span>"+ locale.get({lang: "wechat_reversescan_pay"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[13][2]+"&nbsp;&nbsp;("+WechatBarcode_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            		countrow = 0;
				}else{
					$("#payAlert").append("<span>"+ locale.get({lang: "wechat_reversescan_pay"}) +":</span><span>&nbsp;"+payStyle[13][2]/100+"￥&nbsp;("+WechatBarcode_amount+"%)</span>&nbsp;&nbsp;");
					$("#payAlertSum").append("<span>"+ locale.get({lang: "wechat_reversescan_pay"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[13][2]+"&nbsp;&nbsp;("+WechatBarcode_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
					countrow++;
				}
                $("#payStyleTr").append("<td width='" + WechatBarcode_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #76EEC6;'></div></td>");
                $("#payStyleSumTr").append("<td width='" + WechatBarcode_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #76EEC6;'></div></td>");
                $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #76EEC6;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "wechat_reversescan_pay"}) +"</span></td>");
            }else{
            	if(WechatBarcode_sum != 0.00){
            		if(countrow >=3){
            			$("#payAlertSum").append("<span>"+ locale.get({lang: "wechat_reversescan_pay"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[13][2]+"&nbsp;&nbsp;("+WechatBarcode_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            			countrow = 0;
    				}else{
    					$("#payAlertSum").append("<span>"+ locale.get({lang: "wechat_reversescan_pay"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[13][2]+"&nbsp;&nbsp;("+WechatBarcode_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
    					countrow++;
    				}
            		$("#payStyleSumTr").append("<td width='" + WechatBarcode_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #76EEC6;'></div></td>");
                    $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #76EEC6;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "wechat_reversescan_pay"}) +"</span></td>");
            	}
            }
            if (AlipayBarcode_amount != 0.00) {
            	if(countrow >=3){
            		$("#payAlert").append("<span>"+ locale.get({lang: "trade_reversescan_pay"}) +":</span><span>&nbsp;"+payStyle[14][2]/100+"￥&nbsp;("+AlipayBarcode_amount+"%)</span><br>");
            		$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_reversescan_pay"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[14][2]+"&nbsp;&nbsp;("+AlipayBarcode_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            		countrow = 0;
				}else{
					$("#payAlert").append("<span>"+ locale.get({lang: "trade_reversescan_pay"}) +":</span><span>&nbsp;"+payStyle[14][2]/100+"￥&nbsp;("+AlipayBarcode_amount+"%)</span>&nbsp;&nbsp;");
					$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_reversescan_pay"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[14][2]+"&nbsp;&nbsp;("+AlipayBarcode_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
					countrow++;
				}
                $("#payStyleTr").append("<td width='" + AlipayBarcode_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #EEEE00;'></div></td>");
                $("#payStyleSumTr").append("<td width='" + AlipayBarcode_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #EEEE00;'></div></td>");
                $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #EEEE00;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_reversescan_pay"}) +"</span></td>");
            }else{
            	if(AlipayBarcode_sum != 0.00){
            		if(countrow >=3){
            			$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_reversescan_pay"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[14][2]+"&nbsp;&nbsp;("+AlipayBarcode_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
            			countrow = 0;
    				}else{
    					$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_reversescan_pay"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[14][2]+"&nbsp;&nbsp;("+AlipayBarcode_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
    					countrow++;
    				}
            		$("#payStyleSumTr").append("<td width='" + AlipayBarcode_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #EEEE00;'></div></td>");
                    $("#colorPayStyleTr").append("<td style='text-align: center;'><span style='height: 10px;width: 10px;background-color: #EEEE00;  display: inline-block;'></span><span style='margin-left:18px;'>"+ locale.get({lang: "trade_reversescan_pay"}) +"</span></td>");
            	}
            }
            
            var colen = $("#colorPayStyleTr").find("td").length;
            
            if(colen == 2){
            	$("#colorPayStyleTr").find("td").eq(1).css("text-align","left");
            }else if(colen == 3){
            	$("#colorPayStyleTr").find("td").eq(0).css("text-align","right");
            	$("#colorPayStyleTr").find("td").eq(2).css("text-align","left");
            }
                    
        },
        getEveryDay: function(startTime, endTime, assetId) {
        	cloud.util.mask("#trade");
            var self = this;
            var areaId = "";
            var lineId = "";
            if($("#userarea").attr("multiple") != undefined){
            	areaId = $("#userarea").multiselect("getChecked").map(function() {//
                    return this.value;
                }).get();
                lineId = $("#userline").multiselect("getChecked").map(function() {//
                    return this.value;
                }).get();
            }
            
            var lineFlag = 1;
            if(areaId.length != 0){
            	if($("#userline").find("option").length <=0){
                	lineFlag = 0;
                }
            }
            
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getAreaByUserId(userId,function(areadata){
            	
            	var areaIds=[];
                if(areadata && areadata.result && areadata.result.area && areadata.result.area.length>0){
                	areaIds = areadata.result.area;
                }
                if(roleType == 51){
                	areaIds = [];
                 }
                if(areaId.length != 0){
                	areaIds = areaId;
                }
                
                if(roleType != 51 && areaIds.length == 0){
                	areaIds = ["000000000000000000000000"];
                }
                if (lineId.length==0&&(assetId==null||assetId=="")) {
                  //查询某个时间段区域的交易的记录，展示到曲线中
                   Service.getDayAllStatisticByArea(startTime, endTime,areaIds, function(data) {
			                    if (data.result.length) {
			                    	self.rendTradeTable(startTime, endTime, assetId, data);
			                    	self.renderChart(data);
			                        
			                        var sumAmount = data.result[0].sumAmount;
			                        var languge = localStorage.getItem("language");
			                        if (languge == "en") {
			                            sumAmount[0].name = 'Amount';
			                            sumAmount[1].name = 'Volume';
			                        }
			                        var newTimes = ["0:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
			                        var map = {};
			                        self.renderLineChart(sumAmount, newTimes,map);
			                        cloud.util.unmask("#trade");
			                    }   
			      });

                }else if(lineId.length!=0&&(assetId==null||assetId=="")){
                	var lineIds = [];
                	  lineIds = lineId;
                	//查询某个时间段线路的交易记录，展示到曲线中      
                   Service.getDayAllStatisticByLine(startTime, endTime,lineIds, function(data) {
			                    if (data.result.length) {
			                    	self.rendTradeTable(startTime, endTime, assetId, data);
			                    	self.renderChart(data);
			                        
			                        var sumAmount = data.result[0].sumAmount;
			                        var languge = localStorage.getItem("language");
			                        if (languge == "en") {
			                            sumAmount[0].name = 'Amount';
			                            sumAmount[1].name = 'Volume';
			                        }
			                        var newTimes = ["0:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
			                        var map = {};
			                        self.renderLineChart(sumAmount, newTimes,map);
			                        cloud.util.unmask("#trade");
			                    }   
			      });
                	
                }else {
                 cloud.Ajax.request({
	   	    	      url:"api/automatline/list",
			    	  type : "GET",
			    	  parameters : {
			    		  areaId: areaIds,
			    		  cursor:0,
			    		  limit:-1
	                  },
			    	  success : function(linedata) {
			    		  var lineIds=[];
			    		  if(linedata && linedata.result && linedata.result.length>0){
			    			  for(var i=0;i<linedata.result.length;i++){
			    				  lineIds.push(linedata.result[i]._id);
			    			  }
		                   }
			    		  if(roleType == 51 && areaId.length == 0){
			    			  lineIds = [];
			              }
			    		  if(lineId.length != 0){
			    			  lineIds = lineId;
			    		  }else{
			    			  if(lineFlag == 0){
			    				  lineIds = ["000000000000000000000000"];
			    			  }
			    		  }
			    		  
			    		  if(roleType != 51 && lineIds.length == 0){
			    			   lineIds = ["000000000000000000000000"];
			    		  }
			                self.lineIds = lineIds;
			            	Service.getDayAllStatistic(startTime, endTime, assetId,lineIds, function(data) {
			                    if (data.result.length) {
			                    	self.rendTradeTable(startTime, endTime, assetId, data);
			                    	self.renderChart(data);
			                        
			                        var sumAmount = data.result[0].sumAmount;
			                        var languge = localStorage.getItem("language");
			                        if (languge == "en") {
			                            sumAmount[0].name = 'Amount';
			                            sumAmount[1].name = 'Volume';
			                        }
			                        var newTimes = ["0:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
			                        var map = {};
			                        self.renderLineChart(sumAmount, newTimes,map);
			                        cloud.util.unmask("#trade");
			                    }   
			                });
			    		  
			    	  }
  			     });
                }
  	

                
                
                
            });
        },
        getEveryMonth: function(startTime, endTime, assetId) {
        	cloud.util.mask("#trade");
            var self = this;
            var areaId = $("#userarea").multiselect("getChecked").map(function() {//
                return this.value;
            }).get();
            var lineId = $("#userline").multiselect("getChecked").map(function() {//
                return this.value;
            }).get();
            var lineFlag = 1;
            if(areaId.length != 0){
            	if($("#userline").find("option").length <=0){
                	lineFlag = 0;
                }
            }
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getAreaByUserId(userId,function(areadata){
            	
            	var areaIds=[];
                if(areadata && areadata.result && areadata.result.area && areadata.result.area.length>0){
                	areaIds = areadata.result.area;
                }
                if(roleType == 51){
                	areaIds = [];
                }
                if(areaId.length != 0){
                	areaIds = areaId;
                }
                
                if(roleType != 51 && areaIds.length == 0){
                	areaIds = ["000000000000000000000000"];
                }
                cloud.Ajax.request({
	   	    	      url:"api/automatline/list",
			    	  type : "GET",
			    	  parameters : {
			    		  areaId: areaIds,
			    		  cursor:0,
			    		  limit:-1
	                  },
			    	  success : function(linedata) {
			    		  var lineIds=[];
			    		  if(linedata && linedata.result && linedata.result.length>0){
			    			  for(var i=0;i<linedata.result.length;i++){
			    				  lineIds.push(linedata.result[i]._id);
			    			  }
		                   }
			    		  
			    		  if(roleType == 51 && areaId.length == 0){
			    			  lineIds = [];
			              }
			    		  if(lineId.length != 0){
			    			  lineIds = lineId;
			    		  }else{
			    			  if(lineFlag == 0){
			    				  lineIds = ["000000000000000000000000"];
			    			  }
			    		  }
			    		  
			    		  if(roleType != 51 && lineIds.length == 0){
			    			   lineIds = ["000000000000000000000000"];
			    		  }
			                self.lineIds = lineIds;
			            	Service.getMonthAllStatistic(startTime, endTime, assetId,lineIds, function(data) {
			                    if (data.result.length) {
			                    	self.rendTradeTable(startTime, endTime, assetId, data);
			                    	self.renderChart(data);
			                    	
			                        var languge = localStorage.getItem("language");
			                        var sumAmount = data.result[0].sumAmount;
			                        //console.log(data.result[0]);
			                        if (languge == "en") {
			                            sumAmount[0].name = 'Amount';
			                            sumAmount[1].name = 'Volume';
			                        }
			                        var byMonth = $("#summary_month").val();
			                        var months = byMonth.split('/')[1];
			                        var year = byMonth.split('/')[0];
			
			                    	var  maxday = new Date(year,months,0).getDate();
			                        var newTimes = [];
			                        if (months == 1 || months == 3 || months == 5 || months == 7 || months == 8 || months == 10 || months == 12) {
			                            newTimes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
			                        } else if (months == 2) {
			                        	
			                            newTimes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"];
			                            if(maxday > 28){
			                            	newTimes[28] = "29";
			                            }
			                        } else {
			                            newTimes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"];
			                        }
			                        var map = {};
			                        self.renderLineChart(sumAmount, newTimes,map);
			                        cloud.util.unmask("#trade");
			                    }
			                });
                
			    	  }
 			     });
            });
            
        },
        getEveryYear: function(startTime, endTime, assetId) {
        	cloud.util.mask("#trade");
            var self = this;
            var areaId = $("#userarea").multiselect("getChecked").map(function() {//
                return this.value;
            }).get();
            var lineId = $("#userline").multiselect("getChecked").map(function() {//
                return this.value;
            }).get();
            var lineFlag = 1;
            if(areaId.length != 0){
            	if($("#userline").find("option").length <=0){
                	lineFlag = 0;
                }
            }
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getAreaByUserId(userId,function(areadata){
            	
            	var areaIds=[];
                if(areadata && areadata.result && areadata.result.area && areadata.result.area.length>0){
                	areaIds = areadata.result.area;
                }
                if(roleType == 51){
                	areaIds = [];
                 }
                if(areaId.length != 0){
                	areaIds = areaId;
                }
                
                if(roleType != 51 && areaIds.length == 0){
                	areaIds = ["000000000000000000000000"];
                }
                cloud.Ajax.request({
	   	    	      url:"api/automatline/list",
			    	  type : "GET",
			    	  parameters : {
			    		  areaId: areaIds,
			    		  cursor:0,
			    		  limit:-1
	                  },
			    	  success : function(linedata) {
			    		  var lineIds=[];
			    		  if(linedata && linedata.result && linedata.result.length>0){
			    			  for(var i=0;i<linedata.result.length;i++){
			    				  lineIds.push(linedata.result[i]._id);
			    			  }
		                   }
			    		  
			    		  if(roleType == 51 && areaId.length == 0){
			    			  lineIds = [];
			              }
			    		  if(lineId.length != 0){
			    			  lineIds = lineId;
			    		  }else{
			    			  if(lineFlag == 0){
			    				  lineIds = ["000000000000000000000000"];
			    			  }
			    		  }
			    		  
			    		  if(roleType != 51 && lineIds.length == 0){
			    			   lineIds = ["000000000000000000000000"];
			    		  }
			                self.lineIds = lineIds;
			                Service.getYearAllStatistic(startTime, endTime, assetId,lineIds, function(data) {
			                    if (data.result.length) {
			                    	self.rendTradeTable(startTime, endTime, assetId, data);
			                    	self.renderChart(data);
			                    	
			                        var languge = localStorage.getItem("language");
			                        //console.log(data.result[0]);
			                        var sumAmount = data.result[0].sumAmount;
			                        if (languge == "en") {
			                            sumAmount[0].name = 'Amount';
			                            sumAmount[1].name = 'Volume';
			                        }
			                        var newTimes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
			                        var map = {};
			                        self.renderLineChart(sumAmount, newTimes,map);
			                        cloud.util.unmask("#trade");
			                    }
			                });
			    	  }
			     }); 
            });
           
        },
        getCustomDay:function(startTime, endTime, assetId) {
        	cloud.util.mask("#trade");
            var self = this;
            var areaId = $("#userarea").multiselect("getChecked").map(function() {//
                return this.value;
            }).get();
            var lineId = $("#userline").multiselect("getChecked").map(function() {//
                return this.value;
            }).get();
            var lineFlag = 1;
            if(areaId.length != 0){
            	if($("#userline").find("option").length <=0){
                	lineFlag = 0;
                }
            }
            
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getAreaByUserId(userId,function(areadata){
            	
            	var areaIds=[];
                if(areadata && areadata.result && areadata.result.area && areadata.result.area.length>0){
                	areaIds = areadata.result.area;
                }
                if(roleType == 51){
                	areaIds = [];
                }
                if(areaId.length != 0){
                	areaIds = areaId;
                }
                
                if(roleType != 51 && areaIds.length == 0){
                	areaIds = ["000000000000000000000000"];
                }
              if (lineId.length==0&&(assetId==null||assetId=="")) {
              	     Service.getCustomAllStatisticByArea(startTime, endTime,areaIds, function(data) {
			                    if (data.result.length) {
			                    	self.rendTradeTable(startTime, endTime, assetId, data);
			                    	self.renderChart(data);
			                    	
			                        var languge = localStorage.getItem("language");
			                        var sumAmount = data.result[0].sumAmount;
			
			                        if (languge == "en") {
			                            sumAmount[0].name = 'Amount';
			                            sumAmount[1].name = 'Volume';
			                        }
			
			                        var newTimes = [];
			
			                        //开始时间
			                        var datas = new Date(startTime*1000);
			                        var years = datas.getFullYear();
			                        var months = datas.getMonth();
			                        var days = datas.getDate();
			                        
			                        //结束时间
			                        var datae = new Date(endTime*1000);
			                        var yeare = datae.getFullYear();
			                        var monthe = datae.getMonth();
			                        var daye = datae.getDate();
			                        
			                        var map = {};
			                        
			                        if(years == yeare){//相同年
			                        	if(months == monthe){//相同月份
			                        		
			                        		for(var i=days;i<=daye;i++){
			                        			newTimes.push(i+"");
			                        		}
			                        	}else{
			                        		
			                        		for(var j=months;j<=monthe;j++){//不同月份
			                        			
			                            		var st;
			                            		var et
			                            		if(j == months){
			                            			st = days;
			                            			et = new Date(years,j+1,0).getDate();
			                            			
			                            		}else if(j == monthe){
			                            			st = 1;
			                            			et = daye;
			                            			
			                            		}else{
			                            			st = 1;
			                            			et = new Date(years,j+1,0).getDate();
			                            		}
			                            		
			                            		map[newTimes.length+""] = years+"/"+(j+1);
			                            		//var  maxd = new Date(years,j,0).getDate();
			                            		for(var k=st;k<=et;k++){
			                            			newTimes.push(k+"");
			                            		}
			                            		
			                            	}
			                        	}
			                        	
			                        }else{
			                        	
			                        	for(var m=months;m<=11;m++){
			                        		var st;
			                        		var et;
			                        		if(m == months){
			                        			st = days;
			                        			et = new Date(years,m+1,0).getDate();
			                        			
			                        		}else{
			                        			st = 1;
			                        			et = new Date(years,m+1,0).getDate();
			                        		}
			                        		map[newTimes.length+""] = years+"/"+(m+1);
			                        		
			                        		for(var h=st;h<=et;h++){
			                        			newTimes.push(h+"");
			                        		}
			                        		
			                        	}
			                        	for(var n=0;n<=monthe;n++){
			                        		var st;
			                        		var et;
			                        		if(n == monthe){
			                        			st = 1;
			                        			et = daye;
			                        		}else{
			                        			st = 1;
			                        			et = new Date(yeare,n+1,0).getDate();
			                        		}
			                        		map[newTimes.length+""] = yeare+"/"+(n+1);
			                        		for(var r=st;r<=et;r++){
			                        			newTimes.push(r+"");
			                        		}
			                        		
			                        	}
			                        	
			                        }
			                       
			                        if(newTimes.length>31){//超出范围显示滚动条
			                        	self.renderCustomLineChart(sumAmount, newTimes,map);
			                        }else{
			                        	self.renderLineChart(sumAmount, newTimes,map);
			                        }
			                        cloud.util.unmask("#trade");
			                        
			                    }
			     });
              }else if(lineId&&lineId.length!=0&&(assetId||assetId=="")) {
              	  var lineIds = [];
                   lineIds = lineId;
              		Service.getCustomAllStatisticByLine(startTime, endTime,lineId, function(data) {
			                    if (data.result.length) {
			                    	self.rendTradeTable(startTime, endTime, assetId, data);
			                    	self.renderChart(data);
			                    	
			                        var languge = localStorage.getItem("language");
			                        var sumAmount = data.result[0].sumAmount;
			
			                        if (languge == "en") {
			                            sumAmount[0].name = 'Amount';
			                            sumAmount[1].name = 'Volume';
			                        }
			
			                        var newTimes = [];
			
			                        //开始时间
			                        var datas = new Date(startTime*1000);
			                        var years = datas.getFullYear();
			                        var months = datas.getMonth();
			                        var days = datas.getDate();
			                        
			                        //结束时间
			                        var datae = new Date(endTime*1000);
			                        var yeare = datae.getFullYear();
			                        var monthe = datae.getMonth();
			                        var daye = datae.getDate();
			                        
			                        var map = {};
			                        
			                        if(years == yeare){//相同年
			                        	if(months == monthe){//相同月份
			                        		
			                        		for(var i=days;i<=daye;i++){
			                        			newTimes.push(i+"");
			                        		}
			                        	}else{
			                        		
			                        		for(var j=months;j<=monthe;j++){//不同月份
			                        			
			                            		var st;
			                            		var et
			                            		if(j == months){
			                            			st = days;
			                            			et = new Date(years,j+1,0).getDate();
			                            			
			                            		}else if(j == monthe){
			                            			st = 1;
			                            			et = daye;
			                            			
			                            		}else{
			                            			st = 1;
			                            			et = new Date(years,j+1,0).getDate();
			                            		}
			                            		
			                            		map[newTimes.length+""] = years+"/"+(j+1);
			                            		//var  maxd = new Date(years,j,0).getDate();
			                            		for(var k=st;k<=et;k++){
			                            			newTimes.push(k+"");
			                            		}
			                            		
			                            	}
			                        	}
			                        	
			                        }else{
			                        	
			                        	for(var m=months;m<=11;m++){
			                        		var st;
			                        		var et;
			                        		if(m == months){
			                        			st = days;
			                        			et = new Date(years,m+1,0).getDate();
			                        			
			                        		}else{
			                        			st = 1;
			                        			et = new Date(years,m+1,0).getDate();
			                        		}
			                        		map[newTimes.length+""] = years+"/"+(m+1);
			                        		
			                        		for(var h=st;h<=et;h++){
			                        			newTimes.push(h+"");
			                        		}
			                        		
			                        	}
			                        	for(var n=0;n<=monthe;n++){
			                        		var st;
			                        		var et;
			                        		if(n == monthe){
			                        			st = 1;
			                        			et = daye;
			                        		}else{
			                        			st = 1;
			                        			et = new Date(yeare,n+1,0).getDate();
			                        		}
			                        		map[newTimes.length+""] = yeare+"/"+(n+1);
			                        		for(var r=st;r<=et;r++){
			                        			newTimes.push(r+"");
			                        		}
			                        		
			                        	}
			                        	
			                        }
			                       
			                        if(newTimes.length>31){//超出范围显示滚动条
			                        	self.renderCustomLineChart(sumAmount, newTimes,map);
			                        }else{
			                        	self.renderLineChart(sumAmount, newTimes,map);
			                        }
			                        cloud.util.unmask("#trade");
			                        
			                    }
			     });
              }else {
              	   
                 cloud.Ajax.request({
	   	    	      url:"api/automatline/list",
			    	  type : "GET",
			    	  parameters : {
			    		  areaId: areaIds,
			    		  cursor:0,
			    		  limit:-1
	                  },
			    	  success : function(linedata) {
			    		  var lineIds=[];
			    		  if(linedata && linedata.result && linedata.result.length>0){
			    			  for(var i=0;i<linedata.result.length;i++){
			    				  lineIds.push(linedata.result[i]._id);
			    			  }
		                   }
			    		  
			    		  if(roleType == 51 && areaId.length == 0){
			    			  lineIds = [];
			              }
			    		  if(lineId.length != 0){
			    			  lineIds = lineId;
			    		  }else{
			    			  if(lineFlag == 0){
			    				  lineIds = ["000000000000000000000000"];
			    			  }
			    		  }
			    		  
			    		  if(roleType != 51 && lineIds.length == 0){
			    			   lineIds = ["000000000000000000000000"];
			    		  }
			                self.lineIds = lineIds;
			                Service.getCustomAllStatistic(startTime, endTime, assetId,lineIds, function(data) {
			                    if (data.result.length) {
			                    	self.rendTradeTable(startTime, endTime, assetId, data);
			                    	self.renderChart(data);
			                    	
			                        var languge = localStorage.getItem("language");
			                        var sumAmount = data.result[0].sumAmount;
			
			                        if (languge == "en") {
			                            sumAmount[0].name = 'Amount';
			                            sumAmount[1].name = 'Volume';
			                        }
			
			                        var newTimes = [];
			
			                        //开始时间
			                        var datas = new Date(startTime*1000);
			                        var years = datas.getFullYear();
			                        var months = datas.getMonth();
			                        var days = datas.getDate();
			                        
			                        //结束时间
			                        var datae = new Date(endTime*1000);
			                        var yeare = datae.getFullYear();
			                        var monthe = datae.getMonth();
			                        var daye = datae.getDate();
			                        
			                        var map = {};
			                        
			                        if(years == yeare){//相同年
			                        	if(months == monthe){//相同月份
			                        		
			                        		for(var i=days;i<=daye;i++){
			                        			newTimes.push(i+"");
			                        		}
			                        	}else{
			                        		
			                        		for(var j=months;j<=monthe;j++){//不同月份
			                        			
			                            		var st;
			                            		var et
			                            		if(j == months){
			                            			st = days;
			                            			et = new Date(years,j+1,0).getDate();
			                            			
			                            		}else if(j == monthe){
			                            			st = 1;
			                            			et = daye;
			                            			
			                            		}else{
			                            			st = 1;
			                            			et = new Date(years,j+1,0).getDate();
			                            		}
			                            		
			                            		map[newTimes.length+""] = years+"/"+(j+1);
			                            		//var  maxd = new Date(years,j,0).getDate();
			                            		for(var k=st;k<=et;k++){
			                            			newTimes.push(k+"");
			                            		}
			                            		
			                            	}
			                        	}
			                        	
			                        }else{
			                        	
			                        	for(var m=months;m<=11;m++){
			                        		var st;
			                        		var et;
			                        		if(m == months){
			                        			st = days;
			                        			et = new Date(years,m+1,0).getDate();
			                        			
			                        		}else{
			                        			st = 1;
			                        			et = new Date(years,m+1,0).getDate();
			                        		}
			                        		map[newTimes.length+""] = years+"/"+(m+1);
			                        		
			                        		for(var h=st;h<=et;h++){
			                        			newTimes.push(h+"");
			                        		}
			                        		
			                        	}
			                        	for(var n=0;n<=monthe;n++){
			                        		var st;
			                        		var et;
			                        		if(n == monthe){
			                        			st = 1;
			                        			et = daye;
			                        		}else{
			                        			st = 1;
			                        			et = new Date(yeare,n+1,0).getDate();
			                        		}
			                        		map[newTimes.length+""] = yeare+"/"+(n+1);
			                        		for(var r=st;r<=et;r++){
			                        			newTimes.push(r+"");
			                        		}
			                        		
			                        	}
			                        	
			                        }
			                       
			                        if(newTimes.length>31){//超出范围显示滚动条
			                        	self.renderCustomLineChart(sumAmount, newTimes,map);
			                        }else{
			                        	self.renderLineChart(sumAmount, newTimes,map);
			                        }
			                        cloud.util.unmask("#trade");
			                        
			                    }
			                });
		               }
			     });
              }
            
            });
            
        },
        renderLineChart: function(result, newTimes,map) {
        	var money=result[0].name;
        	var count=result[1].name;
        	var wid = $("#line-content").width();
            $('#line-content').highcharts({
                chart: {
                    type: 'line',
                    height: 350,
                    width: wid
                },
               // colors: ['#24CBE5', '#458B00'],
                title: {
                    text: ''
                },
                xAxis: {
                    categories: newTimes
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    min: 0
                },
                tooltip: {
                    shared: true
                },
                series: 
                	//result
                	[{
                    	name: money,
                        color: '#24CBE5',
                        type: 'spline',
                        data: result[0].data,
                        tooltip: {
                            valueSuffix: locale.get({lang:"china_yuan"})
                        }

                    }, {
                    	name: count,
                        color: '#458B00',
                        type: 'spline',
                        data: result[1].data,
                        tooltip: {
                            valueSuffix: locale.get({lang:"ren"})
                        }
                    }]   
            });
            
            if(map){
            	var charts = $('#line-content').highcharts();
                for(var i in map) {
                	charts.xAxis[0].addPlotLine(
                    		{
                                color:'red',            //线的颜色，定义为红色
                                dashStyle:'longdashdot',//标示线的样式，默认是solid（实线），这里定义为长虚线
                                value:parseInt(i),                //定义在哪个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                                width:2,                //标示线的宽度，2px
                                label:{
                                    text:map[i],        //标签的内容
                                    align:'left',                //标签的水平位置
                                    x:10,                        //标签相对于被定位的位置水平偏移的像素，水平居左10px
                                    style: {
                                        fontSize: '13px',
                                        fontFamily: 'Verdana, sans-serif'
                                        
                                    }
                                }
                            }	
                    
                    );
                }//添加标示线
            }
        },
        renderCustomLineChart: function(result, newTimes,map) {
        	var money=result[0].name;
        	var count=result[1].name;
        	var wid = $("#line-content").width();
            $('#line-content').highcharts({
                chart: {
                    type: 'line',
                    height: 350,
                    width: wid
                },
               // colors: ['#24CBE5', '#458B00'],
                title: {
                    text: ''
                },
                xAxis: {
                    categories: newTimes,
                    max: 31
                    
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    min: 0
                },
                tooltip: {
                    shared: true
                },
                scrollbar: {
                    enabled: true
                },
                series: 
                	//result
                	[{
                    	name: money,
                        color: '#24CBE5',
                        type: 'spline',
                        data: result[0].data,
                        tooltip: {
                            valueSuffix: locale.get({lang:"china_yuan"})
                        }

                    }, {
                    	name: count,
                        color: '#458B00',
                        type: 'spline',
                        data: result[1].data,
                        tooltip: {
                            valueSuffix: locale.get({lang:"ren"})
                        }
                    }]   
            });
            
            var charts = $('#line-content').highcharts();
            for(var i in map) {
            	charts.xAxis[0].addPlotLine(
                		{
                            color:'red',            //线的颜色，定义为红色
                            dashStyle:'longdashdot',//标示线的样式，默认是solid（实线），这里定义为长虚线
                            value:parseInt(i),                //定义在哪个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                            width:2,                //标示线的宽度，2px
                            label:{
                                text:map[i],        //标签的内容
                                align:'left',                //标签的水平位置，水平居左,默认是水平居中center
                                x:10,                        //标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'Verdana, sans-serif'
                                    
                                }
                            }
                        }	
                
                );
            }//添加标示线
            
        }
    });
    return trade;

});