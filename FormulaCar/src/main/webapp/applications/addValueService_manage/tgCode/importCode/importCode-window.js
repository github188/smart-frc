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
				title: "导入员工卡号",
				top: "center",
				left: "center",
				height:190,
				width: 700,
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
		    $("#download_code").attr("href",host+"/FormulaCar/downloads/code.xls");
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
		    	var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
		    	var host = cloud.config.FILE_SERVER_URL;
				 var languge= localStorage.getItem("language");
		    	 var url = host + "/api/vmimports/tgcode"+ "?oid="+oid+"&languge="+languge+"&access_token="+cloud.Ajax.getAccessToken();
		    	 var options = {  
				         url:url,   
				         type:'post',   
				         success: function(data){
				        	 cloud.util.unmask("#windowFormID");
				        	 
				        	 if(data.result && data.result=="success"){
				        		 dialog.render({lang:"uploadcomplete"});
				        		 self.window.destroy();
				 	             self.fire("getcodeList");
				        	 }else if(data.error != null && data.error_code == "70031"){
				        		 
							     dialog.render({lang:"upload_files_data_not_null"});
				            	   
				        	 }else{
				        		 dialog.render({lang:"upload_files_failed"});
				        	 }
				         },
			             error:function(data){
				               if(data.error != null){
				            	   
				            	   if(data.error_code == "70031"){
							          dialog.render({lang:"upload_files_data_not_null"});
				            	   }else{
				            		  dialog.render({lang:"upload_files_failed"});
				            	   }
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