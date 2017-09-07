define(function(require) {
	require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery.multiselect");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery.multiselect.css");
    var Button = require("cloud/components/button");
    var configHtml=require("text!./configHtml.html");
    var Service=require("../../service");
    require("../js/qrcode");
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
			$(".cs-col-slie-main-bd").css("width",$(".wrap").width());
            locale.render({element:self.element});
            if(permission.app("Alipay").write){
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
			/*$("#ali_pay_desc").html(
								  "<label style='font-weight:600;'>"+locale.get({lang:"notices"})+":&nbsp;&nbsp;</label>" +
								  "<label>&nbsp;"+locale.get({lang:"can_use"})+"</label>" +
								  "<label >&nbsp;$date&nbsp;"+locale.get({lang:"indicate_"})+"&nbsp;"+locale.get({lang:"buy_date"})+";</label>" +
								  "<label >&nbsp;$goods&nbsp;"+locale.get({lang:"indicate_"})+"&nbsp;"+locale.get({lang:"automat_name_of_commodity"})+"</label>"
								  );*/
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
            //if(!$("#accept:checked").val()){ 
            //    accept = 1;
            //}
            
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
            
            var counterFee = $("#CounterFee").val();
            var version = $("#version").val();
            if(version == 1){
            	version = "1.0";
            }else if(version == 2){
            	version = "2.0";
            }
            var appId = $("#appId").val();
            var alipublicKey = $("#alipublicKey").val();
            var localpublicKey = $("#localpublicKey").val();
            var localprivateKey = $("#localprivateKey").val();
            var pid = $("#pid").val();
            var key = $("#key").val();
            //var custom = $("#custom").val();
            
            var delayrefund = {
            		refundflag:refundflag,
            		refundtime:refundtime,
            		refundreason:refundreason
            }
            var config = {
            		pid:pid,
            		key:key,
            		shipmentNotice:"",
                    accept:parseInt(accept),
                    delayrefund:delayrefund,
                    version:version,
                    appId:appId,
                    alipublicKey:alipublicKey,
                    localpublicKey:localpublicKey,
                    localprivateKey:localprivateKey,
                    counterfee:counterFee                   
            };
            return config;
        },
        setConfig:function(data){
        	
        	$("#pid").val(data.config.pid);
            $("#key").val(data.config.key);
            $("#appId").val(data.config.appId);
            $("#alipublicKey").val(data.config.alipublicKey);
            $("#localpublicKey").val(data.config.localpublicKey);
            $("#localprivateKey").val(data.config.localprivateKey);
            $("#CounterFee").val(data.config.counterfee);
            if(data.accept == 0){ 
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
            	$("#label_delay").css("margin-left","-302px");
            }
            
            if(data.config.version == "1.0"){
            	$("#version").find("option[value='1']").attr("selected",true);

            }else if(data.config.version == "2.0"){
            	$("#version").find("option[value='2']").attr("selected",true);
            	$("#div_appId").css("display","block");
            	
            	$("#div_alipublicKey").css("display","block");
            	$("#div_localpublicKey").css("display","block");
            	$("#div_localprivateKey").css("display","block");
            	
            	
            }else{
            	$("#version").find("option[value='0']").attr("selected",true);
            }
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
             		$("#label_delay").css("margin-left","-302px");
             	}else{
             		$("#delayRefund").val(1);
             		$("#delayRefund").attr("checked", true);
             		$("#delayRefund_time").css("display","inline-block");
             		$("#refund_div").css("display","inline");
             		$("#puttime").css("display","inline-block");
             		$("#label_delay").css("margin-left","41px");
             		
             		$('#refund_reason option').each(function() {
                        this.selected = true;
                    });
         		    $('#refund_reason').multiselect("refresh");
             	}
             	
             	
             });
            
            $("#version").bind('change',function(){
            	var version = $("#version").val();
            	if(version == 1){

            		$("#div_appId").css("display","none");
                	$("#div_alipublicKey").css("display","none");
                	$("#div_localpublicKey").css("display","none");
                	$("#div_localprivateKey").css("display","none");
            	}else if(version == 2){
  
            		$("#div_appId").css("display","block");
            		
            		
            		
                	$("#div_alipublicKey").css("display","block");
                	$("#div_localpublicKey").css("display","block");
                	$("#div_localprivateKey").css("display","block");
            	}else{

            		$("#div_appId").css("display","none");
                	$("#div_alipublicKey").css("display","none");
                	$("#div_localpublicKey").css("display","none");
                	$("#div_localprivateKey").css("display","none");
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
        	 /*$("#custom").bind('click',function(){
               	
               	var temp = $(this).val();
               	
               	if(temp == 0 || temp == "0"){
               		$("#custom").val(1);
               		$("#custom").attr("checked", true);
               		
               		$("#div_alipublicKey").css("display","block");
                	$("#div_localpublicKey").css("display","block");
                	$("#div_localprivateKey").css("display","block");
               	}else{
               		$("#custom").val(0);
               		$("#custom").removeAttr("checked");
               		$("#div_alipublicKey").css("display","none");
                	$("#div_localpublicKey").css("display","none");
                	$("#div_localprivateKey").css("display","none");
               	}
               	
               	
               });*/
        	$("#sms-config-save").click(function(){
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
                    var name="alipay";
                    var counterFee = $("#CounterFee").val();
                    var version = $("#version").val();
                    var pid = $("#pid").val();
                    var key = $("#key").val();
                    if(version == 0){
                    	dialog.render({lang:"please_choose_alipay_version"});
                    	return;
                    }
                    
                    if (pid == null || pid.replace(/(^\s*)|(\s*$)/g,"")=="") {
                        dialog.render({lang: "please_enter_pid"});
                        return;
                    }
                	if (key == null || key.replace(/(^\s*)|(\s*$)/g,"")=="") {
                        dialog.render({lang: "please_enter_key"});
                        return;
                    }
                    if(version == 2){
                    	
                    	var custom = $("#custom").val();
                    	
                    	var appid = $("#appId").val();
                    	var alipublicKey = $("#alipublicKey").val();
                    	var localpublicKey = $("#localpublicKey").val();
                    	var localprivateKey = $("#localprivateKey").val();
                    	
                    	if (appid == null || appid.replace(/(^\s*)|(\s*$)/g,"")=="") {
                            dialog.render({lang: "please_enter_appid"});
                            return;
                        }
                		if (alipublicKey == null || alipublicKey.replace(/(^\s*)|(\s*$)/g,"")=="") {
                            
                    		dialog.render({lang: "please_enter_alipublickey"});
                            return;
                        }
                    	if (localpublicKey == null || localpublicKey.replace(/(^\s*)|(\s*$)/g,"")=="") {
                            dialog.render({lang: "please_enter_localpublickey"});
                            return;
                        }
                    	if (localprivateKey == null || localprivateKey.replace(/(^\s*)|(\s*$)/g,"")=="") {
                            dialog.render({lang: "please_enter_localprivatekey"});
                            return;
                        }
                    	
                    	
                    }
                    if (counterFee == null || counterFee == "") {
                        dialog.render({lang: "please_enter_counterfee"});
                        return;
                    }
                    console.log(config);
                    cloud.util.mask(self.element);
                    Service.getAliPayConfig(name,self.configFlag,self.areaIds,function(data){
                    	if(data && data.result){//修改
                    		var id= data.result._id;
                    		if(self.configFlag == 1 || self.configFlag == "1"){
            					id = "000000000000000000000000";
            				}
                    		Service.updateAliPayConfig(id,name,config,self.configFlag,self.areaIds,function(data){
                    			dialog.render({lang:"save_success"});
                                self.setConfig(data.result);
                            });
                    	}else{//添加
                    		Service.createAliPayConfig(name,config,self.configFlag,self.areaIds,function(data){
                    			dialog.render({lang:"save_success"});
                                self.setConfig(data.result);
                            });
                    	}
                    	cloud.util.unmask(self.element);
                    });
                    
            });
        	
        	
        	//支付配置测试
        	$("#sms-config-test").bind('click',function(){
        		
        		
        		$(".testing").css("display","inline-block");
        		
        		$("#place-order").html("");
        		$("#scan-code").html("");
        		$("#payment").html("");
        		$("#refund").html("");
        		$("#config-result").html("");
        		
                var config = self.getConfig();
                var name="alipay";
                var counterFee = $("#CounterFee").val();
                var version = $("#version").val();
                var pid = $("#pid").val();
                var key = $("#key").val();
                if(version == 0){
                	dialog.render({lang:"please_choose_alipay_version"});
                	return;
                }
                
                if (pid == null || pid.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_pid"});
                    return;
                }
            	if (key == null || key.replace(/(^\s*)|(\s*$)/g,"")=="") {
                    dialog.render({lang: "please_enter_key"});
                    return;
                }
                if(version == 2){
                	
                	var custom = $("#custom").val();
                	var appid = $("#appId").val();
                	var alipublicKey = $("#alipublicKey").val();
                	var localpublicKey = $("#localpublicKey").val();
                	var localprivateKey = $("#localprivateKey").val();
                	
                	if (appid == null || appid.replace(/(^\s*)|(\s*$)/g,"")=="") {
                        dialog.render({lang: "please_enter_appid"});
                        return;
                    }
                	if(custom == 1){
                		if (alipublicKey == null || alipublicKey.replace(/(^\s*)|(\s*$)/g,"")=="") {
                            
                    		dialog.render({lang: "please_enter_alipublickey"});
                            return;
                        }
                    	if (localpublicKey == null || localpublicKey.replace(/(^\s*)|(\s*$)/g,"")=="") {
                            dialog.render({lang: "please_enter_localpublickey"});
                            return;
                        }
                    	if (localprivateKey == null || localprivateKey.replace(/(^\s*)|(\s*$)/g,"")=="") {
                            dialog.render({lang: "please_enter_localprivatekey"});
                            return;
                        }
                	}
                	
                	
                }
                if (counterFee == null || counterFee == "") {
                    dialog.render({lang: "please_enter_counterfee"});
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
                    if(pid.indexOf("*") >= 0){
                    	flag = 1;
                    }
                    
                    Service.testAlipayConfig(oid,areaId,self.configFlag,flag,config,function(data){
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
        },
        getData:function(){
        	var self = this;
            cloud.util.mask(this.element);
            var name="alipay";
            var roleType = cloud.storage.sessionStorage("accountInfo").split(",")[9].split(":")[1];
			if(roleType == '51'){
				self.configFlag = 0;
				Service.getAliPayConfig(name,self.configFlag,self.areaIds,function(data){ 
	                if(data && data.result && data.result.config){
	                	self.setConfig(data.result);
	                }else{
	                	$("#label_delay").css("margin-left","-302px");
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

    				Service.getAliPayConfig(name,self.configFlag,self.areaIds,function(data){ 
    	                if(data && data.result && data.result.config){
    	                	self.setConfig(data.result);
    	                }else{
    	                	$("#label_delay").css("margin-left","-302px");
    	                }
    	                
    	                cloud.util.unmask(self.element);
    	            });
	    			
	    		});
				
			}
            
            
        }
	});
	return configuration;
});