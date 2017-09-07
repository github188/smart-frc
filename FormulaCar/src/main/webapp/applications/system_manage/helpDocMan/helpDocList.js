define(function(require){
	require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./helpDocList.html");
	var Service = require("../service");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var addFilesWin = require("./update/helpDocManage-win");
	var columns = [ {
		"title":"文件名称",
		"dataIndex" : "name",
		"cls" : null,
		"width" : "25%",
	},{
		"title":"描述",
		"dataIndex" : "description",
		"cls" : null,
		"width" : "25%"
	},{                                             //创建时间
		"title":locale.get({lang:"create_time"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "25%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
			
		}
	},{
        "title":"操作",
        "dataIndex": "operate",
        "width": "25%",
        render:function(data,type,row){
            return "<a id='"+row._id+"\'  href='http://mall.inhand.com.cn/helpdoc/"+row.filename+"\' class=\"cloud-button cloud-button-body cloud-button-text-only\" title=\"下载\" lang=\"text:download\"><span class=\"cloud-button-item cloud-button-text\" lang=\"text:config\">"+locale.get({lang:"download"})+"</span></a>"
            	
        }
    }];
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
	        this.element.html(html);
	        this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "helpdoc_list_bar",
					"class" : null
				},
				table : {
					id : "helpdoc_list_table",
					"class" : null
				},
				paging : {
					id : "helpdoc_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			$("#helpdoc_list").css("width",$(".wrap").width());
			$("#helpdoc_list_paging").css("width",$(".wrap").width());
			
			$("#helpdoc_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#helpdoc_list").height();
		    var barHeight = $("#helpdoc_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#helpdoc_list_table").css("height",tableHeight);
			    
			this._renderTable();
			this._renderNoticeBar();
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
				selector : "#helpdoc_list_table",
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
			var height = $("#helpdoc_list_table").height()+"px";
	        $("#helpdoc_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			cloud.util.mask("#helpdoc_list_table");
        	var self = this;
        	var name = $("#name").val();
            self.searchData = {
        	   "name":name
            };

            Service.getAllHelpDoc(self.searchData,limit,cursor,function(data){
   				 var total = data.result.length;
   				 self.pageRecordTotal = total;
   	        	 self.totalCount = data.result.length;
           		 self.listTable.render(data.result);
   	        	 self._renderpage(data, 1);
   	        	 cloud.util.unmask("#helpdoc_list_table");
  			 }, self);
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#helpdoc_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#helpdoc_list_table");
        				Service.getAllHelpDoc(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   cloud.util.unmask("#helpdoc_list_table");
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
				selector : "#helpdoc_list_bar",
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  },
					  upload:function(){
						  if (this.addFiles) {
	                            this.addFiles.destroy();
	                      }
	                      this.addFiles = new addFilesWin({
	                            selector: "body",
	                            events: {
	                                "getHelpDocList": function() {
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
	                            this.modifyPro = new addFilesWin({
	                                selector: "body",
	                                docId: _id,
	                                events: {
	                                    "getHelpDocList": function() {
	                                    	self.loadTableData($(".paging-limit-select").val(),0);
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
	                                                Service.deleteHelpDoc(_id, function(data) {
	                                                	self.loadTableData($(".paging-limit-select").val(),0);
	                                                    dialog.render({lang: "deletesuccessful"});
	                                                });
	                                            }
	                                            
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