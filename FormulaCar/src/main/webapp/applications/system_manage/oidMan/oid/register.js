define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("./css/index.css");
	var Service = require("../../service");
	var SalesMan = require("../../salesMan/salesMan-win");
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
			var title="新增机构"
			if(this.id){
				title="修改机构"
			}
			this.window = new _Window({
				container: "body",
				title: title+" (带*必填)",
				top: "center",
				left: "center",
				height:500,
				width: 700,
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
			
			this._renderBtn();
			if(this.id){
				$("#payStyleF").css("display","block");
				$("#billEmailF").css("display","block");
				$("#ui-window-body").css("height","600px");
				$("#ui-window-content").css("height","600px");
				$("#vatime").css("display","block");
				$("#desc").css("display","block");
				this.getData();
			}else{
				this.getSales();
			}
		},
		getData:function(){
			Service.getOidById(this.id,function(data){
				console.log(data);
				$("#username").val(data.result.creator==null?"":data.result.creator);//用户名
				$("#creator").val(data.result.phone==null?"":data.result.phone.split("***")[1]);//申请人
				$("#website").val(data.result.website==null?"":data.result.website);//公司全称
				$("#address").val(data.result.address==null?"":data.result.address);//联系人
				$("#phone").val(data.result.phone==null?"":data.result.phone.split("***")[0]);//联系电话
				
				$("#emailname").val(data.result.email==null?"":data.result.email);//邮箱
				$("#organizationname").val(data.result.name==null?"":data.result.name);//公司简称
				
				$("#billEmail").val(data.result.billEmail==null?"":data.result.billEmail);
				$("#payStyle option[value='"+data.result.payStyle+"']").attr("selected","selected");
				
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
				
				
				$("#fax").html("");
				 var searchData = {
			     };
				 $("#fax").append("<option value='0'>请选择销售员</option>");
			     Service.getAllsales(searchData,1000,0,function(datas){
			         if(datas.result.length>0){
			            for(var i=0;i<datas.result.length;i++){
			            	if(data.result.fax){
			            		if(datas.result[i]._id == data.result.fax.split("***")[0]){
				            		$("#fax").append("<option  selected='selected' value='" +datas.result[i]._id + "'>" +datas.result[i].name+"</option>");		
				            	}else{
				            		$("#fax").append("<option value='" +datas.result[i]._id + "'>" +datas.result[i].name+"</option>");		
				            	}
			            	}else{
			            		$("#fax").append("<option value='" +datas.result[i]._id + "'>" +datas.result[i].name+"</option>");		
			            	}
			            }
			         }
			     });
			});
		},
		getSales:function(){
			var self = this;
			self.searchData = {
		     };
			 $("#fax").html("");
			 $("#fax").append("<option value='0'>请选择销售员</option>");
		     Service.getAllsales(self.searchData,1000,0,function(data){
		         if(data.result.length>0){
		            for(var i=0;i<data.result.length;i++){
		            	$("#fax").append("<option value='" +data.result[i]._id + "'>" +data.result[i].name+"</option>");		
		            }
		         }
		     });
		},
		_renderForm:function(){			
			var self = this;
			var htmls1= "<div class='form-for-registe' id='form-for-registe'>"+
			"<ul>"+
			    "<li class='form-line-wrapper'  style='height: 30px;margin-top: 8px;'>"+
			        "<label for='website' class='label-for-input'><label style='color:red;'>*</label>公司全称:</label>"+
			        "<input autocomplete='off' type='text'  id='website' style='width: 280px;' placeholder='请输入公司全称'/>"+
		        "</li>"+
		        "<li class='form-line-wrapper' style='height: 30px;margin-top: 8px;'>"+
				    "<label for='organizationname' class='label-for-input'><label style='color:red;'>*</label>公司简称:</label>"+
				    "<input autocomplete='off' style='width: 280px;' placeholder='请输入英文字母作为简称' type='text' class='validate[required,maxSize[30]] ' id='organizationname' />"+
			    "</li>"+
			    "<li class='form-line-wrapper' style='height: 30px;margin-top: 8px;'>"+
				  "<label for='username' class='label-for-input'><label style='color:red;'>*</label>用户名:</label>"+
				  "<input autocomplete='off' type='text'  style='width: 280px;' placeholder='请输入登录平台后所显示的用户名称' class='validate[required,maxSize[30]]' id='username'/>"+
			    "</li>"+
			    "<li class='form-line-wrapper' id='emailname-line' style='height: 30px;margin-top: 8px;'>"+
				   "<label for='emailname' class='label-for-input'><label style='color:red;'>*</label>邮箱:</label>"+
				   "<input autocomplete='off' style='width: 280px;' type='text' class='validate[required,maxSize[50],custom[email]]' id='emailname' placeholder='请输入邮箱地址，作为登陆邮箱'/>"+
			    "</li>"+
			    "<li class='form-line-wrapper'  style='height: 30px;margin-top: 8px;'>"+
                  "<label for='fax' class='label-for-input'>申请人:</label>"+
                  "<input autocomplete='off' style='width: 280px;' placeholder='请输入账号申请人或者申请公司' type='text'  id='creator' />"+
                "</li>"+
			    "<li class='form-line-wrapper' style='display:none;margin-top: 8px;'>"+
				    "<label for='regist-user-password' class='label-for-input' lang='{text:set_code}'></label>"+
				    "<input autocomplete='off' style='width: 280px;' type='text' id='regist-user-password' class='regist-user-password validate[required]' lang='{placeholder:enter_password}'/>"+
			    "</li>"+
			    "<li class='form-line-wrapper' style='display:none;margin-top: 8px;'>"+
				    "<label for='confirm-user-password' class='label-for-input' lang='{text:confirm_password}'></label>"+
				    "<input autocomplete='off' style='width: 280px;' type='text' id='confirm-user-password' class='confirm-user-password validate[required]' lang='{placeholder:confirm_password}'/>"+
			    "</li>"+
			    "<li class='form-line-wrapper'  style='height: 30px;margin-top: 8px;'>"+
		            "<label for='address' class='label-for-input'>联系人:</label>"+
		            "<input autocomplete='off' style='width: 280px;' placeholder='请输入您的姓名' type='text'  id='address' />"+
	            "</li>"+
	            "<li class='form-line-wrapper'  style='height: 30px;margin-top: 8px;'>"+
	                "<label for='phone' class='label-for-input'>联系电话:</label>"+
	                "<input autocomplete='off' style='width: 280px;' placeholder='请输入联系电话' type='text'  id='phone' />"+
                "</li>"+
                "<li class='form-line-wrapper'  style='height: 30px;margin-top: 8px;'>"+
                     "<label for='fax' class='label-for-input'>销售员:</label>"+
                     "<select id='fax' style='height: 30px;width: 200px;'></select>&nbsp;&nbsp;"+
                     "<span id='sales_add_button'></span>"+
                "</li>"+
                "<li class='form-line-wrapper'  id='payStyleF' style='height: 30px;display:none;margin-top: 8px;'>"+
	                "<label for='payStyle' class='label-for-input'>付费方式:</label>"+
	                "<select id='payStyle' style='height: 30px;width: 150p x;'>"+
	                  "<option value='0'>请选择付费方式</option>"+
	                  "<option value='1'>后付费</option>"+
	                  "<option value='2'>预付费</option>"+
	                "</select>"+
                "</li>"+
                "<li class='form-line-wrapper' id='vatime' style='height: 30px;margin-top: 8px;display:none;'>"+
                   "<label for='vtime' class='label-for-input'>账号有效期:</label>"+
                   "<input id='vtime' type='text' class='config-row-input'  disabled='true'  style='width: 180px; height: 20px;'>"+
                "</li>"+
                "<li class='form-line-wrapper' id='billEmailF' style='height: 30px;display:none;margin-top: 8px;'>"+
                    "<label for='billEmail' class='label-for-input'>账单接收邮箱:</label>"+
                    "<input autocomplete='off' style='width: 280px;' placeholder='请输入账单接收邮箱' type='text'  id='billEmail' />"+
                "</li>"+
				"<li class='form-line-wrapper secure-code-wrapper' style='height: 30px;margin-top: 8px;'>"+
					"<label for='regist-secure-code' class='label-for-input label-secure-code'><label style='color:red;'>*</label>验证码:</label>"+
					"<input autocomplete='off' class='input-checkcode validate[required,custom[systemAuthcode]]' id='regist-secure-code' type='text' lang='{placeholder:please_input_captcha}'/>"+
					"<span class='simg-holder cover-img-holder'><a href='#'><img id='imgVcode' src='' lang='title:click_to_change' /></a></span>"+
				"</li>"+
				"<li class='form-line-wrapper' id='desc' style='height: 20px;margin-top: 5px;display:none;'>"+
                   "<label style='width:100px;color: orange;margin-left: 15px;'><span style='font-weight: 800;'>预付费转后付费：</span>每年12月份方可更改</label>&nbsp;&nbsp;"+
                   "<label style='width:100px;color: orange;margin-left: 15px;'><span style='font-weight: 800;'>后付费转预付费：</span>成功缴纳账单金额后，在付费当月可更改</label>"+
                "</li>"+
				"<li class='form-line-wrapper for-service-rule'>"+
					"<button class='readClass' style='border-radius: 0px;color: #fff;border: 1px solid #09c;background-color: #09c;' id='button-immeditately-regist'>保存</button> "+
					"<p class='bottom-service-rule' id='registerSuccess' style='display:none;' lang='{text:registration_success_prompt}'></p>"+
					"<input type='hidden' id='picId' />"+
				"</li>"+
			"</ul>"+
	    	"</div>"
	        $("#winContents").append(htmls1);
			
		            
			self._showAuthcode();
		},
		_showAuthcode:function(){
			var self = this;
			
			var option={};
			option.url="/api/captchas";
			option.type="GET";
			option.contentType="application/json;charset=UTF-8";
			option.success=function(data){
				self.picId=data.pictureId;
				$("#picId").val(data.pictureId);
				var imgUrl = "/api/captchas/" + data._id;
				$("#imgVcode").attr("src", imgUrl);
			};			
			$.ajax(option);
			
			
			if(self.salesBtn){
        	}else{
        		self.salesBtn = new Button({
                    text: "新增",
                    container: $("#sales_add_button"),
                    events: {
                        click: function() {                    
                       	 if (self.sales_listPage) {
                            self.sales_listPage.destroy();
                         }
                         this.sales_listPage = new SalesMan({
                            selector: "body",
                            events: {
                                    "getsalesList": function() { 
                                    	self.getSales();
                                    }
                            }
                          });     
                       }
                    }
                }); 
        	}
		},
		_registe:function(){
			var self = this;
			var website = $("#website").val();//公司全称
			var address = $("#address").val();//联系人
			var phone = $("#phone").val();//联系电话
			var fax ="";
			
			if($("#fax").find("option:selected").val() != "0"){
				fax =$("#fax").find("option:selected").val()+"***"+$("#fax").find("option:selected").text();//销售员
			}
			
			var creator  = $("#creator").val();//申请人
			var email=$("#emailname").val();
			var organname=$("#organizationname").val();//公司简称
			var username = $("#username").val();//用户名
			var varificationCode=$("#regist-secure-code").val();
			var picId=$("#picId").val();
			
			
			if(website==null||website==""){
      			dialog.render({text:"公司全称不能为空"});
      			return;
      		}
			if(organname==null||organname==""){
      			dialog.render({text:"公司简称不能为空"});
      			return;
      		}
			if(username==null||username==""){
      			dialog.render({text:"用户名不能为空"});
      			return;
      		}
			if(email==null||email==""){
      			dialog.render({text:"邮箱不能为空"});
      			return;
      		}
			if(phone){
				if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(phone))){ 
			        dialog.render({text:"不是完整的11位手机号或者正确的手机号前七位"});
			        return; 
			    } 
			}
			if(varificationCode==null||varificationCode==""){
      			dialog.render({text:"验证码不能为空"});
      			return;
      		}
			
			
			var strP=/.*[\u4e00-\u9fa5]+.*$/; 
    	    if(strP.test(organname)){
    	       dialog.render({lang:"organization_cannot_contain_chinese"});
    	       return; 
    	    }
			var option={};
			option.data={
				website:website,
				phone:phone+"***"+creator,
				address:address,
				fax:fax,
				email:email,
				username:username,
				name:organname,
				varificationCode:varificationCode,
				picId:picId,
				question:"",
				answer:"",
				questionId:1
			};
			
			if(self.id){
				
				var billEmail = $("#billEmail").val();
				var payStyle = $("#payStyle").find("option:selected").val();
				if(payStyle == 0 || payStyle == "0"){
					dialog.render({text:"请选择付费方式"});
					return;
			    }
				
				option.data.billEmail = billEmail;
				option.data.payStyle = payStyle;
				
				option.data=JSON.stringify(option.data);
				Service.updateOidById(self.id,option.data,function(data){
					console.log(data);
					if(data.error){
						dialog.render({text:"修改机构信息失败"});
					}else{
						dialog.render({text:"修改机构信息成功"});
						self.fire("getOidList");
						self.window.destroy();
					}
				});
			}else{
				
				option.data=JSON.stringify(option.data);
				
				option.url="/api2/organizations?language=" + locale.current();
				option.type="POST";
				option.dataType="json";
				option.contentType="application/json;charset=UTF-8";
				//将这些信息保存在对象属性中，以便resendEmail使用
				self.option=option;
				option.error=function(){
					$("#button-immeditately-regist").bind("click",function(e){e.preventDefault();self.buttonClickBindAndUnbind(e)});
				};
				option.success=function(data){
					console.log(data);
					if(data.error){
						self._showAuthcode();
						$("#button-immeditately-regist").bind("click",function(e){e.preventDefault();self.buttonClickBindAndUnbind(e)});
						if(data.error_code==20007){
							if(data.error.indexOf("@")>-1){
								dialog.render({lang:"email_already_exists"});
							}else{
								dialog.render({lang:"organ_already_exists"});
							}
						}else if(data.error_code==20013){
							dialog.render({text:"验证码错误"});
						}
					}else{
						$("#button-immeditately-regist").hide();
			    	    $("#registerSuccess").css("display","block");
					}
				};
				$.ajax(option);
			}
		},
		_renderBtn:function(){
			var self = this;
			$("#imgVcode").bind("click",function(){
	        	self._showAuthcode();
	        });
			$("#button-immeditately-regist").bind("click",function(e){
				/*var $obj=$("#button-immeditately-regist");
	        	$obj.unbind().bind("click",function(e){
        			e.preventDefault();
        		});*/
	            self._registe();
			});
			
			
			
			//处理按钮的事件绑定和解绑，主要是为了阻止button标签的默认行为和用户在一次请求未返回的情况多次点击，导致多次请求的情况
	        /*this.buttonClickBindAndUnbind=function(e){
	        	var $obj=$("#button-immeditately-regist");
	        	$obj.unbind().bind("click",function(e){
        			e.preventDefault();
        		});
	            self._registe($obj);
	        };
	        $("#button-immeditately-regist").bind("click",function(e){e.preventDefault();self.buttonClickBindAndUnbind(e)});*/
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