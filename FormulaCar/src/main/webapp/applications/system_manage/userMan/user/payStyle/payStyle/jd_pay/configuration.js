define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.multiselect");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery.multiselect.css");
    var Button = require("cloud/components/button");
    var configHtml = require("text!./configHtml.html");
    var Service = require("../../../../../service");
    require("../js/qrcode");
    var configuration = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.automatWindow = options.automatWindow;
            this.userId = options.userId;
            this.configFlag = 1;
			this.areaIds = [];
            this.render();
        },
        render: function() {
            var self = this;
            this.renderHtml();
            locale.render({element: self.element});
            $(".cs-col-slie-main-bd").css("width",$(".wrap").width());
            $(".static_div_height").css("height","450px");
            if(permission.app("Jingdong_Wallet").write){
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
            var merchantNo = $("#merchantNo").val();
            var codepayKey = $("#codepayKey").val(); 
            var privateKey = $("#privateKey").val();
            var delayrefund = {
            		refundflag:refundflag,
            		refundtime:refundtime,
            		refundreason:refundreason
            }
            var config = {
                accept: parseInt(accept),
                merchantNo: merchantNo,
                codepayKey:codepayKey,
                privateKey:privateKey,
                delayrefund:delayrefund
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
            $("#merchantNo").val(data.config.merchantNo);
            $("#codepayKey").val(data.config.codepayKey);
            $("#privateKey").val(data.config.privateKey);


        },
        bindBtnEvents: function() {
            var self = this;
            
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
               
                var merchantNo = $("#merchantNo").val();
                var privateKey = $("#privateKey").val();
                
                if (merchantNo == null || merchantNo.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_accountno"});
                    return;
                }
                if (privateKey == null || privateKey.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_privatekey"});
                    return;
                }
                cloud.util.mask(self.element);
                
                Service.getSmartUserById(self.userId,function(data_){
            		console.log(data_);
            		var name = "jdpay";
                    var areaIds = data_.result.area;
                    var config = self.getConfig();
                    
                    Service.getJDPayConfig(name,1,areaIds, function(data) {
                    	
	                    if (data && data.result && data.result._id) {//修改
	                        var id = data.result._id;
	                        Service.updateJDPayConfig(id, name, config,1,areaIds, function(data) {
	                        	dialog.render({lang:"save_success"});
	                            self.setConfig(data.result);
	                            $("tr").css("border-bottom","0px");
	                        });
	                    } else {//添加
	                        Service.createJDPayConfig(name, config,1,areaIds, function(data) {
	                        	dialog.render({lang:"save_success"});
	                            self.setConfig(data.result);
	                            $("tr").css("border-bottom","0px");
	                        });
	                    }
                       cloud.util.unmask(self.element);
                 });
            	});
            });
          //支付配置测试
            $("#sms-config-test").click(function() {
            	
                $(".testing").css("display","inline-block");
        		
        		$("#place-order").html("");
        		$("#scan-code").html("");
        		$("#payment").html("");
        		$("#refund").html("");
        		$("#config-result").html("");
                var config = self.getConfig();
                var name = "jdpay";
                
                var merchantNo = $("#merchantNo").val();
                var privateKey = $("#privateKey").val();
                
                if (merchantNo == null || merchantNo.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_accountno"});
                    return;
                }
                if (privateKey == null || privateKey.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_privatekey"});
                    return;
                }
                var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
                var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
                var roleType = permission.getInfo().roleType;
                var areaId = "";
                var flag = 0;
                Service.getAreaByUserId(userId,function(areadata){
                	
                	var areaIds=[];
                    if(areadata && areadata.result && areadata.result.area && areadata.result.area.length>0){
                    	areaIds = areadata.result.area;
                    }
                    
                    if(roleType == 51){
                    	areaIds = "";
                    }else{
                    	if(areaIds.length>0){
                    		areaId = areaIds[0];
                    	}
                    	
                    }
                    if(privateKey.indexOf("*") >= 0){
                    	flag = 1;
                    }
                    
                    Service.testJDPayConfig(oid,areaId,self.configFlag,flag,config,function(data){
            			console.log(data);
            			if(data.result && data.result.qr_code != ""){
            				
            				//var assetId = data.result.assetId;
            				var orderNo = data.result.order_no;
            				
            				$("#place-order").css("color","#9ACD32");
            				$("#place-order").html("下单成功&#10004");
            				
            				var qrcode = new QRCode(document.getElementById("scan-code"), {
                	            width : 160,//设置宽高
                	            height : 160
                	        });
                	        qrcode.makeCode(data.result.qr_code);
                	        
                	        var timer = setInterval(function(){
                            	
                            	Service.findTestResult("",orderNo,function(data){
                            	
                            		if(data.result){
                            			var pay = 1;
                            			if(data.result.pay_status == "success"){
                            				$("#payment").css("color","#9ACD32");
                            				$("#payment").html("支付成功&#10004");
                            			}else if(data.result.pay_status == "fail"){
                            				$("#payment").css("color","red");
                            				$("#payment").html("支付失败!");
                            				pay == 2;
                            			}else{
                            				$("#payment").css("color","black");
                            				$("#payment").html("支付中...");
                            				pay = 0;
                            			}
                            			if(pay == 1){
                            				if(data.result.refund_status == "success"){
                                				$("#refund").css("color","#9ACD32");
                                				$("#refund").html("退款成功&#10004");
                                				
                                				$("#config-result").css("color","#9ACD32");
                                				$("#config-result").html("支付配置验证通过&#10004");
                                				
                                				$(".testing").css("display","none");
                                        		
                                				clearInterval(timer);
                                				
                                				
                                			}else if(data.result.refund_status != null){
                                				$("#refund").css("color","red");
                                				$("#refund").html("退款失败!");
                                				
                                				$("#config-result").css("color","red");
                                				$("#config-result").html(data.result.refund_status);
                                				
                                				$(".testing").css("display","none");
                                				clearInterval(timer);
                                				
                                				
                                			}else{
                                					$("#refund").css("color","black");
                                    				$("#refund").html("退款中...");
                                				
                                			}
                            			}
                            			
                            			
                            		}
                            	})
    					               
    				            
    							
    						},5000);
                	        
            			}else{
            				$("#place-order").css("color","red");
            				$("#place-order").html("下单失败!");
            			}
            			
                    });
                    
                    
                });

            });
        },
        getData: function() {
            var self = this;
            cloud.util.mask(this.element);
            var name = "jdpay";
            Service.getSmartUserById(self.userId,function(data){
        		console.log(data);
                var areaIds = data.result.area;
                Service.getJDPayConfig(name,1,areaIds, function(data) {
            	    if (data && data.result && data.result.config) {
	                    self.setConfig(data.result);
	                }else{
	                	$("#label_delay").css("margin-left","-292px");
	                }
	                cloud.util.unmask(self.element);
               });
            });
        }
    });
    return configuration;
});