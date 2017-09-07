define(function(require) {
    var cloud = require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/lib/plugin/jquery-ui");
    require("./js/jquery.combox");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/resources/css/jquery.multiselect.css");
    require("./css/style.css");

    var Service = require("../../service");
    var Button = require("cloud/components/button");
    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);

            this.areaIds = [];
            this.lineIds = [];
            this.deviceIds = [];
            this._render();
        },
        _render: function() {

            this.draw();
            this.getData();
        },
        draw: function() {
            var self = this;
            if (!(localStorage.getItem("language") == "en")) {
                var html2 = "<option value='3'>" + locale.get({
                    lang: "year_report"
                }) + "</option>";
            }
            var htmls_bar = "<div></div>" +
                            "<div style='margin-top: 5px;margin-bottom: 5px;height: 20px;' id='search'>" +
                                "<div style='float:left;margin-left: 2%;'>" +
                                    "<select id='reportType'  name='reportType' style='width:100px;height: 28px;'>" +
                                        "<option value='1' selected = 'selected'>" + locale.get({
                                            lang: "daily_chart"
                                        }) + "</option>" +
                                        "<option value='2'>" + locale.get({
                                            lang: "monthly_report"
                                        }) + "</option>" +
                                        html2 +
                                        "<option value='4'>" + locale.get({
                                            lang: "custom_report"
                                        }) + "</option>" +
                                    "</select>&nbsp;&nbsp;" +
                                "</div>" +
                                "<div style='float:left;height: 28px;'>" +
                                    "<input style='width:120px;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='summary_date' />&nbsp;&nbsp;" +
                                "</div>" +
                                "<div style='float:left;height: 28px;margin-left:-10px;'>" +
                                    "<input style='width:120px;display:none;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='summary_month'/>&nbsp;&nbsp;" +
                                "</div>" +
                                "<div style='float:left;height: 28px;'>" +
                                    "<input style='width:120px;display:none;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='summary_startTime' />" +
                                "</div>&nbsp;&nbsp;" +
                                "<div style='float:left;height: 28px;margin-left: 5px;'>" +
                                    "<input style='width:120px;display:none;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='summary_endTime'/>" +
                                "</div>" +
                                "<div style='float:left;height: 28px;margin-left:-25px;margin-right: 30px;'>" +
                                    "<select id='summary_year' style='height: 28px;display:none; border-radius: 4px;'>" +
                                        "<option value='2015' selected='selected'>2015</option>" +
                                        "<option value='2016'>2016</option>" +
                                        "<option value='2017'>2017</option>" +
                                        "<option value='2018'>2018</option>" +
                                        "<option value='2019'>2019</option>" +
                                        "<option value='2019'>2020</option>" +
                                    "</select>" +
                                "</div>" +
                                "<div style ='float: left;'>" +
                                    "<select  id='userarea'  multiple='multiple'  style='width:120px;height: 28px;'></select>&nbsp;&nbsp;" + // 区域
                                "</div>" +
                                "<div style ='float: left;'>" +
                                    /*"<select  id='userline'  multiple='multiple'  style='width:120px;height: 28px;'></select>&nbsp;&nbsp;" + */ //线路
                                    "<span>" + locale.get("storefront") +  "</span>"
                                "</div>" +

                                "<div id='userdevice' style='float: left;height: 28px;margin-left: 5px;'>" +
                                    "<label>" + locale.get('trade_automat_number') + "</label>" +
                                    "<span id='combox'></span>" +

                                    "<div id='resultDiv' style='display:none;z-index: 3;height: auto;width: 105px; margin-left: 0px; margin-top: 16px;'>" +
                                        "<ul class='on_changes' id='results' style='position: absolute;font-size: 14px;width: 105px;top:85px; height: auto; overflow: auto; background-color: aliceblue;border:1px solid #CFD8CE; margin-left:76px;'>" +
                                        "</ul>" +
                                    "</div>" +
                                "</div>" +

                                "<div id='buttonDiv' style='float:left;height: 28px;margin-left:5px;'></div>" +
                                "<div id='fullbg'></div>" +
                                "<div id='dialog'>" +
                                    "<p class='close'><a href='#' onclick='javascript:$('#fullbg,#dialog').hide();' lang='text:close'></a></p>" +
                                "<div>" +

                                "<div id='payList_div' style='height:150px'>" +
                                    "<table style='margin-top:-60px;'>" +
                                        "<tr>" +
                                            "<td style='padding: 10px 15px;'><label style='position: absolute;' for='abc' lang='text:trade_abc'></label><input type='checkbox' style='height:20px;width:20px;margin-left:90px;' id='abc' /></td>" +
                                            "<td style='padding: 10px 15px;'><label style='position: absolute;' for='swingCard' lang='text:trade_swingcard_pay'></label><input type='checkbox' style='height:20px;width:20px;margin-left:63px;' id='swingCard' /></td>" +
                                            "<td style='padding: 10px 15px;'><label style='position: absolute;' for='pos' lang='text:trade_pos_pay'></label><input type='checkbox' style='height:20px;width:20px;margin-left:76px;' id='pos' /></td>" +
                                        "</tr><br>" +
                                        "<tr>" +
                                            "<td style='padding: 10px 15px;'><label style='position: absolute;' for='oneCard' lang='text:trade_onecard_pay'></label><input type='checkbox' style='height:20px;width:20px;margin-left:76px;' id='oneCard' /></td>" +
                                            "<td style='padding: 10px 15px;'><label style='position: absolute;' for='baifubao' lang='text:trade_baifubao'></label><input type='checkbox' style='height:20px;width:20px;margin-left:76px;' id='baifubao' /></td>" +
                                            "<td style='padding: 10px 15px;'><label style='position: absolute;' for='soundWave' lang='text:trade_soundwave_pay'></label><input type='checkbox' style='height:20px;width:20px;margin-left:63px;' id='soundWave' /></td>" +
                                        "</tr><br>" +
                                        "<tr>" +
                                            "<td style='padding: 10px 15px;'><label style='position: absolute;' for='game' lang='text:trade_game_pay'></label><input type='checkbox' style='height:20px;width:20px;margin-left:63px;' id='game' /></td>" +
                                        "</tr><br>" +
                                    "</table>" +
                                "</div>" +

                                "<div style='text-align: right;width: 94%;margin-top: 10px;border-top: 1px solid #f2f2f2;'>" +
                                    "<a id='product-config-save' class='btn btn-primary submit' style='margin-top: 8px;' lang='text:save'></a>" +
                                    "<a id='product-config-cancel' style='margin-left: 10px;margin-top: 8px;' class='btn btn-primary submit' lang='text:cancel'></a>" +
                                "</div>" +
                            "</div>" +
                            /*"</div>" +*/
                            "<div style='position: absolute;height: 30px;width: 45px;right: 42px;'><span style='display:none' class='payStylelist' id='payStylelist'></span></div>" +
                            "</div>";
            this.element.append(htmls_bar);

            require(["cloud/lib/plugin/jquery.multiselect"], function() {
                $("#userarea").multiselect({

                    header: false,
                    checkAllText: locale.get({
                        lang: "check_all"
                    }),
                    uncheckAllText: locale.get({
                        lang: "uncheck_all"
                    }),
                    noneSelectedText: locale.get({
                        lang: "user_area"
                    }),
                    selectedText: "# " + locale.get({
                        lang: "is_selected"
                    }),
                    minWidth: 125,
                    height: 120

                });

                $("#userline").multiselect({
                    header: false,
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
                    minWidth: 125,
                    height: 120
                });

            });

            $("#summary_month").val("");
            $("#summary_year").val("");
            $("#trade").unmask();
            this._renderBar();
            this._renderSelect();
            this._renderBtn();

            $(document).ready(function() {
                $('#combox').combox({
                    assetIds: [],
                    ids: []
                });
            })
        },

        getData: function() {
            var self = this;

            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            //获取用户区域
            Service.getAreaDataByUserId(userId, function(data) {

                if (data && data.result) {
                    for (var i = 0; i < data.result.length; i++) {
                        //添加区域option
                        $("#userarea").append("<option id='" + data.result[i]._id + "' value='" + data.result[i]._id + "'>" + data.result[i].name + "</option>");
                        $("#userarea").multiselect("refresh");
                        //添加option的点击事件
                        $("#ui-multiselect-" + data.result[i]._id).die();
                        $("#ui-multiselect-" + data.result[i]._id).live('click', {
                            areaid: data.result[i]._id
                        }, function(e) {
                            var bool = $(this).attr("aria-selected");
                            var le = $("#userline").find("option").length;
                            var areaid = e.data.areaid;
                            //判断是选中还是取消
                            if (bool == "true") {

                                //获取选中区域的线路
                                cloud.Ajax.request({
                                    url: "api/automatline/list",
                                    type: "GET",
                                    parameters: {
                                        areaId: areaid,
                                        cursor: 0,
                                        limit: -1
                                    },
                                    success: function(linedata) {

                                        //添加线路option
                                        for (var j = 0; j < linedata.result.length; j++) {
                                            $("#" + areaid + "_" + linedata.result[j]._id).remove();
                                            $("#userline").append("<option id='" + areaid + "_" + linedata.result[j]._id + "' value='" + linedata.result[j]._id + "'>" +

                                                linedata.result[j].name + "</option>");
                                            $("#userline").multiselect("refresh");
                                            //添加线路option的点击事件
                                            $("#ui-multiselect-" + areaid + "_" + linedata.result[j]._id).die();
                                            $("#ui-multiselect-" + areaid + "_" + linedata.result[j]._id).live('click', {
                                                areaid: areaid,
                                                lineid: linedata.result[j]._id
                                            }, function(e) {
                                                var bool = $(this).attr("aria-selected");
                                                var le = $("#userdevice").find("li").length;
                                                var areaid = e.data.areaid;
                                                var lineid = e.data.lineid;

                                                //判断
                                                if (bool == "true") {

                                                    var searchData = {
                                                            "lineId": lineid,
                                                            "cursor": 0,
                                                            "limit": -1
                                                        }
                                                        //获取选中线路下的售货机
                                                    cloud.Ajax.request({
                                                        url: "api/automat/list_new",
                                                        type: "GET",
                                                        parameters: searchData,
                                                        success: function(devicedata) {

                                                            $("#combox_ul").css('top', $("#combox").height() + 1);
                                                            //添加售货机option
                                                            for (var k = 0; k < devicedata.result.length; k++) {
                                                                var ids = areaid + "_" + lineid + "_" + devicedata.result[k]._id;
                                                                var assetIds = devicedata.result[k].assetId;

                                                                $("#combox_ul").append('<li id="' + ids + '"><input type="checkbox" title="we"><span id="' + ids[i] + '_span">' + assetIds + '</span></li>');
                                                                $("#" + ids + " input").bind('click', function() {

                                                                    var check = $(this).attr("checked");

                                                                    var tx = $("#combox").children(':text').val();

                                                                    var tp = $(this).parent().find("span").text();
                                                                    if (check == 'checked') {
                                                                        if (tx != "") {
                                                                            $("#combox").children(':text').val(tx + "," + $(this).parent().find("span").text());
                                                                        } else {
                                                                            $("#combox").children(':text').val($(this).parent().find("span").text());
                                                                        }
                                                                    } else {
                                                                        var a = tx.split(',');
                                                                        var d = $(this).parent().find("span").text();

                                                                        if ($.inArray(d, a) > -1) {
                                                                            var index = $.inArray(d, a);
                                                                            a.splice(index, 1);

                                                                            $("#combox").children(':text').val(a);
                                                                        }
                                                                    }

                                                                });

                                                            }

                                                            //$('#combox').combox({assetIds:assetIds,ids:ids});

                                                        }
                                                    });
                                                } else {
                                                    //取消则删除相应的售货机option
                                                    if (le > 0) {
                                                        var we = $("#userdevice").find("li");

                                                        for (var m = 0; m < we.length; m++) {
                                                            var id = we.eq(m).attr("id");

                                                            var basearea = id.split("_")[0];
                                                            var baseline = id.split("_")[1];
                                                            if (basearea == areaid && baseline == lineid) {

                                                                we.eq(m).remove();
                                                            }
                                                        }


                                                    }
                                                }

                                            });

                                        }

                                    }
                                });
                                //}
                            } else {
                                //取消则删除相应的线路和售货机

                                if (le > 0) {
                                    var we = $("#userline").find("option");

                                    for (var j = 0; j < we.length; j++) {
                                        var id = we.eq(j).attr("id");

                                        var basearea = id.split("_")[0];
                                        var baseline = id.split("_")[1];
                                        var omg = $("#userdevice").find("li");
                                        //删除售货机
                                        for (var n = 0; n < omg.length; n++) {
                                            var devid = omg.eq(n).attr("id");

                                            var barea = devid.split("_")[0];
                                            var bline = devid.split("_")[1];
                                            if (barea == areaid && bline == baseline) {

                                                omg.eq(n).remove();
                                            }
                                        }


                                        if (basearea == areaid) {

                                            we.eq(j).remove();
                                        }
                                    }
                                    $("#userline").multiselect("refresh");

                                }
                            }

                        });

                    }

                }


            });


        },
        _renderBar: function() {
            var self = this;
            $("#reportType").bind('change', function() {
                var selectedId = $("#reportType").find("option:selected").val();
                if (selectedId == "1") {
                    $("#summary_month").css("display", "none");
                    $("#summary_year").css("display", "none");
                    $("#summary_date").css("display", "block");
                    $("#summary_startTime").css("display", "none");
                    $("#summary_endTime").css("display", "none");
                    $("#summary_year").val("");
                    $("#summary_month").val("");
                    $("#summary_date").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM/dd"));
                    if ((localStorage.getItem("language") == "en")) {
                        $("#userdevice").show();
                    }
                } else if (selectedId == "2") {
                    $("#summary_date").css("display", "none");
                    $("#summary_year").css("display", "none");
                    $("#summary_month").css("display", "block");
                    $("#summary_startTime").css("display", "none");
                    $("#summary_endTime").css("display", "none");
                    $("#summary_date").val("");
                    $("#summary_year").val("");
                    $("#summary_month").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM"));
                    //时区原因，输入设备编号查询时有问题，暂时先隐藏
                    if ((localStorage.getItem("language") == "en")) {
                        $("#userdevice").hide();
                    }

                } else if (selectedId == "3") {
                    $("#summary_date").css("display", "none");
                    $("#summary_month").css("display", "none");
                    $("#summary_year").css("display", "block");
                    $("#summary_startTime").css("display", "none");
                    $("#summary_endTime").css("display", "none");
                    $("#summary_date").val("");
                    $("#summary_month").val("");
                    //时区原因，输入设备编号查询时有问题，暂时先隐藏
                    if ((localStorage.getItem("language") == "en")) {
                        $("#userdevice").hide();
                    }
                } else if (selectedId == "4") {
                    $("#summary_month").css("display", "none");
                    $("#summary_year").css("display", "none");
                    $("#summary_date").css("display", "none");
                    $("#summary_startTime").css("display", "block");
                    $("#summary_endTime").css("display", "block");
                    $("#summary_year").val("");
                    $("#summary_month").val("");
                    $("#summary_date").val("");
                    $("#summary_startTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000 - (1 * 30 * 24 * 60 * 60)), "yyyy/MM/dd"));
                    $("#summary_endTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM/dd"));
                    if ((localStorage.getItem("language") == "en")) {
                        $("#userdevice").hide();
                    }
                }
            });
        },
        _renderSelect: function() {
            $(function() {
                $("#summary_date").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000),

                    "yyyy/MM/dd")).datetimepicker({
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

                $("#summary_month").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000),

                    "yyyy/MM")).datetimepicker({
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
                $("#summary_startTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000 - (1 * 30 * 24 * 60 * 60)), "yyyy/MM/dd")).datetimepicker({
                    format: 'Y/m/d',
                    step: 1,
                    startDate: '-1970/01/08',
                    timepicker: false,
                    lang: locale.current() === 1 ? "en" : "ch",
                    //  timepicker: true,
                    onShow: function() {
                        // $(".xdsoft_calendar").hide();
                        $(".xdsoft_calendar").show();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                        // b.val(cloud.util.dateFormat(date, "yyyy/MM hh:mm"));
                    },
                    onClose: function(a, b) {
                        var date = new Date(new Date($("#summary_startTime").val()).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    }


                })
                $("#summary_endTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), "yyyy/MM/dd")).datetimepicker({
                    format: 'Y/m/d',
                    step: 1,
                    startDate: '-1970/01/08',
                    timepicker: false,
                    lang: locale.current() === 1 ? "en" : "ch",
                    //  timepicker: true,
                    onShow: function() {
                        // $(".xdsoft_calendar").hide();
                        $(".xdsoft_calendar").show();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                        //  b.val(cloud.util.dateFormat(date, "yyyy/MM hh:mm"));
                    },
                    onClose: function(a, b) {
                        var date = new Date(new Date($("#summary_endTime").val()).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    }
                })
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
                        self.fire("query");
                    }
                }
            });
            $("#" + queryBtn.id).addClass("readClass");
            //导出
            var exportReport = new Button({
                text: locale.get({
                    lang: "export"
                }),
                container: $("#buttonDiv"),
                events: {
                    click: function() {
                        self.fire("exReport");
                    }
                }
            });
            $("#" + exportReport.id).addClass("readClass");
            if (permission.app("transaction_summary").read) {
                if (queryBtn) queryBtn.show();
                if (exportReport) exportReport.show();
            } else {
                if (queryBtn) queryBtn.hide();
                if (exportReport) exportReport.hide();
            }
            //            $("#search-bar a").css({
            //                margin: "auto 10px auto 10px"
            //            });
        }

    });

    $("#buttonDiv a").css( "display", "block");

    return NoticeBar;

});