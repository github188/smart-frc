define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../../template/tableTemplate");
    var html = require("text!./statisticsMain.html");
    var statusMg = require("../../../template/menu");
    var status_dayMg = require("./statistics");
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
        	var status_Array = ["automat_day"];
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
                        if (id == "automat_day") {//当天
                            if (this.historyPage) {
                                this.historyPage.destroy();
                            }
                            if (this.dayPage) {
                                this.dayPage.destroy();
                            }
                            this.dayPage = new status_dayMg({
                                "container": ".main_bd"
                            });
                        }
                    }
                }
            });
            $("#automat_day").click();
        }
    });
    return operationMenu;
});