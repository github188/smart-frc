define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	var Service = require("../../service");
	var winHtml = require("text!./versionApp.html");
	var NoticeBar = require("./versionApp-notice-bar");
	var AppVersion = require("./upload/app");
	var columns = [{
		"title":locale.get({lang:"version_number"}),
		"dataIndex": "version",
		"cls": null,
		"width": "80%"
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
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.data = options.data;
			this.elements = {
	                bar: {
	                    id: "versionApp_list_bar",
	                    "class": null
	                },
	                table: {
	                    id: "versionApp_list_table",
	                    "class": null
	                }
	            };
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.verwindow = new _Window({
				container: "body",
				title: locale.get({lang:"versions_set"}),
				top: "center",
				left: "center",
				height:700,
				width: 1000,
				mask: true,
				drag:true,
				content: winHtml,
				events: {
					"onClose": function() {
							this.verwindow.destroy();
							cloud.util.unmask();
							self.fire("getVersionList");
					},
					scope: this
				}
			});
			this.verwindow.show();	
			this._renderTable();
			this._renderNoticeBar();
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
	    	this.listTable.render(this.data.versions);
	    },
	    _renderNoticeBar:function(){
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#versionApp_list_bar",
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  },
					  add:function(){
						  if (this.appVersion) {
	                            this.appVersion.destroy();
	                        }
	                      this.appVersion = new AppVersion({
	                            selector: "body",
	                            data:self.data,
	                            events: {
	                                "getVersionList": function(versions) {
	                                	self.data.versions = versions;
	                                	self.listTable.render(versions);
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
	                        	var version = selectedResouces[0].version;
	                        	if (this.modifyPro) {
	                                this.modifyPro.destroy();
	                            }
	                            this.modifyPro = new AppVersion({
	                                selector: "body",
	                                data: self.data,
	                                version:version,
	                                events: {
	                                    "getVersionList": function(versions) {
	                                    	self.data.versions = versions;
	                                    	self.listTable.render(versions);
	                                    }
	                                }
	                            });
	                        }
					  },
					  drop:function(){
						  var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length === 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else if (selectedResouces.length >= 2) {
	                            dialog.render({lang: "select_one_gateway"});
	                        } else {
	                            dialog.render({
	                                lang: "affirm_delete",
	                                buttons: [{
	                                        lang: "affirm",
	                                        click: function() {
	                                        	var version = selectedResouces[0].version;
	                                        	if(self.data && self.data.versions && self.data.versions.length > 0){
	                                        		for(var i = 0;i<self.data.versions.length;i++){
	                                        			if(self.data.versions[i].version == version){
	                                        				 var versions=[];
	                                                		 versions.push(self.data.versions[i]);
	                                                		 var versiondata={
	                                                        	 versions:versions,
	                                                	 	     type:3
	                                                	 	 }
	                                                		 Service.updateVersion(self.data._id,versiondata,function(data){
	                                                			 self.listTable.render(data.result.versions);
	                                                		 });
	                                        			}
	                                        		}
	                                        	}
	                                        	
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
        },  
		destroy:function(){
			if(this.verwindow){
				this.verwindow.destroy();
			}else{
				this.verwindow = null;
			}
		}
	});
	return Window;
});