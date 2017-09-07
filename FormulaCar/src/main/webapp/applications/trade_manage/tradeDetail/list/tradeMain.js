define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../../template/tableTemplate");
    var html = require("text!./tradeMain.html");
    var statusMg = require("../../../template/menu");
    var tradeMg = require("./list");
    var codeMg = require("../../../operation_manage/code/list");
    var codeThirdMg = require("../codeThird/list");
    var codeActivicyMg = require("../codeActivity/list");
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
        	var proMan_Array = ["trade_list"/*,"code_list","code_third_party","code_activity_party"*/];
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
                        if (id == "trade_list") {//列表
                            if (this.trade_list) {
                                this.trade_list.destroy();
                            }
                            this.trade_list = new tradeMg({
                                "container": ".main_bd"
                            });
                        }/*else if (id == "code_list") {//列表
                            if (this.code_list) {
                                this.code_list.destroy();
                            }
                            this.code_list = new codeMg({
                                "container": ".main_bd"
                            });
                        }else if(id =="code_third_party"){//取货码(第三方)
                        	 if (this.code_list) {
                                 this.code_list.destroy();
                             }
                             this.code_third_list = new codeThirdMg({
                                 "container": ".main_bd"
                             });
                        }else if(id="code_activity_party"){//取货码(活动)
                        	 if (this.codeActivity_list) {
                                 this.codeActivity_list.destroy();
                             }
                             this.codeActivity_list = new codeActivicyMg({
                                 "container": ".main_bd"
                             });
                        }*/
                    }
                }
            });
            $("#trade_list").click();
        }
    });
    return operationMenu;
});