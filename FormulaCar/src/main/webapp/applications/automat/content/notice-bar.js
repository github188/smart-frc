define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
	var Button = require("cloud/components/button");
	require("template/css/material.css");
	require("template/css/table.css");
    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options){
            $super(options);
			this._render();
        }, 
        _render: function(){
        	this.draw();
        	this._renderEventListener();
        },
    	draw:function(){
              var $htmls = $(
             /* "<div style='float:left;margin-top:3px;'>"+
              "<i class='cloud-button-item cloud-button-img cloud-icon-label cloud-icon-default'></i>"+locale.get({lang:"tag"})+": "+locale.get({lang:"automat_all_automat"})+
              "</div>"+*/
              "<div id='search-bar' style='float:right;width:100%;text-align:center;margin-top:1px;margin-right:2px;'>" +
              '<input id="search_input_name" type="text" style="border-radius: 4px;width: 230px;height: 25px;" class="input-search c666 module-input-row-el">'+
			   '&nbsp;&nbsp;<a id="automat_moni_query" class="btn btn-primary submit" style="margin-top: 0px;width:20px;min-width:30px;" lang="text:query"></a><br></div>'
              );
              this.element.append($htmls);
		},
		_renderEventListener:function(){
			var self = this;
			$("#automat_moni_query").click(function(){
				self.fire("query");
			});
		}
        
    });
    
    return NoticeBar;
    
});