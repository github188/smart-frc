define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("../../css/online-noticebar.css");
	var Button = require("cloud/components/button");
	var Service = require("../../service");
	var NoticeBar = Class.create(cloud.Component,{
		initialize:function($super,options){
			 $super(options);
	          this.Service = new Service();
	          this._render();
		},
		
		_render:function(){
			this._draw();
			this._events();
			this._addButton();
		},
		_draw:function(){
			var self = this;
			var $html = $(
				"<div class='notice-bar'>"
					+"<p class='notice-bar-state-title'>"+locale.get({lang:"network"})+"</p>"
					+"<div class='notice-bar-state-online'><p><input value='online' type='checkbox' id='noticebar-online-input' class='notice-bar-state-input' style='margin-top: 11px;/></p><p class='notice-bar-state-text'>"+locale.get({lang:"online"})//+"</p><p class='notice-bar-state-count'>(<span id='noticebar-online-count'></span>)</p></div>"
	                +"</div>"
	                +"<div class='notice-bar-state-offline'><p><input value='offline' type='checkbox' id='noticebar-offline-input' class='notice-bar-state-input' style='margin-left: -6px;margin-top: 11px;'/></p><p class='notice-bar-state-text'>"+locale.get({lang:"offline"})//+"</p><p class='notice-bar-state-count'>(<span id='noticebar-offline-count'></span>)</p></div>"
					+"</div>"
					+"<div class='notice-bar-calendar'>"
                +"<p class='notice-bar-search-text'>"+locale.get({lang:"traffic_automat_number+:"})+"</p>"
                +"<input class='notice-bar-search-input' type='text' style='margin-left: -5px;height: 22px;margin-top: 2px;' placeholder='"+locale.get('empty_is_all')+"'>"
				+"<div class='notice-bar-calendar-button' id='notice-bar-calendar-button-query'></div>"
				+"</div>"
                +"</div>"
			);
			this.element.append($html);

            $(".notice-bar-search-input").keypress(function(e){
                if(e.keyCode == 13){
                    self.submit();
                }
            })
			
		},
		_events:function(){
			$("#noticebar-online-input").attr("checked","checked");
			$("#noticebar-offline-input").attr("checked","checked");
		},
		 submit:function(){
	            var self = this;
	            var status=[];
	            var $onlineInput = $("#noticebar-online-input");
	            var $offlineInput = $("#noticebar-offline-input");

	            if($onlineInput.attr("checked") == "checked" && $offlineInput.attr("checked") == "checked"){
	            	status=[];
	            }else if($onlineInput.attr("checked") == "checked"){
	            	status=[0];
	            }else if($offlineInput.attr("checked") == "checked"){
	            	status=[1];
	            }else{
	            	status=[];
	            }

	            var assetId = $(".notice-bar-search-input").val();
	            obj = {
	            	assetId:assetId,
	            	  online:status
	                
	            };
	            self.fire("query",obj);
	        },
		_addButton:function(){
            var queryButton = new Button({
                container: this.element.find("#notice-bar-calendar-button-query"),
                id: "queryBtn",
                text: locale.get({lang:"query"}),
                events: {
                    click: this.submit,
                    scope: this
                }
            });
            $("#"+queryButton.id).addClass("readClass");
		}
		
	});
	return NoticeBar;
});