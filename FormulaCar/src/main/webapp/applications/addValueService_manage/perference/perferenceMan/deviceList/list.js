define(function(require) {
    require("cloud/base/cloud");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./list.html");
    var Service = require("../../../discount/service");
    var NoticeBar = require("./notice-bar");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    require("cloud/lib/plugin/jquery.multiselect");
   
    var columns = [{
            "title": locale.get({lang: "automat_no1"}),
            "dataIndex": "assetId",
            "cls": null,
            "width": "25%"
        }, {
            "title": locale.get({lang: "automat_name"}),
            "dataIndex": "name",
            "cls": null,
            "width": "25%"
        }, {
            "title": locale.get({lang: "automat_site_name"}),
            "dataIndex": "siteName",
            "cls": null,
            "width": "25%"
        }, {
            "title": locale.get({lang: "automat_line"}),
            "dataIndex": "lineName",
            "cls": null,
            "width": "25%"
        }, {
    		"title" : "",
    		"dataIndex" : "id",
    		"cls" : "_id" + " " + "hide"
    	} ];

    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(html);
            this.display = 30;
            this.pageDisplay = 30;
            this.deviceChoose = [];
            this.deviceLists = options.deviceLists;
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
            this.getSelectedResources();
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
        	var self=this;
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
                    	var deviceid = data._id;
                        var but = $(tr).find('a').attr('id');
                        if(self.deviceLists.indexOf(deviceid) != -1){
                        	self.deviceChoose.push(but); 
                        }     
                    },
                    scope: this
                }
            });

            this.setDataTable();
        },
        setDataTable: function() {
            this.loadTableData(30, 0);
        }, 
        loadTableData: function(limit, cursor) {
            cloud.util.mask("#device_list_table");
            var self = this;
            
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
            
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            Service.getLinesByUserId(userId,function(linedata){
            	 var lineIds=[];
                 if(linedata.result && linedata.result.length>0){
	    			  for(var i=0;i<linedata.result.length;i++){
	    				  lineIds.push(linedata.result[i]._id);
	    			  }
                 }
                 
                 if(linedata!=null){
                	 if(userline.length == 0){ 
                    	 userline = lineIds;
                     }
                 }else{
                	 userline=[];
                 }
                 self.searchData = {
                         "siteName": siteName,
                         "assetId": assetId,
                         "lineId": userline,
                         "online":"0"
                  };
	             Service.getAllAutomatsByPage(self.searchData, limit, cursor, function(data) {
	                 var total = data.result.length;
	                 self.pageRecordTotal = total;
	                 self.totalCount = data.result.length;
	                 self.listTable.render(data.result);
	                 self._renderpage(data, 1);
	                 var deviceChooseLen = self.deviceChoose.length;
                     for(var m=0;m<deviceChooseLen;m++){
                     	$("#"+self.deviceChoose[m]).click();
                     }
	                 cloud.util.unmask("#device_list_table");
	             }, self);
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
                    query: function() {
                        self.loadTableData($(".paging-limit-select").val(), 0);
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
        }
       
    });
    return list;
});