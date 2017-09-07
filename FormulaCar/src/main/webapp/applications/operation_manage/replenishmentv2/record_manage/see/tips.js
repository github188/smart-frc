/**
 * @author PANJC
 *
 */
define(function(require){
    var cloud = require("cloud/base/cloud");
    var page = require("text!./tips.html");

    var Tips = Class.create(cloud.Component, {
        initialize: function($super, options){
            $super(options);
            this._renderHtml();
            $('body').bind("click",function(){
        	   
        	   if($("#tips-panel")){
        		   $("#tips-panel").parent().remove();
        	   }
           });
            locale.render({element:this.element});
        },

        _renderHtml: function(){
            this.element.html(page);
            
        },
		destroy : function($super) {
			$("#tips-panel").parent().remove();
		}

    });

    return Tips;

});
