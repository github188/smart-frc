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
        	
        	this._renderNoticeBar();
        	this.renderHtml();
        	localStorage.setItem("contentHeight",$("#col_slide_main").height());
        	//$("#trade").css("height",($("#col_slide_main").height() - $(".main_hd").height() -35));
        	
			$("#statistics_tabs").tabs();
			$("#tabs-time").click(function(){
				$("#time_detail_table").css("height",$("#trade_sta_list_table-table").height()+$("#trade_sta_list_paging").height());
			});
			
        },
        _renderNoticeBar:function(){ 
        	 var self=this;
        	 var noticeBar = new NoticeBar({
        		 selector: $("#statistics_bar"),
        		 events:{
        			 query: function(){

                         self.executeSearch(function(startTime, endTime) {
                             var selectedId = $("#reportType").find("option:selected").val();
                             if (selectedId == "1") {
                                 self.getEveryDay(startTime, endTime);
                                 self.getDeviceOnlineSum();
                                 //self.tradeTable.setDataTable(startTime, endTime, assetId);
                             } else if (selectedId == "2") {
                                 self.getEveryMonth(startTime, endTime);
                                 self.getDeviceOnlineSum();
                                 //self.tradeTable.setDataTable(startTime, endTime, assetId);
                             } else if (selectedId == "3") {
                                 self.getEveryYear(startTime, endTime);
                                 self.getDeviceOnlineSum();
                                 //self.tradeTable.setDataTable(startTime, endTime, assetId);
                             }else if (selectedId == "4") {
                                 self.getCustomDay(startTime, endTime);
                                 self.getDeviceOnlineSum();
                                 //self.tradeTable.setDataTable(startTime, endTime, assetId);
                             }
                         });
                     
        			 },
        			 exReport: function(){

	                        self.executeSearch(function(start, end) {
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
			                                 Service.createStatisticExcel(start,end,time,assetId,lineIds,"report.xlsx",function(data){
			                                 	
			                                 	if(data){
			                                 		
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
			                                             		$("#"+id).append("<span class='cloud-button-item cloud-button-text'>导出</span>");
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
                                    self.getEveryDay(startTime, endTime);
                                    //self.tradeTable.setDataTable(startTime, endTime, assetId);
                                } else if (selectedId == "2") {
                                    self.getEveryMonth(startTime, endTime);
                                    //self.tradeTable.setDataTable(startTime, endTime, assetId);
                                } else if (selectedId == "3") {
                                    self.getEveryYear(startTime, endTime);
                                    //self.tradeTable.setDataTable(startTime, endTime, assetId);
                                }else if (selectedId == "4") {
                                    self.getCustomDay(startTime, endTime);
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
                startTime = (new Date(define_startTime + " 00:00:00")).getTime() / 1000;
                endTime = (new Date(define_endTime + " 23:59:59")).getTime() / 1000;  
            }
            
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

            callback(startTime, endTime);

        },
        loadData: function() {
            var myDate = new Date();
            var full = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var date = full + "/" + month + "/" + day;
            var startTime = (new Date(date + " 00:00:00")).getTime() / 1000;
            var endTime = (new Date(date + " 23:59:59")).getTime() / 1000;

            this.getEveryDay(startTime, endTime);
            
            this.getDeviceOnlineSum();
            //this.rendTradeTable(startTime, endTime, null, data);
//            this.tradeTable.setDataTable(startTime, endTime, null);
        },
        rendTradeTable: function(startTime, endTime, data) {

			$("#time_detail_table").html("");
			this.timeTable = new TimeTable({
				"container":"#time_detail_table",
	             startTime:startTime,
	             endTime:endTime,
	             data:data
			});
			
			$("#time_detail_table").css("height",$("#trade_sta_list_table-table").height()+$("#trade_sta_list_paging").height());

        },
        renderChart: function(data) {
        	var self = this;
        	var amount = data.result[0].amountOnLine + data.result[0].amountOutLine;
            var sum = data.result[0].sumOnLine + data.result[0].sumOutLine;
            $("#amount").text(amount.toFixed(2));
            $("#sum").text(sum);
   
                    
            var payStyle = data.result[0].payStyle;
            
            var payStylesum = data.result[0].payStylesum;
            
            
            var payStyles = [];
            var payAmount = [];
            var paySum = [];
            var paySumStyles = [];
            if(payStyle[0][2] > 0){
            	payStyles.push('微信');
            	payAmount.push({'color':'#00CD00','y':payStyle[0][2]/100});
            }
            if(payStyle[1][2] > 0){
            	payStyles.push('支付宝');
            	payAmount.push({'color':'#FD6B6C','y':payStyle[1][2]/100});
            }
            if(payStyle[2][2] > 0){
            	payStyles.push('百付宝');
            	payAmount.push({'color':'#BCBD91','y':payStyle[2][2]/100});
            }
            if(payStyle[3][2] > 0){
            	payStyles.push('现金');
            	payAmount.push({'color':'#ACCCBD','y':payStyle[3][2]/100});
            }
            if(payStyle[4][2] > 0){
            	payStyles.push('声波');
            	payAmount.push({'color':'#CDAD00','y':payStyle[4][2]/100});
            }
            if(payStyle[5][2] > 0){
            	payStyles.push('刷卡');
            	payAmount.push({'color':'#FFD700','y':payStyle[5][2]/100});
            }
            if(payStyle[6][2] > 0){
            	payStyles.push('pos机');
            	payAmount.push({'color':'#EE1289','y':payStyle[6][2]/100});
            }
            if(payStyle[7][2] > 0){
            	payStyles.push('一卡通');
            	payAmount.push({'color':'#F4A460','y':payStyle[7][2]/100});
            }
            if(payStyle[8][2] > 0){
            	payStyles.push('农行掌银');
            	payAmount.push({'color':'#C0FF3E','y':payStyle[8][2]/100});
            }
            if(payStyle[9][2] > 0){
            	payStyles.push('游戏');
            	payAmount.push({'color':'#9F79EE','y':payStyle[9][2]/100});
            }
            if(payStyle[10][2] > 0){
            	payStyles.push('会员支付');
            	payAmount.push({'color':'#FF34B3','y':payStyle[10][2]/100});
            }
            if(payStyle[11][2] > 0){
            	payStyles.push('翼支付');
            	payAmount.push({'color':'#FF34B3','y':payStyle[11][2]/100});
            }
            if(payStyle[12][2] > 0){
            	payStyles.push('京东支付');
            	payAmount.push({'color':'#DB7093','y':payStyle[12][2]/100});
            }
            if(payStyle[13][2] > 0){
            	payStyles.push('微信反扫');
            	payAmount.push({'color':'#76EEC6','y':payStyle[13][2]/100});
            }
            if(payStyle[14][2] > 0){
            	payStyles.push('支付宝反扫');
            	payAmount.push({'color':'#EEEE00','y':payStyle[14][2]/100});
            }
            if(payStyle[16][2] > 0){
            	payStyles.push('银联支付');
            	payAmount.push({'color':'#7D7DFF','y':payStyle[16][2]/100});
            }
            if(payStyle[17][2] > 0){
            	payStyles.push('扫码支付');
            	payAmount.push({'color':'#FF83FA','y':payStyle[17][2]/100});
            }
            if(payStyle[18][2] > 0){
            	payStyles.push('融e联');
            	payAmount.push({'color':'#FF7256','y':payStyle[18][2]/100});
            }
            self.renderPayChart(payStyles,payAmount);
            
            
            if(payStylesum[0][2] > 0){
            	paySumStyles.push('微信');
            	paySum.push({'color':'#00CD00','y':payStylesum[0][2]});
            }
            if(payStylesum[1][2] > 0){
            	paySumStyles.push('支付宝');
            	paySum.push({'color':'#FD6B6C','y':payStylesum[1][2]});
            }
            if(payStylesum[2][2] > 0){
            	paySumStyles.push('百付宝');
            	paySum.push({'color':'#BCBD91','y':payStylesum[2][2]});
            }
            if(payStylesum[3][2] > 0){
            	paySumStyles.push('现金');
            	paySum.push({'color':'#ACCCBD','y':payStylesum[3][2]});
            }
            if(payStylesum[4][2] > 0){
            	paySumStyles.push('声波');
            	paySum.push({'color':'#CDAD00','y':payStylesum[4][2]});
            }
            if(payStylesum[5][2] > 0){
            	paySumStyles.push('刷卡');
            	paySum.push({'color':'#FFD700','y':payStylesum[5][2]});
            }
            if(payStylesum[6][2] > 0){
            	paySumStyles.push('pos机');
            	paySum.push({'color':'#EE1289','y':payStylesum[6][2]});
            }
            if(payStylesum[7][2] > 0){
            	paySumStyles.push('一卡通');
            	paySum.push({'color':'#F4A460','y':payStylesum[7][2]});
            }
            if(payStylesum[8][2] > 0){
            	paySumStyles.push('农行掌银');
            	paySum.push({'color':'#C0FF3E','y':payStylesum[8][2]});
            }
            if(payStylesum[9][2] > 0){
            	paySumStyles.push('游戏');
            	paySum.push({'color':'#9F79EE','y':payStylesum[9][2]});
            }
            if(payStylesum[10][2] > 0){
            	paySumStyles.push('会员支付');
            	paySum.push({'color':'#FF34B3','y':payStylesum[10][2]});
            }
            if(payStylesum[11][2] > 0){
            	paySumStyles.push('翼支付');
            	paySum.push({'color':'#FF34B3','y':payStylesum[11][2]});
            }
            if(payStylesum[12][2] > 0){
            	paySumStyles.push('京东支付');
            	paySum.push({'color':'#DB7093','y':payStylesum[12][2]});
            }
            if(payStylesum[13][2] > 0){
            	paySumStyles.push('微信反扫');
            	paySum.push({'color':'#76EEC6','y':payStylesum[13][2]});
            }
            if(payStylesum[14][2] > 0){
            	paySumStyles.push('支付宝反扫');
            	paySum.push({'color':'#EEEE00','y':payStylesum[14][2]});
            }
            if(payStylesum[16][2] > 0){
            	paySumStyles.push('银联支付');
            	paySum.push({'color':'#7D7DFF','y':payStylesum[16][2]});
            }
            if(payStylesum[17][2] > 0){
            	paySumStyles.push('扫码支付');
            	paySum.push({'color':'#FF83FA','y':payStylesum[17][2]});
            }
            if(payStylesum[18][2] > 0){
            	paySumStyles.push('融e联');
            	paySum.push({'color':'#FF7256','y':payStylesum[18][2]});
            }
            self.renderPaySumChart(paySumStyles,paySum);
                    
        },
        renderPayChart:function(payStyles,payAmount){
        	
        	var wid = $("#line-content").width()*0.48;
            $('#pay-content-amount').highcharts({
                chart: {
                    type: 'column',
                    height: 350,
                    width: wid
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: payStyles
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    min: 0
                },
                legend: {//是否显示底注
                  	 enabled: true
                		 },
                 tooltip: {
                   shared: true,
                   useHTML: true
                 },
                 plotOptions: {
                   column: {
                     pointPadding: 0.2,
                     borderWidth: 0,
                     pointWidth: 20
                   }
                 },
                series: 
                	//result
                	[{
                    	name: '金额',
                        color: '#24CBE5',
                        data: payAmount,
                        tooltip: {
                            valueSuffix: locale.get({lang:"china_yuan"})
                        }

                    }]   
            });
        	
        },
        renderPaySumChart:function(paySumStyles,paySum){
        	
        	var wid = $("#line-content").width()*0.48;
            $('#pay-content-sum').highcharts({
                chart: {
                    type: 'column',
                    height: 350,
                    width: wid
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: paySumStyles
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    min: 0
                },
                legend: {//是否显示底注
                  	 enabled: true
                		 },
                 tooltip: {
                   shared: true,
                   useHTML: true
                 },
                 plotOptions: {
                   column: {
                     pointPadding: 0.2,
                     borderWidth: 0,
                     pointWidth: 20
                   }
                 },
                series: 
                	//result
                	[{
                    	name: '数量',
                        color: '#458B00',
                        data: paySum,
                        tooltip: {
                            valueSuffix: locale.get({lang:"ren"})
                        }

                    }]   
            });
        	
        },
        getDeviceOnlineSum:function() {
            var self = this;
            var orgIds;
            require(["cloud/lib/plugin/jquery.multiselect"], function() {
            	orgIds = $("#organ").multiselect("getChecked").map(function() {
                    return this.value;
                }).get();
            	
            	var oidArray=[];
            	Service.getAllOrgan(function(data){
            		if(orgIds.length == data.tota){
            			orgIds = [];
            		}
            		
            		Service.getAdminOnlineAllStatistic(orgIds, function(data_) {
                		
                		$("#online").text(data_.result);
                    });
            		
            	});
            	
            	
            	
            });
        },
        getEveryDay: function(startTime, endTime) {
        	cloud.util.mask("#trade");
            var self = this;
            var orgIds;
            require(["cloud/lib/plugin/jquery.multiselect"], function() {
            	orgIds = $("#organ").multiselect("getChecked").map(function() {//
                    return this.value;
                }).get();
            	Service.getAdminDayAllStatistic(startTime, endTime, orgIds, function(data) {
                    if (data.result.length) {
                    	self.rendTradeTable(startTime, endTime, data);
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
            	
            });

            
            //var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            //var roleType = permission.getInfo().roleType;
            
        },
        getEveryMonth: function(startTime, endTime) {
        	cloud.util.mask("#trade");
            var self = this;
            var orgIds;
            require(["cloud/lib/plugin/jquery.multiselect"], function() {
            	orgIds = $("#organ").multiselect("getChecked").map(function() {//
                    return this.title;
                }).get();
            });
            //var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            //var roleType = permission.getInfo().roleType;
            Service.getAdminMonthAllStatistic(startTime, endTime, orgIds, function(data) {
                if (data.result.length) {
                	self.rendTradeTable(startTime, endTime, data);
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
            
        },
        getEveryYear: function(startTime, endTime) {
        	cloud.util.mask("#trade");
            var self = this;
            var orgIds;
            require(["cloud/lib/plugin/jquery.multiselect"], function() {
            	orgIds = $("#organ").multiselect("getChecked").map(function() {//
                    return this.title;
                }).get();
            });
            //var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            //var roleType = permission.getInfo().roleType;
            Service.getAdminYearAllStatistic(startTime, endTime,orgIds, function(data) {
                if (data.result.length) {
                	self.rendTradeTable(startTime, endTime, data);
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
           
        },
        getCustomDay:function(startTime, endTime) {
        	cloud.util.mask("#trade");
            var self = this;
            var orgIds;
            require(["cloud/lib/plugin/jquery.multiselect"], function() {
            	orgIds = $("#organ").multiselect("getChecked").map(function() {//
                    return this.title;
                }).get();
            });
            
            //var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            //var roleType = permission.getInfo().roleType;
            Service.getAdminCustomAllStatistic(startTime, endTime,orgIds, function(data) {
                if (data.result.length) {
                	self.rendTradeTable(startTime, endTime, data);
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