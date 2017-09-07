define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../../template/tableTemplate");
    var html = require("text!./statisticsMain.html");
    var statusMg = require("../../../template/menu");
    var organStatistics = require("./statistics");
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
        	var organs_pay_Array = ["selling_organs_top10"];
            
            if (this.proMg) {
                this.proMg.destroy();
            }
            this.proMg = new statusMg({
                "container": "#col_slide_main",
                "lis": organs_pay_Array,
                "events": {
                    click: function(id) {
                        $(".main_bd").empty();
                        
                        $("#user-content").scrollTop(0);
                        if (id == "selling_organs_top10") {//
                            if (this.organ_statistics) {
                                this.organ_statistics.destroy();
                            }
                            this.organ_statistics = new organStatistics({
                                "container": ".main_bd"
                            });
                        }
                    }
                }
            });
            $("#selling_organs_top10").click();
        }
    });
    return operationMenu;
});