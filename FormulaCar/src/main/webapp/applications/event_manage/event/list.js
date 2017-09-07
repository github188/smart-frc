define(function(require) {
    var cloud = require("cloud/base/cloud");
    require("cloud/base/fixTableHeader");
    var html = require("text!./list.html");
    require("cloud/lib/plugin/jquery-ui");
    var NoticeBar = require("./notice-bar");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Paging = require("cloud/components/paging");
    var Button = require("cloud/components/button");
    var Table = require("cloud/components/table");
    var validator = require("cloud/components/validator");
    var Service = require("../service");
    var goodsShefWin = require("./goodsShefWin");

    var columns = [{
        "title": locale.get({
            lang: "alarm_produce_time"
        }), //产生时间
        "dataIndex": "createTime",
        "cls": null,
        "width": "20%",
        render: dateConvertor
    }, {
        "title": locale.get({
            lang: "line_man_name"
        }), //线路名称
        "dataIndex": "lineName",
        "cls": null,
        "width": "15%"
    }, {
        "title": locale.get({
            lang: "site_name"
        }), //点位名称
        "dataIndex": "siteName",
        "cls": null,
        "width": "15%"
    }, {
        "title": locale.get({
            lang: "trade_automat_number"
        }), //售货机编号
        "dataIndex": "assetId",
        "cls": null,
        "width": "15%"
    }, {
        "title": locale.get({
            lang: "traffic_automat_name"
        }), //售货机名称
        "dataIndex": "deviceName",
        "cls": null,
        "width": "15%"
    }, {
        "title": locale.get({
            lang: "automat_event_type"
        }), //操作类型
        "dataIndex": "event_class",
        "cls": null,
        "width": "20%",
        render: function(data, type, row) {
            var display = "";
            if (data) {
                if (data == 1) {
                    display = locale.get({
                        lang: "door_open"
                    }); //门开
                } else if (data == 2) {
                    display = locale.get({
                        lang: "synchronous_channel_configuration"
                    }); //同步货道配置
                } else if (data == 3) {
                    display = locale.get({
                        lang: "Synchronizing_commodity_information"
                    }); //同步商品信息
                } else if (data == 4) {
                    display = locale.get({
                        lang: "replenishment_finish"
                    }); //补货
                } else if (data == 5) {
                    display = locale.get({
                        lang: "vcs_re_register"
                    }); //工控重启
                } else if (data == 6) {
                    display = locale.get({
                        lang: "event_app_update"
                    }); //APP升级
                } else if (data == 7) {
                    display = locale.get({
                        lang: "sync_ad_file"
                    }); //下发广告文件
                } else if (data == 8) {
                    display = locale.get({
                        lang: "synchronous_lottery_allocation"
                    }); //下发抽奖配置
                } else if (data == 9) {
                    display = locale.get({
                        lang: "door_close"
                    }); //门关
                } else if (data == 10) {
                    display = "<a id='" + row._id + "\'>" + locale.get({
                        lang: "update_channel_configuration"
                    }) + "</span></a>"; //修改货道配置
                } else if (data == 11) {
                    display = locale.get({
                        lang: "sync_model_configuration"
                    }); //同步机型配置
                } else if (data == 12) {
                    display = locale.get({
                        lang: "firmware_version_upgrade"
                    }); //固件升级
                } else if (data == 13) {
                    display = locale.get({
                        lang: "vsi_upgrade"
                    }); //VSI升级
                } else if (data == 14) {
                    display = locale.get({
                        lang: "replenishment_start"
                    }); //补货开始
                } else if (data == 15) {
                    display = locale.get({
                        lang: "restart_of_industrial_control"
                    }); //工控重启
                } else if (data == 17) {
                    display = "点位更改";
                }
            } else {
                display = '';
            }
            return display;
        }
    }, {
        "title": "",
        "dataIndex": "id",
        "cls": "_id" + " " + "hide"
    }];

    function dateConvertor(value, type) {
        if (type === "display") {
            return cloud.util.dateFormat(new Date(value), "yyyy-MM-dd hh:mm:ss");
        } else {
            return value;
        }
    }

    var eventlist = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.display = 30;
            this.pageDisplay = 30;

            this.elements = {
                bar: {
                    id: "event_list_bar",
                    "class": null
                },
                table: {
                    id: "event_list_table",
                    "class": null
                },
                paging: {
                    id: "event_list_paging",
                    "class": null
                }
            };
            this.render();
        },
        render: function() {
            this._renderHtml();
            $("#event_list").css("width", $(".wrap").width());
            $("#event_list_paging").css("width", $(".wrap").width());

            $("#event_list").css("height", $("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());

            var listHeight = $("#event_list").height();
            var barHeight = $("#event_list_bar").height() * 2;
            var tableHeight = listHeight - barHeight - 5;
            $("#event_list_table").css("height", tableHeight);

            this._renderTable();
            this._renderNoticeBar();

        },
        _renderHtml: function() {
            this.element.html(html);
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
            this.eventlistTable = new Table({
                selector: "#event_list_table",
                columns: columns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox: "single",
                events: {
                    onRowClick: function(data) {
                        if (data.content) {
                            if (this.goodsMan) {
                                this.goodsMan.destroy();
                            }
                            this.goodsMan = new goodsShefWin({
                                selector: "body",
                                data: data,
                                events: {
                                    "getVersionList": function() {
                                        self.loadData($(".paging-limit-select").val(), 0);
                                    }
                                }
                            });
                        }

                    },
                    onRowRendered: function(tr, data, index) {
                        var self = this;
                    },
                    scope: this
                }
            });
            var height = $("#event_list_table").height() + "px";
            $("#event_list_table-table").freezeHeader({
                'height': height
            });
            this.setDataTable();
        },
        setDataTable: function() {
            this.loadData(0, 30);

        },
        loadData: function(cursor, limit) {
            var self = this;
            var areaId = "";
            var lineId = "";

            if ($("#userarea").attr("multiple") != undefined) {
                areaId = $("#userarea").multiselect("getChecked").map(function() { //
                    return this.value;
                }).get();
                lineId = $("#lineIds").multiselect("getChecked").map(function() { //
                    return this.value;
                }).get();
            }

            var lineFlag = 1;
            if (areaId.length != 0) {
                if ($("#userline").find("option").length <= 0) {
                    lineFlag = 0;
                }
            }
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getAreaByUserId(userId, function(areadata) {
                var areaIds = [];
                if (areadata && areadata.result && areadata.result.area && areadata.result.area.length > 0) {
                    areaIds = areadata.result.area;
                }
                if (roleType == 51) {
                    areaIds = [];
                }
                if (areaId.length != 0) {
                    areaIds = areaId;
                }

                if (roleType != 51 && areaIds.length == 0) {
                    areaIds = ["000000000000000000000000"];
                }
                cloud.Ajax.request({
                    url: "api/automatline/list",
                    type: "GET",
                    parameters: {
                        areaId: areaIds,
                        cursor: 0,
                        limit: -1
                    },
                    success: function(linedata) {
                        var lineIds = [];
                        if (linedata && linedata.result && linedata.result.length > 0) {
                            for (var i = 0; i < linedata.result.length; i++) {
                                lineIds.push(linedata.result[i]._id);
                            }
                        }

                        if (roleType == 51 && areaId.length == 0) {
                            lineIds = [];
                        }
                        if (lineId.length != 0) {
                            lineIds = lineId;
                        } else {
                            if (lineFlag == 0) {
                                lineIds = ["000000000000000000000000"];
                            }
                        }

                        if (roleType != 51 && lineIds.length == 0) {
                            lineIds = ["000000000000000000000000"];
                        }
                        self.lineIds = lineIds;

                        var pageDisplay = self.display;
                        cloud.util.mask("#event_list_table");
                        var assetId = $("#assetId").val();
                        var siteName = $("#siteName").val();
                        var automat_event_type = $("#automat_event_type").find("option:selected").val();
                        if (automat_event_type == '0') {
                            automat_event_type = '';
                        }
                        var startTime = $("#times_date").val();
                        var endTime = $("#times_enddate").val();
                        var start = '';
                        var end = '';
                        if (startTime) {
                            start = (new Date(startTime + " 00:00:00")).getTime() / 1000;
                        }
                        if (endTime) {
                            end = (new Date(endTime + " 23:59:59")).getTime() / 1000;
                        }
                        self.searchData = {
                            assetId: assetId,
                            siteName: siteName,
                            event_class: automat_event_type,
                            lineId: lineIds,
                            startTime: start,
                            endTime: end,
                            event_type: 1 //事件
                        };
                        Service.getAlarmList(self.searchData, limit, cursor, function(data) {
                            var total = data.result.length;
                            self.pageRecordTotal = total;
                            self.totalCount = data.result.length;
                            self.datas = data.result;

                            self.eventlistTable.render(data.result);
                            self._renderpage(data, 1);
                            cloud.util.unmask("#event_list_table");
                        }, self);

                    }
                });
            });
        },
        _renderpage: function(data, start) {
            var self = this;
            if (this.page) {
                this.page.reset(data);
            } else {
                this.page = new Paging({
                    selector: $("#event_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                        cloud.util.mask("#event_list_table");
                        Service.getAlarmList(self.searchData, options.limit, options.cursor, function(data) {
                            self.pageRecordTotal = data.total - data.cursor;
                            callback(data);
                            cloud.util.unmask("#event_list_table");
                        });
                    },
                    turn: function(data, nowPage) {
                        self.totalCount = data.result.length;
                        self.eventlistTable.clearTableData();
                        self.eventlistTable.render(data.result);
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
        _renderNoticeBar: function() {
            var self = this;
            this.noticeBar = new NoticeBar({
                selector: "#event_list_bar",
                events: {
                    query: function() { //查询
                        self.loadData(0, $(".paging-limit-select").val());
                    },
                }
            });
        },
        getSelectedResources: function() {
            var self = this;
            var selectedRes = $A();
            self.eventlistTable && self.eventlistTable.getSelectedRows().each(function(row) {
                selectedRes.push(self.eventlistTable.getData(row));
            });
            return selectedRes;
        }
    });
    return eventlist;
});