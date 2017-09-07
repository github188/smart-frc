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
        	var html = "&nbsp;&nbsp;<select style='width:140px;height: 28px;' id='automat_model_search_options'>"+
              "<option value='0'>"+locale.get({lang:"automat_model_search_by_name"})+"</option>"+
              "<option value='1'>"+locale.get({lang:"automat_model_search_by_number"})+"</option>"+
              "<option value='2'>"+locale.get({lang:"automat_model_search_by_manufacturer"})+"</option>"+
              "</select>&nbsp;&nbsp;";
        	html = html + "<input style='width:150px' type='text'  id='search-input' />";
        	html = html + "<span id='model-search-bar'></span>";
        	html = html + "<span id='model-add-bar'></span>";
        	html = html + "<span id='model-modify-bar'></span>";
        	html = html + "<span id='model-delete-bar'></span>";
            this.element.append(html);
        },
		showAddView:function(){
			this.fire("click");
		},
        _renderBtn: function(){
            var self = this;
            if(this.queryBtn){
            	this.queryBtn.destroy();
            }
            this.queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#model-search-bar"),
                events: {
                    click: function(){
                        self.fire("query");
                    }
                }
            });
            this.addBtn = new Button({
                text: locale.get({lang:"add"}),
                container: $("#model-add-bar"),
                events: {
                    click: function(){
                    	self.fire("add");
                    }
                }
            });
            this.editBtn = new Button({
                text: locale.get({lang:"modify"}),
                container: $("#model-modify-bar"),
                events: {
                    click: function(){
                    	self.fire("modify");
                    }
                }
            });
            this.deleteBtn = new Button({
                text: locale.get({lang:"delete"}),
                container: $("#model-delete-bar"),
                events: {
                    click: function(){
                    	self.fire("drop");
                    }
                }
            });
            
           
            $("#model-search-bar a").css({
                "margin": "auto 10px auto 10px",
                "line-height":"25px"
            });
            $("#model-add-bar a").css({
            	"margin": "auto 10px auto 10px",
            	"line-height":"25px"
            });
            $("#model-modify-bar a").css({
            	"margin": "auto 10px auto 10px",
            	"line-height":"25px"
            });
            $("#model-delete-bar a").css({
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