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
        	this._renderSearchInput();
        	this._renderBtn();
        },
        _renderSearchInput:function(){
        	var html = "<input style='width:150px;padding-left:10px;' type='text'  id='' />";
        	html = html + "<span id='share-search-bar'></span>";
            this.element.append(html);
        },
		showAddView:function(){
			this.fire("click");
		},
		deleteAutomat:function(){
			this.fire("click","delete");
		},
        _renderBtn: function(){
            var self = this;
            if(this.queryBtn){
            	this.queryBtn.destroy();
            }
            this.queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#share-search-bar"),
                events: {
                    click: function(){
                        self.fire("query");
                    }
                }
            });
           
            $("#share-search-bar a").css({
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