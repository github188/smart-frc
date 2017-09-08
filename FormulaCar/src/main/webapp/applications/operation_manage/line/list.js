define(function(require) {
    require("cloud/base/cloud");
    require("cloud/base/fixTableHeader");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./list.html");
    var Service = require("../service");
    var NoticeBar = require("./notice-bar");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    var AddLine = require("./lineMan-window");
    var SeeLine = require("./seeLine-window");
    var columns = [{
    	"title": locale.get({lang: "line_man_name"}), //线路名称
        "dataIndex": "name",
        "cls": null,
        "width": "30%",
        render: function(data, type, row) {
            var display = "";
            display += new Template(
                    "<div  style='line-height: 25px;'><span id='" + row._id + "' name='" + row.name + "' style='color: #09c;cursor: pointer;' class='invendingLine' >" + data + "</span></div>")
                .evaluate({
                    status: ''
                });

            return display;
        }
    }, {
        "title": locale.get({lang: "area_man_name"}), //区域名称
        "dataIndex": "areaName",
        "cls": null,
        "width": "30%"
    }, {
        "title": locale.get({lang: "storefont_number"}), //店面数量
        "dataIndex": "siteCount",
        "cls": null,
        "width": "30%"
    }, {
        "title": locale.get({lang: "area_man_desc"}), //描述
        "dataIndex": "desc",
        "cls": null,
        "width": "20%"
    }, { //创建时间
        "title": locale.get({lang: "create_time"}),
        "dataIndex": "createTime",
        "cls": null,
        "width": "20%",
        render: function(data, type, row) {
            if (data) {
                return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
            }

        }
    }];
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(html);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
                bar: {
                    id: "line_list_bar",
                    "class": null
                },
                table: {
                    id: "line_list_table",
                    "class": null
                },
                paging: {
                    id: "line_list_paging",
                    "class": null
                }
            };
            this._render();
        },
        _render: function() {
            $("#line_list").css("width", $(".wrap").width());
            $("#line_list_paging").css("width", $(".wrap").width());

            $("#line_list").css("height", $("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());

            var listHeight = $("#line_list").height();
            var barHeight = $("#line_list_bar").height() * 2;
            var tableHeight = listHeight - barHeight - 5;
            $("#line_list_table").css("height", tableHeight);

            this._renderTable();
            this._renderNoticeBar();
        },
        _renderBtn: function() {
            var self = this;
            $(".invendingLine").click(function() {
                var _id = $(this)[0].id;
                var names = $(this)[0].innerText;
                if (this.seeLine) {
                    this.seeLine.destroy();
                }
                this.seeLine = new SeeLine({
                    selector: "body",
                    id: _id,
                    name: names
                });
            });
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
                selector: "#line_list_table",
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
            var height = $("#line_list_table").height() + "px";
            $("#line_list_table-table").freezeHeader({
                'height': height
            });
            this.setDataTable();
        },
        setDataTable: function() {
            this.loadTableData(30, 0);
        },
        loadTableData: function(limit, cursor) {
            cloud.util.mask("#line_list_table");
            var self = this;
            var name = $("#name").val();
            if (name) {
                name = self.stripscript(name);
            }
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getLinesByUserId(userId, function(linedata) {
                var lineIds = [];
                if (linedata.result && linedata.result.length > 0) {
                    for (var i = 0; i < linedata.result.length; i++) {
                        lineIds.push(linedata.result[i]._id);
                    }
                }
                if (roleType == 51) {
                    lineIds = [];
                }
                if (roleType != 51 && lineIds.length == 0) {
                    lineIds = ["000000000000000000000000"];
                }
                self.lineIds = lineIds;
                self.searchData = {
                    "name": name,
                    "lineId": lineIds
                };

                Service.getAllLine(self.searchData, limit, cursor, function(data) {
                    var total = data.result.length;
                    self.pageRecordTotal = total;
                    self.totalCount = data.result.length;
                    self.listTable.render(data.result);
                    self._renderpage(data, 1);
                    self._renderBtn();
                    cloud.util.unmask("#line_list_table");
                }, self);


            });
        },
        _renderpage: function(data, start) {
            var self = this;
            if (self.page) {
                self.page.reset(data);
            } else {
                self.page = new Paging({
                    selector: $("#line_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                        cloud.util.mask("#line_list_table");
                        Service.getAllLine(self.searchData, options.limit, options.cursor, function(data) {
                            self.pageRecordTotal = data.total - data.cursor;
                            callback(data);
                            self._renderBtn();
                            cloud.util.unmask("#line_list_table");
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
        _renderNoticeBar: function() {
            var self = this;
            this.noticeBar = new NoticeBar({
                selector: "#line_list_bar",
                events: {
                    query: function() {
                        self.loadTableData($(".paging-limit-select").val(), 0);
                    },
                    see: function() {
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
                            var name = selectedResouces[0].name;
                            if (this.seeLine) {
                                this.seeLine.destroy();
                            }
                            this.seeLine = new SeeLine({
                                selector: "body",
                                id: _id,
                                name: name
                            });
                        }
                    },
                    add: function() {
                        if (this.addPro) {
                            this.addPro.destroy();
                        }
                        this.addPro = new AddLine({
                            selector: "body",
                            events: {
                                "getLineList": function() {
                                    self.loadTableData($(".paging-limit-select").val(), 0);
                                }
                            }
                        });
                    },
                    modify: function() {
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
                            if (this.modifyPro) {
                                this.modifyPro.destroy();
                            }
                            this.modifyPro = new AddLine({
                                selector: "body",
                                id: _id,
                                events: {
                                    "getLineList": function() {
                                        self.loadTableData($(".paging-limit-select").val(), 0);
                                    }
                                }
                            });
                        }
                    },
                    drop: function() {
                        cloud.util.mask("#area_list_table");
                        var idsArr = self.getSelectedResources();
                        if (idsArr.length == 0) {
                            cloud.util.unmask("#area_list_table");
                            dialog.render({
                                lang: "please_select_at_least_one_config_item"
                            });
                            return;
                        } else {
                            cloud.util.unmask("#area_list_table");
                            var ids = "";
                            for (var i = 0; i < idsArr.length; i++) {
                                if (i == idsArr.length - 1) {
                                    ids = ids + idsArr[i]._id;
                                } else {
                                    ids = ids + idsArr[i]._id + ",";
                                }
                            }
                            dialog.render({
                                lang: "affirm_delete",
                                buttons: [{
                                    lang: "affirm",
                                    click: function() {
                                        self.listTable.mask();
                                        Service.deleteLineByIds(ids, function(data) {
                                            if (data.result.error_code) {
                                                if (data.result.error_code && data.result.error_code == "70014") {
                                                    dialog.render({
                                                        lang: "this_line_has_site"
                                                    });
                                                    self.loadTableData($(".paging-limit-select  option:selected").val(), cursor, "");
                                                } else if (data.result.error_code == "70061") {
                                                    dialog.render({
                                                        lang: data.result.error_code
                                                    });
                                                    self.loadTableData($(".paging-limit-select  option:selected").val(), cursor, "");
                                                }
                                            } else {
                                                if (data.result == "OK") {
                                                    if (self.pageRecordTotal == 1) {
                                                        var cursor = ($(".paging-page-current").val() - 2) * $(".paging-limit-select").val();
                                                        if (cursor < 0) {
                                                            cursor = 0;
                                                        }
                                                        self.loadTableData($(".paging-limit-select  option:selected").val(), cursor, "");
                                                    } else {
                                                        self.loadTableData($(".paging-limit-select  option:selected").val(), cursor, "");
                                                    }
                                                    self.pageRecordTotal = self.pageRecordTotal - 1;
                                                    dialog.render({
                                                        lang: "deletesuccessful"
                                                    });
                                                }
                                            }
                                        }, self);
                                        self.listTable.unmask();
                                        dialog.close();
                                    }
                                }, {
                                    lang: "cancel",
                                    click: function() {
                                        self.listTable.unmask();
                                        dialog.close();
                                    }
                                }]
                            });
                        }
                    }
                }
            });
			$("#line_list_bar a.cloud-button").show();
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