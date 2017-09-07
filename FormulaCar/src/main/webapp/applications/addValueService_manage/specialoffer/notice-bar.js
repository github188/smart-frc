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
            this.status = options.status;
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
              "<label style='margin:auto 10px auto 10px'>"+locale.get({lang:"name1"})+" </label>" +
              "<input style='width:200px' type='text'  id='name' />&nbsp;&nbsp;"  +

              "<select  id='specialTypeList' multiple='multiple' name='specialTypeList' style='width:180px;height: 28px; border-radius: 4px;'>" + //优惠方式
              "<option value='1'>" + locale.get({lang: "focus_deliver_water"}) + "</option>" +
              "<option value='2'>" + locale.get({lang: "buy_deliver_one"}) + "</option>" +
              "<option value='3'>" + locale.get({lang: "buy_discount"}) + "</option>" +
              "<option value='4'>" + locale.get({lang: "buy_discount_perference"}) + "</option>" +
              "</select>&nbsp;&nbsp;" +
              "</div>");
              this.element.append($htmls);
              require(["cloud/lib/plugin/jquery.multiselect"], function() {
                  $("#specialTypeList").multiselect({
                      header: true,
                      checkAllText: locale.get({lang: "check_all"}),
                      uncheckAllText: locale.get({lang: "uncheck_all"}),
                      noneSelectedText: locale.get({lang: "special_offer_type"}),
                      selectedText: "# " + locale.get({lang: "is_selected"}),
                      minWidth: 180,
                      height: 120
                  });
              });
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
            
            var catBtn = new Button({
                text: locale.get({lang: "price_see"}),
                container: $("#search-bar"),
                events: {
                    click: function() {
                        self.fire("see");
                    }
                }
            });
            $("#"+catBtn.id).addClass("readClass");
            
            var addBtn = new Button({
                text: locale.get({lang:"add"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	self.fire("add");
                    }
                }
            });
            var editBtn = new Button({
                text: locale.get({lang:"modify"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	self.fire("modify");
                    }
                }
           });
            var deleteBtn = new Button({
                text: locale.get({lang:"delete"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	self.fire("drop");
                    }
                }
            });


            if(permission.app("special_offer").read){
            	if(queryBtn) queryBtn.show();
            	if(catBtn) catBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            	if(catBtn) catBtn.hide();
            }
            if(permission.app("special_offer").write){
            	if(addBtn) addBtn.show();
            	if(editBtn) editBtn.show();
            	if(deleteBtn) deleteBtn.show();
            }else{
            	if(addBtn) addBtn.hide();
            	if(editBtn) editBtn.hide();
            	if(deleteBtn) deleteBtn.hide();
            }
            $("#"+addBtn.id).css({
            	 margin: "-3px 0px 0px 6px"
            });
            $("#"+catBtn.id).css({
           	 margin: "-3px 0px 0px 6px"
           });
            $("#"+editBtn.id).css({
           	 margin: "-3px 0px 0px 6px"
           });
            $("#"+deleteBtn.id).css({
           	 margin: "-3px 0px 0px 6px"
           });
            $("#"+queryBtn.id).css({
              	 margin: "-3px 0px 0px 0px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
