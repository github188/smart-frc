define(function(require){
    var DashBoard = require("../../../components/dashweight/dashboard");
    var winHeight = 424;
    var winWidth = 1100;
    var html = require("text!./chart.html");
    require("cloud/components/chart");
    var Service = require('../../service');
    
    var volumes = Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            this.style = options.style;
            this.siteId = options.siteId;
            this._render();
        },
        _render:function(){
        	this.element.html(html);
        	this.loadData();
        },
        loadData:function(){
        	var self = this;
        	if(this.style == 1){//日
        	    Service.getDayAllStatisticBySite(self.siteId,function(data){
        		    if( data.result.length){
         			   var amountOnLine = data.result[0].amountOnLine+locale.get("china_yuan");
         			   var sumOnLine = data.result[0].sumOnLine;
         			   var amountOutLine = data.result[0].amountOutLine+locale.get("china_yuan");
         			   var sumOutLine = data.result[0].sumOutLine;
         			   $("#onlineAmount").text(amountOnLine);
     				   $("#outlineAmount").text(amountOutLine);
     				   $("#onlineNumber").text(sumOnLine);
     				   $("#outlineNumber").text(sumOutLine);
     				   
     				   var languge= localStorage.getItem("language");
    				   var sumAmount = data.result[0].sumAmount;
    				   if(languge == "en"){
  					       sumAmount[0].name='amount';
  					       sumAmount[1].name='volume';
  				       }
     				   var statisticTime = data.result[0].statisticTime;
     				   var newTimes = ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
     				   
     				   self.renderLineChart(sumAmount,newTimes);
     				   
     				   var payStyle = data.result[0].payStyle;
     				  if(payStyle[0][1] == 0 && payStyle[1][1] == 0 && payStyle[2][1] == 0 && payStyle[3][1] == 0){
   					      payStyle = [[locale.get("no_data"),100]];
   				      }else{
   					     if(languge == "en"){
           					   payStyle[0][0]='Wechat';
           					   payStyle[1][0]='Alipay';
           					   payStyle[2][0]='Baidupay';
           					   payStyle[3][0]='other';
       				      }
   				      }
     				   self.renderPieChart(payStyle);
         		    }
        	    });
        	}else if(this.style == 2){//月
        		 Service.getMonthAllStatisticBySite(self.siteId,function(data){
         		   if( data.result.length){
         			   var amountOnLine = data.result[0].amountOnLine+locale.get("china_yuan");
         			   var sumOnLine = data.result[0].sumOnLine;
         			   var amountOutLine = data.result[0].amountOutLine+locale.get("china_yuan");
         			   var sumOutLine = data.result[0].sumOutLine;
         			   $("#onlineAmount").text(amountOnLine);
     				   $("#outlineAmount").text(amountOutLine);
     				   $("#onlineNumber").text(sumOnLine);
     				   $("#outlineNumber").text(sumOutLine);
     				   
     				  var languge= localStorage.getItem("language");
    				   var sumAmount = data.result[0].sumAmount;
    				   if(languge == "en"){
  					       sumAmount[0].name='amount';
  					       sumAmount[1].name='volume';
  				       }
     				 
     				   var d = new Date();
     				   var curMonthDays = new Date(d.getFullYear(), (d.getMonth()+1), 0).getDate();
     				   var newTimes =[];
    				   if(curMonthDays == 31){
    					   newTimes = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];
    				   }else if(curMonthDays == 30){
    					   newTimes = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"]; 
    				   }else if(curMonthDays == 28){
    					   newTimes = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28"]; 
    				   }
     				   self.renderLineChart(sumAmount,newTimes);
     				   
     				   var payStyle = data.result[0].payStyle;
     				   if(payStyle[0][1] == 0 && payStyle[1][1] == 0 && payStyle[2][1] == 0 && payStyle[3][1] == 0){
   					       payStyle = [[locale.get("no_data"),100]];
   				       }else{
   					       if(languge == "en"){
           					    payStyle[0][0]='Wechat';
           					    payStyle[1][0]='Alipay';
           					    payStyle[2][0]='Baidupay';
           					    payStyle[3][0]='other';
       				        }
   				        }
     				   self.renderPieChart(payStyle);
         		    }
         	    });
        	}else if(this.style == 3){//年
        		Service.getYearAllStatisticBySite(self.siteId,function(data){
         		   if( data.result.length){
         			   var amountOnLine = data.result[0].amountOnLine+locale.get("china_yuan");
         			   var sumOnLine = data.result[0].sumOnLine;
         			   var amountOutLine = data.result[0].amountOutLine+locale.get("china_yuan");
         			   var sumOutLine = data.result[0].sumOutLine;
         			   $("#onlineAmount").text(amountOnLine);
     				   $("#outlineAmount").text(amountOutLine);
     				   $("#onlineNumber").text(sumOnLine);
     				   $("#outlineNumber").text(sumOutLine);
     				   
     				  var languge= localStorage.getItem("language");
    				   var sumAmount = data.result[0].sumAmount;
    				   if(languge == "en"){
  					       sumAmount[0].name='amount';
  					       sumAmount[1].name='volume';
  				       }
     				   var statisticTime = data.result[0].statisticTime;
     				   var newTimes = ["1","2","3","4","5","6","7","8","9","10","11","12"];
     				   self.renderLineChart(sumAmount,newTimes);
     				   
     				    var payStyle = data.result[0].payStyle;
     				    if(payStyle[0][1] == 0 && payStyle[1][1] == 0 && payStyle[2][1] == 0 && payStyle[3][1] == 0){
    					   payStyle = [[locale.get("no_data"),100]];
    				    }else{
    					   if(languge == "en"){
            					 payStyle[0][0]='Wechat';
            					 payStyle[1][0]='Alipay';
            					 payStyle[2][0]='Baidupay';
            					 payStyle[3][0]='other';
        				   }
    				   }
     				   self.renderPieChart(payStyle);
         		    }
         	    });
        	}
        	
        },
        renderPieChart:function(payStyle){
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
                    height:280,
                    width:350
                },
                colors: ['#50B432', '#DDDF00', '#ED561B','#058DC7'],
                title: {
                    text: ''
                },
                tooltip: {
            	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
       renderLineChart:function(sumAmount,newTimes){
           var result = sumAmount;
           var time = newTimes;
    	   $('#line-content').highcharts({
    	        chart: {
    	            type: 'line',
    	            height:280,
                    width:900
    	        },
    	        colors: ['#24CBE5', '#458B00'],
    	        title: {
    	            text: ''
    	        },
    	        xAxis: {
    	            categories: time
    	        },
    	        yAxis: {
    	            title: {
    	                text: ''
    	            },
    	            min: 0
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
    	        tooltip: {
    	            valueSuffix: ''
    	        },
    	        series:result
    	    });
       },
        destroy:function($super){
            $super();
        }
    });

    return volumes;
});