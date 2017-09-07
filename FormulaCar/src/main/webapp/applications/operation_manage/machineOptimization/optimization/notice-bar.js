define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	var Button = require("cloud/components/button");
	
    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options){
            $super(options);
            this.draw();
        	this._renderBtn();
        },
    	draw:function(){
    		  var self = this;
    		  var $htmls = $("<div></div>" +
    	              "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
    	              "<div style='float:left;margin-left: 2px;'>" +
                      "<select id='search'  name='search' style='width:100px;height: 28px; margin-left: -3px;'>" +
                      "<option value='0'>" + locale.get({lang: "numbers"}) + "</option>" +
                      "<option value='1'>" + locale.get({lang: "site"}) + "</option>" +
                      "</select>&nbsp;&nbsp;" +
                      "</div>" +
                      "<div style='float:left;margin-left:8px;'>" +
                      "<input style='width:140px; margin-left: -9px;' type='text'  id='searchValue' />" +
                      "</div>&nbsp;&nbsp;" +
    	              "<span style='margin-right: 10px;'>"+locale.get({lang:"show_days"})+":</span>"+
    	              "<input style='width:60px;height:22px;padding:1px;' type='number'  id='days' value='21' max= '30' min='1'/>" +
    		  		"</div>");
              this.element.append($htmls);
		},
        _renderBtn: function(){
            var self = this;
            //查询
            var queryBtn = new Button({
                text: locale.get({lang: "query"}),
                container: $("#search-bar"),
                events: {
                    click: function() {
                        self.fire("query");
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
            if(permission.app("optimization_list").read){
            	if(queryBtn) queryBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            }
            $("#search-bar a").css({
                margin: "-3px 0px 0px 6px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
