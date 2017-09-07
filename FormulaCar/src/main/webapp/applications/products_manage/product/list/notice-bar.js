define(function(require) {
    var cloud = require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/resources/css/jquery.multiselect.css");
    var Button = require("cloud/components/button");
    var Service = require("../../service");
    var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
    var eurl;
    if(oid == '0000000000000000000abcde'){
    	
    	eurl = "gapi";
    	
    }else{
    	
    	eurl = "api";
    }
    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this._render();
        },
        _render: function() {
            this.draw();
            this._renderGetGoodsType();
            this._renderSelect();
            this._renderBtn();
        },
        draw: function() {
            var self = this;
            var $htmls = $(+"<div></div>" +
                    "<div id='pro-search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
                    "<select id='type'  name='type' style='width:100px;height: 28px; '>" +
                    "<option value='0'>" + locale.get({lang: "all_classification"}) + "</option>" +
                    "</select>&nbsp;&nbsp;" +
                    "<select id='search'  name='search' style='width:214px;height: 28px;'>" +
                    "<option value='1'>" + locale.get({lang: "product_name"}) + "</option>" +
                    "<option value='0'>" + locale.get({lang: "automat_item_number"}) + "</option>" +
                    "<option value='2'>" + locale.get({lang: "product_manufacturer"}) + "</option>" +
                    "</select>&nbsp;&nbsp;" +
                    "<input style='width:120px; margin-left: -2px;' type='text'  id='searchValue' />" +
                    "</div>");
            this.element.append($htmls);
        },
        _renderGetGoodsType: function() {
            Service.getGoodsTypeInfo(eurl,function(data) {
                if (data.result) {
                    for (var i = 0; i < data.result.length; i++) {
                        $("#type").append("<option value='" + data.result[i]._id + "'>" + data.result[i].name + "</option>");
                    }
                }
            });
        },
        _renderSelect: function() {
            $(function() {
                $("#startTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime() - 1000 * 60 * 60 * 24 * 7) / 1000), "yyyy/MM/dd") + " 00:00").datetimepicker({
                    format: 'Y/m/d H:i',
                    step: 1,
                    startDate: '-1970/01/08',
                    lang: locale.current() === 1 ? "en" : "ch"
                })

                $("#endTime").val(cloud.util.dateFormat(new Date((new Date()).getTime() / 1000), "yyyy/MM/dd") + " 23:59").datetimepicker({
                    format: 'Y/m/d H:i',
                    step: 1,
                    lang: locale.current() === 1 ? "en" : "ch"
                })
                $("#startTime").val("");
                $("#endTime").val("");
            });
        },
        _renderBtn: function() {
            var self = this;
            //查询
            var queryBtn = new Button({
                text: locale.get({lang: "query"}),
                container: $("#pro-search-bar"),
                events: {
                    click: function() {
                        var type = $("#type").val();
                        var search = $("#search").val();
                        var searchValue = $("#searchValue").val();
                        self.fire("query", type, search, searchValue);
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
            var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
            
                var addBtn = new Button({
                    text: locale.get({lang: "add"}),
                    container: $("#pro-search-bar"),
                    events: {
                        click: function() {
                            self.fire("add");
                        }
                    }
                });
                
            
            
            //修改
            var updateBtn = new Button({
                text: locale.get({lang: "modify"}),
                container: $("#pro-search-bar"),
                events: {
                    click: function() {
                        self.fire("modify");
                    }
                }
            });
            //删除
            var deleteBtn = new Button({
                text: locale.get({lang: "delete"}),
                container: $("#pro-search-bar"),
                events: {
                    click: function() {
                        self.fire("drop");
                    }
                }
            });
            
           /* var importBtn = new Button({
                text: locale.get({lang: "import"}),
                container: $("#search-bar"),
                events: {
                    click: function() {
                        self.fire("imReport");
                    }
                }
            });*/
            if(oid != '0000000000000000000abcde'){
            var introducedBtn = new Button({
                text: locale.get({lang: "introduced"}),
                container: $("#pro-search-bar"),
                events: {
                    click: function() {
                        self.fire("introduced");
                    }
                }
            });
            }
            
            //if(oid != '0000000000000000000abcde'){
	            var exportBtn = new Button({
	                text: locale.get({lang: "goods_export_excel"}),
	                container: $("#pro-search-bar"),
	                events: {
	                    click: function() {
	                        self.fire("exReport");
	                    }
	                }
	            });
            //}
            $("#"+exportBtn.id).addClass("readClass");
            var exportXMLBtn = new Button({
                text: locale.get({lang: "goods_export_xml"}),
                container: $("#pro-search-bar"),
                events: {
                    click: function() {
                        self.fire("exReportXML");
                    }
                }
            });
            $("#"+exportXMLBtn.id).addClass("readClass");
            
            //下架
            var off_the_shelf = new Button({
                text: locale.get({lang: "off_the_shelf"}),
                container: $("#pro-search-bar"),
                events: {
                    click: function() {
                        self.fire("offShelf");
                    }
                }
            });
            $("#"+off_the_shelf.id).addClass("readClass");
            
            if(permission.app("product_manage").read){
            	if(queryBtn) queryBtn.show();
            	if(exportBtn) exportBtn.show();
            	if(exportXMLBtn) exportXMLBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            	if(exportBtn) exportBtn.hide();
            	if(exportXMLBtn) exportXMLBtn.hide();
            }
            if(permission.app("product_manage").write){
            	if(addBtn) addBtn.show();
            	if(updateBtn) updateBtn.show();
            	if(deleteBtn) deleteBtn.show();
            	if(introducedBtn) introducedBtn.show();
            }else{
            	if(addBtn) addBtn.hide();
            	if(updateBtn) updateBtn.hide();
            	if(deleteBtn) deleteBtn.hide();
            	if(introducedBtn) introducedBtn.hide();
            }
            $("#pro-search-bar a").css({
                margin: "-3px 0px 0px 6px"
            });
        }

    });

    return NoticeBar;

});
