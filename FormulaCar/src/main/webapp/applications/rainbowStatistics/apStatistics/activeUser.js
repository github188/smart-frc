/**
 * Created by zhang on 14-9-16.
 */
define(function(require){
    require("cloud/base/cloud");
    var Window = require('cloud/components/window');
    var Service = require("./service");

    var winHeight = 524;
    var winWidth = 1100;

    var COLOR = Highcharts.getOptions().colors[4];;


    var activeUser = Class.create(cloud.Component,{
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

            var html = "<div class='sta-box-active-user sta-box'>" +
                "<div class='sta-box-title'>"+locale.get("active_user_stat")+"</div>" +
                "<div class='sta-box-info'>" +
                "<div class='sta-box-marker'>" +
                "<img src='./rainbowStatistics/apStatistics/img/active_user.png'>" +
                "</div>" +
                "<div class='sta-box-details'></div>" +
//                "<img src='./rainbowStatistics/apStatistics/img/user.png'>" +
//                "<span>654123</span>"
                "</div>" +
                "</div>";
            this.element.html(html);
//            this.element.find(".sta-box-details").width(width-100);
            this.setData();
            this.element.find(".sta-box-active-user").width(width).bind("click",function(){
                self._renderAndOpenWin();
//                self.setData();
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
                siteId : this.siteId,
                endTime : date,
                startTime : date - 6*30*86400*1000
            };
            this.service.getActiveUser(data,function(result){
//                result = activeData;
                self.activeData = result;
                if(result.length > 0){
                    var active = result.last().last();
                    var container = self.element.find(".sta-box-details");
                    $("<div class='sta-box-main'>"+active+"</div>").appendTo(container);
                    var rate = self.procData(result);
                    if(rate){
                        $("<div class='sta-box-description'>"+locale.get("user_active_rate")+"<span>"+rate+"</span>"+"<img class='question-btn' src='./rainbowStatistics/apStatistics/img/question.png'></div>").appendTo(container);
                        self._renderQtip(self.element.find(".question-btn"));
                        if(locale.current() !=2){//没有国际化 临时方案
                            container.find(".question-btn").hide();
                        }
                    }else{

                    }
//                    self._renderAndOpenWin();
                }
            });
        },

        _renderQtip:function($el){
            var  html= "<p><span class='hight-light'>活跃用户:</span>启动过应用的用户（去重），本周启动过一次的用户即视为活跃用户，包括新用户与老用户。</p>" +
                "<p><span class='hight-light'>活跃率:</span>本周活跃用户数 / 近4周活跃用户数。</p>";
            var tipContent = $("<div class='tip-content'>"+html+"</div>");
            $el.qtip({
                content: tipContent,
                position: {
                    my: "left center",
                    at: "right center"
                },
                style: {
                    classes: "qtip-shadow qtip-dark qtip-opacity"
                },
                suppress:false
            });
            $el.hover(function(){
                $(this).css("opacity",1)
            },function(){
                $(this).css("opacity",0.5)
            })

        },

        procData:function(data){
            var start = data.length - 4 > 0 ? data.length - 4 : 0;
            var arr = data.slice(start,data.length);
            if(arr.length > 1){
                var total = arr.reduce(function(pv, cv){return (pv[1] || pv) + cv[1];});
            }else if(arr.length == 1){
//                var total = arr[0][1];
                return false;
            }


            return ((data.last()[1]/total)*100).toFixed(0) + "%"
        },

        _renderAndOpenWin : function(){
            var self = this;
            if(!this.window){
                this.window =  new Window({
                    container : "body",
                    title : locale.get("active_user_stat"),
                    top: "center",
                    left: "center",
                    height: winHeight,
                    width: winWidth,
                    mask: true,
                    blurClose:true,
//                    content : self.options.winContent,
                    events : {
                        "onClose": function() {
                            this.window = null;
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
            this.winChartContainer =$("<div class='active-user-container'></div>")
                .height(winHeight-50).width(winWidth-20);

            this.window.setContents(this.winChartContainer);

            this.winChartContainer.highcharts("StockChart",{
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
                    column:{
                        marker:{
                            lineWidth: 2,
                            fillColor: 'white',
                            lineColor:COLOR,
                            enabled: true
                        },
                        lineWidth : 2,
                        dataGrouping:{
//                            approximation:"sum",
//                            groupPixelWidth:10,
                            forced:true,
                            units: [
                                ["day",[7]]
//                                ['week',[1]],
//                                ["month",[1]]
                            ]

                        }
                    }
                },
                xAxis:{
                    type : "datetime"

                },
                yAxis: {
                    title: {
                        text: locale.get("active_user"),//"",
                        style: {
                            color: COLOR
                        }
                    },
                    min:0,
                    labels: {
                        style: {
                            color: COLOR
                        }
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
//                    shared: true
//                    xDateFormat: '%Y-%m-%d'
                },
                series: [{
                    name: locale.get("active_user"),//'',
                    color: COLOR,
                    type: 'column',
                    data: this.activeData,
                    tooltip: {
                        valueSuffix: locale.get("ren")//'人'
                    }
                }]
            })
        },


        destroy:function($super){
            $super();
        }

    });

    return activeUser;
});