/*
 *交易管理 
 */
define(function(require) {
	require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    var tradeHtml = require("text!./trade.html");
    var Service = require("./service");
    var tradeMenu = require("./tradeMenu");
	var trade = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
	        this.element.html(tradeHtml);
			this.elements = {
					content_el:"content-trade"
			};
			this.render();
		},
		render:function(){
			this.renderContentTrade();
		},
		renderContentTrade:function(){
			this.tradeContent= new tradeMenu({
				selector:"#"+this.elements.content_el,
				service:Service
			});
		},
		destroy:function(){
			if(this.tradeContent){
				this.tradeContent.destroy();
				this.tradeContent = null;
			}	
		}
	});
	return trade;
});