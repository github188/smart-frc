define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../../template/tableTemplate");
    var html = require("text!./stockmanageMain.html");
    var statusMg = require("../../../template/menu");
    //var model_Mg = require("./list");
    
    var DeliverInventory = require("./deliverInventory/list");
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
          var areaMan_Array = ["deliver_inventory_list"];
          if (this.statusMg) {
             this.statusMg.destroy();
          }
          this.statusMg = new statusMg({
        	  "container": "#col_slide_main",
              "lis": areaMan_Array,
              "events": {
                   click: function(id) {
                        $(".main_bd").empty();
                        $("#user-content").scrollTop(0);
                        if(id == "deliver_inventory_list"){
                             if (this.stock_listPage) {
                                 this.stock_listPage.destroy();
                              }
                              this.stock_listPage = new DeliverInventory({
                                 "container": ".main_bd"
                              });
                        	 
                         }
                    }
               }
            });
            $("#deliver_inventory_list").click();
        }
    });
    return operationMenu;
});