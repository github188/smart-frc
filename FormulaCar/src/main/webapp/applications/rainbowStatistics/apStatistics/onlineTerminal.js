/**
 * Created by zhang on 14-9-9.
 */
define(function(require){
    var DashBoard = require("../../components/dashweight/dashboard");
    var Service = require("./service");

    var winHeight = 524;
    var winWidth = 1100;
    var COLOR = Highcharts.getOptions().colors[0]

    var onlineTerminal = Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);

            this.service = Service;

            this.siteId = options.siteId;

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
                title : locale.get("online_ter_stat"),
                width : width,
                winHeight : winHeight,
                winWidth : winWidth,
                events : {
                    "onWinShow":self.setWindowContent.bind(self),
                    "refresh" : self.getData.bind(self)

                }
            });

            this.dialogContent = this.dialog.getContent();

        },

        setContent:function(){
            var html = "<div class='online-terminal'>" +
                "<div class='online-terminal-header'></div>" +
                "<div class='online-terminal-content'></div>" +
                "</div>";

            this.dialogContent.html(html);
            this.staContent = this.element.find(".online-terminal-header");
            this._renderStaContent();
        },

        _renderStaContent:function(){
            var itemsHtml = "<div class='onlineterminal-item-current sta-item-block'>" +
                "<p class='onlineterminal-item-current-value sta-item-block-value'>-</p>"+
                "<p class='onlineterminal-item-current-title sta-item-block-title'>"+locale.get("current_online")+"</p>"+
                "</div>"+
                "<div class='onlineterminal-item-average sta-item-block'>" +
                "<p class='onlineterminal-item-average-value sta-item-block-value'>-</p>"+
                "<p class='onlineterminal-item-average-title sta-item-block-title'>"+locale.get("average_online")+"</p>"+
                "</div>"+
                "<div class='onlineterminal-item-max sta-item-block'>" +
                "<p class='onlineterminal-item-max-value sta-item-block-value'>-</p>"+
                "<p class='onlineterminal-item-max-title sta-item-block-title'>"+locale.get("maximum_online")+"</p>"+
                "</div>"
            this.staContent.html(itemsHtml);

        },

        setWindowContent:function(){
            this.winChartContainer = $("<div class='online-chart-container'></div>")
                .height(winHeight-50).width(winWidth-20);
            this.dialog.setWinContent(this.winChartContainer);
            this.winChartContainer.highcharts("StockChart",{
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
//                                ['week',[1]],
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
                yAxis: [{ // Primary yAxis
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
                        text: locale.get("online_ter"),//'在线终端数',
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
                    name: locale.get("online_ter"),//'在线终端数',
                    color: COLOR,
                    type: 'area',
                    data: this.onlineData,
                    tooltip: {
                        valueSuffix: locale.get("tai")//'人'
                    }

                }]
            });

        },

        getData:function(){
            cloud.util.mask(this.dialogContent);
            var self = this;
            var date = new Date().getTime();
            var data ={
                siteId:this.siteId,
                endTime : date,
//                startTime : date - 6*30*86400*1000
                startTime : date - 30*86400*1000
            };
            this.chart = this.element.find(".online-terminal-content").highcharts();

            this.service.getOnlineTerminal(data,function(result){
                self.onlineData = result;

                var onlineTerminalChart = self.chart.get("onlineTerminal");
                if(onlineTerminalChart){
                    onlineTerminalChart.setData(result);
                }else{
                    self.chart.addSeries({
                        id:"onlineTerminal",
                        name: locale.get("online_ter"),
                        color: COLOR,
                        type: 'area',
                        data: result,
                        tooltip: {
                            valueSuffix: locale.get("tai")//'人'
                        }
                    });
                }

                self.procData(result);

                cloud.util.unmask(self.dialogContent);

            });
        },

        procData:function(data){
            if(data.length > 0){
                var valarr = data.collect(function(one){
                    return one[1];
                });
                var current = valarr.last();
                var max = valarr.max();
                var total = valarr.reduce(function(pv, cv) { return pv + cv; },0);
                var average = Math.ceil(total / valarr.length);

                this.element.find(".onlineterminal-item-current-value").text(current);
                this.element.find(".onlineterminal-item-max-value").text(max);
                this.element.find(".onlineterminal-item-average-value").text(average);
            }

        },

        renderChart:function(){
            this.element.find(".online-terminal-content").highcharts("StockChart",{
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
//                                ['week',[1]],
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
                yAxis: [{ // Primary yAxis
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
//                    xDateFormat: '%Y-%m-%d'
                }
            });
        },


        destroy:function($super){
//            this.stoprefresh();

            $super();
        }
    });

    return onlineTerminal;
});