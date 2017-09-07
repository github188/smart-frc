define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	var Service = require("../service");
	
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
				title: locale.get({lang:"site_type_management"}),
				top: "center",
				left: "center",
				height:210,
				width: 500,
				mask: true,
				drag:true,
				content: "<div id='typeWinContent' style='border-top: 1px solid #f2f2f2;'></div>",
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
		
			var htmls1= "<table width='90%' style='margin-left:9%;margin-top:10%;' border='1'>"
					    +"<tr style='height:30px;'>"
						+ "<td width='25%' height='20px' style='font-size: 14px;font-weight: bold;'><label style='color:red;'>*</label> <label>"+locale.get({lang:"site_type"})+"</label></td>"
						+ "<td  height='20px'><input style='border-radius: 4px;width: 270px;height: 22px;' type='text' id='siteType-name' value='' name='name' /></td>"
						+"</tr>"
					    + " </table>"
					    + "<div style='text-align: right;width: 94%;margin-top: 50px;border-top: 1px solid #f2f2f2;'><a id='site-type-config-save' class='btn btn-primary submit' style='margin-top: 8px;'>"+locale.get({lang:"save"})+"</a><a id='site-type-config-cancel' style='margin-left: 10px;margin-top: 8px;' class='btn btn-primary submit'>"+locale.get({lang:"cancel"})+"</a></div>";
	        $("#typeWinContent").append(htmls1);
		},
		_renderBtn:function(){
			var self = this;
		    //取消
		    $("#site-type-config-cancel").bind("click",function(){
		    	self.window.destroy();
		    });
            //保存
		    $("#site-type-config-save").bind("click",function(){
	        	   var name=$("#siteType-name").val();
	     		  
	     		  if(name==null||name.replace(/(^\s*)|(\s*$)/g,"")==""){
          			dialog.render({lang:"enter_sitet_type_name"});
          			return;
          		  };
	     		  if(name){//判断不能为空
	     			    var typedata={
	 	             		name:name,
	 	                }
	     			   if(self._id){
	     				  Service.updateSiteType(self._id,typedata,function(data){
	     					
	                    	  if(data.error != null){
	    	                	   if(data.error_code == "70029"){
	    							   dialog.render({lang:"site_type_name_exists"});
	    							   return;
	    						   }else{
	    							   dialog.render({lang:"site_type_update_error"});
	    							   return; 
	    						   }
	    	                	}else{
	    							self.window.destroy();
	    		 	             	self.fire("getSiteTypeList");	    		 	             	
	    						}
	    			       });
	     			   }else{
	     				  Service.addSiteType(typedata,function(data){
		 	                	
		 	                	if(data.error!=null){
		 	                	   if(data.error_code == "70029"){
									   dialog.render({lang:"site_type_name_exists"});
									   return;
								   }else{
	    							   dialog.render({lang:"site_type_update_error"});
	    							   return; 
	    						   }
		 	                	}else{
									self.window.destroy();
				 	             	self.fire("getSiteTypeList");
								}
		 	             	  
		 				   });
	     			   }
	 	                
	     		  }
	                
	        });
		},
		_renderGetData:function(){
			var self = this;
			if(this._id){
				
				Service.getSiteTypeById(this._id,function(data){
		     		 $("#siteType-name").val(data.result.name);
		  		     
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