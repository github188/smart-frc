define(function(require) {
	var cloud = require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
    var Common = require("../../../common/js/common");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./emailMain.html");
    var Button = require("cloud/components/button");
    var oidTable =  require("./leftTable/list");
    var Service = require("./service.js");
    
    
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(html);
            this.elements = {
                left: {
                    id: "email_left",
                    "class": null
                },
                right: {
                    id: "email_right",
                    "class": null
                }
            };
            this._render();
        },
        _render: function() {
        	$("#emailMain").css("width",$(".wrap").width());
			$("#emailMain").css("height",$("#content-operation-menu").height() - $(".container-hd").height());
			$("#emailContent").css("width",$("#email_right").width());
			
			this.renderVendingTable();
			this.renderBtn();
        },
        renderBtn:function(){
        	var self = this;
        	$("#send-submit").click(function(){
        		var emails = $("#toemail").val();
        		var title = $("#titleemail").val();
        		var content =  $("#content").val();
        		var finalData={
        				email:emails,
        				title:title,
        				content:content
        		};
        		Service.getMoreEmail(finalData,function(data){
        			console.log(data);
        		});
        		
        	});
        },
        renderVendingTable:function(){
        	 this.organizatoinTable = new oidTable({
                 selector: "#email_left"
             });
        }
    	
    });
    return list;
});