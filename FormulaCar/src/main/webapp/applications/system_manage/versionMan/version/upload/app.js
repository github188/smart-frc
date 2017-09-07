define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./app.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../../../service");
    var UploadFile  = require("./uploadFile/uploadFile-window");
    	
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.id = options.data._id;
            this.data = options.data;
            this.version = options.version;
            this._renderWindow();
            this.apps = [];
            this.config = [];
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: locale.get({lang: "versions_man"}),
                top: "center",
                left: "center",
                height: 500,
                width: 800,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                    "onClose": function() {
                        this.adWindow.destroy();
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
            this.adWindow.show();
            $("#upload").val(locale.get({lang: "add_menu"}));
            $("#uploadApp").val(locale.get({lang: "add_menu"}));
            $("#saveBase").val(locale.get({lang: "save"}));
            
            this._renderBtn();
            if(this.version){
            	$("#version").attr("disabled","disabled");
            	this.getData();
            }
        },
        getData:function(){
        	var self = this;
        	if(this.data && this.data.versions && this.data.versions.length > 0){
        		for(var i = 0;i<this.data.versions.length;i++){
        			if(this.data.versions[i].version == this.version){
        				$("#version").val(this.version);
        				//配置文件
        				var config = this.data.versions[i].config;
        				if(config && config.length > 0){
        				for(var n=0;n<config.length;n++){
        					var configId = config[n].configId;
            				var configName = config[n].configName;
            				$("#editConfig").append("<tr id='"+configId+"'>"
              						+"<td class='channelTable'>"
              						+  "<label id='"+configName+":"+configId+"'  name='"+configName+"_"+configId+"'>"+configName+"</label>"
              						+"</td>"
              						+"<td class='channelTable'><span id='delete_"+configId+"' name='"+configId+"' class='delcls' style='cursor: pointer;'>删除</span></td>"
              						+"</tr>");
                     		 $(".delcls").click(function(){
                     			$(this).parent().parent().remove();
             			     });
        					
        				   }
        				}
                 		 //app
                 		var apps = this.data.versions[i].apps;
                 		if(apps && apps.length > 0){
            				for(var j=0;j<apps.length;j++){
            					 var fileId = apps[j].fileId;
            					 var name = apps[j].name;
            					 $("#editAppConfig").append("<tr id='"+fileId+"'>"
                   						+"<td class='channelTable'>"
                   						+  "<label id='"+name+":"+fileId+"'  name='"+name+"_"+fileId+"'>"+name+"</label>"
                   						+"</td>"
                   						+"<td class='channelTable'><span id='delete_"+fileId+"' name='"+fileId+"' class='delapp' style='cursor: pointer;'>删除</span></td>"
                   						+"</tr>");
                          		 $("#delete_"+fileId).click(function(){
                  					 $(this).parent().parent().remove();
                  			     });
            				}
                 		}
        			}
        		}
        	}
        },
        _renderBtn: function() {
        	var self = this;
        	$("#saveBase").bind("click", function() {
        		//版本
        		var version = $("#version").val();
        		//上传配置文件
        		var config ={};
        		var tableObj = document.getElementById("editConfig"); 
        		if(version==null||version.replace(/(^\s*)|(\s*$)/g,"")==""){
      		    	dialog.render({lang:"version_enter"});
      			    return;
      		    }       		
        		if(tableObj && tableObj.rows.length >0 ){
        			for(var i=0;i<tableObj.rows.length;i++){//行
        				var configObj ={};
        				configObj.configName = tableObj.rows[i].cells[0].children[0].id.split(":")[0];
        				configObj.configId = tableObj.rows[i].cells[0].children[0].id.split(":")[1];
        				self.config.push(configObj);
        			}
        			
        		}else{
					dialog.render({lang:"please_add_material"});
           			return;
				}
        	   //上传app
        		var tableAppObj = document.getElementById("editAppConfig"); 
        		if(tableAppObj && tableAppObj.rows.length >0 ){
        			for(var i=0;i<tableAppObj.rows.length;i++){//行
        				var configObj ={};
        				configObj.name = tableAppObj.rows[i].cells[0].children[0].id.split(":")[0];
        				configObj.fileId = tableAppObj.rows[i].cells[0].children[0].id.split(":")[1];
        				self.apps.push(configObj);
        			}
        		}else{
					dialog.render({lang:"please_add_material"});
           			return;
				}
        		
        		var finalData = {
        				version:version,
        				config:self.config,
        				apps:self.apps
        		};
        		 var versions=[];
        		 var versiondata={};
        		 versions.push(finalData)
        		 ;
        		 if(self.version){//修改版本
        			versiondata={
                			 versions:versions,
        	 	             type:2
        	 	         }
        		 }else{//添加版本
        			versiondata={
                			 versions:versions,
        	 	             type:1
        	 	         }
        		 }
        		 Service.updateVersion(self.id,versiondata,function(data){
        			 if(data.error!=null){
	                	   if(data.error_code == "70023"){
							   dialog.render({lang:"version_exists"});
							   return;
						   }else if(data.error_code == "70017"){
							   dialog.render({lang:"model_name_exists"});
							   return;
						   }
	                	}else{
	                		self.adWindow.destroy();
				 	        self.fire("getVersionList",data.result.versions);
						} 
					    
        		 });
        		
        	});
        	$("#upload").click(function(){
        		if (this.uploadPro) {
                    this.uploadPro.destroy();
                }
                this.uploadPro = new UploadFile({
                    selector: "body",
                    events: {
                    	 "uploadSuccess":function(FileId,fileName) {
                    		 
                    		 for(var k=0;k<FileId.length;k++){
                    			 
                    			 $("#editConfig").append("<tr id='"+FileId[k]+"'>"
                  						+"<td class='channelTable'>"
                  						+  "<label id='"+fileName[k]+":"+FileId[k]+"'  name='"+fileName[k]+"_"+FileId[k]+"'>"+fileName[k]+"</label>"
                  						+"</td>"
                  						+"<td class='channelTable'><span id='delete_"+FileId[k]+"' name='"+FileId[k]+"' class='delcls' style='cursor: pointer;'>删除</span></td>"
                  						+"</tr>");
                         		 $(".delcls").click(function(){
                         			 $(this).parent().parent().remove();
                 			     });
                    			 
                    		 }
                    		 
                    		 
                    	 }
                    }
                });
        	});
        	$("#uploadApp").click(function(){
        		if (this.uploadProApp) {
                    this.uploadProApp.destroy();
                }
                this.uploadProApp = new UploadFile({
                    selector: "body",
                    events: {
                    	 "uploadSuccess":function(FileId,fileName) {
                            for(var k=0;k<FileId.length;k++){
                    			 
                    			 $("#editAppConfig").append("<tr id='"+FileId[k]+"'>"
                  						+"<td class='channelTable'>"
                  						+  "<label id='"+fileName[k]+":"+FileId[k]+"'  name='"+fileName[k]+"_"+FileId[k]+"'>"+fileName[k]+"</label>"
                  						+"</td>"
                  						+"<td class='channelTable'><span id='delete_"+FileId[k]+"' name='"+FileId[k]+"' class='delcls' style='cursor: pointer;'>删除</span></td>"
                  						+"</tr>");
                         		 $(".delcls").click(function(){
                         			 $(this).parent().parent().remove();
                 			     });
                    			 
                    		 }
                    		
                    	 }
                    }
                });
        	});
        },
        destroy: function() {
            if (this.window) {
                this.window.destroy();
            } else {
                this.window = null;
            }
        }
    });
    return updateWindow;
});