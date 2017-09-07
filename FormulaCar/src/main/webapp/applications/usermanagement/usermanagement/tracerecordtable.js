/**
 * Created by zhouyunkui on 14-6-11.
 */
define(function(require){
    var cloud=require("cloud/base/cloud");
    var Table=require("cloud/components/table");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Paging = require("cloud/components/paging");
    var Button=require("cloud/components/button");
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
    var cols=[{
        "title":"时间",
        "lang":"{text:time}",
        "dataIndex":"timestamp",
        "width":"18%",
        render:function(value,type){
            if(type=="display"){
                return dateFormat(new Date(value),"yyyy-MM-dd hh:mm:ss");
            }else{
                return value;
            }
        }
    },{
        "title":"源IP",
        "lang":"{text:source_ip}",
        "dataIndex":"sIp",
        "width":"12%"
    },{
        "title":"源端口",
        "lang":"{text:source_port}",
        "dataIndex":"sPort",
        "width":"10%"
    },{
        "title":"目标IP",
        "lang":"{text:desination_ip}",
        "dataIndex":"dIp",
        "width":"15%"
    },{
        "title":"目标端口",
        "lang":"{text:desination_port}",
        "dataIndex":"dPort",
        "width":"10%"
    },{
        "title":"协议",
        "lang":"{text:protocol}",
        "dataIndex":"proto",
        "width":"10%"
    },{
        "title":"Nat源IP",
        "lang":"{text:nat_source_ip}",
        "dataIndex":"natSourceIp",
        "width":"15%"
    },{
        "title":"Nat源端口",
        "lang":"{text:nat_source_port}",
        "dataIndex":"natSourcePort",
        "width":"10%"
    }];
    var TraceRecordTable=Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            this.selector=options.selector;
//            this.data=options.data;
            this.name=options.name;
            this.elements={
                bar:{
                    "id":"trace_record_toolbar"
                },
                table:{
                    "id":"trace_record_content"
                },
                paging:{
                    "id":"trace_record_paging"
                }
            };
            this.pageDisplay=30;
            this.cursor=0;
           this.renderLayout();
           this.renderTable();
           this.renderToolbar();
            locale.render();
//            this.renderPaging();
        },
        renderLayout:function(){
            this.layoutContent=$(this.selector).layout({
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
                    paneSelector:"#"+this.elements.bar.id,
                    size:38
                },
                center : {
                    paneSelector : "#"+this.elements.table.id
                },
                south : {
                    paneSelector : "#"+this.elements.paging.id,
                    initClosed : false,
                    size : 38
                }
            });
        },
        renderToolbar:function(){
            var self=this;
            if(self.$wrapDiv){
                self.$wrapDiv.remove();
                self.$wrapDiv=null;
                self.backBtn=null;
            }
            self.$wrapDiv=$("<div>" +
//                "&nbsp;<label lang='text:account1+:'></label>" +
//                "<span id='trace_account'></span>" +
//                "&nbsp;<label lang='text:mac+:'></label><span id='trace_board_mac'></span>" +
                "&nbsp;<label lang='text:time+:'></label>" +
                "&nbsp;<label></label><span id='trace_start_time'></span>" +
                "&nbsp;<span lang='text:to'></span>&nbsp;" +
                "&nbsp;<label></label><span id='trace_end_time'></span>" +
                "<span id='fall_back_btn'></span>" +
                "</div>").appendTo("#"+this.elements.bar.id).css({
                    "height":"35px",
                    "font-size":"14px",
                    "font-weight":"bold",
                    "position":"relative"
                });
            locale.render({element:self.$wrapDiv});
            self.$wrapDiv.find("#fall_back_btn").css({
                "position":"relative",
//                "left":"890px",
                "top":"8px",
                "float":'right',
                "margin-right":"10px"
            });
//            self.$wrapDiv.find("#trace_account").text(self.name).css({
//                "line-height":"35px"
//            });
//            self.$wrapDiv.find("#trace_board_mac").text(self.data.mac);
            self.backBtn=new Button({
                "container":"#fall_back_btn",
                "title":locale.get("fall_back"),
                "text":locale.get("fall_back"),
                "events":{
                    click:function(){
                        self.fire("closeTraceBord");
                        self.cursor=0;
//                        self.$wrapDiv.remove();
//                        self.backBtn=null;
                        $("#winContent #startTime").datetimepicker({
                            format:'Y/m/d H:i',
                            step:1,
                            startDate:'-1970/01/08',
                            lang:locale.current() === 1 ? "en" : "ch"
                        });
                        $("#winContent #endTime").datetimepicker({
                            format:'Y/m/d H:i',
                            step:1,
                            lang:locale.current() === 1 ? "en" : "ch"
                        });
                        self.table.clearTableData();
                    },
                    scope:this
                }
            });
        },
        renderTable:function(){
            var self=this;
            self.table=new Table({
                selector:"#"+this.elements.table.id,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox : "none",
                columns:cols
            });
//            self.setDataToTable();
        },
        requestTraceRecord:function(options,callback,context){
            cloud.util.mask("#winInfo");
            cloud.Ajax.request({
                url:"api/wifi/log",
                type:"GET",
                parameters:options,
                success:function(data){
                    if(!data.total){
                        data={
                            cursor:self.cursor,
                            limit:self.pageDisplay,
                            total:0,
                            result:[]
                        }
                    }
                    callback.call(context||this,data);
                    cloud.util.unmask("#winInfo");
                },
                error:function(data){
                    cloud.util.unmask("#winInfo");
                }
            });
        },
        renderPaging:function(data){
            var self = this;
            $("#"+self.elements.paging.id).empty();
            this.paging = null;
            var divHtml=$("<div><span id='button_page_up'></span><span id='button_page_down'></span></div>");
            divHtml.appendTo($("#"+self.elements.paging.id)).css({
                "text-align":"center"
            });
            self.pageUp=new Button({
                container:$("#"+self.elements.paging.id).find("#button_page_up"),
                text:locale.get("previous_page"),
                events:{
                    click:function(){
                        self.opt.cursor=--self.cursor;
                        self.requestTraceRecord(self.opt,function(returnData){
//                            self.renderPaging(returnData);
                            self.table.render(returnData.result);
                            self.pageDown.enable();
                            if(self.cursor==0){
                                self.pageUp.disable();
                            }
                        },this);
                    },
                    scope:this
                }
            });
            self.pageDown=new Button({
                container:$("#"+self.elements.paging.id).find("#button_page_down"),
                text:locale.get("next_page"),
                events:{
                    click:function(){
                        self.opt.cursor=++self.cursor;
                        self.requestTraceRecord(self.opt,function(returnData){
//                            self.renderPaging(returnData);
                            self.table.render(returnData.result);
                            if(returnData.result.length==0){
                                self.pageDown.disable();
                            }
                            self.pageUp.enable();
                        },this)
                    },
                    scope:this
                }
            });
            self.pageUp.disable();
            if(data.result.length==0){
                self.pageDown.disable();
            }
            self.table.render(data.result);
        },
        render:function(data){
            var self=this;
            self.data=data;
            self.setDataToTable();
            self.$wrapDiv.find("#trace_start_time").text(dateFormat(new Date(self.data.startTime),"yyyy-MM-dd hh:mm:ss"));
            self.$wrapDiv.find("#trace_end_time").text(dateFormat(new Date(self.data.endTime),"yyyy-MM-dd hh:mm:ss")).css({
                "line-height":"35px"
            });
        },
        setDataToTable:function(){
            var self=this;
            var mac=self.data.mac;
            self.opt={
                cursor:self.cursor,
                device_id:self.data.deviceId,
                start_time:self.data.startTime,
                end_time:self.data.endTime,
                mac:mac
            };
//            var data={
//                    total:1,
//                    cursor:0,
//                    limit:30,
//                    result:[{
//                        "timestamp":"1404201635000",
//                        "url":"www.baidu.com"
//                    }]
//                };
//            self.renderPaging(data);
            self.requestTraceRecord(self.opt,function(returnData){
                self.renderPaging(returnData);
            },this)
        },
        destroy:function(){
            $("#"+this.elements.bar.id).empty();
            $("#"+this.elements.table.id).empty();
            $("#"+this.elements.paging.id).empty();
        }
    });
    return TraceRecordTable;
})