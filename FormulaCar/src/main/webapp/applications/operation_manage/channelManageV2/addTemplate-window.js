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
			this.templateObj = options.templateObj;
			this._renderWindow();
			
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.window = new _Window({
				container: "body",
				title: locale.get({lang:"create_template"}),
				top: "center",
				left: "center",
				height:152,
				width: 500,
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
		},
		_renderForm:function(){				
		
			var htmls1= "<table width='90%' style='margin-left:80px;margin-top:10px;height: 50px;' border='1'>"
					    +"<tr style='height:30px;'>"
						+ "<td width='25%' height='20px' style='font-size: 12px;'><label style='color:red;'>*</label> <label>"+locale.get({lang:"template_name"})+"</label></td>"
						+ "<td  height='20px'><input style='border-radius: 0px;width: 270px;height: 22px; margin-left: 0px;' type='text' id='templatename' name='templatename' /></td>"
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
	        	  var name = $("#templatename").val();
	     		   
	     		  if(name==null||name.replace(/(^\s*)|(\s*$)/g,"")==""){
          			dialog.render({lang:"template_name_not_exists"});
          			return;
          		  };
          		  
          		  self.templateObj.name = name;
	     		  if(name){//判断不能为空
	     			    
	     			   Service.addTemplateInfo(self.templateObj, function(data) {
	                         if (data.error_code == null) {
	                             cloud.util.unmask("#deviceForm");
	                             self.window.destroy();
				 	             self.fire("addTemplate");
	                         } else if (data.error_code == "70024") {//模板名称已存在
	                             dialog.render({lang: "automat_name_exists"});
	                             return;
	                         }
	                     }, self);
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