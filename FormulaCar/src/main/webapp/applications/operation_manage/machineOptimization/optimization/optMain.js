define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../../template/tableTemplate");
    var html = require("text!./optMain.html");
    var statusMg = require("../../../template/menu");
    var opt_Mg = require("./list");
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
        	var areaMan_Array = ["optimization_list"];
        	
        	if (this.statusMg) {
        		this.statusMg.destroy();
        	}
			this.statusMg = new statusMg({
				"container" : "#col_slide_main",
				"lis" : areaMan_Array,
				"events" : {
					click : function(id) {
						$(".main_bd").empty();
						$("#user-content").scrollTop(0);
						if (id == "optimization_list") {
							if (this.area_listPage) {
								this.area_listPage.destroy();
							}
							this.area_listPage = new opt_Mg({
								"container" : ".main_bd"
							});
						}
					}
				}
			});
			$("#optimization_list").click();
        }
    });
    return operationMenu;
});