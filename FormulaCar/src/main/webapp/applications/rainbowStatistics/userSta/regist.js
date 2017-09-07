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
                title : locale.get("new_user_stat"),//"注册用户统计",
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
            var html = "<div class='registcount'></div>"

            this.dialogContent.html(html)

        },


        setWindowContent:function(){
            this.winCharContainer = $("<div class='registcount-chart-container'></div>")
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
                            color: '#89A54E'
                        },
                        x : -1020
                    },
                    min : 0,
                    minPadding : 5,
                    title: {
                        margin : -1060,
                        text: locale.get("new_user"),//'注册用户数',
                        style: {
                            color: '#89A54E'
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
                    shared: true,
                    xDateFormat: '%Y-%m-%d'
                },
                series: [{
                    name: locale.get("new_user"),//'注册用户数',
                    color: '#89A54E',
                    type: 'column',
                    data: this.registData,
                    tooltip: {
                        valueSuffix: locale.get("ren")//'人'
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
            this.chart = this.element.find(".registcount").highcharts()

            this.service.getNewUser(data,function(result){
                self.registData = result;

                var registUserChart = self.chart.get("registUser");
                if(registUserChart){
                    registUserChart.setData(result)
                }else{
                    self.chart.addSeries({
                        id:"registUser",
                        name: locale.get("new_user"),//'注册用户',
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

//           console.log(onlineData,"onlineData");
//           console.log(totalData,"totalData");

        },

        renderChart : function(avtiveData){
            this.element.find(".registcount").highcharts("StockChart",{
                chart: {
                    zoomType: 'x'
//                    options3d: {
//                        enabled: true,
//                        alpha: 15,
//                        beta: 15,
//                        depth: 50,
//                        viewDistance: 25
//                    }
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
