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
    	              "<select id='search'  name='search' style='width:130px;height: 28px; '>" +
    	              "<option value='0'>" + locale.get({lang: "vender"}) + "</option>" +
    	              "<option value='1'>" + locale.get({lang: "modelname"}) + "</option>" +
    	              "<option value='2'>" + locale.get({lang: "automat_vendor_type"}) + "</option>" +
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
            var IntroduceBtn = new Button({
                text: locale.get({lang:"introduced"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	self.fire("introduced");
                    }
                }
            });
            //导出
//            var exportBtn = new Button({
//                text: locale.get({lang: "export"}),
//                container: $("#search-bar"),
//                events: {
//                    click: function() {
//                    	var domain = window.location.host;
//                    	var vender = null;
//                    	var machineType = 0;
//                    	if(domain == "longyuniot.com"){
//                    		vender = "aucma";
//            			}else if(domain == "www.dfbs-vm.com"){
//            				vender = "fuji";
//            			}
//                    	var selectedId = $("#search").find("option:selected").val();
//                    	if(selectedId == 2){
//                    		var machineT = $("#searchValue").val();
//                    		if(machineT != null && machineT.replace(/(^\s*)|(\s*$)/g,"")==""){
//                    			
//                    			if(!isNaN(machineT)){
//                    				machineType = machineT;
//                    			}else{
//                    				dialog.render({lang:"please_input_number"});
//                    				return;
//                    			}
//                    			
//                    		}
//
//                    	}
//                        self.fire("exports", vender, machineType);
//                    }
//                }
//            });
            if(permission.app("model_manage").read){
            	if(queryBtn) queryBtn.show();
            	if(catBtn) catBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            	if(catBtn) catBtn.hide();
            }
            var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
        	
            if(permission.app("model_manage").write){
            	if(addBtn) addBtn.show();
            	if(editBtn) editBtn.show();
            	if(deleteBtn) deleteBtn.show();
            	if(oid == '0000000000000000000abcde'){
            		if(IntroduceBtn) IntroduceBtn.hide();
            	}else{
                    if(IntroduceBtn) IntroduceBtn.show();
            	}
            }else{
            	if(addBtn) addBtn.hide();
            	if(editBtn) editBtn.hide();
            	if(deleteBtn) deleteBtn.hide();
            	if(IntroduceBtn) IntroduceBtn.hide();
            }
            $("#search-bar a").css({
                margin: "-3px 0px 0px 6px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
