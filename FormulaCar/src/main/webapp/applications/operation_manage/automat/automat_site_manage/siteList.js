define(function(require) {
    require("cloud/base/cloud");
    require("cloud/base/fixTableHeader");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./siteList.html");
    var Service = require("./service");
    var NoticeBar = require("./notice-bar");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    require("cloud/resources/css/jquery.multiselect.css");
    var UpdateSite = require("./update/updatesite-window");
    var SeeSite = require("./see/seesite-window");
    var columns = [

        {
            "title": locale.get({
                lang: "automat_list_point_number"
            }),
            "dataIndex": "siteId",
            "cls": null,
            "width": "10%"
        }, {
            "title": locale.get({
                lang: "automat_list_point_name"
            }),
            "dataIndex": "name",
            "cls": null,
            "width": "15%",
            render: function(data, type, row) {
                var display = "";
                display += new Template(
                        "<div   style='line-height: 25px;'><span id='" + row._id + "' name='" + row.name + "' style='color: #09c;cursor: pointer;' class='invendingSite'>" + data + "</span></div>")
                    .evaluate({
                        status: ''
                    });

                return display;
            }
        }, {
            "title": locale.get({
                lang: "geography_location"
            }),
            "dataIndex": "address",
            "cls": null,
            "width": "16%"
        }, {
            "title": locale.get({
                lang: "price"
            }),
            "dataIndex": "cost",
            "cls": null,
            "width": "8%"
        }, {
            "title": locale.get({
                lang: "talk_time_success"
            }),
            "dataIndex": "talkTime",
            "cls": null,
            "width": "8%",
            render: function(data, type, row) {
                var display = "";
                if (data) {
                    display = cloud.util.dateFormat(new Date(data), "yyyy-MM-dd");
                }
                return display;
            }
        }, {
            "title": locale.get({
                lang: "line_man_name"
            }),
            "dataIndex": "lineName",
            "cls": null,
            "width": "10%"
        }, {
            "title": locale.get({
                lang: "stage_type1"
            }),
            "dataIndex": "type",
            "cls": null,
            "width": "8%"
        }, {
            "title": locale.get({
                lang: "stage_type2"
            }),
            "dataIndex": "industry",
            "cls": null,
            "width": "8%"
        }, {
            "title": "备注",
            "dataIndex": "description",
            "cls": null,
            "width": "12%"
        }
    ];

    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html( html);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
                bar: {
                    id: "sites_list_bar",
                    "class": null
                },
                table: {
                    id: "sites_list_table",
                    "class": null
                },
                paging: {
                    id: "sites_list_paging",
                    "class": null
                }
            };
            this._render();
        },
        _render: function() {
            $("#sites_list").css("width", $(".wrap").width());
            $("#sites_list_paging").css("width", $(".wrap").width());

            $("#sites_list").css("height", $("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());

            var listHeight = $("#sites_list").height();
            var barHeight = $("#sites_list_bar").height() * 2;
            var tableHeight = listHeight - barHeight - 5;
            $("#sites_list_table").css("height", tableHeight);

            this._renderTable();
            this._renderNoticeBar();
        },
        _renderBtn: function() {
            var self = this;
            $(".invendingSite").click(function() {
                var _id = $(this)[0].id;
                var names = $(this)[0].innerText;
                if (this.seeSite) {
                    this.seeSite.destroy();
                }
                this.seeSite = new SeeSite({
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
                selector: "#" + this.elements.table.id,
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
            var height = $("#sites_list_table").height() + "px";
            $("#sites_list_table-table").freezeHeader({
                'height': height
            });
            this.setDataTable();
        },
        setDataTable: function() {
            this.loadTableData(30, 0, "");
        },
        loadTableData: function(limit, cursor, areaVal) {
            var self = this;
            self.listTable.mask();
            require(["cloud/lib/plugin/jquery.multiselect"], function() {
                var lineIds = $("#lineIds").multiselect("getChecked").map(function() { //线路
                    return this.value;
                }).get();
                var search = $("#search").val();
                var searchValue = $("#searchValue").val();
                if (searchValue) {
                    searchValue = self.stripscript(searchValue);
                }

                var siteName = null;
                var siteId = null;
                if (search) {
                    if (search == 0) { //点位编号
                        siteId = searchValue;
                    } else if (search == 1) {
                        siteName = searchValue; //点位名称
                    }
                }

                var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
                var roleType = permission.getInfo().roleType;
                Service.getLinesByUserId(userId, function(linedata) {
                    var lines = [];
                    if (linedata.result && linedata.result.length > 0) {
                        for (var i = 0; i < linedata.result.length; i++) {
                            lines.push(linedata.result[i]._id);
                        }
                    }
                    if (roleType == 51) {
                        lines = [];
                    }
                    if (roleType != 51 && lines.length == 0) {
                        lines = ["000000000000000000000000"];
                    }
                    self.lineIds = lines;
                    if (lineIds.length == 0) {
                        lineIds = lines;
                    }
                    self.searchData = {
                        "name": siteName,
                        "siteId": siteId,
                        "lineId": lineIds
                    };
                    Service.getAllSitesByPage(self.searchData, limit, cursor, function(data) {
                        var total = data.result.length;
                        self.pageRecordTotal = total;
                        self.totalCount = data.result.length;
                        self.listTable.render(data.result);
                        self._renderpage(data, 1);
                        self._renderBtn();
                        self.listTable.unmask();
                    }, self);

                });
            });
        },
        _renderpage: function(data, start) {
            var self = this;
            if (self.page) {
                self.page.reset(data);
            } else {
                self.page = new Paging({
                    selector: "#" + self.elements.paging.id,
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                        self.listTable.mask();
                        Service.getAllSitesByPage(self.searchData, options.limit, options.cursor, function(data) {
                            self.pageRecordTotal = data.total - data.cursor;

                            callback(data);
                            self.listTable.unmask();
                            self._renderBtn();

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
                selector: "#" + self.elements.bar.id,
                events: {
                    query: function(areaVal) {
                        self.loadTableData($(".paging-limit-select").val(), 0, areaVal);
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
                            if (this.seeSite) {
                                this.seeSite.destroy();
                            }
                            this.seeSite = new SeeSite({
                                selector: "body",
                                id: _id,
                                name: name
                            });
                        }
                    },
                    add: function() { //添加
                        var languge = localStorage.getItem("language");
                        if (this.addSite) {
                            this.addSite.destroy();
                        }
                        if (languge == "en") {

                            require(["./update/updatesite-window-en"], function(AddSite_en) {
                                if (AddSite_en) {
                                    self.addSite = new AddSite_en({
                                        selector: "body",
                                        events: {
                                            "getsiteList": function() {
                                                self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                            }
                                        }
                                    });
                                }
                            });
                        } else {
                            this.addSite = new UpdateSite({
                                selector: "body",
                                events: {
                                    "getsiteList": function() {
                                        self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                    }
                                }
                            });
                        }
                    },
                    update: function() { //修改
                        var selectedResouces = self.getSelectedResources();
                        if (selectedResouces.length === 0) {
                            dialog.render({
                                lang: "please_select_at_least_one_config_item"
                            });
                        } else if (selectedResouces.length >= 2) {
                            dialog.render({
                                lang: "select_one_gateway"
                            });
                        } else {
                            var _id = selectedResouces[0]._id;
                            if (this.updateSite) {
                                this.updateSite.destroy();
                            }
                            var languge = localStorage.getItem("language");
                            if (languge == "en") {
                                require(["./update/updatesite-window-en"], function(UpdateSite_en) {
                                    if (UpdateSite_en) {
                                        self.updateSite = new UpdateSite_en({
                                            selector: "body",
                                            id: _id,
                                            events: {
                                                "getsiteList": function() {
                                                    self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                                }
                                            }
                                        });
                                    }
                                });
                            } else {
                                this.updateSite = new UpdateSite({
                                    selector: "body",
                                    id: _id,
                                    events: {
                                        "getsiteList": function() {
                                            self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                        }
                                    }
                                });
                            }

                        }
                    },

                    del: function() {
                        cloud.util.mask("#content-table");
                        var idsArr = self.getSelectedResources();
                        if (idsArr.length == 0) {
                            cloud.util.unmask("#content-table");
                            dialog.render({
                                lang: "automat_select_least_one_site"
                            });
                            return;
                        } else {
                            cloud.util.unmask("#content-table");
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
                                        //cloud.util.mask("#site_list_table");
                                        self.listTable.mask();
                                        Service.deleteSiteByIds(ids, function(data) {
                                            if (data.result) {
                                                if (data.result.error_code && data.result.error_code == "70013") {
                                                    dialog.render({
                                                        lang: data.result.error_code
                                                    });
                                                    self.loadTableData($(".paging-limit-select  option:selected").val(), cursor, "");
                                                } else if (data.result.error_code == "70060") {
                                                    dialog.render({
                                                        lang: data.result.error_code
                                                    });
                                                    self.loadTableData($(".paging-limit-select  option:selected").val(), cursor, "");
                                                }
                                            } else {
                                                if (data.status == "OK") {
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
                                            /* if(data.result.error_code && data.result.error_code=="70013"){
                                                 dialog.render({lang: data.result.error_code});
                                                 self.loadTableData($(".paging-limit-select  option:selected").val(), cursor, "");
                                             }else{
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
                                                 dialog.render({lang: "deletesuccessful"});
                                             }*/

                                        }, self);
                                        self.listTable.unmask();
                                        dialog.close();
                                    }
                                }, {
                                    lang: "cancel",
                                    click: function() {
                                        //                                            cloud.util.unmask("#site_list_table");
                                        self.listTable.unmask();
                                        dialog.close();
                                    }
                                }]
                            });
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