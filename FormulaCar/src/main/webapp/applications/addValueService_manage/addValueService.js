
define(function(require) {
	require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    var operationHtml = require("text!./addValueService.html");
    var operationMenu = require("./addValueServiceMenu");
    
	var operation = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
	        this.element.html(operationHtml);
			this.elements = {
					content_el:"content-operation"
					
			};
			this.render();
		},
		render:function(){
			this.renderContent();
		},
		
		renderContent:function(){
			this.operationContent = new operationMenu({
				selector:"#content-operation"
			});
		},
		destroy:function(){
			if(this.operationContent){
				this.operationContent.destroy();
				this.operationContent = null;
			}	
		}
	});
	return operation;
});
