define(function(require) {
  require("cloud/base/cloud");
  require("cloud/lib/plugin/jquery.dataTables");
  var Table = require("../../../template/tableTemplate");
  var html = require("text!./siteMain.html");
  var statusMg = require("../../../template/menu");
  var site_Mg = require("./siteList");
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
      locale.render({
        element: this.element
      });

    },
    _render: function() {
      $("#content-operation-menu").height($("#user-content").height() - 18);
      this.renderContent();

    },
    renderContent: function() {
      var areaMan_Array = ["site_list"];
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
            if (id == "site_list") { //点位列表
              if (this.area_listPage) {
                this.area_listPage.destroy();
              }
              this.area_listPage = new site_Mg({
                "container": ".main_bd"
              });
            }
          }
        }
      });
      $("#site_list").click();
      $("#buttonDiv a.cloud-button").css( "display", "block");
    }
  });
  return operationMenu;
});