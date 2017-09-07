define(function(require){
	var cloud = require("cloud/base/cloud");
    var Button = require("cloud/components/button");
	var validator = require("cloud/components/validator");
	var html = require("text!./statistics.html");
	require("./css/default.css");
	require("cloud/components/chart");
    var Service = require("./service");
	var trade = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.elements = {
					head : {
						id : "tradeHead",
						"class" : null
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
			$("#bar-content").addClass("bar-content");
        	$("#barModel-content").addClass("barModel-content");
			this.renderEvent();
			this.renderSelect();
			this.loadData();
		},
		renderHtml:function(){
			$("#reportType").append("<option value='1' selected='selected'>"+locale.get({lang:"monthly_report"})+"</option>");
			$("#reportType").append("<option value='2'>"+locale.get({lang:"year_report"})+"</option>");
			$("#summary_year").css("display","none");
            $("#summary_year").val("");
		},
		renderEvent:function(){
			var self = this;
			$("#reportType").bind('change', function () {
				var selectedId = $("#reportType").find("option:selected").val();
				if(selectedId == "1"){
					$("#summary_year").css("display","none");
					$("#summary_month").css("display","block");
					$("#summary_year").val("");
					$("#summary_month").val(cloud.util.dateFormat(new Date(((new Date()).getTime())/1000),"yyyy/MM"));
				}else if(selectedId == "2"){
					$("#summary_month").css("display","none");
					$("#summary_year").css("display","block");
					$("#summary_month").val("");
				}
			});
			//查询
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#buttonDiv"),
                events: {
                    click: function(){
                        var byMonth = "";
                        var byYear = "";
                        var startTime = '';  
                        var endTime = ''; 
                        
                    	var selectedId = $("#reportType").find("option:selected").val();
        				if(selectedId == "1"){
        					var byMonth = $("#summary_month").val();//月
        				}else if(selectedId == "2"){
        					var byYear = $("#summary_year").val();//年
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
                     		  endTime = (new Date(byMonth + "/" +maxday+ " 23:59:59")).getTime()/1000;
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
			var months = myDate.getMonth() +1;
			var byMonth = full + "/" + months;
			var startTime = ''; 
			var endTime ='';
			
        	var  maxday = new Date(full,months,0).getDate();
			if(months == 1 || months ==3 || months == 5 || months == 7 || months ==8 || months == 10 || months == 12){
       		  startTime = (new Date(byMonth +"/01"+ " 00:00:00")).getTime()/1000;  
       		  endTime = (new Date(byMonth +"/31"+ " 23:59:59")).getTime()/1000; 
       	    }else if(months == 2){
       		  startTime = (new Date(byMonth +"/01"+ " 00:00:00")).getTime()/1000;  
       		  endTime = (new Date(byMonth + "/" +maxday+ " 23:59:59")).getTime()/1000;
       	    }else{
       		  startTime = (new Date(byMonth +"/01"+ " 00:00:00")).getTime()/1000;    
       		  endTime = (new Date(byMonth +"/30"+ " 23:59:59")).getTime()/1000;
       	    }
			this.getEveryMonth(startTime,endTime);
		},
		getEveryMonth:function(startTime,endTime){
			var self = this;
			var languge= localStorage.getItem("language");
			Service.getFaulStatistic(startTime,endTime,function(data){
			 
			    if( data.result.length){
     		    	$("#event").text(data.result[0].otherSum == null ? 0:data.result[0].otherSum);
    			    $("#alarm").text(data.result[0].alarmSum == null ? 0:data.result[0].alarmSum);
    			    var pie1 =data.result[0].eventByHour;
    			    if(pie1[0][1] == 0 && pie1[1][1] == 0 && pie1[2][1] == 0 && pie1[3][1] == 0){
    			    	pie1=[[locale.get("no_data"),100]];
    				}
            		self.renderPieChart1(pie1);
            		
            		var pie2 =data.result[0].faultAndOk;
            		if(pie2[0][1] == 0 && pie2[1][1] == 0){
						    pie2 = [[locale.get("no_data"),100]];
   				    }else{
   					    if(languge == "en"){
         					 pie2[0][0]=locale.get("fault");
         					 pie2[1][0]=locale.get("device_normal");
     				    }
   				    }
            		
             		self.renderPieChart2(pie2);
             		
             		var pie3 =data.result[0].faults;
             		
             	   if(pie3[0][1] == 0 && pie3[1][1] == 0 && pie3[2][1] == 0 && pie3[3][1] == 0){
             		  pie3=[[locale.get("no_data"),100]];
  				   }else{
  					   if(languge == "en"){
  						 pie3[0][0]=locale.get("event_warn");
      					 pie3[1][0]=locale.get("event_admonish");
      					 pie3[2][0]=locale.get("event_minor_alarm");
      					 pie3[3][0]=locale.get("event_important_warning");
      				   }
  				   }
             		
             		self.renderPieChart3(pie3);
             		
             		var bar =data.result[0].eventType;  
             		var type = data.result[0].type;  
             		for(var i=0;i<type.length;i++){
             			if(type[i]=="40001"){
             				type[i]=locale.get("event_no_change");
             			}else if(type[i]=="40002"){
             				type[i]=locale.get("event_no_goods_cannot_be_shipped_goods");
             			}
             		}
             		self.renderbarChart1(bar,type);
             		
             		var modelbar =data.result[0].modelEvent;  
             		if(modelbar.length > 10){
             			var newbar=[];
             			for(var i=0;i<modelbar.length;i++){
             				if(i>9){
             					
             				}else{
             					newbar.push(modelbar[i]);
             				}
             			}
             			modelbar = newbar;
             		}
             		var modelType = data.result[0].model;  
             		if(modelType.length > 10){
             			var newtype=[];
             			for(var i=0;i<modelType.length;i++){
             				if(i>9){
             					
             				}else{
             					newtype.push(modelType[i]);
             				}
             			}
             			modelType = newtype;
             		}
             		self.renderbarChart2(modelbar,modelType);
     		    }
			});
		},
		getEveryYear:function(startTime,endTime){
			var self = this;
			var languge= localStorage.getItem("language");
			Service.getYearFaulStatistic(startTime,endTime,function(data){
			 
				 if( data.result.length){
      		    	$("#event").text(data.result[0].otherSum == null ? 0:data.result[0].otherSum);
     			    $("#alarm").text(data.result[0].alarmSum == null ? 0:data.result[0].alarmSum);
     			    var pie1 =data.result[0].eventByHour;
     			    if(pie1[0][1] == 0 && pie1[1][1] == 0 && pie1[2][1] == 0 && pie1[3][1] == 0){
     			    	pie1=[[locale.get("no_data"),100]];
     				}
             		self.renderPieChart1(pie1);
             		
             		 var pie2 =data.result[0].faultAndOk;
             		 if(pie2[0][1] == 0 && pie2[1][1] == 0){
 						 pie2 = [[locale.get("no_data"),100]];
     				 }else{
     					 if(languge == "en"){
           					 pie2[0][0]=locale.get("fault");
           					 pie2[1][0]=locale.get("device_normal");
       				     }
     				 }
            	      
              		self.renderPieChart2(pie2);
              		
              		var pie3 =data.result[0].faults;
              		
              	    if(pie3[0][1] == 0 && pie3[1][1] == 0 && pie3[2][1] == 0 && pie3[3][1] == 0){
                 		  pie3=[[locale.get("no_data"),100]];
      			    }else{
      					   if(languge == "en"){
      						 pie3[0][0]=locale.get("event_warn");
            					 pie3[1][0]=locale.get("event_admonish");
            					 pie3[2][0]=locale.get("event_minor_alarm");
            					 pie3[3][0]=locale.get("event_important_warning");
          				   }
      				}
              		
              		self.renderPieChart3(pie3);
              		
              		var bar =data.result[0].eventType;  
              		var type = data.result[0].type;  
              		for(var i=0;i<type.length;i++){
              			if(type[i]=="40001"){
              				type[i]=locale.get("event_no_change");
              			}else if(type[i]=="40002"){
              				type[i]=locale.get("event_no_goods_cannot_be_shipped_goods");
              			}
              		}
              		self.renderbarChart1(bar,type);
              		
              		var modelbar =data.result[0].modelEvent;
              		if(modelbar.length > 10){
              			var newbar=[];
              			for(var i=0;i<modelbar.length;i++){
              				if(i>9){
              					
              				}else{
              					newbar.push(modelbar[i]);
              				}
              			}
              			modelbar = newbar;
              		}
              		var modelType = data.result[0].model; 
              		if(modelType.length > 10){
              			var newtype=[];
              			for(var i=0;i<modelType.length;i++){
              				if(i>9){
              					
              				}else{
              					newtype.push(modelType[i]);
              				}
              			}
              			modelType = newtype;
              		}
              		self.renderbarChart2(modelbar,modelType);
     			    
      		    }
			});
		},
		renderPieChart1:function(payStyle){
            var result=payStyle;
       		$('#volumes-content').highcharts({
                chart: {
                	type: 'pie',
                	options3d: {
                        enabled: true,
                        alpha: 45,
                        beta: 0
                    },
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    height:320,
                    width:370
                },
                title: {
                    text:locale.get("automat_fault_pie"),
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
       renderPieChart2:function(payStyle){
           var result=payStyle;
      		$('#line-content').highcharts({
               chart: {
               	type: 'pie',
               	options3d: {
                       enabled: true,
                       alpha: 45,
                       beta: 0
                   },
                   plotBackgroundColor: null,
                   plotBorderWidth: null,
                   plotShadow: false,
                   height:320,
                   width:300
               },
               title: {
                   text:locale.get("automat_fault_normal"),
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
      renderPieChart3:function(payStyle){
          var result=payStyle;
     		$('#pie-content').highcharts({
              chart: {
              	type: 'pie',
              	options3d: {
                      enabled: true,
                      alpha: 45,
                      beta: 0
                  },
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  height:320,
                  width:360
              },
              title: {
                  text: locale.get("automat_fault_level"),
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
     renderbarChart1:function(bar,type){
    	  var result=bar;
    	  var categorie=type;
    	  $('#bar-content').highcharts({                                           
    	        chart: {                                                           
    	            type: 'bar' ,
    	            height:300,
                    width:500,
                    options3d: {
                        enabled: true,
                        alpha: 0,
                        beta: 20,
                        depth: 50,
                        viewDistance: 0
                    }
    	        },                                                                 
    	        title: {                                                           
    	            text: locale.get("the_fault_category_ranking"),                   
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
                exporting:{
                    enabled:false
                },
                legend: {
                    enabled: false
                },
    	        xAxis: {                                                           
    	            categories: categorie,
    	            min: 0,
                    gridLineWidth: 0,
		            title: {
                        text: ''
                    }                                                                
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
    	        	shared: true                                    
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
               	 name:  locale.get("the_fault_category_ranking"),
                 type: 'bar',
                 data: result
                 }]                                                          
    	    });               
     },
     renderbarChart2:function(bar,type){
   	  var result=bar;
   	  var categorie=type;
	  $('#barModel-content').highcharts({                                           
		  chart: {                                                           
	            type: 'bar' ,
	            height:300,
                width:500,
                options3d: {
                   enabled: true,
                   alpha: 0,
                   beta: 20,
                   depth: 50,
                   viewDistance: 0
               }
	        },                                                                 
	        title: {                                                           
	            text: locale.get("machine_fault_list"),                      
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
            exporting:{
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
        	    shared: true                                    
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
             	 name:  locale.get("machine_fault_list"),
                 type: 'bar',
                 data: result
            }]                                                          
	    });               
      }
		
	});	
	return trade;
    
});