define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.unpayCount =  options.unpayCount;
			this.validTime = options.validTime;
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.window = new _Window({
				container: "body",
				title: "账单未缴费提示",
				top: "center",
				left: "center",
				height:252,
				width: 600,
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
			var validTime = this.validTime;
			validTime = cloud.util.dateFormat(new Date(validTime), "yyyy-MM-dd hh:mm:ss");
			var htmls1= "<table width='80%' style='margin-left:80px;margin-top:10px;height: 150px;' border='1'>"
					    +"<tr style='height:50px;line-height: 30px;'>"
						+ "<td style='font-size: 16px;'>"
						+ "<div>您有  <label style='color:red;font-size: 22px;'>"+this.unpayCount+"</label> <label>  笔账单未支付，请尽快支付!</label></div>"
						+ "<div style='font-size: 12px;'>1.账单内容，参见“系统->账单->未付款账单”</div>"
						+ "<div style='font-size: 12px;'>2.收费标准，参见“系统->账单->收费标准”</div>"
						+ "<div style='font-size: 12px;'>3.账号有效期至<label style='color:red;font-size: 16px;'>"+validTime+"</label></div>"
						+ "</td>"
						+"</tr>"
					    + "</table>"
					    + "<div style='text-align: right;width: 100%;margin-top: 10px;border-top: 1px solid #f2f2f2;'>"
					      +"<table style='width:100%;'>"
					      +"<tr>"
					      +"<td style='width:80%;text-align:right;'>"
					      +"<div style=line-height: 45px;'>"
					        +"<input id='tip' type='checkbox' class='config-row-input' value='0' style='width: 23px;'>"
					        +"<label for='tip' class='label-for-input'>不再提示</label>"
					      +"</div>"
					      +"</td>"
					      +"<td>"
					      +"<div style='text-align:left;'>"
					        +"<a id='config-cancel' style='margin-top: 8px;margin-left:10px;' class='btn btn-primary submit'>关闭</a>"
					      +"</div>"
					      +"</td>"
					      +"</tr>"
					      +"</table>"
					    +"</div>";
	        $("#winContent").append(htmls1);
		},
		renderBtn:function(){
			var self = this;
			$("#config-cancel").click(function(){
				var tip = $("#tip").val();
				
				var date  = new Date();
				var endTime = "";
		    	var months = date.getMonth()+1;
		    	var year=date.getFullYear(); 
		    	var byMonth = year +"-"+months;
		    	var  maxday = new Date(year,months,0).getDate();
                if (months == 1 || months == 3 || months == 5 || months == 7 || months == 8 || months == 10 || months == 12) {
                	endTime = new Date(byMonth +"-"+"31").toUTCString();
                } else if (months == 2) {
                	endTime = new Date(byMonth +"-"+maxday).toUTCString();
                } else {
                	endTime = new Date(byMonth +"-"+"30").toUTCString();
                }
				
				
				document.cookie="tip="+tip+";expires="+endTime;
				self.window.destroy();
			});
			
			$("#tip").bind('click',function(){
              	var temp = $(this).val();
              	if(temp == 0 || temp == "0"){
              		$("#tip").val(1);
              		$("#tip").attr("checked", true);
              	}else{
              		$("#tip").val(0);
              		$("#tip").removeAttr("checked");
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