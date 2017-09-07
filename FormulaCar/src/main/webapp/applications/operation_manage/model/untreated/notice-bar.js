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
    	              "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
    	              "<select id='state'  name='state' style='width:130px;height: 28px;'>" +
    	              "<option value='0'>" + locale.get({lang: "all"}) + "</option>" +
    	              "<option value='1'>" + locale.get({lang: "already_processed"}) + "</option>" +
    	              "<option value='2'>" + locale.get({lang: "untreated_model"}) + "</option>" +
    	              "</select>" +
    	              "</div>");
              this.element.append($htmls);
		},
        _renderBtn: function(){
            var self = this;
            //查询
            var queryBtn = new Button({
                text: locale.get({lang: "query"}),
                container: $("#search-bar"),
                events: {
                    click: function() {

                        var state = $("#state").find("option:selected").val();
                        
                        self.fire("query", state);
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
            var editBtn = new Button({
                text: locale.get({lang:"modify"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	self.fire("modify");
                    }
                }
            });
            var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
        	
            $("#search-bar a").css({
                margin: "-3px 0px 0px 6px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
