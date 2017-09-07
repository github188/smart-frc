define(function(require) {
    var cloud = require("cloud/base/cloud");
    var Common = require("../../../../common/js/common");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./userMan.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/resources/css/jquery.multiselect.css");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../../service");
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.id = options.id;
            this._renderWindow();
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.automatWindow = new _Window({
                container: "body",
                title: "用户信息管理",
                top: "center",
                left: "center",
                height: 550,
                width: 750,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                    "onClose": function() {
                        this.automatWindow.destroy();
                        cloud.util.unmask();
                        $("tr").css("border-bottom","0px");
                    },
                    scope: this
                }
            });
            this.automatWindow.show();
            $("#nextBase").val(locale.get({lang: "next_step"}));
            $("#saveBase").val(locale.get({lang: "save"}));
            $("#lastBase").val("上一步");
            $("#sms-config-save").val("保存");
            
            this.getRole();
            
            this.bindEvent();
            if(this.id){
                this.getData(); 
                this.getAreaData();
                $("#userId").val(this.id);
            }else{
            	this.getArea();
            }
        },
        getData:function(){
        	Service.getUserById(this.id,function(datas){
        		 $("#email").val(datas.result.email==null?"":datas.result.email);
        		 $("#user_name").val(datas.result.name==null?"":datas.result.name);
        		 $("#role").find("option[value="+datas.result.roleId+"]").attr("selected",true);
        	 });
        },
        getRole:function(){
        	Service.initializeRoles(function(result){
        		result.each(function(data) {
                    var _id = data._id;
                    var name = data.name;
                    if (name == "admin"){
                    	self.adminId =  _id;
                    	$("#role").append("<option value='" + _id + "' id='opt-user-roles-admin'>" + locale.get({lang:"organization_manager"}) + "</option>");
                    }else if(name == "DeviceManager"){
                    	$("#role").append("<option value='" + _id + "' id='opt-user-roles-manager'>" + locale.get({lang:"device_manager"}) + "</option>");
                    }else if(name == "DeviceSense"){
                    	$("#role").append("<option value='" + _id + "' id='opt-user-roles-sense'>" + locale.get({lang:"device_sense"}) + "</option>");
                    }else{
                    	$("#role").append("<option value='" + _id + "' id='opt-user-roles-sense'>" + name + "</option>");
                    }
                });
        	});
        },
        getAreaData:function(){
        	var self = this;
        	var searchData = {
			};
			Service.getAllArea(searchData,-1,0,function(Areadata) {
				Service.getSmartUserById(self.id,function(data){
					var areaIds=[];
					if(data && data.result && data.result.area){
						areaIds = data.result.area;
					}
					
					var configFlag = data.result.configFlag;
	        		if(configFlag == 1 || configFlag == "1"){
	                 	$("#areapay").val(1);
	               		$("#areapay").attr("checked", true);
	               		$("#tab2").css("display","block");
	               		$("#nextBase").css("display","block");
	               		$(".saveBtn").css("width","87%");
	               		$("#mark").css("display","block");
	     	        }
					
					require(["cloud/lib/plugin/jquery.multiselect"], function() {
			                $("#multiselectArea").multiselect({
			                    header: true,
			                    checkAllText: locale.get({lang: "check_all"}),
			                    uncheckAllText: locale.get({lang: "uncheck_all"}),
			                    noneSelectedText: locale.get({lang: "please_select_area"}),
			                    selectedText: "# " + locale.get({lang: "is_selected"}),
			                    minWidth: 200,
			                    height: 120
			                });
				     });
					 
					 if(Areadata.result.length >0){
			   			 for(var i =0;i <Areadata.result.length;i++){
			   			    if(areaIds.length > 0){
			   		           if(areaIds.indexOf(Areadata.result[i]._id) !=-1){
			   		              $("#multiselectArea").append("<option selected='selected' value='" +Areadata.result[i]._id + "'>" +Areadata.result[i].name+"</option>");
			   		           }else{
			   		              $("#multiselectArea").append("<option value='" +Areadata.result[i]._id + "'>" +Areadata.result[i].name+"</option>");
			   		           }
			   			    }
			   			 }
			   		 }
				});
			});
        },
        getArea:function(){
        	var self = this;
        	var searchData = {
			};
			Service.getAllArea(searchData,-1,0,function(Areadata) {
				require(["cloud/lib/plugin/jquery.multiselect"], function() {
	                $("#multiselectArea").multiselect({
	                    header: true,
	                    checkAllText: locale.get({lang: "check_all"}),
	                    uncheckAllText: locale.get({lang: "uncheck_all"}),
	                    noneSelectedText: locale.get({lang: "please_select_area"}),
	                    selectedText: "# " + locale.get({lang: "is_selected"}),
	                    minWidth: 200,
	                    height: 120
	                });
	            });
				if (Areadata && Areadata.result.length > 0) {
	                for (var i = 0; i < Areadata.result.length; i++) {
	                    $("#multiselectArea").append("<option value='" + Areadata.result[i]._id + "'>" + Areadata.result[i].name + "</option>");
	                }
	            }
			});
        },
        bindEvent:function(){
        	 var self =this;
        	 
        	 $("#areapay").bind('click',function(){
               	var temp = $(this).val();
               	if(temp == 0 || temp == "0"){
               		$("#areapay").val(1);
               		$("#areapay").attr("checked", true);
               	}else{
               		$("#areapay").val(0);
               		$("#areapay").removeAttr("checked");
               	}
               });
        	
        	 //点击保存
        	 $("#saveBase").bind("click", function() {
        		 self.userInfoMan();
        	 });
        	 
        	 $("#lastBase").bind("click", function() {
        		 $("#payStyleConfig").css("display", "none");//支付方式信息
                 $("#baseInfo").css("display", "block");//基本信息
                 $("#tab1").addClass("active");
                 $("#tab2").removeClass("active");
        	 });
        	 
        },
        userInfoMan:function(){
        	var self = this;
        	var user_name = $("#user_name").val();
   		    var email = $("#email").val();
   		    var role = $("#role").find("option:selected").val();
   		 
   		    var configflag = $("#areapay").val();
 		    var areaIds = $("#multiselectArea").multiselect("getChecked").map(function() {
               return this.value;
            }).get();
    		 
    		if(user_name == null || user_name == 0){
    			dialog.render({text: "请输入用户名"});
               return;
    		}
    		if(email == null || email == 0){
    			dialog.render({text: "请输入邮箱"});
               return;
    		}else{
           	   var pattern = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;  
               if (!pattern.test(email)) {  
               	dialog.render({lang:"user_email_is_not_true"});
                   return;
               }  
           }
    	   if(areaIds.length>0){
           }else{
        		dialog.render({lang:"please_select_area"});
       	        return;
           }
        	
          if(role == self.adminId && configflag == 1){
        		dialog.render({lang:"admin_already_config"});
       	        return;
          }
          
          if(configflag == 0){//无自定义支付配置
        	  if(self.id){
        		  self.renderUpdateUserInfo(user_name,email,role,configflag,areaIds);
        	  }else{
        		  self.renderAddUserInfo(user_name,email,role,configflag,areaIds);
        	  }
        	    
          }else if(configflag == 1){
        	  if(self.id){
        		  //修改用户
        		  Service.getSmartUserConfigFlag(self.id,areaIds,function(data){
        			  console.log(data);
        			  if(data.result == true){
            			  self.renderUpdateUserInfo(user_name,email,role,configflag,areaIds);
            	      }else{
            	    	  dialog.render({text:"你所选择的区域的支付信息已配置"}); 
            	      }
        		  });
        	  }else{
        		  //添加用户
        		  //判断smartUser表里  configFlag=1 且 area
            	  Service.getSmartUserConfigFlag('',areaIds,function(data){
            		  console.log(data);
            		  if(data.result == true){
            			  self.renderAddUserInfo(user_name,email,role,configflag,areaIds);
            	      }else{
            	    	  dialog.render({text:"你所选择的区域的支付信息已配置"}); 
            	      }
            	  });
        	  }
        	 
          }
        },
        renderAddUserInfo:function(user_name,email,role,configflag,areaIds){
        	var self = this;
	  		var data={
	           		email:email,
	           		name:user_name,
	           		roleId:role
	        }
	  		Service.addUser(data,function(data){//添加用户
	               if(data.error!=null){
	                    if(data.error_code == "20007"){
						    dialog.render({lang:"user_already_exists"});
						    return;
					    }
	                }else{
	                	//添加用户成功，往smart.users表里插入一条数据
	                	var smartData={
	                			userId:data.result._id,
	                     		area:areaIds,
	                     		roleId:role,
	                     		configFlag:parseInt(configflag)
	                     		
	                	};
	                	$("#userId").val(data.result._id);
	                	Service.addSmartUser(smartData,function(data){
	                		if(data.error_code != null){
	                			if(data.error_code == "70033"){
	    					    	dialog.render({lang:"area_alerady_custom_pay"});
	    						    return;
	    					    }
	                		}else{
	   	                		   self.automatWindow.destroy();
	   		                       self.fire("getUsersList");
	                		}
	                	});
					}
			 });
        },
        renderUpdateUserInfo:function(user_name,email,role,configflag,areaIds){
        	var self = this;
	  		var data={
	           	email:email,
	           	name:user_name,
	           	roleId:role
	        }
	        Service.updateUser(self.id,data,function(data){
	            var smartData={
		            area:areaIds,
		            name:user_name,
		            configFlag:parseInt(configflag)
		        };
	            Service.updateSmartUser(data.result._id,smartData,function(data){
	               if(data.error_code != null){
		               if(data.error_code == "70033"){
		    			   dialog.render({lang:"area_alerady_custom_pay"});
		    			   return;
		    		   }
		           }else{
		              self.automatWindow.destroy();
			          self.fire("getUsersList");
		           }
	            });
			});
        },
        destroy: function() {
            if (this.automatWindow) {
                this.automatWindow.destroy();
            } else {
                this.automatWindow = null;
            }
        }
    });
    return updateWindow;
});
