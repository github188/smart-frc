define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
	var Button = require("cloud/components/button");
    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options){
            $super(options);
			this._render();
        },
        _render: function(){
        	this.draw();
        	this._renderBtn();
        },
    	draw:function(){
    		  var self = this;
              var $htmls = $(+"<div></div>" +
              "<div id='search-bar' style='width:auto; margin-top: 9px;text-align: right;'>" +
              "</div>");
              this.element.append($htmls);
		},
        _renderBtn: function(){
            var self = this;
            //查询
            var queryBtn = new Button({
                text: locale.get({lang:"the_binding_operators_of_wechat"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                        self.fire("add");
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
            
            $("#search-bar a").css({
                margin: "-3px 10px 0px 6px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
