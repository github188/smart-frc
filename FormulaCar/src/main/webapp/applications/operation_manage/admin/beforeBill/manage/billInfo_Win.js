define(function(require) {
    var cloud = require("cloud/base/cloud");
    var Common = require("../../../../../common/js/common");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./billInfo.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../service");
    var OidMan = require("./oidList");
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.id = options.id;
            this._renderWindow();
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.automatWindow = new _Window({
                container: "body",
                title:"预付费账单信息管理",
                top: "center",
                left: "center",
                height: 400,
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
            this.renderBtn();
            if(this.id){
            	this.getData();
            }
            $("#saveBase").val(locale.get({lang: "save"}));
        },
        getData:function(){
        	var self = this;
        	Service.getBeforeBillInfoById(self.id,function(data){
        		if(data.result){
        			$("#orageName").val(data.result.name);
        			$("#siteSum").val(data.result.nums);
        			$("#bill_type option[value='"+data.result.type+"']").attr("selected","selected");
        			
        			$("#money").val(data.result.payAmount);
        			var display= cloud.util.dateFormat(new Date(data.result.startTime), "yyyy-MM-dd") +" 至 " +cloud.util.dateFormat(new Date(data.result.endTime), "yyyy-MM-dd")
            		$("#useTime").val(display);
        		}
        		
        	});
        },
        renderBtn:function(){
        	var self = this;
        	
        	$("#siteSum").blur(function(){
        		var name = $("#orageName").val();
        		var type =$("#bill_type").find("option:selected").val();
        		var nums = $("#siteSum").val();
        		if(name == null || name ==""){
       			   dialog.render({text: "公司简称不能为空"});
       		    }
       		    if(nums == null || nums ==""){
      			    dialog.render({text: "点数不能为空"});
      		    }
            	Service.getBeforeBill(name,nums,type,function(data){
            		console.log(data);
            		$("#money").val(data.result.payAmouts);
            		var display= cloud.util.dateFormat(new Date(data.result.startTime), "yyyy-MM-dd") +" 至 " +cloud.util.dateFormat(new Date(data.result.endTime), "yyyy-MM-dd")
            		$("#useTime").val(display);
            	});
        	});
        	
        	if(self.orangeBtn){
        	}else{
        		self.orangeBtn = new Button({
                    text: "选择机构",
                    container: $("#orange_select_button"),
                    events: {
                        click: function() {                    
                       	 if (self.oid_listPage) {
                            self.oid_listPage.destroy();
                         }
                         this.oid_listPage = new OidMan({
                            selector: "body",
                            events: {
                                    "getone": function(name,fullName) { 
                                    	$("#orageName").val(name);
                                    }
                            }
                          });     
                       }
                    }
                }); 
        	}
        	if(self.getBtn){
        	}else{
        		self.getBtn = new Button({
                    text: "计算金额",
                    container: $("#getPrice_button"),
                    events: {
                        click: function() {  
                        	var name = $("#orageName").val();
                    		var type =$("#bill_type").find("option:selected").val();
                    		var nums = $("#siteSum").val();
                    		if(name == null || name ==""){
                   			   dialog.render({text: "公司简称不能为空"});
                   		    }
                   		    if(nums == null || nums ==""){
                  			    dialog.render({text: "点数不能为空"});
                  		    }
                        	Service.getBeforeBill(name,nums,type,function(data){
                        		console.log(data);
                        		$("#money").val(data.result.payAmouts);
                        		var display= cloud.util.dateFormat(new Date(data.result.startTime), "yyyy-MM-dd") +" 至 " +cloud.util.dateFormat(new Date(data.result.endTime), "yyyy-MM-dd")
                        		$("#useTime").val(display);
                        	});
                        }
                    }
                }); 
        	}
        	
        	//保存并邮件通知客户
        	$("#submitBase").click(function(){
        		var orageName = $("#orageName").val();
        		var type =$("#bill_type").find("option:selected").val();
        		var siteSum = $("#siteSum").val();
        		
        		if(orageName == null || orageName ==""){
        			 dialog.render({text: "公司简称不能为空"});
        		}
        		if(siteSum == null || siteSum ==""){
       			    dialog.render({text: "点数不能为空"});
       		    }
        		
        		var finalData={
        			org:orageName,
        			nums:siteSum,
        			type:type,
        			status:0
        		};
        		dialog.render({
                     text: "确认保存",
                     buttons: [{
                             lang: "affirm",
                             click: function() {
                            	 if(self.id){
                         			Service.updateBeforeBillById(self.id,finalData,function(data){
                         				console.log(data);
                         				self.fire("getBillList");
                         				self.automatWindow.destroy();
                         			});
                         		 }else{
                         			Service.addBeforeBillById(finalData,function(data){
                         				console.log(data);
                         				self.fire("getBillList");
                         				self.automatWindow.destroy();
                         			});
                         		 }
                                 dialog.close();
                             }
                         },
                         {
                             lang: "cancel",
                             click: function() {
                                 dialog.close();
                             }
                         }]
                 });
        	});
        	//保存
        	$("#saveBase").click(function(){
        		var orageName = $("#orageName").val();
        		var type =$("#bill_type").find("option:selected").val();
        		var siteSum = $("#siteSum").val();
        		
        		if(orageName == null || orageName ==""){
        			 dialog.render({text: "公司简称不能为空"});
        		}
        		if(siteSum == null || siteSum ==""){
       			    dialog.render({text: "点数不能为空"});
       		    }
        		
        		var finalData={
        			org:orageName,
        			nums:siteSum,
        			type:type,
        			status:2
        		};
        		if(self.id){
        			Service.updateBeforeBillById(self.id,finalData,function(data){
        				console.log(data);
        				self.fire("getBillList");
        				self.automatWindow.destroy();
        			});
        		}else{
        			Service.addBeforeBillById(finalData,function(data){
        				console.log(data);
        				self.fire("getBillList");
        				self.automatWindow.destroy();
        			});
        		}
        		
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