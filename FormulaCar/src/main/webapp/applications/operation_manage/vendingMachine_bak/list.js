define(function(require) {
    require("cloud/base/cloud");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./list.html");
    var Service = require("./service");
    var NoticeBar = require("./notice-bar");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    var ImportProduct = require("./importAndOutport/importdevice-window");
    var AddDevice = require("./add/adddevice-window");
    var SeeDevice = require("./see/seedevice-window");
    var UpdateDevice = require("./updateV2/updatedevice-window");
    //var UpdateDevice_en = require("./updateV2/updatedevice-window-en");
    var columns = [{
            "title": locale.get({lang: "status"}),
            "dataIndex": "online",
            "cls": null,
            "width": "5%",
            render: function(data, type, row) {
                var display = "";
                if ("display" == type) {
                    switch (data) {
                        case 1:
                            var offlineStr = locale.get({lang: "offline"});
                            display += new Template(
                                    "<div  style = \"display : inline-block;\" class = \"cloud-table-offline\" title = \"#{status}\"}></div>")
                                    .evaluate({
                                status: offlineStr
                            });
                            break;
                        case 0:
                            var onlineStr = locale.get({lang: "online"});
                            display += new Template(
                                    "<div  style = \"display : inline-block;\" class = \"cloud-table-online\" title = \"#{status}\"}></div>")
                                    .evaluate({
                                status: onlineStr
                            });
                            break;
                        default:
                            break;
                    }
                    return display;
                } else {
                    return data;
                }
            }
        }, {
            "title": locale.get({lang: "automat_no1"}),
            "dataIndex": "assetId",
            "cls": null,
            "width": "15%"
        }, {
            "title": locale.get({lang: "automat_name"}),
            "dataIndex": "name",
            "cls": null,
            "width": "15%"
        }, {
            "title": locale.get({lang: "automat_site_name"}),
            "dataIndex": "siteName",
            "cls": null,
            "width": "14%"
        }, {
            "title": locale.get({lang: "automat_line"}),
            "dataIndex": "lineName",
            "cls": null,
            "width": "15%"
        }, {
            "title": locale.get({lang: "automat_cargo_road_amount"}),
            "dataIndex": "goodsConfigs",
            "cls": null,
            "width": "8%",
            render: function(data, type, row) {
                var display = "";
                if (data) {
                    if (data.length) {
                        display = data.length;
                    } else {
                        display = 0;
                    }
                } else {
                    display = 0;
                }
                return display;
            }
        }, {
            "title": locale.get({lang: "automat_container_quantity"}),
            "dataIndex": "containers",
            "cls": null,
            "width": "8%",
            render: function(data, type, row) {
                var display = "";
                if (data) {
                    if (data.length) {
                        display = data.length;
                    } else {
                        display = 0;
                    }
                } else {
                    display = 0;
                }
                return display;
            }
        }, {
            "title": locale.get({lang: "product_manufacturer"}),
            "dataIndex": "config",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
                var display = "";
                if (data) {
                    display = data.vender;
                }
                return display;
            }
        }, {
            "title": locale.get({lang: "create_time"}),
            "dataIndex": "createTime",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
                return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
            }
        }];

    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(html);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
                bar: {
                    id: "device_list_bar",
                    "class": null
                },
                table: {
                    id: "device_list_table",
                    "class": null
                },
                paging: {
                    id: "device_list_paging",
                    "class": null
                }
            };
            this._render();
        },
        _render: function() {
            this._renderTable();
            this._renderNoticeBar();
        },
        stripscript: function(s) {
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '');
            }
            return rs;
        },
        _renderTable: function() {
            this.listTable = new Table({
                selector: "#device_list_table",
                columns: columns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox: "multi",
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

            this.setDataTable();
        },
        setDataTable: function() {
            this.loadTableData(30, 0, "");
        }, 
        loadTableData: function(limit, cursor, areaVal) {
            cloud.util.mask("#device_list_table");
            var self = this;
            var online = $("#online").val();
            if (online) {
                //0 在线 1离线
                if (online == -1) {
                    online = '';
                }
            } else {
                //查所有
            }
            var userline = $("#userline").multiselect("getChecked").map(function() {//线路
                return this.value;
            }).get();
            var search = $("#search").val();
            var searchValue = $("#searchValue").val();
            if (searchValue) {
                searchValue = self.stripscript(searchValue);
            }

            var siteName = null;
            var assetId = null;
            if (search) {
                if (search == 0) {
                    assetId = searchValue;
                } else if (search == 1) {
                    siteName = searchValue;//点位名称
                }
            }


            self.searchData = {
                "online": online,
                "siteName": siteName,
                "assetId": assetId,
                "lineId": userline
            };
            Service.getAllAutomatsByPage(self.searchData, limit, cursor, function(data) {
                var total = data.result.length;
                self.pageRecordTotal = total;
                self.totalCount = data.result.length;
                self.listTable.render(data.result);
                self._renderpage(data, 1);
                cloud.util.unmask("#device_list_table");
            }, self);
        },
        _renderpage: function(data, start) {
            var self = this;
            if (self.page) {
                self.page.reset(data);
            } else {
                self.page = new Paging({
                    selector: $("#device_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                        Service.getAllAutomatsByPage(self.searchData, options.limit, options.cursor, function(data) {
                            self.pageRecordTotal = data.total - data.cursor;
                            callback(data);
                        });
                    },
                    turn: function(data, nowPage) {
                        self.totalCount = data.result.length;
                        self.listTable.clearTableData();
                        self.listTable.render(data.result);
                        self.nowPage = parseInt(nowPage);
                    },
                    events: {
                        "displayChanged": function(display) {
                            self.display = parseInt(display);
                        }
                    }
                });
                this.nowPage = start;
            }
        },
        _renderNoticeBar: function() {
            var self = this;
            this.noticeBar = new NoticeBar({
                selector: "#device_list_bar",
                events: {
                    query: function(areaVal) {
                        self.loadTableData($(".paging-limit-select").val(), 0, areaVal);
                    },
                    add: function() {//添加
                        var languge = localStorage.getItem("language");
                        if (this.addDevice) {
                            this.addDevice.destroy();
                        }
                        if (languge == "en") {

                            require(["./add/adddevice-window-en"], function(AddDevice_en) {
                                if (AddDevice_en) {
                                    self.addDevice = new AddDevice_en({
                                        selector: "body",
                                        events: {
                                            "getDeviceList": function() {
                                                self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                            }
                                        }
                                    });
                                }
                            });
                        } else {
                            this.addDevice = new AddDevice({
                                selector: "body",
                                events: {
                                    "getDeviceList": function() {
                                        self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                    }
                                }
                            });
                        }
                    },
                    update: function() {//修改
                        var selectedResouces = self.getSelectedResources();
                        if (selectedResouces.length === 0) {
                            dialog.render({lang: "please_select_at_least_one_config_item"});
                        } else if (selectedResouces.length >= 2) {
                            dialog.render({lang: "select_one_gateway"});
                        } else {
                            var _id = selectedResouces[0]._id;
                            if (this.updateDevice) {
                                this.updateDevice.destroy();
                            }
                            var languge = localStorage.getItem("language");
                            if (languge == "en") {
                                require(["./update/updatedevice-window-en"], function(UpdateDevice_en) {
                                    if (UpdateDevice_en) {
                                        self.updateDevice = new UpdateDevice_en({
                                            selector: "body",
                                            deviceId: _id,
                                            events: {
                                                "getDeviceList": function() {
                                                    self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                                }
                                            }
                                        });
                                    }
                                });
                            } else {
                                //console.log(" suggestId updateDevice ");
                                this.updateDevice = new UpdateDevice({
                                    selector: "body",
                                    deviceId: _id,
                                    events: {
                                        "getDeviceList": function() {
                                            self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                        }
                                    }
                                });
                            }

                        }
                    },
                    see: function() {
                        var selectedResouces = self.getSelectedResources();
                        if (selectedResouces.length === 0) {
                            dialog.render({lang: "please_select_at_least_one_config_item"});
                        } else if (selectedResouces.length >= 2) {
                            dialog.render({lang: "select_one_gateway"});
                        } else {
                            var _id = selectedResouces[0]._id;
                            if (this.seeDevice) {
                                this.seeDevice.destroy();
                            }
                            var languge = localStorage.getItem("language");
                            if (languge == "en") {

                            } else {
                                this.seeDevice = new SeeDevice({
                                    selector: "body",
                                    deviceId: _id,
                                    events: {
                                        "getDeviceList": function() {
                                            self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                        }
                                    }
                                });
                            }
                        }
                    },
                    del: function() {
                        cloud.util.mask("#content-table");
                        var idsArr = self.getSelectedResources();
                        if (idsArr.length == 0) {
                            cloud.util.unmask("#content-table");
                            dialog.render({lang: "automat_select_least_one_site"});
                            return;
                        } else {
                            cloud.util.unmask("#content-table");
                            var ids = "";
                            for (var i = 0; i < idsArr.length; i++) {
                                if (i == idsArr.length - 1) {
                                    ids = ids + idsArr[i]._id;
                                } else {
                                    ids = ids + idsArr[i]._id + ",";
                                }
                            }
                            dialog.render({
                                lang: "affirm_delete",
                                buttons: [{
                                        lang: "affirm",
                                        click: function() {
                                            cloud.util.mask("#device_list_table");
                                            Service.deleteAutomatsByIds(ids, function(data) {
                                                if (self.pageRecordTotal == 1) {
                                                    var cursor = ($(".paging-page-current").val() - 2) * $(".paging-limit-select").val();
                                                    if (cursor < 0) {
                                                        cursor = 0;
                                                    }
                                                    self.loadTableData($(".paging-limit-select  option:selected").val(), cursor, "");
                                                } else {
                                                    self.loadTableData($(".paging-limit-select  option:selected").val(), cursor, "");
                                                }
                                                self.pageRecordTotal = self.pageRecordTotal - 1;
                                                dialog.render({lang: "deletesuccessful"});
                                            }, self);
                                            dialog.close();
                                        }
                                    },
                                    {
                                        lang: "cancel",
                                        click: function() {
                                            cloud.util.unmask("#device_list_table");
                                            dialog.close();
                                        }
                                    }]
                            });
                        }
                    },
                    imReport: function() {
                        if (this.imPro) {
                            this.imPro.destroy();
                        }
                        this.imPro = new ImportProduct({
                            selector: "body",
                            events: {
                                "getDeviceList": function() {
                                    self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                }
                            }
                        });
                    }
                }
            });
        },
        getSelectedResources: function() {
            var self = this;
            var rows = self.listTable.getSelectedRows();
            var selectedRes = new Array();
            rows.each(function(row) {
                selectedRes.push(self.listTable.getData(row));
            });
            return selectedRes;
        },
         
        /**
         * unselect all rows in table
         * @author QinJunwen
         */
        unselectAllResources: function() {
             var self = this;
            self.listTable.unSelectRows(); 
            var selectedRes = this.getSelectedResources();
            this.fire("afterSelect", selectedRes, null);
        },
         
		/**
         * return data of click row 
         * @author QinJunwen
         */
		getClickedResource : function(){
			var self = this;
			var clickedRowEl = self.listTable.getClickedRow();
			if (clickedRowEl){
				return self.listTable.getData(clickedRowEl);
			}else {
				return null;
			}
		} 
    });
    return list;
});