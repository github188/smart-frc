define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../template/tableTemplate");
    var html = require("text!./alarmMain.html");
    var statusMg = require("../../template/menu");
    var model_Mg = require("./list");
    var reminder_Mg = require("./reminder/list");
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
            var areaMan_Array = ["automat_alarmlist","reminder_settings"];
        	//var areaMan_Array = ["automat_alarmlist"];
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
                        if (id == "automat_alarmlist") {
                             if (this.area_listPage) {
                                this.area_listPage.destroy();
                             }
                             this.area_listPage = new model_Mg({
                                "container": ".main_bd"
                             });
                         }else if(id == "reminder_settings"){
                        	 if (this.reminder_listPage) {
                                 this.reminder_listPage.destroy();
                              }
                              this.reminder_listPage = new reminder_Mg({
                                 "container": ".main_bd"
                              });
                         }
                    }
               }
            });
            $("#automat_alarmlist").click();
        }
    });
    return operationMenu;
});