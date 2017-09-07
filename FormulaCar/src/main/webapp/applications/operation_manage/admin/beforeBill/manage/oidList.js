define(function(require) {
    var cloud = require("cloud/base/cloud");
    require("cloud/base/fixTableHeader");
    var winHtml = require("text!./oidList.html");
    require("cloud/lib/plugin/jquery-ui");
    var _Window = require("cloud/components/window");
    var NoticeBar = require("./win-notice-bar");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Paging = require("cloud/components/paging");
    var Button = require("cloud/components/button");
    var Table = require("cloud/components/table");
    var validator = require("cloud/components/validator"); 
    var Service = require("../service");
    var columns = [{
		"title":"公司简称",
		"dataIndex": "name",
		"cls": null,
		"width": "20%"
	},
	{
		"title":"公司全称",
		"dataIndex": "website",
		"cls": null,
		"width": "20%"
	},{
		"title":"用户名",
		"dataIndex":"creator",
		"cls": null,
		"width": "10%"
	},
	{
		"title":locale.get({lang:"email"}),
		"dataIndex":"email",
		"cls": null,
		"width": "20%"
	},{
		"title":"销售员",
		"dataIndex":"fax",
		"cls": null,
		"width": "20%",
		render: function (data) {
			if(data){
				return data.split("***")[1];
			}else{
				return data;
			}
		 }
	},{
		"title":"付费方式",
		"dataIndex":"payStyle",
		"cls": null,
		"width": "10%",
		render: function (data) {
			if(data){
				if(data == 1){
					return "后付费";
				}else if(data == 2){
					return "预付费";
				}
				
			}else{
				return "后付费";
			}
		 }
	}];
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
    				bar : {
    					id : "oid_list_bar",
    					"class" : null
    			    },
    				table : {
    					id : "oid_list_table",
    					"class" : null
    				},
    				paging : {
    					id : "oid_list_paging",
    					"class" : null
    				}
    		};
            this._renderWindow();
            locale.render({element:this.element});
          
        },
        _renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.window = new _Window({
				container: "body",
				title: "机构信息",
				top: "center",
				left: "center",
				height:640,
				width: 920,
				mask: true,
				drag:true,
				content: winHtml,
				events: {
					"onClose": function() {
							this.window.destroy();
							cloud.util.unmask();
					},
					scope: this
				}
			});
			 this.window.show();	
			this.render();
		
		},        
        render: function() {
            this._renderTable();
            this._renderNoticeBar();
			var height = $("#oid_list_table").height()+"px";
		    $("#oid_list_table-table").freezeHeader({ 'height': height });
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
            var self = this;
            this.listTable = new Table({
                selector: "#"+self.elements.table.id,
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
            this.loadData(30,0);
        },
        loadData: function(limit,cursor) {
            var self = this;
            cloud.util.mask("#"+self.elements.table.id);
            var pageDisplay = self.display;

            var name = $("#name").val();
        	var assetIds = $("#assetIds").val();
        	var email = $("#email").val();
            self.searchData={
        				name:name,
        				email:email,
        				assetIds:assetIds,
        				payStyle:2
            };
            
            Service.getAllOid(self.searchData,limit,cursor,function(data){
				var total = data.total;
				this.totalCount = data.result.length;
		        data.total = total;
		        self.listTable.render(data.result);
		        self._renderpage(data, 1);
		        cloud.util.unmask("#oid_list_table");
			});
        },
        _renderpage: function(data, start) {
            var self = this;
            if (this.page) {
                this.page.reset(data);
            } else {
                this.page = new Paging({
                    selector: "#oid_list_paging",
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                    	Service.getAllOid(self.searchData, options.limit,options.cursor,function(data){
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
                selector: "#"+self.elements.bar.id,
                events: {
                    query: function() {
                    	self.loadData($(".paging-limit-select").val(),0);
                    },
                    introduced: function() {
                        var selectedResouces = self.getSelectedResources();
                        if (selectedResouces.length === 0) {
                            dialog.render({lang: "please_select_at_least_one_config_item"});
                        } else {
                            var name = selectedResouces[0].name;
                            var fullName = selectedResouces[0].website;
                                                
                            self.fire("getone",name,fullName); 
                            self.window.destroy();
                        }
                    }
                }
            });
        },
        getSelectedResources: function() {
            var self = this;
            var selectedRes = $A();
            self.listTable && self.listTable.getSelectedRows().each(function(row) {
                selectedRes.push(self.listTable.getData(row));
            });
            return selectedRes;
        },
        destroy: function() {
            if (this.window) {
                this.window.destroy();
            } else {
                this.window = null;
            }
        }
    });
    return list;
});