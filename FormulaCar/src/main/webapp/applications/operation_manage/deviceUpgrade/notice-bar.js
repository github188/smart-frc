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
                              "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
                                  "<label style='margin:auto 10px auto 10px'>"+locale.get({lang:"upgrade_name"})+" </label>" +
                                  "<input style='width:200px' type='text'  id='name' />"  +
                              "</div>");
              this.element.append($htmls);
		},
        _renderBtn: function(){
            var self = this;
            //查询
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                        self.fire("query");
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
            var addBtn = new Button({
                text: locale.get({lang:"add"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	self.fire("add");
                    }
                }
            });
            var editBtn = new Button({
                text: locale.get({lang:"modify"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	self.fire("modify");
                    }
                }
            });
            var deleteBtn = new Button({
                text: locale.get({lang:"delete"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	self.fire("drop");
                    }
                }
            });
            var deliveryBtn = new Button({
                text: locale.get({lang:"immediate_upgrade"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	self.fire("upgrade");
                    }
                }
            });
            if(permission.app("upgrade").read){
            	if(queryBtn) queryBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            }
            if(permission.app("upgrade").write){
            	if(addBtn) addBtn.show();
            	if(editBtn) editBtn.show();
            	if(deleteBtn) deleteBtn.show();
            	if(deliveryBtn) deliveryBtn.show();
            }else{
            	if(addBtn) addBtn.hide();
            	if(editBtn) editBtn.hide();
            	if(deleteBtn) deleteBtn.hide();
            	if(deliveryBtn) deliveryBtn.hide();
            }
            $("#search-bar a").css({
                margin: "-3px 0px 0px 6px"
            });
        }
    });
    return NoticeBar;
});
