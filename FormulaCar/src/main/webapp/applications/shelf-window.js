define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./shelfDetail.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/lib/plugin/jquery.multiselect");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/resources/css/jquery.multiselect.css");
    var Service = require("./siteDetail/service");
    var columns = [{
        "title": "货道编号",
        "dataIndex": "locationId",
        "cls": null,
        "width": "20%"
    }, {
        "title": "销量",
        "dataIndex": "saleNum",
        "cls": null,
        "width": "20%"
    }, {
        "title": "销售额",
        "dataIndex": "saleM",
        "cls": null,
        "width": "15%"
    }];
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.data = options.data;

            locale.render({
                element: this.element
            });

            this._renderWindow();

        },
        _renderWindow: function() {

            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: "货道销售情况",
                top: "center",
                left: "center",
                height: 600,
                width: 1000,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                    "onClose": function() {
                        this.adWindow.destroy();
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
            this.adWindow.show();

            this.render(); //

        },
        //根据对象数组某个字段比较排序
        compare: function(prop) {
            return function(obj1, obj2) {
                var val1 = obj1[prop];
                var val2 = obj2[prop];
                if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                    val1 = Number(val1);
                    val2 = Number(val2);
                }
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            }
        },
        render: function() {
            var self = this;

            var len = self.data.vendingSales.shelves.length;
            for (var i = 0; i < len; i++) {
                var sdata = self.data.vendingSales.shelves[i];
                if (i == 0) {
                    $("#status").append("<li class='active' id='tab_" + sdata.cid + "' style='height: 21px;'><span >" + sdata.cid + "</span></li>");
                } else {
                    $("#status").append("<li id='tab_" + sdata.cid + "' style='height: 21px;'><span >" + sdata.cid + "</span></li>");
                }

                $("#tab_" + sdata.cid).bind("click", {
                    data: sdata
                }, function(e) {
                    $("#status").find('li').removeClass("active");

                    $(this).addClass("active");
                    self._renderTable(e.data.data);

                });

            }

            $("#tab_master").click();



        },
        _renderTable: function(data) {

            var self = this;
            this.listTable = new Table({
                selector: "#shelf-content",
                columns: columns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox: "none",
                events: {
                    onRowClick: function(data) {

                        this.listTable.unselectAllRows();
                        var rows = this.listTable.getClickedRow();
                        this.listTable.selectRows(rows);

                    },
                    onRowRendered: function(tr, data, index) {
                        var self = this;
                    },
                    scope: this
                }
            });

            var sortA = data.channel_sales;
            sortA.sort(self.compare("locationId"));

            this.listTable.render(sortA);

        },
        destroy: function() {
            if (this.window) {
                this.window.destroy();
            } else {
                this.window = null;
            }
        }
    });
    return updateWindow;
});