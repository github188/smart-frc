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
            this.status = options.status;
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
              "<label style='margin:auto 10px auto 10px'>"+locale.get({lang:"name1"})+" </label>" +
              "<input style='width:200px' type='text'  id='name' />&nbsp;&nbsp;"  +
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
            var stopBtn = new Button({
                text: locale.get({lang:"variablestop"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	self.fire("stop");
                    }
                }
            });
            var activeBtn = new Button({
                text: locale.get({lang:"discount_activate"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	self.fire("active");
                    }
                }
            });
            if(this.status == 2){
            	if(editBtn) editBtn.hide();
            	if(deleteBtn) deleteBtn.hide();
            	if(activeBtn) activeBtn.hide();
            }else if(this.status == 3){
            	if(addBtn) addBtn.hide();
            	if(editBtn) editBtn.hide();
            	if(deleteBtn) deleteBtn.hide();
            	if(stopBtn) stopBtn.hide();
            	if(activeBtn) activeBtn.hide();
            }else if(this.status == 1){
            	if(addBtn) addBtn.hide();
            	if(stopBtn) stopBtn.hide();
            	
            }
//            if(permission.app("lottery_configuration").read){
//            	if(queryBtn) queryBtn.show();
//            }else{
//            	if(queryBtn) queryBtn.hide();
//            }
//            if(permission.app("lottery_configuration").write){
//            	if(addBtn) addBtn.show();
//            	if(editBtn) editBtn.show();
//            	if(deleteBtn) deleteBtn.show();
//            }else{
//            	if(addBtn) addBtn.hide();
//            	if(editBtn) editBtn.hide();
//            	if(deleteBtn) deleteBtn.hide();
//            }
            $("#search-bar a").css({
                margin: "auto 10px auto 10px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
