define(function(require){
	var cloud = require("cloud/base/cloud");
    var Button = require("cloud/components/button");
	var validator = require("cloud/components/validator");
	var statusMg = require("./template/menu");
	//var tradePage = require("./siteDetail/trade/trade");
	var tradePage = require("./siteDetail/statistics/statistics");
	var alarmPage = require("./siteDetail/alarm/alarm");
	var replenishPage = require("./siteDetail/replenish/replenish");
	var Service = require("./siteDetail/service");
	require("cloud/components/chart");
	var InfoModel = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.siteId = $("#siteId").val();
			this.tag = $("#tag").val();
			this.online = $("#online").val();
			if(this.online == 0){
				$("#online").addClass("cloud-table-online");
			}else if(this.online == 1){
				$("#online").addClass("cloud-table-offline");
			}
			//console.log(this.siteId);
			this._render();
		},
		_render:function(){
			this.getSiteData();
			this.getDeviceData();
			this.getTab();
		},
		getSiteData:function(){
			
			Service.getSiteInfo(this.siteId,function(data){
				//console.log(data);
				if(data.result){
					
					$("#siteName").text(data.result.name);
				}
			});
		},
		getDeviceData:function(){
			Service.getDeviceInfo(this.siteId,function(data){
				//console.log(data);
				$("#deviceName").text(data.name);
				$("#deviceNumber").text(data.assetId);
			});
		},
		getTab:function(){
			var self=this;
			if(this.statusMg){
				this.statusMg.destroy();
			}
			var array=["trade","event"];
			//var array=["trade","event","replenishments"];
			this.statusMg=new statusMg({
                "container":"#col_slide_main",
                "lis":array,
                "events": {
					 click: function(id){
						    $(".main_bd").empty();
						    if(id == "trade"){//交易
							   if(this.tradePage){
          					      this.tradePage.destroy();
          			           }
							   this.tradePage = new tradePage({
								  "container":".main_bd",
								  "siteId":self.siteId
							   });
						    }else if(id == "event"){//事件
						    	if(this.alarmPage){
	          					    this.alarmPage.destroy();
	          			        }
								this.alarmPage = new alarmPage({
								   "container":".main_bd",
								   "siteId":self.siteId
								});
						    }else if(id == "replenishments"){//补货
						    	if(this.replenishmentPage){
	          					    this.replenishmentPage.destroy();
	          			        }
								this.replenishmentPage = new replenishPage({
								   "container":".main_bd",
								   "siteId":self.siteId
								});
						    }
						   
					 }
                 }
           });
			if(self.tag == 1){
				$("#trade").click();
			}else if(self.tag == 2){
				$("#event").click();
			}
		   
		}
		
		
	});	
	return InfoModel;
    
});