define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../../template/tableTemplate");
    var html = require("text!./statisticsMain.html");
    var statusMg = require("../../../template/menu");
    var status_dayMg = require("./statistics");
    var status_dayMg_en = require("./statistics_en");
    var loadSubNav = require("../../../loadSubNav");
    var Service = require("./service");
    var operationMenu = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.service = options.service;
            this.element.html(html);
            this.elements = {
                conent_el: "content-operation-menu"
            };
            this._render();
            locale.render({
                element: this.element
            });

        },
        _render: function() {
            $("#content-operation-menu").height($("#user-content").height() - 18);
            this.renderContent();

        },
        renderContent: function() {
            var status_Array = ["automat_day"];
            var language = locale._getStorageLang();
            if (this.proMg) {
                this.proMg.destroy();
            }
            this.proMg = new statusMg({
                "container": "#col_slide_main",
                "lis": status_Array,
                "events": {
                    click: function(id) {
                        $(".main_bd").empty();
                        $("#user-content").scrollTop(0);
                        if (document.getElementById("shu")) {
                            $("#shu").remove();
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
                            var datas = {
                                "lineId": lineIds
                            };
                            $("#topTab").css("width", $(".wrap").width());
                            Service.getCount(datas, function(data) {
                                var insertHtml = "<div id='shu' style='float:right;margin-right:10px;'>" +
                                    "<div style='float: left; margin-top: 5px; margin-left: 10px;'><img src='./operation_manage/vendingMachine/images/online.png' style='height:20px'/></div>" +
                                    "<div style='float: left;margin-left: 5px;'><label style='color:#03825c;'>" + locale.get('online') + "：</label><label style='color:#03825c;'>" + data.countOnline + "</label></div>" +
                                    "</div>";
                                $("#all").append(insertHtml);
                            });

                        });
                        if (id == "automat_day") { //当天
                            if (this.historyPage) {
                                this.historyPage.destroy();
                            }
                            if (this.dayPage) {
                                this.dayPage.destroy();
                            }
                            if (language == "en") {
                                this.dayPage = new status_dayMg_en({
                                    "container": ".main_bd"
                                });
                            } else {
                                this.dayPage = new status_dayMg({
                                    "container": ".main_bd"
                                });
                            }

                        }
                    }
                }
            });
            $("#automat_day").click();
        }
    });
    return operationMenu;
});