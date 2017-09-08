define(function(require) {
    var cloud = require("cloud/base/cloud");
    var Common = require("../../../../common/js/common");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./updateModel.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../../service");
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
                title: locale.get({lang: "model_list"}),
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
            $("#saveBase").val(locale.get({lang: "save"}));
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
        	var language = locale._getStorageLang();
        	Service.getModelById(eurl,self.id, function(data) {
        		console.log(data.result);
       		    $("#moduleNum").val(data.result.moduleNum==null?"":data.result.moduleNum);
       		    $("#vender option[value='"+data.result.vender+"']").attr("selected","selected");
       		    $("#deviceType option[value='"+data.result.deviceType+"']").attr("selected","selected");
       		    $("#runwayStartNum").val(data.result.runwayStartNum==null?"":data.result.runwayStartNum);
       		    $("#runwayCount").val(data.result.runwayCount==null?"":data.result.runwayCount);
        	});
        },
        bindEvent:function(){
        	 var self =this;
        	 $("#saveBase").unbind("click");
        	 $("#saveBase").bind("click", function() {
        		 var vender = $("#vender").find("option:selected").text();//厂家
        		 var vender_val = $("#vender").find("option:selected").val();
        		 
         		 var deviceType = $("#deviceType").find("option:selected").val();
                 var deviceTypeText=$("#deviceType").find("option:selected").text();
                 
         		 var moduleNum = $("#moduleNum").val();//型号
         		 
         		 var runwayStartNum = $("#runwayStartNum").val();//货道起始 编号
         		 
         		 var runwayCount = $("#runwayCount").val();//货道总数
         		 
         		 if(vender_val == null || vender_val == 0){
         			 dialog.render({lang: "please_select_vender"});
                     return;
         		 }
         		 if(machineType == null || machineType == 0){
        			 dialog.render({lang: "please_select_machineType"});
                     return;
        		 }
         		 if(moduleNum == null  || moduleNum.replace(/(^\s*)|(\s*$)/g,"")==""){
        			 dialog.render({lang: "please_enter_modelName"});
                     return;
        		 }
         		 if(runwayStartNum == null  || runwayStartNum.replace(/(^\s*)|(\s*$)/g,"")==""){
       			     dialog.render({text: "请输入赛道起始编号"});
                     return;
       		     }
         		 if(runwayCount == null  || runwayCount.replace(/(^\s*)|(\s*$)/g,"")==""){
      			     dialog.render({text: "请输入赛道个数"});
                     return;
      		     }
         		 var finalData={
         				vender:vender,
         				moduleNum:moduleNum,
         				deviceType:deviceType,
         				runwayStartNum:runwayStartNum,
         				runwayCount:runwayCount
         		 };
         		 if(self.id){
         			Service.updateModel(self.id,finalData,function(data) {
                		console.log(data);
                		self.automatWindow.destroy();
                		self.fire("getModelList");
                	});
         		 }else{
         			Service.addModel(finalData,function(data) {
                		console.log(data);
                		self.automatWindow.destroy();
                		self.fire("getModelList");
                		});
            		}
         		 }
         		
        	 });
        },
        _renderGetVender:function(){
        	var self = this;
        	$("#vender").html("");
			$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
			Service.getVenderList(eurl,0,0,'',function(data) {
				if(data.result){
					for(var i=0;i<data.result.length;i++){
						$("#vender").append("<option value='" +data.result[i].number + "'>" +data.result[i].name+"</option>");
					}
				}
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
