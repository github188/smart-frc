define(function(require){
	var cloud = require("cloud/base/cloud");
    var Button = require("cloud/components/button");
	var validator = require("cloud/components/validator");
	var html = require("text!./statistics.html");
	var tradeChartMsg = require("./chart");
	require("./css/default.css");
	var trade = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.elements = {
					head : {
						id : "tradeHead",
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
		},
		bindEvents:function(){
			$("#aRecent7Days").bind("click",function(){
				$("#aRecent7Days").css("color","#459ae9");
				$("#aRecent30Days").css("color","#222");
				$("#aRecent1Years").css("color","#222");
				if(this.tradeChart){
					this.tradeChart.destroy();
			    }
				this.tradeChart=new tradeChartMsg({
	                "container":"#tradeFooter",
	                "style":1
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
	                "container":"#tradeFooter",
	                "style":2
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
	                "container":"#tradeFooter",
	                "style":3
				});
			});
		}
		
	});	
	return trade;
    
});