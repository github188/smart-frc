/**
 * Created by zhang on 14-7-4.
 */
/**
 * Created by inhand on 14-6-10.
 */
define(function(require){
    var DashBoard = require("../../components/dashweight/dashboard");
//    require("cloud/lib/plugin/highstock.src");
//    require("http://code.highcharts.com/stock/highstock.js")
//    require("cloud/lib/plugin/exporting.src")
//   var chart = require("../../components/content-chart");

    var Service = require("./service");

    var winHeight = 524;
    var winWidth = 1100;

    var terminalCount = Class.create(cloud.Component,{
        initialize : function($super,options){

            $super(options)

            this.service = Service;

            this.render();

            this.setContent();

            this.renderChart();

            this.getData(this.options.oid,true);

            this.refresh(1000*60*2);
        },

        refresh:function(time){
            var self = this;
            this.timer = setInterval(function(){
                self.getData(self.options.oid);
            },time);
        },
        stoprefresh:function(){
            var self = this;
            this.timer && clearInterval(self.timer)
        },

        render:function(){
            var self = this;
            this.dialog = new DashBoard({
                selector : this.element,
                title : "活跃终端统计",
                width : 420,
                winHeight:winHeight,
                winWidth:winWidth,
                events:{
                    "onWinShow":self.setWindowContent.bind(self),
                    "refresh" : function(){
                        self.getData(self.options.oid,true);
                    }


//                   "onWinShow":function(){
//                       self.setWindowContent();
//                   }

                }
            });

            this.dialogContent = this.dialog.getContent();
        },

        setContent : function(){
            var html = "<div class='terminal-activecount'></div>"

            this.dialogContent.html(html)

        },


        setWindowContent:function(){
            this.winCharContainer = $("<div class='terminal-activecount-chart-container'></div>")
                .height(winHeight-50).width(winWidth-20);
            this.dialog.setWinContent(this.winCharContainer);
            this.winCharContainer.highcharts("StockChart",{
                chart: {
                    zoomType: 'y',
                    spacingLeft : 40
                },
                credits:{
                    enabled:false
                },
                title:{
                    text:""
                },
                legend: {
                    enabled: true
                },
                plotOptions:{
                    area: {
                        fillColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        lineWidth: 1,
                        marker: {
                            enabled: true
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null,
                        dataGrouping:{
                            approximation:"high",
                            forced:true,
                            units:[
                                ['week',[1]]
                            ]
                        }
                    },
                    column:{
                        marker:{
                            enabled: false
                        },
//                        lineWidth : 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        dataGrouping:{
                            groupPixelWidth:40,

                            units: [
                                ['week',[1]]
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
                            color: '#89A54E'
                        },
                        x : -970
                    },
                    min : 0,
                    minPadding : 5,
                    title: {
                        margin : -970,
                        text: '活跃终端数',
                        style: {
                            color: '#89A54E'
                        }
                    }
                },{ // Secondary yAxis
                    title: {
                        text:"总终端数",
                        style: {
                            color: '#4572A7'
                        }
                    },
                    min:0,
                    labels: {
                        style: {
                            color: '#4572A7'
                        }
                    },
                    opposite: true
                }],
                navigator:{
                    baseSeries: 1
                },
                rangeSelector: {
                    selected : 0,
                    inputEnabled : true
                },
                tooltip: {
                    shared: true,
                    xDateFormat: '%Y-%m-%d'
                },
                series: [{
                    name: '总终端',
                    color: '#4572A7',
                    type: 'area',
                    yAxis: 1,
                    data: this.totalData,
                    tooltip: {
                        valueSuffix: '人'
                    }

                },{
                    name: '活跃终端数',
                    color: '#89A54E',
                    type: 'column',
                    data: this.registData,
                    tooltip: {
                        valueSuffix: '人',
                        dateTimeLabelFormats:{
                            millisecond: '%A, %b %e, %H:%M:%S.%L',
                            second: '%A, %b %e, %H:%M:%S',
                            minute: '%A, %b %e, %H:%M',
                            hour: '%A, %b %e, %H:%M',
                            day: '%A, %b %e, %Y',
                            week: 'Week from %A, %b %e, %Y',
                            month: '%B %Y',
                            year: '%Y'
                        }
                    }

                }]
            });



        },

        getData:function(oid,mask){
            mask = mask || false;
            mask && cloud.util.mask(this.dialogContent);
            var self = this;
            var date = new Date().getTime();
            var data = {
                endTime : date,
                startTime : date - 6*30*86400*1000,
                oid:oid
            }
            this.chart = this.element.find(".terminal-activecount").highcharts()

            this.service.getActiveTerminal(data,function(result){
                self.registData = result;

                var registterminalChart = self.chart.get("registterminal");
                if(registterminalChart){
                    registterminalChart.setData(result)
                }else{
                    self.chart.addSeries({
                        id:"registterminal",
                        name: '活跃终端',
                        color: '#89A54E',
                        type: 'column',
                        data: result,
                        tooltip: {
                            valueSuffix: '人'
                        }
                    })
                }

                cloud.util.unmask(self.dialogContent);

            });

            this.service.getTotalTerminal(data,function(result){
                self.totalData = result;

                var totalterminalChart = self.chart.get("totalterminal");
                if(totalterminalChart){
                    totalterminalChart.setData(result)
                }else{
                    self.chart.addSeries({
                        id:"totalterminal",
                        name: '总终端',
                        color: '#4572A7',
                        type: 'area',
                        yAxis: 1,
                        data: result,
                        tooltip: {
                            valueSuffix: '人'
                        }
                    });
                }

            });

//           console.log(onlineData,"onlineData");
//           console.log(totalData,"totalData");

        },

        renderChart : function(){
            this.element.find(".terminal-activecount").highcharts("StockChart",{
                chart: {
                    zoomType: 'x',
                    spacing:[10 ,20, 15, 20]

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
                title:{
                    text:""
                },
                legend: {
                    enabled: false
                },
                plotOptions:{
                    area: {
                        fillColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        lineWidth: 1,
                        marker: {
                            enabled: true
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null,
                        dataGrouping:{
                            approximation:"high",
                            forced:true,
                            units:[
                                ["day",[1]],
                                ['week',[1]],
                                ["month",[1]]
                            ]
                        }
                    },

                    column:{
                        marker:{
                            enabled: false
                        },
                        lineWidth : 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        dataGrouping:{
                            groupPixelWidth:60,

                            units: [
                                ["day",[1]],
                                ['week',[1]],
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
                        x: -390,
                        y: 0,
                        style: {
                            color: '#89A54E'
                        }
                    },
                    min:0,
                    minPadding:5,
                    title: {
                        text: '',
                        style: {
                            color: '#89A54E'
                        }
                    }
                },{// Secondary yAxis
                    title: {
                        text:"",
                        style: {
                            color: '#4572A7'
                        }
                    },
                    min:0,
                    labels: {
                        align:"right",
                        x: 20,
                        y: 0,
                        style: {
                            color: '#4572A7'
                        }
                    },
                    opposite: true
                }],
                tooltip: {
                    shared: true,
                    xDateFormat: '%Y-%m-%d'
                },
                series: [{
                }]
            })
        },



        destroy : function($super){

            this.stoprefresh();

            $super()
        }
    });

    return terminalCount
});
