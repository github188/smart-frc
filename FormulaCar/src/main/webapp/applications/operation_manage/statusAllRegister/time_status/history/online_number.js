define(function(require){
    var DashBoard = require("../../../../components/dashweight/dashboard");
    var winHeight = 424;
    var winWidth = 1100;
    var COLOR = Highcharts.getOptions().colors[4];
    var Service = require('../../../service');
    
    var online_number = Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            this._render();
            this.setContent();
            this.renderChart();
            this.getData();
        },
        _render:function(){
            var self = this;
            var width = this.element.width() * 0.5 - 32;
            this.element.addClass("weightContainer");
            this.dialog = new DashBoard({
                selector : this.element,
                title : locale.get("online_number"),
                width : width,
                winHeight : winHeight,
                winWidth : winWidth,
                events : {
                    "onWinShow":self.setWindowContent.bind(self),//详情按钮
                    "refresh" : self.getData.bind(self)//刷新按钮
                }
            });

            this.dialogContent = this.dialog.getContent();

        },
        setContent:function(){
            var html = "<div class='volumes'>" +          
                "<div class='volumes-content'></div>" +
                "</div>";
            this.dialogContent.html(html);
            
        },
        //详情（弹出框）
        setWindowContent:function(){
        	var self = this;
            this.winChartContainer = $("<div class='online-chart-container'></div>")
                .height(winHeight-50).width(winWidth-20);
            this.dialog.setWinContent(this.winChartContainer);
            var date1 = new Date();
     		var year = date1.getFullYear();
     		var month = date1.getMonth()+1;
     		var data = date1.getDate();
     		var date2 = new Date(year+"-"+month+"-"+data+" "+"23:59:59");
     		
     		var endTime=Date.parse(date2)/1000;
     		var startTime=endTime- 60 * 60 * 24 * 7;
     		Service.getOnlineHistoryStatistic(startTime,endTime,function(data){
     			if( data.result.length){
     				var onlineData = data.result[0].sum;
     				self.winChartContainer.highcharts("StockChart",{
     	                chart:{
     	                    zoomType:"y",
     	                    spacingLeft:40
     	                },
     	                title:{
     	                    text:""
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
     	                xAxis:{
     	                    dateTimeLabelFormats: {
     	                        second: '%H:%M:%S',
     	                        minute: '%H:%M',
     	                        hour: '%H:%M',
     	                        day: '%m-%d',
     	                        week: '%m-%d',
     	                        month: '%Y-%m',
     	                        year: '%Y'
     	                    },
     	                    type : "datetime"

     	                },
     	                yAxis: [{ 
     	                    labels: {
     	                        style: {
     	                            color: COLOR
     	                        },
     	                        x : -1020
     	                    },
     	                    min : 0,
     	                    minPadding : 5,
     	                    title: {
     	                        margin : -1060,
     	                        text: locale.get("online_number"),
     	                        style: {
     	                            color: COLOR
     	                        }
     	                    }
     	                }],
     	                navigator:{
     	                    baseSeries: 1
     	                },
     	                rangeSelector: {
     	                    selected : 0,
     	                    inputEnabled : true
     	                },
     	                tooltip: {
     	                },
     	                series: [{
     	                    name: locale.get("online_number"),
     	                    color: COLOR,
     	                    type: 'column',
     	                    data: onlineData,
     	                    tooltip: {
     	                        valueSuffix: locale.get("tai")
     	                    }
     	                }]
     	            });
     			}
     		});


        },
        //刷新
        getData:function(){
        	var self = this;
        	this.chart = this.element.find(".volumes-content").highcharts();
             
            var date1 = new Date();
     		var year = date1.getFullYear();
     		var month = date1.getMonth()+1;
     		var data = date1.getDate();
     		var date2 = new Date(year+"-"+month+"-"+data+" "+"23:59:59");
     		
     		var endTime=Date.parse(date2)/1000;
     		var startTime=endTime- 60 * 60 * 24 * 7;
     		
     		Service.getOnlineHistoryStatistic(startTime,endTime,function(data){
     			if( data.result.length){
     				 var result = data.result[0].sum;
     				 var online_numberChart = self.chart.get("online_number");
     	             if(online_numberChart){	
     	            	 online_numberChart.setData(result);
     	             }else{
     	            	self.chart.addSeries({
     	                         id:"online_number",
     	                         name: locale.get("online_number"),
     	                         color: COLOR,
     	                         type: 'column',//柱状图（column）
     	                         data: result,
     	                         tooltip: {
     	                             valueSuffix: locale.get("tai")
     	                         }
     	                });
     	             }
     			}
     		});
        },
        renderChart:function(){
            this.element.find(".volumes-content").highcharts("StockChart",{
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
                xAxis:{
                    dateTimeLabelFormats: {
                        second: '%H:%M:%S',
                        minute: '%H:%M',
                        hour: '%H:%M',
                        day: '%m-%d',
                        week: '%m-%d',
                        month: '%Y-%m',
                        year: '%Y'
                    },
                    type : "datetime"

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
                    shared: true,
                    xDateFormat: '%Y-%m-%d'
                }
            });
        },


        destroy:function($super){
            $super();
        }
    });

    return online_number;
});