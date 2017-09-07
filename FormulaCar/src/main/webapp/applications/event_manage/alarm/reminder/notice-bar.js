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
        	this.drawV2();
        },
        drawV2: function() {
            var self = this;
            self.draw();
            self._renderBtn();
        },
    	draw:function(lineData){
    		  var self = this;
    		  var $htmls = $(+"<div></div>" +
    				  "<div id='search-bar-reminder' style='width:auto;margin-top:5px;margin-left:5px;'>" +
    				  "<table>" +
    				  "<tr style='height: 35px;'>"+
    				   "<td>"+
    				      "<label style='margin:auto 10px auto 10px;margin-right: 6px;'>订阅者姓名</label>" +
    		              "<input style='width:100px;margin-right: -2px;' type='text'  id='names' />&nbsp;&nbsp;"  +
    				   "</td>"+
    				   "<td>"+
    				      "<label style='margin:auto 10px auto 10px;margin-right: 6px;'>手机号</label>" +
 		                 "<input style='width:100px;margin-right: -2px;' type='text'  id='phones' />&nbsp;&nbsp;"  +
 				       "</td>"+
 				        "<td>"+
				           "<label style='margin:auto 10px auto 10px;margin-right: 6px;'>邮箱</label>" +
		                   "<input style='width:100px;margin-right: -2px;' type='text'  id='emails' />&nbsp;&nbsp;"  +
				        "</td>"+
    				   "<td>"+
		   	               "<select id='type'  name='type'  multiple='multiple'  style='width:120px;  height: 28px; '>"+
		   	               "</select>&nbsp;&nbsp;"+
		   			   "</td>"+
	   				   "<td>"+
	   				   "<div id='button-bar'></div>"+
	   				   "</td>"+
    				  "</tr>"+
    				  "</table>"+
    		          "</div>");
              this.element.append($htmls);
              
              require(["cloud/lib/plugin/jquery.multiselect"], function() {
	                $("#type").multiselect({
	                    header: true,
	                    checkAllText: locale.get({lang: "check_all"}),
	                    uncheckAllText: locale.get({lang: "uncheck_all"}),
	                    noneSelectedText: "请选择要关注的告警类型",
	                    selectedText: "# " + locale.get({lang: "is_selected"}),
	                    minWidth: 200,
	                    height: 120
	                });
		     });
      	
	      	$("#type").append("<option value='9001'>"+locale.get({lang: "automat_system_failure"})+"</option>");
	      	$("#type").append("<option value='9002'>"+locale.get({lang: "automat_note_machine_fault"})+"</option>");
	      	$("#type").append("<option value='9003'>"+locale.get({lang: "automat_coin_device_failure"})+"</option>");
	      	$("#type").append("<option value='9004'>"+locale.get({lang: "automat_communication_failure"})+"</option>");
	      	$("#type").append("<option value='90051'>"+locale.get({lang: "network_connection_exception"})+"</option>");
	      	$("#type").append("<option value='90052'>"+locale.get({lang: "be_out_of_stock"})+"</option>");
	      	$("#type").append("<option value='90053'>流量告警</option>");
		},
        _renderBtn: function(){
            var self = this;
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#button-bar"),
                events: {
                    click: function(){
                        self.fire("query");
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
            
            var addBtn = new Button({
                text: locale.get({lang:"add"}),
                container: $("#button-bar"),
                events: {
                    click: function(){
                    	self.fire("add");
                    }
                }
            });
            var editBtn = new Button({
                text: locale.get({lang:"modify"}),
                container: $("#button-bar"),
                events: {
                    click: function(){
                    	self.fire("modify");
                    }
                }
            });
            var deleteBtn = new Button({
                text: locale.get({lang:"delete"}),
                container: $("#button-bar"),
                events: {
                    click: function(){
                    	self.fire("drop");
                    }
                }
            });
            if(permission.app("alarm_list").read){
            	if(queryBtn) queryBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            }
            $("#search-bar-reminder a").css({
                margin: "auto 6px auto 0px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
