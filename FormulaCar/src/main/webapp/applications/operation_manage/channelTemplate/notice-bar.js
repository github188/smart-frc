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
              "<select id='search'  name='search' style='width:131px;height: 28px;'>" +
              "<option value='0'>" + locale.get({lang: "template_name"}) + "</option>" +
              "<option value='1'>" + locale.get({lang: "model_manufacturer"}) + "</option>" +
              "<option value='2'>" + locale.get({lang: "template_model_name"}) + "</option>" +
              "</select>&nbsp;&nbsp;" +
              "<input style='width:200px' type='text'  id='searchValue' />" +
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

                        var search = $("#search").val();
                        var searchValue = $("#searchValue").val();

                        self.fire("query", search, searchValue);
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
            var addBtn = new Button({
                text: locale.get({lang:"add"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	self.fire("add");
                    }
                }
            });
            var updateBtn = new Button({
                text: locale.get({lang:"modify"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	self.fire("update");
                    }
                }
            });
            var deleteBtn = new Button({
                text: locale.get({lang:"delete"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	self.fire("del");
                    }
                }
            });
            /*var exportXMLBtn = new Button({
                text: locale.get({lang:"goods_export_xml"}),
                container: $("#search-bar"),
                events: {
					click:function(){
						self.fire("exReportXML");
					}
				}
            });*/
            if(permission.app("channelTemplate_manage").read){
            	if(queryBtn) queryBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            }
            if(permission.app("channelTemplate_manage").write){
            	if(addBtn) addBtn.show();
            	if(updateBtn) updateBtn.show();
            	if(deleteBtn) deleteBtn.show();
            }else{
            	if(addBtn) addBtn.hide();
            	if(updateBtn) updateBtn.hide();
            	if(deleteBtn) deleteBtn.hide();
            }
            $("#search-bar a").css({
                margin: "-3px 0px 0px 6px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
