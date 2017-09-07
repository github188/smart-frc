define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./updateActivity.html");
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
			this.activityId = options.ids;
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.activityWindow = new _Window({
				container: "body",
				title: locale.get({lang:"price_update_activity"}),
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
					},
					scope: this
				}
			});
			this.activityWindow.show();	
			$("#nextBase").val(locale.get({lang:"next_step"}));
			this._renderSelect();
			this._getData();
			this._renderBindEvent();
		},
		_getData:function(){
			cloud.util.mask("#baseInfo");
			Service.getActivite(this.activityId,function(data){
				$("#activity_name").val(data.result.name);//活动名称
				var startTime= cloud.util.dateFormat(new Date(data.result.startTime), "yyyy-MM-dd hh:mm:ss");
				$("#startTime2").val(startTime);//开始时间
				if(data.result.endTime){
					var endtime= cloud.util.dateFormat(new Date(data.result.endTime), "yyyy-MM-dd hh:mm:ss");
					$("#endTime2").val(endtime);//结束时间
					$("#nolimitTime2").removeAttr("checked","checked");
					$("#endTime2").removeAttr("disabled","disabled");
				}else{
					$("#nolimitTime2").attr("checked","checked");
					$("#endTime2").attr("disabled","disabled");
					$("#endTime2").val(locale.get({lang:"none"}));
				}
				
				$("#descript").val(data.result.descript);//描述
				cloud.util.unmask("#baseInfo");
			});
		},
		_renderBindEvent:function(){
			var self = this;
			$("#endTime2").bind("blur",function(){
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
				   if($("#endTime2").attr("disabled")){
					   $("#endTime2").val(cloud.util.dateFormat(new Date(((new Date()).getTime() + 1000 * 60 * 60 * 24 * 7)/1000),"yyyy/MM/dd") + " 23:59").datetimepicker({
							format:'Y/m/d H:i',
							step:1,
							lang:locale.current() === 1 ? "en" : "ch"
						})
					   $("#endTime2").removeAttr("disabled","disabled");
				   }else{
					   $("#endTime2").val(locale.get({lang:"none"}));
					   $("#endTime2").attr("disabled","disabled");
			           
				   }
		    });
			//点击下一步
			$("#nextBase").bind("click",function(){
				var name=$("#activity_name").val();//活动名称
				var startTime=$("#startTime2").val();//开始时间
				var endTime=$("#endTime2").val();//结束时间
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
			    self.updateActivityBaseInfo(activityData);
			});
		},
		updateActivityBaseInfo:function(activityData){
			var self = this;
			Service.updateActivityInfo(self.activityId,activityData,function(data) {
				$("#deviceConfig").css("display","block");
				$("#baseInfo").css("display","none");
				$("#tab1").removeClass("active");
				$("#tab2").addClass("active");
				self._renderDeviceConfig(data);
			});
		},
		//售货机
		_renderDeviceConfig:function(data){
			var self = this;
			this.deviceConfig = new deviceConfigInfo({
      			selector:"#deviceConfig",
      			activityId:data.result._id,
      			automatInfo:data.result.automatInfo,
      			goodsInfo:data.result.goodsInfo,
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
				$("#startTime2").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 00:00").datetimepicker({
					format:'Y/m/d H:i',
					step:1,
					startDate:'-1970/01/08',
					lang:locale.current() === 1 ? "en" : "ch"
				})
				$("#endTime2").val(cloud.util.dateFormat(new Date(((new Date()).getTime() + 1000 * 60 * 60 * 24 * 7)/1000),"yyyy/MM/dd") + " 23:59").datetimepicker({
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