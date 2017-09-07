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
            lang: "last_maintenance_time"
        }), // 最近维护时间
        "dataIndex": "createTime",
        "cls": null,
        "width": "10%",
        render: dateConvertor
    }, {
        // 下次维护时间
        "title": locale.get( "next_maintenance_time"),
        "dataIndex": "next_maintenance_time",
        "cls": null,
        "width": "10%"
    }, {
        // 剩余天数
        "title": locale.get( "remaining_days"),
        "dataIndex": "remaining_days",
        "cls": null,
        "width": "10%"
    }, {
        "title": locale.get({
            lang: "line_man_name"
        }), //经销商名称
        "dataIndex": "lineName",
        "cls": null,
        "width": "10%"
    }, {
        "title": locale.get({
            lang: "site_name"
        }), //店面名称
        "dataIndex": "siteName",
        "cls": null,
        "width": "10%"
    }, {
        "title": locale.get({
            lang: "stage_id"
        }), //赛台ID
        "dataIndex": "assetId",
        "cls": null,
        "width": "10%"
    }, {
        "title": locale.get({
            lang: "stage_type"
        }), //赛台类型
        "dataIndex": "deviceName",
        "cls": null,
        "width": "10%"
    }, {
        // 测试车ID
        "title": locale.get( "test_car_id"),
        "dataIndex": "test_car",
        "cls": null,
        "width": "10%"
    }, {
        "title": locale.get({
            lang: "maintenance_status"
        }), //维护状态
        "dataIndex": "maintenance_class",
        "cls": null,
        "width": "10%",
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

    var maintenancelist = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.display = 30;
            this.pageDisplay = 30;

            this.elements = {
                bar: {
                    id: "maintenance_list_bar",
                    "class": null
                },
                table: {
                    id: "maintenance_list_table",
                    "class": null
                },
                paging: {
                    id: "maintenance_list_paging",
                    "class": null
                }
            };
            this.render();
        },
        render: function() {
            this._renderHtml();
            $("#maintenance_list").css("width", $(".wrap").width());
            $("#maintenance_list_paging").css("width", $(".wrap").width());

            $("#maintenance_list").css("height", $("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());

            var listHeight = $("#maintenance_list").height();
            var barHeight = $("#maintenance_list_bar").height() * 2;
            var tableHeight = listHeight - barHeight - 5;
            $("#maintenance_list_table").css("height", tableHeight);

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
            this.maintenancelistTable = new Table({
                selector: "#maintenance_list_table",
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
            var height = $("#maintenance_list_table").height() + "px";
            $("#maintenance_list_table-table").freezeHeader({
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
                        cloud.util.mask("#maintenance_list_table");
                        var assetId = $("#assetId").val();
                        var siteName = $("#siteName").val();
                        var automat_maintenance_type = $("#automat_maintenance_type").find("option:selected").val();
                        if (automat_maintenance_type == '0') {
                            automat_maintenance_type = '';
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
                            event_class: automat_maintenance_type,
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

                            self.maintenancelistTable.render(data.result);
                            self._renderpage(data, 1);
                            cloud.util.unmask("#maintenance_list_table");
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
                    selector: $("#maintenance_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                        cloud.util.mask("#maintenance_list_table");
                        Service.getAlarmList(self.searchData, options.limit, options.cursor, function(data) {
                            self.pageRecordTotal = data.total - data.cursor;
                            callback(data);
                            cloud.util.unmask("#maintenance_list_table");
                        });
                    },
                    turn: function(data, nowPage) {
                        self.totalCount = data.result.length;
                        self.maintenancelistTable.clearTableData();
                        self.maintenancelistTable.render(data.result);
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
                selector: "#maintenance_list_bar",
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
            self.maintenancelistTable && self.maintenancelistTable.getSelectedRows().each(function(row) {
                selectedRes.push(self.maintenancelistTable.getData(row));
            });
            return selectedRes;
        }
    });
    return maintenancelist;
});