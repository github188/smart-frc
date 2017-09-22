define(function(require) {
    var cloud = require("cloud/base/cloud");
    require("cloud/base/fixTableHeaderV");
    var html = require("text!./content.html");
    require("cloud/lib/plugin/jquery-ui");
    var NoticeBar = require("./notice-bar");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Paging = require("cloud/components/paging");
    var Button = require("cloud/components/button");
    var Table = require("cloud/components/table");
    var validator = require("cloud/components/validator");
    var Service = require("../../service");
    require("./css/style.css");
    var countdown = 60;
    var timer;
    var columns = [{
            "title": "赛台编号",
            "dataIndex": "assetId",
            "cls": null,
            "width": "100px"
        }, {
            "title": "赛车ID",
            "dataIndex": "cardId",
            "cls": null,
            "width": "100px"
        }, {
            "title": "用户名",
            "dataIndex": "userName",
            "cls": null,
            "width": "100px"
        }, {
            "title": "赛道编号",
            "dataIndex": "tid",
            "cls": null,
            "width": "100px"
        }, {
            "title": "店面名称",
            "dataIndex": "siteName",
            "cls": null,
            "width": "100px"
        }, {
            "title": "经销商",
            "dataIndex": "dealerName",
            "cls": null,
            "width": "100px"
        }, {
            "title": "赛台类型",
            "dataIndex": "moduleNum",
            "cls": null,
            "width": "100px"
        }, {
            "title": "重量",
            "dataIndex": "weight",
            "cls": null,
            "width": "70px"
        }, {
            "title": "对手1",
            "dataIndex": "userName1",
            "cls": null,
            "width": "100px"
        }, {
            "title": "对手2",
            "dataIndex": "userName2",
            "cls": null,
            "width": "100px"
        }, {
            "title": "成绩",
            "dataIndex": "ranking",
            "cls": null,
            "width": "70px"
        }, {
            "title": "比赛时间",
            "dataIndex": "time",
            "cls": null,
            "width": "100px"
        }, {
            "title": "",
            "dataIndex": "id",
            "cls": "_id" + " " + "hide"
        }
    ];

    function priceConvertor(value, type) {
        if (value == null) {
            return value
        }
        return value / 100;
    }

    function specialPriceConvertor(value, type) {
        if (value) {
            return value / 100;
        }

    }

    function refundStatus(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 0:
                    display = locale.get({
                        lang: "none"
                    }); //无
                    break;
                case 1:
                    display = locale.get({
                        lang: "refunding"
                    }); //正在退款
                    break;
                case 2:
                    display = locale.get({
                        lang: "refunded"
                    }); //退款成功
                    break;
                case 3:
                    display = locale.get({
                        lang: "refunding_error"
                    }); //退款失败
                    break;
                case 4:
                    display = locale.get({
                        lang: "need_to_re_aunch_the_refund"
                    }); //退款需要重新发起
                    break;
                case 5:
                    display = locale.get({
                        lang: "to_send"
                    }); //转入代发
                    break;
                default:
                    break;
            }
            return display;
        } else {
            return value;
        }
    }


    function typeConvertor(value, type, row) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case "1":
                    display = locale.get({
                        lang: "trade_baifubao"
                    }); //百付宝
                    break;
                default:
                    break;
            }

            return display;
        } else {
            return value;
        }
    }
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
                bar: {
                    id: "trade_list_bar",
                    "class": null
                },
                table: {
                    id: "trade_list_table",
                    "class": null
                },
                paging: {
                    id: "trade_list_paging",
                    "class": null
                }
            };
            this.render();
        },
        render: function() {
            this._renderHtml();
            this._renderNoticeBar();
            this._renderTable();
        },
        _renderHtml: function() {
            this.element.html(html);
            $("#trades_list").css("width", $(".wrap").width());
            $("#trade_list_paging").css("width", $(".wrap").width());

            $("#trades_list").css("height", $("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());

            var listHeight = $("#trades_list").height();
            var barHeight = $("#trade_list_bar").height();
            var pageHeight = $("#trade_list_paging").height();
            var tableHeight = listHeight - barHeight - pageHeight - 5;
            $("#trade_list_table").css("height", tableHeight);
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
            var self = this;
            this.listTable = new Table({
                selector: "#trade_list_table",
                columns: columns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox: "multi",
                events: {
                    onRowClick: function(data) {

                        this.listTable.unselectAllRows();
                        var rows = this.listTable.getClickedRow();
                        this.listTable.selectRows(rows);
                        self.fire("click", data._id);
                    },
                    onRowRendered: function(tr, data, index) {
                        var self = this;
                    },
                    scope: this
                }
            });
            var height = $("#trade_list_table").height() + "px";
            $("#trade_list_table-table").freezeHeaderV({
                'height': height
            });
            this.setDataTable();
        },
        setDataTable: function() {
            this.loadData();
        },
        loadData: function() {
            var self = this;
            var pageDisplay = self.display;
            
            var nowDate = new Date();
            var start = (new Date(nowDate.getFullYear() + "/" + (nowDate.getMonth() + 1) + "/" + nowDate.getDate() + " 00:00:00")).getTime() / 1000;
            var end = (new Date(nowDate.getFullYear() + "/" + (nowDate.getMonth() + 1) + "/" + nowDate.getDate() + " 23:59:59")).getTime() / 1000;


            var byDate = $("#times_date").val(); //日
            var byMonth = $("#times_month").val(); //月
            if (byDate) {
                start = (new Date(byDate + " 00:00:00")).getTime() / 1000;
                end = (new Date(byDate + " 23:59:59")).getTime() / 1000;
            }
            if (byMonth) {
                var year = byMonth.split('/')[0];

                var months = byMonth.split('/')[1];
                var maxday = new Date(year, months, 0).getDate();
                if (months == 1 || months == 3 || months == 5 || months == 7 || months == 8 || months == 10 || months == 12) {
                    start = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                    end = (new Date(byMonth + "/31" + " 23:59:59")).getTime() / 1000;
                } else if (months == 2) {
                    start = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                    end = (new Date(byMonth + "/" + maxday + " 23:59:59")).getTime() / 1000;
                } else {
                    start = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                    end = (new Date(byMonth + "/30" + " 23:59:59")).getTime() / 1000;
                }
            }
            
            cloud.util.mask("#trade_list_table");

            Service.getTradeList(0, pageDisplay, payStyle, searchValue_assetId, searchValue_goodsName, searchValue_orderNo, searchValue_siteName, start, end, refundStatus, payStatus, userline, deliverStatus, machineType, function(data) {
                var total = data.total;
                this.totalCount = data.result.length;
                data.total = total;
                self.listTable.render(data.result);
                self._renderpage(data, 1);
                cloud.util.unmask("#trade_list_table");
            });

        },
        _renderpage: function(data, start) {
            var self = this;
            if (this.page) {
                this.page.reset(data);
            } else {
                this.page = new Paging({
                    selector: $("#trade_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                        cloud.util.mask("#trade_list_table");
                        var nowDate = new Date();
                        var start = (new Date(nowDate.getFullYear() + "/" + (nowDate.getMonth() + 1) + "/" + nowDate.getDate() + " 00:00:00")).getTime() / 1000;
                        var end = (new Date(nowDate.getFullYear() + "/" + (nowDate.getMonth() + 1) + "/" + nowDate.getDate() + " 23:59:59")).getTime() / 1000;

                        var selectedId = $("#reportType").find("option:selected").val();
                        if (selectedId == undefined || selectedId == 0) {
                            $("#times_date").val("");
                            $("#times_month").val("");
                            start = '';
                            end = '';
                        } else if (selectedId == 1) {
                            $("#times_month").val("");
                            $("#times_start").val("");
                            $("#times_end").val("");
                        } else if (selectedId == 2) {
                            $("#times_date").val("");
                            $("#times_start").val("");
                            $("#times_end").val("");
                        } else if (selectedId == 3) {
                            $("#times_date").val("");
                            $("#times_month").val("");
                            var startTime = $("#times_start").val(); //开始时间
                            var endTime = $("#times_end").val(); //结束时间
                            start = (new Date(startTime)).getTime() / 1000;
                            end = (new Date(endTime)).getTime() / 1000;
                        }


                        var byDate = $("#times_date").val(); //日
                        var byMonth = $("#times_month").val(); //月
                        if (byDate) {
                            start = (new Date(byDate + " 00:00:00")).getTime() / 1000;
                            end = (new Date(byDate + " 23:59:59")).getTime() / 1000;
                        }
                        if (byMonth) {
                            var year = byMonth.split('/')[0];

                            var months = byMonth.split('/')[1];
                            var maxday = new Date(year, months, 0).getDate();
                            if (months == 1 || months == 3 || months == 5 || months == 7 || months == 8 || months == 10 || months == 12) {
                                start = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                                end = (new Date(byMonth + "/31" + " 23:59:59")).getTime() / 1000;
                            } else if (months == 2) {
                                start = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                                end = (new Date(byMonth + "/" + maxday + " 23:59:59")).getTime() / 1000;
                            } else {
                                start = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                                end = (new Date(byMonth + "/30" + " 23:59:59")).getTime() / 1000;
                            }
                        }

                        Service.getTradeList(options.cursor, options.limit, start, end, function(data) {
                            callback(data);
                            cloud.util.unmask("#trade_list_table");
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
        settime: function() {
            var self = this;
            if (countdown == 1) {
                $("#trade_list_table-table").find('td').each(function(index, item) {
                    if (index == 8) {
                        $(item).text(locale.get({
                            lang: "payment_timeout"
                        }));
                    }
                });
            } else {
                $("#trade_list_table-table").find('td').each(function(index, item) {
                    if (index == 8) {
                        $(item).text(locale.get({
                            lang: "trade_pay_status_0"
                        }) + "(" + countdown + ")");
                    }
                });
                countdown--;
                timer = setTimeout(function() {
                    self.settime();
                }, 1000)
            }
        },
        _renderNoticeBar: function() {
            var self = this;
            this.noticeBar = new NoticeBar({
                selector: "#trade_list_bar",
                events: {
                    query: function(start, end) { //查询
                        cloud.util.mask("#trade_list_table");
                        var pageDisplay = self.display;

                        if (start) {} else {
                            start = '';
                        }
                        if (end) {} else {
                            end = '';
                        }
                        Service.getTradeList(0, pageDisplay, start, end, function(data) {
                            var total = data.total;
                            this.totalCount = data.result.length;
                            data.total = total;
                            self.listTable.render(data.result);
                            self._renderpage(data, 1);
                            cloud.util.unmask("#trade_list_table");
                            window.clearInterval(timer);
                            if (data && data.result.length > 0) {
                                for (var i = 0; i < data.result.length; i++) {
                                    if (data.result[i].timer > 0) {
                                        //倒计时
                                        countdown = data.result[i].timer;
                                        self.settime();
                                    }
                                }
                            }
                        });
                    },

                    exports: function(payStyle, searchValue_assetId, searchValue_goodsName, searchValue_orderNo, searchValue_siteName, startTime, endTime, refundStatus, payStatus, userline, deliverStatus, machineType, refundStatus) { //导出
                        var len = $("#search-bar").find("a").length;
                        var id = $("#search-bar").find("a").eq(len - 1).attr("id");
                        $("#" + id).after("<span style='margin-left:6px;' id='bexport'>" + locale.get({
                            lang: "being_export"
                        }) + "</span>");
                        $("#" + id).hide();

                        var language = locale._getStorageLang() === "en" ? 1 : 2;
                        var host = cloud.config.FILE_SERVER_URL;
                        var reportName = "TradeReport.xlsx";
                        var uid = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
                        var userName = cloud.storage.sessionStorage("accountInfo").split(",")[2].split(":")[1];

                        var now = Date.parse(new Date()) / 1000;
                        var path = "/home/trade/" + now + "/" + reportName;
                        var url = host + "/api/vmreports/getTradeExcel?report_name=" + reportName + "&path=" + path + "&access_token=" + cloud.Ajax.getAccessToken();

                        Service.createTradeExcel(uid, userName, payStyle, searchValue_assetId, searchValue_goodsName, searchValue_orderNo, searchValue_siteName, startTime, endTime, refundStatus, payStatus, userline, deliverStatus, machineType, now, refundStatus, language, function(data) {
                            if (data.status == "doing" && data.operation == "export") {
                                dialog.render({
                                    lang: "export_large_task"
                                });
                            } else if (data.status == "failure" && data.operation == "export") {
                                dialog.render({
                                    lang: "export_large_task_exit"
                                });
                            } else {

                                var len = $("#search-bar").find("a").length;
                                var id = $("#search-bar").find("a").eq(len - 1).attr("id");
                                $("#" + id).html("");
                                if (document.getElementById("bexport") != undefined) {
                                    $("#bexport").show();
                                } else {
                                    $("#" + id).after("<span style='margin-left:6px;' id='bexport'>" + locale.get({
                                        lang: "being_export"
                                    }) + "</span>");
                                }
                                $("#" + id).hide();

                                var timer = setInterval(function() {

                                    Service.findTradeExcel(now, "trade.txt", function(data) {

                                        if (data.onlyResultDTO.result.res == "ok") {

                                            cloud.util.ensureToken(function() {
                                                window.open(url, "_self");
                                            });
                                            clearInterval(timer);
                                            $("#" + id).html("");
                                            if ($("#bexport")) {
                                                $("#bexport").hide();
                                            }
                                            $("#" + id).append("<span class='cloud-button-item cloud-button-text'>" + locale.get({
                                                lang: "role_e"
                                            }) + "</span>");
                                            $("#" + id).show();
                                        }
                                    })
                                }, 5000);
                            }
                        });
                    }
                }
            });
        }
    });

    return list;
});