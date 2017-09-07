define(function(require) {
    var cloud = require("cloud/base/cloud");
    var html = require("text!./siteType-south-right.html");
    require("cloud/lib/plugin/jquery-ui");
    var NoticeBar = require("./siteType-notice-bar");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Paging = require("cloud/components/paging");
    var Button = require("cloud/components/button");
    var Table = require("cloud/components/table");
    var AddSiteType = require("./siteType-window/addsiteType-window");
 
    var Service = require("./service.js");
    var columns = [{
            "title": locale.get({lang: "site_type_name"}),
            "dataIndex": "name",
            "cls": null,
            "width": "60%"
        },{                                             //创建时间
    		"title":locale.get({lang:"create_time"}),
    		"dataIndex" : "createTime",
    		"cls" : null,
    		"width" : "40%",
    		render:function(data, type, row){
    			return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
    		}
    	}, {
            "title": "",
            "dataIndex": "id",
            "cls": "_id" + " " + "hide"
        }];

    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
            		
                bar: {
                    id: "site_type_list_bar",
                    "class": null
                },
                table: {
                    id: "site_type_list_table",
                    "class": null
                },
                paging: {
                    id: "site_type_list_paging",
                    "class": null
                }
            };
            this.render();
        },
        render: function() {
            this._renderHtml();
            this._renderTable();
            this._renderNoticeBar();


        },
        _renderHtml: function() {
            this.element.html(html);
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
                selector:"#"+self.elements.table.id,
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
            cloud.util.mask("#site_type_list_table");
            var self = this;
            var sitetypename = $("#siteTypeName").val();
        	if(sitetypename){
        		sitetypename = self.stripscript(sitetypename);
        	}
        	self.searchData = {
    				"name":sitetypename,
    			};
            Service.getSiteTypeList(limit, cursor,self.searchData, function(data) {
				 var total = data.result.length;
				 self.pageRecordTotal = total;
	        	 self.totalCount = data.result.length;
        		 self.listTable.render(data.result);
	        	 self._renderpage(data, 1);
                cloud.util.unmask("#site_type_list_table");
            });
        },
        _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
	       			selector : $("#site_type_list_paging"),
	       			data:data,
	   				current:1,
	   				total:data.total,
	   				limit:this.pageDisplay,
	       			requestData:function(options,callback){
	       				//var sitetypename = $("#siteTypeName").val();
	       				Service.getSiteTypeList(options.limit,options.cursor,self.searchData,function(data){
	       				       self.pageRecordTotal = data.total - data.cursor;
							   callback(data);
	       				});
	       			},
	       			turn:function(data, nowPage){
	       			    self.totalCount = data.result.length;
	       			    self.listTable.clearTableData();
	       			    self.listTable.render(data.result);
	       				self.nowPage = parseInt(nowPage);
	       			},
	       			events : {
	       			    "displayChanged" : function(display){
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
                    query: function() {//查询
                    	 self.loadData($(".paging-limit-select").val(),0);
                    },
                    add: function() {//添加
                        if (this.addSiteType) {
                            this.addSiteType.destroy();
                        }
                        this.addSiteType = new AddSiteType({
                            selector: "body",
                            events: {
                                "getSiteTypeList": function() {
                                    self.loadData($(".paging-limit-select").val(),0);
                                }
                            }
                        });
                    },
                    modify: function() {//修改
                        var selectedResouces = self.getSelectedResources();
                        if (selectedResouces.length === 0) {
                            dialog.render({lang: "please_select_at_least_one_config_item"});
                        } else if (selectedResouces.length >= 2) {
                            dialog.render({lang: "select_one_gateway"});
                        } else {
                            var _id = selectedResouces[0]._id;
                            if (this.modifySiteType) {
                                this.modifySiteType.destroy();
                            }
                            this.modifySiteType = new AddSiteType({
                                selector: "body",
                                id: _id,
                                events: {
                                    "getSiteTypeList": function() {
                                        self.loadData($(".paging-limit-select").val(),0);
                                    }
                                }
                            });
                        }
                    },
                    drop: function() {//删除
                        var selectedResouces = self.getSelectedResources();
                        if (selectedResouces.length === 0) {
                            dialog.render({lang: "please_select_at_least_one_config_item"});
                        } else {
                            dialog.render({
                                lang: "affirm_delete",
                                buttons: [{
                                        lang: "affirm",
                                        click: function() {
                                            for (var i = 0; i < selectedResouces.length; i++) {
                                                var _id = selectedResouces[i]._id;

                                                Service.deleteSiteTypeById(_id, function(data) {

                                                });
                                            }
                                            self.loadData($(".paging-limit-select").val(),0);
                                            dialog.render({lang: "deletesuccessful"});
                                            dialog.close();

                                        }
                                    },
                                    {
                                        lang: "cancel",
                                        click: function() {
                                            dialog.close();
                                        }
                                    }]
                            });
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
        }
    });
    return list;
});
