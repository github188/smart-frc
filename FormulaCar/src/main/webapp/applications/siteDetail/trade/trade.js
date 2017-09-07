define(function(require){
	var cloud = require("cloud/base/cloud");
    var Button = require("cloud/components/button");
	var validator = require("cloud/components/validator");
	var html = require("text!./trade.html");
	var tradeMsg = require("./list/list");
	var tradeChartMsg = require("./chart/chart");
	require("../css/default.css");
	var trade = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.siteId = options.siteId;
			this.elements = {
					head : {
						id : "tradeHead",
						"class" : null
					},
					content : {
						id : "tradeMiddle",
						"class" : null
					},
					footer : {
						id : "tradeFooter",
						"class" : null
					}
				};
			this.element.html(html);
			locale.render({element:this.element});
			this._render();
		},
		_render:function(){
			this.bindEvents();
			$("#aRecent7Days").click();
			this.renderTradeRecord();
		},
		renderTradeRecord:function(){
			this.tradeList=new tradeMsg({
                "container":"#tradeFooter",
                "siteId":this.siteId
			});
		},
		bindEvents:function(){
			var self =this;
			$("#aRecent7Days").bind("click",function(){
				$("#aRecent7Days").css("color","#459ae9");
				$("#aRecent30Days").css("color","#222");
				$("#aRecent1Years").css("color","#222");
				if(this.tradeChart){
					this.tradeChart.destroy();
			    }
				this.tradeChart=new tradeChartMsg({
	                "container":"#tradeMiddle",
	                style:1,
	                siteId:self.siteId
				});
				
			});
			$("#aRecent30Days").bind("click",function(){
				$("#aRecent7Days").css("color","#222");
				$("#aRecent30Days").css("color","#459ae9");
				$("#aRecent1Years").css("color","#222");
				if(this.tradeChart){
					this.tradeChart.destroy();
			    }
				this.tradeChart=new tradeChartMsg({
	                "container":"#tradeMiddle",
	                style:2,
	                siteId:self.siteId
				});
			});
			$("#aRecent1Years").bind("click",function(){
				$("#aRecent7Days").css("color","#222");
				$("#aRecent30Days").css("color","#222");
			    $("#aRecent1Years").css("color","#459ae9");
			    if(this.tradeChart){
					this.tradeChart.destroy();
			    }
			    this.tradeChart=new tradeChartMsg({
	                "container":"#tradeMiddle",
	                style:3,
	                siteId:self.siteId
				});
			});
		}
		
	});	
	return trade;
    
});