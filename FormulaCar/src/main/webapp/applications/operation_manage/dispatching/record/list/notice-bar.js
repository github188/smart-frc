define(function(require){
	var cloud = require("cloud/base/cloud");
	var Button = require("cloud/components/button");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options){
            $super(options);
			this._render();
        },
        _render: function(){
        	this._renderSearchInput();
        	this._renderSelect();
        	this._renderBtn();
        },
        _renderSearchInput:function(){
        	var selectHtml = "<select id='dispatching-record-select'>";
            var data2 = {"result":[{"optionsId":"0","optionsName":locale.get({lang:"all"})},
                                   {"optionsId":"1","optionsName":locale.get({lang:"automat_replenishment"})},
                                   {"optionsId":"2","optionsName":locale.get({lang:"automat_cash"})},
                                   {"optionsId":"3","optionsName":locale.get({lang:"automat_maintain"})},
                                   {"optionsId":"4","optionsName":locale.get({lang:"automat_fill_coin"})}
            					 ]};
            
            if(data2!=null&&data2.result!=null&&data2.result.length>0){
            	$.each(data2.result,function(n,item) {   
    				selectHtml = selectHtml + "<option value='" + item.optionsId + "' >" + item.optionsName + "</option>";
    			});
            }
            selectHtml = selectHtml + "</select>";
        	var $htmls = $(
                "<div id='search-bar' style='width:auto;margin-top:3px;margin-left:3px;'>" +
    			  "<label class='notice-bar-calendar-text'>"+locale.get({lang:"automat_list_start_time"})+"</label>&nbsp;&nbsp;"+
    			  "<input style='width:125px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='startTime' />&nbsp;&nbsp;"+
    			  "<label class='notice-bar-calendar-text'>"+locale.get({lang:"automat_list_end_time"})+"</label>&nbsp;&nbsp;"+
    			  "<input style='width:125px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='endTime' />&nbsp;&nbsp;"+
    			  selectHtml+
    			  "&nbsp;&nbsp;"+
                "<input style='width:100px' type='text'  id='' />&nbsp;&nbsp;"  +
                "</div>"
                );
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
			});
		},
        _renderBtn: function(){
            var self = this;
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#search-bar"),
                events: {
                }
            });
            $("#search-bar a").css({
                margin: "auto 10px auto 10px",
                "line-height":"25px"
            });
        }    
    });
    
    return NoticeBar;
    
});
