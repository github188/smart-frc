define(function(require){
	var cloud = require("cloud/base/cloud");
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
    		  var self = this;
              var $htmls = $(+"<div></div>"+
              "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
              "<select style='width:100px;height: 28px;' id='automat_staff_search_options'>"+
              "<option value='0'>"+locale.get({lang:"automat_staff_search_by_name"})+"</option>"+
              "<option value='1'>"+locale.get({lang:"automat_staff_search_by_phone"})+"</option>"+
              "<option value='2'>"+locale.get({lang:"automat_staff_search_by_number"})+"</option>"+
              "</select>&nbsp;&nbsp;"+
              "<input style='width:150px;' type='text'  id='search-input' />"+
          	  "<span id='search-bar'></span>"+
    		  "<span id='add-bar'></span>"+
			  "<span id='modify-bar'></span>"+
			  "<span id='delete-bar'></span>"+
              "</div>");
              this.element.append($htmls);
		},
        _renderBtn: function(){
        	 var self = this;
             if(this.queryBtn){
             	this.queryBtn.destroy();
             }
             this.queryBtn = new Button({
                 text: locale.get({lang:"query"}),
                 container: $("#search-bar"),
                 events: {
                     click: function(){
                         self.fire("query");
                     }
                 }
             });
             this.addBtn = new Button({
                 text: locale.get({lang:"add"}),
                 container: $("#add-bar"),
                 events: {
                     click: function(){
                     	self.fire("add");
                     }
                 }
             });
             this.editBtn = new Button({
                 text: locale.get({lang:"modify"}),
                 container: $("#modify-bar"),
                 events: {
                     click: function(){
                     	self.fire("modify");
                     }
                 }
             });
             this.deleteBtn = new Button({
                 text: locale.get({lang:"delete"}),
                 container: $("#delete-bar"),
                 events: {
                     click: function(){
                     	self.fire("drop");
                     }
                 }
             });
             
            
             $("#search-bar a").css({
                 "margin": "auto 10px auto 10px",
                 "line-height":"25px"
             });
             $("#add-bar a").css({
             	"margin": "auto 10px auto 10px",
             	"line-height":"25px"
             });
             $("#modify-bar a").css({
             	"margin": "auto 10px auto 10px",
             	"line-height":"25px"
             });
             $("#delete-bar a").css({
             	"margin": "auto 10px auto 10px",
             	"line-height":"25px"
             });
        }  
    });
    
    return NoticeBar;
    
});
