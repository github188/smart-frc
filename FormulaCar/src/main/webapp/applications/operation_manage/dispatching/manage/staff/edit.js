/**
 * @author zhangcy
 * 
 */
define(function(require){
	var cloud = require("cloud/base/cloud");
    var Button = require("cloud/components/button");
	var editHtml = require("text!./edit.html");
	var validator = require("cloud/components/validator");
	var modelInfo = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.element.html(editHtml);
			this.subBtn = null;
            this._render();
		},
		_render:function(){
			this._renderInitDiv();
			this._renderHtml();
			this._renderSubmit();
		},
		_renderInitDiv:function(){
			this.elements = {
				infoDiv:"automat_staff_info",
				saveDiv:"automat_staff_save"
			};
		},
		_renderHtml:function(){
			var html = "<table  width='90%' style='margin-left:5%;margin-top:5%;' border='1'>"+
							"<tr style='height:40px;'>"+
								"<td width='15%' height='30px' style='font-size: 14px;font-weight: bold;'>"+locale.get("automat_staff_name")+":<td>"+
								"<td style='width:70%;text-align:left;'><input style='width:250px;border-radius: 4px;width: 270px;height: 25px;' type='text' id='automat_staff_name'/><td>"+
							"</tr>"+
							"<tr style='height:40px;'>"+
								"<td width='15%' height='30px' style='font-size: 14px;font-weight: bold;'>"+locale.get("automat_staff_number")+":<td>"+
								"<td style='width:70%;text-align:left;'><input style='width:250px;border-radius: 4px;width: 270px;height: 25px;' type='text' id='automat_staff_number'/><td>"+
							"</tr>"+
							"<tr style='height:40px;'>"+
								"<td width='15%' height='30px' style='font-size: 14px;font-weight: bold;'>"+locale.get("automat_staff_phone")+":<td>"+
								"<td style='width:70%;text-align:left;'><input style='width:250px;border-radius: 4px;width: 270px;height: 25px;' type='text' id='automat_staff_phone'/><td>"+
							"</tr>"+
							"<tr style='height:40px;'>"+
								"<td width='15%' height='30px' style='font-size: 14px;font-weight: bold;'>"+locale.get("description")+":<td>"+
								"<td style='width:70%;text-align:left;'><input style='width:250px;border-radius: 4px;width: 270px;height: 25px;' type='text' id='automat_staff_description'/><td>"+
							"</tr>"+
					   "</table>"+
					   "<div style='text-align: right;width: 94%;margin-top: 10px;border-top: 1px solid #f2f2f2;'><a id='automat_staff_save' class='btn btn-primary submit' style='margin-top: 8px;'>保存</a><a id='product-config-cancel' style='margin-left: 10px;margin-top: 8px;' class='btn btn-primary submit'>取消</a></div>";
			$("#"+this.elements.infoDiv).append(html);
            $("#automat_staff_name").bind("keyup",function(e){
                 if(e.keyCode == 13){
                     var value = $(this).val().replace(/\s/g,"").match(pattern);
                 }
             });
		},
		_renderSubmit:function(){
			var self = this;
			 //取消
		    $("#product-config-cancel").bind("click",function(){
		    	self.window.destroy();
		    });
            //保存
		    $("#automat_staff_save").bind("click",function(){
		    	self.fire("click");
		    });
			
			//$("#automat_staff_save").css({"padding-left":"30%"});
			//$(".cloud-button").css({"width":"50px","height":"30px","line-height":"30px","text-align":"center"});
		},
		destroy:function(){
			if(this.subBtn){
				this.subBtn.destroy();
			}
		}
	});
	return modelInfo;
});