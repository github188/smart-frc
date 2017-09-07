define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./medias-window.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	var Service = require("../service");
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.mediasId = options.mediasId;
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.window = new _Window({
				container: "body",
				title: locale.get({lang:"upload_files"}),
				top: "center",
				left: "center",
				height:300,
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
	        $("#fileSize").append("<label>"+locale.get('file_size')+"</label>");
	        $("#fileInput").append("<input type='text' id='filename' name='filename'  placeholder='"+locale.get('file_tip')+"'  style='width: 270px;'/>");
	        $("#fileSource").find("option[value='2']").attr("selected",true);
	        var a=$("#fileSource").val();
	        if(a==2){
				$("#localFile").hide();
				$("#remoteFile").show();
				$("#remoteTip").show();
	        }
			this.window.show();	
			this._renderBtn();
            if(this.mediasId){
    		    this._renderGetData();
            }
		
		},
		_renderBtn:function(){
			var self = this;
			var regular = /^([^\`\+\~\!\#\$\%\^\&\*\(\)\|\}\{\=\"\'\！\￥\……\（\）\——]*[\+\~\!\#\$\%\^\&\*\(\)\|\}\{\=\"\'\`\！\?\:\<\>\•\“\”\；\‘\‘\〈\ 〉\￥\……\（\）\——\｛\｝\【\】\\\/\;\：\？\《\》\。\，\、\[\]\,]+.*)$/;
			self.uploadButton=new Button({
	                container:$("#select_file_button"),
	                text:locale.get("upload_files"),
	                lang : "{title:select_file,text:select_file}"
	        });
			 
			 $("#fileSource").change(function(){
				    var select=$("#fileSource").val();
					if(select=="1"){
						$("#localFile").show();
						$("#remoteFile").hide();
						$("#remoteTip").hide();
						var fileName = $("#filename").val();
					    if(fileName != null && fileName != ""){
							$("#fileName").text("");
					    }
						
					}else if(select=="2"){
						$("#localFile").hide();
						$("#remoteFile").show();
						$("#remoteTip").show();
						var filename = $("#fileName").text();
						if(filename != null && filename != ""){
							$("#filename").val("");
							$("#fileId").val("");
							$("#md5").val("");
						}
					}
			 });
				
			 //取消
		    $("#cancel").bind("click",function(){
		    	self.window.destroy();
		    });
            //保存
		    $("#input-submit").bind("click",function(){
		    	 var mediaName = $("#mediaName").val();//素材名称
		    	 var filelength = $("#filelength").val();//素材名称
		    	 var mediaType = $("#mediaType").val();//素材类型
		    	 var fileSource = $("#fileSource").val();//文件来源
		    	 var fileId = $("#fileId").val();
		    	 var mediaType=mediaType+"_"+fileId;
                 var md5 = $("#md5").val();
                 var fileName = $("#filename").val();
                 if(mediaName==null || mediaName ==""){
                	 dialog.render({lang: "please_enter_material_name"});
                     return;               	 
                 }
	     		  if(mediaName){//判断不能为空
	     			    var mediasdata={
	     			    	mediaName:mediaName,
	     			    	mediaType:mediaType,
	     			    	fileId:fileId,
	     			    	md5:md5,
	     			    	length:filelength,
	     			    	fileName:fileName,
	     			    	fileSource:fileSource
	 	                }
	     			    if(fileSource == 2){//远程文件
	     			    	 if(fileId!=""&&fileId){
	     			    	 }else{
	     			    		dialog.render({lang: "please_upload_file"});
	     			    		return;
	     			    	 }
	     			    }
	     				if(self.mediasId){
		     				Service.updateMedias(self.mediasId,mediasdata,function(data){
		              			self.fire("getMediasList");
		              			self.window.destroy();
		              		});
		     			}else{
		     				Service.addMedias(mediasdata,function(data){
		              			self.fire("getMediasList");
		              			self.window.destroy();
		     				});
		     			}
	     		  }
	        });
		    self.initUploader();
		},
		initUploader:function(){
            var self=this;
            this.uploader = new Uploader({
                browseElement: $("#select_file_button"),
                url: "/api/file",
                autoUpload: true,
                filters: [{
                    title: "Image files or video",
                    extensions: "jpg,gif,png,mp4,avi,3gp,wma,mkv,rmvb,txt"
                }],
                maxFileSize: "100mb",
                events: {
                	"onError": function(err){
                		dialog.render({lang:"upload_files_failed"});
						cloud.util.unmask("#windowFormId");
					},
					"onFilesAdded" : function(file){
						var name=file[0].name;
						var regular = /^([^\`\+\~\!\#\$\%\^\&\*\(\)\|\}\{\=\"\'\！\￥\……\（\）\——]*[\+\~\!\#\$\%\^\&\*\(\)\|\}\{\=\"\'\`\！\?\:\<\>\•\“\”\；\‘\‘\〈\ 〉\￥\……\（\）\——\｛\｝\【\】\\\/\;\：\？\《\》\。\，\、\[\]\,]+.*)$/;
					    if(regular.test(name)){
					    	dialog.render({lang:"upload_files_name_error"});
					    	return;
					    }
					},
                    "onFileUploaded": function(response, file){
                    	if ($.isPlainObject(response)){
                    		if(response.error){
                    			dialog.render({lang:"upload_files_failed"});
							}else{
								var regular = /^([^\`\+\~\!\#\$\%\^\&\*\(\)\|\}\{\=\"\'\！\￥\……\（\）\——]*[\+\~\!\#\$\%\^\&\*\(\)\|\}\{\=\"\'\`\！\?\:\<\>\•\“\”\；\‘\‘\〈\ 〉\￥\……\（\）\——\｛\｝\【\】\\\/\;\：\？\《\》\。\，\、\[\]\,]+.*)$/;
								var src= cloud.config.FILE_SERVER_URL + "/api/file/" +response.result._id + "?access_token=" + cloud.Ajax.getAccessToken();
								if(!regular.test(response.result.fileName)){
		                        	$("#fileId").val(response.result._id);
			                        $("#md5").val(response.result.md5);
		                        	$("#fileName").text(response.result.fileName);
		                        	$("#filename").val(response.result.fileName);
									$("#filelength").val(response.result.length);
							    }
							}
                    	}
                    	
                    	cloud.util.unmask("#windowFormId");
                    },
                    "beforeFileUpload":function(){
						cloud.util.mask(
		                	"#windowFormId",
		                	locale.get("uploading_files")
		                );
					}
                }
            });
        },
		_renderGetData:function(){
			var self = this;
				Service.getMediasById(self.mediasId,function(data){
		     		 $("#mediaName").val(data.result.mediaName==null?"":data.result.mediaName);
		  		     $("#mediaType").val(data.result.mediaType==null?"":data.result.mediaType);
		  		     $("#fileId").val(data.result.fileId==null?"":data.result.fileId);	
		  		     $("#md5").val(data.result.md5==null?"":data.result.md5);
		  		     $("#filename").val(data.result.fileName==null?"":data.result.fileName);
		  		     $("#fileName").text(data.result.fileName==null?"":data.result.fileName);
		  		     $("#filelength").val(data.result.length==null?"":data.result.length);
		  		     $("#fileSource").val(data.result.fileSource==null?"":data.result.fileSource);
		  		     if(data.result.fileSource==1){
			  		    	$("#localFile").show();
							$("#remoteFile").hide();
							$("#remoteTip").hide();
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