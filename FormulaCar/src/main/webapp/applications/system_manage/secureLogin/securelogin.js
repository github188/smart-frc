define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.multiselect");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery.multiselect.css");
    var Button = require("cloud/components/button");
    var configHtml = require("text!./securelogin.html");
    var WechatList =  require("./wechatList");
   
    var Profil = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.render();
        },
        render: function() {
            var self = this;
            this.renderHtml();
            this.renderWechatList();
            this.renderGetWechatCode();
        },
        renderHtml: function() {
            var self = this;
            self.element.html(configHtml);
            $("#develpo").css("width",$(".container-bd").width());
        },
        renderGetWechatCode:function(){
        	  var currentHost=window.location.hostname;
              var pay_url = "http://"+currentHost+"/vapi/oper/bind?access_token=" + cloud.Ajax.getAccessToken();
              
              //获取二维码
              $.ajax({
                  url:"/api/encode?pay_url="+pay_url,
                  type: "GET",
                  dataType: "json",
                  success: function(data){
                      var src = data;
                      $("#wechatcode").attr("src",src);
                  }
              });
        },
        renderWechatList:function(){
       	 var self = this;
            this.wechatList = new WechatList({
                selector: "#wechat_list",
                events: {
                }
            });
       }
    });
    return Profil;
});