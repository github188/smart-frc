define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./addActivity.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	var Service = require("../../../service");
	var deviceConfigInfo = require("./device/deviceConfig");
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.activityId = null;
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.activityWindow = new _Window({
				container: "body",
				title: locale.get({lang:"price_add_activity"}),
				top: "center",
				left: "center",
				height:620,
				width: 1000,
				mask: true,
				drag:true,
				content: winHtml,
				events: {
					"onClose": function() {
							this.activityWindow.destroy();
							cloud.util.unmask();
							if(this.activityId){
								Service.deleteActivityById(this.activityId,function(data) {
								});
							}
					},
					scope: this
				}
			});
			this.activityWindow.show();	
			$("#nextBase").val(locale.get({lang:"next_step"}));
			this._renderSelect();
			this._renderBindEvent();
		},
		_renderBindEvent:function(){
			var self = this;
			$("#endTime1").bind("blur",function(){
				var startTime=$("#startTime1").val();//开始时间
				var endTime=$("#endTime1").val();//结束时间
				if(endTime){
					if(endTime<startTime){
						dialog.render({lang:"endtime_greater_starttime"});
					}
				}
			});
			//不限时间
			$("#nolimitTime").click(function(){
				   if($("#endTime1").attr("disabled")){
					   $("#endTime1").val(cloud.util.dateFormat(new Date(((new Date()).getTime() + 1000 * 60 * 60 * 24 * 7)/1000),"yyyy/MM/dd") + " 23:59").datetimepicker({
							format:'Y/m/d H:i',
							step:1,
							lang:locale.current() === 1 ? "en" : "ch"
						})
					   $("#endTime1").removeAttr("disabled","disabled");
				   }else{
					   $("#endTime1").val(locale.get({lang:"none"}));
					   $("#endTime1").attr("disabled","disabled");
			           
				   }
		    });
			//点击下一步
			$("#nextBase").bind("click",function(){
				var name=$("#activity_name").val();//活动名称
				var startTime=$("#startTime1").val();//开始时间
				var endTime=$("#endTime1").val();//结束时间
				var descript=$("#descript").val();//描述
				//对开始时间和结束时间进行处理
				var start = new Date(startTime).getTime()/1000;
				var end ='';
				if(endTime == locale.get({lang:"none"})){
					endTime ='';
				}
				if(endTime){
					end = new Date(endTime).getTime()/1000;
				}else{
					end ='';
				}
				
				//活动名称不能为空
				if(name == null||name == ""){
					dialog.render({lang:"automat_activity_error"});
					return;
				}
				//判断开始时间和结束时间的大小
				if(endTime){
					if(endTime>startTime){
					}else{   //开始时间 大于 结束时间
						dialog.render({lang:"endtime_greater_starttime"});
						return;
					}
				}else{//不限时间
				}
				//页面获取到的信息
				var activityData={
						name:name,
						startTime:start,
						endTime:end,
						descript:descript
				};
				if(self.activityId == null){
					self.addActivityBaseInfo(activityData);
				}else{
					self.updateActivityBaseInfo(activityData);
				}
			});
		},
		addActivityBaseInfo:function(activityData){
			var self = this;
			Service.addActivityInfo(activityData,function(data) {
				self.activityId = data.result._id;
				self._renderDeviceConfig(data.result._id);
				$("#deviceConfig").css("display","block");
				$("#baseInfo").css("display","none");
				$("#tab1").removeClass("active");
				$("#tab2").addClass("active");
			});
		},
		updateActivityBaseInfo:function(activityData){
			var self = this;
			Service.updateActivityInfo(self.activityId,activityData,function(data) {
				$("#deviceConfig").css("display","block");
				$("#baseInfo").css("display","none");
				$("#tab1").removeClass("active");
				$("#tab2").addClass("active");
			});
		},
		//售货机
		_renderDeviceConfig:function(activityId){
			var self = this;
			this.deviceConfig = new deviceConfigInfo({
      			selector:"#deviceConfig",
      			activityId:activityId,
      			activityWindow:self.activityWindow,
      			events : {
      				"getActivityList":function(){
      					self.fire("getList");
      				}
      			}
      	  });
		},
		_renderSelect:function(){
			var self = this;
			$(function(){
				$("#startTime1").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 00:00").datetimepicker({
					format:'Y/m/d H:i',
					step:1,
					startDate:'-1970/01/08',
					lang:locale.current() === 1 ? "en" : "ch"
				})
				$("#endTime1").val(cloud.util.dateFormat(new Date(((new Date()).getTime() + 1000 * 60 * 60 * 24 * 7)/1000),"yyyy/MM/dd") + " 23:59").datetimepicker({
					format:'Y/m/d H:i',
					step:1,
					lang:locale.current() === 1 ? "en" : "ch"
				})
			});
		},
		destroy:function(){
			if(this.window){
				this.window.destroy();
			}else{
				this.window = null;
			}
		}
	});
	return Window;
});