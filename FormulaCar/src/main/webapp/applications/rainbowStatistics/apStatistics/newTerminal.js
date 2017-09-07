/**
 * Created by zhang on 14-9-11.
 */
define(function(require){
    var DashBoard = require("../../components/dashweight/dashboard");
    var Service = require("./service");

    var winHeight = 524;
    var winWidth = 1100;
    var COLOR = Highcharts.getOptions().colors[4];

    var registUser = Class.create(cloud.Component,{
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
                title : locale.get("new_ter_stat"),
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
            var html = "<div class='regist-user'>" +
                "<div class='regist-user-header'></div>" +
                "<div class='regist-user-content'></div>" +
                "</div>";

            this.dialogContent.html(html);
            this.staContent = this.element.find(".regist-user-header");
            this._renderStaContent();
        },

        _renderStaContent:function(){
            var itemsHtml = "<div class='registuser-item-today sta-item-block'>" +
                "<p class='registuser-item-today-value sta-item-block-value'>-</p>"+
                "<p class='registuser-item-today-title sta-item-block-title'>"+locale.get("today_regist")+"</p>"+
                "</div>"+
                "<div class='registuser-item-week sta-item-block'>" +
                "<p class='registuser-item-week-value sta-item-block-value'>-</p>"+
                "<p class='registuser-item-week-title sta-item-block-title'>"+locale.get("week_regist")+"</p>"+
                "</div>"+
                "<div class='registuser-item-month sta-item-block'>" +
                "<p class='registuser-item-month-value sta-item-block-value'>-</p>"+
                "<p class='registuser-item-month-title sta-item-block-title'>"+locale.get("month_regist")+"</p>"+
                "</div>"
            this.staContent.html(itemsHtml);

        },

        setWindowContent:function(){
            this.winChartContainer = $("<div class='regist-chart-container'></div>")
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
                    column:{
                        marker:{
                            lineWidth: 2,
                            fillColor: 'white',
                            lineColor:COLOR,
                            enabled: true
                        },
                        lineWidth : 2,
                        dataGrouping:{
                            approximation:"sum",
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
                        text: locale.get("new_ter"),//'新接入终端',
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
                    shared: true,
                    xDateFormat: '%Y-%m-%d'
                },
                series: [{
                    name: locale.get("new_ter"),//'在线用户数',
                    color: COLOR,
                    type: 'column',
                    data: $A(this.registData).sort(),
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
                siteId : this.siteId,
                endTime : date,
//                startTime : date - 6*30*86400*1000
                startTime : date - 30*86400*1000
            };
            this.chart = this.element.find(".regist-user-content").highcharts();

            this.service.getNewTerminal(data,function(result){
                self.registData = result;

                var registUserChart = self.chart.get("registUser");
                if(registUserChart){
                    registUserChart.setData(result);
                }else{
                    self.chart.addSeries({
                        id:"registUser",
                        name: locale.get("new_ter"),
                        color: COLOR,
                        type: 'column',
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
            if(data.length>0){
                var startTime = new Date();
                startTime.setMilliseconds(0);
                startTime.setSeconds(0);
                startTime.setMinutes(0);
                startTime.setHours(0);
                var dayStart = startTime.getTime();
                var weekStart = startTime.getTime() - startTime.getDay() * 86400000;
                startTime.setDate(1);
                var monthStart = startTime.getTime();

                var dayArr = [], weekArr = [], monthArr = [];
                data.sort().reverse();
                data.each(function(one,index){
                    var time = one[0];
//                    console.log(index);
                    if(time >= dayStart){
                        dayArr.push(one);
                        weekArr.push(one);
                        monthArr.push(one);
                    }else if(time >= weekStart){
                        weekArr.push(one);
                        monthArr.push(one);
                    }else if(time >= monthStart){
                        monthArr.push(one);
                    }else{
                        throw $break;
                    }
                });
                var dayRegist = this._getSum(dayArr);
                var weekRegist = this._getSum(weekArr);
                var monthRegist = this._getSum(monthArr);

                this.element.find(".registuser-item-week-value").text(weekRegist);
                this.element.find(".registuser-item-today-value").text(dayRegist);
                this.element.find(".registuser-item-month-value").text(monthRegist);
            }

        },

        _getSum:function(arr){
            return arr.reduce(function(pv, cv){
                return pv + cv[1];
            },0)
        },

        renderChart:function(){
            this.element.find(".regist-user-content").highcharts("StockChart",{
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
                    column:{
                        marker:{
                            lineWidth: 2,
                            fillColor: 'white',
                            lineColor:COLOR,
                            enabled: true
                        },
                        lineWidth : 2,
                        dataGrouping:{
                            approximation:"sum",
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
//            this.stoprefresh();

            $super();
        }
    });

    return registUser;
});