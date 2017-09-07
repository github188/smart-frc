define(function(require) {
	var cloud = require("cloud/base/cloud");
	var html = require("text!./list.html");
	require("cloud/lib/plugin/jquery-ui");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var validator = require("cloud/components/validator");
	var Service = require("../../service");
	var NoticeBar = require("./notice-bar");
	var AddVersion = require("./versionMan-window");
	var VersionMan = require("./versionApp-window");
	var columns = [{
		"title":locale.get({lang:"version_allot_name"}),
		"dataIndex": "name",
		"cls": null,
		"width": "30%"
	},{
		"title":locale.get({lang:"create_time"}),
		"dataIndex":"createTime",
		"cls": null,
		"width": "25%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
			
		}
	},{
		"title":locale.get({lang:"update_time"}),
		"dataIndex":"updateTime",
		"cls": null,
		"width": "25%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
			
		}
	},{
        "title": locale.get({lang:"operate"}),
        "dataIndex": "name",
        "width": "20%",
        render:function(data,type,row){
            return "<a id='"+row._id+"\' class=\"cloud-button cloud-button-body cloud-button-text-only\" title=\"版本维护\" lang=\"text:versions_man\"><span class=\"cloud-button-item cloud-button-text\" lang=\"text:versions_man\">"+"版本维护"+"</span></a>"
        }
    }];
	var list = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
					bar : {
						id : "version_list_bar",
						"class" : null
					},
				    table : {
					    id : "version_list_table",
					    "class" : null
				    },
				    paging : {
					    id : "version_list_paging",
					    "class" : null
				    }
			};
			this.render();
		},
		render:function(){
			this._renderHtml();
			this._renderTable();
			this._renderNoticeBar();
			
			$("#version_list").css("height",($("#col_slide_main").height() - $(".main_hd").height()));
			$("#version_list_paging").css("width",$("#version_list_bar").width());
		    var listHeight = $("#version_list").height();
	        var barHeight = $("#version_list_bar").height();
		    var tableHeight=listHeight - barHeight*2;
		    $("#version_list_table").css("height",tableHeight);
		},
		_renderHtml : function() {
			this.element.html(html);
		},
		_bindBtnEvent:function(){
            var self = this;
            this.datas.each(function(one){
                $("#"+one._id).bind('click',function(e){
                	if (this.versionMan) {
                        this.versionMan.destroy();
                    }
                    this.versionMan = new VersionMan({
                        selector: "body",
                        data:one,
                        events: {
                            "getVersionList": function() {
                            	self.loadTableData($(".paging-limit-select").val(),0);
                            }
                        }
                    });
                });
            });
        },
		_renderTable : function() {
			this.listTable = new Table({
				selector : "#version_list_table",
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
						    this._bindBtnEvent();
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
			cloud.util.mask("#version_list_table");
			var self = this;
			Service.getVersionInfo(cursor, limit,function(data) {
				self.datas = data.result;
				var total = data.total;
				this.totalCount = data.result.length;
		        data.total = total;
		        self.listTable.render(data.result);
		        self._renderpage(data, 1);
		        cloud.util.unmask("#version_list_table");
			});
		},
		 _renderpage:function(data, start){
	        	var self = this;
	        	if(this.page){
	        		this.page.reset(data);
	        	}else{
	        		this.page = new Paging({
	        			selector : $("#version_list_paging"),
	        			data:data,
	    				current:1,
	    				total:data.total,
	    				limit:this.pageDisplay,
	        			requestData:function(options,callback){
	        				cloud.util.mask("#version_list_table");
	        				Service.getVersionInfo(options.cursor, options.limit,function(data){
   							   callback(data);
   							   cloud.util.unmask("#version_list_table");
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
					selector : "#version_list_bar",
					events : {
						  query: function(){
							  self.loadTableData($(".paging-limit-select").val(),0);
						  },
						  add:function(){
							  if (this.addVersion) {
		                            this.addVersion.destroy();
		                        }
		                      this.addVersion = new AddVersion({
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
		                            this.modifyPro = new AddVersion({
		                                selector: "body",
		                                id: _id,
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
		                                                Service.deleteVersion(_id, function(data) {
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