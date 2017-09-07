define(function(require){
	var DashBoard = require("../../../components/dashweight/dashboard");
    var winHeight = 424;
    var winWidth = 1100;
    require("cloud/components/chart");
    var html = require("text!./statistics.html");
    var Service = require("./service");
    
    var volumes = Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            this._render();
        },
        _render:function(){
        	this.element.html(html);
        	//$("#trade_statistics").css("height",($("#col_slide_main").height() - $(".main_hd").height()));
        	
        	$("#trade_statistics").css("width",$(".wrap").width());
			$("#statistics_bar").css("width",$(".wrap").width());
			
			$("#trade_statistics").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
        	
        	this.loadData();
        },
        loadData:function(){
        	cloud.util.mask("#trade_statistics_all");
        	var self = this;
        	Service.getTimeStatistic(function(data){
        		 
     		    if( data.result.length){
     		    	var goodsType = data.result[0].goodsType;
     		    	self.renderScatter_GoodsType(goodsType);
     		    }
        	});
        	
        	Service.getPayStyleStatistic(function(data){
         
        		var languge= localStorage.getItem("language");
     		    if( data.result.length){
     		    	var goodsType = data.result[0].goodsType;
     		    	for(var i=0;i<goodsType.length;i++){
     		    		 if(goodsType[i].name == "1"){
     		    			goodsType[i].name = locale.get("trade_baifubao");
     		    		 }else if(goodsType[i].name == "2"){
     		    			goodsType[i].name = locale.get("trade_wx_pay");
     		    		 }else if(goodsType[i].name == "3"){
     		    			goodsType[i].name = locale.get("trade_alipay");
     		    		 }else if(goodsType[i].name == "4"){
     		    			goodsType[i].name = locale.get("trade_cash_payment");
     		    		 }
     		    	}
     		    	
     		    	self.renderScatter_PayStyle(goodsType);
     		    	cloud.util.unmask("#trade_statistics_all");
     		    }
        	});
        },
        renderScatter_GoodsType:function(data){
        	 $('#volumes-content').highcharts({                                                             
        	        chart: {                                                                             
        	            type: 'scatter',                                                                 
        	            zoomType: 'xy',
        	            width:1000,
        	            height:300
        	        },                                                                                   
        	        title: {                                                                             
        	            text: locale.get("statistics_goodsType")                      
        	        },
        	        xAxis: {                                                                             
        	            startOnTick: true,                                                               
        	            endOnTick: true,                                                                 
        	            showLastLabel: true,
        	            tickInterval:1,
        	            categories:["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"]
        	        },   
        	        yAxis: {  
        	        	 title: {                                                                         
        	                 text: ''                                                          
        	             }  ,
        	             min: 0,
        	             tickInterval:5 //单位刻度间距
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
                        
                    },                                                                           
        	        plotOptions: {                                                                       
        	            scatter: {                                                                       
        	                marker: {                                                                    
        	                    radius: 5,                                                               
        	                    states: {                                                                
        	                        hover: {                                                             
        	                            enabled: true,                                                   
        	                            lineColor: 'rgb(100,100,100)'                                    
        	                        }                                                                    
        	                    }                                                                        
        	                },                                                                           
        	                states: {                                                                    
        	                    hover: {                                                                 
        	                        marker: {                                                            
        	                            enabled: false                                                   
        	                        }                                                                    
        	                    }                                                                        
        	                },                                                                           
        	                tooltip: {                                                                   
        	                    headerFormat: '<b>{series.name}</b><br>',                                
        	                    pointFormat: '{point.x} h'                                
        	                }                                                                            
        	            }                                                                                
        	        },                                                                                   
        	        series: data                                                                                 
        	    });                                     
        },
        renderScatter_PayStyle:function(data){
        	$('#line-content').highcharts({                                                             
    	        chart: {                                                                             
    	            type: 'scatter',                                                                 
    	            zoomType: 'xy',
    	            width:1000,
    	            height:300
    	        },                                                                                   
    	        title: {                                                                             
    	            text: locale.get("statistics_payStyle")                        
    	        },
    	        xAxis: {                                                                             
    	            startOnTick: true,                                                               
    	            endOnTick: true,                                                                 
    	            showLastLabel: true,
    	            tickInterval:10,
    	            categories:["0","10","20","30","40","50","60"]
    	        },   
    	        yAxis: {  
    	        	 title: {                                                                         
    	                 text: ''                                                          
    	             }  ,
    	             min: 0,
    	             tickInterval:5 //单位刻度间距
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
                    
                },                                                                           
    	        plotOptions: {                                                                       
    	            scatter: {                                                                       
    	                marker: {                                                                    
    	                    radius: 5,                                                               
    	                    states: {                                                                
    	                        hover: {                                                             
    	                            enabled: true,                                                   
    	                            lineColor: 'rgb(100,100,100)'                                    
    	                        }                                                                    
    	                    }                                                                        
    	                },                                                                           
    	                states: {                                                                    
    	                    hover: {                                                                 
    	                        marker: {                                                            
    	                            enabled: false                                                   
    	                        }                                                                    
    	                    }                                                                        
    	                },                                                                           
    	                tooltip: {                                                                   
    	                    headerFormat: '<b>{series.name}</b><br>',                                
    	                    pointFormat: '{point.x} s'                                
    	                }                                                                            
    	            }                                                                                
    	        },                                                                                   
    	        series: data                                                                              
    	    });            
        },
        destroy:function($super){
            $super();
        }
    });

    return volumes;
});