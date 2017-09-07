define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
	var Button = require("cloud/components/button");
	var Service = require("../../service");
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
              "<div id='search-type-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
              "<label style='margin:auto 10px auto 10px;margin-right: 5px;'>"+locale.get({lang:"product_type_name"})+" </label>" +
              "<input style='width:200px' type='text'  id='typename' />&nbsp;&nbsp;"  +
              "</div>");
              this.element.append($htmls);
		},
        _renderBtn: function(){
            var self = this;
            //查询
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#search-type-bar"),
                events: {
                    click: function(){
                        self.fire("query");
                    }
                }
            });
            var addBtn = new Button({
                text: locale.get({lang:"add"}),
                container: $("#search-type-bar"),
                events: {
                    click: function(){
                    	self.fire("add");
                    }
                }
            });
            var editBtn = new Button({
                text: locale.get({lang:"modify"}),
                container: $("#search-type-bar"),
                events: {
                    click: function(){
                    	self.fire("modify");
                    }
                }
            });
            var deleteBtn = new Button({
                text: locale.get({lang:"delete"}),
                container: $("#search-type-bar"),
                events: {
                    click: function(){
                    	self.fire("drop");
                    }
                }
            });
            if(permission.app("dictionary_maintenance").read){
            	
            	if(queryBtn) queryBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            }
            if(permission.app("dictionary_maintenance").write){
            	if(addBtn) addBtn.show();
            	if(editBtn) editBtn.show();
            	if(deleteBtn) deleteBtn.show();
            }else{
            	if(addBtn) addBtn.hide();
            	if(editBtn) editBtn.hide();
            	if(deleteBtn) deleteBtn.hide();
            }
            $("#search-type-bar a").css({
                margin: "auto 10px auto 10px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
