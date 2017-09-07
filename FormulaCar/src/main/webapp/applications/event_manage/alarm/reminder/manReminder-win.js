define(function(require) {
    var cloud = require("cloud/base/cloud");
    var Common = require("../../../../common/js/common");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./manReminder-win.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../../service");
    var DevicelistInfo = require("./device/list");
    require("cloud/resources/css/jquery.multiselect.css");
    var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.id = options.id;
            this.deviceIds=options.deviceIds;
            this._renderWindow();
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.automatWindow = new _Window({
                container: "body",
                title: "告警订阅",
                top: "center",
                left: "center",
                height: 620,
                width: 1000,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                    "onClose": function() {
                        this.automatWindow.destroy();
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
            this.automatWindow.show();
            this.render();
        },
        render:function(){
        	
        	if(this.id){
        		this.getData();
        	}else{
        		this.renderAlarmType();
            	this.renderStyle();
        	}
        	this.renderBtn();
        },
        renderAlarmType:function(){
			require(["cloud/lib/plugin/jquery.multiselect"], function() {
	                $("#alarmtype").multiselect({
	                    header: true,
	                    checkAllText: locale.get({lang: "check_all"}),
	                    uncheckAllText: locale.get({lang: "uncheck_all"}),
	                    noneSelectedText: "请选择要关注的告警类型",
	                    selectedText: "# " + locale.get({lang: "is_selected"}),
	                    minWidth: 200,
	                    height: 120
	                });
		     });
        	
        	$("#alarmtype").append("<option value='9001'>"+locale.get({lang: "automat_system_failure"})+"</option>");
        	$("#alarmtype").append("<option value='9002'>"+locale.get({lang: "automat_note_machine_fault"})+"</option>");
        	$("#alarmtype").append("<option value='9003'>"+locale.get({lang: "automat_coin_device_failure"})+"</option>");
        	$("#alarmtype").append("<option value='9004'>"+locale.get({lang: "automat_communication_failure"})+"</option>");
        	$("#alarmtype").append("<option value='90051'>"+locale.get({lang: "network_connection_exception"})+"</option>");
        	$("#alarmtype").append("<option value='90052'>"+locale.get({lang: "be_out_of_stock"})+"</option>");
        	$("#alarmtype").append("<option value='90053'>流量告警</option>");
        },
        renderStyle:function(){
        	require(["cloud/lib/plugin/jquery.multiselect"], function() {
                $("#style").multiselect({
                    header: true,
                    checkAllText: locale.get({lang: "check_all"}),
                    uncheckAllText: locale.get({lang: "uncheck_all"}),
                    noneSelectedText: "请选择通知方式",
                    selectedText: "# " + locale.get({lang: "is_selected"}),
                    minWidth: 200,
                    height: 120
                });
	       });
        	
        	$("#style").append("<option value='1'>邮件</option>");
        	$("#style").append("<option value='2'>微信</option>");
        	$("#style").append("<option value='3'>短信</option>");
        	
        	$("#accept").val(0);
            $("#accept").attr("checked", true);
            $("#nextBase").css("display","none");
            $("#saveBtn").css("width","100%");
        },
        renderBtn:function(){
        	var self = this;
        	$("#alarmtype").bind('change',function(){
        		 var alarms = $("#alarmtype").multiselect("getChecked").map(function() {
                     return this.value;
                  }).get();
        		console.log(alarms);
        		if(alarms.indexOf("90053")>-1){
        			$("#thresholdTr").css("display","table-row");
        		}else{
        			$("#thresholdTr").css("display","none");
        		}
        	});
        	
        	$("#accept").bind('click',function(){
              	var temp = $(this).val();
              	if(temp == 1 || temp == "1"){
              		$("#accept").val(0);
              		$("#accept").attr("checked", true);
              		$("#tab2").css("display","none");
              		$("#nextBase").css("display","none");
              		$("#saveBtn").css("width","100%");
              	}else{
              		$("#accept").val(1);
              		$("#accept").removeAttr("checked");
              		$("#tab2").css("display","block");
              		$("#nextBase").css("display","inline");
              		$("#saveBtn").css("width","89%");
              	}
             });
        	
        	$("#saveBase1").bind('click',function(){
        		var name = $("#name").val();
        		var email = $("#email").val();
        		var phone = $("#phone").val();
        		var type  = $("#alarmtype").multiselect("getChecked").map(function() {
		                return this.value;
		        }).get();
        		var style = $("#style").multiselect("getChecked").map(function() {
		                return this.value;
		        }).get();
        		
        		var threshold = $("#threshold").val();
        		var deviceFlag = $("#accept").val();
        		
        		if(name==null || name==""){
        			 dialog.render({text: "请输入订阅者姓名"});
        			 return;
        		}
        		if(email==null || email==""){
       			     dialog.render({text: "请输入邮箱"});
       			     return;
       		    }
        		if(phone==null || phone==""){
       			     dialog.render({text: "请输入手机号"});
       			     return;
       		    }
        		if(type.length == 0){
        			dialog.render({text: "请至少选择一种要关注的告警类型"});
        			 return;
        		}
        		if(style.length == 0){
        			dialog.render({text: "请至少选择一种通知方式"});
        			 return;
        		}
        		
        		var finaData={
        				name:name,
        				email:email,
        				phone:phone,
        				type:type,
        				style:style,
        				threshold:threshold,
        				deviceFlag:deviceFlag
        		};
        		if(self.id){
        			Service.updateAlarmReminder(self.id,finaData,function(data){
            			console.log(data);
            			self.automatWindow.destroy();
            			self.fire("getReminderList");
            		});
        		}else{
        			Service.addAlarmReminder(finaData,function(data){
            			console.log(data);
            			self.automatWindow.destroy();
            		    self.fire("getReminderList");
            		});
        		}
        		
        	});
            $("#nextBase").bind('click',function(){
            	var name = $("#name").val();
        		var email = $("#email").val();
        		var phone = $("#phone").val();
        		var type  = $("#alarmtype").multiselect("getChecked").map(function() {
		                return this.value;
		        }).get();
        		var style = $("#style").multiselect("getChecked").map(function() {
		                return this.value;
		        }).get();
        		
        		var threshold = $("#threshold").val();
        		var deviceFlag = $("#accept").val();
        		
        		if(name==null || name==""){
       			     dialog.render({text: "请输入订阅者姓名"});
       			     return;
       		    }
       		    if(email==null || email==""){
      			     dialog.render({text: "请输入邮箱"});
      			     return;
      		    }
       		    if(phone==null || phone==""){
      			     dialog.render({text: "请输入手机号"});
      			     return;
      		    }
       		    if(type.length == 0){
       			     dialog.render({text: "请至少选择一种要关注的告警类型"});
       			     return;
       		    }
       		    if(style.length == 0){
       			     dialog.render({text: "请至少选择一种通知方式"});
       			     return;
       		    }
        		
        		var finaData={
        				name:name,
        				email:email,
        				phone:phone,
        				type:type,
        				style:style,
        				threshold:threshold,
        				deviceFlag:deviceFlag
        		};
            	
            	$("#devicelist").css("display", "block");
                $("#baseInfo").css("display", "none");
                $("#tab1").removeClass("active");
                $("#tab2").addClass("active");
                
                
                this.Devicelist = new DevicelistInfo({
                    selector: "#devicelistInfo",
                    automatWindow: self.automatWindow,
                    basedata:finaData,
                    id:self.id,
                    deviceIds:self.deviceIds,
                    events: {
                        "rendTableData": function() {
                            self.fire("getReminderList");
                        }
                    }
                });
        	});
        },
        getData:function(){
        	Service.getReminderById(this.id,function(data){
        		$("#name").val(data.result.name==null?"":data.result.name);
        		$("#email").val(data.result.email==null?"":data.result.email);
        		$("#phone").val(data.result.phone==null?"":data.result.phone);
        		$("#threshold").val(data.result.threshold==null?"":data.result.threshold);
        		var temp = data.result.deviceFlag;
        		if(temp == 0 || temp == "0"){
              		$("#accept").val(0);
              		$("#accept").attr("checked", true);
              		$("#tab2").css("display","none");
              		$("#nextBase").css("display","none");
              		$("#saveBtn").css("width","100%");
              	}else{
              		$("#accept").val(1);
              		$("#accept").removeAttr("checked");
              		$("#tab2").css("display","block");
              		$("#nextBase").css("display","inline");
              		$("#saveBtn").css("width","89%");
              	}
        		
        		
        		var type = data.result.type;
        		var style =  data.result.style;
        		
        		require(["cloud/lib/plugin/jquery.multiselect"], function() {
	                $("#alarmtype").multiselect({
	                    header: true,
	                    checkAllText: locale.get({lang: "check_all"}),
	                    uncheckAllText: locale.get({lang: "uncheck_all"}),
	                    noneSelectedText: "请选择要关注的告警类型",
	                    selectedText: "# " + locale.get({lang: "is_selected"}),
	                    minWidth: 200,
	                    height: 120
	                });
		        });
        	
	        	$("#alarmtype").append("<option value='9001'>"+locale.get({lang: "automat_system_failure"})+"</option>");
	        	$("#alarmtype").append("<option value='9002'>"+locale.get({lang: "automat_note_machine_fault"})+"</option>");
	        	$("#alarmtype").append("<option value='9003'>"+locale.get({lang: "automat_coin_device_failure"})+"</option>");
	        	$("#alarmtype").append("<option value='9004'>"+locale.get({lang: "automat_communication_failure"})+"</option>");
	        	$("#alarmtype").append("<option value='90051'>"+locale.get({lang: "network_connection_exception"})+"</option>");
	        	$("#alarmtype").append("<option value='90052'>"+locale.get({lang: "be_out_of_stock"})+"</option>");
	        	$("#alarmtype").append("<option value='90053'>流量告警</option>");
        		if (type && type.length > 0) {
                    for (var i = 0; i < type.length; i++) {
                        $('#alarmtype option').each(function() {
                            if (parseInt(type[i]) == parseInt(this.value)) {
                                this.selected = true;
                                if(this.value == "90053"){
                                	$("#thresholdTr").css("display","table-row");
                                }
                            }
                        });
                    }
                }
        		
        		require(["cloud/lib/plugin/jquery.multiselect"], function() {
                    $("#style").multiselect({
                        header: true,
                        checkAllText: locale.get({lang: "check_all"}),
                        uncheckAllText: locale.get({lang: "uncheck_all"}),
                        noneSelectedText: "请选择通知方式",
                        selectedText: "# " + locale.get({lang: "is_selected"}),
                        minWidth: 200,
                        height: 120
                    });
    	       });
            	
            	$("#style").append("<option value='1'>邮件</option>");
            	$("#style").append("<option value='2'>微信</option>");
            	$("#style").append("<option value='3'>短信</option>");
            	
        		if (style && style.length > 0) {
                    for (var i = 0; i < style.length; i++) {
                        $('#style option').each(function() {
                            if (style[i] == this.value) {
                                this.selected = true;
                            }
                        });
                    }
                }
        	});
        },
        destroy: function() {
            if (this.automatWindow) {
                this.automatWindow.destroy();
            } else {
                this.automatWindow = null;
            }
        }
    });
    return updateWindow;
});
