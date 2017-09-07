define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./upload.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	var Service = require("../service");
	
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.window = new _Window({
				container: "body",
				title: locale.get({lang:"import"}),
				top: "center",
				left: "center",
				height:200,
				width: 750,
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
			var host = cloud.config.FILE_SERVER_URL;
			//console.log(host+"/FormulaCar/downloads/device.xls");
			$("#download_device").attr("href",host+"/FormulaCar/downloads/device.xls");
			this.window.show();	
			this._renderBtn();
		
		},
		_renderBtn:function(){
			var self = this;
		
			 //取消
		    $("#cancel").bind("click",function(){
		    	self.window.destroy();
		    });
            //保存
		    $("#input-submit").bind("click",function(){
		    	
		    	Service.getUserMessage(function(data) {
						 //console.log(data);
						 if(data.result){
							 var oid = data.result.oid;//机构ID
							 var host = cloud.config.FILE_SERVER_URL;
							 var languge= localStorage.getItem("language");
					    	 var url = host + "/api/vmimports/devices"+ "?oid="+oid+"&languge="+languge+"&access_token="+cloud.Ajax.getAccessToken();
					    	 var options = {  
							         url:url,   
							         type:'post',   
							         success: function(message){
							        	 cloud.util.unmask("#windowFormID");
							        	 //console.log(message);
							        	 if(message.result=="success"){
							        		 dialog.render({lang:"uploadcomplete"});
							        		 self.window.destroy();
							 	             self.fire("getDeviceList");
							        	 }else{
							        		 dialog.render({lang:"upload_files_failed"});
							        	 }
							         }
							 }; 
					    	 var uploadDoc = $("#doc").val();
							 if(uploadDoc){
								 cloud.util.mask("#windowFormID");
							     $("#windowFormID").ajaxSubmit(options);  
							 }else{
								 dialog.render({lang:"please_choose_to_upload_documents"});
							 }
					    	 
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