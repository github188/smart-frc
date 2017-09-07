/**
 * Created by zhouyunkui on 14-6-11.
 */
define(function(require){
    var cloud=require("cloud/base/cloud");
    var Table=require("cloud/components/table");
    var Button=require("cloud/components/button");
    var _Window=require("cloud/components/window");
    var service=require("./serviceforloginhistory");
    var Paging = require("cloud/components/paging");
    var TraceRecord=require("./tracerecordtable");
    var layout = require("cloud/lib/plugin/jquery.layout");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/lib/plugin/jquery.datetimepicker");
    var unitConversion = function(opt,type){
        if(type === "display"){
            if ( typeof opt === "number"){
                if(opt<1000){
                    return opt.toFixed(0)+"B";
                }else if(opt<1000000){
                    return (opt/1024).toFixed(3)+"KB";
                }else{
                    return (opt/1024/1024).toFixed(3)+"MB";
                }
            }else{
                return opt;
            }
        }else{
            return opt;
        }
    };
    var dateFormat=function(date,format){
        // temporary convert date. exclude it after api fixed the issue.
        date = new Date(date.getTime());
        var o = {
            "M+" : date.getMonth() + 1,
            "d+" : date.getDate(),
            "h+" : date.getHours(),
            "m+" : date.getMinutes(),
            "s+" : date.getSeconds(),
            "q+" : Math.floor((date.getMonth() + 3) / 3),
            "S" : date.getMilliseconds()
        };
        if (/(y+)/.test(format)){
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for ( var k in o){
            if (new RegExp("(" + k + ")").test(format)){
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };
    var timeConvert=function(time){
        var str="";
        var totalTime=parseInt(time/1000);
        if(totalTime==0){
            return 0;
        }else{
            var seconds=totalTime%60;
            totalTime=parseInt(totalTime/60);
            if(totalTime==0){
                return str=seconds+locale.get("_seconds")+str;
            }else{
                if(seconds==0){
                }
                else{
                    str=seconds+locale.get("_seconds")+str;
                }
                var minutes=totalTime%60;
                totalTime=parseInt(totalTime/60);
                if(totalTime==0){
                    return str=minutes+locale.get("minutes")+str;
                }else{
                    if(minutes==0){
                    }else{
                        str=minutes+locale.get("minutes")+str;
                    }
                    var hours=totalTime%24;
                    totalTime=parseInt(totalTime/24);
                    if(totalTime==0){
                        return str=hours+locale.get("_hours")+str;
                    }else{
                        if(hours==0){
                            return str=totalTime+"d"+str;
                        }else{
                            return str=totalTime+locale.get("_days")+hours+locale.get("_hours")+str;
                        }
                    }
                }
            }
        }

        var minutes=totalTime%60;
        totalTime=parseInt(totalTime/60);
        var hours=totalTime%24;
        totalTime=parseInt(totalTime/24);

    }
    var columns=[ {
        "title":"MAC",
        "lang":"{text:mac_address}",
        "dataIndex":"mac",
        "width":"20%"
    },{
        "title": "登录时间",
        "lang":"{text:logintime}",
        "dataIndex": "startTime",
        "cls": null,
        "width": "20%",
        render: function (value, type) {
            if(type === "display"){
                return dateFormat(new Date(value),"yyyy-MM-dd hh:mm:ss");
            }else{
                return value;
            }
        }
    },
        {
            "title": "离开时间",
            "lang":"{text:logout_time}",
            "dataIndex": "endTime",
            "cls": null,
            "width": "20%",
            render: function (value, type) {
                if(type === "display"){
                    return dateFormat(new Date(value),"yyyy-MM-dd hh:mm:ss");
                }else{
                    return value;
                }
            }
        },
        {
            "title": "上网时长",
            "lang":"{text:online_time}",
            "dataIndex": "time",
            "cls": null,
            "width": "10%",
            render: function (value, type) {
                if(type === "display"){
                    return timeConvert(value);
                }else{
                    return value;
                }
            }
        },
        {
            "title":"下载流量",
            "lang":"{text:rx_flow}",
            "dataIndex":"rx",
            "width":"10%",
            render:unitConversion
        },{
            "title":"上传流量",
            "lang":"{text:tx_flow}",
            "dataIndex":"tx",
            "width":"10%",
            render:unitConversion
        },{
            "title":"访问记录",
            "lang":"{text:visitor_records}",
            "dataIndex":"",
            "width":"10%",
            render:function(data,type,row){
                var display="";
                display="<span class='trace_record_private cloud-button-body cloud-button' style='cursor: pointer;font-size: 12px;font-family:Helvetica Neue,Helvetica,Hiragino Sans GB,Segoe UI,Microsoft Yahei,Tahoma,Arial,STHeiti,sans-serif'>"+locale.get("view")+"</span>";
                return display;
            }
        }];
    var LoginHistoryWindow=Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            this.data=options.data;
            this.service = service;
//            this.display = null;
            this.pageDisplay = 30;
            this.cursor=0;
            this._render();
            this._renderTraceRecord();
            locale.render();
            $(".trace_record_private").live({
                "mouseover":function(evt){
                $(this).css({
                    "color":"#4cae29",
                    "text-decoration":"underline"
                })
            },
                "mouseout":function(evt){
                    $(this).css({
                        "color":"#5e5e60",
                        "text-decoration":"none"
                    })
                },
                "mousedown":function(evt){
                    $(this).css({
                        "border": "1px solid #DBDCE0",
                        "border-left": "1px solid #9B9FA2",
                        "border-top": "1px solid #9B9FA2",
                        "-webkit-box-shadow": "inset 1px 1px 1px #C8CCCF",
                        "-moz-box-shadow": "inset 1px 1px 1px #C8CCCF",
                        "box-shadow": "inset 1px 1px 1px #C8CCCF",
                        "background": "#dfe2e7",
                        "background": "-moz-linear-gradient(top,  #dfe2e7 0%, #dfe3e9 13%, #e6e8e7 44%, #ebf3f3 100%)",
                        "background": "-webkit-gradient(linear, left top, left bottom, color-stop(0%,#dfe2e7), color-stop(13%,#dfe3e9), color-stop(44%,#e6e8e7), color-stop(100%,#ebf3f3))",
                        "background": "-webkit-linear-gradient(top,  #dfe2e7 0%,#dfe3e9 13%,#e6e8e7 44%,#ebf3f3 100%)",
                        "background": "-o-linear-gradient(top,  #dfe2e7 0%,#dfe3e9 13%,#e6e8e7 44%,#ebf3f3 100%)",
                        "background": "-ms-linear-gradient(top,  #dfe2e7 0%,#dfe3e9 13%,#e6e8e7 44%,#ebf3f3 100%)",
                        "background": "linear-gradient(to bottom,  #dfe2e7 0%,#dfe3e9 13%,#e6e8e7 44%,#ebf3f3 100%)",
                        "filter": "progid:DXImageTransform.Microsoft.gradient( startColorstr='#dfe2e7', endColorstr='#ebf3f3',GradientType=0 )"
                })
                },
                "mouseup":function(evt){
                    $(this).css({
//                        "border":"0px",
                        "box-shadow": "1px 1px 2px #B0B1B5",
                        "border-top": "1px solid #DDE1E4",
                        "border-left": "1px solid #DDE1E4",
                        "border-bottom": "1px solid #D7DBDE",
                        "border-right": "1px solid #D7DBDE",
                        "background": "linear-gradient(to bottom, #f2f6f9 0%,#f5f6fa 8%,#e3e4e9 80%,#e1e2e7 92%,#e3e4e8 100%)"
                    })
                }
            });
        },
        _render:function(){
            this._renderWindow();
        },
        _renderWindow:function(){
            var self=this;
            var data=this.data;
            this.window=new _Window({
                container: "body",
//				title: data.name+" "+locale.get({lang:"detailed_monthly_report"}),
                title: locale.get({lang:"visitor_login_detail"}),
                top: "center",
                left: "center",
                height: 560,
                width: 1002,
                mask: true,
                drag:true,
                content: "<div id='login_history'><div id='tagOverview'></div><div id='winContent'></div><div id='winInfo'></div></div>",
                events: {
                    "onClose": function() {
                        self.window.destroy();
                        cloud.util.unmask(this.element);
                    },
                    scope: this
                }
            });
            this.window.show();
//            $(".ui-window-title-name").css({
//                "left":"430px"
//            });
            this._renderLayout();
            this.drawHTML();
            this._renderTableLayout();
            this._renderTable();
//            this._renderTraceRecord();
//            service.getDayFlows(data,this.table.render,this.table);
        },
        drawHTML:function(){
            var html1="<div id='content-toolbar'></div><div id='content-table'></div><div id='content-paging'></div>";
            $("#winContent").append($(html1));
            var html2=("<div id='trace_record_toolbar'></div><div id='trace_record_content'></div><div id='trace_record_paging'></div>");
            $("#winInfo").append($(html2));
        },
        _renderLayout:function(){
            var self = this;
                self.layoutContent = $("#login_history").layout({
                    defaults : {
                        paneClass: "pane",
                        togglerClass: "cloud-layout-toggler",
                        resizerClass: "cloud-layout-resizer",
                        "spacing_open": 1,
                        "spacing_closed": 1,
                        "togglerLength_closed": 50,
                        togglerTip_open:locale.get({lang:"close"}),
                        togglerTip_closed:locale.get({lang:"open"}),
                        resizable: false,
                        slidable: false
                    },
//                    west:{
//                        paneSelector:"#tagOverview",
//                        size:0
////                        initClosed:true
//                    },
                    center : {
                        paneSelector : "#winContent"
                    },
                    east : {
                        paneSelector : "#winInfo",
                        initClosed : true,
                        size : 1000
                    }
                });
//            $("#info-table-toggler").css("display","none");
//           $("#login_history").find("#tagOverview-toggler").css("display","none");
        },
        _renderTableLayout:function(){
            var self=this;
            self.layoutTable=$("#winContent").layout({
                defaults : {
                    paneClass: "pane",
                    "togglerLength_open": 50,
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    "spacing_open": 0,
                    "spacing_closed": 1,
                    "togglerLength_closed": 50,
                    resizable: false,
                    slidable: false,
                    closable: false
                },
                north:{
                    paneSelector:"#content-toolbar",
                    size:38
                },
                center : {
                    paneSelector : "#content-table"
                },
                south : {
                    paneSelector : "#content-paging",
                    initClosed : false,
                    size : 38
                }
            });
        },
        _renderTable:function(){
            var self=this;
            self.table=new Table({
                selector: $("#winContent").find("#content-table"),
                columns: columns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox:"none",
                events:{
                    onRowClick:function(data,context,event){
//                        data={
//                            "name":"test",
//                            "mac":"11-22-33-44-55-66"
//                        };
//                        if(data){
                            if(event.target.className.indexOf("trace_record_private")!=-1){
//                                $(event.target).toggleClass("cloud-button-active");
                                $("#winContent #startTime").datetimepicker("destroy");
                                $("#winContent #endTime").datetimepicker("destroy");
//                                self._renderTraceRecord(data);
                                self.traceRecord.render(data);
                                self.window.setTitle(locale.get("tracerecords")+"("+locale.get("account1")+":"+self.data.accountName+" "+locale.get("mac_addr")+":"+data.mac.replace(/:/g,"-")+")");
                                self.layoutContent.open("east");
                            }
//                        }
//                        $("#login_history").find("#tagOverview-toggler").css("display","none");
                    }
                }
            });
            self.layoutContent.hide("east");
            this._renderToolbar();
//            this._renderPagingBar();
            this._setTableAppearance();
            this.setTableData();
        },
        _renderTraceRecord:function(){
            var self=this;
            if(self.traceRecord){
                self.traceRecord.destroy();
                 self.traceRecord=null;
            }
            self.traceRecord=new TraceRecord({
                selector:"#winInfo",
//                data:data,
                name:self.data.accountName,
                events:{
                    "closeTraceBord":function(){
                        self.layoutContent.hide("east");
                        self.window.setTitle(locale.get({lang:"visitor_login_detail"}));
                    }
                }
            });
        },
        _setTableAppearance:function(){
            $("#ui-window-body").css({
                "overflow":"hidden",
                "position":"relative"
            });
            $("#ui-window-content").css({
                "overflow-y":"hidden"
            });
            $("#login_history").css({
                "height":"530px"
            });
//            $("#winContent").css({
//                "height":"430px"
//            })
        },
        _renderToolbar:function(){
            var self=this;
            var titleEle=$("<div><label class='auto_define' lang='text:account1+:'></label>" +
                "<input type='text' style='width: 120px' id='account' disabled/>&nbsp;<label lang='text:current_month_traffic+:'></label><span id='current_month_traffic'></span>" +
                "</div>").css({
                    "font-weight":"bold",
                    "font-size":"14px",
                    "margin-left":"10px"
//                    "float":"left"
                });
            if(locale.current()==1){
                titleEle.find("label").css({
//                    "line-height":"38px",
                    "display":"inline-block",
                    "width":"105px",
                    "text-align":"right"
                }).end().find("span").css({
                        "line-height":"38px",
                        "display":"inline-block",
                        "width":'120px'
                    });
                titleEle.find(".auto_define").css({
                    "width":"67px"
                })
            }else if(locale.current()==2){
                titleEle.find("label").css({
//                    "line-height":"38px",
                    "display":"inline-block",
                    "width":"70px",
                    "text-align":"right"
                }).end().find("span").css({
                        "line-height":"38px",
                        "display":"inline-block",
                        "width":'120px'
                    });
                titleEle.find(".auto_define").css({
                    "width":"39px"
                })
            }
            if(self.data.accountName){
                var position=self.data.accountName.indexOf("(");
                var name=self.data.accountName;
            }else{
                var name=self.data.name
            }
//            if(position!=-1){
//                name=self.data.accountName.slice(0,position);
//            }
            titleEle.find("input#account").val(name);
            $("<input class='define_margin_left' id='startTime' type='text' style='margin-right: 10px' /><span lang='text:to' style='margin-right: 10px'></span><input id='endTime' type='text' />").css({
//                "float":"right",
//                "line-height":"38px",
//                "margin-right":"30px"
                "font-weight":"normal",
                "font-size":"12px"
            }).appendTo(titleEle);
            if(locale.current()==1){
                titleEle.find(".define_margin_left").css({
                    "margin-left":"160px"
                })
            }else if(locale.current()==2){
                titleEle.find(".define_margin_left").css({
                    "margin-left":"230px"
                })
            }
            titleEle.find("#startTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime() - 1000 * 60 * 60 * 24 * 7)/1000),"yyyy/MM/dd") + " 00:00").datetimepicker({
                format:'Y/m/d H:i',
                step:1,
                startDate:'-1970/01/08',
                lang:locale.current() === 1 ? "en" : "ch"
            });
            titleEle.find("#endTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 23:59").datetimepicker({
                format:'Y/m/d H:i',
                step:1,
                lang:locale.current() === 1 ? "en" : "ch"
            });
            $("<span id='span_for_query_btn'></span>").appendTo(titleEle).css({
//                "float":"right",
//                "position":"relative",
//                "margin-right":"100px"
                  "vertical-align":"2px",
                "margin-left":"17px",
                "font-weight":"normal",
                "font-size":"12px"
//                "line-height":"38px"
            });
            new Button({
                text:locale.get("query"),
                container:titleEle.find("#span_for_query_btn"),
                events:{
                    click:function(){
                        var start_time=$("#startTime").val();
                        start_time=(new Date(start_time).getTime());
                        var end_time=$("#endTime").val();
                        end_time=(new Date(end_time).getTime());
                        if(start_time>end_time){
                            dialog.render({lang:"start_date_cannot_be_greater_than_end_date"})
                        }else{
                            self.opt.start_time=start_time;
                            self.opt.end_time=end_time;
                            self.service.getUserLoginDetail(self.opt,function(data){
                                if(data.result.length!=0){
                                    data.result=data.result.each(function(one){
                                        one.time=one.endTime-one.startTime
                                    })
                                }
                                self._renderPagin(data);
                            },self);
                        }
                    },
                    scope:this
                }
            })
            titleEle.appendTo($("#content-toolbar").css({
                    "background-color":"rgb(255,255,255)"
                })).css({
                    "height":"30px"
                });
            locale.render({element:$("#content-toolbar")});
        },
        _renderPagin:function(data){
            var self = this;
            this.paging = null;
            this.paging = new Paging({
                selector:"#content-paging",
                data:data,
                current:1,
                total:data.total,
                limit:this.pageDisplay,
                requestData:function(options,success){
                    self.service.getUserLoginDetail(self.opt, function(returnData){
                        if(returnData.result.length!=0){
                            returnData.result=returnData.result.each(function(one){
                                one.time=one.endTime-one.startTime
                            })
                        }
                        success(returnData);
                    }, self);
                },
                turn:function(returnData,nowpage){
                    self.layoutContent.hide("east");
                    var obj = returnData.result;
                    obj.total = returnData.total;
                    self.cursor=parseInt(nowpage-1);
                    self.table.clearTableData();
                    self.table.render(obj);
                },
                events : {
                    "displayChanged" : function(display){
//        			        console.log("displayChanged:", display)
                        self.pageDisplay = parseInt(display);
                    }
                }
            })
        },
        setTableData:function(){
            var self=this;
            var date = new Date();
            var today = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()
            var end = parseInt(date.getTime());
            var start =parseInt(new Date(today).getTime() - 86400*1000*7);
            this.opt = {
//                arr: [0, 1, 2, 3],
//                        net: [0, 1],
                id:this.data._id,
                start_time: start,
                end_time: end,
                cursor:this.cursor,
                limit:this.pageDisplay
            };
            this.service.getUserLoginDetail(this.opt,function(data){
                if(data.result.length!=0){
                    data.result=data.result.each(function(one){
                        one.time=one.endTime-one.startTime
                    })
                }
                self._renderPagin(data);
            }, self);
            var ids=[];
            ids.push(self.data._id);
            var dataObj={};
            dataObj.userIds=ids;
            this.service.getCurrentTraffic(dataObj,function(data){
                if(data.result.length!=0){
                    var flow=0;
                    data.result.each(function(one){
                        if(one.rx&&one.tx){
                            flow=flow+one.rx+one.tx;
                        }else{
                            flow=flow+0;
                        }
                    });
                    if(typeof flow=="number"){
                        $("#current_month_traffic").text(unitConversion(flow,"display"));
                    }
                }else{
                    $("#current_month_traffic").text(unitConversion(0,"display"));
                }

            },self);
        }
    });
    return LoginHistoryWindow;
})