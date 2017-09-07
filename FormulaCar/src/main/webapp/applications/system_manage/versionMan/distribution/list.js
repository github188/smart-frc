define(function(require) {
	var cloud = require("cloud/base/cloud");
	var Common = require("../../../../common/js/common");
	var html = require("text!./list.html");
	require("cloud/lib/plugin/jquery-ui");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var validator = require("cloud/components/validator");
	var Service = require("../../service");
	var NoticeBar = require("./notice-bar");
	var versionDistributionMan = require("./distributionMan/distributionMan-window");
	var columns = [{
		"title":locale.get({lang:"version_allot_name"}),//版本分组名称
		"dataIndex": "name",
		"cls": null,
		"width": "20%"
	},{
		"title":locale.get({lang:"version_description"}),//版本描述
		"dataIndex": "desc",
		"cls": null,
		"width": "20%"
	},{
		"title":locale.get({lang:"organization_name"}),//机构简称
		"dataIndex": "oName",
		"cls": null,
		"width": "20%"
	},{
		"title":locale.get({lang:"version_model"}),//机型
		"dataIndex": "versionmodel",
		"cls": null,
		"width": "20%",
		render:venderName
	},{
		"title":locale.get({lang:"version_number"}),//版本号
		"dataIndex": "version",
		"cls": null,
		"width": "20%"
	},{
		"title":locale.get({lang:"execute_name"}),//执行机构
		"dataIndex": "executeOName",
		"cls": null,
		"width": "20%"
	},{
		"title":locale.get({lang:"create_time"}),
		"dataIndex":"createTime",
		"cls": null,
		"width": "20%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
			
		}
	}];
	function venderName(value, type) {
        var display = "";
        if ("display" == type) {
            
        	display = Common.getLangVender(value);
            return display;
        } else {
            return value;
        }
    }
	var list = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
					bar : {
						id : "versionDis_list_bar",
						"class" : null
					},
				    table : {
					    id : "versionDis_list_table",
					    "class" : null
				    },
				    paging : {
					    id : "versionDis_list_paging",
					    "class" : null
				    }
			};
			this.render();
		},
		render:function(){
			this._renderHtml();
			this._renderTable();
			this._renderNoticeBar();
		},
		_renderHtml : function() {
			this.element.html(html);
		},
		stripscript:function(s){ 
		    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]") 
		    var rs = ""; 
		    for (var i = 0; i < s.length; i++) { 
		      rs = rs+s.substr(i, 1).replace(pattern, ''); 
		    } 
		    return rs; 
		},
		_renderTable : function() {
			this.listTable = new Table({
				selector : "#versionDis_list_table",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "full",
				events : {
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
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			cloud.util.mask("#versionDis_list_table");
			var self = this;
			var name = $("#name").val();
        	if(name){
        		name = self.stripscript(name);
        		self.searchData = {
        				"oName":name
        			};
        	}else{
        		self.searchData = {
        			};
        	}
			
			Service.getVersionDistributionInfo(self.searchData,cursor, limit,function(data) {
				self.datas = data.result;
				var total = data.total;
				this.totalCount = data.result.length;
		        data.total = total;
		        self.listTable.render(data.result);
		        self._renderpage(data, 1);
		        cloud.util.unmask("#versionDis_list_table");
			});
		},
		 _renderpage:function(data, start){
	        	var self = this;
	        	if(this.page){
	        		this.page.reset(data);
	        	}else{
	        		this.page = new Paging({
	        			selector : $("#versionDis_list_paging"),
	        			data:data,
	    				current:1,
	    				total:data.total,
	    				limit:this.pageDisplay,
	        			requestData:function(options,callback){
	        				cloud.util.mask("#versionDis_list_table");
	        				Service.getVersionDistributionInfo(self.searchData,options.cursor, options.limit,function(data){
   							   callback(data);
   							cloud.util.unmask("#versionDis_list_table");
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
					selector : "#versionDis_list_bar",
					events : {
						  query: function(){
							  self.loadTableData($(".paging-limit-select").val(),0);
						  },
						  add:function(){
							  if (this.addVersion) {
		                            this.addVersion.destroy();
		                        }
		                      this.addVersion = new versionDistributionMan({
		                            selector: "body",
		                            events: {
		                                "getVersionList": function() {
		                                	self.loadTableData($(".paging-limit-select").val(),0);
		                                }
		                            }
		                      });
						  },
						  modify:function(){
							    var selectedResouces = self.getSelectedResources();
		                        if (selectedResouces.length == 0) {
		                            dialog.render({lang: "please_select_at_least_one_config_item"});
		                        } else if (selectedResouces.length >= 2) {
		                            dialog.render({lang: "select_one_gateway"});
		                        } else {
		                        	var _id = selectedResouces[0]._id;
		                        	if (this.modifyPro) {
		                                this.modifyPro.destroy();
		                            }
		                        	var apps = selectedResouces[0].apps;
		                            this.modifyPro = new versionDistributionMan({
		                                selector: "body",
		                                id: _id,
		                                appsA:apps,
		                                events: {
		                                    "getVersionList": function() {
		                                    	self.loadTableData($(".paging-limit-select").val(),0);
		                                    }
		                                }
		                            });
		                        }
						  },
						  drop:function(){
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
		                                                Service.deleteVersionDistribution(_id, function(data) {
		                                                });
		                                            }
		                                            self.loadTableData($(".paging-limit-select").val(),0);
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