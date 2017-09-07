define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../template/tableTemplate");
    var html = require("text!./settleMain.html");
    var statusMg = require("../../template/menu");
    var settleMg = require("./list");
    var loadSubNav = require("../../loadSubNav");
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
        	var proMan_Array = ["settle_list"];
            if (this.proMg) {
                this.proMg.destroy();
            }
            this.proMg = new statusMg({
                "container": "#col_slide_main",
                "lis": proMan_Array,
                "events": {
                    click: function(id) {
                        $(".main_bd").empty();
                        $("#user-content").scrollTop(0);
                        if (id == "settle_list") {//列表
                            if (this.settle_list) {
                                this.settle_list.destroy();
                            }
                            this.settle_list = new settleMg({
                                "container": ".main_bd"
                            });
                        }
                    }
                }
            });
            $("#settle_list").click();
        }
    });
    return operationMenu;
});