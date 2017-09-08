define(function(require) {
    var cloud = require("cloud/base/cloud");
    var Common = require("../../../../common/js/common");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./seeModel.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../service");
    var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
	var eurl;
	if(oid == '0000000000000000000abcde'){
	     eurl = "mapi";
	}else{
	     eurl = "api";
	}
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.id = options.id;
            this.name = options.name;
            this._renderWindow();
            this.shelves = null;
            this.keyConfig = null;
            this.existstag = false;
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.automatWindow = new _Window({
                container: "body",
                title: this.name,
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
            $("#nextBase").val(locale.get({lang: "next_step"}));
            this.render();
        },
        render:function(){
        	var self = this;
        	this.renderMachineType();//获取货柜类型
            this.init();

            this.bindEvent();
	        if(this.id){
	           this.getData();
	        }      
        },
        init:function(){
        	$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        	$("#vender").append("<option value='vender1'>厂家1</option>");
        	$("#vender").append("<option value='vender2'>厂家2</option>");
        	$("#vender").append("<option value='vender3'>厂家3</option>");
        },
        renderMachineType:function(){
        	$("#deviceType").html("");
        	$("#deviceType").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
            $("#deviceType").append("<option value='1'>2赛道</option>");
            $("#deviceType").append("<option value='2'>3赛道</option>");
        },
        getData:function(){
        	var self = this;
        	Service.getModelById(self.id, function(data) {
        		console.log(data.result);
       		    $("#moduleNums").val(data.result.moduleNum==null?"":data.result.moduleNum);
       		    $("#vender option[value='"+data.result.vender+"']").attr("selected","selected");
       		    $("#deviceType option[value='"+data.result.deviceType+"']").attr("selected","selected");
       		    $("#runwayStartNum").val(data.result.runwayStartNum==null?"":data.result.runwayStartNum);
       		    $("#runwayCount").val(data.result.runwayCount==null?"":data.result.runwayCount);
        	});
        },
        bindEvent:function(){
        	var self = this;
        	$("#closeBase").bind("click", function() {
        		self.automatWindow.destroy();
        	});
        },
        destroy: function() {
            if (this.window) {
                this.window.destroy();
            } else {
                this.window = null;
            }
        }
    });
    return updateWindow;
});
