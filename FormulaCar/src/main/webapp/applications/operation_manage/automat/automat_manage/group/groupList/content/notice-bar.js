define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	var Button = require("cloud/components/button");
    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options){
            $super(options);
			this._render();
        },
        _render: function(){
        	this._renderSearchInput();
        	this._renderBtn();
        },
        _renderSearchInput:function(){
        	var html = "<input style='width:100px;' type='text'  id='group_name_search' />";
        	html = html + "<span id='automat-group-search-bar'></span>";
            this.element.append(html);
        },
        _renderBtn: function(){
            var self = this;
            if(this.queryBtn){
            	this.queryBtn.destroy();
            }
            this.queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#automat-group-search-bar"),
                events: {
                    click: function(){
                        self.fire("query");
                    }
                }
            });
            $("#automat-group-search-bar a").css({
                "margin": "auto 10px auto 10px",
                "line-height":"25px"
            });
        },
        destroy:function(){
        	 if(this.queryBtn){
             	this.queryBtn.destroy();
             }
        }
        
    });
    
    return NoticeBar;
    
});