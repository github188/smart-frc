define(function(require) {
	require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery.multiselect");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery.multiselect.css");
    var Button = require("cloud/components/button");
    var configHtml=require("text!./configuration.html");
    var Service=require("../../service");
    var UploadFile  = require("./uploadFile/uploadFile-window");
	var configuration = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.configFlag = 0;
			this.areaIds = [];
			this.render();
		},
		render:function(){
			var self=this;
			this.renderHtml();
            locale.render({element:self.element});
            if(permission.app("IcbcPay_payment").write){
            	$("#sms-config-save").show();
            }else{
            	$("#sms-config-save").hide();
            }
            this.getConfig();
            this.bindBtnEvents();
            this.getData();
		},
		renderHtml:function(){
			var self=this;
			self.element.html(configHtml);
			$(".cs-col-slie-main-bd").css("width",$(".wrap").width());
			$("#btn").css("width",$(".wrap").width());
			$(".static_div_height").css("height",$(".cs-col-slie-main-bd").height()-60);
		},
		getConfig:function(){
            var accept = $("#accept").val();
            var appId = $("#appId").val();
            var localPubKey =$("#localPubKey_filename").text();
            var localPrivKey =$("#localPrivKey_filename").text();
            var platformPubKey =$("#platformPubKey_filename").text();
            
            
            var config = {
            		accept:accept,
            		appId:appId,
            		localPubKey:localPubKey,
            		localPrivKey:localPrivKey,
            		platformPubKey:platformPubKey
            };
            return config;
        },
        setConfig:function(data){
        	$("#appId").val(data.config.appId);
            $("#localPubKey_filename").text(data.config.localPubKey);
            $("#localPrivKey_filename").text(data.config.localPrivKey);
            $("#platformPubKey_filename").text(data.config.platformPubKey);
           
            if(data.accept==0){ 
            	$("#accept").val(0);
                $("#accept").attr("checked", true);
                
            }
           
            if(data.config.localPubKey){
            	$("#localPubKey_filename").css("display","block");
            }else {
            	$("#localPubKey_filename").css("display","none");
            }
            if(data.config.localPrivKey){
            	$("#localPrivKey_filename").css("display","block");
            }else {
            	$("#localPrivKey_filename").css("display","none");
            }
            if(data.config.platformPubKey){
            	$("#platformPubKey_filename").css("display","block");
            }else {
            	$("#platformPubKey_filename").css("display","none");
            }
        },
        bindBtnEvents:function(){
        	 var self=this;
        	 $("#accept").bind('click',function(){
              	
              	var temp = $(this).val();
              	
              	if(temp == 1 || temp == "1"){
              		$("#accept").val(0);
              		$("#accept").attr("checked", true);
              	}else{
              		$("#accept").val(1);
              		$("#accept").removeAttr("checked");
              	}
              	
              	
              });
        	$("#sms-config-save").click(function(){
        		
                    var config = self.getConfig();
                    var name="icbcpay";
                    
                    var appId = $("#appId").val();
                    var localPubKey =$("#localPubKey_filename").text();
                    var localPrivKey =$("#localPrivKey_filename").text();
                    var platformPubKey =$("#platformPubKey_filename").text();
                    
                    if (appId == null || appId == "") {
                        dialog.render({lang: "please_enter_appid"});
                        return;
                    }
                    if (localPubKey == null || localPubKey == "") {
                        dialog.render({text: "请上传本地公钥"});
                        return;
                    }
                    if (localPrivKey == null || localPrivKey == "") {
                        dialog.render({text: "请上传本地私钥"});
                        return;
                    }
                    if (platformPubKey == null || platformPubKey == "") {
                        dialog.render({text: "请上传平台公钥"});
                        return;
                    }
                         
                    
                   
                    
                    cloud.util.mask(self.element);
                    Service.getIcbcConfig(name,self.configFlag,self.areaIds,function(data){
                    	if(data && data.result){//修改
                    		var id= data.result._id;
                    		if(self.configFlag == 1 || self.configFlag == "1"){
            					id = "000000000000000000000000";
            				}
                    		Service.updateIcbcConfig(id,name,config,self.configFlag,self.areaIds,function(data){
                    			dialog.render({lang:"save_success"});
                                self.setConfig(data.result);
                                cloud.util.unmask(self.element);
                            });
                    	}else{//添加
                    		Service.createIcbcConfig(name,config,self.configFlag,self.areaIds,function(data){
                    			dialog.render({lang:"save_success"});
                                self.setConfig(data.result);
                                cloud.util.unmask(self.element);
                            });
                    	}
                    	
                    });
                    
            });
        	
        	$("#localPubKey").click(function(){
        		if (this.uploadPro) {
                    this.uploadPro.destroy();
                }
                this.uploadPro = new UploadFile({
                    selector: "body",
                    areaIds:self.areaIds,
                    events: {
                        "uploadSuccess":function(filename) {
                        	$("#localPubKey_filename").text(filename);
                        	$("#localPubKey_filename").css("display","block");
                        }
                    }
                });
        	});
        	
        	$("#localPrivKey").click(function(){
        		if (this.uploadPro) {
                    this.uploadPro.destroy();
                }
                this.uploadPro = new UploadFile({
                    selector: "body",
                    areaIds:self.areaIds,
                    events: {
                        "uploadSuccess":function(filename) {
                        	$("#localPrivKey_filename").text(filename);
                        	$("#localPrivKey_filename").css("display","block");
                        }
                    }
                });
        	});
        	
        	$("#platformPubKey").click(function(){
        		if (this.uploadPro) {
                    this.uploadPro.destroy();
                }
                this.uploadPro = new UploadFile({
                    selector: "body",
                    areaIds:self.areaIds,
                    events: {
                        "uploadSuccess":function(filename) {
                        	$("#platformPubKey_filename").text(filename);
                        	$("#platformPubKey_filename").css("display","block");
                        }
                    }
                });
        	});
        	
        },
        getData:function(){
        	var self = this;
            cloud.util.mask(this.element);
            var name="icbcpay";
            var roleType = cloud.storage.sessionStorage("accountInfo").split(",")[9].split(":")[1];
			if(roleType == '51'){
				self.configFlag = 0;
				
				Service.getIcbcConfig(name,self.configFlag,self.areaIds,function(data){ 
	                if(data && data.result && data.result.config){
	                	self.setConfig(data.result);
	                }else{
	                	$("#label_delay").css("margin-left","-292px");
	                }
	                
	                cloud.util.unmask(self.element);
	            });
			}else{
				var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
	    		Service.getSmartUserById(userId,function(data){
	    			
	    			if(data && data.result){
	    				
	    				self.configFlag = data.result.configFlag;
	    				
	    				self.areaIds = data.result.area;
	    				
	    				
	    			}
	    			Service.getIcbcConfig(name,self.configFlag,self.areaIds,function(data){ 
    	                if(data && data.result && data.result.config){
    	                	self.setConfig(data.result);
    	                }else{
    	                	$("#label_delay").css("margin-left","-292px");
    	                }
    	                
    	                cloud.util.unmask(self.element);
    	            });
	    			
	    		});
			}
            
            
        }
	});
	return configuration;
});