define(function(require) {
    var cloud = require("cloud/base/cloud");
    var Common = require("../../../../../common/js/common");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./BillDetail.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../service");
    var DeviceList = require("./deviceList");
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.id = options.id;
            this.number = options.number;
            this.data = options.data;
            this._renderWindow();
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.automatWindow = new _Window({
                container: "body",
                title:this.number,
                top: "center",
                left: "center",
                height: 620,
                width: 1000,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                    "onClose": function() {
                        this.automatWindow.destroy();
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
            this.automatWindow.show();
            this.getBillDetail();
            this.renderBtn();
        },
        getBillDetail:function(){
        	var self = this;
        	
        	var date  = cloud.util.dateFormat(new Date(this.data.createTime), "MM");
        	date = date -1;
        	$("#name").text(this.data.name);
        	$("#month").text(date);
        	if(this.data.status == 0){
        		$("#states").text(locale.get({lang: "bill_not_paying"}));
        	}else if(this.data.status == 1){
        		$("#states").text(locale.get({lang: "bill_paying"}));
        	}
        	if(this.data.fullName){
        		$("#fullName").text(this.data.fullName);
        	}else{
        		$("#fullName").text(locale.get({lang: "automat_unknown"}));
        	}
        	
        	$("#payAmount").text(this.data.payAmount+"元");
        	if(this.data.money>0 && (this.data.payAmount!=this.data.money)){
        		$("#money").text(this.data.money+"元");
        	}
        	
        	
        	if(this.data.deadline){
        		$("#deadline").text(cloud.util.dateFormat(new Date(this.data.deadline), "yyyy-MM-dd hh:mm:ss"));
        	}else{
        		$("#deadline").text(locale.get({lang: "automat_unknown"}));
        	}
        	if(this.data.payTime){
        		$("#payTime").text(cloud.util.dateFormat(new Date(this.data.payTime), "yyyy-MM-dd hh:mm:ss"));
        	}else{
        		$("#payTime").text(locale.get({lang: "automat_unknown"}));
        	}
        	if(this.data.saler){
        		$("#saler").text(this.data.saler.split("***")[1]);
        	}else{
        		$("#saler").text(locale.get({lang: "automat_unknown"}));
        	}
        	if(this.data.contact){
        		$("#contact").text(this.data.contact);
        	}else{
        		$("#contact").text(locale.get({lang: "automat_unknown"}));
        	}
        	$("#nums").text(this.data.nums);
        	if(this.data.phone){
        		$("#phone").text(this.data.phone.split("***")[0]);
        	}else{
        		$("#phone").text(locale.get({lang: "automat_unknown"}));
        	}
        	
        	this.deviceList = new DeviceList({
                selector: "#billDetail",
                automatWindow: self.automatWindow,
                id:self.id
            });
        },
        renderBtn:function(){
        	var self = this;
        	$("#closeBase").click(function(){
        		self.automatWindow.destroy();
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