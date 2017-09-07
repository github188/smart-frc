/**
 * Created by zhouyunkui on 14-6-13.
 */
define(function(require){
    var cloud=require("cloud/base/cloud");
    var Table=require("cloud/components/table");
    var TagOverView=require("../../components/tagoverviewforpulishpoint");
    var Paging=require("cloud/components/paging");
    var service=require("./service");
    var RollbackInfo=require("./rollbackinfo");
    var Button=require("cloud/components/button");
    var Window=require("cloud/components/window");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/lib/plugin/jquery.uploadify");
    require("./button.css");
    var Uploader = require("cloud/components/uploader");
//    require("cloud/resources/css/default.css");
    require("cloud/lib/plugin/jquery.layout");
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
    var columns=[{
        "title":"版本号",
        "lang":"{text:version_number}",
        "dataIndex":"version",
        "width":"8%",
        render:shortcutversion
    },{
        "title":"组名",
        "lang":"{text:group}",
        "dataIndex":"groupName",
        "width":"7%"
    },{
        "title":"设备数",
        "lang":"{text:site_count}",
        "dataIndex":"deviceList",
        "width":"11%",
        render:function(value,type){
            value=value.uniq();
            if(type=="display"){
                return value.length
            }else{
                return value;
            }
        }
    },{
        "title":"已完成热点",
        "lang":"{text:successed_site}",
        "dataIndex":"finished",
        "width":"12%"
    },{
        "title":"待同步热点",
        "lang":"{text:excuting_sync_site}",
        "dataIndex":"runing",
        "width":"12%"
    },{
        "title":"已失败热点",
        "lang":"{text:failed_site}",
        "dataIndex":"failed",
        "width":"10%"
    },{
        "title":"版本大小",
        "lang":"{text:version_size}",
        "dataIndex":"fileSize",
        "width":"10%",
        render:unitConversion
    },{
        "title":"发布人",
        "lang":"{text:the_publisher}",
        "dataIndex":"operationName",
        "width":"15%"
    },{
        "title":"发布时间",
        "lang":"{text:the_publishment_time}",
        "dataIndex":"createTime",
        "width":"15%",
        render:function(value,type){
            if(type="display"){
                return dateFormat(new Date(value),"yyyy-MM-dd hh:mm:ss");
            }else{
                return value;
            }
        }
    }];
    var Versionrollback=Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            this.display=30;
            this.service=service;
            this.drawHTML();
            this.contentLayout();
            this.renderInfo();
            this.drawTableHTMl();
            this.tableLayout();
            this.renderTable();
            this.renderTagOverview();
            locale.render();
//            this.renderPaging();
        },
        drawHTML:function(){
            var html="<div id='rollback-content'>" +
                "<div id='rollback-content-tagoverview'></div>" +
                "<div id='rollback-content-table'></div>" +
                "<div id='rollback-content-info'></div>" +
                "</div>";
            this.element.append($(html));
        },
        drawTableHTMl:function(){
            var html="<div id='content-toolbar'></div>" +
                "<div id='content-table'></div>" +
                "<div id='content-paging'></div>";
            this.element.find("#rollback-content-table").append($(html));
        },
        contentLayout:function(){
            var self=this;
            self.layoutContent = this.element.layout({
//            self.layout = this.element.layout({
                defaults: {
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
                west: {
                    paneSelector: "#rollback-content-tagoverview",
                    size: 187
                },
                center: {
                    paneSelector: "#rollback-content-table"
                },
                east: {
                    paneSelector: "#rollback-content-info",
                    initClosed: true,
                    size: 308
                }
            });
            $("#rollback-content-info-toggler").css("display","none");
        },
        tableLayout:function(){
            this.layoutTable = this.element.find("#rollback-content-table").layout({
                defaults: {
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
                north: {
                    paneSelector: "#content-toolbar",
                    size: 28
                },
                center: {
                    paneSelector: "#content-table"
                    // paneClass: this.elements.content
                },
                south: {
                    paneSelector: "#content-paging",
                    size : 38
                }
            });
        },
        renderTagOverview:function(){
            var self=this;
            this.tagoverview=new TagOverView({
                selector:"#rollback-content-tagoverview",
                service:service,
                events:{
                    click:function(tag){
                        service.getResourcesIds=tag.loadResourcesData;
                        self.render(service,tag,function(){
//                            self.unmask();
                        })
                    }
                }
            });
        },
        render: function(service,tag,callback) {
            var self = this;
//        	total = total.total;

            this.service = service;
//            this.mask();
            this.service.getTableResources(0, this.display, function(data) {
                var total = tag.total;
                this.total = total;
                this.totalCount = data.result.length;
                this.selectedCount = 0;
                var ids=data.result.pluck("_id");
                cloud.util.mask("#user-content");
                cloud.Ajax.request({
                   url:"api/publish_point/state",
                   type:"POST",
                    parameters:{
                        type:4,
                        limit:self.display,
                        cursor:0
                    },
                    data:{
                        publishIds:ids
                    },
                    success:function(returnData){
//                        2:成功
//                        1:正在
//                        0:失败
                        var tempArr=[];
                        returnData.result.each(function(one){
                            data.result.each(function(two){
                                if(one.pulishId==two._id){
                                      two.finished=one.finished;
                                      two.failed=one.failed;
                                      two.runing=one.runing;
                                }
                            });
                        });
                        if(self.table){
                            self.table.render(data.result);
                            self.renderPaging(data, 1);
                        }
                        callback && callback.call(this);
                        self.layoutContent.hide("east");
                        cloud.util.unmask("#user-content");
                    }
                });
            }, this);
        },
        renderTable:function(){
            var self=this;
            this.table=new Table({
                selector:"#content-table",
                // service: this.service,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox : "none",
                columns: columns,
                events: {
                    onRowClick: function(data) {
                        if(data){
                            self.layoutContent.open("east");
                            self.rollbackinfo.renderForm(data,self.tagoverview);
                        }
                    },
//                    onRowCheck : function(isSelected, RowEl, rowData){
//                        this.updateCountInfo();
//                        var selectedRes = this.getSelectedResources();
//                        this.fire("afterSelect", selectedRes, rowData, isSelected);//add isSelected by qinjunwen
//                    },
//                    onCheckAll : function(selectedRows){
//                        var selectedRes = this.getSelectedResources();
//                        this.fire("checkAll", selectedRes);
//                    },
//                    onLoad : function(data){
//                        this.fire("afterRendered", data);
//                    },
                    scope: this
                }
            });
            self.renderToolbar();
        },
        renderPaging:function(data,start){
            var self = this;
            if(this.page){
                this.page.reset(data);
            }else{
                this.page = new Paging({
                    selector :$("#content-paging"),
                    data : data,
                    total:data.total,
                    current : start,
                    limit : 30,
                    requestData:function(options,callback){
                        self.service.getTableResources(options.cursor, options.limit, function(data){
                            var ids=data.result.pluck("_id");
                            cloud.util.mask("body");
                            cloud.Ajax.request({
                                url:"api/publish_point/state",
                                type:"POST",
                                parameters:{
                                    type:4,
                                    limit:self.display,
                                    cursor:0
                                },
                                data:{
                                    publishIds:ids
                                },
                                success:function(returnData){
                                    var tempArr=[];
                                    returnData.result.each(function(one){
                                        data.result.each(function(two){
                                            if(one.pulishId==two._id){
                                                two.finished=one.finished;
                                                two.failed=one.failed;
                                                two.runing=one.runing;
                                            }
                                        });
                                    });
                                    callback(data);
                                    cloud.util.unmask("body");
                                }
                            });
                        });
                    },
                    turn:function(data, nowPage){
                        self.fire("onTurnPage", nowPage, data)
//                        self.totalCount = data.result.length;
                        self.table.clearTableData();
                        var ids=data.result.pluck("_id");
                        cloud.util.mask("body");
//                        cloud.Ajax.request({
//                            url:"api/publish_point/state",
//                            type:"POST",
//                            parameters:{
//                                type:4,
//                                limit:self.display,
//                                cursor:0
//                            },
//                            data:{
//                                publishIds:ids
//                            },
//                            success:function(returnData){
//                                var tempArr=[];
//                                returnData.result.each(function(one){
//                                    data.result.each(function(two){
//                                        if(one.pulishId==two._id){
//                                            two.finished=one.finished;
//                                            two.failed=one.failed;
//                                            two.runing=one.runing;
//                                        }
//                                    });
//                                });
                                self.table.render(data.result);
                                self.nowPage = parseInt(nowPage);
                                self.layoutContent.hide("east");
                                cloud.util.unmask("body");
//                            }
//                        });
                    },
                    events : {
                        "displayChanged" : function(display){
//        			        console.log("displayChanged:", display)
                            self.display = parseInt(display);
                        }
                    }
                });
                this.nowPage = start;
            }
        },
        renderInfo:function(){
            var self=this;
            self.rollbackinfo=new RollbackInfo({
                selector:"#rollback-content-info"
            })
        },
        renderToolbar:function(){
            var self=this;
            var html=$("<span id='sync_plan_button' style='margin-left: 5px'></span><span style='line-height: 25px;margin-left:5px'></span>");
            $("#content-toolbar").append(html);
            new Button({
                container:"#sync_plan_button",
//                title:"同步计划",
                text:locale.get("sync_plan"),
                events:{
                    click:function(){
                        self.renderSyncPlanWindow();
                    },
                    scope:this
                }
            })
        },
        renderSyncPlanWindow:function(){
            var self=this;
            self.current_item=self.tagoverview.itembox.getClickedItem();
            self.publishPointId=self.current_item.options._id;
            self.publishPointName=self.current_item.options.name;
            if(self.window){
                self.window.destroy();
            }
            self.window=new Window({
                container: "body",
                title: locale.get({lang:"sync_plan"}) + "(" + locale.get("publshing_point") + ":"+self.publishPointName+")",
                top: "center",
                left: "center",
                height: 470,
                width: 1000,
                mask: true,
                drag:true,
                content: "<div id='theWinContent' style=' height:430px'></div>",
                events: {
                    "onClose": function() {
                        self.window.destroy();
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
            self.window.show();
            self.renderForm();
        },
        renderForm:function(){
            var self=this;
            var html="<div class='form_wrapper'><form>" +
                "<ul>" +
                "<li><label lang='text:content_origin+:' for='origin_select'></label>" +
                "<select id='origin_select' class='validate[required]'>" +
//                "<option value='0' lang='text:micsite'></option>" +
//                "<option value='1' lang='text:auto_get' selected></option>" +
                "<option value='2' lang='text:man_upload'></option>" +
                "</select>" +
//                "</li>" +
////                "<li class='auto'><label lang='text:origin_server+:' for='server_uri'></label><input type='text' id='server_uri' /></li>" +
////                "<li class='auto'><label lang='text:absolute_path+:' for='absolute_path_input'></label><input type='text' id='absolute_path_input' /></li>" +
////                "<li class='auto'><label lang='text:user_name+:' for='server_user_name'></label><input type='text' id='server_user_name' /></li>" +
////                "<li class='auto'><label lang='text:password+:' for='server_user_password'></label><input type='password' id='server_user_password'/></li>" +
//                "<li class='auto'><label lang='text:check_interval+:' for='cycle_choose'></label>" +
//                "<select id='cycle_choose' class='validate[required]'>" +
//                "<option lang='text:fifteen_minutes' value='900000'>15分钟</option>"+
//                "<option lang='text:thirty_minutes' value='1800000'>30分钟</option>"+
//                "<option lang='text:one_hour' value='3600000'>1小时</option>"+
//                "<option lang='text:two_hour' value='7200000'>2小时</option>"+
//                "<option lang='text:four_hour' value='14400000'>4小时</option>"+
//                "<option lang='text:eight_hour' value='28800000'>8小时</option>"+
//                "<option lang='text:twelve_hour' value='43200000'>12小时</option>"+
//                "<option lang='text:one_day' value='86400000'>1天</option>"+
//                "<option lang='text:two_day' value='172800000'>2天</option>"+
//                "<option lang='text:seven_day' value='604800000'>7天</option>"+
//                "</select></li>" +
//                "<li class='auto'>" +
//                "<label lang='text:effective_time+:'></label><div style='display: inline-block'><input type='text' id='sync_start_time' /><span lang='text:to'></span><input id='sync_end_time' /></div>" +
//                "</li>" +
                "<li class='mannual'>" +
                "<label lang='{text:select_file+:}'></label><span id='select_file_button'></span>" +
                "</li>" +
                "<li class='mannual'>" +
                "<label></label><input type='text' readonly id='file_name_show'/><label class='tips_for_files' lang='{text:tips_for_files}'></label>" +
                "</li>" +
                "<li class='mannual'>" +
                "<label lang='text:version_number+:'></label><input type='text' id='version_number_input' />" +
                "</li>" +
                "<li class='mannual'>" +
                "<label lang='text:publish_site_list+:'></label><ul id='sync_site_list'></ul>" +
                "</li>" +
                "<li class='both_have'>" +
                "<label></label><span id='submit_button'></span><span id='cancel_button'></span>" +
                "</li>" +
                "</ul>" +
                "</form></div>";
            self.formOriginElement=$(html);
            locale.render({element:self.formOriginElement});
            validator.render(self.formOriginElement.find("form"),{
                promptPosition:"topRight"
            });
            self.formOriginElement.find("#sync_start_time").val(cloud.util.dateFormat(new Date(((new Date()).getTime()+1000*60*60*24)/1000),"yyyy/MM/dd") + " 00:00").datetimepicker({
                format:'Y/m/d H:i',
                step:1,
                startDate:'-1970/01/08',
                lang:locale.current() === 1 ? "en" : "ch"
            });
            self.formOriginElement.find("#sync_end_time").val(cloud.util.dateFormat(new Date(((new Date()).getTime()+1000*60*60*24*7)/1000),"yyyy/MM/dd") + " 00:00").datetimepicker({
                format:'Y/m/d H:i',
                step:1,
                lang:locale.current() === 1 ? "en" : "ch"
            });
            self.formOriginElement.find("#file_name_show").attr({
                "placeholder":locale.get("please_upload_file")
            }).css({
                    border:"0px"
                });
            self.formOriginElement.find("#origin_select option").css({
                "font-family":"'Helvetica Neue',Helvetica,'Hiragino Sans GB','Segoe UI','Microsoft Yahei',Tahoma,Arial,STHeiti,sans-serif"
            });
            self.formOriginElement.appendTo("#theWinContent");
            self.renderFormCss();
            self.renderButtons();
//            self.bindEvents();
            self.defaultHideAndShow();
        },
        defaultHideAndShow:function(){
            var self=this;
            var selectEle=self.formOriginElement.find("#origin_select");
            if(selectEle.val()==2){
//                self.formOriginElement.find(".auto").hide();
//                self.formOriginElement.find(".both_have").show();
//                self.formOriginElement.find(".mannual").show();
            }
           },
        renderButtons:function(){
            var self=this;
            self.uploadButton=new Button({
                container:self.formOriginElement.find("#select_file_button"),
                text:locale.get("upload_files"),
                lang : "{title:select_file,text:select_file}",
                imgCls : "cloud-icon-shangchuan"
            });
            self.submitButton=new Button({
                container:self.formOriginElement.find("#submit_button").css({
                    "margin-right":"20px"
                }),
                text:locale.get("submit"),
                lang:"{title:submit}",
                events:{
                      click:function(evt){
                          self.submit();
//                          self.formOriginElement.remove();
//                          self.window.destroy();
//                          self.fileUri=null;
                      },
                      scope:this
                }
            });
            self.cancelButton=new Button({
                container:self.formOriginElement.find("#cancel_button"),
                text:locale.get("cancelText"),
                lang:"{title:cancelText}",
                events:{
                    click:function(){
                        self.formOriginElement.remove();
                        self.window.destroy();
                        self.fileUri=null;
                    },
                    scope:this
                }
            });
            self.initUploader();
        },
        getCheckedCheckBox:function(){
            var self=this;
            var checkBoxEle=self.formOriginElement.find("input[type=checkbox]:checked");
            var ids=[];
            if(checkBoxEle){
               for(var i=0;i<checkBoxEle.length;i++){
                   if(checkBoxEle[i].id!="check_all_sites"){
//                       ids=ids+checkBoxEle[i].value;
//                       ids.push(checkBoxEle[i].value)
                       var v=checkBoxEle[i].value;
                            ids.push(v);
                   }
               }
            }
            return ids;
        },
        motaiHtml:function(){
            var self = this;
            self.motaiEle = $("<div></div>").appendTo($("#theWinContent").parent()).css({
                "position": "absolute",
                "width": "100%",
                "height": "100%",
                "background-color": "rgba(0,0,0,0.5)",
                "top": "0px",
                "left": "0px"
            });
            $("<div><p id='tips_motai'></p><div style='background-color:rgb(225, 242, 245) '><p id='text_description_sync' lang='text:success_continue_or_not'></p></div><span id='yes_continue'></span><span id='no_continue'></span></div>").css({
                "margin": "150px 300px",
                "width": "400px",
                "height": "180px",
                "background-color": "rgb(255,255,255)",
                "border": "1px solid rgb(222,222,222)",
                "border-radius": "6px",
                "position": "absolute"
            }).appendTo(self.motaiEle);
            self.motaiEle.find("#tips_motai").text(locale.get("prompt")).css({
                "height": "35px",
                "font-size": "14px",
                "font-weight": "bold",
                "line-height": "35px",
                "margin-left": "10px"
            });
            self.motaiEle.find("#text_description_sync").text(locale.get("success_continue_or_not"));
            new Button({
                container: self.motaiEle.find("#yes_continue").css({
                    "margin-left": "230px",
                    "top": "10px",
                    "position": 'relative'
                }),
                text: locale.get("yesText"),
                events: {
                    click: function () {
                        self.current_item.element.trigger("click");
                        self.formOriginElement.remove();
                        self.formOriginElement = null;
                        self.motaiEle.remove();
                        self.motaiEle = null;
                        self.fileUri=null;
                        self.renderForm("create");
                    },
                    scope: this
                }
            });
            new Button({
                container: self.motaiEle.find("#no_continue").css({
                    "margin-left": "20px",
                    "top": "10px",
                    "position": 'relative'
                }),
                text: locale.get("noText"),
                events: {
                    click: function () {
                        self.current_item.element.trigger("click");
                        self.formOriginElement.remove();
                        self.formOriginElement = null;
                        self.window.destroy();
                        self.motaiEle = null;
                        self.fileUri=null;
                    },
                    scope: this
                }
            });
            self.motaiEle.find("#text_description_sync").css({
                "height": "100px",
                "text-align": "center",
                "font-size": "14px",
                "width": "360px",
                "margin-left": "20px",
//                "margin-top":"35px",
                "border": "1px solid rgb(225, 242, 245)",
                "line-height": "100px",
                "background-color": "rgb(225, 242, 245)",
                "color": "rgb(0,0,0)",
                "border-radius": "6px"

            });
        },
        submit:function(){
            var self=this;
            var selectEle=self.formOriginElement.find("#origin_select");
            if(validator.result(self.formOriginElement.find("form"))){
                if(self.fileUri){
                    var tempData={};
//                    tempData.siteList=[];
                    tempData.tags=self.getCheckedCheckBox();
                    if(tempData.tags.length!=0){
                        tempData.publishPointId=self.publishPointId;
                        tempData.uri=self.fileUri;
                        var param={};
                        param.version=self.formOriginElement.find("#version_number_input").val();
                        if(param.version.empty()){
                            param.version="V."+parseInt(Math.random()*999+1);
                        }
                        cloud.Ajax.request({
                            url:"api/content_sync/publish",
                            type:"POST",
                            parameters:param,
                            data:tempData,
                            success:function(data){
                                self.motaiHtml();
                            }
                        })
                    }else{
                        dialog.render({lang:"please_select_site"})
                    }
                }else{
                    dialog.render({lang:"please_select_file"})
                }
            }
        },
        initUploader:function(){
            var self=this;
            this.uploader = new Uploader({
//                url:"http://sync.trainbow.inhand.com.cn:8080/api/content_sync/upload",
                url:"/api/content_sync/upload",
                browseElement : self.uploadButton,
                autoUpload : true,
                filters : [
                    {title : "Compressed Files", extensions : "zip"}
                ],
                maxFileSize : "1024mb",
                events : {
                    "onError" : function(err){
                        cloud.util.unmask("#ui-window-content");
                        dialog.render({text:err.text});
                    },
                    "onFilesAdded" : function(files){
//        				uploader.tipsContent.deleteItems();
                        /*if (self.fileTmp){
                         files.each(function(one){
                         //        						if (one.id != )
                         })
                         }*/
                        self.formOriginElement.find("#file_name_show").val(files[0].name);
                    },
                    "beforeFileUpload":function(){
                        cloud.util.mask(
                            "#ui-window-content",
                            locale.get("uploading_files")
                        );
                    },
                    "onFileUploaded" : function(response, file){
                        if ($.isPlainObject(response)){
                            if(response.error){
                                dialog.render({lang:response.error_code});
                            }else{
                                self.fileUri = response.result;
                                self.fileTmp = file;
                                dialog.render({lang:"uploadcomplete"});
                            }
                        }
                        cloud.util.unmask("#ui-window-content");
                    }
                }
            });
        },
        bindEvents:function(){
            var self=this;
            self.formOriginElement.find("#origin_select").change(function(evt){
                    self.formOriginElement.find(".auto").hide();
                    self.formOriginElement.find(".both_have").show();
                    self.formOriginElement.find(".mannual").show();
            });
        },
        renderFormCss:function(){
            var self=this;
            self.formOriginElement.css({
                "margin":"0px auto",
                "width":"600px"
            });
            self.formOriginElement.find("li").css({
                "margin-top":"10px",
                "width":"500px"
//                "font-size":"14px"
            }).find("label").css({
                    "display":"inline-block",
                    "width":"160px",
                    "font-size":"13px"
                }).end().find("input").css({
                    "font-size":"13px"
                });
            self.formOriginElement.find("label.tips_for_files").css({
                "font-size":"12px",
                "color":"rgb(141, 83, 83)",
                "width":"200px"
            });
            self.formOriginElement.find("li.both_have").css({
                "text-align":"right"
            });
            self.getSiteGroup();
        },
        createOptions:function(dataArr){
            var self=this;
            var selectEle=self.formOriginElement.find("#sync_site_list").css({
                "margin-left":"160px",
                "height":"140px",
//                "overflow":"auto",
                "width":"355px",
                "background-color":"rgb(255,255,255)",
                "overflow-y":"scroll",
                "overflow-x":"hidden"
            });
            var titleEle=$("<div></div>").css({
                "margin-top":"15px",
                "margin-left":"160px",
                "width":"339px",
                "background-color": "rgb(188, 188, 188)",
                "height":"30px",
                "line-height":"30px",
                "font-size":"12px",
                "font-weight":"bold"
//                "position":"fixed"
            });
            $("<input>").attr({
                "type":"checkbox",
                "id":"check_all_sites"
            }).css({
                    "cursor":"pointer"
                }).click(function(evt){
                    if(this.checked){
                        self.formOriginElement.find("input[type=checkbox]").attr({
                            "checked":true
                        })
                    }else{
                        self.formOriginElement.find("input[type=checkbox]").attr({
                            "checked":false
                        })
                    }
                }).appendTo(titleEle);
            $("<label></label>").attr({
                "for":"check_all_sites"
            }).css({
                    "display":"inline-block",
                    "width":"53px",
                    "cursor":"pointer"
                }).text(locale.get("check_all")).appendTo(titleEle);
            $("<label></label>").css({
                "width":"153px",
                "text-align":"left",
                "display":"inline-block",
                "margin-left":"20px",
                "cursor":"pointer"
            }).attr({
                    "for":"check_all_sites"
                }).text(locale.get("site_group")).appendTo(titleEle);
            $("<label></label>").css({
                "width":"100px",
                "text-align":"left",
                "display":"inline-block",
                "cursor":"pointer"
            }).attr({
                    "for":"check_all_sites"
                }).text(locale.get("site_count")).appendTo(titleEle);
            titleEle.insertBefore(selectEle);
            if(dataArr){
                if(dataArr.length!=0){
                    var count=0;
                    for(var i=0;i<dataArr.length;i++){
                        if(dataArr[i].resourceIds.length!=0){
                            count++;
                            if(count%2!=0){
                                var liEle=$("<li></li>").css({
//                            "margin-top":"15px",
                                    "width":"339px",
                                    "background-color": "rgb(235, 233, 233)",
                                    "height":"30px",
                                    "line-height":"30px"
//                                "cursor":"pointer"
//                        "width":"200px"
                                });
                            }else{
                                var liEle=$("<li></li>").css({
//                            "margin-top":"15px",
                                    "width":"339px",
                                    "background-color": "rgb(188, 188, 188)",
                                    "height":"30px",
                                    "line-height":"30px",
                                    "cursor":"pointer"
//                        "width":"200px"
                                });
                            }
                            $("<input>").attr({
                                "id":dataArr[i]._id,
                            "value":dataArr[i]._id,
//                                "value":dataArr[i].resourceIds,
                                "type":"checkbox"
//                            "class":dataArr[i].resourceIds
                            }).click(function(evt){
                                    if(self.formOriginElement.find("#check_all_sites").attr("checked")){
                                        if(!this.checked){
                                            self.formOriginElement.find("#check_all_sites").attr("checked",false);
                                        }
                                    }else{
                                        var flag=0;
                                        var allCheckbox=self.formOriginElement.find("#sync_site_list input[type=checkbox]");
                                        for(var j=0;j<allCheckbox.size();j++){
                                            if(!allCheckbox[j].checked){
                                                flag=1;
                                                break;
                                            }
                                        }
                                        if(flag==0){
                                            self.formOriginElement.find("#check_all_sites").attr("checked",true);
                                        }
                                    }
                                }).css({
                                    "cursor":"pointer"
                                }).appendTo(liEle);
                            $("<label></label>").attr({
                                "for":dataArr[i]._id
                            }).css({
                                    "display":"inline-block",
                                    "width":"153px",
                                    "text-align":"left",
                                    "cursor":"pointer",
                                    "margin-left":"73px"
                                }).text(dataArr[i].name).appendTo(liEle);
                            $("<label></label>").attr({
                                "for":dataArr[i]._id
                            }).css({
                                    "display":"inline-block",
                                    "width":"100px",
                                    "text-align":"left",
                                    "cursor":"pointer"
                                }).text(dataArr[i].total).appendTo(liEle);
                            liEle.appendTo(selectEle);
                        }else{
                            var liEle=$("<li></li>").css({
                                "width":"339px",
                                "background-color": "rgb(180, 242, 245)",
                                "height":"30px",
                                "line-height":"30px"
                            });
                            if(dataArr.length==1){
                                self.formOriginElement.find("#check_all_sites").hide();
                                liEle.text(locale.get("no_data")).css({
                                    "text-align":"center"
                                }).appendTo(selectEle);
                            }
                        }
                    };
                }else {
                    self.formOriginElement.find("#check_all_sites").hide();
                    var liEle=$("<li></li>").text(locale.get("no_data")).css({
                        "text-align":"center",
                        "background-color": "rgb(180, 242, 245)"
                    });
                    liEle.appendTo(selectEle);
                }

            }
        },
        getSiteGroup:function(){
            var self=this;
            self.getAllSites();
        },
        getAllSites:function(){
            cloud.util.mask("#theWinContent");
            var self=this;
            cloud.Ajax.request({
                url:"api/tags/none/resources",
                type:"GET",
                parameters:{
                    verbose:1,
                    limit:0,
                    type:14
                },
                success:function(data){
                    var allSites=data.result;
                    self.getSiteTags(allSites);
                }
            })
        },
        getSiteTags:function(sites){
            var self=this;
            cloud.Ajax.request({
                url:"api/site_tags",
                type:"GET",
                parameters:{
                    verbose:100
                },
                success:function(data){
                    cloud.util.unmask("#theWinContent");
                    var siteTags=data.result;
                    var mergeResult=[];
                    var temp={};
                    temp.resourceIds=sites;
                    temp._id="defaultTagId";
                    temp.name=locale.get("ungrouped")+locale.get("site");
                    temp.total=temp.resourceIds.length;
                    mergeResult.push(temp);
                    for(var i=0;i<siteTags.length;i++){
                        var temp={};
                        temp.resourceIds=siteTags[i].resourceIds;
                        temp.total=temp.resourceIds.length;
                        temp._id=siteTags[i]._id;
                        temp.name=siteTags[i].name;
                        mergeResult.push(temp);
                    };
                    self.createOptions(mergeResult);
                }
            })
        }
    });
    return Versionrollback;
})