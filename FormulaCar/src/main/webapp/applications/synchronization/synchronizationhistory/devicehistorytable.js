/**
 * Created by zhouyunkui on 14-6-15.
 */
define(function(require){
    var cloud=require("cloud/base/cloud");
    var Table=require("cloud/components/table");
    var _Window=require("cloud/components/window");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Paging = require("cloud/components/paging");
    var service=require("./servicefordevice");
    var shortcutversion=function(opt,type){
        if(type=="display"){
            var pos=opt.lastIndexOf("_");
            if(pos>0){
                var shortCut=opt.slice(0,pos);
            }
            return shortCut;
        }else{
            return opt
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
    var columns=[{
        "title":"同步版本",
        "lang":"text:synchro_version",
        "dataIndex":"syncVersion",
        "width":"15%",
        render:shortcutversion
    },{
        "title":"发布人",
        "lang":"text:the_publisher",
        "dataIndex":"publishUserName",
        "width":"20%"
    },{
        "title":"发布时间",
        "lang":"text:the_publishment_time",
        "dataIndex":"createTime",
        "width":"18%",
        render:function(value,type){
            if(type=='display'){
                return dateFormat(new Date(value),"yyyy-MM-dd hh:mm:ss");
            }else{
                return value
            }
        }
    },{
        "title":"开始时间",
        "lang":"text:start_time",
        "dataIndex":"syncStartTime",
        "width":"18%",
        render:function(value,type){
            if(type=='display'){
                return dateFormat(new Date(value),"yyyy-MM-dd hh:mm:ss");
            }else{
                return value
            }
        }
    },{
        "title":"完成状态",
        "lang":"text:final_status",
        "dataIndex":"state",
        "width":"19%",
        render:function(value,type){
            if(type=="display"){
                switch (value){
                    case 2:
                        return locale.get("synchro_success");
                        break;
                    case 1:
                        return locale.get("synchronizing");
                        break;
                    case 0:
                        return locale.get("synchro_failed");
                        break;
                    default :
                        break;
                }
            }else{
                return value;
            }
        }
    },{
        "title":"执行人",
        "lang":"text:synchro_excutor",
        "dataIndex":"operationUserName",
        "width":"20%"
    }];
    var DeviceSynchroHistory=Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            this.selector=options.selector;
            this.data=options.data;
            this.service=service;
            this.pageDisplay=30;
            this.renderWindow();
            this.renderTable();
            this.renderLayout();
            locale.render();
//            this.renderPaging();
        },
        renderWindow:function(){
            var self=this;
            self.window=new _Window({
                container: "body",
                title: locale.get({lang:"syc_record"}) + "(" + locale.get("device_name") + ":"+self.data.deviceName+")",
                top: "center",
                left: "center",
                height: 500,
                width: 1000,
                mask: true,
                drag:true,
                content: "<div id='theWinContent' style='height:470px'><div id='content-bar'></div><div id='content-table'></div><div id='content-paging'></div></div>",
                events: {
                    "onClose": function() {
                        self.window.destroy();
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
            self.window.show();
        },
        renderLayout:function(){
            this.layout = $("#theWinContent").layout({
                defaults: {
                    paneClass: "pane",
                    togglerLength_open: 50,
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    spacing_open: 0,
                    spacing_closed: 1,
                    togglerLength_closed: 50,
                    resizable: false,
                    slidable: false,
                    closable: false
                },
                north: {
                    paneSelector: "#content-bar",
                    size: 0,
                    closable: false
                },
                center: {
                    paneSelector: "#content-table"
//					paneClass:this.elements.content["class"]
//                    size:330
                },
                south: {
                    paneSelector: "#content-paging",
                    size: 38
                }
            });
//            var height = this.element.find("#content-table").height();
//            this.display = Math.ceil((height-60)/30-1);
        },
        renderTable:function(){
            var self=this;
            self.table=new Table({
                selector:$("#theWinContent").find("#content-table"),
//                selector: this.element.find("#" + this.elements.table.id),
                columns: columns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox : "none",
                events:{
                    drawCallback: function ( oSettings ) {
                        /* Need to redo the counters if filtered or sorted */
                        if ( oSettings.bSorted || oSettings.bFiltered )
                        {
                            for ( var i=0, iLen=oSettings.aiDisplay.length ; i<iLen ; i++ )
                            {
                                $('td:eq(0)', oSettings.aoData[ oSettings.aiDisplay[i] ].nTr ).html( i+1 );
                            }
                        }
                    },
                    scope:this
                }
            });
            this.initializeTable();
        },
        initializeTable:function(){
            var self = this;
            self.opt={
                cursor:0,
                limit:self.pageDisplay,
                deviceName:self.data.deviceName,
                publishPointId:self.data.publishPointId
            }
            self.service.getDeviceHistory(self.opt,function(returnData){
                self.renderPaging(returnData);
            },this);
        },
        renderPaging:function(data){
            var self = this;
            $("#content-paging").empty();
            self.paging = null;
            self.paging = new Paging({
                selector:"#content-paging",
                data:data,
                current:1,
                total:data.total,
                limit:30,
                requestData:function(options,success){
                    self.opt.cursor=options.cursor;
                    self.opt.limit=options.limit;
                    self.service.getDeviceHistory(self.opt,function(returnData){
                        success(returnData);
                    });
                },
                turn:function(returnData){
                    self.table.clearTableData();
                    self.table.render(returnData.result);
                    self.unmask();
                }
            })
        }
    });
    return DeviceSynchroHistory;
})