define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../../template/tableTemplate");
    var html = require("text!./tradeStatisticsMain.html");
    var statusMg = require("../../../template/menu");
    var timeStatistics = require("./tradeStatistics");
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
        	var status_Array = ["selling_times"];
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
                        if (id == "selling_times") {//当天
                            if (this.trade_statistics) {
                                this.trade_statistics.destroy();
                            }
                            this.trade_statistics = new timeStatistics({
                                "container": ".main_bd"
                            });
                        }
                    }
                }
            });
            $("#selling_times").click();
        }
    });
    return operationMenu;
});