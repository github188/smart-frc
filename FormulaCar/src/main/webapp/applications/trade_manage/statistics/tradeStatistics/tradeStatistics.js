define(function(require) {
    var cloud = require("cloud/base/cloud");
    var html = require("text!./tradeStatistics.html");
    var Button = require("cloud/components/button");
    var tradeCountBar = require("./tradeCountBar");
    var tradeAmountBar = require("./tradeAmountBar");
    var tradePayStylePie = require("./tradePayStylePie");
    var tradePayResultPie = require("./tradePayResultPie");
    var tradeCountAndAmount = require("./tradeCountAndAmount");
    var service = require("../service");
    require("../css/style.css");
    var statistics = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(html);
            this.service = new service();
            this.space = 1;
            this.elements = {
                time: {
                    id: "trade_statistics_time"
                },
                trade_bar: {
                    id: "trade_statistics_trade"
                },
                //				trade_pie : {
                //					id : "trade_statistics_pie"
                //				},
                trade_line: {
                    id: "trade_statistics_line"
                }
            };
            this.render();
        },
        render: function() {
            var height = localStorage.getItem("contentHeight");
            //$("#trade_statistics_all").css("height",(height - $(".main_hd").height() -28));
            $("#trade_statistics_all").css("width", $(".wrap").width() - 5);
            $("#statistics_bar").css("width", $(".wrap").width());

            $("#trade_statistics_all").css("height", $("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height() - 22);
            this.getAssetIdOfLine();
            this.renderEvent();
            this.renderSelect();
            cloud.util.mask("#trade_statistics_all");
            $("#searchNo").append("<label id='trade_automatNo'>" + locale.get('trade_automat_number') + "</label>" +
                "<input style='width:367px;margin-left: 5px;' type='text' id='trade_name' placeholder='" + locale.get('more_query') + "'/>&nbsp;&nbsp;");
            this.loadData();
        },
        getAssetIdOfLine: function() {
            var self = this;
            this.service.getAssetIdInfoByline(function(data) {
                var lineData = data;
                self.initTimeDiv();
            });
        },
        initTimeDiv: function() {
            //			var self = this;
            //			require(["cloud/lib/plugin/jquery.multiselect"],function(){
            //				$("#assetId").multiselect({ 
            //					header:true,
            //					checkAllText:locale.get({lang:"check_all"}),
            //					uncheckAllText:locale.get({lang:"uncheck_all"}),
            //					noneSelectedText:locale.get({lang:"trade_automat_number"}),
            //					selectedText:"# "+locale.get({lang:"is_selected"}),
            //					minWidth:170,
            //					height:120
            //				});
            //	        });
            //		    if(lineData && lineData.result.length > 0){
            //			 	 for(var i =0;i<lineData.result.length;i++){
            //					 $("#assetId").append("<option value='" +i + "'>" +lineData.result[i].assetId+"</option>");
            //				 }
            //			 }

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
        },
        loadData: function() {
            var myDate = new Date();
            var full = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var date = full + "/" + month + "/" + day;
            var startTime = (new Date(date + " 00:00:00")).getTime() / 1000;
            var endTime = (new Date(date + " 23:59:59")).getTime() / 1000;
            this.initTradeDayChart(startTime, endTime, null);
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
                        var startTime = '';
                        var endTime = '';

                        var selectedId = $("#reportType").find("option:selected").val();
                        if (selectedId == "1") {
                            var byDate = $("#summary_date").val(); //日
                        } else if (selectedId == "2") {
                            var byMonth = $("#summary_month").val(); //月
                        } else if (selectedId == "3") {
                            var byYear = $("#summary_year").val(); //年
                        }
                        var assetId = $("#trade_name").val();

                        //日报表
                        if (byDate) {
                            startTime = (new Date(byDate + " 00:00:00")).getTime() / 1000;
                            endTime = (new Date(byDate + " 23:59:59")).getTime() / 1000;
                            self.initTradeDayChart(startTime, endTime, assetId);
                        }
                        //月报表
                        if (byMonth) {
                            var year = byMonth.split('/')[0];

                            var months = byMonth.split('/')[1];
                            var maxday = new Date(year, months, 0).getDate();
                            if (months == 1 || months == 3 || months == 5 || months == 7 || months == 8 || months == 10 || months == 12) {
                                startTime = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                                endTime = (new Date(byMonth + "/31" + " 23:59:59")).getTime() / 1000;
                            } else if (months == 2) {
                                startTime = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                                endTime = (new Date(byMonth + "/" + maxday + " 23:59:59")).getTime() / 1000;
                            } else {
                                startTime = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                                endTime = (new Date(byMonth + "/30" + " 23:59:59")).getTime() / 1000;
                            }
                            self.initTradeMonthChart(startTime, endTime, assetId);
                        }
                        //年报表
                        if (byYear) {
                            startTime = (new Date(byYear + "/01/01" + " 00:00:00")).getTime() / 1000;
                            endTime = (new Date(byYear + "/12/31" + " 23:59:59")).getTime() / 1000;
                            self.initTradeYearChart(startTime, endTime, assetId);
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
        initTradeDayChart: function(startTime, endTime, assetId) {
            cloud.util.mask("#trade_statistics_all");
            var self = this;
            var xAxis = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

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
                self.service.getStatisticDay(startTime, endTime, assetId, lineIds, function(data) {
                    self.initDataToChartData(data.result, xAxis, 24);
                    cloud.util.unmask("#trade_statistics_all");
                }, self);


            });
        },
        initTradeMonthChart: function(startTime, endTime, assetId) {
            var self = this;
            var xAxis = new Array();
            xAxis = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"];

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
                var datas = new Date(startTime * 1000);
                var years = datas.getFullYear();
                var months = datas.getMonth();
                var maxday = new Date(years, months + 1, 0).getDate();
                if (roleType != 51 && lineIds.length == 0) {
                    lineIds = ["000000000000000000000000"];
                }
                self.lineIds = lineIds;

                self.service.getStatisticMonth(startTime, endTime, assetId, lineIds, function(data) {
                    if (data.result.length == 29) {
                        xAxis[28] = "29";
                    }
                    if (data.result.length == 30) {
                        xAxis[28] = "29";
                        xAxis[29] = "30";
                    }
                    if (data.result.length == 31) {
                        xAxis[28] = "29";
                        xAxis[29] = "30";
                        xAxis[30] = "31";
                    }
                    self.initDataToChartData(data.result, xAxis, data.result.length);
                    cloud.util.unmask("#trade_statistics_all");
                }, self);

            });
        },
        initTradeYearChart: function(startTime, endTime, assetId) {
            var self = this;
            var xAxis = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
                self.service.getStatisticYear(startTime, endTime, assetId, lineIds, function(data) {
                    self.initDataToChartData(data.result, xAxis, data.result.length);
                    cloud.util.unmask("#trade_statistics_all");
                }, self);

            });

        },
        initDataToChartData: function(data, xAxisData, length) {
            this.tradeCountArr = {
                xAxis: xAxisData,
                ydata: []
            };
            this.tradeAmountArr = {
                xAxis: xAxisData,
                ydata: []
            };
            this.countAndAmountArr = {
                xAxis: xAxisData,
                ydata1: [],
                ydata2: []
            };
            var alipayAmount = 0;
            var wechatAmount = 0;
            var baifubaoAmount = 0;
            var otherAmount = 0;
            var amount = 0;
            for (var i = 0; i < length; i++) {
                if (data[i] != null) {
                    this.tradeCountArr.ydata[i] = data[i].sum;
                    this.tradeAmountArr.ydata[i] = data[i].amount / 100;
                    amount = amount + data[i].amount / 100;
                    this.countAndAmountArr.ydata1[i] = data[i].sum;
                    this.countAndAmountArr.ydata2[i] = data[i].amount / 100;
                    if (data[i].alipayAmount != null) {
                        alipayAmount = alipayAmount + data[i].alipayAmount / 100;
                    }
                    if (data[i].wechatAmount != null) {
                        wechatAmount = wechatAmount + data[i].wechatAmount / 100;
                    }
                    if (data[i].baifubaoAmount != null) {
                        baifubaoAmount = baifubaoAmount + data[i].baifubaoAmount / 100;
                    }
                    if (data[i].otherAmount != null) {
                        otherAmount = otherAmount + data[i].otherAmount / 100;
                    }
                } else {
                    this.tradeCountArr.ydata[i] = 0;
                    this.tradeAmountArr.ydata[i] = 0;
                    this.countAndAmountArr.ydata1[i] = 0;
                    this.countAndAmountArr.ydata2[i] = 0;
                }
            }
            this.payStyleAmountArr = new Array;
            var alipayPercent = alipayAmount / amount;
            var wechatPercent = wechatAmount / amount;
            var baifubaoPercent = baifubaoAmount / amount;
            var otherPercent = otherAmount / amount;
            this.payStyleAmountArr = [{
                name: locale.get({
                    lang: 'automat_alipay'
                }),
                y: alipayPercent,
                sliced: false,
                selected: false
            }, {
                name: locale.get({
                    lang: 'automat_wx_pay'
                }),
                y: wechatPercent,
                sliced: true,
                selected: true
            }, {
                name: locale.get({
                    lang: 'automat_baifubao'
                }),
                y: baifubaoPercent,
                sliced: false,
                selected: false
            }, {
                name: locale.get({
                    lang: 'automat_other'
                }),
                y: otherPercent,
                sliced: false,
                selected: false
            }];
            if (amount == 0) {
                this.payStyleAmountArr = [{
                    name: locale.get({
                        lang: 'no_data'
                    }),
                    y: 1,
                    sliced: false,
                    selected: false
                }]
            }
            this.fillChartData();
        },
        fillChartData: function() {
            var self = this;
            self.fillTradeCountData();
            self.fillTradeAmountData();
            //			self.fillPayStylePieData();
            self.fillTradeCountAndAmountData();
        },
        fillTradeCountData: function() {
            var self = this;
            if (this.tradeCountChart) {
                this.tradeCountChart.setData(self.tradeCountArr);
            } else {
                this.tradeCountChart = new tradeCountBar({
                    "container": "#trade_statistics_count",
                    "data": self.tradeCountArr,
                    events: {
                        "refreshDay": function() {
                            self.initTradeDayChart();
                            self.tradeCountChart.setData(self.tradeCountArr);
                        },
                        "refreshMonth": function(data) {
                            self.initTradeMonthChart();
                            self.tradeCountChart.setData(self.tradeCountArr);
                        },
                        "refreshYear": function(data) {
                            self.initTradeYearChart();
                            self.tradeCountChart.setData(self.tradeCountArr);
                        }
                    }
                });
            }
        },
        fillTradeAmountData: function() {
            var self = this;
            if (this.tradeAmountChart) {
                this.tradeAmountChart.setData(self.tradeAmountArr);
            } else {
                this.tradeAmountChart = new tradeAmountBar({
                    "container": "#trade_statistics_money",
                    "data": self.tradeAmountArr,
                    events: {
                        "refreshDay": function() {
                            self.initTradeDayChart();
                            self.tradeAmountChart.setData(self.tradeAmountArr);
                        },
                        "refreshMonth": function(data) {
                            self.initTradeMonthChart();
                            self.tradeAmountChart.setData(self.tradeAmountArr);
                        },
                        "refreshYear": function(data) {
                            self.initTradeYearChart();
                            self.tradeAmountChart.setData(self.tradeAmountArr);
                        }
                    }
                });
            }
        },
        //		fillPayStylePieData:function(){
        //			var self = this;
        //			if(this.tradePayStylePie){
        //				this.tradePayStylePie.setData(self.payStyleAmountArr);
        //			}else{
        //				this.tradePayStylePie = new tradePayStylePie({
        //					"container":"#trade_statistics_pay_style",
        //					"data":self.payStyleAmountArr,
        //					 events:{
        //						"refreshDay":function(){
        //							self.initTradeDayChart();
        //							self.tradePayStylePie.setData(self.payStyleAmountArr);
        //						},
        //						"refreshMonth":function(data){
        //							self.initTradeMonthChart();
        //							self.tradePayStylePie.setData(self.payStyleAmountArr);
        //						}
        //						,
        //						"refreshYear":function(data){
        //							self.initTradeYearChart();
        //							self.tradePayStylePie.setData(self.payStyleAmountArr);
        //						}
        //					}
        //				});
        //			}
        //		},
        fillPayResultPieData: function() {
            var self = this;
            $("#trade_statistics_pay_status").html("");
            this.tradePayResultPie = new tradePayResultPie({
                "container": "#trade_statistics_pay_status",
                "space": self.space,
                events: {
                    "refreshDay": function() {},
                    "refreshMonth": function(data) {},
                    "refreshYear": function(data) {}
                }
            });
        },
        fillTradeCountAndAmountData: function() {
            var self = this;
            if (this.tradeCountAndAmount) {
                this.tradeCountAndAmount.setData(self.countAndAmountArr);
            } else {
                this.tradeCountAndAmount = new tradeCountAndAmount({
                    "container": "#trade_statistics_line",
                    "data": self.countAndAmountArr,
                    events: {
                        "refreshDay": function() {
                            self.initTradeDayChart();
                            self.tradeCountAndAmount.setData(self.countAndAmountArr);
                        },
                        "refreshMonth": function(data) {
                            self.initTradeMonthChart();
                            self.tradeCountAndAmount.setData(self.countAndAmountArr);
                        },
                        "refreshYear": function(data) {
                            self.initTradeYearChart();
                            self.tradeCountAndAmount.setData(self.countAndAmountArr);
                        }
                    }
                });
            }
        }
    });
    return statistics;
});