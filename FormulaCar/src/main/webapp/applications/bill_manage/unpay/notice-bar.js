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
              "<table>"+
                "<tr>"+
                 "<td>"+
                   "<label style='margin:auto 10px auto 10px;margin-right: 6px;'>"+locale.get({lang:"bill_no"})+" </label>" +
                   "<input style='width:100px;' type='text'  id='billNo' />"  +
                 "</td>"+
                 "<td>"+
                    "<div id='btn-bar'></div>"+
                 "</td>"+
                 "</tr>"+
              "</table>"+
              "</div>");
              this.element.append($htmls);
		},
        _renderBtn: function(){
            var self = this;
            //查询
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#btn-bar"),
                events: {
                    click: function(){
                        self.fire("query");
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
            
            var seeBtn = new Button({
                text: locale.get({lang:"view"}),
                container: $("#btn-bar"),
                events: {
                    click: function(){
                        self.fire("see");
                    }
                }
            });
            $("#"+seeBtn.id).addClass("readClass");

            $("#search-bar a").css({
                margin: "-3px 0px 0px 6px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
