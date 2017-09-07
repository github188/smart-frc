define(function(require) {
    var cloud = require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/resources/css/jquery.multiselect.css");
    var Button = require("cloud/components/button");
    var Service = require("../../service");
    var WinNoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this._render();
        },
        _render: function() {
            this.draw();
            this._renderGetGoodsType();
            
            this._renderBtn();
        },
        draw: function() {
            var self = this;
            var $htmls = $("<div></div>" +
                    "<div id='win-search-bar' style='width:auto;margin-top:5px;margin-left:5px;padding-bottom:5px;'>" +
                    "<select id='type'  name='type' style='width:120px;height: 28px;border-radius: 4px;'>" +
                    "<option value=''>" + locale.get({lang: "all_classification"}) + "</option>" +
                    "</select>&nbsp;&nbsp;" +
                    "<select id='search'  name='search' style='width:100px;height: 28px;border-radius: 4px;'>" +
                    "<option value='1'>" + locale.get({lang: "product_name"}) + "</option>" +
                    "<option value='0'>" + locale.get({lang: "automat_item_number"}) + "</option>" +
                    "<option value='2'>" + locale.get({lang: "product_manufacturer"}) + "</option>" +
                    "</select>&nbsp;&nbsp;" +
                    "<input style='width:200px' type='text'  id='searchValue' />&nbsp;&nbsp;" +
                    "</div>");
             
            self.element.append($htmls);
        },
        _renderGetGoodsType: function() {
            Service.getAdminGoodsTypeInfo(function(data) {
                if (data.result) {
                    for (var i = 0; i < data.result.length; i++) {
                        $("#type","#win-search-bar").append("<option value='" + data.result[i]._id + "'>" + data.result[i].name + "</option>");
                    }
                }
            });
        },
        
        _renderBtn: function() {
            var self = this;
            //查询
            var queryBtn = new Button({
                text: locale.get({lang: "query"}),
                container: $("#win-search-bar"),
                events: {
                    click: function() { 
                        self.fire("query");
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

            $("#search-bar a").css({
                margin: "auto 10px auto 10px"
            });
        }

    });

    return WinNoticeBar;

});
