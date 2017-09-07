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
                self.refreshData();
            },time);
        },
        stoprefresh:function(){
            var self = this;
            this.timer && clearInterval(self.timer)
        },

        render:function(){
            var self = this;
            var width = this.element.width() * 0.96;

            this.dialog = new DashBoard({
                selector : this.element,
                title : locale.get("online_user_stat"),//"在线用户统计",
                width : width,
                winHeight:winHeight,
                winWidth:winWidth,
                events:{
                    "onWinShow":self.setWindowContent.bind(self),
                    "refresh" : self.refreshData.bind(self)

//                   "onWinShow":function(){
//                       self.setWindowContent();
//                   }

                }
            });

            this.dialogContent = this.dialog.getContent();
        },

        setContent : function(){
//            var html = "<div class='onlinecount'></div>"

//            this.dialogContent.html(html);

            var $content = $("<div class='onlinecount'></div>");

            this.dialogContent.append($content);

//            $content.width(this.dialogContent.width());

        },


        setWindowContent:function(){
            this.winCharContainer = $("<div class='onlinecount-chart-container'></div>")
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
//                legend: {
//                    enabled: true
//                },
                plotOptions:{
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
                            groupPixelWidth:20,
                            forced:true,
                            units:[
                                ['minute',[30]],
//                                ["hour",[1]],
                                ["day",[1]]

                            ]
                        }
                    }
                },
                rangeSelector:{
                    buttons:[{
                        type: 'month',
                        count: 1,
                        text: '1m'
                    }, {
                        type: 'month',
                        count: 3,
                        text: '3m'
                    }, {
                        type: 'month',
                        count: 6,
                        text: '6m'
                    }, /*{
                        type: 'ytd',
                        text: 'YTD'
                    }, {
                        type: 'year',
                        count: 1,
                        text: '1y'
                    },*/ {
                        type: 'all',
                        text: 'All'
                    }],
                    selected:3,
                    inputEnabled  : true
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
                    }
//                    type : "datetime"

                },
                yAxis: [{ // Primary yAxis
                    labels: {
                        style: {
                            color: '#89A54E'
                        },
                        x : -1020
                    },
                    min : 0,
                    minPadding : 5,
                    title: {
                        margin : -1060,
                        text: locale.get("online_user"),//'在线用户数',
                        style: {
                            color: '#89A54E'
                        }
                    }
                }],
                navigator:{
                    baseSeries: 1
                },
                tooltip: {
                    shared: true,
                    xDateFormat: '%Y-%m-%d'
                },
                series: [{
                    name: locale.get("online_user"),//'在线用户数',
                    color: '#89A54E',
                    type: 'line',
                    data: this.onlineData,
                    tooltip: {
                        valueSuffix: locale.get("ren")//'人'
                    }

                }]
            });


            var chart = this.winCharContainer.highcharts();
            var dateArr = this.service.getWeekendArr(this.onlineData.first().first(),this.onlineData.last().first());
            dateArr.each(function(date){
                chart.xAxis[0].addPlotBand({
                    color: 'rgb(201, 214, 186)',
                    from: date,
                    to: date + 2*86400000,
                    label: {
                        text: '',
                        style:{
                            color:"white"
                        },
                        align: 'center',
                        verticalAlign: 'top',
                        y: 12
                    }
                });
            });




        },
        refreshData:function(){
            cloud.util.mask(this.dialogContent);
            var self = this;
            var date = new Date().getTime();
            var data = {
                endTime : date,
                startTime : this.endTime
            }
            this.endTime = date;
            this.chart = this.element.find(".onlinecount").highcharts()

            this.service.getOnlineUser(data,function(result){
                if(result){
                    self.onlineData = self.onlineData.concat(result);

                    var onlineUserChart = self.chart.get("onlineUser");
                    if(onlineUserChart){
                        var i= 0;
                        for (i; i < result.length; i++) {
                            onlineUserChart.addPoint(result[i], false);
                        }
//                    onlineUserChart.addPoint(result,false);
                        self.chart.redraw();
                    }else{
                        self.chart.addSeries({
                            id:"onlineUser",
                            name: locale.get("online_user"),//'在线用户',
                            color: '#89A54E',
                            type: 'line',
                            data: result,
                            tooltip: {
                                valueSuffix: locale.get("ren")//'人'
                            }
                        })
                    }

                }


                cloud.util.unmask(self.dialogContent);

            });

        },


        getData:function(){
            cloud.util.mask(this.dialogContent);
            var self = this;
            var date = new Date().getTime();
            var data = {
//                endTime : 1398000000000,
                endTime : date,
                startTime : date - 6*30*86400*1000
            }
            this.endTime = data.endTime;
            this.chart = this.element.find(".onlinecount").highcharts()

            this.service.getOnlineUser(data,function(result){
                if(result){
                    self.onlineData = result;

                    if(result.length > 15*24){
                        result = result.slice(result.length-15*24,result.length)
                    }

                    var onlineUserChart = self.chart.get("onlineUser");
                    if(onlineUserChart){
                        onlineUserChart.setData(result)
                    }else{
                        self.chart.addSeries({
                            id:"onlineUser",
                            name: locale.get("online_user"),//'在线用户',
                            color: '#89A54E',
                            type: 'line',
                            data: result,
                            tooltip: {
                                valueSuffix: locale.get("ren")//'人'
                            }
                        })
                    }
                }




                cloud.util.unmask(self.dialogContent);

            });

//           console.log(onlineData,"onlineData");
//           console.log(totalData,"totalData");

        },

        renderChart : function(){
            this.element.find(".onlinecount").highcharts("StockChart",{
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
                title:{
                    text:""
                },
                legend: {
                    enabled: false
                },
                plotOptions:{

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
                                ['minute',[30]],
//                                ["hour",[1]],
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
                        x: 0,
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

    return userCount
});
