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
			this.service=options.service;
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
              "<div id='search-bar' style='width:auto;margin-top:3px'>" +
              "<label style='margin:auto 10px auto 10px'>"+locale.get({lang:"ssName"})+" </label>" +
              "<input style='width:150px' type='text'  id='name' />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"  +
              "<label style='margin:auto 10px auto 10px'>"+locale.get({lang:"time_of_order"})+" </label>" +
			  "<label class='notice-bar-calendar-text'>"+locale.get({lang:"from"})+"</label>&nbsp;&nbsp;"+
			  "<input style='width:125px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='startTime' />&nbsp;&nbsp;"+
			  "<label class='notice-bar-calendar-text'>"+locale.get({lang:"to"})+"</label>&nbsp;&nbsp;"+
			  "<input style='width:125px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='endTime' />"+
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
			});
		},
        _renderBtn: function(){
            var self = this;
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	var name=$("#name").val();
                    	var startTime = $("#startTime").val();
                        var endTime = $("#endTime").val();
                        self.fire("query", name ,startTime,endTime);
                    }
                }
            });
            this.exportButton = new Button({
                container: $("#search-bar"),
                id: "exportBtn",
                text: locale.get({lang:"export"}),
                imgCls : "cloud-icon-daochu",
                lang:"{text:export}",
                events: {
                    click: function(){
                    	var name=$("#name").val();
                    	var startTime = $("#startTime").val();
                        var endTime = $("#endTime").val();
                        self._exportReports(name,startTime,endTime);
                    }
                }
            });
            $("#search-bar a").css({
                margin: "auto 10px auto 10px"
            });
        },
		
        _exportReports:function(ssName,startTime,endTime){
        	service.getUserMessage(function(data) {
				 if(data.result){
					 var oid = data.result.oid;//机构ID
					 var url="/purchase_rainbow/yt/purchase/order/export?ssName="+ssName+"&startTime="+startTime+"&endTime="+endTime+"&oid="+oid;
					 window.open(url);
				 }
			});
		}       
    });
    
    return NoticeBar;
    
});
