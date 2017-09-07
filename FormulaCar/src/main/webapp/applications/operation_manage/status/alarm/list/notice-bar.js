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
              "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
			  "<label class='notice-bar-calendar-text'>"+locale.get({lang:"create_time"})+"</label>&nbsp;&nbsp;"+
			  "<input style='width:125px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='times_date' />&nbsp;&nbsp;"+
			  "<label class='notice-bar-calendar-text'>-</label>&nbsp;&nbsp;"+
			  "<input style='width:125px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='times_enddate' />&nbsp;&nbsp;"+
			  "<select id='type'  name='type' style='width:100px;  height: 28px; border-radius: 4px;'>"+
              "<option value='0'>"+locale.get({lang:"all"})+"</option>"+
              "<option value='1'>"+locale.get({lang:"remind"})+"</option>"+
              "<option value='2'>"+locale.get({lang:"alarm"})+"</option>"+
              "</select>&nbsp;&nbsp;"+
              "<select id='search'  name='search' style='width:128px;  height: 28px; border-radius: 4px;'>"+
              "<option value='0'>"+locale.get({lang:"site_name"})+"</option>"+
              "<option value='1'>"+locale.get({lang:"automat_assetId"})+"</option>"+
              "</select>&nbsp;&nbsp;"+
              "<input style='width:200px' type='text'  id='searchValue' />"  +
              "</div>");
              this.element.append($htmls);
		},
		_renderSelect:function(){
			$(function(){
				$("#times_date").val(cloud.util.dateFormat(new Date(((new Date()).getTime())/1000),"yyyy/MM/dd")).datetimepicker({
					format:'Y/m/d',
					step:1,
					startDate:'-1970/01/08',
					timepicker: false,
					lang:locale.current() === 1 ? "en" : "ch"
				})
				
				$("#times_date").val("");
			});
			$(function(){
				$("#times_enddate").val(cloud.util.dateFormat(new Date(((new Date()).getTime())/1000),"yyyy/MM/dd")).datetimepicker({
					format:'Y/m/d',
					step:1,
					startDate:'-1970/01/08',
					timepicker: false,
					lang:locale.current() === 1 ? "en" : "ch"
				})
				
				$("#times_enddate").val("");
			});
		},
        _renderBtn: function(){
            var self = this;
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                        var type=$("#type").val();
                        var startTime=$("#times_date").val();
                        var endTime=$("#times_enddate").val();
                        var start = '';
                        var end = '';
                        if((startTime!=""&&endTime=="")||startTime==""&&endTime!=""){
                        	dialog.render({lang: "time_is_not_null"});
                        	return;
                        }
                        if(startTime != ''){
                        	start = (new Date(startTime + " 00:00:00")).getTime() / 1000;
                        }
                        if(endTime!=""){
                            end = (new Date(endTime + " 23:59:59")).getTime() / 1000;
                        }   
                        if(start!=""&&end!=""&&end<start){
                        	dialog.render({lang: "start_date_cannot_be_greater_than_end_date"});	
                        	return;
                        }
                        var search=$("#search").val();
                        var searchValue=$("#searchValue").val();
                        self.fire("query",type,start,end,search,searchValue);
                    }
                }
            });
            if(permission.app("event_list").read){
            	if(queryBtn) queryBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            }
//            var deleteBtn = new Button({
//                text: locale.get({lang:"manual_removal"}),
//                container: $("#search-bar"),
//                events: {
//                    click: function(){
//                    	
//                        self.fire("update");
//                    }
//                }
//            });
           
            $("#search-bar a").css({
                margin: "auto 2px auto 10px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
