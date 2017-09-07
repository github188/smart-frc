define(function(require) {
	require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    var Button = require("cloud/components/button");
    var configHtml=require("text!./configHtml.html");
    var Service=require("../../service");
	var configuration = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.render();
		},
		render:function(){
			var self=this;
			this.renderHtml();
            locale.render({element:self.element});
            this.bindBtnEvents();
            this.getData();
		},
		renderHtml:function(){
			var self=this;
			self.element.html(configHtml);
		},
		getConfig:function(){
            var newMessage = $("#newMessage").val();
            var oldMessage = $("#oldMessage").val();

            var config = {
            		newMessage:newMessage,
            		oldMessage:oldMessage
            };
            return config;
        },
		setConfig:function(config){
        	$("#newMessage").val(config.newMessage);
            $("#oldMessage").val(config.oldMessage);
        },
	    bindBtnEvents:function(){
	    	var self=this;
	    	$("#sms-config-save").click(function(){
	    		 var config = self.getConfig();
                 var name="card";
                 cloud.util.mask(self.element);
	    		 Service.getCardConfig(name,function(data){
                 	if(data && data.result){//修改
                 		var id= data.result._id;
                 		Service.updateCardConfig(id,name,config,function(data){
                             self.setConfig(data.result.config);
                         });
                 	}else{//添加
                 		Service.createCardConfig(name,config,function(data){
                             self.setConfig(data.result.config);
                         });
                 	}
                 	cloud.util.unmask(self.element);
                 });
	    	});
		},
		 getData:function(){
	        	var self = this;
	            cloud.util.mask(this.element);
	            var name="card";
	            Service.getCardConfig(name,function(data){
	                if(data && data.result && data.result.config){
	                	self.setConfig(data.result.config);
	                }
	                
	                cloud.util.unmask(self.element);
	            });
	        }
	});
	return configuration;
});