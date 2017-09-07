/**
 * Created by zhang on 14-9-18.
 */
define(function(require){
    require("cloud/base/cloud");
    var configHtml=require("text!./partials/sms_config.html");
    var service=require("./service");
    require("./css/bootstrapSwitch.css");
    require("cloud/lib/plugin/jquery.datetimepicker");

    var SmsConfig = Class.create(cloud.Component,{
        initialize : function($super, options){
            $super(options);
            this.service = service;
            this.render();
        },
        render:function(){
            var self=this;
            self.element.html(configHtml);

            this.url = this.element.find("#sms-config-url");
//            this.httpBody = this.element.find("#sms-config-httpBody");
//            this.httpMethod = this.element.find("#sms-config-httpMethod");
            this.account = this.element.find("#sms-config-account");
            this.passwd = this.element.find("#sms-config-passwd");
            this.content = this.element.find("#sms-config-content");
            this.provider = this.element.find("#sms-config-provider");
//            this.createTime = this.element.find("#sms-config-createTime");

            this.editBtn = this.element.find("#sms-config-edit");
            this.saveBtn = this.element.find("#sms-config-save");
            this.cancelBtn = this.element.find("#sms-config-cancel");

            this.switchBtn = this.element.find(".has-switch");
            this.$animate = this.element.find(".switch-animate");

            /*this.createTime.datetimepicker({
                format:'Y/m/d H:i',
                step:1,
                startDate:'-1970/01/08',
                lang:locale.current() === 1 ? "en" : "ch"
            });*/

            this._setHolder();

            this._editable(false);

            this._bindBtnEvents();

            this._setTextarea();

            this._getData();
            locale.render();
        },

        _setHolder:function(){
            var holdervalue = locale.get("empty_not_change");
            this.url.attr("placeholder",holdervalue);
            this.account.attr("placeholder",holdervalue);
            this.passwd.attr("placeholder",holdervalue);
        },

        _getData:function(){
            var self = this;
            cloud.util.mask(this.element);
            this.service.getSmsConfig(function(data){
                self.config = data.result;
                self._setConfig(self.config);
                cloud.util.unmask(self.element);
            });
        },
        _setTextarea:function(){
            var self = this;
            var contentheight = this.content[0].scrollHeight;
            this.content.height(contentheight);

            this.content.bind("keypress",function(){
                self.content.height(self.content[0].scrollHeight-10);
            });
            
            var urlheight = this.url[0].scrollHeight;
            this.url.height(urlheight);

            this.url.bind("keypress",function(){
                self.url.height(self.url[0].scrollHeight-10);
            });
            
            
        },

        _bindBtnEvents:function(){
            var self = this;
            this.editBtn.click(function(){
                self._editable(true);

            });

            this.saveBtn.click(function(){
                var valires = self._validateUrl();
                if(valires){
                    var config = self._getConfig();
                    cloud.util.mask(self.element);
                    self.service.createSmsConfig(config,function(data){
                        self.config = data.result;
                        self._setConfig(self.config);

                        self._editable(false);
                        cloud.util.unmask(self.element);
                    });
                }
            });

            this.cancelBtn.click(function(){
                self._editable(false);
                self._setConfig(self.config);
                $("#error-tip").hide();
                $("#error-tip").text("");
                self.content.height(self.content[0].scrollHeight-10);
            });

            this.url.bind("blur",function(){
                self._validateUrl();
            });


            this.switchBtn.unbind("click").bind("click",function(){
                if(self.$animate.hasClass("switch-on")){//turn off
                    self.service.createSmsConfig({state:0},function(data){
                        data.result.state == 0 && self.$animate.removeClass("switch-on").addClass("switch-off");
                    });
                }else if(self.$animate.hasClass("switch-off")){//turn on
                    self.service.createSmsConfig({state:1},function(data){
                        data.result.state == 1 && self.$animate.removeClass("switch-off").addClass("switch-on");
                    });
                }

            });

            this.provider.bind("change",function(){
                var value = $(this).val();
                if(value == "guodu"){//disable account passwd
                    self.account.attr("disabled","disabled");
                    self.passwd.attr("disabled","disabled");
                }else if(value == "custom"){//enable account passwd
                    self.account.removeAttr("disabled");
                    self.passwd.removeAttr("disabled");
                }
            });
        },

        _editable:function(flag){
            if(!flag){//disable
                this.provider.attr("disabled","disabled");
                this.account.attr("disabled","disabled");
                this.passwd.attr("disabled","disabled");
//                this.httpBody.attr("disabled","disabled");
//                this.httpMethod.attr("disabled","disabled");
                this.url.attr("disabled","disabled");
                this.content.attr("disabled","disabled");
//                this.createTime.attr("disabled","disabled");

                this.element.find(".save-btn").hide();
                this.element.find(".edit-btn").show();
            }else{//enable
//                this.content.removeAttr("disabled");
                this.provider.removeAttr("disabled");
                if(this.provider.val() == "custom"){
                    this.account.removeAttr("disabled");
                    this.passwd.removeAttr("disabled");
                }
                this.url.removeAttr("disabled");
//                this.httpBody.removeAttr("disabled");
//                this.httpMethod.removeAttr("disabled");
//                this.createTime.removeAttr("disabled");

                this.element.find(".edit-btn").hide();
                this.element.find(".save-btn").show();
            }
        },

        _getConfig:function(){
            var url = this.url.val();
//            var httpBody = this.httpBody.val();
//            var httpMethod = this.httpMethod.val();
            var account = this.account.val();
            var passwd = this.passwd.val();
            var content = this.content.val();
            var provider = this.provider.val();
//            var createTime = this.createTime.val();

            var config = {
                url:url,
//                httpBody:httpBody,
//                httpMethod:httpMethod,
                account:account,
                passwd:passwd,
                content:content,
                provider:provider
//                createTime:createTime
            };
            return config;
        },
        _setConfig:function(cfg){
//            this.url.val(cfg.url);
//            this.httpBody.val(cfg.httpBody);
//            this.httpMethod.val(cfg.httpMethod);
//            this.account.val(cfg.account);
//            this.passwd.val(cfg.passwd);
            this.content.val(cfg.content);
            this.provider.val(cfg.provider);
//            this.createTime.val(cloud.util.dateFormat(new Date(cfg.createTime/1000),"yyyy/MM/dd hh:mm"));
            if(cfg.state == 1){
                this.$animate.removeClass("switch-off").addClass("switch-on");
            }else if(cfg.state == 0){
                this.$animate.removeClass("switch-on").addClass("switch-off");
            }
        },
        _validateUrl:function(){
            if(this.url.val()){
                var regex=/^((https|http|ftp|rtsp|mss):\/\/){1,1}/;
                if(regex.test(this.url.val())){
                    $("#error-tip").hide();
                    $("#error-tip").text("");
                    return true;
                }else{
                    $("#error-tip").text(locale.get("website_invalid"));
                    $("#error-tip").show();
                    return false;
                }
            }
        },

        rebuild:function(){
            var self=this;
            self.destroyPart();
            self.render();
        },
        destroyPart:function(){
            var self=this;
            self.element.find("*").unbind();
        },
        destroyAll:function(){
            var self=this;
            self.destroyPart();
            self.element.empty();
            self.destroy();
        },
        destroy:function($super){
            $super();
        }
    });
    return SmsConfig;
});