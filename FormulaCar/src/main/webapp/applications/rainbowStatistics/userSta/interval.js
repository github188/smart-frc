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
        color1:"#856A4E",
        color2:"#595366",
        color3:"#639169",
        color4:"#63534E"
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
                title : locale.get("visit_interval_stat"),//"来访间隔统计",
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
            var html = "<div class='intervalcount'></div>"

            this.dialogContent.html(html)

        },


        setWindowContent:function(){
            this.winCharContainer = $("<div class='intervalcount-chart-container'></div>")
                .height(winHeight-50).width(winWidth-20);
            this.dialog.setWinContent(this.winCharContainer);
            this.winCharContainer.highcharts({
                chart: {
                    type:'column'
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
                    name: "1"+locale.get("_days"),//'1天',
                    color: COLOR.color1,
                    type: 'column',
                    data: this.stayData[0],
                    tooltip: {
                        valueSuffix: locale.get("ren")//'人'
                    }

                },{
                    name: "2"+locale.get("_days"),//'2天',
                    color: COLOR.color2,
                    type: 'column',
                    data: this.stayData[1],
                    tooltip: {
                        valueSuffix: locale.get("ren")//'人'
                    }
                },{
                    name: "3"+locale.get("_days"),//'3天',
                    color: COLOR.color3,
                    type: 'column',
                    data: this.stayData[2],
                    tooltip: {
                        valueSuffix: locale.get("ren")//'人'
                    }
                },{
                    name: ">3"+locale.get("_days"),//'3天以上',
                    color: COLOR.color4,
                    type: 'column',
                    data: this.stayData[3],
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
                startTime : date - 12*30*86400*1000,
                types:'11,12,13,14'
            }
            this.chart = this.element.find(".intervalcount").highcharts()

            this.service.getUserStat(data,function(result){
                var series1,series2,series3,series4;
                result.each(function(one){
                    if(one.type == 11){
                        series1 = one.values;
                    }else if(one.type == 12){
                        series2 = one.values;
                    }else if(one.type == 13){
                        series3 = one.values;
                    }else if(one.type == 14){
                        series4 = one.values;
                    }
                });

                self.stayData = [series1,series2,series3,series4];

                var UserChart1 = self.chart.get("UserChart1");
                if(UserChart1){
                    UserChart1.setData(series1)
                }else{
                    self.chart.addSeries({
                        id:"UserChart1",
                        name: "1"+locale.get("_days"),//'1天',
                        color: COLOR.color1,
                        type: 'column',
                        data: series1,
                        tooltip: {
                            valueSuffix: locale.get("ren")//'人'
                        }
                    })
                }

                var UserChart2 = self.chart.get("UserChart2");
                if(UserChart2){
                    UserChart2.setData(series2)
                }else{
                    self.chart.addSeries({
                        id:"UserChart2",
                        name: "2"+locale.get("_days"),//'2天',
                        color: COLOR.color2,
                        type: 'column',
                        data: series2,
                        tooltip: {
                            valueSuffix: locale.get("ren")//'人'
                        }
                    })
                }


                var UserChart3 = self.chart.get("UserChart3");
                if(UserChart3){
                    UserChart3.setData(series3)
                }else{
                    self.chart.addSeries({
                        id:"UserChart3",
                        name: "3"+locale.get("_days"),//'3天',
                        color: COLOR.color3,
                        type: 'column',
                        data: series3,
                        tooltip: {
                            valueSuffix: locale.get("ren")//'人'
                        }
                    })
                }

                var UserChart4 = self.chart.get("UserChart4");
                if(UserChart4){
                    UserChart4.setData(series3)
                }else{
                    self.chart.addSeries({
                        id:"UserChart4",
                        name: ">3"+locale.get("_days"),//'3天以上',
                        color: COLOR.color4,
                        type: 'column',
                        data: series4,
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

        renderChart : function(){
            this.element.find(".intervalcount").highcharts({
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
