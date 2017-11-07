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
            		  "<div id='search-bar1' style='width:auto;margin:5px;'>" +
    	              "<select id='automatSearch'  name='search' style='width:100px;height: 28px;'>" +
    	              "<option value='0'>" + locale.get({lang: "automat_list_point_name"}) + "</option>" +
    	              "<option value='1'>" + locale.get({lang: "automat_list_point_number"}) + "</option>" +
    	              "</select>&nbsp;&nbsp;" +
    	              "<input style='width:200px;margin-right: 7px;' type='text'  id='automatValue' />" +
    	              "</div>");
              this.element.append($htmls);
		},
        _renderBtn: function(){
            var self = this;
            //查询
            var queryBtn1 = new Button({
                text: locale.get({lang:"query"}),
                container: $("#search-bar1"),
                events: {
                    click: function(){
                        self.fire("query");
                    }
                }
            });
            $("#search-bar a").css({
                margin: "auto 10px auto 10px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
