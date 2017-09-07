define(function(require) {
    var cloud = require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    var Button = require("cloud/components/button");

    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.draw();
            this._renderBtn();
        },
        draw: function() {
            var self = this; 
            var $htmls = $("<div></div>" +
            	  "<div id='search-bar2' style='width:auto;margin-top:5px;margin-left:5px;'>" +
            	  "<span style='margin-right: 10px;'>"+locale.get({lang:"show_days"})+":</span>"+
            	  "<input style='width:60px;height:22px;padding:1px;' type='number'  id='days' value='21' max= '30' min='1'/>" +       
            	  "</div>");
            this.element.append($htmls);
            
        },
        _renderBtn: function() {
            var self = this;
            //查询
            var queryBtn = new Button({
                text: locale.get({lang: "query"}),
                container: $("#search-bar2"),
                events: {
                    click: function() {
                    	self.fire("query");
                    }
                }
            });
            
            $("#"+queryBtn.id).addClass("readClass");
            if(permission.app("optimization_machine").read){
            	if(queryBtn) queryBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            }
            $("#search-bar2 a").css({
                margin: "-3px 0px 0px 6px"
            });
        }

    });
    return NoticeBar;

});
