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
            		  "<div id='query-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
    	              "<select id='mediasSearch'  name='search' style='width:100px;height: 28px; border-radius: 4px;'>" +
    	              "<option value='0'>" + locale.get({lang: "material_name"}) + "</option>" +
    	              "<option value='1'>" + locale.get({lang: "ad_filename"}) + "</option>" +
    	              "</select>&nbsp;&nbsp;" +
    	              "<input style='width:200px;' type='text'  id='mediasValue' />" +
    	              "</div>");
              this.element.append($htmls);
		},
        _renderBtn: function(){
            var self = this;
            //查询
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#query-bar"),
                events: {
                    click: function(){
                        self.fire("query");
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
            if(permission.app("media_library").read){
            	if(queryBtn) queryBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            }
            $("#query-bar a").css({
                margin: "-3px 0px 0px 6px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
