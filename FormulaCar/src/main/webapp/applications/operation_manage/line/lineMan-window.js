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
				title: locale.get({lang:"line_management"}),
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
			this._renderGetArea();		
			this._renderBtn();
		    this._renderGetData();
		},
		_renderForm:function(){				
		
			var htmls1= "<table width='90%' style='margin-left:80px;margin-top:10px;height: 120px;' border='1'>"
					    +"<tr style='height:30px;'>"
						+ "<td width='25%' height='20px' style='font-size: 12px;'><label style='color:red;'>*</label> <label>"+locale.get({lang:"line_man_name"})+"</label></td>"
						+ "<td  height='20px'><input style='width: 270px;height: 22px; margin-left: -30px;' type='text' id='lineName' name='lineName' /></td>"
						+"</tr>"
						+"<tr style='height:30px;'>"
					    + "<td width='25%' height='20px' style='font-size: 12px;'><label style='color:red;'>*</label> <label>"+locale.get({lang:"area_man_name"})+"</label></td>"
					    +"<td  height='20px'>"
						+ "<select id='areaName'  name='areaName' style='width: 270px;height: 29px; margin-left: -30px;'>"
			            +  "</select>&nbsp;&nbsp;"
						+"</td>"
						+"</tr>"
						+"<tr style='height:30px;'>"
						+ "<td width='25%' height='20px' style='font-size: 12px;'><label style='color:red;'>&nbsp;</label> <label>"+locale.get({lang:"area_man_desc"})+"</label></td>"
						+ "<td height='20px'><input style='width: 270px;height: 22px; margin-left: -30px;' type='text' id='description' name='description'  /></td>"
						+"</tr>"
					    + " </table>"
					    + "<div style='text-align: right;width: 94%;margin-top: 10px;border-top: 1px solid #f2f2f2;'><a id='product-config-save' class='btn btn-primary submit' style='margin-top: 8px;'>"+locale.get({lang:"save"})+"</a><a id='product-config-cancel' style='margin-left: 10px;margin-top: 8px;' class='btn btn-primary submit'>"+locale.get({lang:"cancel"})+"</a></div>";
	        $("#winContent").append(htmls1);
		},
		_renderGetArea:function(){
			var self = this;
			var searchData = {
					"name":''
			}
			var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
			var roleType = permission.getInfo().roleType;
			if(roleType == 51){
				Service.getAllArea(searchData,-1,0,function(data) {
					if(data.result){
						for(var i=0;i<data.result.length;i++){
							$("#areaName").append("<option value='" +data.result[i]._id + "'>" +data.result[i].name+"</option>");
						}
						self._renderGetData();
					}
				});
			}else{
				Service.getAreaDataByUserId(userId,function(data) {
					if(data.result){
						for(var i=0;i<data.result.length;i++){
							$("#areaName").append("<option value='" +data.result[i]._id + "'>" +data.result[i].name+"</option>");
						}
						self._renderGetData();
					}
				});
			}
			
			
		},
		_renderBtn:function(){
			var self = this;
		    //取消
		    $("#product-config-cancel").bind("click",function(){
		    	self.window.destroy();
		    });
            //保存
		    $("#product-config-save").bind("click",function(){
	        	   var name=$("#lineName").val();
	     		   var areaName = $("#areaName").find("option:selected").text();
	     		   var areaId = $("#areaName").find("option:selected").val();
	     		   var description=$("#description").val();
	     		   
	     		  if(name==null||name.replace(/(^\s*)|(\s*$)/g,"")==""){
          			dialog.render({lang:"enter_line_name"});
          			return;
          		  }
           		
	     		 if(areaId==null||areaId.replace(/(^\s*)|(\s*$)/g,"")==""){
	          			dialog.render({lang:"please_enter_area"});
	          			return;
	          	  }
	     		  if(name){//判断不能为空
	     			    var linedata={
	 	             		name:name,
	 	             		areaName:areaName,
	 	             		areaId:areaId,
	 	             		desc:description
	 	                }
	     			   if(self._id){
	     				  Service.updateLine(self._id,linedata,function(data){
	     					 if(data.error!=null){
	    	                	   if(data.error_code == "20007"){
	    							   dialog.render({lang:"line_name_exists"});
	    							   return;
	    						   }
	    	                	}else{
	    							self.window.destroy();
	    		 	             	self.fire("getLineList");
	    						}
	    			       });
	     			   }else{
	     				  Service.addLine(linedata,function(data){
		 	                    if(data.result=="RESOURCE_NAME_ALREADY_EXISTS"){
		    					    dialog.render({lang:"line_name_exists"});
		    					    return;
		    	                }else{
									self.window.destroy();
				 	             	self.fire("getLineList");
								}
		 	             	  
		 				   });
	     			   }
	 	                
	     		  }
	                
	        });
		},
		_renderGetData:function(){
			var self = this;
			if(this._id){
				Service.getLineById(this._id,function(data){
					   $("#lineName").val(data.result.name==null?"":data.result.name);
		     		   $("#description").val(data.result.desc==null?"":data.result.desc);
		     		   $("#areaName option[value='"+data.result.areaId+"']").attr("selected","selected");
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