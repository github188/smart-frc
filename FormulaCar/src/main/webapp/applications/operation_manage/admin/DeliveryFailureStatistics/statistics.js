define(function(require){
	var cloud = require("cloud/base/cloud");
    var Button = require("cloud/components/button");
	var validator = require("cloud/components/validator");
	var html = require("text!./statistics.html");
	require("./css/default.css");
	require("cloud/components/chart");
	var TradeTable = require("./table/content");
	var Service = require("./service");
	var trade = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.elements = {
					head : {
						id : "tradeHead",
						"class" : null
					},
					content: {
	                    id: "tradeContent"
	                },
					footer : {
						id : "tradeFooter",
						"class" : null
					}
				};
			
			this.element.html(html);
			locale.render({element:this.element});
			this._render();
		},
		_render:function(){
			this.renderHtml();
			this.renderEvent();
			this.renderSelect();
			this.loadData();
			var height = localStorage.getItem("contentHeight");
			$("#trade").css("width",$(".wrap").width());
			$("#tradeHead").css("width",$(".wrap").width());
			
			$("#trade").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			$("#autoNum").append("<label style='margin-left: -5px;' for='organ_autoName'>"+locale.get('trade_organ_name')+"</label>"+
			  			         "<input style='width:232px;margin-left: 5px;' type='text' value='' id='organ_autoName' placeholder='"+locale.get('more_organ_query')+"'/>&nbsp;&nbsp;");
		},
		getAssetIdOfLine:function(){
			 var self = this;
			 Service.getAssetIdInfoByline(function(data){
				 var assetIdData = data;;
			     self.renderHtml();
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
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
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
		rendTradeTable: function(finalData,organDeliveryFailureCount) {
             this.tradeTable = new TradeTable({
            		 selector: "#" + this.elements.content.id,
            		 data:finalData,
            		 count:organDeliveryFailureCount
             });
            		
        },
        doResultData:function(data){
        	var self = this;
        	if(data.result){
 		        var organList = data.result[0].organList;
 		        var organDeliveryFailureCount =  data.result[0].organDeliveryFailureCount;
 		        self.rendTradeTable(organList,organDeliveryFailureCount);
 		        
 		    	var organAmount = data.result[0].organDeliveryFailureCount;
 		    	
 		    	if(organAmount.length > 10){
          			var neworganAmount=[];
          			for(var i=0;i<organAmount.length;i++){
          				if(i>9){
          				}else{
          				   var array = organAmount[i].split("||");
             			   neworganAmount.push(parseInt(array[1]));
          				}
          			}
          			organAmount = neworganAmount;
          	    }else{
          	    	var neworganAmount=[];
          			for(var i=0;i<organAmount.length;i++){
          			   var array = organAmount[i].split("||");
          			   neworganAmount.push(parseInt(array[1]));
          			}
          			organAmount = neworganAmount;
          	    }
 		    	
 				var organName =data.result[0].organName;
 				if(organName.length > 10){
          			var neworganName=[];
          			for(var i=0;i<organName.length;i++){
          				if(i>9){
          				}else{
          					neworganName.push(organName[i]);
          				}
          			}
          			organName = neworganName;
          	    }
 				
 		    	self.renderbarChart(organName,organAmount);//机构出货失败排名top10
 		    	
 		    	var payStyle =data.result[0].payStyleName;
 		    	if(payStyle && payStyle.length>0){
 		    		for(var i=0;i<payStyle.length;i++){
 		    			if(payStyle[i] == 'baifubao'){
         		    		payStyle[i] ='百付宝';
         		    	}else if(payStyle[i] == 'weixin'){
         		    		payStyle[i] ='微信支付';
         		    	}else if(payStyle[i] == 'alipay'){
         		    		payStyle[i] ='支付宝';
         		    	}else if(payStyle[i] == 'cash'){
         		    		payStyle[i] ='现金支付';
         		    	}else if(payStyle[i] == 'swingcard'){
         		    		payStyle[i] ='刷卡';
         		    	}else if(payStyle[i] == 'scannercard'){
         		    		payStyle[i] ='扫胸牌';
         		    	}else if(payStyle[i] == 'claimnumber'){
         		    		payStyle[i] ='取货码';
         		    	}else if(payStyle[i] == 'game'){
         		    		payStyle[i] ='游戏';
         		    	}else if(payStyle[i] == 'soundwave'){
         		    		payStyle [i]='声波支付';
         		    	}else if(payStyle[i] == 'posmach'){
         		    		payStyle[i] ='POS机';
         		    	}else if(payStyle[i] == 'onecardsolution'){
         		    		payStyle[i]='一卡通';
         		    	}else if(payStyle[i] == 'abc'){
         		    		payStyle[i] ='农行掌银支付';
         		    	}else if(payStyle[i] == 'wechatreversescan'){
         		    		payStyle[i] ='微信反扫';
         		    	}else if(payStyle[i] == 'vip'){
         		    		payStyle[i] ='会员支付';
         		    	}else if(payStyle[i] == 'bestpay'){
         		    		payStyle[i] ='翼支付';
         		    	}else if(payStyle[i] == 'jd'){
         		    		payStyle[i] ='京东支付';
         		    	}else if(payStyle[i] == 'reversescan'){
         		    		payStyle[i] ='支付宝反扫';
         		    	}else if(payStyle[i] == 'integralexchange'){
         		    		payStyle[i] ='积分兑换';
         		    	}else if(payStyle[i] == 'unionpay'){
         		    		payStyle[i] ='银联支付';
         		    	}else if(payStyle[i] == 'qrcodepay'){
         		    		payStyle[i] ='扫码支付';
         		    	}else if(payStyle[i] == 'icbcpay'){
         		    		payStyle[i] ='融e联';
         		    	}
 		    		}
 		    	}
 		    	
 				var deliverySum =data.result[0].payStyleSum;
 				self.renderColumnChart(payStyle,deliverySum);//柱状图
			    cloud.util.unmask("#trade");
			 }
        },
		getEveryDay:function(startTime,endTime){
			cloud.util.mask("#trade");
			var self = this;
			var orgName = $("#organ_autoName").val();
			if(orgName != null && orgName.indexOf(",") > -1){
				orgName = orgName.split(",");
				
			}
			var oidArray=[];
			var oidIds=[];
			Service.getAllOrgan(function(data){
        		if(data && data.result){
            		for(var i=0;i<data.total;i++){
            			var org = data.result[i];
            			oidArray.push(org._id);
            			if(orgName){
            				if(orgName instanceof Array){
            					for(var j=0;j<orgName.length;j++){
                					if(orgName[j] == org.name){
                						oidIds.push(org._id);
                					}
                				}
            				}else{
                				if(orgName == org.name){
                					oidIds.push(org._id);
                				}
            				}
            				
            			}else{
            			}
            		}
            		Service.getOrganDayStatistic(startTime,endTime,oidIds,function(data){
                       self.doResultData(data);
                   });
            	}
     
        	});        
		},
		getEveryMonth:function(startTime,endTime){
			cloud.util.mask("#trade");
			var self = this;
			var orgName = $("#organ_autoName").val();
			if(orgName != null && orgName.indexOf(",") > -1){
				orgName = orgName.split(",");
				
			}
			var oidArray=[];
			var oidIds=[];
			Service.getAllOrgan(function(data){
        		if(data && data.result){
            		for(var i=0;i<data.total;i++){
            			var org = data.result[i];
            			oidArray.push(org._id);
            			if(orgName){
            				if(orgName instanceof Array){
            					for(var j=0;j<orgName.length;j++){
                					if(orgName[j] == org.name){
                						oidIds.push(org._id);
                					}
                				}
            				}else{
                				if(orgName == org.name){
                					oidIds.push(org._id);
                				}
            				}
            				
            			}else{
            			}
            		}
            		Service.getOrganMonthStatistic(startTime,endTime,oidIds,function(data){
            			self.doResultData(data);
                    	/*if(data.result){
             		    	
             		        var organList = data.result[0].organList;
             		        var organDeliveryFailureCount =  data.result[0].organDeliveryFailureCount;
            		        self.rendTradeTable(organList,organDeliveryFailureCount);
            		        
             		        
             		       var organAmount = data.result[0].organDeliveryFailureCount;
             		      if(organAmount.length > 10){
                    			var neworganAmount=[];
                    			for(var i=0;i<organAmount.length;i++){
                    				if(i>9){
                    				}else{
                    				   var array = organAmount[i].split("||");
                       			   neworganAmount.push(parseInt(array[1]));
                    				}
                    			}
                    			organAmount = neworganAmount;
                    	    }else{
                    	    	var neworganAmount=[];
                    			for(var i=0;i<organAmount.length;i++){
                    			   var array = organAmount[i].split("||");
                    			   neworganAmount.push(parseInt(array[1]));
                    			}
                    			organAmount = neworganAmount;
                    	    }
            		    	
            				var organName =data.result[0].organName;
            				if(organName.length > 10){
                     			var neworganName=[];
                     			for(var i=0;i<organName.length;i++){
                     				if(i>9){
                     				}else{
                     					neworganName.push(organName[i]);
                     				}
                     			}
                     			organName = neworganName;
                     	    }
             		    	self.renderbarChart(organName,organAmount);//机构出货失败排名top10
             		    	
             		    	var payStyle =data.result[0].payStyleName;
             		    	if(payStyle && payStyle.length>0){
             		    		for(var i=0;i<payStyle.length;i++){
             		    			if(payStyle[i] == 'baifubao'){
                     		    		payStyle[i] ='百付宝';
                     		    	}else if(payStyle[i] == 'weixin'){
                     		    		payStyle[i] ='微信支付';
                     		    	}else if(payStyle[i] == 'alipay'){
                     		    		payStyle[i] ='支付宝';
                     		    	}else if(payStyle[i] == 'cash'){
                     		    		payStyle[i] ='现金支付';
                     		    	}else if(payStyle[i] == 'swingcard'){
                     		    		payStyle[i] ='刷卡';
                     		    	}else if(payStyle[i] == 'scannercard'){
                     		    		payStyle[i] ='扫胸牌';
                     		    	}else if(payStyle[i] == 'claimnumber'){
                     		    		payStyle[i] ='取货码';
                     		    	}else if(payStyle[i] == 'game'){
                     		    		payStyle[i] ='游戏';
                     		    	}else if(payStyle[i] == 'soundwave'){
                     		    		payStyle [i]='声波支付';
                     		    	}else if(payStyle[i] == 'posmach'){
                     		    		payStyle[i] ='POS机';
                     		    	}else if(payStyle[i] == 'onecardsolution'){
                     		    		payStyle[i]='一卡通';
                     		    	}else if(payStyle[i] == 'abc'){
                     		    		payStyle[i] ='农行掌银支付';
                     		    	}else if(payStyle[i] == 'wechatreversescan'){
                     		    		payStyle[i] ='微信反扫';
                     		    	}else if(payStyle[i] == 'vip'){
                     		    		payStyle[i] ='会员支付';
                     		    	}else if(payStyle[i] == 'bestpay'){
                     		    		payStyle[i] ='翼支付';
                     		    	}else if(payStyle[i] == 'jd'){
                     		    		payStyle[i] ='京东支付';
                     		    	}else if(payStyle[i] == 'reversescan'){
                     		    		payStyle[i] ='支付宝反扫';
                     		    	}else if(payStyle[i] == 'integralexchange'){
                     		    		payStyle[i] ='积分兑换';
                     		    	}else if(payStyle[i] == 'unionpay'){
                     		    		payStyle[i] ='银联支付';
                     		    	}else if(payStyle[i] == 'qrcodepay'){
                     		    		payStyle[i] ='扫码支付';
                     		    	}else if(payStyle[i] == 'icbcpay'){
                     		    		payStyle[i] ='融e联';
                     		    	}
             		    		}
             		    	}
             		    	
             				var deliverySum =data.result[0].payStyleSum;
             				self.renderColumnChart(payStyle,deliverySum);//柱状图
            			    cloud.util.unmask("#trade");
           			    }*/
                   });
            	}
     
        	});        
			
		},
		getEveryYear:function(startTime,endTime){
			cloud.util.mask("#trade");
			var self = this;
			var orgName = $("#organ_autoName").val();
			if(orgName != null && orgName.indexOf(",") > -1){
				orgName = orgName.split(",");
				
			}
			var oidArray=[];
			var oidIds=[];
			Service.getAllOrgan(function(data){
        		if(data && data.result){
            		for(var i=0;i<data.total;i++){
            			var org = data.result[i];
            			oidArray.push(org._id);
            			if(orgName){
            				if(orgName instanceof Array){
            					for(var j=0;j<orgName.length;j++){
                					if(orgName[j] == org.name){
                						oidIds.push(org._id);
                					}
                				}
            				}else{
                				if(orgName == org.name){
                					oidIds.push(org._id);
                				}
            				}
            				
            			}else{
            			}
            		}
            		Service.getOrganYearStatistic(startTime,endTime,oidIds,function(data){
            			self.doResultData(data);
                    	/*if(data.result){
             		    	
             		        var organList = data.result[0].organList;
             		        var organDeliveryFailureCount =  data.result[0].organDeliveryFailureCount;
            		        self.rendTradeTable(organList,organDeliveryFailureCount);
            		        
             		        
             		       var organAmount = data.result[0].organDeliveryFailureCount;
             		      if(organAmount.length > 10){
                    			var neworganAmount=[];
                    			for(var i=0;i<organAmount.length;i++){
                    				if(i>9){
                    				}else{
                    				   var array = organAmount[i].split("||");
                       			   neworganAmount.push(parseInt(array[1]));
                    				}
                    			}
                    			organAmount = neworganAmount;
                    	    }else{
                    	    	var neworganAmount=[];
                    			for(var i=0;i<organAmount.length;i++){
                    			   var array = organAmount[i].split("||");
                    			   neworganAmount.push(parseInt(array[1]));
                    			}
                    			organAmount = neworganAmount;
                    	    }
            		    	
            				var organName =data.result[0].organName;
            				if(organName.length > 10){
                     			var neworganName=[];
                     			for(var i=0;i<organName.length;i++){
                     				if(i>9){
                     				}else{
                     					neworganName.push(organName[i]);
                     				}
                     			}
                     			organName = neworganName;
                     	    }
             		    	self.renderbarChart(organName,organAmount);//机构出货失败排名top10
             		    	
             		    	var payStyle =data.result[0].payStyleName;
             		    	if(payStyle && payStyle.length>0){
             		    		for(var i=0;i<payStyle.length;i++){
             		    			if(payStyle[i] == 'baifubao'){
                     		    		payStyle[i] ='百付宝';
                     		    	}else if(payStyle[i] == 'weixin'){
                     		    		payStyle[i] ='微信支付';
                     		    	}else if(payStyle[i] == 'alipay'){
                     		    		payStyle[i] ='支付宝';
                     		    	}else if(payStyle[i] == 'cash'){
                     		    		payStyle[i] ='现金支付';
                     		    	}else if(payStyle[i] == 'swingcard'){
                     		    		payStyle[i] ='刷卡';
                     		    	}else if(payStyle[i] == 'scannercard'){
                     		    		payStyle[i] ='扫胸牌';
                     		    	}else if(payStyle[i] == 'claimnumber'){
                     		    		payStyle[i] ='取货码';
                     		    	}else if(payStyle[i] == 'game'){
                     		    		payStyle[i] ='游戏';
                     		    	}else if(payStyle[i] == 'soundwave'){
                     		    		payStyle [i]='声波支付';
                     		    	}else if(payStyle[i] == 'posmach'){
                     		    		payStyle[i] ='POS机';
                     		    	}else if(payStyle[i] == 'onecardsolution'){
                     		    		payStyle[i]='一卡通';
                     		    	}else if(payStyle[i] == 'abc'){
                     		    		payStyle[i] ='农行掌银支付';
                     		    	}else if(payStyle[i] == 'wechatreversescan'){
                     		    		payStyle[i] ='微信反扫';
                     		    	}else if(payStyle[i] == 'vip'){
                     		    		payStyle[i] ='会员支付';
                     		    	}else if(payStyle[i] == 'bestpay'){
                     		    		payStyle[i] ='翼支付';
                     		    	}else if(payStyle[i] == 'jd'){
                     		    		payStyle[i] ='京东支付';
                     		    	}else if(payStyle[i] == 'reversescan'){
                     		    		payStyle[i] ='支付宝反扫';
                     		    	}else if(payStyle[i] == 'integralexchange'){
                     		    		payStyle[i] ='积分兑换';
                     		    	}else if(payStyle[i] == 'unionpay'){
                     		    		payStyle[i] ='银联支付';
                     		    	}else if(payStyle[i] == 'qrcodepay'){
                     		    		payStyle[i] ='扫码支付';
                     		    	}else if(payStyle[i] == 'icbcpay'){
                     		    		payStyle[i] ='融e联';
                     		    	}
             		    		}
             		    	}
             		    	
             				var deliverySum =data.result[0].payStyleSum;
             				self.renderColumnChart(payStyle,deliverySum);//柱状图
            			    cloud.util.unmask("#trade");
           			    }*/
                   });
            	}
     
        	});        
			
		},
		renderColumnChart:function(payStyle,deliverySum){
			$("#paystyle-content").highcharts({
	            chart: {
	                type: 'column',
	                height:420,
                    width:600
	            },
	            credits: {//去掉 highcharts.com
	                enabled:false
	            },
	            colors: ['#7cb5ec','#434348', '#90ed7d', '#f7a35c', '#8085e9','#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'],
	            title: {
	                text: locale.get({lang:"a_summary_of_the_number_of_shipments_failed_payment_methods"}),
	            },
	           
	            xAxis: {
	                categories: payStyle
	            },
	            yAxis: {
	                min: 0,
	                title: {
	                    text: ''
	                }
	            },
	            tooltip: {
	                shared: true,
	                useHTML: true
	            },
	            plotOptions: {
	            	series: {
	                    pointPadding: 0, //数据点之间的距离值
	                    groupPadding: 0, //分组之间的距离值
	                    borderWidth: 0,
	                    shadow: false,
	                    pointWidth:10 //柱子之间的距离值
	                },
	                column: {
	                    pointPadding: 0.2,
	                    dataLabels: {                                              
		                       enabled: true                                          
		                   }   
	                }
	            },     
	            series: [{
	            	data:deliverySum,
	            	name:locale.get({lang:"total_shipments_failed"}),
	            	colorByPoint:true
	            }]

	        });

		},
	       renderbarChart:function(bar,type){
	    	   	  var result=type;
	    	   	  var categorie=bar;
	    		  $('#top-content').highcharts({                                           
	    			  chart: {                                                           
	    		            type: 'bar' ,
	    		            height:420,
	    	                width:460
	    		        },                                                                 
	    		        title: {                                                           
	    		            text: locale.get({lang:"the_number_of_agencies_to_ship_the_number_of_failures_ranked_Top10"})            
	    		        }, 
	    		        navigator:{
	    	                enabled:false
	    	            },
	    	            rangeSelector:{
	    	                enabled:false
	    	            },
	    	            scrollbar:{
	    	                enabled:false
	    	            },
	    	            credits:{
	    	                enabled:false
	    	            },
	    	            legend: {
	    	                enabled: false
	    	            },
	    		        xAxis: {                                                           
	    		            categories: categorie,
	    		            min: 0,
	    	                gridLineWidth: 0
	    	            },                                                                 
	    	            yAxis: {                                                           
	    	        	    min: 0,
	    	                gridLineWidth: 0,
	    				    labels:{
	    		                enabled: false
	    		            },
	    		            title: {
	    	                    text: ''
	    	                }                                                                    
	    	            },                                                                 
	    	            tooltip: {                                                         
	    	        	    shared: true,
	    	        	    valueSuffix: locale.get("times")
	    	            },                                                                 
	    	            plotOptions: {                                                     
	    	                bar: {                                                         
	    	                   dataLabels: {                                              
	    	                       enabled: true                                          
	    	                   }                                                          
	    	                },
	    		            series: {
	    	                    pointWidth: 15 
	    	                }                                                              
	    	            },                                                                 
	    	            legend: {                                                          
	    	        	    backgroundColor: '#FFFFFF',
	    	                reversed: true                                                 
	    	            },                                                                           
	    		        series: [{
	    	             	 name: locale.get("total_shipments_failed"),
	    	                 type: 'bar',
	    	                 data: result
	    	            }]                                                          
	    		    });               
	       }
	});	
	return trade;
});