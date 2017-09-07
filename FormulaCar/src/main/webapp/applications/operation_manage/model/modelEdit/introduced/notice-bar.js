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
    	              "<div id='win-search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
    	              "<select id='searchs'  name='searchs' style='width:130px;height: 28px;'>" +
    	              "<option value='0'>" + locale.get({lang: "vender"}) + "</option>" +
    	              "<option value='1'>" + locale.get({lang: "modelname"}) + "</option>" +
    	              "<option value='2'>" + locale.get({lang: "automat_vendor_type"}) + "</option>" +
    	              "</select>&nbsp;&nbsp;" +
    	              "<input style='width:200px' type='text'  id='searchValues' />&nbsp;&nbsp;" +
    	              "</div>");
              this.element.append($htmls);
		},
        _renderBtn: function(){
            var self = this;
            //查询
            var queryBtn = new Button({
                text: locale.get({lang: "query"}),
                container: $("#win-search-bar"),
                events: {
                    click: function() {

                        var search = $("#searchs").val();
                        var searchValue = $("#searchValues").val();
                        
                        self.fire("query", search, searchValue);
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
            var introducedBtn = new Button({
                text: locale.get({lang: "introduced"}),
                container: $("#win-search-bar"),
                events: {
                    click: function() {
                        self.fire("introduced");
                    }
                }
            });
            
            if(permission.app("model_manage").read){
            	if(queryBtn) queryBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            }
            var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
        	if(oid == '0000000000000000000abcde'){
        		if(introducedBtn) introducedBtn.hide();
        	}else{
        		  if(permission.app("model_manage").write){
                  	if(introducedBtn) introducedBtn.show();
                  }else{
                  	if(introducedBtn) introducedBtn.hide();
                  }
        	}
          
            $("#win-search-bar a").css({
                margin: "-3px 0px 0px 6px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
