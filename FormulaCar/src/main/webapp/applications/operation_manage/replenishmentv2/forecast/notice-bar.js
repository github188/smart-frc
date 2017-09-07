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
        },
    	draw:function(){
    	   	 var self = this;
    		 Service.getUserMessage(function(data) {
				 if(data.result){
					 var userId = data.result._id;
					 Service.getLineInfoByUserId(userId,function(data){
						  var lineData = data;;
						  self._renderForm(lineData);
						  self._renderBtn();
						  //self._renderSelect();
					 });
				 }
			  });
		},
		_renderForm:function(lineData){
			var $htmls = $(+"<div></div>" +
  	              "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
  	                /*"<div style='margin-left:5px;float:left;'>"+
  	                   "<label class='notice-bar-calendar-text'>"+locale.get({lang:"automat_list_start_time"})+"</label>&nbsp;&nbsp;"+
  			           "<input style='width:125px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='startTime' />&nbsp;&nbsp;"+
  			           "<label class='notice-bar-calendar-text'>"+locale.get({lang:"automat_list_end_time"})+"</label>&nbsp;&nbsp;"+
  			           "<input style='width:125px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='endTime' />&nbsp;&nbsp;"+
                    "</div>"+*/
  	               "<div style='margin-left:5px;float:left;'>"+
                     "<select  id='userline'  multiple='multiple'  style='width:130px;height: 28px;'></select>&nbsp;&nbsp;"+//线路
                   "</div>"+
                   "<div style='float:left;margin-left:5px;display:none'>"+
	                 "<select id='search'  name='search' style='width:128px;height: 28px;'>"+
 	                  "<option value='0'>"+locale.get({lang:"trade_automat_number"})+"</option>"+
 	                  "<option value='1'>"+locale.get({lang:"automat_site_name"})+"</option>"+
 	                 "</select>&nbsp;&nbsp;"+
 	              "</div>"+
	   	          "<div style='float:left;margin-left:5px;display:none'>"+
 	                 "<input style='width:120px;margin-left: -2px;' type='text'  id='searchValue' />"  +
 	              "</div>"+
 	              "<div id='buttonDiv' style='float:left;'></div>"+
  	              "</div>");
            this.element.append($htmls);
            
            require(["cloud/lib/plugin/jquery.multiselect"],function(){
				$("#userline").multiselect({ 
					header:true,
					checkAllText:locale.get({lang:"check_all"}),
					uncheckAllText:locale.get({lang:"uncheck_all"}),
					noneSelectedText:locale.get({lang:"automat_line"}),
					selectedText:"# "+locale.get({lang:"is_selected"}),
					minWidth:180,
					height:120
				});
	       });
         if(lineData && lineData.result.length > 0){
			 for(var i =0;i<lineData.result.length;i++){
				 $("#userline").append("<option value='" +lineData.result[i].id + "'>" +lineData.result[i].lineName+"</option>");
			 }
		 }
		},
		_renderSelect:function(){
			$(function(){
				$("#startTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 00:00").datetimepicker({
					format:'Y/m/d H:i',
					step:1,
					startDate:'-1970/01/08',
					lang:locale.current() === 1 ? "en" : "ch"
				});
				$("#endTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 23:59").datetimepicker({
					format:'Y/m/d H:i',
					step:1,
					lang:locale.current() === 1 ? "en" : "ch"
				});
				//$("#startTime").val("");
				//$("#endTime").val("");
			});
		},
        _renderBtn: function(){
            var self = this;
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#buttonDiv"),
                events: {
                    click: function(){
                         self.fire("query");
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
            var seeBtn = new Button({
                text: locale.get({lang:"replenish_forecast"}),
                container: $("#buttonDiv"),
                events: {
                    click: function(){
                         self.fire("see");
                    }
                }
            });
            $("#"+seeBtn.id).addClass("readClass");

            if(permission.app("replenish_forecast").read){
            	if(queryBtn) queryBtn.show();
            	if(seeBtn) seeBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            	if(seeBtn) seeBtn.hide();
            }
            
            $("#search-bar a").css({
                margin: "0px 6px auto 0px"
            });
        },
        destroy:function(){
        	$("#search-bar").html("");
        }
        
    });
    
    return NoticeBar;
    
});

