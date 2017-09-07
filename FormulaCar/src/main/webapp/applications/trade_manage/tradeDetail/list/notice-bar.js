define(function(require) {
    var cloud = require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/resources/css/jquery.multiselect.css");
    var Service = require("../../service");
    var Button = require("cloud/components/button");
    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this._render();
        },
        _render: function() {
            this.draw();
        },
        draw: function() {
            var self = this;

            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getLinesByUserId(userId, function(line) {
                if (line && line.result) {
                    var lineData = line;
                    Service.getGoodsTypeInfo(function(data) {
                        self._renderForm(lineData, data);
                    });
                } else {
                    var searchData = {

                    };

                    if (roleType != 51) {
                        searchData.lineId = ["000000000000000000000000"];
                    }
                    Service.getAllLine(searchData, -1, 0, function(datas) {
                        var lineData = datas;
                        Service.getGoodsTypeInfo(function(data) {
                            self._renderForm(lineData, data);
                        });
                    });
                }
            });
        },
        _renderForm: function(lineData, goodTypeData) {
            var self = this;
            var htmlmo;
            if (!(localStorage.getItem("language") == "en")) {
                htmlmo = "<option value='2'>" + locale.get({
                    lang: "monthly_report"
                }) + "</option>";
            }
            var $htmls = $(+"<div></div>" +
                "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
                "<ul>" +
                "<li>" +
                "<select id='reportType'  name='reportType' style='width:130px;height: 28px;'>" +
                "<option value='0'>" + locale.get({
                    lang: "time"
                }) + "</option>" +
                "<option value='1' selected = 'selected'>" + locale.get({
                    lang: "daily_chart"
                }) + "</option>" +
                htmlmo +
                "<option value='3'>" + locale.get({
                    lang: "custom_report"
                }) + "</option>" +
                "</select>&nbsp;&nbsp;" +
                "</li>" +
                "<li style ='margin-left: -5px;' id='dateTime'>" +
                "<input style='width:120px;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='times_date' />&nbsp;&nbsp;" +
                "</li>" +
                "<li style='display:none;margin-left: -5px;' id='dateMonth'>" +
                "<input style='width:120px;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='times_month'/>&nbsp;&nbsp;" +
                "</li>" +
                "<li style='display:none;margin-left: -5px;' id='startTime'>" +
                "<input style='width:120px;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='times_start' />&nbsp;&nbsp;" +
                "</li>" +
                "<li style='display:none;margin-left: -5px;' id='endTime'>" +
                "<input style='width:120px;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='times_end' />&nbsp;&nbsp;" +
                "</li>" +
                "</ul>" +
                "<ul style='clear:both;padding: 5px 0;'>" +
                "<li>" +
                "<input style='width:160px;' type='text' placeholder='" + locale.get('automatNo_Name') + "'  id='searchValue_assetId' />&nbsp;&nbsp;" +
                "</li>" +
                "<li style ='margin-left: -5px;'>" +
                "<input style='width:125px;' type='text' placeholder='" + locale.get('car_id') + "'  id='searchValue_orderNo' />&nbsp;&nbsp;" +
                "</li>" +
                "<li style ='margin-left: -5px;'>" +
                "<select  id='userline'  multiple='multiple'  style='width:180px;height: 28px;'></select>&nbsp;&nbsp;" + //线路
                "</li>" +
                "<li style ='margin-left: -5px;'>" +
                "<input style='width:126px;' type='text' placeholder='" + locale.get('automat_name_of_commodity') + "'  id='searchValue_goodsName' />&nbsp;&nbsp;" +
                "</li>" +
                "<li style ='margin-left: -5px; margin-right: 5px;'>" +
                "<input style='width:126px;' type='text' placeholder='" + locale.get('site_name') + "'  id='searchValue_siteName' />&nbsp;&nbsp;" +
                "</li >" +
                "<li id='buttonDiv' style='margin-left: -10px;'></li>" +
                "</ul>" +
                "</div>");
            this.element.append($htmls);
            require(["cloud/lib/plugin/jquery.multiselect"], function() {
                $("#payStyle").multiselect({
                    header: true,
                    checkAllText: locale.get({
                        lang: "check_all"
                    }),
                    uncheckAllText: locale.get({
                        lang: "uncheck_all"
                    }),
                    noneSelectedText: locale.get({
                        lang: "all_payment_types"
                    }),
                    selectedText: "# " + locale.get({
                        lang: "is_selected"
                    }),
                    minWidth: 180,
                    height: 120
                });
                $("#userline").multiselect({
                    header: true,
                    checkAllText: locale.get({
                        lang: "check_all"
                    }),
                    uncheckAllText: locale.get({
                        lang: "uncheck_all"
                    }),
                    noneSelectedText: locale.get({
                        lang: "automat_line"
                    }),
                    selectedText: "# " + locale.get({
                        lang: "is_selected"
                    }),
                    minWidth: 180,
                    height: 120
                });
            });
            if (lineData && lineData.result.length > 0) {
                for (var i = 0; i < lineData.result.length; i++) {
                    $("#userline").append("<option value='" + lineData.result[i]._id + "'>" + lineData.result[i].name + "</option>");
                }
            }
            //            $("#dateTime").css("display", "none");
            $("#dateMonth").css("display", "none");
            $("#startTime").css("display", "none");
            $("#endTime").css("display", "none");
            $("#search-bar ul li").css("float", "left");
            this._renderBar();
            this._renderSelect();
            this._renderBtn();
        },
        _renderBar: function() {
            var self = this;
            $("#reportType").bind('change', function() {
                var selectedId = $("#reportType").find("option:selected").val();
                if (selectedId == "0") {
                    $("#dateTime").css("display", "none");
                    $("#dateMonth").css("display", "none");
                    $("#startTime").css("display", "none");
                    $("#endTime").css("display", "none");
                } else if (selectedId == "1") {
                    $("#dateTime").css("display", "block");
                    $("#dateMonth").css("display", "none");
                    $("#startTime").css("display", "none");
                    $("#endTime").css("display", "none");
                    $("#times_month").val("");
                    $("#times_date").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM/dd"));
                } else if (selectedId == "2") {
                    $("#dateTime").css("display", "none");
                    $("#dateMonth").css("display", "block");
                    $("#startTime").css("display", "none");
                    $("#endTime").css("display", "none");
                    $("#times_date").val("");
                    $("#times_month").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM"));
                } else if (selectedId == "3") {
                    $("#dateTime").css("display", "none");
                    $("#dateMonth").css("display", "none");
                    $("#startTime").css("display", "block");
                    $("#endTime").css("display", "block");
                    $("#times_date").val("");
                    $("#times_month").val("");
                    //$("#times_start").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000 - (1 * 30 * 24 * 60 * 60)), "yyyy/MM/dd hh:mm"));
                    // $("#times_end").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM/dd hh:mm"));
                }
            });
        },
        _renderSelect: function() {
            $(function() {

                $("#times_date").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM/dd")).datetimepicker({
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
                    }
                });

                $("#times_month").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM")).datetimepicker({
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
                });
                $("#times_start").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000 - (1 * 30 * 24 * 60 * 60)), "yyyy/MM/dd") + " 00:00").datetimepicker({
                    format: 'Y/m/d H:i',
                    step: 1,
                    startDate: '-1970/01/08',
                    lang: locale.current() === 1 ? "en" : "ch",
                    timepicker: true,
                    onShow: function() {
                        // $(".xdsoft_calendar").hide();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM hh:mm"));
                    },
                    onClose: function(a, b) {
                        var date = new Date(new Date($("#times_start").val()).getTime() / 1000);
                        //b.val(cloud.util.dateFormat(date, "yyyy/MM hh:mm"));
                    }
                });
                $("#times_end").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM/dd") + " 23:59").datetimepicker({
                    format: 'Y/m/d H:i',
                    step: 1,
                    startDate: '-1970/01/08',
                    lang: locale.current() === 1 ? "en" : "ch",
                    timepicker: true,
                    onShow: function() {
                        // $(".xdsoft_calendar").hide();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM hh:mm"));
                    },
                    onClose: function(a, b) {
                        var date = new Date(new Date($("#times_end").val()).getTime() / 1000);
                        // b.val(cloud.util.dateFormat(date, "yyyy/MM hh:mm"));
                    }
                });
            });
        },
        _renderBtn: function() {
            var self = this;
            //查询

            var queryBtn = new Button({
                text: locale.get({
                    lang: "query"
                }),
                container: $("#buttonDiv"),
                events: {
                    click: function() {
                        var searchValue_assetId = $("#searchValue_assetId").val();
                        var searchValue_siteName = $("#searchValue_siteName").val();
                        var searchValue_goodsName = $("#searchValue_goodsName").val();
                        var searchValue_orderNo = $("#searchValue_orderNo").val();
                        var deliverStatus = $("#deliverStatus").val(); //出货状态
                        if (deliverStatus) {

                        } else {
                            deliverStatus = 1;
                        }

                        var userline = $("#userline").multiselect("getChecked").map(function() { //线路
                            return this.value;
                        }).get();

                        var payStyle = $("#payStyle").multiselect("getChecked").map(function() { //支付方式
                            return this.value;
                        }).get();

                        var selectedId = $("#reportType").find("option:selected").val();
                        if (selectedId == undefined || selectedId == 0) {
                            $("#times_date").val("");
                            $("#times_month").val("");
                            $("#times_start").val("");
                            $("#times_end").val("");
                        }

                        var payStatus = $("#payStatus").val(); //支付状态
                        if (payStatus) {
                            payStatus = payStatus - 1;
                        } else {
                            payStatus = 1;
                        }

                        var refundStatus = $("#refundStatus").val();

                        var machineType = $("#machineType").val();


                        var start = '';
                        var end = '';
                        var byDate = $("#times_date").val(); //日
                        var byMonth = $("#times_month").val(); //月

                        var startTime = $("#times_start").val(); //开始时间
                        var endTime = $("#times_end").val(); //结束时间
                        if (selectedId == "1") {
                            start = (new Date(byDate + " 00:00:00")).getTime() / 1000;
                            end = (new Date(byDate + " 23:59:59")).getTime() / 1000;
                        } else if (selectedId == "2") {
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
                        } else if (selectedId == "3") {
                            start = (new Date(startTime)).getTime() / 1000;
                            end = (new Date(endTime)).getTime() / 1000;
                        }
                        if (start >= end) {

                            dialog.render({
                                lang: "start_gte_end"
                            });
                            return;
                        }

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

                            if (userline.length == 0) {
                                userline = lineIds;
                            }
                            self.fire("query", payStyle, searchValue_assetId, searchValue_goodsName, searchValue_orderNo, searchValue_siteName, start, end, refundStatus, payStatus, userline, deliverStatus, machineType);


                        });

                    }
                }
            });
            $("#" + queryBtn.id).addClass("readClass");
            //导出
            var addBtn = new Button({
                text: locale.get({
                    lang: "export"
                }),
                container: $("#buttonDiv"),
                events: {
                    click: function() {

                        var searchValue_assetId = $("#searchValue_assetId").val();
                        var searchValue_goodsName = $("#searchValue_goodsName").val();
                        var searchValue_orderNo = $("#searchValue_orderNo").val();
                        var searchValue_siteName = $("#searchValue_siteName").val();
                        var userline = $("#userline").multiselect("getChecked").map(function() { //线路
                            return this.value;
                        }).get();
                        var goodsType = $("#goodstype").multiselect("getChecked").map(function() { //商品类型
                            return this.value;
                        }).get();
                        var payStyle = $("#payStyle").multiselect("getChecked").map(function() { //支付方式
                            return this.value;
                        }).get();

                        var deliverStatus = $("#deliverStatus").val(); //出货状态
                        if (deliverStatus) {

                        } else {
                            deliverStatus = 1;
                        }

                        var refundStatus = $("#refundStatus").val();

                        var selectedId = $("#reportType").find("option:selected").val();
                        if (selectedId == undefined || selectedId == 0) {
                            $("#times_date").val("");
                            $("#times_month").val("");
                            $("#times_start").val("");
                            $("#times_end").val("");
                        }

                        var payStatus = $("#payStatus").val(); //支付状态
                        if (payStatus) {
                            payStatus = payStatus - 1;
                        } else {
                            payStatus = 1;
                        }

                        var machineType = $("#machineType").val();
                        var start = '';
                        var end = '';
                        var byDate = $("#times_date").val(); //日
                        var byMonth = $("#times_month").val(); //月

                        var startTime = $("#times_start").val(); //开始时间
                        var endTime = $("#times_end").val(); //结束时间
                        if (selectedId == "1") {
                            start = (new Date(byDate + " 00:00:00")).getTime() / 1000;
                            end = (new Date(byDate + " 23:59:59")).getTime() / 1000;
                        } else if (selectedId == "2") {
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
                        } else if (selectedId == "3") {
                            start = (new Date(startTime)).getTime() / 1000;
                            end = (new Date(endTime)).getTime() / 1000;
                        }
                        if (start >= end) {

                            dialog.render({
                                lang: "start_gte_end"
                            });
                            return;
                        }
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

                            if (userline.length == 0) {
                                userline = lineIds;
                            }

                            self.fire("exports", payStyle, searchValue_assetId, searchValue_goodsName, searchValue_orderNo, searchValue_siteName, start, end, goodsType, payStatus, userline, deliverStatus, machineType, refundStatus);
                        });
                    }
                }
            });
            $("#" + addBtn.id).addClass("readClass");
            if (permission.app("transaction_detail").read) {
                if (queryBtn) queryBtn.show();
                if (addBtn) addBtn.show();
            } else {
                if (queryBtn) queryBtn.hide();
                if (addBtn) addBtn.hide();
            }
            //            $("#search-bar a").css({
            //                margin: "auto 10px auto 10px"
            //            });
        }

    });

    return NoticeBar;

});