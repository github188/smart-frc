define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
	var Button = require("cloud/components/button");
    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options){
            $super(options);
			this._render();
        },
        _render: function(){
        	this.draw();
        	this._renderBtn();
        },
    	draw:function(){
    		  var self = this;
              var $htmls = $(+"<div></div>" +
              "<div id='search-bars' style='width:auto;margin-top:5px;margin-left:5px;text-align: right;'>" +
              "</div>");
              this.element.append($htmls);
		},
        _renderBtn: function(){
            var self = this;
            this.addBtn = new Button({
                text: locale.get({lang:"add"}),
                container: $("#search-bars"),
                events: {
                    click: function(){
                    	self.fire("add");
                    }
                }
            });
            this.editBtn = new Button({
                text: locale.get({lang:"modify"}),
                container: $("#search-bars"),
                events: {
                    click: function(){
                    	self.fire("modify");
                    }
                }
            });
            this.deleteBtn = new Button({
                text: locale.get({lang:"delete"}),
                container: $("#search-bars"),
                events: {
                    click: function(){
                    	self.fire("drop");
                    }
                }
            });
            $("#search-bars a").css({
                margin: "auto 10px auto 10px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
