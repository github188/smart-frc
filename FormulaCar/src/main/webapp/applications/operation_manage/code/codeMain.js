define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../template/tableTemplate");
    var html = require("text!./codeMain.html");
    var statusMg = require("../../template/menu");
    var codeMg = require("./list");
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
        	var proMan_Array = ["code_list"];
            if (this.statusMg) {
                this.statusMg.destroy();
            }
            this.statusMg = new statusMg({
                "container": "#col_slide_main",
                "lis": proMan_Array,
                "events": {
                    click: function(id) {
                        $(".main_bd").empty();
                        $("#user-content").scrollTop(0);
                        if (id == "code_list") {//列表
                            if (this.code_list) {
                                this.code_list.destroy();
                            }
                            this.code_list = new codeMg({
                                "container": ".main_bd"
                            });
                        }
                    }
                }
            });
            $("#code_list").click();
        }
    });
    return operationMenu;
});