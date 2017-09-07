define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	var Service = require("./service");
	var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
	var eurl;
	if(oid == '0000000000000000000abcde'){
	     eurl = "mapi";
	}else{
	     eurl = "api";
	}
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this._id = options.id;
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var title_win='';
			if(this._id){
				title_win = locale.get({lang:"vender_management_update"});
			}else{
				title_win = locale.get({lang:"vender_management_add"});
			}
			var self = this;
			this.window = new _Window({
				container: "body",
				title: title_win,
				top: "center",
				left: "center",
				height:210,
				width: 500,
				mask: true,
				drag:true,
				content: "<div id='typeWinContent' style='border-top: 1px solid #e7e7eb;margin-top: 5px;'></div>",
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
//				        +"<tr style='height:30px;'>"
//					      + "<td width='25%' height='20px' style='font-size: 14px;font-weight: bold;'><label style='color:red;'>*</label> <label>"+locale.get({lang:"numbers"})+"</label></td>"
//					      + "<td  height='20px'><input style='border-radius: 4px;width: 270px;height: 22px;' type='text' id='type-number' value='' name='number' /></td>"
//					    +"</tr>"
					    +"<tr style='height:30px;'>"
						+ "<td width='25%' height='20px' style='font-size: 14px;font-weight: bold;'><label style='color:red;'>*</label> <label>"+locale.get({lang:"vender"})+"</label></td>"
						+ "<td  height='20px'><input style='border-radius: 4px;width: 270px;height: 22px;' type='text' id='type-name' value='' name='name' /></td>"
						+"</tr>"
					    + " </table>"
					    + "<div style='text-align: right;width: 94%;margin-top: 10px;border-top: 1px solid #f2f2f2;'><a id='product-type-config-save' class='btn btn-primary submit' style='margin-top: 8px;'>"+locale.get({lang:"save"})+"</a><a id='product-type-config-cancel' style='margin-left: 10px;margin-top: 8px;' class='btn btn-primary submit'>"+locale.get({lang:"cancel"})+"</a></div>";
	        $("#typeWinContent").append(htmls1);
		},
		_renderBtn:function(){
			var self = this;
		    //取消
		    $("#product-type-config-cancel").bind("click",function(){
		    	self.window.destroy();
		    });
            //保存
		    $("#product-type-config-save").bind("click",function(){
	        	   var name=$("#type-name").val();
	     		   var number = $("#type-name").val();
//	     		  if(number==null||number.replace(/(^\s*)|(\s*$)/g,"")==""){
//	          			dialog.render({lang:"enter_the_vender_number"});
//	          			return;
//	          	  };
	     		  if(name==null||name.replace(/(^\s*)|(\s*$)/g,"")==""){
          			    dialog.render({lang:"enter_the_vender_name"});
          			    return;
          		  };
          		  if(number.indexOf("@")!=-1 || name.indexOf("@")!=-1){
          			    dialog.render({lang:"vender_name_and_number_not_has"});
          			    return;
          		  }
	     		  if(name && number){//判断不能为空
	     			    var typedata={
	 	             		name:name,
	 	             		number:number
	 	                }
	     			   if(self._id){
	     				  Service.updatevender(eurl,self._id,typedata,function(data){
	     					
	                    	  if(data.error != null){
	    	                	   if(data.error_code == "70040"){
	    							   dialog.render({lang:"vender_name_exists"});
	    							   return;
	    						   } else if(data.error_code == "70041"){
	    							   dialog.render({lang:"vender_number_exists"});
	    							   return;
	    						   }else{
	    							   dialog.render({lang:"vender_update_error"});
	    							   return; 
	    						   }
	    	                	}else{
	    							self.window.destroy();
	    		 	             	self.fire("getvenderList");	    		 	             	
	    						}
	    			       });
	     			   }else{
	     				  Service.addvender(eurl,typedata,function(data){
		 	                	
		 	                	if(data.error!=null){
		 	                	   if(data.error_code == "70040"){
									   dialog.render({lang:"vender_name_exists"});
									   return;
								   } else if(data.error_code == "70041"){
	    							   dialog.render({lang:"vender_number_exists"});
	    							   return;
	    						   }else{
	    							   dialog.render({lang:"vender_update_error"});
	    							   return; 
	    						   }
		 	                	}else{
									self.window.destroy();
				 	             	self.fire("getvenderList");
								}
		 	             	  
		 				   });
	     			   }
	 	                
	     		  }
	                
	        });
		},
		_renderGetData:function(){
			var self = this;
			if(this._id){
				Service.getVenderById(eurl,this._id,function(data){
		     		 $("#type-name").val(data.result.name);
		     		$("#type-number").val(data.result.number);
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