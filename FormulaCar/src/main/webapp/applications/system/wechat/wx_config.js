/**
 * Created by zhang on 14-9-18.
 */
define(function(require){
    require("cloud/base/cloud");
    var configHtml=require("text!./partials/wx_config.html");
    var service=require("./service");
    var WxConfig = Class.create(cloud.Component,{
        initialize : function($super, options){
            $super(options);
            this.service = service;
            this.render();
        },
        render:function(){
            var self=this;
            self.element.html(configHtml);

            this.devUserName = this.element.find("#wx-config-devUserName");
            this.appId = this.element.find("#wx-config-appId");
            this.appSecret = this.element.find("#wx-config-appSecret");
            this.handShakeUrl = this.element.find("#wx-config-handShakeUrl");
            this.handShakeToken = this.element.find("#wx-config-handShakeToken");

            this.editBtn = this.element.find("#wx-config-edit");
            this.saveBtn = this.element.find("#wx-config-save");
            this.cancelBtn = this.element.find("#wx-config-cancel");

            this._editable(false);

            this._bindBtnEvents();

            this._setTextarea();

            this._getData();
            locale.render();
        },

        _getData:function(){
            var self = this;
//            cloud.util.mask(this.element);
            this.service.getWxConfig(function(data){
                self.config = data.result;
                self._setConfig(self.config);
                cloud.util.unmask(self.element);
            });
        },
        _setTextarea:function(){
            var self = this;
            var scheight = this.handShakeUrl[0].scrollHeight;
            this.handShakeUrl.height(scheight);

            this.handShakeUrl.bind("keypress",function(){
                self.handShakeUrl.height(self.handShakeUrl[0].scrollHeight-10);
            })
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
                    self.service.createWxConfig(config,function(data){
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
                self.handShakeUrl.height(self.handShakeUrl[0].scrollHeight-10);
            });

            this.handShakeUrl.bind("blur",function(){
                self._validateUrl();
            });
        },

        _editable:function(flag){
            if(!flag){
                this.devUserName.attr("disabled","disabled");
                this.appId.attr("disabled","disabled");
                this.appSecret.attr("disabled","disabled");
                this.handShakeUrl.attr("disabled","disabled");
                this.handShakeToken.attr("disabled","disabled");

                this.element.find(".save-btn").hide();
                this.element.find(".edit-btn").show();
            }else{
                this.devUserName.removeAttr("disabled");
                this.appId.removeAttr("disabled");
                this.appSecret.removeAttr("disabled");
                this.handShakeUrl.removeAttr("disabled");
                this.handShakeToken.removeAttr("disabled");

                this.element.find(".edit-btn").hide();
                this.element.find(".save-btn").show();
            }
        },

        _getConfig:function(){
            var devUserName = this.devUserName.val();
            var appId = this.appId.val();
            var appSecret = this.appSecret.val();
            var handShakeUrl = this.handShakeUrl.val();
            var handShakeToken = this.handShakeToken.val();
            var config = {
                devUserName:devUserName,
                appId:appId,
                appSecret:appSecret,
                handShakeUrl:handShakeUrl,
                handShakeToken:handShakeToken
            };
            return config;
        },
        _setConfig:function(cfg){
            if(cfg){
                this.devUserName.val(cfg.devUserName);
                this.appId.val(cfg.appId);
                this.appSecret.val(cfg.appSecret);
                this.handShakeUrl.val(cfg.handShakeUrl);
                this.handShakeToken.val(cfg.handShakeToken);
            }
        },
        _validateUrl:function(){
            var regex=/^((https|http|ftp|rtsp|mss):\/\/){1,1}/;
            if(regex.test(this.handShakeUrl.val())){
                $("#error-tip").hide();
                $("#error-tip").text("");
                return true;
            }else{
                $("#error-tip").text(locale.get("website_invalid"));
                $("#error-tip").show();
                return false;
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
    return WxConfig;
});