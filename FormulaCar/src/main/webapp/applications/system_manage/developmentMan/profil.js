define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.multiselect");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery.multiselect.css");
    var Button = require("cloud/components/button");
    var configHtml = require("text!./profil.html");
    var Configuration = require("./config/configuration");
    var WechatBinding = require("./WechatBinding/list");
    var service = require("./service");
    var VerificationWin =  require("./service");
   
    var Profil = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.render();
        },
        render: function() {
            var self = this;
            this.renderHtml();
            this.getKey();
            this.bindEvent();
            this.renderConfig();
           // this.renderWechat_binding();
           
        },
        renderHtml: function() {
            var self = this;
            self.element.html(configHtml);
            var host = cloud.config.FILE_SERVER_URL;
			$("#example").attr("href",host+"/FormulaCar/downloads/example.zip");
			$("#doc").attr("href",host+"/FormulaCar/downloads/smartvm-v0.7.doc");
			
			$("#develpo").css("width",$(".container-bd").width());
        },
        getKey:function(){
        	cloud.util.mask("#develpo");
        	service.getkey(function(data){
    			if(data.result && data.result.clientId){
    				$("#client_id").text(data.result.clientId);
    				$("#client_secret").text(data.result.clientSecret);
    				$("#application_key").css("display","none");
    				if(permission.app("parameter_config").write){
    					$("#reset").css("display","block");
    				}
    				
    			}else{
    				$("#application_key").css("display","block");
    				$("#reset").css("display","none");
    			}
    			
    			
    			cloud.util.unmask("#develpo");
    			
    		});
        },
        bindEvent:function(){
        	$("#application_key").bind("click",function(){
        		service.createkey(function(data){
        			$("#client_id").text(data.result.clientId);
        			$("#client_secret").text(data.result.clientSecret);
        			$("#application_key").css("display","none");
        		});
        	});
        	$("#reset").bind("click",function(){
        		service.updatekey(function(data){
        			$("#client_secret").text(data.result.clientSecret);
        		});
        	});
        	
        },
        renderConfig:function(){
             var self = this;
             this.configuration = new Configuration({
                 selector: "#config",
                 events: {
                 }
             });
        },
        renderWechat_binding:function(){
        	 var self = this;
             this.wechatBinding = new WechatBinding({
                 selector: "#wechat_binding",
                 events: {
                 }
             });
        }
        
    });
    return Profil;
});