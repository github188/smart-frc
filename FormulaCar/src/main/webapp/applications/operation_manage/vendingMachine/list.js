define(function(require) {
    require("cloud/base/cloud");
    require("cloud/base/fixTableHeader");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./list.html");
    var Service = require("./service");
    var NoticeBar = require("./notice-bar");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    var SeeDevice = require("./see/seedevice-window");
    var DeviceMan = require("./manage/deviceMan-window");
    var columns = [{
        "title": locale.get({lang: "network"}),
        "dataIndex": "online",
        "cls": null,
        "width": "10%",
        render: function(data, type, row) {
            var display = "";
            if ("display" == type) {
                switch (data) {
                    case 1:
                        var offlineStr = locale.get({
                            lang: "offline"
                        });
                        display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-offline\" title = \"#{status}\"}></div>")
                            .evaluate({
                                status: offlineStr
                            });
                        break;
                    case 0:
                        var onlineStr = locale.get({
                            lang: "online"
                        });
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
        "title": locale.get({lang: "numbers"}),
        "dataIndex": "assetId",
        "cls": null,
        "width": "10%",
        render: function(data, type, row) {
            var display = "";
            display += new Template(
                    "<div id='" + row._id + "' assetId='" + row.assetId + "' class='automatAsset' style='line-height: 25px;'><span style='color: #09c;cursor: pointer;'>" + data + "</span></div>")
                .evaluate({
                    status: ''
                });

            return display;
        }
    }, {
        "title": locale.get( "the_stage_name"),
        "dataIndex": "name",
        "cls": null,
        "width": "15%"
    }, {
        "title": locale.get({lang: "automat_site_name" }),
        "dataIndex": "siteName",
        "cls": null,
        "width": "15%"
    }, {
        "title": locale.get({lang: "line_man_name"}),
        "dataIndex": "dealerName",
        "cls": null,
        "width": "15%"
    }, {
        "title": locale.get( "stage_type"),
        "dataIndex": "moduleName",
        "cls": null,
        "width": "15%"
    }, {
        "title": locale.get( "manufacturer"),
        "dataIndex": "vender",
        "cls": null,
        "width": "10%"
    }, {
        "title": locale.get({ lang: "create_time"}),
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
        	$("#device_list").css("width", $(".wrap").width());
            $("#device_list_paging").css("width", $(".wrap").width());

            $("#device_list").css("height", $("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());

            var listHeight = $("#device_list").height();
            var barHeight = $("#device_list_bar").height() * 2;
            var tableHeight = listHeight - barHeight - 7;
            $("#device_list_table").css("height", tableHeight);

            require(["cloud/base/fixTableHeaderV"], function(Account) {
                var height = $("#device_list_table").height() + "px";
                $("#device_list_table-table").freezeHeaderV({
                    'height': height
                });
            });


            this._renderTable();
            this._renderNoticeBar();
        },
        _renderBtn: function() {
            var self = this;
            $(".automatAsset").click(function() {
                var _id = $(this)[0].id;
                var assetId = $(this)[0].attributes[1];
                this.seeDevice = new SeeDevice({
                    selector: "body",
                    deviceId: _id,
                    automatNo: assetId,
                    deviceIdArr: self.automatIds,
                    tab: 3,
                    events: {
                        "getDeviceList": function() {
                            self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                        }
                    }
                });
            });

            $(".shelf_status").click(function() {
                var _id = $(this)[0].id;
                var assetId = $(this)[0].attributes[1];
                this.seeDevice = new SeeDevice({
                    selector: "body",
                    deviceId: _id,
                    automatNo: assetId,
                    deviceIdArr: self.automatIds,
                    tab: 4,
                    events: {
                        "getDeviceList": function() {
                            self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                        }
                    }
                });
            });
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
                checkbox: "full",
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
            this.loadTableData(30, 0);
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
                if (cloud.style == 1) {
                    if (cloud.online != null && cloud.online == 0) {
                        online = 0;
                    } else if (cloud.online && cloud.online == 1) {
                        online = 1;
                    }
                }
            }



            var areaId = "";
            var lineId = "";

            if ($("#userarea").attr("multiple") != undefined) {
                areaId = $("#userarea").multiselect("getChecked").map(function() { //
                    return this.value;
                }).get();
                lineId = $("#userline").multiselect("getChecked").map(function() { //
                    return this.value;
                }).get();
            }

            var lineFlag = 1;
            if (areaId.length != 0) {
                if ($("#userline").find("option").length <= 0) {
                    lineFlag = 0;
                }
            }
            var search = $("#search").val();
            var searchValue = $("#searchValue").val();
            if (searchValue) {
                searchValue = self.stripscript(searchValue);
            }

            var siteName = null;
            var assetId = null;
            var name = null;
            var vender = null;
            if (search) {
                if (search == 0) {
                    assetId = $("#searchValue").val();
                } else if (search == 1) {
                    siteName = searchValue; //点位名称
                } else if (search == 2) {
                    name = searchValue; //售货机名称
                } else if (search == 3) {
                    vender = $('#vender option:selected').val();
                    if (vender == '0') {
                        vender = '';
                    }
                }
            }

            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getAreaByUserId(userId, function(areadata) {

                var areaIds = [];
                if (areadata && areadata.result && areadata.result.area && areadata.result.area.length > 0) {
                    areaIds = areadata.result.area;
                }
                if (roleType == 51) {
                    areaIds = [];
                }
                if (areaId.length != 0) {
                    areaIds = areaId;
                }

                if (roleType != 51 && areaIds.length == 0) {
                    areaIds = ["000000000000000000000000"];
                }
                cloud.Ajax.request({
                    url: "api/automatline/list",
                    type: "GET",
                    parameters: {
                        areaId: areaIds,
                        cursor: 0,
                        limit: -1
                    },
                    success: function(linedata) {
                        var lineIds = [];
                        if (linedata && linedata.result && linedata.result.length > 0) {
                            for (var i = 0; i < linedata.result.length; i++) {
                                lineIds.push(linedata.result[i]._id);
                            }
                        }

                        if (roleType == 51 && areaId.length == 0) {
                            lineIds = [];
                        }
                        if (lineId.length != 0) {
                            lineIds = lineId;
                        } else {
                            if (lineFlag == 0) {
                                lineIds = ["000000000000000000000000"];
                            }
                        }

                        if (roleType != 51 && lineIds.length == 0) {
                            lineIds = ["000000000000000000000000"];
                        }
                        self.lineIds = lineIds;
                        if (self.onlineType) {
                            self.searchData = {
                                "online": online,
                                "siteName": siteName,
                                "assetId": assetId,
                                "lineId": lineIds,
                                "name": name,
                                "vender": vender,
                                "onlineType": self.onlineType
                            };
                        } else {
                            self.searchData = {
                                "online": online,
                                "siteName": siteName,
                                "assetId": assetId,
                                "name": name,
                                "vender": vender,
                                "lineId": lineIds
                            };
                        }

                        Service.getAllAutomatsByPage(self.searchData, limit, cursor, function(data) {
                            var total = data.result.length;
                            self.pageRecordTotal = total;
                            self.totalCount = data.result.length;

                            self.listTable.render(data.result);
                            self._renderpage(data, 1);
                            self._renderBtn();
                            cloud.util.unmask("#device_list_table");
                        }, self);
                    }
                });
            });

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
                        cloud.util.mask("#device_list_table");
                        Service.getAllAutomatsByPage(self.searchData, options.limit, options.cursor, function(data) {
                            self.pageRecordTotal = data.total - data.cursor;
                            callback(data);
                            self._renderBtn();
                            cloud.util.unmask("#device_list_table");
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
                onlineType: self.onlineType,
                events: {
                    query: function() {
                        self.loadTableData($(".paging-limit-select").val(), 0, '');
                    },
                    add: function() { //添加
                        if (this.addDevice) {
                            this.addDevice.destroy();
                        }
                        this.addDevice = new DeviceMan({
                            selector: "body",
                            events: {
                                "getDeviceList": function() {
                                    self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                }
                            }
                        });
                    },
                    update: function() { //修改
                        var selectedResouces = self.getSelectedResources();
                        if (selectedResouces.length === 0) {
                            dialog.render({
                                lang: "please_select_at_least_one_config_item"
                            });
                        } else if (selectedResouces.length >= 2) {
                            dialog.render({
                                lang: "select_one_gateway"
                            });
                        } else {
                            var _id = selectedResouces[0]._id;
                            if (this.updateDevice) {
                                this.updateDevice.destroy();
                            }
                            this.updateDevice = new DeviceMan({
                                selector: "body",
                                deviceId: _id,
                                onlineType: self.onlineType,
                                events: {
                                    "getDeviceList": function() {
                                        self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                    }
                                }
                            });
                        }
                    },
                    see: function() {
                        var selectedResouces = self.getSelectedResources();
                        if (selectedResouces.length === 0) {
                            dialog.render({
                                lang: "please_select_at_least_one_config_item"
                            });
                        } else if (selectedResouces.length >= 2) {
                            dialog.render({
                                lang: "select_one_gateway"
                            });
                        } else {
                            var _id = selectedResouces[0]._id;
                            var assetId = selectedResouces[0].assetId;
                            if (this.seeDevice) {
                                this.seeDevice.destroy();
                            }
                            var languge = localStorage.getItem("language");
                            if (languge == "en") {
                                require(["./see/seedevice-window-en"], function(SeeDevice_en) {
                                    if (!this.SeeDevice_en) {
                                        this.seeDevice = new SeeDevice_en({
                                            selector: "body",
                                            deviceId: _id,
                                            automatNo: assetId,
                                            deviceIdArr: self.automatIds,
                                            events: {
                                                "getDeviceList": function() {
                                                    self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                                }
                                            }
                                        });
                                    }
                                });

                            } else {
                                this.seeDevice = new SeeDevice({
                                    selector: "body",
                                    deviceId: _id,
                                    automatNo: assetId,
                                    deviceIdArr: self.automatIds,
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
                            dialog.render({
                                lang: "please_select_at_least_one_config_item"
                            });
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
                                            /*if(data.failure>0){
                                                var a= locale.get({lang: "total_has"});
                                                var b = locale.get({lang: "tai"});
                                                var c =  locale.get({lang: "delete_failed"});
                                                var d =  locale.get({lang: "delete_failed_reson"});
                                                var message = a+data.failure+b+c+","+d;
                                               dialog.render({text:message});
                                               
                                               
                                               
                                            }else{
                                               dialog.render({lang: "deletesuccessful"});
                                            }*/
                                            dialog.render({
                                                lang: "deletesuccessful"
                                            });

                                        }, self);
                                        dialog.close();
                                    }
                                }, {
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
                    },
                    exReport: function() {
                        var language = locale._getStorageLang() === "en" ? 1 : 2;
                        var host = cloud.config.FILE_SERVER_URL;
                        var reportName = "deviceList.xlsx";

                        var parameters = "&access_token=" + cloud.Ajax.getAccessToken();
                        var online = $("#online").val();
                        if (online) {
                            if (online == -1) {
                                online = '';
                            }
                        }
                        var userline = $("#userline").multiselect("getChecked").map(function() { //线路                        
                            return this.value;
                        }).get();
                        var search = $("#search").val();
                        var searchValue = $("#searchValue").val();
                        if (searchValue) {
                            searchValue = self.stripscript(searchValue);
                        }

                        var siteName = null;
                        var assetId = null;
                        var name = null;
                        if (search) {
                            if (search == 0) {
                                assetId = $("#searchValue").val();
                            } else if (search == 1) {
                                siteName = searchValue; //点位名称
                            } else if (search == 2) {
                                name = searchValue; //售货机名称
                            }
                        }
                        var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
                        var roleType = permission.getInfo().roleType;
                        Service.getLinesByUserId(userId, function(linedata) {
                            var lineIds = [];
                            if (linedata.result && linedata.result.length > 0) {
                                for (var i = 0; i < linedata.result.length; i++) {
                                    lineIds.push(linedata.result[i]._id);
                                }
                            }
                            if (roleType == 51) {
                                lineIds = [];
                            }
                            if (roleType != 51 && lineIds.length == 0) {
                                lineIds = ["000000000000000000000000"];
                            }
                            self.lineIds = lineIds;
                            if (userline.length == 0) {
                                userline = lineIds;
                            }

                            if (online != null && online != "") {
                                parameters += "&online=" + online;
                            }
                            if (siteName != null && siteName != "") {
                                parameters += "&siteName=" + siteName;
                            }
                            if (assetId != null && assetId != "") {
                                parameters += "&assetId=" + assetId;
                            }
                            if (name != null && name != "") {
                                parameters += "&name=" + name;
                            }
                            if (userline != null && userline.length > 0) {
                                parameters += "&lineId=" + userline;
                            }
                            if (language) {
                                parameters += "&language=" + language;
                            }
                            var now = Date.parse(new Date()) / 1000;
                            var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
                            parameters += "&time=" + now;
                            parameters += "&oid=" + oid;
                            var path = "/home/deviceList/" + now + "/" + reportName;
                            var url = host + "/api/vmreports/getAutomatListExcel?report_name=" + reportName + "&path=" + path + "&access_token=" + cloud.Ajax.getAccessToken();
                            Service.createDeviceListExcel(parameters, function(data) {
                                if (data) {
                                    var len = $("#search-bar").find("a").length;
                                    var id = $("#search-bar").find("a").eq(len - 1).attr("id");
                                    $("#" + id).html("");
                                    if (document.getElementById("bexport") != undefined) {
                                        $("#bexport").show();
                                    } else {
                                        $("#" + id).after("<span style='margin-left:6px;' id='bexport'>" + locale.get({
                                            lang: "being_export"
                                        }) + "</span>");
                                    }
                                    $("#" + id).hide();

                                    var timer = setInterval(function() {
                                        Service.findDeviceListExcel(now, "deviceList.txt", function(data) {
                                            if (data.onlyResultDTO.result.res == "ok") {
                                                cloud.util.ensureToken(function() {
                                                    window.open(url, "_self");
                                                });
                                                clearInterval(timer);
                                                $("#" + id).html("");
                                                if ($("#bexport")) {
                                                    $("#bexport").hide();
                                                }
                                                $("#" + id).append("<span class='cloud-button-item cloud-button-text'>" + locale.get({
                                                    lang: "export"
                                                }) + "</span>");
                                                $("#" + id).show();
                                            }
                                        })
                                    }, 5000);
                                }
                            });
                            /* cloud.util.ensureToken(function() {
                                 window.open(url+parameters, "_self");
                             });   */
                        });
                    },
                    auth: function() {
                        cloud.util.mask("#content-table");
                        var idsArr = self.getSelectedResources();
                        if (idsArr.length == 0) {
                            cloud.util.unmask("#content-table");
                            dialog.render({
                                lang: "please_select_at_least_one_config_item"
                            });
                            return;
                        } else {
                            var ids = "";
                            for (var i = 0; i < idsArr.length; i++) {
                                if (i == idsArr.length - 1) {
                                    ids = ids + idsArr[i]._id;
                                } else {
                                    ids = ids + idsArr[i]._id + ",";
                                }
                                /*var siteName = idsArr[i].siteName;
                                 var lineName = idsArr[i].lineName;
                                 
                                 if(siteName == null || lineName == null){
                                     dialog.render({lang: "please_add_site_line_for_device"});
                                     return;
                                 }*/


                            }
                            dialog.render({
                                lang: "affirm_authentication",
                                buttons: [{
                                    lang: "affirm",
                                    click: function() {
                                        cloud.util.mask("#device_list_table");
                                        Service.authAutomatsByIds(ids, function(data) {
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
                                            dialog.render({
                                                lang: "authentication_success"
                                            });
                                        }, self);
                                        dialog.close();
                                    }
                                }, {
                                    lang: "cancel",
                                    click: function() {
                                        cloud.util.unmask("#device_list_table");
                                        dialog.close();
                                    }
                                }]
                            });
                        }
                    }
                }
            });
            $("#buttonDiv a.cloud-button").show();
        },
        getSelectedResources: function() {
            var self = this;
            var rows = self.listTable.getSelectedRows();
            var selectedRes = new Array();
            rows.each(function(row) {
                selectedRes.push(self.listTable.getData(row));
            });
            return selectedRes;
        }
    });
    return list;
});