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
				container: "body",
				title: locale.get({lang:"upload_files"}),
				top: "center",
				left: "center",
				height:260,
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
			 self.uploadButton=new Button({
	                container:$("#select_file_button"),
	                text:locale.get("upload_files"),
	                lang : "{title:select_file,text:select_file}"
	         });
			 //取消
		    $("#cancel").bind("click",function(){
		    	self.window.destroy();
		    });
            //保存
		    $("#input-submit").bind("click",function(){
		    	 var mediaName = $("#mediaName").val();//素材名称
		    	 var mediaType = $("#mediaType").val();//素材类型
		    	 var mediaId = $("#mediaId").val();
                 var md5 = $("#md5").val();
                 var fileName = $("#filename").val();
                 if(mediaName==null||mediaName.replace(/(^\s*)|(\s*$)/g,"")==""){
                	 dialog.render({lang: "please_enter_material_name"});
                     return;               	 
                 }
                 if(fileName==null || fileName ==""){
                	 dialog.render({lang: "please_add_material"});
                     return;              	 
                 }
                 self.fire("uploadSuccess",mediaId,mediaName,mediaType,md5,fileName);
                 self.window.destroy();
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
                maxFileSize: "500mb",
                events: {
                	"onError": function(err){
						cloud.util.unmask("#windowFormID");
					},
					"onFilesAdded" : function(file){
						var name=file[0].name;
						$("#fileName").text(name);
						$("#filename").val(name);
					},
                    "onFileUploaded": function(response, file){
                    	if ($.isPlainObject(response)){
                    		if(response.error){
                    			dialog.render({lang:"upload_files_failed"});
							}else{
								var src= cloud.config.FILE_SERVER_URL + "/api/file/" +response.result._id + "?access_token=" + cloud.Ajax.getAccessToken();
		                        $("#mediaId").val(response.result._id);
		                        $("#md5").val(response.result.md5);
							}
                    	}
                    	
                    	cloud.util.unmask("#windowFormID");
                    },
                    "beforeFileUpload":function(){
						cloud.util.mask(
		                	"#windowFormID",
		                	locale.get("uploading_files")
		                );
					}
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