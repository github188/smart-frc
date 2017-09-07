define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	require("cloud/lib/plugin/jquery.datetimepicker");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	var Service = require("./service");
	
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
				title: "计算器",
				top: "center",
				left: "center",
				height:180,
				width: 450,
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
			this.renderBtn();
		},
		_renderForm:function(){				
			var htmls1= "<div style='text-align: center;width: 90%;margin: 10px;'>"
					      +"<table style='width:100%;'>"
					      +"<tr style='height: 50px;'>"
					      +"<td style='text-align:left;'>"
					       +"<label style='margin:auto 10px auto 10px ;margin-right: 6px;'>点数</label>" 
			               +"<input type='text'  id='siteNum' name='siteNum' style='width:150px;height:28px;'/>"
			               +"<label style='margin:auto 10px auto 10px ;margin-right: 6px;'>账单开始时间</label>" 
			               +"<input type='text' class='notice-bar-calendar-input datepicker' id='payTime' name='payTime' style='width:150px;height:28px;'/>"
			               +"<a id='config-cancel' class='btn btn-primary submit' style='margin-left:10px;'>计算</a>"
					      +"</td>"
					      +"</tr>"
					      +"<tr style='height: 50px;'>"
					      +"<td style='text-align:left;'><input type='text'  id='billPrice'  placeholder='账单金额' style='width:150px;height:28px;'/><input type='text'  id='times'  placeholder='使用期限' style='width:200px;height:28px;margin-left:10px;'/></td>"
					      +"</tr>"
					      +"</table>"
					    +"</div>";
	        $("#winContent").append(htmls1);
		},
		renderBtn:function(){
			var self = this;
			$("#config-cancel").click(function(){
				var siteNum = $("#siteNum").val();
				
				
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