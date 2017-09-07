define(function(require) {
    var cloud = require("cloud/base/cloud");
    var Button = require("cloud/components/button");
    var validator = require("cloud/components/validator");
    var html = require("text!./statistics.html");
    require("./css/default.css");
    require("cloud/components/chart");
    var TradeTable = require("./table/content");
    var Service = require("./service");
    var trade = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.elements = {
                head: {
                    id: "tradeHead",
                    "class": null
                },
                content: {
                    id: "tradeContent"
                },
                footer: {
                    id: "tradeFooter",
                    "class": null
                }
            };

            this.element.html(html);
            locale.render({
                element: this.element
            });
            this._render();
        },
        _render: function() {
            //this.getAssetIdOfLine();
            this.renderHtml();
            this.renderEvent();
            this.renderSelect();
            this.loadData();
            var height = localStorage.getItem("contentHeight");
            $("#trade").css("width", $(".container-bd").width());
            $("#tradeHead").css("width", $(".wrap").width());

            $("#trade").css("height", $("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());

            //$("#trade").css("height",(height - $(".main_hd").height() -35));
            $("#autoNum").append("<label style='margin-left: -5px;' id='trade_automatNo'>" + locale.get('trade_line_name') + "</label>" +
                "<input style='width:232px;margin-left: 5px;' type='text' id='line_autoName' placeholder='" + locale.get('more_line_query') + "'/>&nbsp;&nbsp;");
        },
        getAssetIdOfLine: function() {
            var self = this;
            Service.getAssetIdInfoByline(function(data) {
                var assetIdData = data;;
                self.renderHtml();
            });
        },
        renderHtml: function() {
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
            //		    if(assetIdData && assetIdData.result.length > 0){
            //			 	 for(var i =0;i<assetIdData.result.length;i++){
            //					 $("#assetId").append("<option value='" +i + "'>" +assetIdData.result[i].assetId+"</option>");
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
                        var lineName = $("#line_autoName").val();

                        //日报表
                        if (byDate) {
                            startTime = (new Date(byDate + " 00:00:00")).getTime() / 1000;
                            endTime = (new Date(byDate + " 23:59:59")).getTime() / 1000;
                            self.getEveryDay(startTime, endTime, lineName);
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
                            self.getEveryMonth(startTime, endTime, lineName);
                        }
                        //年报表
                        if (byYear) {
                            startTime = (new Date(byYear + "/01/01" + " 00:00:00")).getTime() / 1000;
                            endTime = (new Date(byYear + "/12/31" + " 23:59:59")).getTime() / 1000;
                            self.getEveryYear(startTime, endTime, lineName);
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
            var myDate = new Date();
            var full = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var date = full + "/" + month + "/" + day;
            var startTime = (new Date(date + " 00:00:00")).getTime() / 1000;
            var endTime = (new Date(date + " 23:59:59")).getTime() / 1000;
            this.getEveryDay(startTime, endTime, null);


        },
        rendTradeTable: function(data) {
            this.tradeTable = new TradeTable({
                selector: "#" + this.elements.content.id,
                data: data,
                //"container": "#tradeContent"
            });
        },
        getEveryDay: function(startTime, endTime, lineName) {
            //cloud.util.mask("#trade");
            var self = this;
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getLinesByUserId(userId, function(linedata) {
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
                Service.getLineDayStatistic(startTime, endTime, lineName, lineIds, function(data) {

                    if (data.result) {
                        var line = data.result[0].line;
                        var lineName = data.result[0].lineName;
                        var lineAmount = data.result[0].lineAmount;

                        if (lineName.length > 10) {
                            var newlineName = [];
                            for (var i = 0; i < lineName.length; i++) {
                                if (i > 9) {

                                } else {
                                    newlineName.push(lineName[i]);
                                }
                            }
                            lineName = newlineName;
                        }
                        if (lineAmount.length > 10) {
                            var newlineAmount = [];
                            for (var i = 0; i < lineAmount.length; i++) {
                                if (i > 9) {

                                } else {
                                    newlineAmount.push(lineAmount[i]);
                                }
                            }
                            lineAmount = newlineAmount;
                        }
                        self.renderPieChart(line);
                        self.renderbarChart(lineName, lineAmount);
                        self.rendTradeTable(data);
                        // cloud.util.unmask("#trade");

                    }
                });
            });

        },
        getEveryMonth: function(startTime, endTime, lineName) {
            //cloud.util.mask("#trade");
            var self = this;
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getLinesByUserId(userId, function(linedata) {
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
                Service.getLineMonthStatistic(startTime, endTime, lineName, lineIds, function(data) {
                    if (data.result) {
                        var line = data.result[0].line;
                        var lineName = data.result[0].lineName;
                        var lineAmount = data.result[0].lineAmount;

                        if (lineName.length > 10) {
                            var newlineName = [];
                            for (var i = 0; i < lineName.length; i++) {
                                if (i > 9) {

                                } else {
                                    newlineName.push(lineName[i]);
                                }
                            }
                            lineName = newlineName;
                        }
                        if (lineAmount.length > 10) {
                            var newlineAmount = [];
                            for (var i = 0; i < lineAmount.length; i++) {
                                if (i > 9) {

                                } else {
                                    newlineAmount.push(lineAmount[i]);
                                }
                            }
                            lineAmount = newlineAmount;
                        }
                        self.renderPieChart(line);
                        self.renderbarChart(lineName, lineAmount);
                        self.rendTradeTable(data);
                        // cloud.util.unmask("#trade");

                    }
                });
            });

        },
        getEveryYear: function(startTime, endTime, lineName) {
            //cloud.util.mask("#trade");
            var self = this;
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getLinesByUserId(userId, function(linedata) {
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
                Service.getLineYearStatistic(startTime, endTime, lineName, lineIds, function(data) {

                    if (data.result) {
                        var line = data.result[0].line;
                        var lineName = data.result[0].lineName;
                        var lineAmount = data.result[0].lineAmount;

                        if (lineName.length > 10) {
                            var newlineName = [];
                            for (var i = 0; i < lineName.length; i++) {
                                if (i > 9) {

                                } else {
                                    newlineName.push(lineName[i]);
                                }
                            }
                            lineName = newlineName;
                        }
                        if (lineAmount.length > 10) {
                            var newlineAmount = [];
                            for (var i = 0; i < lineAmount.length; i++) {
                                if (i > 9) {

                                } else {
                                    newlineAmount.push(lineAmount[i]);
                                }
                            }
                            lineAmount = newlineAmount;
                        }
                        self.renderPieChart(line);
                        self.renderbarChart(lineName, lineAmount);
                        self.rendTradeTable(data);
                        // cloud.util.unmask("#trade");
                    }

                });
            });

        },
        renderPieChart: function(data) {
            var result = data;
            $('#pie-content').highcharts({
                chart: {
                    type: 'pie',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    height: 420,
                    width: 500
                },
                title: {
                    text: locale.get("line_saleamount_list"),
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        size: '90%',
                        depth: 35,
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: locale.get("automat_percent"),
                    type: 'pie',
                    data: result
                }]
            });

        },
        renderbarChart: function(bar, type) {
            var result = type;
            var categorie = bar;
            $('#top-content').highcharts({
                chart: {
                    type: 'bar',
                    height: 420,
                    width: 520
                },
                title: {
                    text: locale.get("line_sale_list"),
                },
                navigator: {
                    enabled: false
                },
                rangeSelector: {
                    enabled: false
                },
                scrollbar: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    categories: categorie,
                    min: 0,
                    gridLineWidth: 0
                },
                yAxis: {
                    min: 0,
                    gridLineWidth: 0,
                    labels: {
                        enabled: false
                    },
                    title: {
                        text: ''
                    }
                },
                tooltip: {
                    shared: true,
                    valueSuffix: locale.get("times_1")
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        pointWidth: 15
                    }
                },
                legend: {
                    backgroundColor: '#FFFFFF',
                    reversed: true
                },
                series: [{
                    name: locale.get("sales"),
                    type: 'bar',
                    data: result
                }]
            });
        }
    });
    return trade;
});