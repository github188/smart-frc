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
				height:150,
				width: 450,
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
		    	
		    	 var file = $("#fileList").find("input");
		    	 var FileId = new Array();
                 var fileName = new Array();
		    	 for(var i=0;i<file.length;i++){
		    		 FileId.push($(file[i]).val());
		    		 fileName.push($(file[i]).attr("name"));
		    	 }
		    	 
                /* if(fileName==null||fileName.replace(/(^\s*)|(\s*$)/g,"")==""){
            			dialog.render({lang:"please_upload_file"});
            			return;
            		}*/
                 self.fire("uploadSuccess",FileId,fileName);
                 self.window.destroy();
	        });
		    self.initUploader();
		},
		initUploader:function(){
			
			var self=this;
			$list = $('#fileList');
            this.uploader = new Uploader({
                browseElement: $("#select_file_button"),
                url: "/gapi/file",
                autoUpload: true,
                multiSelection:true,
                filters: [{
                    title: "Image files or video or other",
                    extensions: "jpg,gif,png,mp4,avi,3gp,wma,mkv,rmvb,apk,zip,xml"
                }],
                maxFileSize: "100mb",
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
								var src= cloud.config.FILE_SERVER_URL + "/gapi/file/" +response.result._id + "?access_token=" + cloud.Ajax.getAccessToken();
		                        
		                        var $li = $(
		    			                "<input type='hidden' id='file' value='"+response.result._id+"' name='"+file.name+"' />"+"<span>"+file.name+"</span><br>"
		    			                
		    			                );
		    			            

		    			        $list.append( $li );
		                        
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

