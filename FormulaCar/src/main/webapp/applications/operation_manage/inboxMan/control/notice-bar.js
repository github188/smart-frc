define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("./online-noticebar.css");
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
        	this._events();
        },
    	draw:function(){
    		  var self = this;
              var $htmls = $(+"<div></div>" +
              "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:6px;'>" 
				+"<p class='notice-bar-state-title' style='margin-top: 5px;'>"+locale.get({lang:"network"})+"</p>"
				+"<div class='notice-bar-state-online' style='margin-top: 5px;'><p><input value='online' type='checkbox' id='noticebar-online-input' class='notice-bar-state-input' style='margin-top: 4px;/></p><p class='notice-bar-state-text'>"+locale.get({lang:"online"})//+"</p><p class='notice-bar-state-count'>(<span id='noticebar-online-count'></span>)</p></div>"
                +"</div>"
                +"<div class='notice-bar-state-offline' style='margin-top: 5px;'><p><input value='offline' type='checkbox' id='noticebar-offline-input' class='notice-bar-state-input' style='margin-left: -6px;margin-top: 4px;'/></p><p class='notice-bar-state-text'>"+locale.get({lang:"offline"})//+"</p><p class='notice-bar-state-count'>(<span id='noticebar-offline-count'></span>)</p></div>"
				+"</div>"+
              "<label style='margin:auto 10px auto 10px;margin-right: 2px;'>"+locale.get({lang:"inbox_sn"})+" </label>" +
              "<input style='width:180px;margin-right: -8px;' type='text'  id='name' />&nbsp;&nbsp;"  +
              "<label style='margin:auto 10px auto 10px;margin-right: 2px;'>"+locale.get({lang:"automat_no1"})+" </label>" +
              "<input style='width:180px;margin-right: -8px;' type='text'  id='assetId' />&nbsp;&nbsp;"  +
              "</div>");
              this.element.append($htmls);
		},
		_events:function(){
			$("#noticebar-online-input").attr("checked","checked");
			$("#noticebar-offline-input").attr("checked","checked");
		},
        _renderBtn: function(){
            var self = this;
            //查询
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                        self.fire("query");
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
            
            var deleteBtn = new Button({
                text: locale.get({lang:"delete"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                        self.fire("drop");
                    }
                }
            });
            
            var ContrBtn = new Button({
                text: locale.get({lang:"longrange_control"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                        self.fire("control");
                    }
                }
            });
            if(permission.app("automat_dominate_list").read){
            	if(ContrBtn) queryBtn.show();
            	if(queryBtn) queryBtn.show();
            }else{
            	if(ContrBtn) queryBtn.hide();
            	if(queryBtn) queryBtn.hide();
            }
            $("#search-bar a").css({
                margin: "-3px 0px 0px 6px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
