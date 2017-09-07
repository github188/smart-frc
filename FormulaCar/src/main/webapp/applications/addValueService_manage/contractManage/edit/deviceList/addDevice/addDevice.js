define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./addDevice.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	var service = require("../../../service");
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.flag = options.flag;
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.window = new _Window({
				container: "body",
				title: locale.get({lang:"add_device"}),
				top: "center",
				left: "center",
				height:300,
				width: 650,
				mask: true,
				drag:true,
				content: winHtml,
				events: {
					"onClose": function() {
							this.window.destroy();
							cloud.util.unmask();
					},
					scope: this
				}
			});
			this.window.show();	
			this._renderBtn();
			if(this.flag ==1){
				$("#rentAmount").val("400");
    			$("#serviceCharge").val("50");
    			$("#rentAmount").css("color","black");
        		$("#serviceCharge").css("color","black");
				$("#rentAmount").attr("readOnly",false);
    			$("#serviceCharge").attr("readOnly",false);  
			}else{
				$("#rentAmount").val("忽略此信息");
    			$("#serviceCharge").val("忽略此信息");
    			$("#rentAmount").css("color","#BDB7B7");
        		$("#serviceCharge").css("color","#BDB7B7");
				$("#rentAmount").attr("readOnly",true);
    			$("#serviceCharge").attr("readOnly",true);  
			}
		},
		_renderBtn:function(){
			var self = this;
			 //取消
		    $("#cancel").bind("click",function(){
		    	self.window.destroy();
		    });
            //保存
		    $("#input-submit").bind("click",function(){
		    	var assetId = $("#assetId").val();
		    	var rentAmount = $("#rentAmount").val();
		    	var serviceCharge = $("#serviceCharge").val();
		    	//判断售货机编号是否存在
		    	service.getDeviceByAssetId(assetId,function(data){
		    	  if(data&&data.result){
		    		  if(self.flag ==1){
				    		var deviceData={
					    			assetId:assetId,
					    			rentAmount:rentAmount,
					    			serviceCharge:serviceCharge
					    	};
				    		self.fire("deviceData",deviceData);
				    	}else{
				    		var deviceData={
					    			assetId:assetId,
					    			rentAmount:'',
					    			serviceCharge:''
					    	};
				    		self.fire("deviceData",deviceData);
				    	}
				        self.window.destroy();
		    	  }else{
		    		  dialog.render({lang: "device_assetId_is_not_exit"});
                      return;
		    	  }
		        });
		    	
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