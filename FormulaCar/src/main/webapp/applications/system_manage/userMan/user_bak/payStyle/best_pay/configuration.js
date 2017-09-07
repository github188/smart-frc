define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.multiselect");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery.multiselect.css");
    var Button = require("cloud/components/button");
    var configHtml = require("text!./configHtml.html");
    var Service = require("../../../../service");
    require("../js/qrcode");
    var UploadFile  = require("./uploadFile/uploadFile-window");
    var configuration = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.automatWindow = options.automatWindow;
            this.data = options.data;
			this.smartData = options.smartData;
            this.configFlag = 0;
			this.areaIds = [];
            this.render();
        },
        render: function() {
            var self = this;
            this.renderHtml();
            $(".cs-col-slie-main-bd").css("width",$(".wrap").width());
            $(".static_div_height").css("height","450px");
            locale.render({element: self.element});
            if(permission.app("Wing_payment").write){
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
            var host = cloud.config.FILE_SERVER_URL;
			$("#download_doc").attr("href",host+"/FormulaCar/downloads/WeChat.ppt");
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
            //if(!$("#accept:checked").val()){ 
            //    accept = 1;
           // }
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
            
            var accountNo = $("#accountNo").val();
            var accountName = $("#accountName").val();
            var cashierChannelNo = $("#cashierChannelNo").val();
            var platCode = $("#platCode").val();
            var loginCode = $("#loginCode").val();
            
            var publicKey = $("#publicKey").val();
            
            
            var certificate = 1;
            var file =$("#certificate_filename").text();
            if(file){
            	certificate = 0;
            }
            
            
            var delayrefund = {
            		refundflag:refundflag,
            		refundtime:refundtime,
            		refundreason:refundreason
            }
            var config = {
                accept: parseInt(accept),
                accountNo: accountNo,
                accountName: accountName,
                cashierChannelNo: cashierChannelNo,
                delayrefund:delayrefund,
                certificate:certificate,
                platCode:platCode,
                loginCode:loginCode,
                publicKey:publicKey
                
            };
            return config;
        },
        setConfig: function(data) { 
            if(data.accept==0){ 
            	$("#accept").val(0);
                $("#accept").attr("checked", true);
            }
            $("#accountNo").val(data.config.accountNo);
            $("#accountName").val(data.config.accountName);
            $("#cashierChannelNo").val(data.config.cashierChannelNo);
            $("#platCode").val(data.config.platCode);
            $("#loginCode").val(data.config.loginCode);
            $("#publicKey").val(data.config.publicKey);
            
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
           
            if(data.config.certificate == 1){
            	$("#certificate_filename").css("display","none");
            }else if(data.config.certificate == 0){
            	$("#certificate_filename").text("server.jks");
            	$("#certificate_filename").css("display","block");
            }
            
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
            	if(cloud.payStyle == "best"){
     		    	
 		        }else{
 		    	   return;
 		        }
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
                var name = "bestpay";
                
                var accountNo = $("#accountNo").val();
                var accountName = $("#accountName").val();
                var cashierChannelNo = $("#cashierChannelNo").val();

                var platCode = $("#platCode").val();
                var loginCode = $("#loginCode").val();
                var publicKey = $("#publicKey").val();
                
                var file =$("#certificate_filename").text();
                
                
                if (accountNo == null || accountNo.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_accountno"});
                    return;
                }
            	if (accountName == null || accountName.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_accountname"});
                    return;
                }
            	if (cashierChannelNo == null || cashierChannelNo.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_cashierchannelno"});
                    return;
                }
            	if (platCode == null || platCode.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_platcode"});
                    return;
                }
            	if (loginCode == null || loginCode.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_logincode"});
                    return;
                }
            	if (publicKey == null || publicKey.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_publickey"});
                    return;
                }
            	
            	if (file == null || file == "") {
                    dialog.render({lang: "certificate_mark"});
                    return;
                }
                cloud.util.mask(self.element);
                Service.getBestPayConfig(name,self.configFlag,self.areaIds, function(data) {
                    if (data && data.result) {//修改
                        var id = data.result._id;
                        if(self.configFlag == 1 || self.configFlag == "1"){
        					id = "000000000000000000000000";
        				}
                        Service.updateBestPayConfig(id, name, config,self.configFlag,self.areaIds, function(data) {
                        	dialog.render({lang:"save_success"});
                            self.setConfig(data.result);
                            $("tr").css("border-bottom","0px");
                        });
                    } else {//添加
                        Service.createBestPayConfig(name, config,self.configFlag,self.areaIds, function(data) {
                        	dialog.render({lang:"save_success"});
                            self.setConfig(data.result);
                            $("tr").css("border-bottom","0px");
                        });
                    }
                    self.automatWindow.destroy();
                    cloud.util.unmask(self.element);
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
                var name = "bestpay";
                
                var accountNo = $("#accountNo").val();
                var accountName = $("#accountName").val();
                var cashierChannelNo = $("#cashierChannelNo").val();

                var platCode = $("#platCode").val();
                var loginCode = $("#loginCode").val();
                var publicKey = $("#publicKey").val();
                
                var file =$("#certificate_filename").text();
                
                
                if (accountNo == null || accountNo.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_accountno"});
                    return;
                }
            	if (accountName == null || accountName.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_accountname"});
                    return;
                }
            	if (cashierChannelNo == null || cashierChannelNo.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_cashierchannelno"});
                    return;
                }
            	if (platCode == null || platCode.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_platcode"});
                    return;
                }
            	if (loginCode == null || loginCode.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_logincode"});
                    return;
                }
            	if (publicKey == null || publicKey.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_publickey"});
                    return;
                }
            	
            	if (file == null || file == "") {
                    dialog.render({lang: "certificate_mark"});
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
                    if(accountNo.indexOf("*") >= 0){
                    	flag = 1;
                    }
                    
                    Service.testBestPayConfig(oid,areaId,self.configFlag,flag,config,function(data){
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
            $("#certificate").click(function(){
        		if (this.uploadPro) {
                    this.uploadPro.destroy();
                }
                this.uploadPro = new UploadFile({
                    selector: "body",
                    marks:locale.get({lang: "certificate_mark"}),
                    fileName:"server.jks",
                    areaIds:self.areaIds,
                    events: {
                        "uploadSuccess":function() {
                        	$("#certificate_filename").text("server.jks");
                        	$("#certificate_filename").css("display","block");
                        }
                    }
                });
        	});
        },
        getData: function() {
            var self = this;
            cloud.util.mask(this.element);
            var name = "bestpay";
            var roleType = cloud.storage.sessionStorage("accountInfo").split(",")[9].split(":")[1];
            var userId = $("#userId").val();
	    		Service.getSmartUserById(userId,function(data){
	    			if(data && data.result){
	    				self.configFlag = data.result.configFlag;
	    				self.areaIds = data.result.area;
	    				console.log(self.areaIds);
	    				
	    			}

	    			Service.getBestPayConfig(name,self.configFlag,self.areaIds, function(data) {
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