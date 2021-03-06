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
        	this._renderSelect();
        	this._renderBtn();
        },
    	draw:function(){
    		  var self = this;
              var $htmls = $(+"<div></div>" +
              "<div id='search-bar' style='width:auto;margin-top:3px;margin-left:3px;'>" +
              "<label style='margin:auto 10px auto 10px'>"+locale.get({lang:"price_activity_name"})+" </label>" +
              "<input style='width:200px' type='text'  id='name' />"  +
              "</div>");
              this.element.append($htmls);
		},
		_renderSelect:function(){
			$(function(){
				$("#startTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime() - 1000 * 60 * 60 * 24 * 7)/1000),"yyyy/MM/dd") + " 00:00").datetimepicker({
					format:'Y/m/d H:i',
					step:1,
					startDate:'-1970/01/08',
					lang:locale.current() === 1 ? "en" : "ch"
				})
				
				$("#endTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 23:59").datetimepicker({
					format:'Y/m/d H:i',
					step:1,
					lang:locale.current() === 1 ? "en" : "ch"
				})
				$("#startTime").val("");
				$("#endTime").val("");
			});
		},
        _renderBtn: function(){
            var self = this;
            //查询
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                        var name= $("#name").val();
                        self.fire("query",name);
                    }
                }
            });
            //查看
            var seeBtn = new Button({
                text: locale.get({lang:"price_see"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                        self.fire("see");
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
