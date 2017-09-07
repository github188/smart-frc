define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.multiselect");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery.multiselect.css");
    var Button = require("cloud/components/button");
    var configHtml = require("text!./config.html");
   
    var Profil = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.render();
        },
        render: function() {
            var self = this;
            this.renderHtml();
        },
        renderHtml: function() {
            var self = this;
            self.element.html(configHtml);
            
            $("#updateDesc").css("width",$(".container-bd").width());
            $("#updateDesc").css("height",$(".container-bd").height()-80);
            $(".account_setting_area").css("width",$(".container-bd").width()*0.98);
        },
        
    });
    return Profil;
});