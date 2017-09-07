define(function(require) {
    require("cloud/base/cloud");
    require("cloud/base/fixTableHeader");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./deviceList.html");
    var Service = require("../service");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    require("cloud/lib/plugin/jquery.multiselect");
   
    var columns = [{
            "title": locale.get({lang: "automat_no1"}),
            "dataIndex": "assetId",
            "cls": null,
            "width": "30%"
        }, {
            "title": locale.get({lang: "bill_amount_payable"}),
            "dataIndex": "money",
            "cls": null,
            "width": "35%"
        }, {
            "title": locale.get({lang: "shelf_platformsalenum"}),
            "dataIndex": "sum",
            "cls": null,
            "width": "35%"
        }];

    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.id = options.id;
            this.element.html(html);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
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
            this.getSelectedResources();
            $("#device_list_paging").css("width",$("#device_list_table").width());
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
               // checkbox: "",
                events: {
                    onRowClick: function(data) { 
                        this.listTable.unselectAllRows();
                        var rows = this.listTable.getClickedRow();
                        this.listTable.selectRows(rows);
                    },
                    onRowRendered: function(tr, data, index) {
                        
                    },
                    scope: this
                }
            });
            var height = $("#device_list_table").height()+"px";
	        $("#device_list_table-table").freezeHeader({ 'height': height })
            this.setDataTable();
        },
        setDataTable: function() {
            this.loadTableData(30, 0);
        }, 
        loadTableData: function(limit, cursor) {
            var self = this;
            cloud.util.mask("#device_list");
            Service.getBillInfoById(self.id,limit, cursor,function(data){
            	 var total = data.result.length;
   				 self.pageRecordTotal = total;
   	        	 self.totalCount = data.result.length;
           		 self.listTable.render(data.result);
   	        	 self._renderpage(data, 1);
   	        	 cloud.util.unmask("#device_list");
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
                    	cloud.util.mask("#device_list");
        				Service.getBillInfoById(self.id, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   cloud.util.unmask("#device_list");
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