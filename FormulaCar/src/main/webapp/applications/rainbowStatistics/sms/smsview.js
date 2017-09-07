/**
 * Created by zhouyunkui on 14-6-13.
 */
define(function(require){
    var cloud=require("cloud/base/cloud");
    var Button=require("cloud/components/button");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/lib/plugin/highcharts");
    var SmsView=Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            this.render();
        },
        render:function(){
            this._renderDatePick();
            this._requestData();
//            this._renderHighchart();
//            this._renderDateTimePicker();
        },
        _requestData:function(){
            var self=this;
            var start_time=this.$datePickHtml.find("#sms_start_time").val();
            var end_time=this.$datePickHtml.find("#sms_end_time").val();
            self.opt={
                start_time:(new Date(start_time)).getTime(),
                end_time:(new Date(end_time)).getTime()
            };
            cloud.Ajax.request({
                url:"api/sms_code",
                type:"POST",
                parameters:self.opt,
                success:function(data){
                    //测试
//                    data={
//                        "total":1000,
//                        "unUsed": 200,
//                        "used":200,
//                        "expired":600
//                    }
                    self.data=data.result;
                    self._renderHighchart();
                },
                error:function(data){
//                    //测试
                    data.result={
                        "total":1000,
                        "unUsed": 200,
                        "used":200,
                        "expired":600
                    }
                    self.data=data.result;
                    self._renderHighchart();
                }
            })
        },
        _renderHighchart:function(){
            var self=this;
            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                exporting: {
                    buttons: {
                        contextButton: {
                            menuItems: [{
                                textKey: 'downloadPNG',
                                onclick: function () {
                                    this.exportChart();
                                }
                            }, {
                                textKey: 'downloadJPEG',
                                onclick: function () {
                                    this.exportChart({
                                        type: 'image/jpeg'
                                    });
                                }
                            }]
                        }
                    }
                }
            });
                this.htmlElement.find("#highchart-container").css({
                "height":"600px",
                "width":"100%"
            }).highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        text: locale.get("smsstatistics")+"("+locale.get("total")+":"+self.data.total+")"
                    },
                    credits:{
                        enabled:false
                    },
                    tooltip: {
                        pointFormat: '：{point.y}'+locale.get("nooldle")
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                color: '#000000',
                                connectorColor: '#000000',
                                formatter: function() {
                                    return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(2) +' %';
                                }
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: locale.get("sms_code_use"),
                        data: [
                            [locale.get("already_success"),   self.data.used],
                            [locale.get("already_failed"),   self.data.expired],
                            [locale.get("already_effective"),   self.data.unUsed]
                        ]
                    }]
                });
        },
        _renderDatePick:function(){
            var self=this;
            this.htmlElement=$("<div><div id='toolbar-for-date'></div><div id='highchart-container'></div></div>");
            this.htmlElement.appendTo(this.element).find("#toolbar-for-date").css({
                "width":"100%",
                "height":"35px",
                "background":"rgb(255,255,255)"
            });
            this.$datePickHtml=$("<div>" +
                "&nbsp;&nbsp;&nbsp;<input type='text' id='sms_start_time' />&nbsp;&nbsp;&nbsp;<span id='span_time_to' lang='text:to'></span>" +
                "&nbsp;&nbsp;&nbsp;<input type='text' id='sms_end_time' />" +
                "&nbsp;&nbsp;&nbsp;<span id='sms_code_query_button'></span>" +
                "</div>");
            locale.render({element:this.$datePickHtml});
            this.$datePickHtml.find("#sms_start_time").val(cloud.util.dateFormat(new Date(((new Date()).getTime() - 1000 * 60 * 60 * 24 * 7)/1000),"yyyy/MM/dd") + " 00:00").datetimepicker({
                format:'Y/m/d H:i',
                step:1,
                startDate:'-1970/01/08',
                lang:locale.current() === 1 ? "en" : "ch"
            });
            this.$datePickHtml.find("#sms_end_time").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 23:59").datetimepicker({
                format:'Y/m/d H:i',
                step:1,
                lang:locale.current() === 1 ? "en" : "ch"
            });
            this.$datePickHtml.find("#span_time_to").css({
                "line-height":"35px"
            });
            new Button({
                "container":self.$datePickHtml.find("#sms_code_query_button"),
                "text":locale.get("query"),
                "events":{
                    click:function(){
                        var start_time=this.$datePickHtml.find("#sms_start_time").val();
                        var end_time=this.$datePickHtml.find("#sms_end_time").val();
                        self.opt.start_time=(new Date(start_time)).getTime();
                        self.opt.end_time=(new Date(end_time)).getTime();
                        if(self.opt.start_time>self.opt.end_time){
                            dialog.render({lang:"start_date_cannot_be_greater_than_end_date"})
                        }else{
                            self._requestData();
                        }

                    },
                    scope:this
                }
            });
            this.$datePickHtml.find("#sms_code_query_button").css({
                "position":"relative",
                "top":"-2px"
            })
//            this.$datePickHtml.appendTo("#toolbar-for-date");
        }
    });
    return SmsView;
})