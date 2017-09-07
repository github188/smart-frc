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
				title: locale.get({lang:"regional_management"}),
				top: "center",
				left: "center",
				height:252,
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
			this._renderForm();
			this._renderBtn();
		    this._renderGetData();
		},
		_renderForm:function(){				
		
			var htmls1= "<table width='90%' style='margin-left:80px;margin-top:10px;height: 150px;' border='1'>"
					    +"<tr style='height:30px;'>"
						+ "<td width='25%' height='20px' style='font-size: 12px;'><label style='color:red;'>*</label> <label>"+locale.get({lang:"area_man_name"})+"</label></td>"
						+ "<td  height='20px'><input style='border-radius: 0px;width: 270px;height: 22px; margin-left: 0px;' type='text' id='areaname' name='areaname' /></td>"
						+"</tr>"
						+"<tr style='height:30px;'>"
						+ "<td width='25%' height='20px' style='font-size: 12px;'><label style='color:red;'>&nbsp;</label> <label>"+locale.get({lang:"area_man_code"})+"</label></td>"
						+ "<td  height='20px'><input style='border-radius: 0px;width: 270px;height: 22px; margin-left: 0px;' type='text' id='code' name='code' /></td>"
						+"</tr>"
						+"<tr style='height:30px;'>"
					    + "<td width='25%' height='20px' style='font-size: 12px;'><label style='color:red;'>&nbsp;</label> <label>"+locale.get({lang:"area_man_charger"})+"</label></td>"
						+ "<td  height='20px'><input style='border-radius: 0px;width: 270px;height: 22px; margin-left: 0px;' type='text' id='charger' name='charger'/></td>"
						+"</tr>"
						+"<tr style='height:30px;'>"
					    + "<td width='25%' height='20px' style='font-size: 12px;'><label style='color:red;'>&nbsp;</label> <label>"+locale.get({lang:"area_man_phone"})+"</label></td>"
						+ "<td  height='20px'><input style='border-radius: 0px;width: 270px;height: 22px; margin-left: 0px;' type='text' id='phone' name='phone'/></td>"
						+"</tr>"
						+"<tr style='height:30px;'>"
						+ "<td width='25%' height='20px' style='font-size: 12px;'><label style='color:red;'>&nbsp;</label> <label>"+locale.get({lang:"area_man_desc"})+"</label></td>"
						+ "<td height='20px'><input style='border-radius: 0px;width: 270px;height: 22px; margin-left: 0px;' type='text' id='description' name='description'  /></td>"
						+"</tr>"
					    + " </table>"
					    + "<div style='text-align: right;width: 94%;margin-top: 10px;border-top: 1px solid #f2f2f2;'><a id='product-config-save' class='btn btn-primary submit' style='margin-top: 8px;'>"+locale.get({lang:"save"})+"</a><a id='product-config-cancel' style='margin-left: 10px;margin-top: 8px;' class='btn btn-primary submit'>"+locale.get({lang:"cancel"})+"</a></div>";
	        $("#winContent").append(htmls1);
	        $("#ui-window-content").css("overflow","hidden");
		},
		_renderBtn:function(){
			var self = this;
		    //取消
		    $("#product-config-cancel").bind("click",function(){
		    	self.window.destroy();
		    });
            //保存
		    $("#product-config-save").bind("click",function(){
	        	   var name=$("#areaname").val();
	     		   var charger=$("#charger").val();
	     		   var phone=$("#phone").val();
	     		   var description=$("#description").val();
	     		   var code = $("#code").val();
	     		  if(name==null||name.replace(/(^\s*)|(\s*$)/g,"")==""){
          			dialog.render({lang:"enter_area_name"});
          			return;
          		  };
	     		  if(name){//判断不能为空
	     			    var areadata={
	 	             		name:name,
	 	             		code:code,
	 	             		charger:charger,
	 	             		phone:phone,
	 	             		description:description
	 	                }
	     			   if(self._id){
	     				  Service.updateArea(self._id,areadata,function(data){
	                    	  if(data.error!=null){
	    	                	   if(data.error_code == "20007"){
	    							   dialog.render({lang:"area_name_exists"});
	    							   return;
	    						   }
	    	                	}else{
	    							self.window.destroy();
	    		 	             	self.fire("getAreaList");
	    						}
	    			       });
	     			   }else{
	     				  Service.addArea(areadata,function(data){
		 	                	if(data.error!=null){
		 	                	   if(data.error_code == "20007"){
									   dialog.render({lang:"area_name_exists"});
									   return;
								   }
		 	                	}else{
									self.window.destroy();
				 	             	self.fire("getAreaList");
								}
		 	             	  
		 				   });
	     			   }
	 	                
	     		  }
	                
	        });
		},
		_renderGetData:function(){
			var self = this;
			if(this._id){
				Service.getAreaById(this._id,function(data){
		     		 $("#areaname").val(data.result.name==null?"":data.result.name);
		     		 $("#code").val(data.result.code==null?"":data.result.code);
		  		     $("#charger").val(data.result.charger==null?"":data.result.charger);
		  		     $("#phone").val(data.result.phone==null?"":data.result.phone);	
		  		     $("#description").val(data.result.description==null?"":data.result.description);	
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