define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
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
                      "<div style='float:left;margin-left:5px;' id='selecta'>" +
                      "<select id='online'  name='online' style='width:90px;height: 28px; border-radius: 4px;'>" +
                      "<option value='-1'>" + locale.get({lang: "online_state"}) + "</option>" +
                      "<option value='0'>" + locale.get({lang: "online"}) + "</option>" +
                      "<option value='1'>" + locale.get({lang: "offline"}) + "</option>" +
                      "</select>" +
                      "</div>" +
                      "<div style='float:left;margin-left: 10px;'>" +
                      "<select id='search'  name='search' style='width:120px;height: 28px; border-radius: 4px; margin-left: -3px;'>" +
                      "<option value='0'>" + locale.get({lang: "automat_no1"}) + "</option>" +
                      "<option value='1'>" + locale.get({lang: "gateway_name"}) + "</option>" +
                      "</select>&nbsp;&nbsp;" +
                      "</div>" +
                      "<div style='float:left;'>" +
                      "<input style='width:120px; margin-left: -1px;' type='text'  id='searchValue' />" +
                      "</div>" +
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
            //权限控制按钮的显隐
            if(permission.app("automat_list").read){
            	if(queryBtn) queryBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            }
            $("#search-bar a").css({
                margin: "auto 0px auto 10px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
