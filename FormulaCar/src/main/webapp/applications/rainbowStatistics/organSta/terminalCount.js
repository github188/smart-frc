/**
 * Created by zhang on 14-7-4.
 */
/**
 * Created by inhand on 14-6-10.
 */
define(function(require){
    var DashBoard = require("../../components/dashweight/dashboard");
//   require("cloud/lib/plugin/highstock.src");
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

            this.getData(this.options.oid);

            this.refresh(1000*60*2)


        },

        refresh:function(time){
            var self = this;
            this.timer = setInterval(function(){
                self.refreshData(self.options.oid);
            },time);
        },
        stoprefresh:function(){
            var self = this;
            this.timer && clearInterval(self.timer);
            this.service.abort();
        },

        render:function(){
            var self = this;
            this.dialog = new DashBoard({
                selector : this.element,
                title : "终端数量统计",
                width : 520,
                winHeight:winHeight,
                winWidth:winWidth,
                events:{
                    "onWinShow":self.setWindowContent.bind(self),
                    "refresh" : function(){
                        self.refreshData(self.options.oid,true);
                    }

//                   "onWinShow":function(){
//                       self.setWindowContent();
//                   }

                }
            });

            this.dialogContent = this.dialog.getContent();
            //console.log(this.dialogContent);
        },

        setContent : function(){
            var html = "<div class='terminalcount ui-helper-clearfix'>" +
                "<div class='terminalcount-left'>" +
                "<div class='terminalcount-item-onlineblock item-block'>" +
                "<p class='terminalcount-item-onlineblock-title item-block-title'>接入终端</p>"+
                "<p class='terminalcount-item-onlineblock-value item-block-value'></p>"+
                "</div>" +
                "<div class='terminalcount-item-historyblock item-block'>" +
                "<p class='terminalcount-item-historyblock-title item-block-title'>总终端</p>"+
                "<p class='terminalcount-item-historyblock-value item-block-value'></p>"+
                "</div>" +
                "</div>"+
                "<div class='terminalcount-right'></div>"+
                "</div>"
            this.dialogContent.html(html)

        },

        setCurrentOnline:function(curOnline){

            this.element.find(".terminalcount-item-onlineblock-value").text(curOnline);
        },

        setCurrentTotal:function(curTotal){

            this.element.find(".terminalcount-item-historyblock-value").text(curTotal);
        },


        setWindowContent:function(){
            this.winCharContainer = $("<div class='terminalcount-chart-container'></div>")
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
                                ["day",[1]],
                                ['week',[1]],
                                ["month",[1]]
                            ]
                        }
                    },
                    line:{
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
//                           enabled:false,
                            approximation:"high",
                            groupPixelWidth:15,
                            forced:true,
                            units:[
                                ['minute',[10]],
                                ["hour",[1]],
                                ["day",[1]]

                            ]
                        }
                    }
                },
                xAxis:{
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
                        text: '接入终端数',
                        style: {
                            color: '#89A54E'
                        }
                    }
                }, { // Secondary yAxis
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

                }, {
                    name: '接入终端',
                    color: '#89A54E',
                    type: 'line',
                    data: this.onlineData,
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
            })




        },

        refreshData:function(oid,mask){
            mask = mask || false;
            mask && cloud.util.mask(this.dialogContent);
            var self = this;
            var date = new Date().getTime();
            var data = {
                endTime : date,
                startTime : this.endTime,
                oid:oid
            }
            this.endTime = date;
            this.chart = this.element.find(".terminalcount-right").highcharts()

            this.service.getOnlineTerminal(data,function(result){
                if(result){
                    self.onlineData = self.onlineData.concat(result);

                    var onlineterminalChart = self.chart.get("onlineterminal")
                    if(onlineterminalChart){//update
                        var i = 0;
                        for (i; i < result.length; i++) {
                            onlineterminalChart.addPoint(result[i], false);
                        }
//                   onlineterminalChart.setData(result);
                        self.chart.redraw();
                    }else{//add
                        self.chart.addSeries({
                            id:"onlineterminal",
                            name: '接入终端',
                            color: '#89A54E',
                            type: 'line',
                            data: result,
                            tooltip: {
                                valueSuffix: '人'
                            }
                        });
                    }
                }
                cloud.util.unmask(self.dialogContent);
            });

            this.service.getTotalTerminal(data,function(result){
                if(result){
                    self.totalData = self.totalData.concat(result);

                    var totalterminalChart = self.chart.get("totalterminal");
                    if(totalterminalChart){
                        totalterminalChart.setData(self.totalData)
                    }else{
                        self.chart.addSeries({
                            id:"totalterminal",
                            name: '总终端',
                            color: '#4572A7',
                            type: 'area',
                            yAxis: 1,
                            data: self.totalData,
                            tooltip: {
                                valueSuffix: '人'
                            }
                        });
                    }
                }


            });

            this.service.getTerminalCount(oid,function(data){
                if(data.all){
                    self.setCurrentTotal(data.all.count)
                }
                if(data.online){
                    self.setCurrentOnline(data.online.count)
                }

            });

        },
        getData:function(oid){
            cloud.util.mask(this.dialogContent);
            var self = this;
            var date = new Date().getTime();
            var data = {
                endTime : date,
//               endTime : 1398000000000,
                startTime : date - 6*30*86400*1000,
                oid:oid
            }
            this.endTime = data.endTime;
            this.chart = this.element.find(".terminalcount-right").highcharts()

            this.service.getOnlineTerminal(data,function(result){
                self.onlineData = result;

                var onlineterminalChart = self.chart.get("onlineterminal")
                if(onlineterminalChart){//update
                    onlineterminalChart.setData(result);
                }else{//add
                    self.chart.addSeries({
                        id:"onlineterminal",
                        name: '接入终端',
                        color: '#89A54E',
                        type: 'line',
                        data: result,
                        tooltip: {
                            valueSuffix: '人'
                        }
                    });
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

            this.service.getTerminalCount(oid,function(data){
                if(data.all){
                    self.setCurrentTotal(data.all.count)
                }
                if(data.online){
                    self.setCurrentOnline(data.online.count)
                }

            });

        },

        renderChart : function(){
            this.element.find(".terminalcount-right").highcharts("StockChart",{
                chart: {
                    zoomType: 'x',
                    spacingLeft : 15
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
                            enabled: false
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null,
                        dataGrouping:{
                            forced:true,
                            approximation:"high",
                            units:[
                                ["day",[1]]
                            ]
                        }
                    },
                    line:{
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
                            forced:true,
                            approximation:"high",
                            units:[
                                ["day",[1]]
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
                        x: -370,
                        y: 0,
                        style: {
                            color: '#89A54E'
                        }
                    },
                    min:0,
                    title: {
                        text: '',
                        style: {
                            color: '#89A54E'
                        }
                    }
                }, { // Secondary yAxis
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
