define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../../template/tableTemplate");
    var html = require("text!./trafficMain.html");
    var statusMg = require("../../../template/menu");
    var trafficStatistics = require("./list");
    var trafficCure = require("./trafficChart/content")
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
        	var traffic_array = ["traffic_statistics_list","traffic_statistics_cure"];
            if (this.proMg) {
                this.proMg.destroy();
            }
            this.proMg = new statusMg({
                "container": "#col_slide_main",
                "lis": traffic_array,
                "events": {
                    click: function(id) {
                        $(".main_bd").empty();
                        $("#user-content").scrollTop(0);
                        if (id == "traffic_statistics_list") {
                            if (this.trafficStatMgPage) {
                                this.trafficStatMgPage.destroy();
                            }
                            this.trafficStatMgPage = new trafficStatistics({
                                "container": ".main_bd"
                            });
                        }else if (id=="traffic_statistics_cure") {
                        	  if (this.trafficCureMgPage) {
                                  this.trafficCureMgPage.destroy();
                              }
                              this.trafficCureMgPage = new trafficCure({
                                  "container": ".main_bd"
                              });
						}
                    }
                }
            });
            $("#traffic_statistics_list").click();
        }
    });
    return operationMenu;
});