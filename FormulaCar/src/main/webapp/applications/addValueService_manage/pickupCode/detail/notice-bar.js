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
              "<div id='search-bar-detail' style='width:auto;margin-top:5px;margin-left:5px;'>" +
              "<label style='margin:auto 10px auto 10px'>"+locale.get({lang:"product_status"})+" </label>" +
              "<select  id='status' name='status' style='width:180px;height: 28px;'>" + 
              "<option value='-1'>" + locale.get({lang: "please_select"}) + "</option>" +
              "<option value='0'>" + locale.get({lang: "can_use"}) + "</option>" +
              "<option value='1'>" + locale.get({lang: "not_geted"}) + "</option>" +
              "</select>&nbsp;&nbsp;" +
              "</div>");
              this.element.append($htmls);
		},
        _renderBtn: function(){
            var self = this;
            //查询
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#search-bar-detail"),
                events: {
                    click: function(){
                        self.fire("query");
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
            
           
            var editBtn = new Button({
                text: locale.get({lang:"pickupcode_revoke"}),
                container: $("#search-bar-detail"),
                events: {
                    click: function(){
                    	self.fire("modify");
                    }
                }
           });
            
            if(permission.app("pickup_code_management").write){
            	if(editBtn) editBtn.show();
            	
            }else{
            	if(editBtn) editBtn.hide();
            	
            }
            $("#search-bar a").css({
                margin: "-3px 0px 0px 6px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
