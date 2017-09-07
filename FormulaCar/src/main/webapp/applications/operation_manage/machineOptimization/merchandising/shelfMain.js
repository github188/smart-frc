define(function(require) {
	var cloud = require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./shelfMain.html");
    var Button = require("cloud/components/button");
    var automatTable =  require("./leftTable/list");
   
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(html);
            this.elements = {
                left: {
                    id: "shelf_left",
                    "class": null
                },
                right: {
                    id: "shelf_right",
                    "class": null
                }
            };
            this._render();
        },
        _render: function() {
        	$("#shelfMain").css("width",$(".wrap").width());
			$("#shelfMain").css("height",$("#content-operation-menu").height() - $(".container-hd").height());
			
			this.renderVendingTable();
			
        },
        renderVendingTable:function(){
        	 this.vendingTable = new automatTable({
                 selector: "#shelf_left"
             });
        }
    	
    });
    return list;
});