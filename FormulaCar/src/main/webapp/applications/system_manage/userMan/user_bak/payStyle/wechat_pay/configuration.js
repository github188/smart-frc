define(function(require) {
	require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery.multiselect");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery.multiselect.css");
    var Button = require("cloud/components/button");
    var configHtml=require("text!./configHtml.html");
    var Service=require("../../../../service");
    require("../js/qrcode");
    var UploadFile  = require("./uploadFile/uploadFile-window");
	var configuration = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.automatWindow = options.automatWindow;
			this.basedata = options.data;
		    this.smartData = options.smartData;
			this.configFlag = 1;
			this.areaIds = [];
			this.render();
		},
		render:function(){
			var self=this;
			this.renderHtml();
            locale.render({element:self.element});
            if(permission.app("WeChat_payment").write){
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
			$(".static_div_height").css("height","450px");
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
		getConfig:function(){
            var accept = $("#accept").val();
            var refundflag = $("#delayRefund").val();
            var refundtime = $("#delayRefund_time").val();
            
            var refundreason = $("#refund_reason").val();
            
            var style = $("#style").val();
            var mchType = $("#contactType_code").val();
            var subAppId = $("#SubAppID").val();
            var SubMchid = $("#SubMchid").val();
            
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
           
            var counterFee = $("#CounterFee").val();
            
            var certificate = 1;
            var AppID = $("#AppID").val();
            var AppSecret = $("#AppSecret").val();
            var MchId = $("#Mchid").val();
            var ClientSecret = $("#ClientSecret").val();
           
            var BackDomain = $("#BackDomain").val();
            var RefundNotice = $("#RefundNotice").val();
            var TradeCodeNotice = $("#TradeCodeNotice").val();
            var file1 =$("#certificate1_filename").text();
            var file2 =$("#certificate2_filename").text();
            var file3 =$("#certificate3_filename").text();
            var file4 =$("#certificate4_filename").text();
            if(file1 && file2 && file3 && file4){
            	certificate = 0;
            }
            var delayrefund = {
            		refundflag:refundflag,
            		refundtime:refundtime,
            		refundreason:refundreason
            }
            var config = {
            		style:style,
            		mchType:mchType,
            		appID:AppID,
            		appSecret:AppSecret,
            		mchId:MchId,
            		subAppId:subAppId,
            		subMchId:SubMchid,
            		clientSecret:ClientSecret,
            		
            		accept:parseInt(accept),
            		certificate:certificate,
            		delayrefund:delayrefund,
            		backDomain:BackDomain,
            		refundNoticeUrl:RefundNotice,
            		tradeCodeNoticeUrl:TradeCodeNotice,
            		counterfee:counterFee
            };
            return config;
        },
        setConfig:function(data){
        	$("#AppID").val(data.config.appID);
            $("#AppSecret").val(data.config.appSecret);
            $("#Mchid").val(data.config.mchId);
           
            if(data.config.mchType){
            	$("#contactType_code").find("option[value='"+data.config.mchType+"']").attr("selected",true);
            }
            if(data.config.style){
            	$("#style").find("option[value='"+data.config.style+"']").attr("selected",true);
            	if(data.config.style == '3'){
            		 $("#myshelf").css("display","none");
        			 $(".btn-wrp").css("display","none");
        			 $("#thirdUrl").css("display","block");
            	}else{
            		 $("#myshelf").css("display","block");
        			 $(".btn-wrp").css("display","block");
        			 $("#thirdUrl").css("display","none");
            	}
            }
            
            
            if(data.config.mchType == "1"){
            	$("#subAppIdDiv").css("display","block");
    			$("#subMchidDiv").css("display","block");
            }
            if(data.config.subAppId){
            	$("#SubAppID").val(data.config.subAppId);
            }
            if(data.config.subMchId){
            	$("#SubMchid").val(data.config.subMchId);
            }
            
            $("#ClientSecret").val(data.config.clientSecret);
            $("#BackDomain").val(data.backDomain);
            $("#RefundNotice").val(data.config.refundNoticeUrl);
            $("#TradeCodeNotice").val(data.config.tradeCodeNoticeUrl);
            $("#CounterFee").val(data.config.counterfee);
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
           
            if(data.config.certificate == 1){
            	$("#certificate1_filename").css("display","none");
                $("#certificate2_filename").css("display","none");
                $("#certificate3_filename").css("display","none");
                $("#certificate4_filename").css("display","none");
            }else if(data.config.certificate == 0){
            	$("#certificate1_filename").text("apiclient_cert.p12");
            	$("#certificate1_filename").css("display","block");
            	
            	$("#certificate2_filename").text("apiclient_cert.pem");
            	$("#certificate2_filename").css("display","block");
            	
            	$("#certificate3_filename").text("apiclient_key.pem");
             	$("#certificate3_filename").css("display","block");
             	
             	$("#certificate4_filename").text("rootca.pem");
             	$("#certificate4_filename").css("display","block");
            }
        },
        userManange:function(){
        	var self = this;
        	Service.getUserByName(self.basedata.name,function(userData){
            	if(userData.result == false){
            		Service.addUser(self.basedata,function(data_){
                        if(data_.error!=null){
     	                    if(data_.error_code == "20007"){
     						    dialog.render({lang:"user_already_exists"});
     						    return;
     					    }
     	                }else{
     	                	self.smartData.userId = data_.result._id,
     	                	Service.addSmartUser(self.smartData,function(data_){
     	                		if(data_.error_code != null){
     	                			if(data_.error_code == "70033"){
     	    					    	dialog.render({lang:"area_alerady_custom_pay"});
     	    						    return;
     	    					    }
     	                		}
     	                	});
     					}
     			    });
 			   }else{
 				  Service.updateUser(self.basedata.name,self.basedata,function(data_){
 					   self.smartData.userId = data_.result._id,
                 	    Service.updateSmartUser(data_.result._id,self.smartData,function(data){
                 		  if(data.error_code != null){
    	                			if(data.error_code == "70033"){
    	    					    	dialog.render({lang:"area_alerady_custom_pay"});
    	    						    return;
    	    					    }
    	                   }
                 	    });
    			  });
 			   }
            });
        },
        bindBtnEvents:function(){
        	 var self=this;
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
        	
        	$("#sms-config-save").click(function(){
        		    if(cloud.payStyle == "wechat"){
        		    	
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
                    var name="wechat";
                    
                    var style = $("#style").val();
                    
                    var counterFee = $("#CounterFee").val();
                    var AppID = $("#AppID").val();
                    var AppSecret = $("#AppSecret").val();
                    var MchId = $("#Mchid").val();
                    var ClientSecret = $("#ClientSecret").val();
                    var RefundNotice = $("#RefundNotice").val();
                    var TradeCodeNotice = $("#TradeCodeNotice").val();
                    var file1 =$("#certificate1_filename").text();
                    var file2 =$("#certificate2_filename").text();
                    var file3 =$("#certificate3_filename").text();
                    var file4 =$("#certificate4_filename").text();
                    
                    var mchType = $("#contactType_code").val();
                    var subAppId = $("#SubAppID").val();
                    var SubMchid = $("#SubMchid").val();
                    var options=$("#style option:selected").val();
                    if(options == 3){
                    }else{
                       if(mchType == "1"){
                         	if(subAppId == null || subAppId == ""){
                         		dialog.render({lang: "please_enter_subappid"});
                                 return;
                         	}
                         	if(SubMchid == null || SubMchid == ""){
                         		dialog.render({lang: "please_enter_subMchId"});
                                 return;
                         	}
                         }
                         
                         if (AppID == null || AppID == "") {
                             dialog.render({lang: "please_enter_appid"});
                             return;
                         }
                         if (AppSecret == null || AppSecret == "") {
                             dialog.render({lang: "please_enter_appSecret"});
                             return;
                         }
                         if (MchId == null || MchId == "") {
                             dialog.render({lang: "please_enter_MchId"});
                             return;
                         }
                         if (ClientSecret == null || ClientSecret == "") {
                             dialog.render({lang: "please_enter_ClientSecret"});
                             return;
                         }
                         if (counterFee == null || counterFee == "") {
                             dialog.render({lang: "please_enter_counterfee"});
                             return;
                         }
                      
                         if (file1 == null || file1 == "") {
                             dialog.render({lang: "certificate1_mark1"});
                             return;
                         }
                         if (file2 == null || file2 == "") {
                             dialog.render({lang: "certificate2_mark2"});
                             return;
                         }
                         if (file3 == null || file3 == "") {
                             dialog.render({lang: "certificate3_mark3"});
                             return;
                         }
                         if (file4 == null || file4 == "") {
                             dialog.render({lang: "certificate4_mark4"});
                             return;
                         }
                    }
                    
                   
                    
                    cloud.util.mask(self.element);
                    Service.getWechatConfig(name,self.configFlag,self.areaIds,function(data){
                    	if(data && data.result){//修改
                    		var id= data.result._id;
                    		if(self.configFlag == 1 || self.configFlag == "1"){
            					id = "000000000000000000000000";
            				}
                    		Service.updateWechatConfig(id,name,config,self.configFlag,self.areaIds,function(data){
                    			dialog.render({lang:"save_success"});
                                self.setConfig(data.result);
                                $("tr").css("border-bottom","0px");
                                
                                self.userManange();
                            });
                    	}else{//添加
                    		Service.createWechatConfig(name,config,self.configFlag,self.areaIds,function(data){
                    			dialog.render({lang:"save_success"});
                                self.setConfig(data.result);
                                $("tr").css("border-bottom","0px");
                                
                                self.userManange();
                            });
                    	}
                    	self.automatWindow.destroy();
                    	cloud.util.unmask(self.element);
                    });
                    
            });
        	
        	$("#contactType_code").change(function(){
        		var contractVal = $(this).children('option:selected').val();
        		if(contractVal == '1'){
        			$("#subAppIdDiv").css("display","block");
        			$("#subMchidDiv").css("display","block");
        		}else{
        			$("#subAppIdDiv").css("display","none");
        			$("#subMchidDiv").css("display","none");
        		}
        	});
        	
        	//支付配置测试
        	$("#sms-config-test").click(function(){
        		$(".testing").css("display","inline-block");
        		
        		$("#place-order").html("");
        		$("#scan-code").html("");
        		$("#payment").html("");
        		$("#refund").html("");
        		$("#config-result").html("");
                var config = self.getConfig();
                var name="wechat";
                
                var counterFee = $("#CounterFee").val();
                var AppID = $("#AppID").val();
                var AppSecret = $("#AppSecret").val();
                var MchId = $("#Mchid").val();
                var ClientSecret = $("#ClientSecret").val();
                var RefundNotice = $("#RefundNotice").val();
                var TradeCodeNotice = $("#TradeCodeNotice").val();
                var file1 =$("#certificate1_filename").text();
                var file2 =$("#certificate2_filename").text();
                var file3 =$("#certificate3_filename").text();
                var file4 =$("#certificate4_filename").text();
                
                if (AppID == null || AppID == "") {
                    dialog.render({lang: "please_enter_appid"});
                    return;
                }
                if (AppSecret == null || AppSecret == "") {
                    dialog.render({lang: "please_enter_appSecret"});
                    return;
                }
                if (MchId == null || MchId == "") {
                    dialog.render({lang: "please_enter_MchId"});
                    return;
                }
                if (ClientSecret == null || ClientSecret == "") {
                    dialog.render({lang: "please_enter_ClientSecret"});
                    return;
                }
                if (counterFee == null || counterFee == "") {
                    dialog.render({lang: "please_enter_counterfee"});
                    return;
                }
             
                if (file1 == null || file1 == "") {
                    dialog.render({lang: "certificate1_mark1"});
                    return;
                }
                if (file2 == null || file2 == "") {
                    dialog.render({lang: "certificate2_mark2"});
                    return;
                }
                if (file3 == null || file3 == "") {
                    dialog.render({lang: "certificate3_mark3"});
                    return;
                }
                if (file4 == null || file4 == "") {
                    dialog.render({lang: "certificate4_mark4"});
                    return;
                }
                
                //cloud.util.mask(self.element);
                
                
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
                    if(AppID.indexOf("*") >= 0){
                    	flag = 1;
                    }
                    
                    Service.testWechatConfig(oid,areaId,self.configFlag,flag,config,function(data){
            			console.log(data);
            			if(data.result && data.result.qr_code != ""){
            				
            				var assetId = data.result.assetId;
            				var orderNo = data.result.order_no;
            				
            				$("#place-order").css("color","#9ACD32");
            				$("#place-order").html("下单成功&#10004");
            				
            				var qrcode = new QRCode(document.getElementById("scan-code"), {
                	            width : 160,//设置宽高
                	            height : 160
                	        });
                	        qrcode.makeCode(data.result.qr_code);
                	        
                	        var timer = setInterval(function(){
                            	
                            	Service.findTestResult(assetId,orderNo,function(data){
                            	
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
        	$("#certificate1").click(function(){
        		if (this.uploadPro) {
                    this.uploadPro.destroy();
                }
                this.uploadPro = new UploadFile({
                    selector: "body",
                    marks:locale.get({lang: "certificate1_mark"}),
                    fileName:"apiclient_cert.p12",
                    areaIds:self.areaIds,
                    events: {
                        "uploadSuccess":function() {
                        	$("#certificate1_filename").text("apiclient_cert.p12");
                        	$("#certificate1_filename").css("display","block");
                        }
                    }
                });
        	});
        	$("#certificate2").click(function(){
        		if (this.uploadPro) {
                    this.uploadPro.destroy();
                }
                this.uploadPro = new UploadFile({
                    selector: "body",
                    marks:locale.get({lang: "certificate2_mark"}),
                    fileName:"apiclient_cert.pem",
                    areaIds:self.areaIds,
                    events: {
                    	 "uploadSuccess":function() {
                    		 $("#certificate2_filename").text("apiclient_cert.pem");
                         	 $("#certificate2_filename").css("display","block");
                         }
                    }
                });
        	});
        	$("#createCS").click(function(){
                dialog.render({
                    lang: "clientSecretTip",
                    buttons: [{
                            lang: "affirm",
                            click: function() {
                            	cloud.util.mask(self.element);
                                var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	               			　　     var maxPos = $chars.length;
	               			　　     var cs = '';
	               			　    　 for (i = 0; i < 32; i++) {
	               			　　　		cs += $chars.charAt(Math.floor(Math.random() * maxPos));
	               			　　	}
	               			 	document.getElementById("ClientSecret").value=cs;
	               			 	cloud.util.unmask(self.element);
                                dialog.close();
                            }
                        },
                        {
                            lang: "cancel",
                            click: function() {
                            	cloud.util.unmask(self.element);
                                dialog.close();
                            }
                        }]
                });
        		
  			 	
        	});
        	$("#certificate3").click(function(){
        		if (this.uploadPro) {
                    this.uploadPro.destroy();
                }
                this.uploadPro = new UploadFile({
                    selector: "body",
                    marks:locale.get({lang: "certificate3_mark"}),
                    fileName:"apiclient_key.pem",
                    areaIds:self.areaIds,
                    events: {
                    	 "uploadSuccess":function() {
                    		 $("#certificate3_filename").text("apiclient_key.pem");
                         	 $("#certificate3_filename").css("display","block");
                         }
                    }
                });
        	});
        	$("#certificate4").click(function(){
        		if (this.uploadPro) {
                    this.uploadPro.destroy();
                }
                this.uploadPro = new UploadFile({
                    selector: "body",
                    marks:locale.get({lang: "certificate4_mark"}),
                    fileName:"rootca.pem",
                    areaIds:self.areaIds,
                    events: {
                    	 "uploadSuccess":function() {
                    		 $("#certificate4_filename").text("rootca.pem");
                         	 $("#certificate4_filename").css("display","block");
                         }
                    }
                });
        	});
        	
        },
        getData:function(){
        	var self = this;
            cloud.util.mask(this.element);
            var name="wechat";
		    var userId = $("#userId").val();
	    	Service.getSmartUserById(userId,function(data){
	    		if(data && data.result){
	    			self.configFlag = data.result.configFlag;
	    			self.areaIds = data.result.area;
	    		}
	    		Service.getWechatConfig(name,self.configFlag,self.areaIds,function(data){ 
    	            if(data && data.result && data.result.config){
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