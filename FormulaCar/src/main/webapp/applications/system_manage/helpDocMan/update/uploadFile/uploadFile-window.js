define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./upload.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	
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
				container: "#helpdocwin",
				title: locale.get({lang:"upload_files"}),
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
		    $("#upload-submit").bind("click",function(){
		    	var host = cloud.config.FILE_SERVER_URL;
		    	var uploadDoc = $("#doc").val();
		    	var url = host + "/mapi/helpdoc/ca/upload";
		    	var options = {  
				         url:url,   
				         type:'post',   
				         success: function(message){
				        	 cloud.util.unmask("#windowFormID");
				        	 if(message.result=="success"){
				        		 dialog.render({lang:"uploadcomplete"});
				        		 var filename=uploadDoc.substr(uploadDoc.lastIndexOf('\\')+1); 
				        		 self.fire("uploadSuccess",filename);
				        		 self.window.destroy();
				        	 }else{
				        		 dialog.render({lang:"upload_files_failed"});
				        	 }
				         }
				 }; 
		    	
				 if(uploadDoc){
					 console.log(uploadDoc);
					 var filename=uploadDoc.substr(uploadDoc.lastIndexOf('\\')+1);  
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