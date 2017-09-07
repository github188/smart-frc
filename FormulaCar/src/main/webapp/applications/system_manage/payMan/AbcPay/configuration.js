define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    var Button = require("cloud/components/button");
    var configHtml = require("text!./configHtml.html");
    var Service = require("../../service");
    var configuration = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.render();
        },
        render: function() {
            var self = this;
            this.renderHtml();
            locale.render({element: self.element});
            if(permission.app("automat_abcpay").write){
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
            var times = $("#times").val();
            var config = {
                times: times
            };
            return config;
        },
        setConfig: function(data) { 
            $("#times").val(data.config.times);
        },
        bindBtnEvents: function() {
            var self = this;
            $("#sms-config-save").click(function() {
                var config = self.getConfig();
                var name = "abc";
                var activeNum = $("#times").val();
        		//判断是否为空
        		if (activeNum=="") {
        			//处理
        			dialog.render({lang:"can_not_be_empty"});
        			return;
        		}
        		//判断为正整数
    			var strP=/^\+?[1-9][0-9]*$/ ; 
        	    if(!strP.test(activeNum)){
        	       dialog.render({lang:"please_enter_numbers"});
        	       return; 
        	    }
                cloud.util.mask(self.element);
                Service.getAbcConfig(name, function(data) {
                    if (data && data.result) {//修改
                        var id = data.result._id;
                        Service.updateAbcConfig(id, name, config, function(data) {
                        	dialog.render({lang:"save_success"});
                            self.setConfig(data.result);
                        });
                    } else {//添加
                        Service.createAbcConfig(name, config, function(data) {
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
            var name = "abc";
            Service.getAbcConfig(name, function(data) {
                if (data.result  && data.result.config) {
                    self.setConfig(data.result);
                }

                cloud.util.unmask(self.element);
            });
        }
    });
    return configuration;
});