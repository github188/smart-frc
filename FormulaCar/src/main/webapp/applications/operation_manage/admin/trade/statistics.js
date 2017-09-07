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
			//this.getAssetIdOfLine();
			this.renderHtml();
			this.renderEvent();
			this.renderSelect();
			this.loadData();
			var height = localStorage.getItem("contentHeight");
			$("#trade").css("width",$(".wrap").width());
			$("#tradeHead").css("width",$(".wrap").width());
			
			$("#trade").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			//$("#trade").css("height",(height - $(".main_hd").height() -35));
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
        				
        				self.getOnlineTop();
        				
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
			this.getOnlineTop();
			 
		},
		rendTradeTable: function(finalData) {
			var self = this;
			var oidArray=[];
			Service.getAllOrgan(function(data){
				if(data && data.result){
            		for(var i=0;i<data.total;i++){
            			var org = data.result[i];
            			oidArray.push(org._id);
            		}
            		Service.getOrganOnlineStatistic(oidArray,function(data){
            			var organName = data.result[0].organName;
            			var organOnlineCount = data.result[0].organOnlineCount;
            			if(organName && organName.length>0){
            				for(var i=0;i<organName.length;i++){
            					for(var j=0;j<finalData.result[0].organPay.length;j++){
            						if(finalData.result[0].organPay[j].orgname ==organName[i] ){
            							finalData.result[0].organPay[j].onlineSum = organOnlineCount[i];
            						}
            					}
            				}
            			    self.tradeTable = new TradeTable({
            		                selector: "#" + self.elements.content.id,
            		                data:finalData,
            		                //"container": "#tradeContent"
            		        });
            			}
            		});
				}
			});
        },
        getOnlineTop:function(){
        	var self = this;
        	var orgArray=[];
			var orgName = $("#organ_autoName").val();
			if(orgName != null){
				if(orgName.indexOf(",") > -1){
					orgArray = orgName.split(",");
				}else{
					orgArray.push(orgName);
				}
			}
			var oidArray=[];
			var oidIds=[];
			Service.getAllOrgan(function(data){
        		if(data && data.result){
            		for(var i=0;i<data.total;i++){
            			var org = data.result[i];
            			oidArray.push(org._id);
            			if(orgArray.length>0){
            				for(var j=0;j<orgArray.length;j++){
            					if(org.name.indexOf(orgArray[j])> -1 ){
            						oidIds.push(org._id);
            					}
            				}
            			}else{
            				oidIds = oidArray;
            			}
            			/*if(orgName){
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
            				oidIds = oidArray;
            			}*/
            		}
            		Service.getOrganOnlineStatistic(oidIds,function(data){
            			var organName = data.result[0].organName;
            			var organOnlineCount = data.result[0].organOnlineCount;
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
            			if(organOnlineCount.length > 10){
                  			var neworganOnlineCount=[];
                  			for(var i=0;i<organOnlineCount.length;i++){
                  				if(i>9){
                  				}else{
                  					neworganOnlineCount.push(organOnlineCount[i]);
                  				}
                  			}
                  			organOnlineCount = neworganOnlineCount;
                  	    }
            			self.renderOnlinebarChart(organName,organOnlineCount);
            		});
            	}
     
        	});
        },
		getEveryDay:function(startTime,endTime){
			cloud.util.mask("#trade");
			var self = this;
			var orgName = $("#organ_autoName").val();
			if(orgName != null && orgName.indexOf(",") > -1){
				orgName = orgName.split(",");
				
			}
			Service.getOrganDayStatistic(startTime,endTime,orgName,function(data){
	      		   
     		    if(data.result){
     		    	var organ = data.result[0].organ;
    				var organName = data.result[0].organName;
                    var organAmount = data.result[0].organAmount;
                    
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
    				   if(organAmount.length > 10){
             			var neworganAmount=[];
             			for(var i=0;i<organAmount.length;i++){
             				if(i>9){
             					
             				}else{
             					neworganAmount.push(organAmount[i]);
             				}
             			}
             			organAmount = neworganAmount;
             	  }
    				  self.renderPieChart(organ);
    			      self.renderbarChart(organName,organAmount);
    			      self.rendTradeTable(data);
    			      cloud.util.unmask("#trade");
   			         
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
			Service.getOrganMonthStatistic(startTime,endTime,orgName,function(data){
            	if(data.result){
     		    	var organ = data.result[0].organ;
    				var organName = data.result[0].organName;
                    var organAmount = data.result[0].organAmount;
                    
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
    				   if(organAmount.length > 10){
             			var neworganAmount=[];
             			for(var i=0;i<organAmount.length;i++){
             				if(i>9){
             					
             				}else{
             					neworganAmount.push(organAmount[i]);
             				}
             			}
             			organAmount = neworganAmount;
             	  }
    				  self.renderPieChart(organ);
    			      self.renderbarChart(organName,organAmount);
    			      self.rendTradeTable(data);
    			      cloud.util.unmask("#trade");
   			         
   			    }
           });
			
		},
		getEveryYear:function(startTime,endTime,lineName){
			cloud.util.mask("#trade");
			var self = this;
			var orgName = $("#organ_autoName").val();
			if(orgName != null && orgName.indexOf(",") > -1){
				orgName = orgName.split(",");
				
			}
			Service.getOrganYearStatistic(startTime,endTime,orgName,function(data){
	   			 
            	if(data.result){
     		    	var organ = data.result[0].organ;
    				var organName = data.result[0].organName;
                    var organAmount = data.result[0].organAmount;
                    
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
    				   if(organAmount.length > 10){
             			var neworganAmount=[];
             			for(var i=0;i<organAmount.length;i++){
             				if(i>9){
             					
             				}else{
             					neworganAmount.push(organAmount[i]);
             				}
             			}
             			organAmount = neworganAmount;
             	  }
    				  self.renderPieChart(organ);
    			      self.renderbarChart(organName,organAmount);
    			      self.rendTradeTable(data);
    			      cloud.util.unmask("#trade");
   			    }
		
	        });
			
		},
		 renderPieChart:function(data){
	            var result=data;
	       		$('#pie-content').highcharts({
	                chart: {
	                	type: 'pie',
	                    plotBackgroundColor: null,
	                    plotBorderWidth: null,
	                    plotShadow: false,
	                    height:420,
	                    width:320
	                },
	                title: {
	                    text: locale.get("organ_saleamount_list"),
	                },
	                tooltip: {
	            	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	                },
	                plotOptions: {
	                    pie: {
	                        allowPointSelect: true,
	                        cursor: 'pointer',
	                        size:'90%',
	                        depth: 35,
	                        dataLabels: {
	                            enabled: false
	                        },
	                        showInLegend: true
	                    }
	                },
	                series: [{
	                	 name:  locale.get("automat_percent"),
	                     type: 'pie',
	                     data: result
	                }]
	            });
	          
	       },
	       renderOnlinebarChart:function(bar,type){
	    	   var result=type;
	    	   	  var categorie=bar;
	    		  $('#online-content').highcharts({                                           
	    			  chart: {                                                           
	    		            type: 'bar' ,
	    		            height:420,
	    	                width:390
	    		        },                                                                 
	    		        title: {                                                           
	    		            text: locale.get("gency_equipment_online_number_ranking_TOP10"),             
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
	    	        	    valueSuffix: locale.get("tai")
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
	    	             	 name:  locale.get("total_online_number"),
	    	                 type: 'bar',
	    	                 data: result
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
	    	                width:390
	    		        },                                                                 
	    		        title: {                                                           
	    		            text: locale.get("organ_sale_list"),             
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
	    	        	    valueSuffix: locale.get("china_yuan")
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
	    	             	 name:  locale.get("sales"),
	    	                 type: 'bar',
	    	                 data: result
	    	            }]                                                          
	    		    });               
	       }
	});	
	return trade;
});