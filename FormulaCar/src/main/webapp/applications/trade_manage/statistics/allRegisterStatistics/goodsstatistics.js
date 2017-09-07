define(function(require) {
    var cloud = require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    var html = require("text!./goodsstatistics.html");
    var Button = require("cloud/components/button");
    var goodsCountChart = require("./goodsCount");
    var goodsAmountChart = require("./goodsAmount");
    var goodsTypeCountChart = require("./goodsTypeCount");
    var goodsTypeAmountChart = require("./goodsTypeAmount");
    var goodsTypeTable = require("./table/type/content");
    var goodsTable = require("./table/goods/content");
    var service = require("../service");
    require("../css/style.css");
    var statistics = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(html);
            locale.render(this.element);
            this.space = 1;
            this.ct = 1;
            this.service = new service();
            this.elements = {
                time: {
                    id: "goods_statistics_time"
                },
                trade_bar: {
                    id: "goods_statistics_all"
                }
            };

            this.render();
        },
        render: function() {
            this.initTimeDiv();
            cloud.util.mask("#good_statistics");
            var height = localStorage.getItem("contentHeight");
            $("#good_statistics").css("width", $(".wrap").width());
            $("#goods_statistics_time").css("width", $(".wrap").width());

            $("#good_statistics").css("height", $("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height() - 10);

            //$("#good_statistics").css("height",(height - $(".main_hd").height() -35));
            this.renderEvent();
            this.renderSelect();
            this.loadData();

        },
        initTimeDiv: function() {
            var self = this;
            $("#reportType").append("<option value='1' selected='selected'>" + locale.get({
                lang: "daily_chart"
            }) + "</option>");
            if (!(localStorage.getItem("language") == "en")) {
                $("#reportType").append("<option value='2'>" + locale.get({
                    lang: "monthly_report"
                }) + "</option>");
                $("#reportType").append("<option value='3'>" + locale.get({
                    lang: "year_report"
                }) + "</option>");
            }
            $("#summary_month").css("display", "none");
            $("#summary_year").css("display", "none");
            $("#summary_month").val("");
            $("#summary_year").val("");

            $("#goods_statistics_tabs").tabs();
            $("#tabs-type-statistics").click(function() {
                $("#goods_type_statistics_detail_table").html("");
                self.ct = 2;
                this.goodsTypeTable = new goodsTypeTable({
                    "container": "#goods_type_statistics_detail_table",
                    time: self.time,
                    type: self.type
                });
                $("#goods_type_statistics_detail_table").css("height", $("#goods_type_sta_list_table-table").height() + $("#goods_type_sta_list_paging").height());


            });
            $("#tabs-goods-statistics").click(function() {
                $("#goods_statistics_detail_table").html("");
                self.ct = 1;
                this.goodsTable = new goodsTable({
                    "container": "#goods_statistics_detail_table",
                    time: self.time,
                    type: self.type
                });
                $("#goods_statistics_detail_table").css("height", $("#goods_sta_list_table-table").height() + $("#goods_sta_list_paging").height());

                //$("#goods_statistics_detail_table").css("height",$("#goods_sta_list_table-table").height()+$("#goods_sta_list_paging").height());
            });
            //$("#goods_statistics_detail_table").css("height",10+$("#goods_sta_list_table-table").height()+$(".paging-page-box").height());
        },
        renderEvent: function() {
            var self = this;
            $("#reportType").bind('change', function() {
                var selectedId = $("#reportType").find("option:selected").val();
                if (selectedId == "1") {
                    $("#summary_month").css("display", "none");
                    $("#summary_year").css("display", "none");
                    $("#summary_date").css("display", "block");
                    $("#summary_year").val("");
                    $("#summary_month").val("");
                    $("#summary_date").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM/dd"));
                } else if (selectedId == "2") {
                    $("#summary_date").css("display", "none");
                    $("#summary_year").css("display", "none");
                    $("#summary_month").css("display", "block");
                    $("#summary_date").val("");
                    $("#summary_year").val("");
                    $("#summary_month").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM"));
                } else if (selectedId == "3") {
                    $("#summary_date").css("display", "none");
                    $("#summary_month").css("display", "none");
                    $("#summary_year").css("display", "block");
                    $("#summary_date").val("");
                    $("#summary_month").val("");
                }
            });
            //查询
            var queryBtn = new Button({
                text: locale.get({
                    lang: "query"
                }),
                container: $("#buttonDiv"),
                events: {
                    click: function() {
                        var byDate = "";
                        var byMonth = "";
                        var byYear = "";
                        var time = '';

                        var selectedId = $("#reportType").find("option:selected").val();
                        if (selectedId == "1") {
                            var byDate = $("#summary_date").val(); //日
                        } else if (selectedId == "2") {
                            var byMonth = $("#summary_month").val(); //月
                        } else if (selectedId == "3") {
                            var byYear = $("#summary_year").val(); //年
                        }
                        cloud.util.mask("#good_statistics");
                        //日报表
                        if (byDate) {
                            time = (new Date(byDate + " 00:00:00")).getTime() / 1000;
                            self.initStaDayChart(time);
                        }
                        //月报表
                        if (byMonth) {
                            var months = byMonth.split('/')[1];
                            if (months == 1 || months == 3 || months == 5 || months == 7 || months == 8 || months == 10 || months == 12) {
                                time = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                            } else if (months == 2) {
                                time = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                            } else {
                                time = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                            }
                            self.initStaMonthChart(time);
                        }
                        //年报表
                        if (byYear) {
                            time = (new Date(byYear + "/01/01" + " 00:00:00")).getTime() / 1000;
                            self.initStaYearChart(time);
                        }
                    }
                }
            });
            $("#" + queryBtn.id).addClass("readClass");
        },
        renderSelect: function() {
            $(function() {
                $("#summary_date").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM/dd")).datetimepicker({
                    format: 'Y/m/d',
                    step: 1,
                    startDate: '-1970/01/08',
                    lang: locale.current() === 1 ? "en" : "ch",
                    timepicker: false,
                    onShow: function() {
                        $(".xdsoft_calendar").show();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    },
                    onClose: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    },
                })

                $("#summary_month").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM")).datetimepicker({
                    timepicker: false,
                    format: 'Y/m',
                    onShow: function() {
                        $(".xdsoft_calendar").hide();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM"));
                    },
                    onClose: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM"));
                    },
                    lang: locale.current() === 1 ? "en" : "ch"
                })
            });
        },
        loadData: function() {
            var self = this;
            var myDate = new Date();
            var full = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var date = full + "/" + month + "/" + day;
            var time = (new Date(date + " 00:00:00")).getTime() / 1000;
            self.initStaDayChart(time);
        },
        initStaDayChart: function(time) {
            var self = this;
            var xAxis = new Array();
            var top = 10;
            var type = 1;

            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            self.service.getLinesByUserId(userId, function(linedata) {
                var lineIds = [];
                if (linedata && linedata.result && linedata.result.length > 0) {
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

                self.service.getGoodsStatistic(type, top, time, lineIds, function(data1) {
                    self.service.getGoodsTypeStatistic(type, top, time, lineIds, function(data2) {
                        self.initDataToChartData(data1.result, 1);
                        self.initDataToChartData(data2.result, 2);
                        cloud.util.unmask("#good_statistics");
                    }, self);
                }, self);

                self.initTable(time, type);
            });
        },
        initStaMonthChart: function(time) {
            var self = this;
            var xAxis = new Array();
            var top = 10;
            var type = 2;
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            self.service.getLinesByUserId(userId, function(linedata) {
                var lineIds = [];
                if (linedata && linedata.result && linedata.result.length > 0) {
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

                self.service.getGoodsStatistic(type, top, time, lineIds, function(data1) {
                    self.service.getGoodsTypeStatistic(type, top, time, lineIds, function(data2) {
                        self.initDataToChartData(data1.result, 1);
                        self.initDataToChartData(data2.result, 2);
                        cloud.util.unmask("#good_statistics");
                    }, self);
                }, self);

                self.initTable(time, type);
            });
        },
        initStaYearChart: function(time) {
            var self = this;
            var xAxis = new Array();
            var top = 10;
            var type = 3;

            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            self.service.getLinesByUserId(userId, function(linedata) {
                var lineIds = [];
                if (linedata && linedata.result && linedata.result.length > 0) {
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

                self.service.getGoodsStatistic(type, top, time, lineIds, function(data1) {
                    self.service.getGoodsTypeStatistic(type, top, time, lineIds, function(data2) {
                        self.initDataToChartData(data1.result, 1);
                        self.initDataToChartData(data2.result, 2);
                        cloud.util.unmask("#good_statistics");
                    }, self);
                }, self);

                self.initTable(time, type);
            });
        },
        initDataToChartData: function(data, type) {
            this.goodsCountArr = {
                xAxis: ["", "", "", "", "", "", "", "", "", ""],
                ydata: [null, null, null, null, null, null, null, null, null, null]
            }
            this.goodsAmountArr = {
                xAxis: ["", "", "", "", "", "", "", "", "", ""],
                ydata: [null, null, null, null, null, null, null, null, null, null]
            }
            this.goodsTypeCountArr = {
                xAxis: ["", "", "", "", "", "", "", "", "", ""],
                ydata: [null, null, null, null, null, null, null, null, null, null]
            }
            this.goodsTypeAmountArr = {
                xAxis: ["", "", "", "", "", "", "", "", "", ""],
                ydata: [null, null, null, null, null, null, null, null, null, null]
            }
            if (data.amount && data.amount.length > 0) {
                for (var i = 0; i < data.amount.length; i++) {
                    if (type == 1) {
                        var names = "";
                        if (data.amount[i].goodsName.length <= 10) { //返回中文的个数 小于10个汉字
                            names = data.amount[i].goodsName;
                        } else {
                            names = data.amount[i].goodsName.substring(0, 10) + "...";
                        }
                        this.goodsAmountArr.xAxis[i] = names;
                        this.goodsAmountArr.ydata[i] = data.amount[i].amount / 100;
                    }
                    if (type == 2) {
                        this.goodsTypeAmountArr.xAxis[i] = data.amount[i].goodsTypeName;
                        this.goodsTypeAmountArr.ydata[i] = data.amount[i].amount / 100;
                    }
                    if (type == 1 && i == data.amount.length - 1) {
                        var j = i + 1;
                        if (j < 10) {
                            for (j = i + 1; j < 10; j++) {
                                this.goodsAmountArr.xAxis[j] = "";
                                this.goodsAmountArr.ydata[j] = null;
                                if (j == 9) {
                                    this.fillGoodsAmountData();
                                }
                            }
                        } else {
                            this.fillGoodsAmountData();
                        }
                    }
                    if (type == 2 && i == data.amount.length - 1) {
                        var j = i + 1;
                        if (j < 10) {
                            for (j = i + 1; j < 10; j++) {
                                this.goodsTypeAmountArr.xAxis[j] = "";
                                this.goodsTypeAmountArr.ydata[j] = null;
                                if (j == 9) {
                                    this.fillGoodsTypeAmountData();
                                }
                            }
                        } else {
                            this.fillGoodsTypeAmountData();
                        }

                    }
                }
            } else {
                if (type == 1) {
                    this.fillGoodsAmountData();
                }
                if (type == 2) {
                    this.fillGoodsTypeAmountData();
                }
            }


            if (data.count && data.count.length > 0) {
                for (var i = 0; i < data.count.length; i++) {
                    if (type == 1) {

                        var names = "";
                        if (data.count[i].goodsName.length <= 10) { //返回中文的个数 小于10个汉字
                            names = data.count[i].goodsName;
                        } else {
                            names = data.count[i].goodsName.substring(0, 10) + "...";
                        }
                        this.goodsCountArr.xAxis[i] = names;
                        this.goodsCountArr.ydata[i] = data.count[i].sum;
                    }
                    if (type == 2) {
                        this.goodsTypeCountArr.xAxis[i] = data.count[i].goodsTypeName;
                        this.goodsTypeCountArr.ydata[i] = data.count[i].sum;
                    }
                    if (type == 1 && i == data.count.length - 1) {
                        var j = i + 1;
                        if (j < 10) {
                            for (j = i + 1; j < 10; j++) {
                                this.goodsCountArr.xAxis[j] = "";
                                this.goodsCountArr.ydata[j] = null;
                                if (j == 9) {
                                    this.fillGoodsCountData();
                                }
                            }
                        } else {
                            this.fillGoodsCountData();
                        }
                    }
                    if (type == 2 && i == data.count.length - 1) {
                        var j = i + 1;
                        if (j < 10) {
                            for (j = i + 1; j < 10; j++) {
                                this.goodsTypeCountArr.xAxis[j] = "";
                                this.goodsTypeCountArr.ydata[j] = null;
                                if (j == 9) {
                                    this.fillGoodsTypeCountData();
                                }
                            }
                        } else {
                            this.fillGoodsTypeCountData();
                        }

                    }
                }
            } else {
                if (type == 1) {
                    this.fillGoodsCountData();
                }
                if (type == 2) {
                    this.fillGoodsTypeCountData();
                }
            }

        },
        fillChartData: function() {
            var self = this;
            self.fillGoodsCountData();
            self.fillGoodsAmountData();
            self.fillGoodsTypeCountData();
            self.fillGoodsTypeAmountData();
        },
        fillGoodsCountData: function() {
            var self = this;
            if (this.goodsCountChart) {
                this.goodsCountChart.setData(self.goodsCountArr);
            } else {
                this.goodsCountChart = new goodsCountChart({
                    "container": "#goods_statistics_count",
                    "data": self.goodsCountArr,
                    events: {
                        "refreshDay": function() {
                            self.initStaDayChart();
                            self.goodsCountChart.setData(self.goodsCountArr);
                        },
                        "refreshMonth": function(data) {
                            self.initStaMonthChart();
                            self.goodsCountChart.setData(self.goodsCountArr);
                        },
                        "refreshYear": function(data) {
                            self.initStaYearChart();
                            self.goodsCountChart.setData(self.goodsCountArr);
                        }
                    }
                });
            }
        },
        fillGoodsAmountData: function() {
            var self = this;
            if (this.goodsAmountChart) {
                this.goodsAmountChart.setData(self.goodsAmountArr);
            } else {
                this.goodsAmountChart = new goodsAmountChart({
                    "container": "#goods_statistics_money",
                    "data": self.goodsAmountArr,
                    events: {
                        "refreshDay": function() {
                            self.initStaDayChart();
                            self.goodsAmountChart.setData(self.goodsAmountArr);
                        },
                        "refreshMonth": function(data) {
                            self.initStaMonthChart();
                            self.goodsAmountChart.setData(self.goodsAmountArr);
                        },
                        "refreshYear": function(data) {
                            self.initStaYearChart();
                            self.goodsAmountChart.setData(self.goodsAmountArr);
                        }
                    }
                });
            }
        },
        fillGoodsTypeCountData: function() {
            var self = this;
            if (this.goodsTypeCountChart) {
                this.goodsTypeCountChart.setData(self.goodsTypeCountArr);
            } else {
                this.goodsTypeCountChart = new goodsTypeCountChart({
                    "container": "#type_statistics_count",
                    "data": self.goodsTypeCountArr,
                    events: {
                        "refreshDay": function() {
                            self.initStaDayChart();
                            self.goodsTypeCountChart.setData(self.goodsTypeCountArr);
                        },
                        "refreshMonth": function(data) {
                            self.initStaMonthChart();
                            self.goodsTypeCountChart.setData(self.goodsTypeCountArr);
                        },
                        "refreshYear": function(data) {
                            self.initStaYearChart();
                            self.goodsTypeCountChart.setData(self.goodsTypeCountArr);
                        }
                    }
                });
            }
        },
        fillGoodsTypeAmountData: function() {
            var self = this;
            if (this.goodsTypeAmountChart) {
                this.goodsTypeAmountChart.setData(self.goodsTypeAmountArr);
            } else {
                this.goodsTypeAmountChart = new goodsTypeAmountChart({
                    "container": "#type_statistics_money",
                    "data": self.goodsTypeAmountArr,
                    events: {
                        "refreshDay": function() {
                            self.initStaDayChart();
                            self.goodsTypeAmountChart.setData(self.goodsTypeAmountArr);
                        },
                        "refreshMonth": function(data) {
                            self.initStaMonthChart();
                            self.goodsTypeAmountChart.setData(self.goodsTypeAmountArr);
                        },
                        "refreshYear": function(data) {
                            self.initStaYearChart();
                            self.goodsTypeAmountChart.setData(self.goodsTypeAmountArr);
                        }
                    }
                });
            }
        },
        initTable: function(time, type) {
            var self = this;
            $("#goods_statistics_detail_table").html("");
            $("#goods_type_statistics_detail_table").html("");
            self.time = time;
            self.type = type;

            if (self.ct == 1) {
                this.goodsTable = new goodsTable({
                    "container": "#goods_statistics_detail_table",
                    time: time,
                    type: type
                });
                $("#goods_statistics_detail_table").css("height", $("#goods_sta_list_table-table").height() + $("#goods_sta_list_paging").height());

            } else if (self.ct == 2) {
                this.goodsTypeTable = new goodsTypeTable({
                    "container": "#goods_type_statistics_detail_table",
                    time: self.time,
                    type: self.type
                });
                $("#goods_type_statistics_detail_table").css("height", $("#goods_type_sta_list_table-table").height() + $("#goods_type_sta_list_paging").height());
            }

        }
    });
    return statistics;
});