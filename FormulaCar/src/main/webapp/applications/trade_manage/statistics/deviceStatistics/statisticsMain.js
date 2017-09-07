define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../../template/tableTemplate");
    var html = require("text!./statisticsMain.html");
    var statusMg = require("../../../template/menu");
    var deviceStatistics = require("./statistics");
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
        	var status_Array = ["selling_points_top10"];
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
                        if (id == "selling_points_top10") {//
                            if (this.device_statistics) {
                                this.device_statistics.destroy();
                            }
                            this.device_statistics = new deviceStatistics({
                                "container": ".main_bd"
                            });
                        }
                    }
                }
            });
            $("#selling_points_top10").click();
        }
    });
    return operationMenu;
});