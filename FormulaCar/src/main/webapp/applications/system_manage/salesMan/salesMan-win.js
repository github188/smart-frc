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
				title: "销售员信息管理",
				top: "center",
				left: "center",
				height:220,
				width: 650,
				mask: true,
				drag:true,
				content: "<div id='winContent' style='border-top: 1px solid #f2f2f2;'></div>",
				events: {
					"onClose": function() {
							this.window.destroy();
							cloud.util.unmask();
					},
					scope: this
				}
			});
			this.window.show();	
			$("#ui-window-content").css("overflow","hidden");
			this._renderForm();
			this._renderBtn();
		    this._renderGetData();
		},
		_renderForm:function(){				
		
			var htmls1= "<table width='80%' style='margin-left:80px;margin-top:10px;height: 120px;' border='1'>"
					    +"<tr style='height:30px;'>"
						+ "<td width='25%' height='20px' style='font-size: 12px;'><label style='color:red;'>*</label> <label>销售员姓名</label></td>"
						+ "<td  height='20px'><input style='width: 270px;height: 22px; margin-left: -30px;' type='text' id='salesname' name='salesname' /></td>"
						+"</tr>"
						+"<tr style='height:30px;'>"
						+ "<td width='25%' height='20px' style='font-size: 12px;'><label style='color:red;'>*</label> <label>邮箱</label></td>"
						+ "<td height='20px'><input style='width: 270px;height: 22px; margin-left: -30px;' type='text' id='emails' name='emails'  /></td>"
						+"</tr>"
						+"<tr style='height:30px;'>"
						+ "<td width='25%' height='20px' style='font-size: 12px;'><label style='color:red;'>&nbsp;</label> <label>手机号</label></td>"
						+ "<td height='20px'>"
						   +"<input style='width: 270px;height: 22px; margin-left: -30px;' type='text' id='phones' name='phones'  />"
						   +"<input type='hidden' id='oldName' />"
						   +"<input type='hidden' id='oldEmail'/>"
						+"</td>"
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
	        	   var name=$("#salesname").val();
	     		   var email=$("#emails").val();
	     		   var phone=$("#phones").val();
	     		   
	     		  if(name==null||name.replace(/(^\s*)|(\s*$)/g,"")==""){
          			dialog.render({text:"请输入销售员名称"});
          			return;
          		  }
	     		  if(email==null||email.replace(/(^\s*)|(\s*$)/g,"")==""){
	          			dialog.render({text:"请输入邮箱"});
	          			return;
	              }
           		
	     		  if(name){//判断不能为空
	     			    var salsedata={
	 	             		name:name,
	 	             		email:email,
	 	             		phone:phone
	 	                }
	     			   if(self._id){
	     				   var oldName = $("#oldName").val();
			     		   var oldEmail = $("#oldEmail").val();
			     		   if(oldName == name && oldEmail == email){
			     			  Service.updateSalesById(self._id,salsedata,function(data){
	  							   self.window.destroy();
	  					 	       self.fire("getsalesList");
	  			 			  });
			     		   }else if(oldName != name && oldEmail == email){
			     			  Service.getSalesByName(name,function(data_){
			  					  if(data_.result == true){
			  						  dialog.render({text:"该销售员名称已存在"});
			  						  return;
			  					  }
			  					 Service.updateSalesById(self._id,salsedata,function(data){
		  							   self.window.destroy();
		  					 	       self.fire("getsalesList");
		  			 			  });
			  				  });
			     		   }else if(oldName == name && oldEmail != email){
				     			  Service.getSalesByEmail(email,function(data_){
				  					  if(data_.result == true){
				  						  dialog.render({text:"该邮箱已存在"});
				  						  return;
				  					  }
				  					 Service.updateSalesById(self._id,salsedata,function(data){
			  							   self.window.destroy();
			  					 	       self.fire("getsalesList");
			  			 			  });
				  				  });
				     	   }else{
				     		  Service.getSalesByName(name,function(data_){
			  					  if(data_.result == true){
			  						  dialog.render({text:"该销售员名称已存在"});
			  						  return;
			  					  }
			  					  Service.getSalesByEmail(email,function(data1){
			  						   if(data1.result == true){
			  							  dialog.render({text:"该邮箱已存在"});
			  							  return;
			  						   }
			  		     				   
			  						 Service.updateSalesById(self._id,salsedata,function(data){
			  							   self.window.destroy();
			  					 	       self.fire("getsalesList");
			  			 			  });
			  					  });
			  				  });
				     	   }
	     				   
	     			   }else{
	     				  Service.getSalesByName(name,function(data_){
		  					  if(data_.result == true){
		  						  dialog.render({text:"该销售员名称已存在"});
		  						  return;
		  					  }
		  					  Service.getSalesByEmail(email,function(data1){
		  						   if(data1.result == true){
		  							  dialog.render({text:"该邮箱已存在"});
		  							  return;
		  						   }
		  		     				   
		  		     			  Service.addSales(salsedata,function(data){
		  							   self.window.destroy();
		  					 	       self.fire("getsalesList");
		  			 			  });
		  					  });
		  				  });
	     			   }
	     		  }
	        });
		},
		_renderGetData:function(){
			var self = this;
			if(this._id){
				Service.getSalesById(this._id,function(data){
					   $("#salesname").val(data.result.name==null?"":data.result.name);
		     		   $("#emails").val(data.result.email==null?"":data.result.email);
		     		   $("#phones").val(data.result.phone==null?"":data.result.phone);
		     		  
		     		 
		     		   $("#oldName").val(data.result.name==null?"":data.result.name);
		     		   $("#oldEmail").val(data.result.email==null?"":data.result.email);
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