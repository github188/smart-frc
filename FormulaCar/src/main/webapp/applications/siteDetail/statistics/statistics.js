define(function(require){
	var cloud = require("cloud/base/cloud");
    var Button = require("cloud/components/button");
	var validator = require("cloud/components/validator");
	var html = require("text!./statistics.html");
	require("../css/default.css");
	var highcharts = require("cloud/components/chart");
	var Service = require("../service");
	var tradeMsg = require("./tradelist");
	
	var trade = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.elements = {
					head : {
						id : "tradeHeads",
						"class" : null
					},
					footer : {
						id : "tradeContents",
						"class" : null
					}
				};
			
			this.element.html(html);
			locale.render({element:this.element});
			this.siteId = options.siteId;
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
		_render:function(){
			this.renderHtml();
			this.renderEvent();
			this.renderSelect();
			this.loadData();
			this.renderTradeRecord();
		},
		renderTradeRecord:function(){
			this.tradeList=new tradeMsg({
                "container":"#tradeContents",
                "siteId":this.siteId
			});
		},
		renderHtml:function(){
			$("#reportType").append("<option value='1' selected='selected'>"+locale.get({lang:"daily_chart"})+"</option>");
			$("#reportType").append("<option value='2'>"+locale.get({lang:"monthly_report"})+"</option>");
			$("#reportType").append("<option value='3'>"+locale.get({lang:"year_report"})+"</option>");
			$("#summary_month").css("display","none");
			$("#summary_year").css("display","none");
		    $("#summary_month").val("");
            $("#summary_year").val("");
		},
		renderEvent:function(){
			var self = this;
			$("#reportType").bind('change', function () {
				var selectedId = $("#reportType").find("option:selected").val();
				if(selectedId == "1"){
					$("#summary_month").css("display","none");
					$("#summary_year").css("display","none");
					$("#summary_date").css("display","block");
					$("#summary_year").val("");
					$("#summary_month").val("");
					$("#summary_date").val(cloud.util.dateFormat(new Date(((new Date()).getTime())/1000),"yyyy/MM/dd"));
				}else if(selectedId == "2"){
					$("#summary_date").css("display","none");
					$("#summary_year").css("display","none");
					$("#summary_month").css("display","block");
					$("#summary_date").val("");
					$("#summary_year").val("");
					$("#summary_month").val(cloud.util.dateFormat(new Date(((new Date()).getTime())/1000),"yyyy/MM"));
				}else if(selectedId == "3"){
					$("#summary_date").css("display","none");
					$("#summary_month").css("display","none");
					$("#summary_year").css("display","block");
					$("#summary_date").val("");
					$("#summary_month").val("");
				}
			});
			//查询
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#buttonDiv"),
                events: {
                    click: function(){
                    	var byDate = "";
                        var byMonth = "";
                        var byYear = "";
                        var startTime = '';  
                        var endTime = ''; 
                        
                    	var selectedId = $("#reportType").find("option:selected").val();
        				if(selectedId == "1"){
        					var byDate = $("#summary_date").val();//日
        				}else if(selectedId == "2"){
        					var byMonth = $("#summary_month").val();//月
        				}else if(selectedId == "3"){
        					var byYear = $("#summary_year").val();//年
        				}
                       
                        //日报表
                        if(byDate){
                        	startTime = (new Date(byDate + " 00:00:00")).getTime()/1000;  
                        	endTime = (new Date(byDate + " 23:59:59")).getTime()/1000; 
                            self.getEveryDay(startTime,endTime);
                        }
                        //月报表
                        if(byMonth){
                        	var year = byMonth.split('/')[0];
                        	
                            var months = byMonth.split('/')[1];
                        	var  maxday = new Date(year,months,0).getDate();
                     	   if(months == 1 || months ==3 || months == 5 || months == 7 || months ==8 || months == 10 || months == 12){
                     		  startTime = (new Date(byMonth +"/01"+ " 00:00:00")).getTime()/1000;  
                     		  endTime = (new Date(byMonth +"/31"+ " 23:59:59")).getTime()/1000; 
                     	   }else if(months == 2){
                     		  startTime = (new Date(byMonth +"/01"+ " 00:00:00")).getTime()/1000;  
                     		  endTime = (new Date(byMonth +"/" +maxday+ " 23:59:59")).getTime()/1000;
                     	   }else{
                     		  startTime = (new Date(byMonth +"/01"+ " 00:00:00")).getTime()/1000;    
                     		  endTime = (new Date(byMonth +"/30"+ " 23:59:59")).getTime()/1000;
                     	   }
                     	  self.getEveryMonth(startTime,endTime);
                       }
                       //年报表
                        if(byYear){
                        	startTime = (new Date(byYear +"/01/01"+ " 00:00:00")).getTime()/1000; 
                    		endTime = (new Date(byYear +"/12/31"+ " 23:59:59")).getTime()/1000;
                    		self.getEveryYear(startTime,endTime);
                        }
                        self.tradeList.setDataTable(startTime,endTime);
                    }
                }
            });
		},
		renderSelect:function(){
			$(function(){
				$("#summary_date").val(cloud.util.dateFormat(new Date(((new Date()).getTime())/1000),"yyyy/MM/dd")).datetimepicker({
					format:'Y/m/d',
					step:1,
					startDate:'-1970/01/08',
					lang:locale.current() === 1 ? "en" : "ch",
					timepicker:false,
					onShow:function(){
						$(".xdsoft_calendar").show();
					},
					onChangeMonth:function(a,b){
						var date = new Date(new Date(a).getTime()/1000);
						b.val(cloud.util.dateFormat(date,"yyyy/MM/dd"));
					},
					onClose:function(a,b){
						var date = new Date(new Date(a).getTime()/1000);
						b.val(cloud.util.dateFormat(date,"yyyy/MM/dd"));
					},
				})
				
				$("#summary_month").val(cloud.util.dateFormat(new Date(((new Date()).getTime())/1000),"yyyy/MM")).datetimepicker({
					timepicker:false,
					format:'Y/m',
					onShow:function(){
						$(".xdsoft_calendar").hide();
					},
					onChangeMonth:function(a,b){
						var date = new Date(new Date(a).getTime()/1000);
						b.val(cloud.util.dateFormat(date,"yyyy/MM"));
					},
					onClose:function(a,b){
						var date = new Date(new Date(a).getTime()/1000);
						b.val(cloud.util.dateFormat(date,"yyyy/MM"));
					},
					lang:locale.current() === 1 ? "en" : "ch"
				})
			});
		},
		loadData:function(){
			var myDate=new Date();
			var full = myDate.getFullYear(); 
			var month = myDate.getMonth() +1;
			var day = myDate.getDate();
			var date =  full+"/"+month+"/"+day;
			var startTime = (new Date(date+" 00:00:00")).getTime()/1000; 
			var endTime =(new Date(date+" 23:59:59")).getTime()/1000;
			this.getEveryDay(startTime,endTime);
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
            Service.getPayList(function(paydata) {
            	    var payamount = amount.toFixed(2);
            	    var paysum = sum;
                	var getStaticType = [];
                	
                	if(paydata.result && paydata.result.payStyle.length>0){
                		
                		for(var i=0;i<paydata.result.payStyle.length;i++){
                			var pays = paydata.result.payStyle[i];
                			if(pays == "baifubao"){
                				getStaticType.push("百付宝");
                			}else if(pays == "soundWave"){
                				getStaticType.push("声波");
                			}else if(pays == "swingCard"){
                				getStaticType.push("刷卡");
                			}else if(pays == "oneCard"){
                				getStaticType.push("一卡通");
                			}else if(pays == "abc"){
                				getStaticType.push("农行掌银");
                			}else if(pays == "pos"){
                				getStaticType.push("POS机");
                			}else if(pays == "game"){
                				getStaticType.push("游戏");
                			}	                    			                    			
                			
                		}
                		
                	}else{
                		
                		$("#colorPayStyleTr").parent().parent().css("width","50%");
                		$("#colorPayStyleTr").parent().parent().css("margin-left","25%");
                	}

                    var allAmount = 1;
                    //console.log(paydata);
                    var payStyle = data.result[0].payStyle;
                    var Wechat_amount = (payStyle[0][1] * 100).toFixed(2);
                    var Alipay_amount = (payStyle[1][1] * 100).toFixed(2);
                    var other_amount = (payStyle[3][1] * 100).toFixed(2);
                    
                    $("#payAlert").append("<span>"+ locale.get({lang: "we_chat"}) +":</span><span>&nbsp;"+payStyle[0][2]/100+"￥&nbsp;("+Wechat_amount+"%)</span>&nbsp;&nbsp;");
                    $("#payAlert").append("<span>"+ locale.get({lang: "alipay"}) +":</span><span>&nbsp;"+payStyle[1][2]/100+"￥&nbsp;("+Alipay_amount+"%)</span>&nbsp;&nbsp;");
                    $("#payAlert").append("<span>"+ locale.get({lang: "cash"}) +":</span><span>&nbsp;"+payStyle[3][2]/100+"￥&nbsp;("+other_amount+"%)</span><br>");
                    
                    $("#colorPayStyleTr").append("<td><div style='height: 10px;width: 10px;background-color: #00CD00;'></div></td><td><div><span>"+ locale.get({lang: "trade_wx_pay"}) +"</span></div></td>");
                    $("#colorPayStyleTr").append("<td><div style='height: 10px;width: 10px;background-color: #FD6B6C;'></div></td><td><div><span>"+ locale.get({lang: "trade_alipay"}) +"</span></div></td>");
                    $("#colorPayStyleTr").append("<td><div style='height: 10px;width: 10px;background-color: #ACCCBD;'></div></td><td><div><span>"+ locale.get({lang: "trade_cash_payment"}) +"</span></div></td>");
                    
                    if (Wechat_amount != 0.00) {
                        $("#payStyleTr").append("<td width='" + Wechat_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #00CD00;'></div></td>");
                        
                    } 

                    if (Alipay_amount != 0.00) {
                        $("#payStyleTr").append("<td width='" + Alipay_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #FD6B6C;'></div></td>");
                        
                    } 

                    if (other_amount != 0.00) {
                        $("#payStyleTr").append("<td width='" + other_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #ACCCBD;'></div></td>");
                        
                    } 
                    
                    allAmount = allAmount - (payStyle[0][1] + payStyle[1][1] + payStyle[3][1]);
                    payamount = payamount - (payStyle[0][2] + payStyle[1][2] + payStyle[3][2])/100;
                    
                    var countrow = 1;
                    for(var i = 0;i<getStaticType.length;i++){
                    	var payS = getStaticType[i];
                    	for(var j = 0;j<payStyle.length;j++){
                    		var tempPayS = payStyle[j][0];
                    		if(payS == tempPayS){
                    			allAmount = allAmount - payStyle[j][1];
                    			payamount = payamount - payStyle[j][2]/100;
                    			if(payStyle[j][1] && payStyle[j][1] != "0"){
                    				if(tempPayS == "刷卡"){
                    					$("#payStyleTr").append("<td width='" + (payStyle[j][1] * 100).toFixed(2) + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #FFD700;'></div></td>");
                    					$("#colorPayStyleTr").append("<td><div style='height: 10px;width: 10px;background-color: #FFD700;'></div></td><td><div><span>"+ locale.get({lang: "trade_swingCard_pay"}) +"</span></div></td>");
                    					if(countrow >=3){
                    						$("#payAlert").append("<span>"+ locale.get({lang: "trade_swing_card"}) +":</span><span>&nbsp;"+payStyle[j][2]/100+"￥&nbsp;("+(payStyle[j][1] * 100).toFixed(2)+"%)</span><br>");
                    						countrow = 0;
                    					}else{
                    						$("#payAlert").append("<span>"+ locale.get({lang: "trade_swing_card"}) +":</span><span>&nbsp;"+payStyle[j][2]/100+"￥&nbsp;("+(payStyle[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;");
                    						countrow++;
                    					}
                    					
                    				}else if(tempPayS == "一卡通"){
                    					$("#payStyleTr").append("<td width='" + (payStyle[j][1] * 100).toFixed(2) + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #F4A460;'></div></td>");
                    					$("#colorPayStyleTr").append("<td><div style='height: 10px;width: 10px;background-color: #F4A460;'></div></td><td><div><span>"+ locale.get({lang: "trade_oneCard_pay"}) +"</span></div></td>");
                    					if(countrow >=3){
                    						$("#payAlert").append("<span>"+ locale.get({lang: "one_card_solution"}) +":</span><span>&nbsp;"+payStyle[j][2]/100+"￥&nbsp;("+(payStyle[j][1] * 100).toFixed(2)+"%)</span><br>");
                    						countrow = 0;
                    					}else{
                    						$("#payAlert").append("<span>"+ locale.get({lang: "one_card_solution"}) +":</span><span>&nbsp;"+payStyle[j][2]/100+"￥&nbsp;("+(payStyle[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;");
                    						countrow++;
                    					}
                    					
                    				}else if(tempPayS == "POS机"){
                    					$("#payStyleTr").append("<td width='" + (payStyle[j][1] * 100).toFixed(2) + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #EE1289;'></div></td>");
                    					$("#colorPayStyleTr").append("<td><div style='height: 10px;width: 10px;background-color: #EE1289;'></div></td><td><div><span>"+ locale.get({lang: "trade_pos_pay"}) +"</span></div></td>");
                    					if(countrow >=3){
                    						$("#payAlert").append("<span>"+ locale.get({lang: "trade_pos_mach"}) +":</span><span>&nbsp;"+payStyle[j][2]/100+"￥&nbsp;("+(payStyle[j][1] * 100).toFixed(2)+"%)</span><br>");
                    						countrow = 0;
                    					}else{
                    						$("#payAlert").append("<span>"+ locale.get({lang: "trade_pos_mach"}) +":</span><span>&nbsp;"+payStyle[j][2]/100+"￥&nbsp;("+(payStyle[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;");
                    						countrow++;
                    					}
                    					
                    				}else if(tempPayS == "农行掌银"){
                    					$("#payStyleTr").append("<td width='" + (payStyle[j][1] * 100).toFixed(2) + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #C0FF3E;'></div></td>");
                    					$("#colorPayStyleTr").append("<td><div style='height: 10px;width: 10px;background-color: #C0FF3E;'></div></td><td><div><span>"+ locale.get({lang: "trade_ABC_Palm_Bank"}) +"</span></div></td>");
                    					if(countrow >=3){
                    						$("#payAlert").append("<span>"+ locale.get({lang: "trade_abc"}) +":</span><span>&nbsp;"+payStyle[j][2]/100+"￥&nbsp;("+(payStyle[j][1] * 100).toFixed(2)+"%)</span><br>");
                    						countrow = 0;
                    					}else{
                    						$("#payAlert").append("<span>"+ locale.get({lang: "trade_abc"}) +":</span><span>&nbsp;"+payStyle[j][2]/100+"￥&nbsp;("+(payStyle[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;");
                    						countrow++;
                    					}
                    					
                    				}else if(tempPayS == "声波"){
                    					$("#payStyleTr").append("<td width='" + (payStyle[j][1] * 100).toFixed(2) + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #CDAD00;'></div></td>");
                    					$("#colorPayStyleTr").append("<td><div style='height: 10px;width: 10px;background-color: #CDAD00;'></div></td><td><div><span>"+ locale.get({lang: "trade_soundwave_pay"}) +"</span></div></td>");
                    					if(countrow >=3){
                    						$("#payAlert").append("<span>"+ locale.get({lang: "trade_soundware"}) +":</span><span>&nbsp;"+payStyle[j][2]/100+"￥&nbsp;("+(payStyle[j][1] * 100).toFixed(2)+"%)</span><br>");
                    						countrow = 0;
                    					}else{
                    						$("#payAlert").append("<span>"+ locale.get({lang: "trade_soundware"}) +":</span><span>&nbsp;"+payStyle[j][2]/100+"￥&nbsp;("+(payStyle[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;");
                    						countrow++;
                    					}
                    					
                    				}else if(tempPayS == "百付宝"){
                    					$("#payStyleTr").append("<td width='" + (payStyle[j][1] * 100).toFixed(2) + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #BCBD91;'></div></td>");
                    					$("#colorPayStyleTr").append("<td><div style='height: 10px;width: 10px;background-color: #BCBD91;'></div></td><td><div><span>"+ locale.get({lang: "trade_baifubao"}) +"</span></div></td>");
                    					if(countrow >=3){
                    						$("#payAlert").append("<span>"+ locale.get({lang: "baifubao"}) +":</span><span>&nbsp;"+payStyle[j][2]/100+"￥&nbsp;("+(payStyle[j][1] * 100).toFixed(2)+"%)</span>;<br>");
                    						countrow = 0;
                    					}else{
                    						$("#payAlert").append("<span>"+ locale.get({lang: "baifubao"}) +":</span><span>&nbsp;"+payStyle[j][2]/100+"￥&nbsp;("+(payStyle[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;");
                    						countrow++;
                    					}
                    					
                    				}else if(tempPayS == "游戏"){
                    					$("#payStyleTr").append("<td width='" + (payStyle[j][1] * 100).toFixed(2) + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #9F79EE;'></div></td>");
                    					$("#colorPayStyleTr").append("<td><div style='height: 10px;width: 10px;background-color: #9F79EE;'></div></td><td><div><span>"+ locale.get({lang: "trade_game_pay"}) +"</span></div></td>");
                    					if(countrow >=3){
                    						$("#payAlert").append("<span>"+ locale.get({lang: "trade_game"}) +":</span><span>&nbsp;"+payStyle[j][2]/100+"￥&nbsp;("+(payStyle[j][1] * 100).toFixed(2)+"%)</span><br>");
                    						countrow = 0;
                    					}else{
                    						$("#payAlert").append("<span>"+ locale.get({lang: "trade_game"}) +":</span><span>&nbsp;"+payStyle[j][2]/100+"￥&nbsp;("+(payStyle[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;");
                    						countrow++;
                    					}
                    					
                    				}
                    				
                    				
                    				
                    			}
                    			
                    		}
                    		
                    	}
                    	
                    	
                    }
                    var otherPay_amount = (allAmount * 100).toFixed(2);
                    
                    if (otherPay_amount != 0.00 && otherPay_amount != 100.00) {
                        $("#payStyleTr").append("<td width='" + otherPay_amount + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #9C9C9C;'></div></td>");
                        $("#colorPayStyleTr").append("<td><div style='height: 10px;width: 10px;background-color: #9C9C9C;'></div></td><td><div><span>"+ locale.get({lang: "trade_other"}) +"</span></div></td>");
                        $("#colorPayStyleTr").parent().parent().css("width","90%");
                		$("#colorPayStyleTr").parent().parent().css("margin-left","5%");
                		$("#payAlert").append("<span>"+ locale.get({lang: "other"}) +":</span><span>&nbsp;"+payamount.toFixed(2)+"￥&nbsp;("+otherPay_amount+"%)</span>&nbsp;&nbsp;");
                    }else{
                    	$("#colorPayStyleTr").parent().parent().css("width","50%");
                		$("#colorPayStyleTr").parent().parent().css("margin-left","25%");
                    } 

                    $("#payStyleSumTr").empty();
                    
                    var allSum = 1;
                    var payStylesum = data.result[0].payStylesum;
                    
                    var Wechat_sum = (payStylesum[0][1] * 100).toFixed(2);
                    var Alipay_sum = (payStylesum[1][1] * 100).toFixed(2);                   
                    var other_sum = (payStylesum[3][1] * 100).toFixed(2);
                                    
                    if (Wechat_sum != 0.00) {
                        $("#payStyleSumTr").append("<td width='" + Wechat_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #00CD00;'></div></td>");
                    } 

                    if (Alipay_sum != 0.00) {
                        $("#payStyleSumTr").append("<td width='" + Alipay_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #FD6B6C;'></div></td>");
                    } 

                    if (other_sum != 0.00) {
                        $("#payStyleSumTr").append("<td width='" + other_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #ACCCBD;'></div></td>");
                    } 
                    $("#payAlertSum").append("<span>"+ locale.get({lang: "we_chat"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[0][2]+"&nbsp;&nbsp;("+Wechat_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
                    $("#payAlertSum").append("<span>"+ locale.get({lang: "alipay"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[1][2]+"&nbsp;&nbsp;("+Alipay_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
                    $("#payAlertSum").append("<span>"+ locale.get({lang: "cash"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[3][2]+"&nbsp;&nbsp;("+other_sum+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
                    
                    allSum = allSum - (payStylesum[0][1] + payStylesum[1][1] + payStylesum[3][1]);
                    paysum = paysum - (payStylesum[0][2] + payStylesum[1][2] + payStylesum[3][2]);
                    
                    var countsumrow = 1;
                    for(var i = 0;i<getStaticType.length;i++){
                    	var payS = getStaticType[i];
                    	for(var j = 0;j<payStylesum.length;j++){
                    		var tempPayS = payStylesum[j][0];
                    		if(payS == tempPayS){
                    			allSum = allSum - payStylesum[j][1];
                    			paysum = paysum - payStylesum[j][2];
                    			if(payStylesum[j][1] && payStylesum[j][1] != "0"){
                    				if(tempPayS == "刷卡"){
                    					$("#payStyleSumTr").append("<td width='" + (payStylesum[j][1] * 100).toFixed(2) + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #FFD700;'></div></td>");
                    					if(countsumrow >=3){
                    						$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_swing_card"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[j][2]+"&nbsp;&nbsp;("+(payStylesum[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
                    						countsumrow = 0;
                    					}else{
                    						$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_swing_card"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[j][2]+"&nbsp;&nbsp;("+(payStylesum[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;&nbsp;");
                    						countsumrow++;
                    					}
                    					
                    				}else if(tempPayS == "一卡通"){
                    					$("#payStyleSumTr").append("<td width='" + (payStylesum[j][1] * 100).toFixed(2) + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #F4A460;'></div></td>");
                    					if(countsumrow >=3){
                    						$("#payAlertSum").append("<span>"+ locale.get({lang: "one_card_solution"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[j][2]+"&nbsp;&nbsp;("+(payStylesum[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
                    						countsumrow = 0;
                    					}else{
                    						$("#payAlertSum").append("<span>"+ locale.get({lang: "one_card_solution"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[j][2]+"&nbsp;&nbsp;("+(payStylesum[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;&nbsp;");
                    						countsumrow++;
                    					}
                    					
                    				}else if(tempPayS == "POS机"){
                    					$("#payStyleSumTr").append("<td width='" + (payStylesum[j][1] * 100).toFixed(2) + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #EE1289;'></div></td>");
                    					if(countsumrow >=3){
                    						$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_pos_mach"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[j][2]+"&nbsp;&nbsp;("+(payStylesum[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
                    						countsumrow = 0;
                    					}else{
                    						$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_pos_mach"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[j][2]+"&nbsp;&nbsp;("+(payStylesum[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;&nbsp;");
                    						countsumrow++;
                    					}
                    					
                    				}else if(tempPayS == "农行掌银"){
                    					$("#payStyleSumTr").append("<td width='" + (payStylesum[j][1] * 100).toFixed(2) + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #C0FF3E;'></div></td>");
                    					//console.log(countsumrow);
                    					if(countsumrow >=3){
                    						$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_abc"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[j][2]+"&nbsp;&nbsp;("+(payStylesum[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
                    						countsumrow = 0;
                    					}else{
                    						$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_abc"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[j][2]+"&nbsp;&nbsp;("+(payStylesum[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;&nbsp;");
                    						countsumrow++;
                    					}
                    					
                    				}else if(tempPayS == "声波"){
                    					$("#payStyleSumTr").append("<td width='" + (payStylesum[j][1] * 100).toFixed(2) + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #CDAD00;'></div></td>");
                    					if(countsumrow >=3){
                    						$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_soundware"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[j][2]+"&nbsp;&nbsp;("+(payStylesum[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
                    						countsumrow = 0;
                    					}else{
                    						$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_soundware"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[j][2]+"&nbsp;&nbsp;("+(payStylesum[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;&nbsp;");
                    						countsumrow++;
                    					}
                    					
                    				}else if(tempPayS == "百付宝"){
                    					$("#payStyleSumTr").append("<td width='" + (payStylesum[j][1] * 100).toFixed(2) + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #BCBD91;'></div></td>");
                    					if(countsumrow >=3){
                    						$("#payAlertSum").append("<span>"+ locale.get({lang: "baifubao"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[j][2]+"&nbsp;&nbsp;("+(payStylesum[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
                    						countsumrow = 0;
                    					}else{
                    						$("#payAlertSum").append("<span>"+ locale.get({lang: "baifubao"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[j][2]+"&nbsp;&nbsp;("+(payStylesum[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;&nbsp;");
                    						countsumrow++;
                    					}
                    					
                    				}else if(tempPayS == "游戏"){
                    					$("#payStyleSumTr").append("<td width='" + (payStylesum[j][1] * 100).toFixed(2) + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #9F79EE;'></div></td>");
                    					if(countsumrow >=3){
                    						$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_game"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[j][2]+"&nbsp;&nbsp;("+(payStylesum[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;&nbsp;<br>");
                    						countsumrow = 0;
                    					}else{
                    						$("#payAlertSum").append("<span>"+ locale.get({lang: "trade_game"}) +":</span><span>&nbsp;&nbsp;"+payStylesum[j][2]+"&nbsp;&nbsp;("+(payStylesum[j][1] * 100).toFixed(2)+"%)</span>&nbsp;&nbsp;&nbsp;");
                    						countsumrow++;
                    					}
                    					
                    				}
                    				
                    			}
                    			
                    		}
                    		
                    	}
                    	
                    	
                    }
                    var otherPay_sum = (allSum * 100).toFixed(2);
                    
                    if (otherPay_sum != 0.00  && otherPay_sum != 100.00) {
                        $("#payStyleSumTr").append("<td width='" + otherPay_sum + "%" + "'><div style='height: 30px;line-height: 30px;text-align: center;color: white;background-color: #9C9C9C;'></div></td>");
                        $("#payAlertSum").append("<span>"+ locale.get({lang: "other"}) +":</span><span>&nbsp;&nbsp;"+paysum+"&nbsp;&nbsp;("+otherPay_sum+"%)</span>&nbsp;&nbsp;&nbsp;");
                    } 
            	
            });
        	
        },
        getEveryDay: function(startTime, endTime) {
            var self = this;
            Service.getDayAllStatisticBySiteId(self.siteId,startTime,endTime, function(data) {
                if (data.result.length) {
                   
                	self.renderChart(data);
                    
                    var sumAmount = data.result[0].sumAmount;
                    var languge = localStorage.getItem("language");
                    if (languge == "en") {
                        sumAmount[0].name = 'amount';
                        sumAmount[1].name = 'volume';
                    }
                    var newTimes = ["0:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
                    self.renderLineChart(sumAmount, newTimes);
                }   
            });
        },
        getEveryMonth: function(startTime, endTime) {
            var self = this;
        	var date = new Date();
			var offset = 0 - (date.getTimezoneOffset()*60*1000);
            Service.getMonthAllStatisticBySiteId(self.siteId,offset,startTime,endTime, function(data) {
                if (data.result.length) {
                    
                	self.renderChart(data);
                	
                    var languge = localStorage.getItem("language");
                    var sumAmount = data.result[0].sumAmount;
                    if (languge == "en") {
                        sumAmount[0].name = 'amount';
                        sumAmount[1].name = 'volume';
                    }
                    var byMonth = $("#summary_month").val();
                    var months = byMonth.split('/')[1];
                    var newTimes = [];
                    if (months == 1 || months == 3 || months == 5 || months == 7 || months == 8 || months == 10 || months == 12) {
                        newTimes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
                    } else if (months == 2) {
                        newTimes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"];
                    } else {
                        newTimes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"];
                    }

                    self.renderLineChart(sumAmount, newTimes);
                }
            });
        },
        getEveryYear: function(startTime, endTime) {
            var self = this;
        	var date = new Date();
			var offset = 0 - (date.getTimezoneOffset()*60*1000);
            Service.getYearAllStatisticBySiteId(self.siteId,offset,startTime,endTime, function(data) {
                if (data.result.length) {
                    
                	self.renderChart(data);
                	
                    var languge = localStorage.getItem("language");
                    var sumAmount = data.result[0].sumAmount;
                    if (languge == "en") {
                        sumAmount[0].name = 'amount';
                        sumAmount[1].name = 'volume';
                    }
                    var newTimes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
                    self.renderLineChart(sumAmount, newTimes);
                }
            });
        },
	
		renderLineChart:function(result,newTimes){
	           $('#line-content').highcharts({
	    	        chart: {
	    	        	type:'spline',
	    	            height:350,
	                    width:1200
	    	        },
	    	        colors: ['#24CBE5', '#458B00'],
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
	    	        series:result
	    	    });
	       }
	});	
	return trade;
    
});