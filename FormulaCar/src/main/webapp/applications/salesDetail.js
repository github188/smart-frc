define(function(require) {
    var cloud = require("cloud/base/cloud");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Button = require("cloud/components/button");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    //var html = require("text!./salesDetail.html");
    var Service = require("./siteDetail/service");
    var Table = require("cloud/components/table");
    var ShelfDetailPage = require("./shelf-window");
    var Paging = require("cloud/components/paging");

    var columns = [{
        "title": "售货机编号", //售货机编号
        "dataIndex": "assetId",
        "cls": null,
        "width": "25%"
    }, {
        "title": "累计销量", //累计销量
        "dataIndex": "vendingSales",
        "cls": null,
        "width": "25%",
        render: function(data, type, row) {
            var display = data.numSInit;

            return display;
        }
    }, {
        "title": "累计销售额", //累计销售额
        "dataIndex": "vendingSales",
        "cls": null,
        "width": "25%",
        render: function(data, type, row) {
            var display = (data.moneySInit / 100).toFixed(2);

            return display;
        }
    }, {
        "title": "现金累计销量", //累计销量
        "dataIndex": "vendingSales",
        "cls": null,
        "width": "25%",
        render: function(data, type, row) {
            var display = data.cashNumSInit;

            return display;
        }
    }, {
        "title": "现金累计销售额", //累计销售额
        "dataIndex": "vendingSales",
        "cls": null,
        "width": "25%",
        render: function(data, type, row) {
            var display = (data.cashMoneySInit / 100).toFixed(2);

            return display;
        }
    }, {
        "title": "非现金累计销量", //累计销量
        "dataIndex": "vendingSales",
        "cls": null,
        "width": "25%",
        render: function(data, type, row) {
            var display = data.cashNumSInit;

            return display;
        }
    }, {
        "title": "非现金累计销售额", //累计销售额
        "dataIndex": "vendingSales",
        "cls": null,
        "width": "25%",
        render: function(data, type, row) {
            var display = (data.cashMoneySInit / 100).toFixed(2);

            return display;
        }
    }, {
        "title": "时间",
        "dataIndex": "updatetime",
        "cls": null,
        "width": "25%",
        render: function(data, type, row) {
            if (data) {
                return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
            }

        }
    }, {
        "title": "货道详情", //
        "dataIndex": "shelves",
        "cls": null,
        "width": "25%",
        render: function(data, type, row) {
            return "<a id='" + row._id + "\' class=\"cloud-button cloud-button-body cloud-button-text-only\" title=\"查看\" >查看</a>"

        }
    }];

    function fotmatDate(time) {
        var date = new Date(time);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        var stime = Y + M + D + h + m + s;
        return stime;

    }
    var InfoModel = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);

            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
                table: {
                    id: "sales_list_table",
                    "class": null
                },
                paging: {
                    id: "sales_list_paging",
                    "class": null
                }
            };

            this._render();
        },
        _render: function() {
            //this.getSalesData();
            var self = this;
            $("#update").append("<label class='notice-bar-calendar-text'>" + locale.get({
                    lang: "automat_list_start_time"
                }) + "</label>&nbsp;&nbsp;" +
                "<input style='width:150px;height:25px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='startTime' />&nbsp;&nbsp;" +
                "<label class='notice-bar-calendar-text'>" + locale.get({
                    lang: "automat_list_end_time"
                }) + "</label>&nbsp;&nbsp;" +
                "<input style='width:150px;height:25px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='endTime' />&nbsp;&nbsp;" +
                "<label for='assetId'>售货机编号</label>" +
                "<input style='width:150px;height:25px' type='text'  id='assetId' />");

            //查询
            var queryBtn = new Button({
                text: locale.get({
                    lang: "query"
                }),
                container: $("#update"),
                events: {
                    click: function() {
                        self.loadTableData($(".paging-limit-select").val(), 0);
                    }
                }
            });
            $(function() {
                $("#startTime").val(cloud.util.dateFormat(new Date((new Date()).getTime() / 1000), "yyyy/MM/dd") + " 00:00").datetimepicker({
                    format: 'Y/m/d H:i',
                    step: 1,
                    startDate: '-1970/01/08',
                    lang: locale.current() === 1 ? "en" : "ch"
                });
                $("#endTime").val(cloud.util.dateFormat(new Date((new Date()).getTime() / 1000), "yyyy/MM/dd") + " 23:59").datetimepicker({
                    format: 'Y/m/d H:i',
                    step: 1,
                    lang: locale.current() === 1 ? "en" : "ch"
                });

                //$("#startTime").val("");
                //$("#endTime").val("");
            });
            this._renderTable();
        },
        GetRequest: function() {
            var url = location.search;
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        },
        getSalesData: function() {
            var self = this;

            var searchStr = self.GetRequest();
            var oid = searchStr['oid'];
            var assetId = $("#assetId").val();

            var startTime = $("#startTime").val();
            var endTime = $("#endTime").val();

            var start = '';
            if (startTime) {
                start = (new Date(startTime)).getTime() / 1000;
            } else {
                start = (new Date(cloud.util.dateFormat(new Date((new Date()).getTime() / 1000), "yyyy/MM/dd") + " 00:00:00")).getTime() / 1000;
            }
            var end = '';
            if (endTime) {
                end = (new Date(endTime + ":59")).getTime() / 1000;
            } else {
                end = (new Date(cloud.util.dateFormat(new Date((new Date()).getTime() / 1000), "yyyy/MM/dd") + " 23:59:59")).getTime() / 1000;;
            }
            if (start != null && end != null && start >= end) {

                dialog.render({
                    lang: "start_date_cannot_be_greater_than_end_date"
                });
                return;
            }

            Service.getSalesDataList(oid, assetId, start, end, 30, 0, function(data) {
                console.log(data);

            });
        },
        _bindBtnEvent: function() {
            var self = this;
            self.datas.each(function(one) {
                $("#" + one._id).unbind('click');
                //$("#"+one._id).parent().html("<a id='"+one._id+"\' class=\"cloud-button cloud-button-body cloud-button-text-only\" title=\"查看\" >查看</a>");
                $("#" + one._id).bind('click', function(e) {
                    // e.preventDefault();
                    if (this.shelfDetail) {
                        this.shelfDetail.destroy();
                    }

                    this.shelfDetail = new ShelfDetailPage({
                        selector: "body",
                        data: one,
                        events: {
                            "getShelfDetail": function() {

                            }
                        }
                    });
                });

            });


        },
        _renderTable: function() {
            var self = this;

            this.listTable = new Table({
                selector: "#sales_list_table",
                columns: columns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox: "full",
                events: {
                    onRowClick: function(data) {

                    },
                    onRowRendered: function(tr, data, index) {
                        var self = this;
                    },
                    scope: this
                }
            });

            this.setDataTable();
        },
        setDataTable: function() {
            this.loadTableData(30, 0);
        },

        loadTableData: function(limit, cursor) {
            cloud.util.mask("#sales_list_table");
            var self = this;
            var searchStr = self.GetRequest();
            var oid = searchStr['oid'];
            var assetId = $("#assetId").val();
            var startTime = $("#startTime").val();
            var endTime = $("#endTime").val();

            var start = '';
            if (startTime) {
                start = (new Date(startTime)).getTime() / 1000;
            } else {
                start = (new Date(cloud.util.dateFormat(new Date((new Date()).getTime() / 1000), "yyyy/MM/dd") + " 00:00:00")).getTime() / 1000;
            }
            var end = '';
            if (endTime) {
                end = (new Date(endTime + ":59")).getTime() / 1000;
            } else {
                end = (new Date(cloud.util.dateFormat(new Date((new Date()).getTime() / 1000), "yyyy/MM/dd") + " 23:59:59")).getTime() / 1000;;
            }
            if (start != null && end != null && start >= end) {

                dialog.render({
                    lang: "start_date_cannot_be_greater_than_end_date"
                });
                return;
            }

            Service.getSalesDataList(oid, assetId, start, end, limit, cursor, function(data) {

                self.datas = data.result;
                var total = data.result.length;
                self.pageRecordTotal = total;
                self.totalCount = data.result.length;
                self.listTable.render(data.result);
                self._renderpage(data, 1);
                self._bindBtnEvent();
                cloud.util.unmask("#sales_list_table");
            });



        },
        _renderpage: function(data, start) {
            var self = this;
            if (self.page) {
                self.page.reset(data);
            } else {
                self.page = new Paging({
                    selector: $("#sales_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                        cloud.util.mask("#sales_list_table");
                        var searchStr = self.GetRequest();
                        var oid = searchStr['oid'];
                        var assetId = $("#assetId").val();

                        var startTime = $("#startTime").val();
                        var endTime = $("#endTime").val();

                        var start = '';
                        if (startTime) {
                            start = (new Date(startTime)).getTime() / 1000;
                        } else {
                            start = (new Date(cloud.util.dateFormat(new Date((new Date()).getTime() / 1000), "yyyy/MM/dd") + " 00:00:00")).getTime() / 1000;
                        }
                        var end = '';
                        if (endTime) {
                            end = (new Date(endTime + ":59")).getTime() / 1000;
                        } else {
                            end = (new Date(cloud.util.dateFormat(new Date((new Date()).getTime() / 1000), "yyyy/MM/dd") + " 23:59:59")).getTime() / 1000;;
                        }
                        if (start != null && end != null && start >= end) {

                            dialog.render({
                                lang: "start_date_cannot_be_greater_than_end_date"
                            });
                            return;
                        }
                        Service.getSalesDataList(oid, assetId, start, end, options.limit, options.cursor, function(data) {
                            self.pageRecordTotal = data.total - data.cursor;
                            callback(data);
                            cloud.util.unmask("#sales_list_table");
                        });
                    },
                    turn: function(data, nowPage) {
                        self.datas = data.result;
                        self.totalCount = data.result.length;
                        self.listTable.clearTableData();
                        self.listTable.render(data.result);
                        self.nowPage = parseInt(nowPage);
                        self._bindBtnEvent();
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


    });
    return InfoModel;

});