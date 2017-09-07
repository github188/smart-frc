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
				height:200,
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
			$("#fileSize2").append("<label>"+locale.get('file_size')+"</label>");
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
		    	
		    	 var rows = $("#editConfig").find("tr").length;
		    	 var index = 0;
		    	 for(var i=0;i<rows;i++){
		    		 var temp = $("#editConfig").find("tr").eq(i).find("td").eq(0).find("label").html();
		    	     
		    	     if(parseInt(temp)>index){
		    	    	 index = parseInt(temp);
		    	     }
		    	 }

                 var files = [];
                 var len = $("#files").find("span").length;
                 

                 /*if(firemwareName==null||firemwareName.replace(/(^\s*)|(\s*$)/g,"")==""){
            			dialog.render({lang:"please_enter_material_name"});
            			return;
            		}*/
                 if(len == 0){
            			dialog.render({lang:"please_upload_file"});
            			return;
            	 }
                 
                 $("#files span").each(function(){
                	 var id = $(this).attr("id");
                	 var file = {};
                	 file.fileid = id.split("_")[0];
                	 file.md5 = id.split("_")[1];
                	 file.length = id.split("_")[2];
                	 file.fileName = $(this).html();
                	 index ++;
                	 file.firemwareName = index;
                	 files.push(file);
                 });
                 self.fire("uploadSuccess",files);
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
                multiSelection:true,
                filters: [{
                    title: "Image files or video or other",
                    extensions: "jpg,gif,png,mp4,avi,3gp,wma,mkv,rmvb,apk,zip,bin"
                }],
                maxFileSize: "500mb",
                events: {
                	"onError": function(err){
						cloud.util.unmask("#windowFormID");
					},
					"onFilesAdded" : function(file){
						
					},
                    "onFileUploaded": function(response, file){
                    	if ($.isPlainObject(response)){
                    		if(response.error){
                    			dialog.render({lang:"upload_files_failed"});
							}else{
								
								$("#files").append("<span style='display: inline-block;width: 100%;' id='"+response.result._id+"_"+response.result.md5+"_"+response.result.length+"'>"+response.result.fileName+"</span>");
								var src= cloud.config.FILE_SERVER_URL + "/api/file/" +response.result._id + "?access_token=" + cloud.Ajax.getAccessToken();
		                        //$("#FileId").val(response.result._id);
		                        //$("#md5").val(response.result.md5);
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