define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../template/tableTemplate");
    var html = require("text!./adMain.html");
    var statusMg = require("../../template/menu");
    var model_Mg = require("./list");
    var adTask_Mg = require("./adTask/list");
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
          var areaMan_Array = ["ad_manage","ad_task"];
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
                        if (id == "ad_manage") {
                             if (this.area_listPage) {
                                this.area_listPage.destroy();
                             }
                             this.area_listPage = new model_Mg({
                                "container": ".main_bd"
                             });
                         }else if(id == "ad_task"){
                        	 if (this.adtask_listPage) {
                                 this.adtask_listPage.destroy();
                              }
                              this.adtask_listPage = new adTask_Mg({//1 远程控制  2广告下发 3 远程升级
                                 "container": ".main_bd",
                                 type:2
                              });
                         }
                    }
               }
            });
            $("#ad_manage").click();
        }
    });
    return operationMenu;
});