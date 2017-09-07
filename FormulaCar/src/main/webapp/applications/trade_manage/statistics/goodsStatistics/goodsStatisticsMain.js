define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../../template/tableTemplate");
    var html = require("text!./goodsStatisticsMain.html");
    var statusMg = require("../../../template/menu");
    var goodsStatistics = require("./goodsstatistics");
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
        	var status_Array = ["selling_goods_top10"];
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
                        if (id == "selling_goods_top10") {// 
                            if (this.goods_statistics) {
                                this.goods_statistics.destroy();
                            }
                            this.goods_statistics = new goodsStatistics({
                                "container": ".main_bd"
                            });
                        }
                    }
                }
            });
            $("#selling_goods_top10").click();
        }
    });
    return operationMenu;
});