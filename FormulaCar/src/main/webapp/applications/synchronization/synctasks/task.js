/**
 * Created by zhouyunkui on 14-7-10.
 */
define(function(require){
    var SyncTask;
    var cloud=require("cloud/base/cloud");
    var html=require("text!./task.html");
    var Table = require("cloud/components/table");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Toolbar = require("cloud/components/toolbar");
    var Button = require("cloud/components/button");
    var service=require("./service");
    var Window=require("cloud/components/window");
//	var Paginate = require("cloud/components/paginate");
    var Paging = require("cloud/components/paging");
    require("./button.css")
//    var validator = require("cloud/components/validator");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/lib/plugin/jquery.datetimepicker");
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
    var transform=function(val,type){
        var value;
        if(type=="display"){
            switch (val){
                case 900000:
                    value=locale.get("fifteen_minutes");
                break;
                case 1800000:
                    value=locale.get("thirty_minutes");
                break;
                case 3600000:
                    value=locale.get("one_hour");
                    break;
                case 7200000:
                    value=locale.get("two_hour");
                    break;
                case 14400000:
                    value=locale.get("four_hour");
                    break;
                case 28800000:
                    value=locale.get("eight_hour");
                    break;
                case 43200000:
                    value=locale.get("twelve_hour");
                    break;
                case 86400000:
                    value=locale.get("one_day");
                    break;
                case 172800000:
                    value=locale.get("two_day");
                    break;
                case 604800000:
                    value=locale.get("seven_day");
                    break;
                default :
                    break;
            }
        }
        return value;
    };
    var transfer_status=function(value,type){
        var val="";
        if(type=="display"){
            switch (value){
                case 0:
                    val=locale.get("pause");
                    break;
                case 1:
                    val=locale.get("executing");
                    break;
                case 3:
                    val=locale.get("be_overdue");
                    break;
                default:
                    break;
            }
        }
        return val;
    };
    var cols=[{
        "title":"发布点",
        "lang":"{text:publshing_point}",
        "dataIndex":"publishPointName",
        "width":"10%"
    },{
        "title":"文件路径",
        "lang":"{text:absolute_path}",
        "dataIndex":"tarPath",
        "width":"15%"
    },{
        "title":"用户名",
        "lang":"{text:user_name}",
        "dataIndex":"user",
        "width":"10%"
    },{
        "title":"完成状态",
        "lang":"{text:state}",
        "dataIndex":"frontStatus",
        "width":"10%",
        render:transfer_status
    },{
        "title":"检查间隔",
        "lang":"{text:check_interval}",
        "dataIndex":"synchro_cycle",
        "width":"15%",
        render:transform
    },{
        "title":"开始时间",
        "lang":"{text:start_time}",
        "dataIndex":"startTime",
        "width":"20%",
        render:function(value,type){
            if(type=="display"){
                return dateFormat(new Date(value),"yyyy-MM-dd hh:mm:ss");
            }else{
                return value;
            }
        }
    },{
        "title":"结束时间",
        "lang":"{text:end_time}",
        "dataIndex":"endTime",
        "width":"20%",
        render:function(value,type){
            if(type=="display"){
                return dateFormat(new Date(value),"yyyy-MM-dd hh:mm:ss");
            }else{
                return value;
            }
        }
    }];
    SyncTask = Class.create(cloud.Component, {
        initialize: function ($super, options) {
            this.moduleName = "content";
            $super(options);
            this.service = service;
            this.businessType = options.businessType;
            this.elements = {
                bar: {
                    id: "content-bar",
                    "class": null
                },
                table: {
                    id: "content-table",
                    "class": null
                },
                paging: {
                    id: "content-paging",
                    "class": null
                }
            };
            this.display = 30;
            this.pageDisplay = 30;
            this._render();
        },
        _render: function () {
            this.destroy();
            this._renderHtml();
            this._renderLayout();
            this._renderTable();
            this._renderToolbar();
            locale.render();
//            this._renderCreateForm();
//            this._renderNoticeBar();
        },
        _renderHtml: function () {
            this.element.html(html);
        },
        _renderToolbar: function () {
            var self = this;
            self.selectAllButton = new Button({
                checkbox: true,
                id: this.moduleName + "-select-all",
                events: {
                    click: function () {
                        if (self.selectAllButton.isSelected() === true) {
                            self.selectAllResources();
                        } else {
                            self.unselectAllResources();
                        }
                    }.bind(self)
                },
                autoGenTitle: false,
                text: "0/0",
                disabled: false
            });
            var addBtn = new Button({
                imgCls: "cloud-icon-add",
                id: this.moduleName + "-add-button",
                title: "添加",
                lang: "{title:add}",
                events: {
//                    click: this._renderCreateForm,
                    click: function () {
                        cloud.Ajax.request({
                            url:"api/content_sync/jobcount",
                            type:"GET",
                            success:function(data){
                                if(typeof data.result=="number"&&data.result<10){
                                    self.jobCount=data.result;
                                    self._renderTaskWindow("create");
                                }else{
                                    dialog.render({lang:"job_count"})
                                }
                            },
                            error:function(){

                            }
                        });
                    },
                    scope: this
                }
            });
            this.addBtn = addBtn;
            var deleteBtn = new Button({
                imgCls: "cloud-icon-reduce",
                id: this.moduleName + "-delete-button",
                title: "删除",
                lang: "{title:delete}",
                events: {
                    click: this.deleteSelectedResource,
                    scope: this
                }
            });
            this.deleteBtn = deleteBtn;
            var recoverBtn = new Button({
                imgCls: "cloud-icon-rightarrow1",
                id: this.moduleName + "-recover-button",
                title: "恢复",
                lang: "{title:batch_recover}",
                events: {
                    click: this.onRecover,
                    scope: this
                }
            });
            this.recoverBtn = recoverBtn;
            var pauseBtn = new Button({
                id: this.moduleName + "-pause-button",
                imgCls: "cloud-icon-pause",
                title: "暂停",
                lang: "{title:batch_pause}",
                events: {
                    click: this.onPause,
                    scope: this
                }
            });
            this.pauseBtn = pauseBtn;
            this.editBtn = new Button({
                id: this.moduleName + "-edit-button",
                imgCls: "cloud-icon-edit",
                title: "编辑",
                lang: "{title:edit}",
                events: {
                    click: this.onEdit,
                    scope: this
                }
            });
            this.toolbar = new Toolbar({
                selector: "#" + this.elements.bar.id
            });
            this.toolbar.appendLeftItems([this.selectAllButton], 0);
            this.toolbar.appendRightItems([this.editBtn, this.recoverBtn, this.pauseBtn, this.addBtn, this.deleteBtn], 0);
        },
        onEdit: function () {
            var self = this;
            self.res = self.getSelectedResources();
            if (self.res.length == 0) {
                dialog.render({
                    lang: "at_lease_select_one"
                });
                return;
            } else {
                self._renderTaskWindow("edit");
            }
        },
        onRecover: function () {
            var self = this;
            self.res = self.getSelectedResources();
            var ids = self.res.pluck("jobId");
            if (self.res.length == 0) {
                dialog.render({
                    lang: "at_lease_select_one"
                });
                return;
            } else {
                self.mask();
                for (var i = 0; i < ids.length; i++) {
                    var param = {jobId: ids[i]};
                    self.service.recoverTasks(param, function (data) {
                        self.refreshPage();
                    }, self)
                }
            }
        },
        onPause: function () {
            var self = this;
            self.res = self.getSelectedResources();
            var ids = self.res.pluck("jobId");
            if (self.res.length == 0) {
                dialog.render({
                    lang: "at_lease_select_one"
                });
                return;
            } else {
                self.mask();
                for (var i = 0; i < ids.length; i++) {
                    var param = {jobId: ids[i]};
                    self.service.pauseTasks(param, function (data) {
                        self.refreshPage();
                    }, self);
//                    setTimeout(function(){self.refreshPage();},"1500")
                }
            }
        },
        _renderTaskWindow: function (dowhat) {
            var self = this;
            if (self.window) {
                self.window = null;
            }
            self.window = new Window({
                container: "body",
                title: "",
                top: "center",
                left: "center",
                height: 600,
                width: 1000,
                mask: true,
                drag: true,
                content: "<div id='theWinContent' style=' height:450px'></div>",
                events: {
                    "onClose": function () {
                        self.window.destroy();
                        self.formOriginElement.remove();
                        self.formOriginElement = null;
                        self.res = null;
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
            self.window.show();
            if (dowhat == "edit") {
                self.window.setTitle(locale.get("edit_task"));
                self.renderForm(dowhat);
            } else if (dowhat == "create") {
                self.window.setTitle(locale.get({lang: "publish_sync_task"})+"("+self.jobCount+"/"+"10)");
                self.renderForm(dowhat);
            }
//            validator.render(self.formOriginElement,{
//                promptPosition:"topRight"
//            });
        },
        renderForm: function (dowhat) {
            var self = this;
            if (self.formOriginElement) {
                self.formOriginElement.remove();
                self.formOriginElement = null;
            }
            var html = "<div class='form_wrapper'><form>" +
                "<ul>" +
                "<li class='auto'><label lang='text:publish_point_list+:' for='point_select'></label>" +
                "<select id='point_select' class='validate[required]'>" +
                "</select>" +
                "<label id='point_tips' class='tips_list'></label>" +
                "</li>" +
                "<li class='auto'>" +
                "<label lang='text:sync_protocal+:' for='protocal_list'></label>" +
                "<select id='protocal_list'>" +
                "<option>rsync</option>" +
                "</select>" +
                "</li>" +
                "<li class='auto'><label lang='text:origin_server+:' for='server_uri'></label><input type='text' id='server_uri' class='validate[required]' /></li>" +
                "<li class='auto'><label lang='text:absolute_path+:' for='absolute_path_input'></label><input type='text' id='absolute_path_input' class='validate[required]' /></li>" +
                "<li class='auto'><label lang='text:user_name+:' for='server_user_name'></label><input type='text' autocomplete='off' id='server_user_name' class='validate[required]' /></li>" +
                "<li class='auto'><label lang='text:password+:' for='server_user_password'></label><input type='password' autocomplete='off' id='server_user_password' class='validate[required]'/></li>" +
                "<li class='auto'><label lang='text:check_interval+:' for='cycle_choose'></label>" +
                "<select id='cycle_choose'>" +
                "<option lang='text:fifteen_minutes' value='900000'>15分钟</option>" +
                "<option lang='text:thirty_minutes' value='1800000'>30分钟</option>" +
                "<option lang='text:one_hour' value='3600000'>1小时</option>" +
                "<option lang='text:two_hour' value='7200000'>2小时</option>" +
                "<option lang='text:four_hour' value='14400000'>4小时</option>" +
                "<option lang='text:eight_hour' value='28800000'>8小时</option>" +
                "<option lang='text:twelve_hour' value='43200000'>12小时</option>" +
                "<option lang='text:one_day' value='86400000'>1天</option>" +
                "<option lang='text:two_day' value='172800000'>2天</option>" +
                "<option lang='text:seven_day' value='604800000'>7天</option>" +
                "</select></li>" +
                "<li class='auto'>" +
                "<label lang='text:effective_time+:'></label><div style='display: inline-block'><input type='text' id='sync_start_time' />&nbsp;<span lang='text:to'></span>&nbsp;<input type='text' id='sync_end_time' /></div>" +
                "</li>" +
                "<li class='auto'>" +
                "<label lang='text:publish_site_list+:'></label>" +
                "<label id='site_tips' class='tips_list'></label>" +
                "<ul id='sync_site_list'></ul>" +
                "</li>" +
                "<li class='both_have'>" +
                "<label></label><span id='submit_button'></span><span id='cancel_button'></span>" +
                "</li>" +
                "</ul>" +
                "</form></div>";
            self.formOriginElement = $(html);
            self.formOriginElement.appendTo("#theWinContent");
            self.renderFormCss();
            locale.render({element: self.formOriginElement});
            validator.render(self.formOriginElement.find("form"), {
                promptPosition: "topRight"
//                autoPositionUpdate:false
            });
            if (dowhat == "edit") {
                self.renderFormOriginElement();
                self.getSiteGroup();
                self.getPublishPoint();
                self.renderButtons(dowhat);
            } else if (dowhat == "create") {
                self.formOriginElement.find("#sync_start_time").val(cloud.util.dateFormat(new Date(((new Date()).getTime() + 1000 * 60 * 60 * 24) / 1000), "yyyy/MM/dd") + " 00:00").datetimepicker({
                    format: 'Y/m/d H:i',
                    step: 1,
                    startDate: '-1970/01/08',
                    lang: locale.current() === 1 ? "en" : "ch"
                });
                self.formOriginElement.find("#sync_end_time").val(cloud.util.dateFormat(new Date(((new Date()).getTime() + 1000 * 60 * 60 * 24 * 7) / 1000), "yyyy/MM/dd") + " 00:00").datetimepicker({
                    format: 'Y/m/d H:i',
                    step: 1,
                    lang: locale.current() === 1 ? "en" : "ch"
                });
                self.getSiteGroup();
                self.getPublishPoint();
                self.renderButtons(dowhat);
            }

        },
        renderFormOriginElement: function () {
            var self = this;
            self.formOriginElement.find("#server_uri").val(self.res[0].server);
            self.formOriginElement.find("#absolute_path_input").val(self.res[0].tarPath);
            self.formOriginElement.find("#server_user_name").val(self.res[0].user);
            self.formOriginElement.find("#server_user_password").val(self.res[0].pass);
            self.formOriginElement.find("#cycle_choose").val(self.res[0].synchro_cycle);
            self.formOriginElement.find("#sync_start_time").val(cloud.util.dateFormat(new Date(self.res[0].startTime / 1000), "yyyy/MM/dd hh:mm")).datetimepicker({
                format: 'Y/m/d H:i',
                step: 1,
                startDate: '-1970/01/08',
                lang: locale.current() === 1 ? "en" : "ch"
            });
            self.formOriginElement.find("#sync_end_time").val(cloud.util.dateFormat(new Date(self.res[0].endTime / 1000), "yyyy/MM/dd hh:mm")).datetimepicker({
                format: 'Y/m/d H:i',
                step: 1,
                lang: locale.current() === 1 ? "en" : "ch"
            });
        },
        motaiHtml: function (dowhat) {
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
            if (dowhat == "create") {
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
                            self.formOriginElement.remove();
                            self.formOriginElement = null;
                            self.motaiEle.remove();
                            self.motaiEle = null;
                            if(self.jobCount<10){
                                self.renderForm("create");
                                self.window.setTitle(locale.get({lang: "publish_sync_task"})+"("+self.jobCount+"/"+"10)");
                            }else{
                                self.renderForm("create");
                                dialog.render({
                                    lang: "job_count",
//                                    content: content,
                                    buttons: [
                                        {lang: "i_know_it", click: function () {
                                            dialog.close();
                                            self.window.destroy();
                                        }}
                                    ]
                                });
                            }
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
//                            self.formOriginElement.remove();
//                            self.formOriginElement = null;
//                            self.window.destroy();
                            self.motaiEle.remove();
                            self.motaiEle = null;
                        },
                        scope: this
                    }
                });

            } else if (dowhat == "edit") {
                self.motaiEle.find("#text_description_sync").text(locale.get("update_success"));
                new Button({
                    container: self.motaiEle.find("#yes_continue").addClass("i_know_it").css({
                        "position": "relative",
                        "margin-left": "300px",
                        "top": "10px"
                    }),
                    text: locale.get("i_know_it"),
                    events: {
                        click: function () {
//                            self.formOriginElement.remove();
//                            self.formOriginElement = null;
//                            self.window.destroy();
                            self.motaiEle.remove();
                            self.motaiEle = null;
                            self.formOriginElement.find("label#point_tips").text("");
                            self.formOriginElement.find("label#site_tips").text("")
                        },
                        scope: this
                    }
                });
                self.motaiEle.find("#no_continue").remove();
            }
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
        submit: function () {
            var self = this;
            if (validator.result(self.formOriginElement.find("form"))) {
                var selectEle = self.formOriginElement.find("#point_select");
                var tempData = {};
                var tempStartTime = self.formOriginElement.find("#sync_start_time").val();
                tempData.startTime = (new Date(tempStartTime)).getTime();
                var tempEndTime = self.formOriginElement.find("#sync_end_time").val();
                tempData.endTime = (new Date(tempEndTime)).getTime();
                if (tempData.startTime > tempData.endTime) {
                    dialog.render({lang: "start_date_cannot_be_greater_than_end_date"});
                } else {
                    tempData.tags = self.getCheckedCheckBox();
                    if (tempData.tags.length != 0) {
                        tempData.publishPointId = selectEle.val();
                        tempData.publishPointName = selectEle.find("option[value=" + tempData.publishPointId + "]").text();
                        tempData.server = self.formOriginElement.find("#server_uri").val();
                        tempData.tarPath = self.formOriginElement.find("#absolute_path_input").val();
                        tempData.synchro_cycle = parseInt(self.formOriginElement.find("#cycle_choose").val());
                        tempData.user = self.formOriginElement.find("#server_user_name").val();
                        tempData.pass = self.formOriginElement.find("#server_user_password").val();
//                tempData.oid="1234";
//                tempData.port="1010";
                        self.service.addResource(tempData, function (data) {
                            self.motaiHtml("create");
                            self.jobCount++;
                            self.refreshPage();
                        }, self);
                    } else {
                        dialog.render({lang: "please_select_site"})
                    }

                }
            }
        },
        update: function () {
            var self = this;
            if (validator.result(self.formOriginElement.find("form"))) {
                var selectEle = self.formOriginElement.find("#point_select");
                var tempData = {};
                var tempStartTime = self.formOriginElement.find("#sync_start_time").val();
                tempData.startTime = (new Date(tempStartTime)).getTime();
                var tempEndTime = self.formOriginElement.find("#sync_end_time").val();
                tempData.endTime = (new Date(tempEndTime)).getTime();
                if (tempData.startTime > tempData.endTime) {
                    dialog.render({lang: "start_date_cannot_be_greater_than_end_date"});
                } else {
                    tempData.tags = self.getCheckedCheckBox();
                    if (tempData.tags.length != 0) {
                        tempData.publishPointId = selectEle.val();
                        tempData.publishPointName = selectEle.find("option[value=" + tempData.publishPointId + "]").text();
                        tempData.server = self.formOriginElement.find("#server_uri").val();
                        tempData.tarPath = self.formOriginElement.find("#absolute_path_input").val();
                        tempData.synchro_cycle = parseInt(self.formOriginElement.find("#cycle_choose").val());
                        tempData.user = self.formOriginElement.find("#server_user_name").val();
                        tempData.pass = self.formOriginElement.find("#server_user_password").val();
                        tempData.jobId = self.res[0].jobId;
                        self.service.updateResource(tempData, function (data) {
                            self.motaiHtml("edit");
                            self.refreshPage();
                        }, self);
                    } else {
                        dialog.render({lang: "please_select_site"})
                    }
                }
            }
        },
        getCheckedCheckBox: function () {
            var self = this;
            var checkBoxEle = self.formOriginElement.find("input[type=checkbox]:checked");
            var ids = [];
            if (checkBoxEle) {
                for (var i = 0; i < checkBoxEle.length; i++) {
                    if (checkBoxEle[i].id != "check_all_sites") {
//                       ids=ids+checkBoxEle[i].value;
//                       ids.push(checkBoxEle[i].value)
                        var v = checkBoxEle[i].value;
//                        if (v.indexOf(",") != -1) {
//                            v = v.split(",");
//                            for (var j = 0; j < v.length; j++) {
//                                ids.push(v[j]);
//                            }
//                        } else {
                            ids.push(v);
//                        }
                    }
                }
            }
            return ids;
        },
        renderFormCss: function () {
            var self = this;
            self.formOriginElement.css({
                "margin": "0px auto",
                "width": "600px"
            });
            self.formOriginElement.find("input").css({
                "display": "inline-block"
//                "height":"27px"
            })
            self.formOriginElement.find("li.auto").css({
                "margin-top": "13px",
                "position": "relative",
//                "height":"46px",
                "width": "500px"
//                "font-size":"14px"
            }).find("label").css({
                    "display": "inline-block",
                    "width": "160px",
                    "font-size": "13px"
                }).end().find("input").css({
                    "font-size": "13px"
                });
            self.formOriginElement.find("li.both_have").css({
                "text-align": "right",
                "margin-top": "10px",
                "position": "relative",
//                "height":"46px",
                "width": "500px"
//                "font-size":"14px"
            }).find("label").css({
                    "display": "inline-block",
                    "width": "160px",
                    "font-size": "13px"
                }).end().find("input").css({
                    "font-size": "13px"
                });
            self.formOriginElement.find("label.tips_list").css({
                "font-size":"12px",
                "color":"#8D5353"
            })
        },
        getPublishPoint: function () {
            var self = this;
            cloud.util.mask("#theWinContent");
            cloud.Ajax.request({
                url: "api/publish_point",
                type: "get",
                parameters:{
                  status:1,
                  limit:100
                },
                success: function (data) {
                    self.createOptions(data.result, "point");
                    cloud.util.unmask("#theWinContent");
                }
            })
        },
        renderButtons: function (dowhat) {
            var self = this;
            if (self.submitButton || self.cancelButton) {
                self.submitButton = null;
                self.cancelButton = null;
            }
            self.submitButton = new Button({
                container: self.formOriginElement.find("#submit_button").css({
                    "margin-right": "20px"
                }),
                text: locale.get("submit"),
                lang: "{title:submit}",
                events: {
                    click: function (evt) {
                        if (dowhat == "edit") {
                            self.update();
                        } else {
                            self.submit();
                        }
                    },
                    scope: this
                }
            });
            self.cancelButton = new Button({
                container: self.formOriginElement.find("#cancel_button"),
                text: locale.get("close"),
                lang: "{title:cancelText}",
                events: {
                    click: function () {
                        self.formOriginElement.remove();
                        self.window.destroy();
                    },
                    scope: this
                }
            });
//            self.initUploader();
        },
        deleteSelectedResource: function () {
            var self = this;
            var resources = this.getSelectedResources();
            if (resources.length === 0) {
                dialog.render({
                    lang: "at_lease_select_one"
                });
                return;
            }
            var content;
            dialog.render({
                lang: "affirm_delete",
                content: content,
                buttons: [
                    {lang: "yes", click: function () {
                        dialog.close();
                        self.deleteResource(resources);
                    }},
                    {lang: "no", click: function () {
                        dialog.close();
                    }}
                ]
            });
        },
        judgeHideOrShowButton: function () {
            var self = this;
            var selectedRes = self.getSelectedResources();
            if (selectedRes.length > 1) {
                self.editBtn.disable();
            } else {
                self.editBtn.enable();
            }
//                        this.fire("afterSelect", selectedRes, rowData, isSelected);//add isSelected by qinjunwen
            var res = selectedRes.find(function (one) {
                return one.jobStatus == 0 || one.timeout == 1
            });
            if (res) {
                self.pauseBtn.disable();
            } else {
                self.pauseBtn.enable();
            }
            ;
            var item = selectedRes.find(function (one) {
                return one.jobStatus == 1 || one.timeout == 1;
            });
            if (item) {
                self.recoverBtn.disable();
            } else {
                self.recoverBtn.enable();
            }
            ;
        },
        selectAllResources: function () {
            this.content.selectRows();
            this.updateCountInfo();
            var selectedRes = this.getSelectedResources();
            this.judgeHideOrShowButton();
            this.fire("afterSelect", selectedRes, null);
        },
        unselectAllResources: function () {
            this.content.unSelectRows();
            this.updateCountInfo();
            this.judgeHideOrShowButton();
            var selectedRes = this.getSelectedResources();
            this.fire("afterSelect", selectedRes, null);
        },
        deleteResource: function (resources) {
            if (resources.length) {
                if (resources.length > 0) {
                    this.doDeleteResources(resources);
                } else {
                    this.unselectAllResources();
                }
            }
            else {
                this.doDeleteResources(resources);
            }
        },
        doDeleteResources: function (resources) {
            var self = this;
            this.mask();
//            resources = cloud.util.makeArray(resources);
            var isDelAllDev;
            for (var i = 0; i < resources.length; i++) {
                self.service.deleteResource(resources[i], function (data) {
                    self.refreshPage();
                }, self);
            }
        },
        refreshPage: function (page, total) {
            var self = this;
            this.mask();
            //after add or delete,count pagination,
            var count = Math.ceil(total / (this.display));
            //if pagination less than nowpage
//            if(count < page) page = count;
//            if(page === 0 )page=1;
            function updatePage(data, page) {
                self.totalCount = data.result.length;
                self.selectedCount = 0;
                if (data.total != 0) {
                    data.result.each(function (one) {
                        if (one.timeout == 1) {
                            one.frontStatus = 3;
                        } else if (one.timeout == 2) {
                            one.frontStatus = one.jobStatus;
                        }
                    })
                }
                self.content.render(data.result);
                self.pauseBtn.enable();
                self.recoverBtn.enable();
                self.updateCountInfo();
//                self._renderPagin(data, page);
            };
            self.service.get_sync_tasks_list(/*(page-1)*(self.display),self.display,*/function (returnData) {
//                        success(returnData);
                self.totalCount = returnData.total;
                updatePage(returnData, page);
                self.unmask();
            }, self);
        },
        updateCountInfo: function () {
            this.selectedCount = this.getSelectedResources().size();
            this.selectAllButton.setText(this.selectedCount + "/" + this.totalCount);
            this.selectAllButton.setSelect(this.selectedCount === this.totalCount && this.totalCount !== 0);
        },
        getSelectedResources: function () {
            var self = this;
            var selectedRes = $A();
            self.content && self.content.getSelectedRows().each(function (row) {
                selectedRes.push(self.content.getData(row));
            });
            return selectedRes;
        },

        _renderLayout: function () {
            this.layout = this.element.layout({
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
                    paneSelector: "#" +
                        this.elements.bar.id,
                    size: "33"
                },
                center: {
                    paneSelector: "#" +
                        this.elements.table.id
                },
                south: {
                    paneSelector: "#" + this.elements.paging.id,
                    size: 38
                }
            });
            var height = this.element.find("#" + this.elements.table.id).height();
//            this.display = Math.ceil((height-60)/34);
            //							}
        },
        // get columns by businesstype
        _renderTable: function () {
            var self = this;
            this.content = new Table({
                // businessType:this.businessType,
                selector: this.element.find("#" + this.elements.table.id),
                columns: cols,
                sorting: [
                    [9, "desc"]
                ],
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox: "true",
                events: {
                    onRowRendered: function (tr, data, index) {
                        var self = this;
                        if (data.checkbox) {
                            return;
                        }
                    },
                    onRowClick: function (data) {
//                        this.fire("click", data._id, data);
                    },
                    onRowCheck: function (isSelected, RowEl, rowData) {
                        this.updateCountInfo();
                        this.judgeHideOrShowButton();
                    },
                    onCheckAll: function (selectedRows) {
                        var selectedRes = this.getSelectedResources();
                        this.fire("checkAll", selectedRes);
                    },
                    scope: this
                }
            });

            this.setDataTable();
        },

        destroy: function () {
            if (this.layout) {
                if (this.layout.destroy) {
                    this.layout.destroy();
                }
                else {
                    this.layout = null;
                }
            }
            if (this.content) {
                if (this.content.clearTableData) {
                    this.content.clearTableData();
                }
                if (this.content.destroy) {
                    this.content.destroy();
                }
                else {
                    this.content = null;
                }
            }

            if (this.noticeBar) {
                this.noticeBar.destroy();
            }
            if (this.paging) {
                this.paging.destroy();
            }
        },

        reload: function (businessType) {
            this.destroy();
            this.content = null;

        },
        _renderPagin: function (data, start) {
            var self = this;
            $("#" + this.elements.paging.id).empty();
            this.paging = null;
            this.paging = new Paging({
                selector: "#" + this.elements.paging.id,
                data: data,
                current: start,
                total: data.total,
                limit: this.pageDisplay,
                requestData: function (options, success) {
                    self.service.get_sync_tasks_list(options.cursor, options.limit, function (returnData) {
                        success(returnData);
                        self.totalCount = returnData.total;
                        self.updateCountInfo();
                    }, self);
                },
                turn: function (returnData, nowPage) {
                    var obj = returnData.result;
                    self.totalCount = returnData.total;
                    self.updateCountInfo();
                    self.nowPage = parseInt(nowPage);
                    obj.total = returnData.total;
                    self.content.render(obj);
                }
            });
            self.nowPage = 1;
        },
        setDataTable: function () {
            var self = this;
            self.service.get_sync_tasks_list(/*0,self.pageDisplay,*/function (data) {
//                self._renderPagin(data,1);
//                self.totalCount=data.total;
                if (!data.total) {
                    data.total = 0;
                }
                self.totalCount = data.total;
                self.updateCountInfo();
                if (data.total != 0) {
                    data.result.each(function (one) {
                        if (one.timeout == 1) {
                            one.frontStatus = 3;
                        } else if (one.timeout == 2) {
                            one.frontStatus = one.jobStatus;
                        }
                    })
                }
                self.content.render(data.result);
            }, self);
        },
        getSiteGroup: function () {
            var self = this;
            cloud.util.mask("#theWinContent");
            self.getAllSites();
        },
        getAllSites: function () {
            var self = this;
            cloud.Ajax.request({
                url: "api/tags/none/resources",
                type: "GET",
                parameters: {
                    verbose: 1,
                    limit: 0,
                    type: 14
                },
                success: function (data) {
                    var allSites = data.result;
                    self.getSiteTags(allSites);
                }
            })
        },
        getSiteTags: function (sites) {
            var self = this;
            cloud.Ajax.request({
                url: "api/site_tags",
                type: "GET",
                parameters: {
                    verbose: 100
                },
                success: function (data) {
                    cloud.util.unmask("theWinContent");
                    var siteTags = data.result;
                    var mergeResult = [];
                    var temp = {};
                    temp.resourceIds = sites;
                    temp._id = "defaultTagId";
                    temp.name = locale.get("ungrouped") + locale.get("site");
                    temp.total = temp.resourceIds.length;
                    mergeResult.push(temp);
                    for (var i = 0; i < siteTags.length; i++) {
                        var temp = {};
                        temp.resourceIds = siteTags[i].resourceIds;
                        temp.total = temp.resourceIds.length;
                        temp._id = siteTags[i]._id;
                        temp.name = siteTags[i].name;
                        mergeResult.push(temp);
                    }
                    ;
                    self.createOptions(mergeResult, "site");
                }
            })
        },
        createOptions: function (dataArr, where) {
            var self = this;
            if (where == "site") {
                var selectEle = self.formOriginElement.find("#sync_site_list").css({
                    "margin-left": "160px",
                    "height": "140px",
                    "width":"355px",
                    "overflow-y":"scroll",
                    "overflow-x":"hidden",
                    "background-color": "rgb(255,255,255)"
                });
                var titleEle = $("<div></div>").css({
                    "margin-top": "15px",
                    "margin-left": "160px",
                    "width": "339px",
                    "background-color": "rgb(188, 188, 188)",
                    "height": "30px",
                    "line-height": "30px",
                    "font-size": "12px",
                    "font-weight": "bold"
//                "position":"fixed"
                });
                $("<input>").attr({
                    "type": "checkbox",
                    "id": "check_all_sites"
                }).css({
                        "cursor": "pointer"
                    }).click(function (evt) {
                        if (this.checked) {
                            self.formOriginElement.find("input[type=checkbox]").attr({
                                "checked": true
                            })
                        } else {
                            self.formOriginElement.find("input[type=checkbox]").attr({
                                "checked": false
                            })
                        }
                    }).appendTo(titleEle);
                $("<label></label>").attr({
                    "for": "check_all_sites"
                }).css({
                        "display": "inline-block",
                        "width": "53px",
                        "cursor": "pointer"
                    }).text(locale.get("check_all")).appendTo(titleEle);
                $("<label></label>").css({
                    "width": "153px",
                    "text-align": "left",
                    "display": "inline-block",
                    "margin-left": "20px",
                    "cursor": "pointer"
                }).attr({
                        "for": "check_all_sites"
                    }).text(locale.get("site_group")).appendTo(titleEle);
                $("<label></label>").css({
                    "width": "100px",
                    "text-align": "left",
                    "display": "inline-block",
                    "cursor": "pointer"
                }).attr({
                        "for": "check_all_sites"
                    }).text(locale.get("site_count")).appendTo(titleEle);
                titleEle.insertBefore(selectEle);
                if (dataArr) {
                    if (dataArr.length != 0) {
                        var count=0;
                        for (var i = 0; i < dataArr.length; i++) {
                            if (dataArr[i].resourceIds.length != 0) {
                                count++;
                                if(count%2!=0){
                                    var liEle = $("<li></li>").css({
                                        "width": "339px",
                                        "background-color": "rgb(235, 233, 233)",
                                        "height": "30px",
                                        "line-height": "30px"
                                    });
                                }else{
                                    var liEle = $("<li></li>").css({
                                        "width": "339px",
                                        "background-color": "rgb(188, 188, 188)",
                                        "height": "30px",
                                        "line-height": "30px"
                                    });
                                }
                                $("<input>").attr({
                                    "id": dataArr[i]._id,
                                    "value":dataArr[i]._id,
//                                    "value": dataArr[i].resourceIds,
                                    "type": "checkbox"
//                            "class":dataArr[i].resourceIds
                                }).click(function (evt) {
                                        if (self.formOriginElement.find("#check_all_sites").attr("checked")) {
                                            if (!this.checked) {
                                                self.formOriginElement.find("#check_all_sites").attr("checked", false);
                                            }
                                        } else {
                                            var flag = 0;
                                            var allCheckbox = self.formOriginElement.find("#sync_site_list input[type=checkbox]");
                                            for (var j = 0; j < allCheckbox.size(); j++) {
                                                if (!allCheckbox[j].checked) {
                                                    flag = 1;
                                                    break;
                                                }
                                            }
                                            if (flag == 0) {
                                                self.formOriginElement.find("#check_all_sites").attr("checked", true);
                                            }
                                        }
                                    }).css({
                                        "cursor": "pointer"
                                    }).appendTo(liEle);
                                $("<label></label>").attr({
                                    "for": dataArr[i]._id
                                }).css({
                                        "display": "inline-block",
                                        "width": "153px",
                                        "text-align": "left",
                                        "cursor": "pointer",
                                        "margin-left": "73px"
                                    }).text(dataArr[i].name).appendTo(liEle);
                                $("<label></label>").attr({
                                    "for": dataArr[i]._id
                                }).css({
                                        "display": "inline-block",
                                        "width": "100px",
                                        "text-align": "left",
                                        "cursor": "pointer"
                                    }).text(dataArr[i].total).appendTo(liEle);
                                liEle.appendTo(selectEle);
                            } else {
                                var liEle=$("<li></li>").css({
                                    "width":"339px",
                                    "height":"30px",
                                    "line-height":"30px"
                                });
                                if (dataArr.length == 1) {
                                    self.formOriginElement.find("#check_all_sites").hide();
                                    liEle.text(locale.get("no_data")).css({
//                                        "background-color": "#EBE9E9",
                                        "text-align": "center"
                                    }).appendTo(selectEle);
                                }
                            }
                        }
                        ;
                    } else {
                        self.formOriginElement.find("#check_all_sites").hide();
                        var liEle = $("<li></li>").text(locale.get("no_data")).css({
                            "text-align": "center",
                            "background-color": "rgb(180, 242, 245)"
                        });
                        liEle.appendTo(selectEle);
                    }

                }
            } else if (where == "point") {
                var selectEle = self.formOriginElement.find("select#point_select");
                for (var i = 0; i < dataArr.length; i++) {
                    $("<option></option>").attr({
                        "id": dataArr[i]._id,
                        "value": dataArr[i]._id
                    }).text(dataArr[i].name).appendTo(selectEle);
                }
            }
            self.setOptions(where);
        },
        setOptions: function (where) {
            var self = this;
            if (self.res && self.res.length != 0) {
                if (where == "point") {
                    var selectEle_1 = self.formOriginElement.find("select#point_select");
                    var options = selectEle_1.find("option");
                    var flag_1 = 0;
                    for (var i = 0; i < options.size(); i++) {
                        if (options[i].value == self.res[0].publishPointId) {
                            selectEle_1.val(options[i].value);
                            flag_1 = 1;
                            break;
                        }
                    }
                    if (flag_1 == 0) {
                        self.formOriginElement.find("label#point_tips").text(locale.get("task_publish_point_not_exist"));
//                    self.mask();
//                        dialog.render({
//                            text : locale.get("task_publish_point_not_exist"),
//                            buttons: [
//                                {lang: "i_know_it", click: function () {
//                                    dialog.close();
////                                    self.formOriginElement.remove();
////                                    self.formOriginElement = null;
////                                    self.window.destroy();
////                            self.motaiEle=null;
////                        self.deleteResource(resources);
//                                }}
//                            ]
//                        });
                    }
                } else if (where == "site") {
                    var selectEle_2 = self.formOriginElement.find("ul#sync_site_list");
                    var checkboxes = selectEle_2.find("input[type=checkbox]");
                    var flag_2, targetCheckbox;
                    var siteDisappear=[];
                    var tagArr = self.res[0].tags;
                    var checkboxValues=[];
                    for (var i = 0; i < tagArr.length; i++) {
                        flag_2=0;
                        for(var j=0;j<checkboxes.size();j++){
                            var targetCheckbox=$(checkboxes[i]);
                                if(tagArr[i]==targetCheckbox.val()){
                                targetCheckbox.attr({
                                    "checked":true
                                });
                                    flag_2=1;
                                    break;
                                }
                        }
                        if(flag_2==0){
                            siteDisappear.push(tagArr[i]);
                        }
                    }
                    if(siteDisappear.length!=0){
                        self.formOriginElement.find("label#site_tips").text(locale.get("site_tag_not_exist"))
                    }
                }
            }
        }
    });
    return SyncTask;
})