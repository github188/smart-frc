define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../../template/tableTemplate");
    var html = require("text!./contentMain.html");
    var statusMg = require("../../../template/menu");
    var onlineStat = require("./content");
    var onlineChart = require("../chart/content");
    var loadSubNav = require("../../../loadSubNav");
    var operationMenu = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.service = options.service;
            this.element.html(html);
            this.elements = {
                conent_el: "content-operation-menu"
            };
            this._render();
            locale.render({element: this.element});

        },
        _render: function() {
        	$("#content-operation-menu").height($("#user-content").height()-18);
            this.renderContent();
            
        },
        renderContent: function() {
        	var online_manager_array = ["online_statistics_reports", "online_statistics_curve"];
            if (this.proMg) {
                this.proMg.destroy();
            }
            this.proMg = new statusMg({
                "container": "#col_slide_main",
                "lis": online_manager_array,
                "events": {
                    click: function(id) {
                        $(".main_bd").empty();
                        $("#user-content").scrollTop(0);
                        if (id == "online_statistics_reports") {//配置项
                            if (this.onlineStatMgPage) {
                                this.onlineStatMgPage.destroy();
                            }
                            this.onlineStatMgPage = new onlineStat({
                                "container": ".main_bd"
                            });
                        }
                        else if (id == "online_statistics_curve") {//配置项
                            if (this.onlineChartMgPage) {
                                this.onlineChartMgPage.destroy();
                            }
                            this.onlineChartMgPage = new onlineChart({
                                "container": ".main_bd"
                            });
                        }
                    }
                }
            });
            $("#online_statistics_reports").click();
        }
    });
    return operationMenu;
});