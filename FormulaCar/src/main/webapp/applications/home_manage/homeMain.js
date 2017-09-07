define(function(require) {
  require("cloud/base/cloud");
  require("cloud/lib/plugin/jquery.dataTables");
  var Table = require("../template/tableTemplate");
  var html = require("text!./homeMain.html");
  var statusMg = require("../template/menu");
  var model_Mg = require("./dashboard/dashboardHome.js");
  var map_Mg = require("../monitor/gis.js");
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
      $("#homeContent").height($("#user-content").height());
      $("#mapContent").height($("#user-content").height());

      this.renderHomeContent();
    },
    renderHomeContent: function() {
      var self = this;
      $("#dashboardModel").click(function() {
        $("#mapContent").css("display", "none");
        $("#homeContent").css("display", "block");

        $("#dashboardModel").css("color", "rgb(132, 196, 74)");
        $("#mapModel").css("color", "white");

        $("#dash").removeClass("dashUnable");
        $("#dash").addClass("dashEnable");
        $("#map").removeClass("mapEnable");
        $("#map").addClass("mapUnable");


        if (this.dashboardPage) {
          this.dashboardPage.destroy();
        }
        this.dashboardPage = new model_Mg({
          "container": "#homeContent"
        });
      });
      $("#mapModel").click(function() {
        $("#mapContent").css("display", "block");
        $("#homeContent").css("display", "none");

        $("#dash").removeClass("dashEnable");
        $("#dash").addClass("dashUnable");
        $("#map").removeClass("mapUnable");
        $("#map").addClass("mapEnable");

        $("#dashboardModel").css("color", "white");
        $("#mapModel").css("color", "rgb(132, 196, 74)");

        if (cloud.interval) {
          clearInterval(cloud.interval);
        }
        /* if (this.mapPage) {
                  this.mapPage.destroy();
               }*/

        this.mapPage = new map_Mg({
          "container": "#mapContent"
        });


      });
      $("#dashboardModel").click();
      $("#dashboardModel").css("color", "rgb(132, 196, 74)");
      $("#mapModel").css("color", "white");
      $("#replenish_one").css( "display", "none");
      $("#reconciliation_one").css( "display", "none");
      $("#adminHome_one").css( "display", "none");
    },

  });
  return operationMenu;
});