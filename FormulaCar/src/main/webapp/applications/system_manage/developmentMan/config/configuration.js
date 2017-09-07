define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.multiselect");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery.multiselect.css");
    var Button = require("cloud/components/button");
    var configHtml = require("text!./configHtml.html");
    var Service = require("../../service");
    var configuration = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.configFlag = 0;
			this.areaIds = [];
            this.render();
        },
        render: function() {
            var self = this;
            this.renderHtml();
            $(".static_div_height").css("width",$(".wrap").width()*0.9);
            locale.render({element: self.element});
            if(permission.app("parameter_config").write){
            	$("#sms-config-save").show();
            }else{
            	$("#sms-config-save").hide();
            }
            this.getConfig();
            this.bindBtnEvents();
            this.getData();
        },
        renderHtml: function() {
            var self = this;
            self.element.html(configHtml);
        },
        getConfig: function() {
            var accept = $("#accept").val();
                      
            var interfaceType = $("#interfaceType").val();
            
            var parameterWS = $("#parameterWS").val();
            var clientId = $("#clientId").val();
            //结账数据方式
            var dataStyle = $("#dataStyle").val();
            
            var deviceMsgUrl = $("#deviceMsgUrl").val();
            var tradeMsgUrl = $("#tradeMsgUrl").val();
            var statusMsgUrl = $("#statusMsgUrl").val();
            var codeAuthMsgUrl = $("#codeAuthMsgUrl").val();
            var codeCancelMsgUrl = $("#codeCancelMsgUrl").val();
            var replenishMsgUrl = $("#replenishMsgUrl").val();
            var codeLength = $("#codeLength").val();
            
            var interfaceConfig = {
                accept: parseInt(accept),
                interfaceType:parseInt(interfaceType),
                parameterWS:parameterWS,
                deviceMsgUrl: deviceMsgUrl,
                tradeMsgUrl: tradeMsgUrl,
                statusMsgUrl: statusMsgUrl,
                codeAuthMsgUrl: codeAuthMsgUrl,
                codeCancelMsgUrl: codeCancelMsgUrl,
                codeLength:codeLength,
                replenishMsgUrl:replenishMsgUrl
            };
            var replenishConfig = {
            		dataStyle:parseInt(dataStyle)
            }
            var parameter = {
            		replenishConfig:replenishConfig,
            		interfaceConfig:interfaceConfig
            }
            return parameter;
        },
        setConfig: function(data) { 
        	
            if(data.interfaceConfig!=null && data.interfaceConfig.accept==1){ 
            	$("#accept").val(1);
                $("#accept").attr("checked", true);
            }
            
            if(data.interfaceConfig!=null && data.interfaceConfig.parameterWS != null){
            	$("#parameterWS").val(data.interfaceConfig.parameterWS);
            }
            
            if(data.interfaceConfig!=null && data.interfaceConfig.interfaceType != null){
            	$("#interfaceType").find("option[value='"+data.interfaceConfig.interfaceType+"']").attr("selected",true);
            
            
                if(data.interfaceConfig.interfaceType == 2){
                	$("#parameterWS_div").show();
                }
            }
            if(data.interfaceConfig!=null){
                $("#deviceMsgUrl").val(data.interfaceConfig.deviceMsgUrl);
                $("#tradeMsgUrl").val(data.interfaceConfig.tradeMsgUrl);
                $("#statusMsgUrl").val(data.interfaceConfig.statusMsgUrl);
                $("#codeAuthMsgUrl").val(data.interfaceConfig.codeAuthMsgUrl);
                $("#codeCancelMsgUrl").val(data.interfaceConfig.codeCancelMsgUrl);
                $("#codeLength").val(data.interfaceConfig.codeLength);
                $("#replenishMsgUrl").val(data.interfaceConfig.replenishMsgUrl);
            }
            
            if(data.replenishConfig != null){
            	if(data.replenishConfig.dataStyle == "1"){
            		$("#dataStyle").find("option[value='1']").attr("selected",true);
            	}else if(data.replenishConfig.dataStyle == "2"){
            		$("#dataStyle").find("option[value='2']").attr("selected",true);
            	}
            	
            }

        },
        bindBtnEvents: function() {
            var self = this;

        	 $("#accept").bind('click',function(){
              	
              	var temp = $(this).val();
              	
              	if(temp == 1 || temp == "1"){
              		$("#accept").val(0);
              		$("#accept").removeAttr("checked");
              		
              	}else{
              		$("#accept").val(1);
              		$("#accept").attr("checked", true);
              	}
              	
              	
              });
        	 $("#interfaceType").bind('change',function(){
        		 
        		 var val = $(this).val();
        		 if(val == 1){
        			 $("#parameterWS_div").hide();
        		 }else if(val == 2){
        			 $("#parameterWS_div").show();
        		 }
        	 });
            $("#sms-config-save").click(function() {
                var config = self.getConfig();
                
                var codeLength=$("#codeLength").val();
                if(codeLength == 6 || codeLength == 7 || codeLength == 8 || codeLength == 10){
                	dialog.render({lang:"codeLength_is_not_six_and_ten"});
                	return;
                }
                
                cloud.util.mask(self.element);
                Service.getParameterConfig(function(data) {
                    if (data && data.result) {//修改
                        var id = data.result._id;
                        Service.updateParameterConfig(id,config,function(data) {
                        	dialog.render({lang:"save_success"});
                            self.setConfig(data.result);
                        });
                    } else {//添加
                        Service.createParameterConfig(config,function(data) {
                        	dialog.render({lang:"save_success"});
                            self.setConfig(data.result);
                        });
                    }
                    cloud.util.unmask(self.element);
                });

            });
        },
        getData: function() {
            var self = this;
            cloud.util.mask(this.element);
            Service.getParameterConfig(function(data) {
                if (data && data.result) {
                    self.setConfig(data.result);
                }

                cloud.util.unmask(self.element);
            });	
            
        }
    });
    return configuration;
});