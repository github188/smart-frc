define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.multiselect");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery.multiselect.css");
    var Button = require("cloud/components/button");
    var configHtml = require("text!./configHtml.html");
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
            $(".static_div_height").css("height",$(".cs-col-slie-main-bd").height()-40);
            if(permission.app("Vip_payment").write){
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

            var mode = $("#version").val();
            var vipInfoUrl = $("#vipInfoUrl").val();
            var tradeNoticeUrl = $("#tradeNoticeUrl").val(); 
            var shipmentNoticeUrl = $("#shipmentNoticeUrl").val();
            var appId = $("#appId").val();
            var appSecret = $("#appSecret").val(); 
            var registerUrl = $("#registerUrl").val();
            var mchId = $("#Mchid").val();//商户号
            var clientSecret = $("#ClientSecret").val();//API秘钥 
            var callback_url = $("#BackDomain").val();//授权回调页面域名
            
            var partner =  $("#partner").val();
            var password =  $("#password").val();
            
            var certificate = 1;
            var file1 =$("#certificate1_filename").text();
            var file2 =$("#certificate2_filename").text();
            var file3 =$("#certificate3_filename").text();
            var file4 =$("#certificate4_filename").text();
            if(file1 && file2 && file3 && file4){
            	certificate = 0;
            }
            
            var config = {
                accept: parseInt(accept),
                mode:mode,
                vipInfoUrl: vipInfoUrl,
                tradeNoticeUrl:tradeNoticeUrl,
                shipmentNoticeUrl:shipmentNoticeUrl,
                appId:appId,
                appSecret:appSecret,
                registerUrl:registerUrl,
                mchId:mchId,
                clientSecret:clientSecret,
                callback_url:callback_url,
                certificate:certificate,
                partner:partner,
                password:password
            };
            return config;
        },
        setConfig: function(data) { 
            if(data.accept==0){ 
            	$("#accept").val(0);
                $("#accept").attr("checked", true);
            }
            if(data.config.mode){
            	$("#version").find("option[value='"+data.config.mode+"']").attr("selected",true);
            }
            
            if(data.config.mode == "1"){
       		    $("#jinghuan").css("display","none");
       		    $("#jifen").css("display","none");
       	    }else if(data.config.mode == "2"){
       		    $("#jinghuan").css("display","block");
       		    $("#jifen").css("display","none");
       	    }else if(data.config.mode == "3"){
       		    $("#jinghuan").css("display","none");
       		    $("#jifen").css("display","block");
       	    }
            
            $("#vipInfoUrl").val(data.config.vipInfoUrl);
            $("#tradeNoticeUrl").val(data.config.tradeNoticeUrl);
            $("#shipmentNoticeUrl").val(data.config.shipmentNoticeUrl);
            $("#appId").val(data.config.appId);
            $("#appSecret").val(data.config.appSecret);
            $("#registerUrl").val(data.config.registerUrl);
            $("#Mchid").val(data.config.mchId);//商户号
            $("#ClientSecret").val(data.config.clientSecret);//API秘钥 
            $("#BackDomain").val(data.config.callback_url);//授权回调页面域名
            
            $("#partner").val(data.config.partner);
            $("#password").val(data.config.password);
            
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
        bindBtnEvents: function() {
            var self = this;
            
             $("#version").bind('change',function(){
            	 var options=$("#version option:selected").val();
            	 if(options == 1){
            		 $("#jinghuan").css("display","none");
            		 $("#jifen").css("display","none");
            	 }else if(options == 2){
            		 $("#jinghuan").css("display","block");
            		 $("#jifen").css("display","none");
            	 }else if(options == 3){
            		 $("#jinghuan").css("display","none");
            		 $("#jifen").css("display","block");
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
         	
            $("#sms-config-save").click(function() {
                var config = self.getConfig();
                var name = "vippay";
                
                var mode = $("#version").val();
                var vipInfoUrl = $("#vipInfoUrl").val();
                var tradeNoticeUrl = $("#tradeNoticeUrl").val();
                var shipmentNoticeUrl = $("#shipmentNoticeUrl").val();
                var appId = $("#appId").val();
                var appSecret = $("#appSecret").val(); 
                var registerUrl = $("#registerUrl").val();
                var file1 =$("#certificate1_filename").text();
                var file2 =$("#certificate2_filename").text();
                var file3 =$("#certificate3_filename").text();
                var file4 =$("#certificate4_filename").text();
                
                var partner =  $("#partner").val();
                var password =  $("#password").val();
                
                if(mode == 0){
                	dialog.render({lang:"please_choose_alipay_version"});
                	return;
                }
                if(mode == 2){
                	 if (appId == null || appId.replace(/(^\s*)|(\s*$)/g,"")=="") {
                         dialog.render({lang: "please_enter_vip_appid"});
                         return;
                     }
                     if (appSecret == null || appSecret.replace(/(^\s*)|(\s*$)/g,"")=="") {
                         dialog.render({lang: "please_enter_vip_appsecret"});
                         return;
                     }
                     if (vipInfoUrl == null || vipInfoUrl.replace(/(^\s*)|(\s*$)/g,"")=="") {
                         dialog.render({lang: "please_enter_vipinfourl"});
                         return;
                     }
                     if (tradeNoticeUrl == null || tradeNoticeUrl.replace(/(^\s*)|(\s*$)/g,"")=="") {
                         dialog.render({lang: "please_enter_tradenoticeurl"});
                         return;
                     }
                     if (shipmentNoticeUrl == null || shipmentNoticeUrl.replace(/(^\s*)|(\s*$)/g,"")=="") {
                         dialog.render({lang: "please_enter_shipmentnoticeurl"});
                         return;
                     }
                     if (registerUrl == null || registerUrl.replace(/(^\s*)|(\s*$)/g,"")=="") {
                         dialog.render({lang: "please_enter_registerurl"});
                         return;
                     }
                }else if(mode == 3){
                	if (partner == null || partner.replace(/(^\s*)|(\s*$)/g,"")=="") {
                        dialog.render({text: "请输入开户银行"});
                        return;
                    }
                    if (password == null || password.replace(/(^\s*)|(\s*$)/g,"")=="") {
                        dialog.render({text: "请输入登录密码"});
                        return;
                    }
                }
               
                /*if (file1 == null || file1 == "") {
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
                }*/
                cloud.util.mask(self.element);
                Service.getVipPayConfig(name,self.configFlag,self.areaIds, function(data) {
                    if (data && data.result) {//修改
                        var id = data.result._id;
                        if(self.configFlag == 1 || self.configFlag == "1"){
        					id = "000000000000000000000000";
        				}
                        Service.updateVipPayConfig(id, name, config,self.configFlag,self.areaIds, function(data) {
                        	dialog.render({lang:"save_success"});
                            self.setConfig(data.result);
                        });
                    } else {//添加
                        Service.createVipPayConfig(name, config,self.configFlag,self.areaIds, function(data) {
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
            var name = "vippay";
            var roleType = cloud.storage.sessionStorage("accountInfo").split(",")[9].split(":")[1];
			if(roleType == '51'){
				self.configFlag = 0;
				Service.getVipPayConfig(name,self.configFlag,self.areaIds, function(data) {
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

	    			Service.getVipPayConfig(name,self.configFlag,self.areaIds, function(data) {
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