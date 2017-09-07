define(function(require) {
    require("cloud/base/cloud");
    require("cloud/base/fixTableHeader");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./list.html");
    var Service = require("../service");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    require("cloud/lib/plugin/jquery.multiselect");
   
    var columns = [{
            "title": "取货码",
            "dataIndex": "code",
            "cls": null,
            "width": "25%"
        }, {
            "title": "售货机编号",
            "dataIndex": "assetId",
            "cls": null,
            "width": "25%"
        }, {
            "title": "商品名称",
            "dataIndex": "goodsName",
            "cls": null,
            "width": "25%"
        },{
            "title": "取货时间",
            "dataIndex": "useTime",
            "cls": null,
            "width": "25%"
        }];

    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(html);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
                table: {
                    id: "tcode_list_table",
                    "class": null
                },
                paging: {
                    id: "tcode_list_paging",
                    "class": null
                }
            };
            this._render();
        },
        _render: function() {
            this._renderTable();
            this.getSelectedResources();
            
           // $("#codeList").css("height",$("#tgcode_content").height()-182);
            $("#tcode_list_paging").css("width",$("#tcode_list_table").width());
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
                selector: "#tcode_list_table",
                columns: columns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
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
            var height = $("#tcode_list_table").height()+"px";
	        $("#tcode_list_table-table").freezeHeader({ 'height': height })
            this.setDataTable();
        },
        setDataTable: function() {
            //this.loadTableData(30, 0);
        }, 
        loadTableData: function(limit, cursor) {
            var self = this;
            cloud.util.mask("#tcode_list");
            Service.getBillInfoById(self.id,limit, cursor,function(data){
            	 var total = data.result.length;
   				 self.pageRecordTotal = total;
   	        	 self.totalCount = data.result.length;
           		 self.listTable.render(data.result);
   	        	 self._renderpage(data, 1);
   	        	 cloud.util.unmask("#tcode_list");
            });
        },
        _renderpage: function(data, start) {
            var self = this;
            if (self.page) {
                self.page.reset(data);
            } else {
                self.page = new Paging({
                    selector: $("#tcode_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                    	cloud.util.mask("#tcode_list");
        				Service.getBillInfoById(self.id, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   cloud.util.unmask("#tcode_list");
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