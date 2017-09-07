define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../template/tableTemplate");
    var html = require("text!./vendingMachineMain.html");
    var statusMg = require("../../template/menu");
    var automat_lists = require("./list");
    var another_automat_lists = require("./listFlag");
    var loadSubNav = require("../../loadSubNav");
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
        magic_number: function(value, id) { //数字的动态效果
            var num = $("#" + id);
            num.animate({
                count: value
            }, {
                duration: 500,
                step: function() {
                    num.text(String(parseInt(this.count)));
                }
            });
        },
        renderContent: function() {
            var self = this;
            var listFlag = true;
            var alarm_Array = ["smart_vending_list", "unsmart_vending_list"];
            if (this.statusMg) {
                this.statusMg.destroy();
            }
            this.statusMg = new statusMg({
                "container": "#col_slide_main",
                "lis": alarm_Array,
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
                                    "<div style='float: left; margin-top: 5px;'><img id='sum' src='./operation_manage/vendingMachine/images/count.png' style='height:20px'/></div>" +
                                    "<div style='float: left; margin-left: 5px;'><label style='color:#03825c;'>" + locale.get('total') + "</label><label style='color:#03825c;' id='count'>" + data.count + "</label></div>" +
                                    "<div style='float: left; margin-top: 5px; margin-left: 10px;'><img id='sum' src='./operation_manage/vendingMachine/images/online.png' style='height:20px'/></div>" +
                                    "<div style='float: left;margin-left: 5px;'><label style='color:#03825c;'>" + locale.get('online') + "：</label><label style='color:#03825c;'>" + data.countOnline + "</label></div>" +
                                    "<div style='float: left; margin-top: 5px;margin-left: 10px;'><img id='sum' src='./operation_manage/vendingMachine/images/offline.png' style='height:20px'/></div>" +
                                    "<div style='float: left;margin-left: 5px;'><label style='color:grey;'>" + locale.get('offline') + "：</label><label style='color:grey;'>" + data.countOffline + "</label></div>" +
                                    "<div style='float: left; margin-top: 5px;margin-left: 10px;'><img id='sum' src='./operation_manage/vendingMachine/images/unrz.png' style='height:20px'/></div>" +
                                    "<div style='float: left;margin-left: 5px;'><label style='color:#03825c;'>未认证：</label><label style='color:#03825c;'>" + data.onlineType + "</label></div>" +
                                    "</div>";
                                $("#all").append(insertHtml);
                                //self.magic_number(data.count,"count");
                            });

                        })

                        if (id == "smart_vending_list") {
                            if (this.automat_lists) {
                                this.automat_lists.destroy();
                            }
                            if (listFlag) {
                                this.automat_lists = new automat_lists({
                                    "container": ".main_bd"
                                });
                            } else {
                                this.automat_lists = new another_automat_lists({ //售货机状态转换
                                    "container": ".main_bd"
                                });
                            }

                        } else if (id == "unsmart_vending_list") {
                            if (this.automat_lists) {
                                this.automat_lists.destroy();
                            }
                            this.automat_lists = new automat_lists({
                                "container": ".main_bd",
                                onlineType: 1 //未认证售货机列表
                            });
                        }
                    }
                }
            });
            $("#smart_vending_list").click();
        }
    });
    return operationMenu;
});