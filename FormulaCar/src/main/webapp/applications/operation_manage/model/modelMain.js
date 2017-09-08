define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../template/tableTemplate");
    var html = require("text!./modelMain.html");
    var statusMg = require("../../template/menu");
    var model_Mg = require("./list");
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
        	var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
        	if(oid == '0000000000000000000abcde'){ 
        		$(".container-hd").html('');
        		$(".container-hd").append("<h2><span >"+locale.get({lang:"current_location_manage_model"})+"</span></h2>");
        	}
        	$("#content-operation-menu").height($("#user-content").height()-18);
            this.renderContent();
            
        },
        renderContent: function() {
          var areaMan_Array=[];
          var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
          if(oid == '0000000000000000000abcde'){
        	  areaMan_Array = ["smart_vending_model_list","undo_model_list"];
          }else{
        	  areaMan_Array = ["smart_vending_model_list"];
          }
        	
         
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
                        if (id == "smart_vending_model_list") {
                             if (this.area_listPage) {
                                this.area_listPage.destroy();
                             }
                             this.area_listPage = new model_Mg({
                                "container": ".main_bd"
                             });
                         }
                    }
               }
            });
            $("#smart_vending_model_list").click();
        }
    });
    return operationMenu;
});