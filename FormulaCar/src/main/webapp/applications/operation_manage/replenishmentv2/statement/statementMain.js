define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../../template/tableTemplate");
    var html = require("text!./statementMain.html");
    var statusMg = require("../../../template/menu");
    var replenishStatement = require("./list");
    var lineStatement = require("./line/list");
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
        	var flow_manager_array = ["line_replenish_statement_list","replenish_statement_list"];
            if (this.statusMg) {
                this.statusMg.destroy();
            }
            this.statusMg = new statusMg({
                "container": "#col_slide_main",
                "lis": flow_manager_array,
                "events": {
                    click: function(id) {
                        $(".main_bd").empty();
                        $("#user-content").scrollTop(0);
                        if (id == "replenish_statement_list") {
                            if (this.replenishmentList) {
                                this.replenishmentList.destroy();
                            }
                            this.replenishStatementList = new replenishStatement({
                                "container": ".main_bd"
                            });
                        }else if(id == "line_replenish_statement_list"){
                            if (this.lineReplenishmentList) {
                                this.lineReplenishmentList.destroy();
                             }
                             this.lineReplenishmentList = new lineStatement({
                                "container": ".main_bd"
                             });
                       	 
                        }
                    }
                }
            });
            $("#line_replenish_statement_list").click();
        }
    });
    return operationMenu;
});