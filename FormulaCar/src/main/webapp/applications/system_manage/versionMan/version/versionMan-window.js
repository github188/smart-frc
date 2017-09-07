define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	var Service = require("../../service");
	
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this._id = options.id;
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.window = new _Window({
				container: "body",
				title: locale.get({lang:"appVersions_man"}),
				top: "center",
				left: "center",
				height:170,
				width: 650,
				mask: true,
				drag:true,
				content: "<div id='winContent' style='border-top: 1px solid #f2f2f2;height:50%;'></div>",
				events: {
					"onClose": function() {
							this.window.destroy();
							cloud.util.unmask();
					},
					scope: this
				}
			});
			this.window.show();	
			this._renderForm();
			this._renderBtn();
			this._renderGetData();
		},
		_renderForm:function(){				
		
			var htmls1= "<table width='90%' style='margin-left:5%;margin-top:2%;' border='1'>"
					    +"<tr style='height:30px;'>"
						+ "<td width='30%' height='20px' style='font-size: 14px;font-weight: bold;'><label style='color:red;'>*</label> <label>"+locale.get({lang:"version_allot_name"})+"</label></td>"
						+ "<td  height='20px'><input style='border-radius: 4px;width: 270px;height: 15px;' type='text' id='modelName' name='modelName' /></td>"
						+"</tr>"
						
					    + " </table>"
					    + "<div style='text-align: right;width: 94%;margin-top: 10px;border-top: 1px solid #f2f2f2;'><a id='product-config-save' class='btn btn-primary submit' style='margin-top: 8px;'>"+locale.get({lang:"save"})+"</a><a id='product-config-cancel' style='margin-left: 10px;margin-top: 8px;' class='btn btn-primary submit'>"+locale.get({lang:"cancel"})+"</a></div>";
	        $("#winContent").append(htmls1);
		},
		_renderBtn:function(){
			var self = this;
		    //取消
		    $("#product-config-cancel").bind("click",function(){
		    	self.window.destroy();
		    });
            //保存
		    $("#product-config-save").bind("click",function(){
	        	   var modelName=$("#modelName").val();
	     		   
	     		  if(modelName==null||modelName.replace(/(^\s*)|(\s*$)/g,"")==""){
          		    	dialog.render({lang:"automat_enter_model_name"});
          			    return;
          		  }
	     		  
	     		  if(modelName){//判断不能为空
	     			    var versiondata={
	 	             		name:modelName
	 	             		
	 	                };
	     			    
	     			   if(self._id){
	     				  
		     				  Service.updateVersion(self._id,versiondata,function(data){
		     					 if(data.error!=null){
			 	                	   if(data.error_code == "70023"){
										   dialog.render({lang:"version_exists"});
										   return;
									   }else if(data.error_code == "70017"){
										   dialog.render({lang:"version_allot_name_exists"});
										   return;
									   }
			 	                	}else{
			 	                		self.window.destroy();
							 	        self.fire("getVersionList");
									}  
		     					  
		    			       });
		     		   }else{
		     			  
		     				  Service.addVersion(versiondata,function(data){
		     					 if(data.error!=null){
			 	                	   if(data.error_code == "70011"){
										   dialog.render({lang:"version_allot_name_exists"});
										   return;
									   }
			 	                	}else{
			 	                		self.window.destroy();
							 	        self.fire("getVersionList");
									}
								    
				 			  });
		     		   }
	     		  }
	        });
		},
		_renderGetData:function(){
			var self = this;
			if(this._id){
				Service.getVersionById(this._id,function(data){
					  var modelName=$("#modelName").val();
		     		   var server=$("#server").val();
					   $("#modelName").val(data.result.name==null?"":data.result.name);
		     		   $("#server").val(data.result.server==null?"":data.result.server);
				});
			}
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