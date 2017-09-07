define(function(require) {
    var cloud = require("cloud/base/cloud");
    var winHtml = require("text!./introducedModel-window.html");
    require("cloud/lib/plugin/jquery-ui");
    var _Window = require("cloud/components/window");
    var NoticeBar = require("./notice-bar");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Paging = require("cloud/components/paging");
    var Button = require("cloud/components/button");
    var Table = require("cloud/components/table");
    var validator = require("cloud/components/validator"); 
    var Service = require("../../../service");
    var columns = [ {
		"title":locale.get({lang:"product_manufacturer"}),//厂家
		"dataIndex" : "vender",
		"cls" : null,
		"width" : "25%"
	},{
		"title":locale.get({lang:"device_shelf_type"}),//类型
		"dataIndex" : "machineType",
		"cls" : null,
		"width" : "25%",
		 render: machineType
	},{
		"title":locale.get({lang:"purchase_model"}),//型号
		"dataIndex" : "name",
		"cls" : null,
		"width" : "25%"
	},{                                             //创建时间
		"title":locale.get({lang:"create_time"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "25%",
		render:function(data, type, row){
			return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
		}
	}];
    function machineType(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 1:
                    display = locale.get({lang: "drink_machine"});
                    break;
                case 2:
                    display = locale.get({lang: "spring_machine"});
                    break;
                case 3:
                    display = locale.get({lang: "grid_machine"});
                    break;
                default:
                    break;
            }
            return display;
        } else {
            return value;
        }
    }
    var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
    var eurl = "mapi";
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
                bar: {
                    id: "model_win_list_bar",
                    "class": null
                },
                table: {
                    id: "model_win_list_table",
                    "class": null
                },
                paging: {
                    id: "model_win_list_paging",
                    "class": null
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
				title: locale.get({lang:"introduced"}),
				top: "center",
				left: "center",
				height:600,
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
            this.loadData();
        },
        loadData : function(limit,cursor) {
			cloud.util.mask("#model_win_list_table");
        	var self = this;
        	var search = $("#searchs").val();
            var searchValue = $("#searchValues").val();

            if (search) {

            } else {
                search = 0;
            }
            if (searchValue) {
                searchValue = self.stripscript(searchValue);
            }
			Service.getAllModel(eurl,limit,cursor,search,searchValue,function(data){
				 var total = data.result.length;
				 self.pageRecordTotal = total;
	        	 self.totalCount = data.result.length;
        		 self.listTable.render(data.result);
	        	 self._renderpage(data, 1);
	        	 cloud.util.unmask("#model_win_list_table");
			 }, self);
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#model_win_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#model_win_list_table");
        				var search = $("#searchs").val();
                        var searchValue = $("#searchValues").val();
                        if (search) {

                        } else {
                            search = 0;
                        }
                        if (searchValue) {
                            searchValue = self.stripscript(searchValue);
                        }
        				
        				Service.getAllModel(eurl,options.limit,options.cursor,search,searchValue,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   cloud.util.unmask("#model_win_list_table");
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
        _renderNoticeBar:function(){
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#model_win_list_bar",
				events : {
					query: function(search, searchValue) {//查询
                        cloud.util.mask("#model_win_list_table");
                        var pageDisplay = self.display;
                        if (searchValue) {
                            searchValue = self.stripscript(searchValue);
                        }     
                        Service.getAllModel(eurl,30, 0, search, searchValue, function(data) {
                        	 var total = data.result.length;
	           				 self.pageRecordTotal = total;
	           	        	 self.totalCount = data.result.length;
	                   		 self.listTable.render(data.result);
	           	        	 self._renderpage(data, 1);
	           	        	 cloud.util.unmask("#model_win_list_table");
                        });
                    },
                    introduced:function(){
                    	var selectedResouces = self.getSelectedResources();
                    	if (selectedResouces.length === 0) {
                            dialog.render({lang: "please_select_at_least_one_config_item"});
                        } else {
                            dialog.render({
                                lang: "affirm_introduced",
                                buttons: [{
                                        lang: "affirm",
                                        click: function() {
                                                for (var i = 0; i < selectedResouces.length; i++) {
                                                    var _id = selectedResouces[i]._id; 
                                                    Service.introducedModels(_id,function(data) {
                                                        
                                                    },self);
                                                } 
                                                dialog.render({lang: "introducedsuccessful"}); 
                                                dialog.close();
                                                self.fire("getModelList"); 
                                                self.window.destroy();
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
            var rows = self.listTable.getSelectedRows();
            var selectedRes = new Array();
            rows.each(function(row) {
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