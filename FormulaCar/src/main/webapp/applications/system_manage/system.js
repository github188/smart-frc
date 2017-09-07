/*
 *交易管理 
 */
define(function(require) {
	require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    var systemHtml = require("text!./system.html");
    var Service = require("./service");
    var systemMenu = require("./systemMenu");
    
	var system = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
	        this.element.html(systemHtml);
			this.elements = {
					content_el:"content-system"
			};
			this.render();
		},
		render:function(){
			this.renderLeftSystem();
		},
		renderLeftSystem:function(){
			this.systemContent = new systemMenu({
				selector:"#content-system",
				service:Service
			});
		},
		destroy:function(){
				
			if(this.systemContent){
				this.systemContent.destroy();
				this.systemContent = null;
			}	
		}
	});
	return system;
});