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

    var userCount = Class.create(cloud.Component,{
        initialize : function($super,options){

            $super(options)

            this.service = Service;

            this.render();

            this.setContent();

            this.renderChart();

            this.getData();

            this.refresh(1000*60*2);
        },

        refresh:function(time){
            var self = this;
            this.timer = setInterval(function(){
                self.getData();
            },time);
        },
        stoprefresh:function(){
            var self = this;
            this.timer && clearInterval(self.timer)
        },

        render:function(){
            var self = this;
            var width = this.element.width() * 0.47;
            this.dialog = new DashBoard({
                selector : this.element,
                title : locale.get("active_user_stat"),//"活跃用户统计",
                width : width,
                winHeight:winHeight,
                winWidth:winWidth,
                events:{
                    "onWinShow":self.setWindowContent.bind(self),
                    "refresh" : self.getData.bind(self)

//                   "onWinShow":function(){
//                       self.setWindowContent();
//                   }

                }
            });

            this.dialogContent = this.dialog.getContent();
        },

        setContent : function(){
            var html = "<div class='activecount'></div>"

            this.dialogContent.html(html);

            this.chartwidth = this.dialogContent.width() - 25;

        },


        setWindowContent:function(){
            this.winCharContainer = $("<div class='activecount-chart-container'></div>")
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
                                ["day",[7]]
//                                ['week',[1]]
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
//                            groupPixelWidth:40,

                            units: [
                                ["day",[7]]
//                                ['week',[1]]
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
                        text: locale.get("active_user"),//'活跃用户数',
                        style: {
                            color: '#89A54E'
                        }
                    }
                },{ // Secondary yAxis
                    title: {
                        text:locale.get("total_user"),//"总用户数",
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
                    name: locale.get("total_user"),//'总用户',
                    color: '#4572A7',
                    type: 'area',
                    yAxis: 1,
                    data: this.totalData,
                    tooltip: {
                        valueSuffix: locale.get("ren")//'人'
                    }

                },{
                    name: locale.get("active_user"),//'活跃用户数',
                    color: '#89A54E',
                    type: 'column',
                    data: this.registData,
                    tooltip: {
                        valueSuffix: locale.get("ren")//'人',
//                        dateTimeLabelFormats:{
//                            millisecond: '%A, %b %e, %H:%M:%S.%L',
//                            second: '%A, %b %e, %H:%M:%S',
//                            minute: '%A, %b %e, %H:%M',
//                            hour: '%A, %b %e, %H:%M',
//                            day: '%A, %b %e, %Y',
//                            week: 'Week from %A, %b %e, %Y',
//                            month: '%B %Y',
//                            year: '%Y'
//                        }
                    }

                }]
            });



        },

        getData:function(){
            cloud.util.mask(this.dialogContent);
            var self = this;
            var date = new Date().getTime();
            var data = {
                endTime : date,
                startTime : date - 6*30*86400*1000
            }
            this.chart = this.element.find(".activecount").highcharts()

            this.service.getActiveUser(data,function(result){
                self.registData = result;

                var registUserChart = self.chart.get("registUser");
                if(registUserChart){
                    registUserChart.setData(result)
                }else{
                    self.chart.addSeries({
                        id:"registUser",
                        name: locale.get("active_user"),//'活跃用户',
                        color: '#89A54E',
                        type: 'column',
                        data: result,
                        tooltip: {
                            valueSuffix: locale.get("ren")//'人'
                        }
                    })
                }

                cloud.util.unmask(self.dialogContent);

            });

            this.service.getTotalUser(data,function(result){
                self.totalData = result;

                var totalUserChart = self.chart.get("totalUser");
                if(totalUserChart){
                    totalUserChart.setData(result)
                }else{
                    self.chart.addSeries({
                        id:"totalUser",
                        name: locale.get("total_user"),//'总用户',
                        color: '#4572A7',
                        type: 'area',
                        yAxis: 1,
                        data: result,
                        tooltip: {
                            valueSuffix: locale.get("ren")//'人'
                        }
                    });
                }

            });

//           console.log(onlineData,"onlineData");
//           console.log(totalData,"totalData");

        },

        renderChart : function(){
            this.element.find(".activecount").highcharts("StockChart",{
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
                                ["day",[7]],
//                                ['week',[1]],
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
                                 forceed:true,
                            units: [
                                ["day",[7]],
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
                        x: -this.chartwidth,
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
                        x: 0,
                        y: 0,
                        style: {
                            color: '#4572A7'
                        }
                    },
                    opposite: true
                }],
                tooltip: {
                    shared: true
//                    xDateFormat: 'Week from %A, %b %e, %Y'
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

    return userCount
});
