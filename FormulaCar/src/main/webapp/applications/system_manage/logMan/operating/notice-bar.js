define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/resources/css/jquery.multiselect.css");
	 require("cloud/lib/plugin/jquery.datetimepicker");
	var Button = require("cloud/components/button");
	var NoticeBar = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.pars=null;
			this._render();
		},
		_render:function(){
			this._draw();
			this._renderSelect();
		},
		
		_draw:function(){
			var self = this;
			var $htmls = $(
			  +"<div></div>"
			  +"<div id='behav-all' style='width:auto;float:left;margin-top:4px;margin-bottom: 4px;'>"
			  +"<label style='margin:5px 10px auto 15px;float:left;margin-right: 5px;' lang='text:from+:'>"+locale.get({lang:"from"})+"</label>"
			  +"<input style='width:125px;float:left;margin-top: 0;margin-right: -9px;' type='text' readonly='readonly' id='startTime' class='dateStyle' />"
			  +"<label style='margin:5px 10px auto 15px;float:left;margin-right: 6px;' lang='text:to+:'>"+locale.get({lang:"to"})+"</label>"
			  +"<input style='width:125px;float:left;margin-top: 0;' type='text' readonly='readonly' id='endTime' class='dateStyle' />"
			  +"</div>"
			  +"<div id='queryBtn' style='float:left;margin:4px auto auto 6px'></div>"
			  +"<div id='exportBtn' style='float:left;margin:4px auto auto 6px'></div>"
			);
			this.element.append($htmls);	
		},
		
		_renderSelect:function(){
			var self = this;
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
					$("#behav-all .ui-datepicker-trigger").css({'float':"left",margin:"4px 0 0 3px"});
			});
			var queryBtn = new Button({
            	container : "#queryBtn",
            	id : "notice-bar-querybtn",
            	text: locale.get({lang:"query"}),
            	events : {
            		click : self._queryFun.bind(this)
            	}
			});
			$("#"+queryBtn.id).addClass("readClass");
			if(permission.app("operation_log").read){
            	if(queryBtn) queryBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            }
			/*new Button({
            	container : "#exportBtn",
            	id : "notice-bar-exportbtn",
            	//imgCls : "cloud-icon-daochu",
            	text : "导出",
            	lang:"{title:export,text:export}",
            	events : {
            		click : self._reportExcel.bind(this)
            	}
            });*/
		},
		_reportExcel:function(){
			this.fire("exportExl");
		},
		_queryFun:function(){
			    var self = this;
				var startTime = new Date($( "#startTime" ).val()).getTime()/1000;
				var endTime = new Date($( "#endTime" ).val()).getTime()/1000;
				var is = self._checkFormat(startTime,endTime);
				var obj = {startTime:startTime,endTime:endTime};
				if(is == 0){
					self.fire("query",obj);
				}
//			});
		},
		_checkFormat:function(startTime,endTime){
			var isTrue = 0;
			if(startTime > endTime){
				dialog.render({lang:"start_date_cannot_be_greater_than_end_date+!"});
				isTrue += 1;
			}
			return isTrue;
		}
		
	});
	
	return NoticeBar;
	
});