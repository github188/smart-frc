define(function(require) {
    require("cloud/base/cloud");
    require("cloud/base/fixTableHeaderV");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./inboxList.html");
    var Service = require("../../service");
    var NoticeBar = require("./notice-bar");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    var RemoteControl = require("./remote-control");
    var _Window = require("cloud/components/window");

    var hqiang = new Template(
            "&nbsp;<div style='float:left;'><img  src='./operation_manage/inboxMan/control/image/hqiang.png' title='很强' style='vertical-align:middle;'></img></div>")
        .evaluate({});
    var hruo = new Template(
            "&nbsp;<div style='float:left;'><img  src='./operation_manage/inboxMan/control/image/hruo.png' title='很弱' style='vertical-align:middle;'></img></div>")
        .evaluate({});
    var qiang = new Template(
            "&nbsp;<div style='float:left;'><img  src='./operation_manage/inboxMan/control/image/qiang.png' title='强' style='vertical-align:middle;'></img></div>")
        .evaluate({});
    var ruo = new Template(
            "&nbsp;<div style='float:left;'><img  src='./operation_manage/inboxMan/control/image/ruo.png' title='弱' style='vertical-align:middle;'></img></div>")
        .evaluate({});
    var wu = new Template(
            "&nbsp;<div style='float:left;'><img  src='./operation_manage/inboxMan/control/image/wu.png' title='无' style='vertical-align:middle;'></img></div>")
        .evaluate({});
    var zhong = new Template(
            "&nbsp;<div style='float:left;'><img  src='./operation_manage/inboxMan/control/image/zhong.png' title='中' style='vertical-align:middle;'></img></div>")
        .evaluate({});

    var columns = [{
        "title": locale.get({
            lang: "network"
        }), //网络
        "dataIndex": "online",
        "cls": null,
        "width": "30px",
        render: function(data, type, row) {
            var display = "";
            if ("display" == type) {
                switch (data) {
                    case 1:
                        var offlineStr = locale.get({
                            lang: "offline"
                        });
                        display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-offline\" title = \"#{status}\"}></div>")
                            .evaluate({
                                status: offlineStr
                            });
                        break;
                    case 0:
                        var onlineStr = locale.get({
                            lang: "online"
                        });
                        display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-online\" title = \"#{status}\"}></div>")
                            .evaluate({
                                status: onlineStr
                            });
                        break;
                    default:
                        break;
                }
                return display;
            } else {
                return data;
            }
        }
    }, {
        "title": locale.get({
            lang: "trade_automat_number"
        }), //售货机编号
        "dataIndex": "assetId",
        "cls": null,
        "width": "100px"
    }, {
        "title": locale.get({
            lang: "inbox_sn"
        }), //sn
        "dataIndex": "name",
        "cls": null,
        "width": "150px"
    }, {
        "title": locale.get({
            lang: "firmware_version_information"
        }), //
        "dataIndex": "inboxConfig",
        "cls": null,
        "width": "60px",
        render: function(data, type, row) {
            if (data) {
                return data.fireware;
            }
        }
    }, {
        "title": locale.get({
            lang: "vcs_version_information"
        }), //
        "dataIndex": "inboxConfig",
        "cls": null,
        "width": "100px",
        render: function(data, type, row) {
            if (data) {
                var vcsVersion = "";
                var apps = data.apps;
                for (var i = 0; i < apps.length; i++) {
                    if (apps[i].name == "VendingCloudService") {
                        vcsVersion = apps[i].version;
                        break;
                    }
                }
                return vcsVersion;
            }
        }
    }, {
        "title": locale.get({
            lang: "ip"
        }), //网络类型
        "dataIndex": "ip",
        "cls": null,
        "width": "120px"
    }, {
        "title": locale.get({
            lang: "inbox_net"
        }), //网络类型
        "dataIndex": "net",
        "cls": null,
        "width": "100px"
    }, {
        "title": locale.get({
            lang: "inbox_signal"
        }), //信号值
        "dataIndex": "signal",
        "cls": null,
        "width": "60px",
        render: function(data, type, row) {
            var display = "";
            if (data) {
                if (data == 0) {
                    display = "<div style='float:left;width:20px;'>" + data + "</div>" + wu;
                } else if (data >= 1 && data <= 6) {
                    display = "<div style='float:left;width:20px;'>" + data + "</div>" + hruo;
                } else if (data >= 7 && data <= 13) {
                    display = "<div style='float:left;width:20px;'>" + data + "</div>" + ruo;
                } else if (data >= 14 && data <= 20) {
                    display = "<div style='float:left;width:20px;'>" + data + "</div>" + zhong;
                } else if (data >= 21 && data <= 27) {
                    display = "<div style='float:left;width:20px;'>" + data + "</div>" + qiang;
                } else if (data >= 28) {
                    display = "<div style='float:left;width:20px;'>" + data + "</div>" + hqiang;
                }
            }
            return display;
        }
    }, {
        "title": locale.get({
            lang: "inbox_iccid"
        }), //iccid号
        "dataIndex": "iccid",
        "cls": null,
        "width": "180px"
    }, {
        "title": locale.get({
            lang: "inbox_phone"
        }), //sim卡号码
        "dataIndex": "phone",
        "cls": null,
        "width": "120px"
    }, {
        "title": locale.get({
            lang: "inbox_imei"
        }), //模块号码
        "dataIndex": "imei",
        "cls": null,
        "width": "150px"
    }/*, {
        "title": locale.get({
            lang: "inbox_nctime"
        }), //Inbox网络连接时长
        "dataIndex": "nctime",
        "cls": null,
        "width": "120px",
        render: function(data, type, row) {
            if (data) {
                return computationTime(data);
            }
        }
    }, {
        "title": locale.get({
            lang: "base_station_information"
        }), //基站信息
        "dataIndex": "lbs",
        "cls": null,
        "width": "320px",
        render: function(data, type, row) {
            var display = "";
            var mcc = '';
            var mnc = '';
            var lac = '';
            var cellId = '';
            if (data && data.mcc && data.mcc != 'unknown') {
                mcc = data.mcc;
            } else {
                mcc = locale.get({
                    lang: "automat_unknown"
                });
            }
            if (data && data.mnc && data.mnc != 'unknown') {
                mnc = data.mnc;
            } else {
                mnc = locale.get({
                    lang: "automat_unknown"
                });
            }
            if (data && data.lac && data.lac != 'unknown') {
                lac = data.lac;
            } else {
                lac = locale.get({
                    lang: "automat_unknown"
                });
            }
            if (data && data.cellId && data.cellId != 'unknown') {
                cellId = data.cellId;
            } else {
                cellId = locale.get({
                    lang: "automat_unknown"
                });
            }
            display += new Template(
                    "<table width='100%' height='100%' border='1px'>" +
                    "<tr style='border-bottom:0px;border-top:0px;'><td>mcc:" + mcc + ";</td><td>mnc:" + mnc + ";</td><td>lac:" + lac + ";</td><td>cellId:" + cellId + "</td></tr>" +
                    "</table>")
                .evaluate({
                    status: ''
                });
            return display;
        }
    }, {
        "title": "CPU温度", //cpu温度
        "dataIndex": "temp",
        "cls": null,
        "width": "80px",
        render: function(data, type, row) {
            if (data) {
                return data + "℃";
            }
        }
    }, { //Inbox开机时间
        "title": locale.get({
            lang: "inbox_bootTime"
        }),
        "dataIndex": "bootTime",
        "cls": null,
        "width": "150px",
        render: function(data, type, row) {
            if (data) {
                return computationTime(data);
            }
        }
    }, {
        "title": locale.get({
            lang: "inbox_upload_time"
        }),
        "dataIndex": "updateTime",
        "cls": null,
        "width": "150px",
        render: function(data, type, row) {
            if (data) {
                if (data > 1000000000000) {
                    data = data / 1000;
                }
                return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
            } else {
                return "";
            }

        }
    }, {
        "title": locale.get({
            lang: "trade_automat_number"
        }), //售货机编号
        "dataIndex": "assetId",
        "cls": null,
        "width": "100px"
    }, {
        "title": locale.get({
            lang: "network"
        }), //网络
        "dataIndex": "online",
        "cls": null,
        "width": "50px",
        render: function(data, type, row) {
            var display = "";
            if ("display" == type) {
                switch (data) {
                    case 1:
                        var offlineStr = locale.get({
                            lang: "offline"
                        });
                        display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-offline\" title = \"#{status}\"}></div>")
                            .evaluate({
                                status: offlineStr
                            });
                        break;
                    case 0:
                        var onlineStr = locale.get({
                            lang: "online"
                        });
                        display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-online\" title = \"#{status}\"}></div>")
                            .evaluate({
                                status: onlineStr
                            });
                        break;
                    default:
                        break;
                }
                return display;
            } else {
                return data;
            }
        }
    }*/];
    //计算时间---将秒换算成XX小时XX分钟XX秒
    function computationTime(seconds) {
        seconds *= 1;
        var strTime = "";
        if (seconds < 60) {
            strTime = seconds + locale.get("seconds");
        } else if (seconds >= 60 && seconds < 3600) {
            strTime += saveInteger(seconds % (60 * 60) / 60) + locale.get("minutes");
            strTime += seconds % 60 + locale.get("seconds");
        } else if (seconds > 3600 && seconds < 3600 * 24) {
            strTime += saveInteger(seconds / (60 * 60)) + locale.get("hours");
            strTime += saveInteger(seconds % (60 * 60) / 60) + locale.get("minutes");
            strTime += seconds % 60 + locale.get("seconds");
        } else {
            strTime += saveInteger(seconds / (60 * 60 * 24)) + locale.get("days");
            strTime += saveInteger(seconds / (60 * 60) % 24) + locale.get("hours");
            strTime += saveInteger(seconds % (60 * 60) / 60) + locale.get("minutes");
            strTime += seconds % 60 + locale.get("seconds");
        }
        return strTime;
    }

    function saveInteger(data) {
        data += "";
        if (data.indexOf(".") > 0) {
            data = data.substring(0, data.indexOf("."));
        }
        return data;
    }

    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(html);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
                bar: {
                    id: "inbox_list_bar",
                    "class": null
                },
                table: {
                    id: "inbox_list_table",
                    "class": null
                },
                paging: {
                    id: "inbox_list_paging",
                    "class": null
                }
            };
            this._render();
        },
        _render: function() {
            $("#inbox_list").css("width", $(".wrap").width());
            $("#inbox_list_paging").css("width", $(".wrap").width());

            $("#inbox_list").css("height", $("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());

            var listHeight = $("#inbox_list").height();
            var barHeight = $("#inbox_list_bar").height() * 2;
            var tableHeight = listHeight - barHeight - 5;
            $("#inbox_list_table").css("height", tableHeight);


            this._renderTable();
            this._renderNoticeBar();
            this.obj1 = {};
            this.tempObj1 = this.obj1;
            this._events();
        },
        stripscript: function(s) {
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '');
            }
            return rs;
        },
        _renderTable: function() {
            this.listTable = new Table({
                selector: "#inbox_list_table",
                columns: columns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox: "full",
                events: {
                    onRowClick: function(data) {
                        this.listTable.unselectAllRows();
                        var rows = this.listTable.getClickedRow();
                        this.listTable.selectRows(rows);
                    },
                    onRowRendered: function(tr, data, index) {
                        var self = this;
                    },
                    scope: this
                }
            });
            var height = $("#inbox_list_table").height() + "px";
            $("#inbox_list_table-table").freezeHeaderV({
                'height': height
            });
            this.setDataTable();
        },
        setDataTable: function() {
            this.loadTableData(30, 0);
        },
        loadTableData: function(limit, cursor) {
            cloud.util.mask("#inbox_list_table");
            var self = this;

            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getAutomatByUserId(userId, function(data) {

                var assetIds = [];
                if (data.result && data.result.length > 0) {
                    for (var i = 0; i < data.result.length; i++) {
                        assetIds.push(data.result[i].assetId);
                    }
                }
                var online = [];
                var $onlineInput = $("#noticebar-online-input");
                var $offlineInput = $("#noticebar-offline-input");
                if ($onlineInput.attr("checked") == "checked" && $offlineInput.attr("checked") == "checked") {
                    online = [];
                } else if ($onlineInput.attr("checked") == "checked") {
                    online = [0];
                } else if ($offlineInput.attr("checked") == "checked") {
                    online = [1];
                } else {
                    online = [];
                }
                var name = $("#name").val();
                var assetId = $("#assetId").val();
                if (roleType == 51) {
                    assetIds = [];
                    if (assetId != "") {
                        assetIds.push(assetId);
                    }


                } else {
                    if (assetIds.length == 0) {
                        assetIds = ["000000000000000000000000"];
                    } else {
                        if (assetId != "" && $.inArray(assetId, assetIds) > -1) {
                            assetIds = [];
                            assetIds.push(assetId);
                        } else if (assetId != "") {
                            assetIds = ["000000000000000000000000"];
                        }

                    }

                }


                if (name) {
                    name = self.stripscript(name);

                    self.searchData = {
                        "name": name,
                        assetId: assetIds,
                        "online": online
                    };
                } else {
                    self.searchData = {
                        assetId: assetIds,
                        "online": online
                    };
                }

                Service.getAllInbox(self.searchData, limit, cursor, function(data) {
                    var total = data.result.length;
                    self.pageRecordTotal = total;
                    self.totalCount = data.result.length;
                    self.listTable.render(data.result);
                    self._renderpage(data, 1);
                    cloud.util.unmask("#inbox_list_table");
                }, self);

            }, self);



        },
        _renderpage: function(data, start) {
            var self = this;
            if (self.page) {
                self.page.reset(data);
            } else {
                self.page = new Paging({
                    selector: $("#inbox_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                        cloud.util.mask("#inbox_list_table");
                        Service.getAllInbox(self.searchData, options.limit, options.cursor, function(data) {
                            self.pageRecordTotal = data.total - data.cursor;
                            callback(data);
                            cloud.util.unmask("#inbox_list_table");
                        });
                    },
                    turn: function(data, nowPage) {
                        self.totalCount = data.result.length;
                        self.listTable.clearTableData();
                        self.listTable.render(data.result);
                        self.nowPage = parseInt(nowPage);
                    },
                    events: {
                        "displayChanged": function(display) {
                            self.display = parseInt(display);
                        }
                    }
                });
                this.nowPage = start;
            }
        },
        _events: function() {
            var self = this;
            $("#noticebar-online-input").live("click", function() {
                self.obj1 = self.tempObj1;
                var thisChecked = $(this).attr("checked");
                var offlineChecked = $("#noticebar-offline-input").attr("checked");
                if (thisChecked === "checked" && offlineChecked === "checked") {
                    self.obj1.online = [];
                } else if (thisChecked === "checked") {
                    self.obj1.online = [1];
                } else if (offlineChecked === "checked") {
                    self.obj1.online = [0];
                }
            });
            $("#noticebar-offline-input").live("click", function() {
                self.obj1 = self.tempObj1;
                var thisChecked = $(this).attr("checked");
                var onlineChecked = $("#noticebar-online-input").attr("checked");
                if (thisChecked === "checked" && onlineChecked === "checked") {
                    self.obj1.online = [];
                } else if (thisChecked === "checked") {
                    self.obj1.online = [0];
                } else if (onlineChecked === "checked") {
                    self.obj1.online = [1];
                }
            });
        },
        _renderNoticeBar: function() {
            var self = this;
            this.noticeBar = new NoticeBar({
                selector: "#inbox_list_bar",
                events: {
                    query: function() {
                        self.loadTableData($(".paging-limit-select").val(), 0);
                    },
                    drop: function() {
                        var selectedResouces = self.getSelectedResources();
                        if (selectedResouces.length === 0) {
                            dialog.render({
                                lang: "please_select_at_least_one_config_item"
                            });
                        } else {
                            dialog.render({
                                lang: "affirm_delete",
                                buttons: [{
                                    lang: "affirm",
                                    click: function() {
                                        for (var i = 0; i < selectedResouces.length; i++) {
                                            var _id = selectedResouces[i]._id;
                                            Service.deleteInboxById(_id, function(data) {
                                                if (data.error != null) {
                                                    if (data.error_code == "70013") {
                                                        dialog.render({
                                                            text: "该inbox不存在"
                                                        });
                                                        return;
                                                    }
                                                } else {
                                                    self.loadTableData($(".paging-limit-select").val(), 0);
                                                    dialog.render({
                                                        lang: "deletesuccessful"
                                                    });
                                                }
                                            });
                                        }
                                        dialog.close();
                                    }
                                }, {
                                    lang: "cancel",
                                    click: function() {
                                        dialog.close();
                                    }
                                }]
                            });
                        }
                    },
                    control: function() {
                        var selectedResouces = self.getSelectedResources();
                        if (selectedResouces.length == 0) {
                            dialog.render({
                                lang: "please_select_at_least_one_config_item"
                            });
                        } else if (selectedResouces.length >= 2) {
                            dialog.render({
                                lang: "select_one_gateway"
                            });
                        } else {
                            var _id = selectedResouces[0]._id;
                            var assetId = selectedResouces[0].assetId;
                            var ip = selectedResouces[0].ip;
                            if (this.window) {
                                this.window.destroy();
                                this.window = null;
                            }

                            this.window = new _Window({
                                container: "body",
                                title: locale.get("remote_control"),
                                lang: "{title:remote_control}",
                                top: "center",
                                left: "center",
                                cls: "mydevice-overvier-configMgr",
                                height: 640,
                                width: 853,
                                mask: true,
                                drag: true,
                                content: "<div id='overview-window-remote-controll'></div>",
                                events: {
                                    "onClose": function() {
                                        this.window.destroy();
                                        this.window = null;
                                        self.remoteControl.destroy();
                                    },
                                    scope: this
                                }
                            });

                            require(["./remote-control"], function(RemoteControl) {
                                self.remoteControl = new RemoteControl({
                                    selector: "#overview-window-remote-controll",
                                    id: _id,
                                    assetId: assetId,
                                    ip: ip
                                });
                            });

                            this.window.show();
                        }
                    }
                }
            });
        },
        getSelectedResources: function() {
            var self = this;
            var rows = self.listTable.getSelectedRows();
            var selectedRes = new Array();
            rows.each(function(row) {
                selectedRes.push(self.listTable.getData(row));
            });
            return selectedRes;
        }
    });
    return list;
});