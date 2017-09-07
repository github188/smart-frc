define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./contract_view_window.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/lib/plugin/jquery.form");
    var Service=require("../service");
    
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.id = options.id;
            this._renderWindow();
            this.basedata = {};
            this.deviceInfo=[];
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: locale.get({lang: "contract_info"}),
                top: "center",
                left: "center",
                height: 650,
                width: 1000,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                    "onClose": function() {
                        this.adWindow.destroy();
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
            this.adWindow.show();
            $("#nextBase").val(locale.get({lang: "close"}));
            this.render();
    		if(this.id){
    			this.getData();
    		}
    		
        },
        render:function(){
        	this.bindEvent();
        },
        getData:function(){
        	Service.getContractById(this.id,function(data){
        		console.log(data);
        		$("#numbers").val(data.result.number==null?"":data.result.number);
        		if(data.result.style == 1){
        			$("#cooperation_mode").val(locale.get({lang:"contract_lease"}));
        		}else{
        			$("#cooperation_mode").val(locale.get({lang:"contract_buy"}));
        		}
        		if(data.result.cycle){
        			$("#payment_cycle").val(data.result.cycle);
        			$("#payment_cycle").css("color","black");
        		}else{
        			$("#payment_cycle").val("忽略此信息");
        			$("#payment_cycle").css("color","#BDB7B7");
        		}
        		if(data.result.email){
        			$("#emails").val(data.result.email);
        			$("#emails").css("color","black");
        		}else{
        			$("#emails").val("忽略此信息");
        			$("#emails").css("color","#BDB7B7");
        		}
        		if(data.result.startTime){
        			$("#startTime").val(cloud.util.dateFormat(new Date(data.result.startTime),"yyyy-MM-dd"));
        			$("#startTime").css("color","black");
        		}else{
        			$("#startTime").val("忽略此信息");
        			$("#startTime").css("color","#BDB7B7");
        		}
        		if(data.result.endTime){
        			$("#endTime").val(cloud.util.dateFormat(new Date(data.result.endTime),"yyyy-MM-dd"));
        			$("#endTime").css("color","black");
        		}else{
        			$("#endTime").val("忽略此信息");
        			$("#endTime").css("color","#BDB7B7");
        		}
        		if(data.result.deliveryDate){
        			$("#deliveryDate").val(cloud.util.dateFormat(new Date(data.result.deliveryDate),"yyyy-MM-dd"));
        			$("#deliveryDate").css("color","black");
        		}else{
        			$("#deliveryDate").val("忽略此信息");
        			$("#deliveryDate").css("color","#BDB7B7");
        		}
        		if(data.result.collectionDay){
        			$("#collectionDay").val(cloud.util.dateFormat(new Date(data.result.collectionDay),"yyyy-MM-dd"));
        			$("#collectionDay").css("color","black");
        		}else{
        			$("#collectionDay").val("忽略此信息");
        			$("#collectionDay").css("color","#BDB7B7");
        		}
        		
        		if(data.result.historyInfo){
        		   $("#deliveryHistory").css("display","block");
        		 
        	       if(data.result.historyInfo && data.result.historyInfo.length>0){
	    			   for(var i=0;i<data.result.historyInfo.length;i++){
	    				   var deliveryTime = cloud.util.dateFormat(new Date(data.result.historyInfo[i].deliveryTime),"yyyy-MM-dd");
	            	       var createTime  = cloud.util.dateFormat(new Date(data.result.historyInfo[i].createTime),"yyyy-MM-dd");
	    				    $("#deliveryConfig").append("<tr>"
	    						+"<td class='channelTable'>"
	    						+  "<label>"+deliveryTime+"</label>"
	    						+"</td>"
	    						+"<td class='channelTable'>"
	    						+  "<label>"+createTime+"</label>"
	    						+"</td>"
	    						+"</tr>");
	    			   }
    		        }
        		}
        		
        		
        		self.deviceInfo = data.result.deviceInfo;
				if(self.deviceInfo && self.deviceInfo.length>0){
					for(var i=0;i<self.deviceInfo.length;i++){
						if(self.deviceInfo[i].rentAmount){
						}else{
							self.deviceInfo[i].rentAmount='-';
						}
						if(self.deviceInfo[i].serviceCharge){
						}else{
							self.deviceInfo[i].serviceCharge='-';
						}
						 $("#editConfig").append("<tr id='"+self.deviceInfo[i].assetId+"'>"
	        						+"<td class='channelTable'>"
	        						+  "<label id='"+self.deviceInfo[i].assetId+":"+self.deviceInfo[i].assetId+"' >"+self.deviceInfo[i].assetId+"</label>"
	        						+"</td>"
	        						+"<td class='channelTable'>"
	        						+  "<label id='"+self.deviceInfo[i].assetId+":"+self.deviceInfo[i].rentAmount+"'>"+self.deviceInfo[i].rentAmount+"</label>"
	        						+"</td>"
	        						+"<td class='channelTable'>"
	        						+  "<label id='"+self.deviceInfo[i].assetId+":"+self.deviceInfo[i].serviceCharge+"'>"+self.deviceInfo[i].serviceCharge+"</label>"
	        						+"</td>"
	        						+"</tr>");
					}
				}
        	});
        },
        bindEvent:function(){
        	var self = this;
            $("#nextBase").bind("click", function() {
            	 self.adWindow.destroy();
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