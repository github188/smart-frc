define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("./css/index.css");
	var Service = require("../service");
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.id = options.id;
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.window = new _Window({
				container: "body",
				title: "设置收费信息",
				top: "center",
				left: "center",
				height:420,
				width: 680,
				mask: true,
				drag:true,
				content: "<div id='winContents' style='border-top: 1px solid #f2f2f2;'></div>",
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
			this.getData();
			
			this.renderBtn();
		},
		getData:function(){
			Service.getOidById(this.id,function(data){
				console.log(data);
				$("#username").val(data.result.creator==null?"":data.result.creator);//用户名
				$("#website").val(data.result.website==null?"":data.result.website);//公司全称
				$("#emailname").val(data.result.email==null?"":data.result.email);//邮箱
				$("#organizationname").val(data.result.name==null?"":data.result.name);//公司简称
				$("#discounts").val(data.result.discount==null?"":data.result.discount);
				if(data.result.billEmail){
					$("#billEmail").val(data.result.billEmail==null?"":data.result.billEmail);
				}else{
					$("#billEmail").val(data.result.email==null?"":data.result.email);
				}
				
				$("#payStyle option[value='"+data.result.payStyle+"']").attr("selected","selected");
				
				if(data.result.charge==1){ 
	            	$("#charge").val(1);
	                $("#charge").attr("checked", true);
	            }
				$("#emailname").attr("disabled",true);
				$("#organizationname").attr("disabled",true);
				$("#username").attr("disabled",true);
				if(data.result.validTime){
					$("#vtime").val(cloud.util.dateFormat(new Date(data.result.validTime), "yyyy-MM-dd"));
				}else{
					$("#vtime").val("未知");
				}
				
				
				if(data.result.payStyle == 1 || data.result.payStyle == 2){
					$("#payStyle").attr("disabled",true);
					//在有效期截止月
					var validTime = data.result.validTime;
					var date  = new Date();
			    	var months = date.getMonth()+1;
			    	var validTime_month = cloud.util.dateFormat(new Date(validTime), "MM");
			    	
			    	if(validTime_month<10){
			    		validTime_month = validTime_month.split("0")[1];
			    	}
			    	console.log(validTime_month);
			    	if(validTime_month == months){
			    		$("#payStyle").attr("disabled",false);
			    	}
			    	//后付费改为预付费：无欠款
			    	if(data.result.payStyle == 1){
			    		var date  = new Date();
						var byYear=date.getFullYear(); 
			        	var startTime = (new Date(byYear + "/01/01" + " 00:00:00")).getTime() / 1000;
			            var endTime = (new Date(byYear + "/12/31" + " 23:59:59")).getTime() / 1000;
			    		var searchData={
	    		                org:data.result.name,
	    					    state:[0],
	    					    limit:100,
	    					    cursor:0,
	    					    startTime:startTime,
	    					    endTime:endTime
	    		        };
			    		 cloud.Ajax.request({
	    	                 url: "api/bill/list",
	    	                 type: "GET",
	    	                 parameters: searchData,
	    	                 success: function(data) {
	    	                	 if(data.result.length == 0 && (validTime_month == months)){//无欠款
	    	                		 $("#payStyle").attr("disabled",false);
	    	                	 }else{//有欠款
	    	                		 $("#payStyle").attr("disabled",true);
	    	                	 }
	    	                 }
			    		 });
			    		
			    	}
				}
			});
		},
		_renderForm:function(){			
			var self = this;
			var htmls1= "<div class='form-for-registe' id='form-for-registe'>"+
			"<ul>"+
			    "<li class='form-line-wrapper'  style='height: 30px;margin-top: 10px;'>"+
			        "<label for='website' class='label-for-input'>公司全称:</label>"+
			        "<input autocomplete='off' type='text'  id='website' style='width: 280px;' disabled='true' />"+
		        "</li>"+
		        "<li class='form-line-wrapper' style='height: 30px;margin-top: 10px;'>"+
				    "<label class='label-for-input'>公司简称:</label>"+
				    "<input style='width: 280px;'  disabled='true' type='text'  id='organizationname' />"+
			    "</li>"+
			    "<li class='form-line-wrapper'  id='payStyleF' style='height: 30px;margin-top: 10px;'>"+
	                "<label for='payStyle' class='label-for-input'>付费方式:</label>"+
	                "<select id='payStyle' style='height: 30px;width: 180px;'>"+
	                  "<option value='0'>请选择付费方式</option>"+
	                  "<option value='1'>后付费</option>"+
	                  "<option value='2'>预付费</option>"+
	                "</select>"+
                "</li>"+
	            "<li class='form-line-wrapper' id='billEmailF' style='height: 30px;margin-top: 10px;'>"+
	                "<label for='billEmail' class='label-for-input'>账单接收邮箱:</label>"+
	                "<input autocomplete='off' style='width: 180px;' placeholder='请输入账单接收邮箱' type='text'  value='' id='billEmail' />"+
	            "</li>"+
                "<li class='form-line-wrapper' id='discountcss' style='height: 30px;margin-top: 10px;'>"+
                    "<label for='phone' class='label-for-input'>折扣:</label>"+
                    "<input autocomplete='off' style='width: 180px;' placeholder='请输入折扣,九折输入0.9' type='text'  id='discounts' />"+
                "</li>"+
                "<li class='form-line-wrapper' id='discountcss' style='height: 30px;margin-top: 10px;'>"+
                    "<label for='charge' class='label-for-input'>免费:</label>"+
                    "<input id='charge' type='checkbox' class='config-row-input' value='0' style='width: 23px; height: 20px;'>"+
                "</li>"+
                "<li class='form-line-wrapper' id='vatime' style='height: 30px;margin-top: 10px;'>"+
                    "<label for='vtime' class='label-for-input'>账号有效期:</label>"+
                     "<input id='vtime' type='text' class='config-row-input'  disabled='true'  style='width: 180px; height: 20px;'>"+
                "</li>"+
                "<li class='form-line-wrapper' id='discountcss' style='height: 30px;margin-top: 10px;'>"+
	                "<label style='width:100px;color: orange;margin-left: 15px;'><span style='font-weight: 800;'>预付费转后付费：</span>每年12月份方可更改</label>&nbsp;&nbsp;"+
	                "<label style='width:100px;color: orange;margin-left: 15px;'><span style='font-weight: 800;'>后付费转预付费：</span>成功缴纳账单金额后，在付费当月可更改</label>"+
                "</li>"+
				"<li class='form-line-wrapper for-service-rule'>"+
					"<button class='readClass' style='border-radius: 0px;color: #fff;border: 1px solid #09c;background-color: #09c;' id='button-immeditately-regist'>保存</button> "+
				"</li>"+
			"</ul>"+
	    	"</div>"
	        $("#winContents").append(htmls1);
		},
		renderBtn:function(){
			var self = this;
			$("#charge").bind('click',function(){
              	var temp = $(this).val();
              	if(temp == 0 || temp == "0"){
              		$("#charge").val(1);
              		$("#charge").attr("checked", true);
              	}else{
              		$("#charge").val(0);
              		$("#charge").removeAttr("checked");
              	}
              }); 
			
		    $("#button-immeditately-regist").click(function(){
		    	var discount = $("#discounts").val();
		    	var charge = $("#charge").val();
		    	
		    	var billEmail = $("#billEmail").val();
				var payStyle = $("#payStyle").find("option:selected").val();
				if(payStyle == 0 || payStyle == "0"){
					dialog.render({text:"请选择付费方式"});
					return;
			    }
				var option={};
				option={
					discount:discount,
					charge:charge,
					billEmail:billEmail,
					payStyle:payStyle
				};
			    option=JSON.stringify(option);
			    
		    	Service.updateOidById(self.id,option,function(data){
					console.log(data);
					if(data.error){
						dialog.render({text:"修改机构信息失败"});
					}else{
						dialog.render({text:"修改机构信息成功"});
						self.fire("getOidList");
						self.window.destroy();
					}
				 });
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