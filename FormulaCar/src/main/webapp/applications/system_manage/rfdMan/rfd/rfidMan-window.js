define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	var Service = require("./service");
	
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
				title: "Rfid管理",
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
						+ "<td width='25%' height='20px' style='font-size: 12px;'><label style='color:red;'>*</label> <label>Rfid</label></td>"
						+ "<td  height='20px'><input style='border-radius: 0px;width: 270px;height: 22px; margin-left: 0px;' type='text' id='Rfids' name='Rfids' /></td>"
						+"</tr>"
						+"<tr style='height:30px;'>"
						+ "<td width='25%' height='20px' style='font-size: 12px;'><label style='color:red;'>&nbsp;</label> <label>点数</label></td>"
						+ "<td  height='20px'><input style='border-radius: 0px;width: 270px;height: 22px; margin-left: 0px;' type='text' id='count' name='count' /></td>"
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
	        	   var rfid=$("#Rfids").val();
	     		   var count=$("#count").val();
	     		   if(rfid==null||rfid.replace(/(^\s*)|(\s*$)/g,"")==""){
          			   dialog.render({text:"请输入rfid"});
          			   return;
          		   };
          		   if(count==null||count.replace(/(^\s*)|(\s*$)/g,"")==""){
         			   dialog.render({text:"请输入点数"});
         			   return;
         		   };
	     		   var finalData={
	     			    		rfid:rfid,
	     			    		count:count
	 	           };
	     		   if(self._id){
	     				  Service.updateRfid(self._id,finalData,function(data){
	                    	  if(data.error!=null){
	    	                	   if(data.error_code == "70002"){
	    							   dialog.render({text:"rfid已存在"});
	    							   return;
	    						   }
	    	                	}else{
	    							self.window.destroy();
	    		 	             	self.fire("getRfidList");
	    						}
	    			       });
	     			}else{
	     				  Service.addRfid(finalData,function(data){
	     					     console.log(data);
		 	                	if(data.error!=null){
		 	                	   if(data.error_code == "70002"){
		 	                		  dialog.render({text:"rfid已存在"});
									  return;
								   }
		 	                	}else{
									self.window.destroy();
				 	             	self.fire("getRfidList");
								}
		 	             	  
		 				   });
	     		   }
	        });
		},
		_renderGetData:function(){
			var self = this;
			if(this._id){
				Service.getRfidById(this._id,function(data){
		     		 $("#Rfids").val(data.result.rfid==null?"":data.result.rfid);
		     		 $("#count").val(data.result.count==null?"":data.result.count);
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