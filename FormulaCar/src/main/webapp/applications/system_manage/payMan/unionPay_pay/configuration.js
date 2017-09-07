define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.multiselect");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery.multiselect.css");
    var Button = require("cloud/components/button");
    var configHtml = require("text!./configuration.html");
    var Service = require("../../service");
    var UploadFile  = require("./uploadFile/uploadFile-window");
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
            locale.render({element: self.element});
            $(".cs-col-slie-main-bd").css("width",$(".wrap").width());
            if(permission.app("UnionPay_payment").write){
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
            require(["cloud/lib/plugin/jquery.multiselect"], function() {
                $("#refund_reason").multiselect({
                    header: true,
                    checkAllText: locale.get({lang: "check_all"}),
                    uncheckAllText: locale.get({lang: "uncheck_all"}),
                    noneSelectedText: locale.get({lang: "refund_reason"}),
                    selectedText: "# " + locale.get({lang: "is_selected"}),
                    minWidth: 180,
                    height: 120
                });
            });
        },
        getConfig: function() {
            var accept = $("#accept").val();
            var refundflag = $("#delayRefund").val();
            var refundtime = $("#delayRefund_time").val();
            var refundreason = $("#refund_reason").val();

            var merchantNumber = $("#merchantNumber").val();//商户号
            var certificatePwd = $("#certificatePwd").val();//私钥证书密码
            var certificate =$("#certificate_filename").text();
            
            if(refundflag == "0" || refundflag == 0){ 
            	refundtime = 0;
            	refundreason = "";
            }else{

            	if(refundreason != null && refundreason.length != 0){
                	refundreason = refundreason.join(",");
                }
            }
            
            if(refundtime == 1){
            	refundtime = 300;
            }else if(refundtime == 2){
            	refundtime = 1800;
            }else if(refundtime == 3){
            	refundtime = 3600;
            }else if(refundtime == 4){
            	refundtime = 7200;
            }else if(refundtime == 5){
            	refundtime = 10;
            }
            
            var delayrefund = {
            		refundflag:refundflag,
            		refundtime:refundtime,
            		refundreason:refundreason
            }
            
            var config = {
                accept: parseInt(accept),
                delayrefund:delayrefund,
                number:merchantNumber,
                certificatePwd: certificatePwd,
                certificate:certificate,
            };
            return config;
        },
        setConfig: function(data) { 
            if(data.accept==0){ 
            	$("#accept").val(0);
                $("#accept").attr("checked", true);
            }
            if(data.delayrefund && data.delayrefund.refundflag==1){ 
                $("#delayRefund").attr("checked", true);
                $("#delayRefund").val(1);
                $("#delayRefund_time").css("display","inline-block");
                $("#refund_div").css("display","inline");
                $("#puttime").css("display","inline-block");
                var delaytime = data.delayrefund.refundtime;
                if(delaytime == 300){
                	delaytime = 1;
                }else if(delaytime == 1800){
                	delaytime = 2;
                }else if(delaytime == 3600){
                	delaytime = 3;
                }else if(delaytime == 7200){
                	delaytime = 4;
                }else if(delaytime == 10){
                	delaytime = 5;
                }else{
                	delaytime = 0;
                }
                $("#delayRefund_time").find("option[value='"+delaytime+"']").attr("selected",true);
                var reason = data.delayrefund.refundreason;
                
                require(["cloud/lib/plugin/jquery.multiselect"], function() {
                    $("#refund_reason").multiselect({
                        header: true,
                        checkAllText: locale.get({lang: "check_all"}),
                        uncheckAllText: locale.get({lang: "uncheck_all"}),
                        noneSelectedText: locale.get({lang: "refund_reason"}),
                        selectedText: "# " + locale.get({lang: "is_selected"}),
                        minWidth: 180,
                        height: 120
                    });
                    
                    $('#refund_reason').val(reason.split(","));
                    $('#refund_reason').multiselect("refresh");
                    
                });
                
            }else{
            	$("#refund_div").css("display","none");
            	$("#delayRefund_time").css("display","none");
            	$("#puttime").css("display","none");
            	$("#label_delay").css("margin-left","-292px");
            }
            $("#merchantNumber").val(data.config.number);
            $("#certificatePwd").val(data.config.certificatePwd);
            $("#certificate_filename").text(data.config.certificate);
            $("#certificate_filename").css("display","block");
        	
        },
        bindBtnEvents: function() {
            var self = this;
            $("#delayRefund").bind('click',function(){
             	
             	var temp = $(this).val();
             	
             	if(temp == 1 || temp == "1"){
             		$("#delayRefund").val(0);
             		$("#delayRefund").removeAttr("checked");
             		$("#delayRefund_time").css("display","none");
             		$("#refund_div").css("display","none");
             		$("#puttime").css("display","none");
             		$("#label_delay").css("margin-left","-292px");
             	}else{
             		$("#delayRefund").val(1);
             		$("#delayRefund").attr("checked", true);
             		$("#delayRefund_time").css("display","inline-block");
             		$("#refund_div").css("display","inline");
             		$("#puttime").css("display","inline-block");
             		$("#label_delay").css("margin-left","50px");
             	}
             	$('#refund_reason option').each(function() {
                    this.selected = true;
                });
     		    $('#refund_reason').multiselect("refresh");
             	
             });
            $("#certificate1").click(function(){
        		if (this.uploadPro) {
                    this.uploadPro.destroy();
                }
                this.uploadPro = new UploadFile({
                    selector: "body",
                    areaIds:self.areaIds,
                    events: {
                        "uploadSuccess":function(filename) {
                        	$("#certificate_filename").text(filename);
                        	$("#certificate_filename").css("display","block");
                        }
                    }
                });
        	});
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
            $("#sms-config-save").click(function() {
        		var refundflag = $("#delayRefund").val();
                var refundtime = $("#delayRefund_time").val();
                var refundreason = $("#refund_reason").val();
                
                if(refundflag != "0" && refundflag != 0){
                	if(refundtime == 0 || refundtime == "0"){
                		dialog.render({lang:"please_choose_delayrefund_time"});
                		return;
                	}else{
                		if(refundreason == null || refundreason.length == 0){
                			dialog.render({lang:"please_choose_refund_reason"});
                    		return;
                		}
                		
                	}
                }
                var config = self.getConfig();
                var name = "UNIONPAY";
                
                var merchantNumber = $("#merchantNumber").val();//商户号
                var certificatePwd = $("#certificatePwd").val();//私钥证书密码
                var file1 =$("#certificate_filename").text();
                
                if (merchantNumber == null || merchantNumber.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_merchant_number"});
                    return;
                }
                if (file1 == null || file1.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_certificate"});
                    return;
                }
                if (certificatePwd == null || certificatePwd.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_certificatePwd"});
                    return;
                }
                
                cloud.util.mask(self.element);
                Service.getunionPayConfig(name,self.configFlag,self.areaIds, function(data) {
                    if (data && data.result) {//修改
                        var id = data.result._id;
                        if(self.configFlag == 1 || self.configFlag == "1"){
        					id = "000000000000000000000000";
        				}
                        Service.updateunionPayConfig(id, name, config,self.configFlag,self.areaIds, function(data) {
                        	dialog.render({lang:"save_success"});
                            self.setConfig(data.result);
                        });
                    } else {//添加
                        Service.createunionPayConfig(name, config,self.configFlag,self.areaIds, function(data) {
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
            var name = "UNIONPAY";
            var roleType = cloud.storage.sessionStorage("accountInfo").split(",")[9].split(":")[1];
			if(roleType == '51'){
				self.configFlag = 0;
				Service.getunionPayConfig(name,self.configFlag,self.areaIds, function(data) {
	                if (data && data.result && data.result.config) {
	                    self.setConfig(data.result);
	                }
	                cloud.util.unmask(self.element);
	            });
			}else{
				var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
	    		Service.getSmartUserById(userId,function(data){
	    			if(data && data.result){
	    				self.configFlag = data.result.configFlag;
	    				self.areaIds = data.result.area;
	    				console.log(self.areaIds);
	    				
	    			}

	    			Service.getunionPayConfig(name,self.configFlag,self.areaIds, function(data) {
		                if (data && data.result && data.result.config) {
		                    self.setConfig(data.result);
		                }
		                cloud.util.unmask(self.element);
		            });
	    			
	    		});
				
			}	
            
        }
    });
    return configuration;
});