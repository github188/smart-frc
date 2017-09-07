define(function(require){
    require("cloud/base/cloud");
    var Window = require("cloud/components/window");
    var Button = require("cloud/components/button");
    var html = require("text!./old_monitorInfo.html");
    var Table = require("cloud/components/table");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/lib/plugin/highstock.src");
    require("cloud/lib/plugin/exporting.src")
    var Paging = require("cloud/components/paging");
    var Service = require('./service');
    var winHeight = 424;
    var winWidth = 800;
    var COLOR = Highcharts.getOptions().colors[0];
    var COLOR1	= Highcharts.getOptions().colors[1];
    var MonitorInfo = Class.create(cloud.Component , {
        initialize:function($super,options){
            $super(options);
            this.siteId = options.siteId;
            this.cursor=0;
            this.display = null;
			this.pageDisplay = 30;
            this.draw();
            this.getData();
        },
        getData:function(){
        	console.log("siteId======"+this.siteId); 
        	cloud.util.mask(".monitor-info-content");
        	var myDate=new Date();
        	var full = myDate.getFullYear(); 
        	var month = myDate.getMonth() +1;
        	var day = myDate.getDate();
        	var date =  full+"/"+month+"/"+day;
        	var startTime = (new Date(date+" 00:00:00")).getTime()/1000; 
        	var endTime = (new Date(date+" 23:59:59")).getTime()/1000; 
        	Service.getDayAllStatisticBySiteId(this.siteId,startTime,endTime,function(data){
        		console.log(data);
        		cloud.util.unmask(".monitor-info-content");
        	    var amountOnLine = data.result[0].amountOnLine;
   			    var sumOnLine = data.result[0].sumOnLine;
   			    var amountOutLine = data.result[0].amountOutLine;
   			    var sumOutLine = data.result[0].sumOutLine;
   			    
        		if(data.result && data.result[0].amountOnLine){
        			$("#monitor-info-number_of_transactions").text(amountOnLine);//线上金额
        		}else{
        			$("#monitor-info-number_of_transactions").text("0");
        		}
        		if(data.result && data.result[0].amountOutLine){
        			$("#monitor-info-amount").text(amountOutLine);//线下金额
        		}else{
        			$("#monitor-info-amount").text("0");
        		}
        		if(data.result &&  data.result[0].sumOnLine){
        			$("#monitor-info-alarm").text(sumOnLine);//线上交易数
        		}else{
        			$("#monitor-info-alarm").text("0");
        		}
        		if(data.result &&  data.result[0].sumOutLine){
        			$("#monitor-info-online-rate").text(sumOutLine);//线下交易数
        		}else{
        			$("#monitor-info-online-rate").text("0");
        		}
        		
        	});
        },
        draw:function(){
            this.element.html(html);

            locale.render({element:this.element});
            this.$name = this.element.find("#monitor-info-name");
            this.$address = this.element.find("#monitor-info-location");
            this.$user = this.element.find("#monitor-info-number_of_transactions");//交易数
            this.$terminal = this.element.find("#monitor-info-amount");//金额
            this.$online_rate = this.element.find("#monitor-info-online-rate");//在线率
            this.$alarm = this.element.find("#monitor-info-alarm");//告警
            this.$traffic = this.element.find("#monitor-info-traffic");
            
           // this.bindEvent();
        },

        bindEvent:function(){
            var self = this;
            this.element.find("#monitor-info-name").bind("click",function(){
            	window.open('./siteDetail.html?siteId='+self.siteId+'&tag=1','','');
            });
            //线上金额
            this.element.find("#monitor-info-number_of_transactions").bind("click",function(){
            	window.open('./siteDetail.html?siteId='+self.siteId+'&tag=1','','');

            });
           //线下金额
            this.element.find("#monitor-info-amount").bind("click",function(){
            	window.open('./siteDetail.html?siteId='+self.siteId+'&tag=1','','');
            });
        
            this.element.find("#monitor-info-alarm").bind("click",function(){
            	window.open('./siteDetail.html?siteId='+self.siteId+'&tag=1','','');

            });
            this.element.find("#monitor-info-online-rate").bind("click",function(){
            	window.open('./siteDetail.html?siteId='+self.siteId+'&tag=1','','');

            });
        }
    });

    return MonitorInfo;

})