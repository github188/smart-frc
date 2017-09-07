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
              "<label style='margin:auto 10px auto 10px'>"+locale.get({lang:"organization_name"})+" </label>" +
              "<input style='width:200px' type='text'  id='name' />&nbsp;&nbsp;"  +
              "<label style='margin:auto 10px auto 10px'>"+locale.get({lang:"email"})+" </label>" +
              "<input style='width:200px' type='text'  id='email' />&nbsp;&nbsp;"  +
              "<label style='margin:auto 10px auto 10px'>付费方式:</label>"+
              "<select id='payStyles' style='height: 30px;width: 200p x;'>"+
                "<option value='0'>所有付费方式</option>"+
                "<option value='1'>后付费</option>"+
                "<option value='2'>预付费</option>"+
              "</select>&nbsp;&nbsp;"+
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
            this.editBtn = new Button({
                text: locale.get({lang:"modify"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	self.fire("modify");
                    }
                }
            });
            $("#search-bar a").css({
                margin: "-3px 0px 0px 6px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
