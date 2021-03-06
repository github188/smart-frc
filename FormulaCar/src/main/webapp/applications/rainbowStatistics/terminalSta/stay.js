/**
 * Created by zhang on 14-7-14.
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
    var COLOR = {
        light:"#856A4E",
        mid:"#595366",
        dark:"#639169"

    }

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
                title : locale.get("stay_time_stat"),//"停留时间统计",
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
            var html = "<div class='staycount'></div>"

            this.dialogContent.html(html)

        },


        setWindowContent:function(){
            this.winCharContainer = $("<div class='staycount-chart-container'></div>")
                .height(winHeight-50).width(winWidth-20);
            this.dialog.setWinContent(this.winCharContainer);
            this.winCharContainer.highcharts({
                chart: {
                    type:'column',
//                    spacingLeft : 40,
//                    options3d: {
//                        enabled: true,
//                        alpha: 12,
//                        beta: 9,
//                        depth: 50,
//                        viewDistance: 25
//                    }
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
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color:'white'
                        }
                    },
                    dataGrouping:{
                        forced:true,
                        units:[
                            ["month",[1]]
                        ]
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
                yAxis: {
//                    labels: {
//                        style: {
//                            color: '#89A54E'
//                        },
//                        x : -1020
//                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: 'gray'
                        }
                        
                    },
                    min : 0,
                    minPadding : 5,
                    title: {
                        text: ''
//                        style: {
//                            color: '#89A54E'
//                        }
                    }
                },
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
                    name: "2"+locale.get("_hours"),//'2小时',
                    color: COLOR.light,
                    type: 'column',
                    data: this.stayData[0],
                    tooltip: {
                        valueSuffix: locale.get("tai")//'人'
                    }

                },{
                    name: "5"+locale.get("_hours"),//'5小时',
                    color: COLOR.mid,
                    type: 'column',
                    data: this.stayData[1],
                    tooltip: {
                        valueSuffix: locale.get("tai")//'人'
                    }
                },{
                    name: ">5"+locale.get("_hours"),//'5小时以上',
                    color: COLOR.dark,
                    type: 'column',
                    data: this.stayData[2],
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
            var data = {
                endTime : date,
                startTime : date - 12*30*86400*1000,
                types:'31,32,33'
            }
            this.chart = this.element.find(".staycount").highcharts()

            this.service.getUserStat(data,function(result){
                var series1,series2,series3;
                result.each(function(one){
                    if(one.type == 31){
                        series1 = one.values;
                    }else if(one.type == 32){
                        series2 = one.values;
                    }else if(one.type == 33){
                        series3 = one.values;
                    }
                });

                self.stayData = [series1,series2,series3];

                var UserChart1 = self.chart.get("UserChart1");
                if(UserChart1){
                    UserChart1.setData(series1)
                }else{
                    self.chart.addSeries({
                        id:"UserChart1",
                        name: "2"+locale.get("_hours"),//'2小时',
                        color: COLOR.light,
                        type: 'column',
                        data: series1,
                        tooltip: {
                            valueSuffix: locale.get("tai")//'人'
                        }
                    })
                }

                var UserChart2 = self.chart.get("UserChart2");
                if(UserChart2){
                    UserChart2.setData(series2)
                }else{
                    self.chart.addSeries({
                        id:"UserChart2",
                        name: "5"+locale.get("_hours"),//'5小时',
                        color: COLOR.mid,
                        type: 'column',
                        data: series2,
                        tooltip: {
                            valueSuffix: locale.get("tai")//'人'
                        }
                    })
                }
                
                
                var UserChart3 = self.chart.get("UserChart3");
                if(UserChart3){
                    UserChart3.setData(series3)
                }else{
                    self.chart.addSeries({
                        id:"UserChart3",
                        name: ">5"+locale.get("_hours"),//'5小时以上',
                        color: COLOR.dark,
                        type: 'column',
                        data: series3,
                        tooltip: {
                            valueSuffix: locale.get("tai")//'人'
                        }
                    })
                }

                cloud.util.unmask(self.dialogContent);

            });

//           console.log(onlineData,"onlineData");
//           console.log(totalData,"totalData");

        },

        renderChart : function(avtiveData){
            this.element.find(".staycount").highcharts({
                chart: {
                    type:'column'
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
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false,
                            color:'white'
                        },
                        dataGrouping:{
                            forced:true,
                            units:[
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
                        month: '%b ',
                        year: '%Y'
                    },
                    type : "datetime"

                },
                yAxis: { // Primary yAxis
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }

                    },
                    min:0,
                    title: {
                        text: ''
                    }
                },
                tooltip: {
                    shared: true,
                    xDateFormat: '%Y-%m'
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
