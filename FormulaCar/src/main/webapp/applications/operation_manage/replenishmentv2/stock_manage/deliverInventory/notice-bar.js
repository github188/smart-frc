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
              "<label style='margin:auto 10px auto 10px'>"+locale.get({lang:"deliver_plan_number"})+" </label>" +
              "<input style='width:200px' type='text'  id='number' />"  +
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
            var catBtn = new Button({
                text: locale.get({lang: "price_see"}),
                container: $("#search-bar"),
                events: {
                    click: function() {
                        self.fire("see");
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
            if(permission.app("stock_management").read){
            	if(queryBtn) queryBtn.show();
            	if(catBtn) catBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            	if(catBtn) catBtn.show();
            }
            if(permission.app("stock_management").write){
            	if(editBtn) editBtn.show();
            	if(deleteBtn) deleteBtn.show();
            }else{
            	if(editBtn) editBtn.hide();
            	if(deleteBtn) deleteBtn.hide();
            }
            $("#search-bar a").css({
                margin: "-3px 0px 0px 6px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
