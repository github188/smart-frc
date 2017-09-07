define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../template/tableTemplate");
    var html = require("text!./productMenu.html");
    var statusMg = require("../template/menu");
    var pro_Mg = require("./product/list/list");
    var under_way_Mg = require("./price/underWay/list");
    var end_Mg = require("./price/end/list");
    var productMenu = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.service = options.service;
            this.element.html(html);
            this.elements = {
                conent_el: "content-products-menu"
            };
            this._render();

        },
        _render: function() {
            this.renderContent();

        },
        renderContent: function() {
            var dl1 = {};
            dl1.dt = "products";//商品
            dl1.dd = [["product_manage", true]];//商品管理

            var dl2 = {};
            dl2.dt = "products_price";//价格
            dl2.dd = [["products_activity", true]];//优惠活动

            var dls = [];
            dls.push(dl1);
            dls.push(dl2);

            this.left = new Table({
                selector: "#content-products-menu",
                dl: dls,
                events: {
                    click: function(id) {
                        if (id == "product_manage") {//商品管理
                            var proMan_Array = ["product_list"];
                            if (this.proMg) {
                                this.proMg.destroy();
                            }
                            this.proMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": proMan_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        if (id == "product_list") {//列表
                                            if (this.product_listPage) {
                                                this.product_listPage.destroy();
                                            }
                                            this.product_listPage = new pro_Mg({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#product_list").click();
                        } else if (id == "products_activity") {//优惠活动
                            var priceMan_Array = ["product_under_way", "product_end"];
                            if (this.proMg) {
                                this.proMg.destroy();
                            }
                            this.proMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": priceMan_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        if (id == "product_under_way") {//进行中
                                            if (this.under_way_listPage) {
                                                this.under_way_listPage.destroy();
                                            }
                                            this.under_way_listPage = new under_way_Mg({
                                                "container": ".main_bd"
                                            });
                                        } else if (id == "product_end") {//已结束
                                            if (this.end_listPage) {
                                                this.end_listPage.destroy();
                                            }
                                            this.end_listPage = new end_Mg({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#product_under_way").click();
                        }
                    }
                }
            });
        }

    });
    return productMenu;
});