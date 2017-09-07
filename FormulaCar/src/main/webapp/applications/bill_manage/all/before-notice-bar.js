define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
	var Button = require("cloud/components/button");
	var Service = require("./service");
    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options){
            $super(options);
			this._render();
        },
        _render: function(){
        	this.draw();
        	this._renderBtn();
        	this._renderBillState();
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
                   "<label style='margin:auto 10px auto 10px;margin-right: 6px;'>"+locale.get({lang:"bill_type"})+" </label>" +
                    "<select id='type'  name='type' multiple='multiple' style='width:100px;height: 28px;'>" +
                    "</select>" +
                 "</td>"+
                 "<td>"+
                   "<label style='margin:auto 10px auto 10px;margin-right: 6px;'>"+locale.get({lang:"bill_state"})+" </label>" +
                   "<select id='state'  name='state' multiple='multiple' style='width:100px;height: 28px;'>" +
                   "</select>" +
                 "</td>"+
                 "<td>"+
                    "<div id='btn-bar'></div>"+
                 "</td>"+
                 "</tr>"+
              "</table>"+
              "</div>");
              this.element.append($htmls);
              
              require(["cloud/lib/plugin/jquery.multiselect"], function() {
	                $("#state").multiselect({
	                    header: true,
	                    checkAllText: locale.get({lang: "check_all"}),
	                    uncheckAllText: locale.get({lang: "uncheck_all"}),
	                    noneSelectedText: locale.get({lang: "bill_please_select_billstate"}),
	                    selectedText: "# " + locale.get({lang: "is_selected"}),
	                    minWidth: 150,
	                    height: 120
	                });
	                $("#type").multiselect({
	                    header: true,
	                    checkAllText: locale.get({lang: "check_all"}),
	                    uncheckAllText: locale.get({lang: "uncheck_all"}),
	                    noneSelectedText: locale.get({lang: "bill_please_select_brforebillstate"}),
	                    selectedText: "# " + locale.get({lang: "is_selected"}),
	                    minWidth: 150,
	                    height: 120
	                });
	         });
              
		},
		_renderBillState:function(){
			
			 $("#type").append(
	             "<option value='1'>续费</option>"
	         );
		     $("#type").append(
	              "<option value='2'>增点</option>"
	         );
			
			 $("#state").append(
                    "<option value='0'>"+locale.get({lang:"bill_not_paying"})+"</option>"
            );
			 $("#state").append(
                    "<option value='1'>"+locale.get({lang:"bill_paying"})+"</option>"
            );
			 
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
