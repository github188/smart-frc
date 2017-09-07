/*
 * 商品管理
 */
define(function(require) {
	require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    var productsHtml = require("text!./products.html");
    var productMenu = require("./productMenu");
    var Service = require("./service");
	var product = Class.create(cloud.Component, {
		
		initialize: function($super, options) {
			$super(options);
	        this.element.html(productsHtml);
			this.elements = {
					content_el:"content-products"
			};
			this.render();
		},
	    render:function(){
			this.renderLeftProducts();
		},
		renderLeftProducts:function(){
			this.productContent= new productMenu({
				selector:"#content-products",
				service:Service
			});
		},
		destroy:function(){
			if (this.layout && (!this.layout.destroyed)) {
            	this.layout.destroy();
            }
			
			if(this.productContent){
				this.productContent.destroy();
				this.productContent = null;
			}
			
		}
			
    }); 
	return product;
});
