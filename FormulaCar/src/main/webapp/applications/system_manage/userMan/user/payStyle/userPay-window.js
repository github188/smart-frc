define(function(require) {
    var cloud = require("cloud/base/cloud");
    var Common = require("../../../../../common/js/common");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./userPay.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/resources/css/jquery.multiselect.css");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../../../service");
    var payStyleTable = require("./leftTable/list");
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.userId = options.userId;
            this._renderWindow();
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.automatWindow = new _Window({
                container: "body",
                title: "子账户支付方式配置",
                top: "center",
                left: "center",
                height: 650,
                width: 1100,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                    "onClose": function() {
                        this.automatWindow.destroy();
                        cloud.util.unmask();
                        $("tr").css("border-bottom","0px");
                    },
                    scope: this
                }
            });
            this.automatWindow.show();
            $("#sms-config-save").val("保存");
            
            this.renderPayStyle();
        },
        renderPayStyle:function(){
        	var self = this;
        	this.payTable = new payStyleTable({
                  selector: "#shelf_left",
                  userId:self.userId,
                  automatWindow:self.automatWindow
            });
        },

        destroy: function() {
            if (this.automatWindow) {
                this.automatWindow.destroy();
            } else {
                this.automatWindow = null;
            }
        }
    });
    return updateWindow;
});
