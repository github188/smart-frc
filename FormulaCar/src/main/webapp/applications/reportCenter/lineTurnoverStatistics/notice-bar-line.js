define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
	var Button = require("cloud/components/button");
	var Service = require("../service");
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
              "<label style='margin:auto 10px auto 10px ;margin-right: 6px;'>"+locale.get({lang:"time"})+" </label>" +
              "<input style='width:120px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='startTime' />"+
              "<label style='margin:auto 10px auto 10px ;margin-right: 6px;'>~</label>" +
              "<input style='width:120px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='endTime' />"+
              "<label style='margin:auto 10px auto 10px ;margin-right: 6px;'>"+locale.get({lang:"line_man_name"})+" </label>" +
              "<input style='width:200px;' type='text'  id='lineName' />"  +
             
              "</div>");
              this.element.append($htmls);
		},
		_renderSelect:function(){
			$(function(){
				$("#startTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime() - 1000 * 60 * 60 * 24 * 6)/1000),"yyyy/MM/dd")).datetimepicker({
                    format: 'Y/m/d',
                    step: 1,
                    startDate: '-1970/01/08',
                    lang: locale.current() === 1 ? "en" : "ch",
                    timepicker: false,
                    onShow: function() {
                        $(".xdsoft_calendar").show();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    },
                    onClose: function(a, b) {
                    	var date = new Date(new Date($("#startTime").val()).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    },
                });
				$("#endTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000),"yyyy/MM/dd")).datetimepicker({
                    format: 'Y/m/d',
                    step: 1,
                    startDate: '-1970/01/08',
                    lang: locale.current() === 1 ? "en" : "ch",
                    timepicker: false,
                    onShow: function() {
                        $(".xdsoft_calendar").show();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    },
                    onClose: function(a, b) {
                    	var date = new Date(new Date($("#endTime").val()).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    },
                });
				$("#startTime").change(function(){ 
					var startTime = $("#startTime").val();
	 				$("#endTime").val(cloud.util.dateFormat(new Date(((new Date(startTime)).getTime()+1000 * 60 * 60 * 24 * 6)/1000),"yyyy/MM/dd"));
				});
				$("#endTime").change(function(){ 
					var endTime = $("#endTime").val();
	 				$("#startTime").val(cloud.util.dateFormat(new Date(((new Date(endTime)).getTime()-1000 * 60 * 60 * 24 * 6)/1000),"yyyy/MM/dd"));
				});
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
                        self.fire("query");
                    }
                }
            });
            
            $("#"+queryBtn.id).addClass("readClass");
            
            var exportBtn = new Button({
                text: locale.get({lang: "export"}),
                container: $("#search-bar"),
                events: {
                    click: function() {
                        self.fire("exReport");
                    }
                }
            });
            $("#"+exportBtn.id).addClass("readClass");
           
            $("#search-bar a").css({
                margin: "-3px 0px 0px 6px"
            });
           
        }
        
    });
    
    return NoticeBar;
    
});
