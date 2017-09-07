define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../template/tableTemplate");
    var html = require("text!./payDetailMain.html");
    var statusMg = require("../../template/menu");
    var billManage = require("./desc");
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
        	var organs_pay_Array = ["bill_desc"];
            
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
                        if (id == "bill_desc") {
                            if (this.organ_statistics) {
                                this.organ_statistics.destroy();
                            }
                            this.organ_statistics = new billManage({
                                "container": ".main_bd"
                            });
                        }
                    }
                }
            });
            $("#bill_desc").click();
        }
    });
    return operationMenu;
});