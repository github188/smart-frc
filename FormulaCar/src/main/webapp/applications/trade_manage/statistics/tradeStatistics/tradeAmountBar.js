define(function(require){
    var DashBoard = require("../../../components/dashweight/dashboard");
    var COLOR = Highcharts.getOptions().colors[4];
    var Service = require('../service');
    var tradeAmountBar = Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            this.service = new Service();
            this._render();
            this.setContent();
            this.renderChart();
            this.data = options.data;
            this.setData(options.data);
        },
        _render:function(){
        	var self = this;
            var width = this.element.width;
            this.element.addClass("weightContainer");
            this.element.addClass("trade_amount_sta");
            this.dialog = new DashBoard({
                selector : this.element,
                title : locale.get("automat_transaction_money"),
                width : width
            });
            $(".trade_amount_sta").css("width",$("#trade_statistics_money").width());
            this.dialogContent = this.dialog.getContent();
        },
        setContent:function(){
            var self = this;
        	var html = "<div class='transaction_amount_sta'>" +          
            				"<div class='transaction_amount_content' id='trade_statistics_money_chart' style='height:200px;'></div>" +
			           "</div>";
            this.dialogContent.html(html);  
            $('.weight-toolbar-zoomout').remove();
           /* $(".trade_amount_sta .weight .weight-toolbar .weight-toolbar-right .weight-toolbar-refresh").click(function(){
            	cloud.util.mask(self.dialogContent);
            	self.getData();
            });*/
            $(".trade_amount_sta .weight .weight-toolbar .weight-toolbar-right .weight-toolbar-refresh").hide();
        },
        getData:function(){
        	var self = this;
        	if($("#day").css("color") == "rgb(69, 154, 233)"){
        		self.fire("refreshDay");
        	}
			if($("#month").css("color") == "rgb(69, 154, 233)"){
				self.fire("refreshMonth"); 		
			}
			if($("#year").css("color") == "rgb(69, 154, 233)"){
				self.fire("refreshYear"); 	
			}
        },
        //刷新
        setData:function(data){
        	cloud.util.mask(this.dialogContent);
        	var self = this;
            this.chart = this.element.find(".transaction_amount_content").highcharts();
            self.chart.xAxis[0].setCategories(data.xAxis);
        	if( data.ydata.length){
        		 var result = data.ydata;
	        	 var amountChart = self.chart.get("automat_transaction_money_chart");
	             if(amountChart){	
	            	 amountChart.setData(result);
	             }else{
	            	 self.chart.addSeries({
                         id:"automat_transaction_money_chart",
                         name: locale.get("automat_transaction_money"),
                         color: COLOR,
                         type: 'column',//柱状图（column）
                         data: result,
                         tooltip: {
                             valueSuffix: locale.get("times_1")
                            
                         }
            	    });
	             } 
        	}
            //cloud.util.unmask(this.dialogContent);
        },

        renderChart:function(){
            this.element.find(".transaction_amount_content").highcharts("StockChart",{
            	  chart: {
                      zoomType: 'x'
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
                  plotOptions:{
                      area:{
                          marker:{
                              lineWidth: 2,
                              fillColor: 'white',
                              lineColor:COLOR,
                              enabled: true
                          },
                          lineWidth : 2,
                          dataGrouping:{
                              approximation:"high",
                              groupPixelWidth:10,

                              units: [
                                  ["day",[1,7]],
                                  ["month",[1]]
                              ]

                          }
                      }
                  },
                  xAxis: {  
                  },
                 
                  yAxis: [{ 
                      labels: {
                          align:"left",
                          x: 0,
                          y: 0,
                          style: {
                              color: COLOR
                          }
                      },
                      min:0,
                      minPadding:5,
                      title: {
                          text: '',
                          style: {
                              color: COLOR
                          }
                      }
                  }],
                  tooltip: {
                      shared: true
                  }
                  
              });
           
        },
        destroy:function($super){
            $super();
        }
    });

    return tradeAmountBar;
});