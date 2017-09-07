/**
 * Created by zhang on 14-9-16.
 */
/**
 * Created by zhang on 14-8-29.
 */
define(function(require){
    require("cloud/base/cloud");
    var Window = require('cloud/components/window');
    var Service = require("./service");

    var winHeight = 524;
    var winWidth = 1100;
    var COLOR = {
        light:"#578ebe",
        mid:"#8775a7",
        dark:"#be5851"

    }

    var terminalStay = Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);

            this.service = Service;
            this.siteId = options.siteId;
            this._render();
        },

        _render:function(){
            var self = this;
            var width = this.element.width() * 0.25 - 31;
            this.element.addClass("weightContainer");

            var html = "<div class='sta-box-stay sta-box'>" +
                "<div class='sta-box-title'>"+locale.get("terminal_stay_time")+"</div>" +
                "<div class='sta-box-info'>" +
                "<div class='sta-box-marker'>" +
                "<img src='./rainbowStatistics/apStatistics/img/clock.png'>" +
                "</div>" +
                "<div class='sta-box-details'></div>" +
                "</div>" +
                "</div>";
            this.element.html(html);
//            this.element.find(".sta-box-details").width(width-100);

            this.setData();
            this.element.find(".sta-box-stay").width(width).bind("click",function(){

                self._renderAndOpenWin();
            }).hover(function(){
                    $(this).addClass("hover-shadow");
                },function(){
                    $(this).removeClass("hover-shadow");
                });

        },

        setData:function(){

            var self = this;
            var date = new Date().getTime();
            var data = {
                siteId:this.siteId,
                endTime : date,
                startTime : date - 12*30*86400*1000,
                types:'31,32,33'
            };
            this.service.getUserStat(data,function(result){
                if(result.length>0){

                    var container = self.element.find(".sta-box-details");
                    var series1=[],series2=[],series3=[];

                    var maxLength = 0,emptyData = [];
                    result.each(function(one){
                        if(one.type == 31){
                            series1 = one.values;
                        }else if(one.type == 32){
                            series2 = one.values;
                        }else if(one.type == 33){
                            series3 = one.values;
                        }

                        maxLength = Math.max(one.values.length,maxLength);
                        if(maxLength == one.values.length){
                            emptyData = [one.values[maxLength-1][0] , 0];
                        }
                    });

                    self.stayData = [series1,series2,series3];

                    self.stayData.each(function(one){
                        if(one.length < maxLength){
                            one.push(emptyData);
                        }
                    });

                    var value1 = series1.last() ? series1.last()[1] : 0;
                    var value2 = series2.last() ? series2.last()[1] : 0;
                    var value3 = series3.last() ? series3.last()[1] : 0;
                    var valarr = [value1,value2,value3];
                    var hasMax = true;
                    var max = Math.max.apply({},valarr);
                    var sum = value1 + value2 + value3;

                    valarr.each(function(one,index){
                        var el = $("<div><span class='stay-number'>"+Math.round(one/sum*100)+"%"+"</span><span class='stay-hours'></span></div>")
                            .appendTo(container);
                        if(one == max && hasMax){
                            el.find(".stay-number").addClass("stay-max");
                            hasMax = false;
                        };
                        switch (index){
                            case 0:
                                el.find(".stay-hours").text(locale.get("less_than")+"2"+locale.get("_hours"));
                                break;
                            case 1:
                                el.find(".stay-hours").text("2 ~ 5"+locale.get("_hours"));
                                break;
                            case 2:
                                el.find(".stay-hours").text(locale.get("more_than")+"5"+locale.get("_hours"));
                                break;
                        }
                    });

//                    self._renderAndOpenWin();
                }
            });
        },

        _renderAndOpenWin : function(){
            var self = this;
            if(!this.window){
                this.window =  new Window({
                    container : "body",
                    title : locale.get("terminal_stay_time"),
                    top: "center",
                    left: "center",
                    height: winHeight,
                    width: winWidth,
                    mask: true,
                    blurClose:true,
//                    content : self.options.winContent,
                    events : {
                        "onClose": function() {
                            self.window = null;
                        },
//                        "afterShow": function(){
//                            this.fire("onWinShow");
//                        },
//                        "afterCreated":function(){
//                            this.fire("onAfterCreated")
//                        },

                        scope : this
                    }
                })
            }
            this.window.show();

            this.setWindowContent();

        },

        setWindowContent:function(){
            this.winChartContainer =$("<div class='total-User-container'></div>")
                .height(winHeight-50).width(winWidth-20);

            this.window.setContents(this.winChartContainer);

            this.winChartContainer.highcharts({
                chart: {
                    type:'column'
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
                    xDateFormat: '%Y-%m'
                },
                series: [{
                    name: "2"+locale.get("_hours"),//'2小时',
                    color: COLOR.light,
                    type: 'column',
                    data: this.stayData && this.stayData[0],
                    tooltip: {
                        valueSuffix: locale.get("ren")//'人'
                    }

                },{
                    name: "5"+locale.get("_hours"),//'5小时',
                    color: COLOR.mid,
                    type: 'column',
                    data: this.stayData && this.stayData[1],
                    tooltip: {
                        valueSuffix: locale.get("ren")//'人'
                    }
                },{
                    name: ">5"+locale.get("_hours"),//'5小时以上',
                    color: COLOR.dark,
                    type: 'column',
                    data: this.stayData && this.stayData[2],
                    tooltip: {
                        valueSuffix: locale.get("ren")//'人'
                    }
                }]
            });
        },


        destroy:function($super){
            $super();
        }

    });

    return terminalStay;
});