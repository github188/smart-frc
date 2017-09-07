define(function(require) {
    var cloud = require("cloud/base/cloud");
    var html = require("text!./content.html");
    var Table = require("cloud/components/table");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Button = require("cloud/components/button");
    var NoticeBar = require("./notice-bar");
    var Paging = require("cloud/components/paging");
    require("../css/table.css");
    var Service = require("../../service");
    var Content = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.columns = options.columns;
            this.businessType = options.businessType;
            this.elements = {
                toolbar: this.id + "-toolbar",
                table: this.id + "-content",
                paging: this.id + "-paging"
            };
            this.table = "";
            this.display = null;
            this.pageDisplay = 30;
            this.searchParams = {
                searchCondition: null,
                searchValue: null
            };
            this._render();
        },
        _render: function() {
            this._renderHtml();
            this._renderContent();
        },
        _renderContent: function() {
            this._renderTable();
            this._renderToolbar();
        },
        _renderHtml: function() {
            this.element.append(html);
            $("#content-table-toolbar").css({"width": "auto", "margin-top": "4px", "margin-bottom": "4px", "margin-left": "13px"});
        },
        _renderTable: function() {
            var self = this;
            this.table = new Table({
                selector: "#" + this.elements.table,
                columns: [self.columns].flatten(),
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox: "full",
                events: {
                    onRowClick: function(data, callback) {
                        this.table.unselectAllRows();
                        var rows = this.table.getClickedRow();
                        this.table.selectRows(rows);
                        self.fire("click");
                    },
                    onRowCheck: function() {
                    },
                    onCheckAll: function(selectedRows) {
                    },
                    scope: this
                }
            });
            this.loadTableData();
        },
        loadTableData: function() {
            cloud.util.mask("#content-table-content");
            var self = this;
            var pageDisplay = this.pageDisplay;
            Service.getModelInfo(null, null, 0, pageDisplay, function(data) {
                var total = data.total;
                this.totalCount = data.result.length;
                data.total = total;
                self.table.render(data.result);
                self._renderpage(data, 1);
                cloud.util.unmask("#content-table-content");
            });
        },
        _renderpage: function(data, start) {
            var self = this;
            if (this.page) {
                this.page.reset(data);
            } else {
                this.page = new Paging({
                    selector: $("#" + this.elements.paging),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                        Service.getModelInfo(self.searchParams.searchCondition, self.searchParams.searchValue, options.cursor, options.limit, function(data) {
                            callback(data);
                        });
                    },
                    turn: function(data, nowPage) {
                        self.totalCount = data.result.length;
                        self.table.clearTableData();
                        self.table.render(data.result);
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
        _renderToolbar: function() {
            var self = this;
            this.noticeBar = new NoticeBar({
                selector: "#" + this.elements.toolbar,
                events: {
                    query: function() {//添加
                        self.fire("query");
                    },
                    add: function() {
                        cloud.util.mask("#automat_manager_model");
                        self.fire("add");
                    },
                    modify: function() {
                        cloud.util.mask("#automat_manager_model");
                        var selectedResouces = self.getSelectedResources();
                        if (selectedResouces.length == 0) {
                            dialog.render({lang: "please_select_at_least_one_config_item"});
                            cloud.util.unmask("#automat_manager_model");
                            return;
                        } else {
                            if (selectedResouces.length > 1) {
                                dialog.render({lang: "automat_model_select_only_one"});
                                cloud.util.unmask("#automat_manager_model");
                                return;
                            }
                            self.fire("modify", selectedResouces[0]._id);
                        }
                    },
                    drop: function() {
                        cloud.util.mask("#content-table-content-table");
                        var selectedResouces = self.getSelectedResources();
                        if (selectedResouces.length === 0) {
                            cloud.util.unmask("#content-table-content-table");
                            dialog.render({lang: "please_select_at_least_one_config_item"});
                        } else {
                            cloud.util.unmask("#content-table-content-table");
                            dialog.render({
                                lang: "affirm_delete",
                                buttons: [{
                                        lang: "affirm",
                                        click: function() {
                                            dialog.close();
                                            cloud.util.mask("#content-table-content");
                                            var flag = 0;
                                            var _id = selectedResouces[0]._id;
                                            var name = selectedResouces[0].name;
                                            var arr = new Array();
                                            Service.deleteModel(_id, function(data) {
                                                if (data.result.error_code && data.result.error_code != null && data.result.error_code == "70013") {
                                                    dialog.render({lang: "exists_relate_automat"});
                                                    cloud.util.unmask("#content-table-content");
                                                } else {
                                                    self.loadTableData();
                                                    dialog.render({lang: "deletesuccessful"});
                                                }
                                            });
                                        }
                                    },
                                    {
                                        lang: "cancel",
                                        click: function() {
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
            var selectedRes = $A();
            self.table && self.table.getSelectedRows().each(function(row) {
                selectedRes.push(self.table.getData(row));
            });
            return selectedRes;
        },
        _turnPage: function(page) {
            this.mask();
            this.fire("close");//点击翻页 关闭右侧Info模块 ---杨通
            this.service.getTasksList(this.opt, (page - 1) * (this.display), this.display, function(data) {
                this.totalCount = data.length;
                this.table.clearTableData();
                this.unmask();
            }, this);
        }
    });
    return Content;
});