define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./helpDocManage-win.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	var Service = require("../../service");
	var UploadFile  = require("./uploadFile/uploadFile-window");
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.docId = options.docId;
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			var title="上传帮助文档";
			if(this.docId ){
				title="修改已上传的帮助文档";
			}
			this.helpwindow = new _Window({
				container: "body",
				title: title,
				top: "center",
				left: "center",
				height:280,
				width: 950,
				mask: true,
				drag:true,
				content: winHtml,
				events: {
					"onClose": function() {
							this.helpwindow.destroy();
							cloud.util.unmask();
					},
					scope: this
				}
			});
	        $("#fileSize").append("<label>"+locale.get('file_size')+"</label>");
	        $("#fileInput").append("<input type='text' id='filename' name='filename'  placeholder='"+locale.get('file_tip')+"'  style='width: 270px;'/>");
			this.helpwindow.show();	
			this._renderBtn();
		    if(this.docId){
		    	this._renderGetData();
		    }
		},
		_renderBtn:function(){
			var self = this;
			var regular = /^([^\`\+\~\!\#\$\%\^\&\*\(\)\|\}\{\=\"\'\！\￥\……\（\）\——]*[\+\~\!\#\$\%\^\&\*\(\)\|\}\{\=\"\'\`\！\?\:\<\>\•\“\”\；\‘\‘\〈\ 〉\￥\……\（\）\——\｛\｝\【\】\\\/\;\：\？\《\》\。\，\、\[\]\,]+.*)$/;
			 
			$("#filesUpload").click(function(){
         		if (this.uploadPro) {
                     this.uploadPro.destroy();
                 }
                 this.uploadPro = new UploadFile({
                     selector: "body",
                     events: {
                         "uploadSuccess":function(filename) {
                         	$("#filename").css("display","block");
                         	$("#filename").text(filename);
                         }
                     }
                 });
         	});
			
			 //取消
		    $("#cancel").bind("click",function(){
		    	self.helpwindow.destroy();
		    });
            //保存
		    $("#input-submit").bind("click",function(){
		    	 var fileName = $("#fileName").val();
		    	 var description = $("#description").val();
		    	 var filename = $("#filename").text();
		    	 
                 if(fileName==null || fileName ==""){
                	 dialog.render({text: "请输入文档名称"});
                     return;               	 
                 }
                 if(filename!=""&&filename){
			     }else{
			    	 dialog.render({lang: "please_upload_file"});
			    	 return;
			     }
                 var mediasdata={
                		 name:fileName,
                		 description:description,
                		 filename:filename
                 };
                 if(self.docId){
                	 Service.updateHelpDocById(self.docId,mediasdata,function(data){
	              			self.fire("getHelpDocList");
	              			self.helpwindow.destroy();
	     		     });
                 }else{
                	 Service.addHelpDoc(mediasdata,function(data){
	              			self.fire("getHelpDocList");
	              			self.helpwindow.destroy();
	     		     });
                	 
                 }
                 
	        });
		},
		_renderGetData:function(){
			var self = this;
		    Service.getHelpDocById(self.docId,function(data){
		     		 $("#fileName").val(data.result.name==null?"":data.result.name);
		  		     $("#filename").text(data.result.filename==null?"":data.result.filename);
		  		     $("#description").val(data.result.description==null?"":data.result.description);
		  		     $("#filename").css("display","block");
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