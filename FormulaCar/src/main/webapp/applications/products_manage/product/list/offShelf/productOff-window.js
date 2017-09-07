define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./productOff.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	var productType = require("../../../product_type/list/list");
	require("cloud/lib/plugin/jquery.uploadify");
	var Service = require("../../../service");
	var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
	var deviceInfoMan = require("./list");
    var eurl;
    if(oid == '0000000000000000000abcde'){
    	eurl = "gapi";
    }else{
    	eurl = "api";
    }
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.goodId = options.goodId;
			this.name = options.name;
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			var html_=winHtml;
			this.window = new _Window({
				container: "body",
				title: locale.get({lang:"off_the_shelf"}),
				top: "center",
				left: "center",
				height:600,
				width: 900,
				mask: true,
				drag:true,
				content: html_,
				events: {
					"onClose": function() {
							this.window.destroy();
							cloud.util.unmask();
					},
					scope: this
				}
			});
			
			$("#cancel").val(locale.get({lang: "cancel"}));
			$("#save").val(locale.get({lang: "off_the_shelf_goods"}));
			
			this.window.show();	
			$("#goodsName").text(this.name);
			this.renderDeviceInfo();
			
		},
		renderDeviceInfo:function(){
			 if (this.deviceInfo) {
                 this.deviceInfo.destroy();
             }
             this.deviceInfo = new deviceInfoMan({
                 selector: "#deviceInfo",
                 goodId: this.goodId,
                 gwindow:this.window,
                 events: {
                     "getAll": function() {
                    	 self.fire("getGoodsList");
                     }
                 }
             });
		},
		getAutoListByGoodsId:function(){
			Service.getAutoByGoodsId(this.goodId,function(data){
				console.log(data);
			});
		},
		destroy:function(){
			if(this.window){
				this.window.destroy();
			}else{
				this.window = null;
			}
		}
	});
	return Window;
});