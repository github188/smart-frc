define(function(require){
	require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var Service = require("./service");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	//var addMedias = require("./update/medias-window");
	var columns = [ {
		"title":locale.get({lang:"automat_no1"}),//售货机编号
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "15%"
	}/*,{
		"title":locale.get({lang:"automat_name"}),//售货机名称
		"dataIndex" : "name",
		"cls" : null,
		"width" : "20%"
    }*/,{
		"title":locale.get({lang:"automat_site_name"}),//点位名称
		"dataIndex" : "siteName",
		"cls" : null,
		"width" : "15%"
	}/*,{
		"title":locale.get({lang:"automat_line"}),//线路
		"dataIndex" : "lineName",
		"cls" : null,
		"width" : "20%"
    }*/,{                                           
		"title":locale.get({lang:"ad_filename"}),  //文件名称
		"dataIndex" : "fileName",
		"cls" : null,
		"width" : "25%"
	},{                                           
		"title":locale.get({lang:"absolute_path"}),  //文件路径
		"dataIndex" : "path",
		"cls" : null,
		"width" : "20%"
	},{                                           
		"title":locale.get({lang:"action"}),  //动作
		"dataIndex" : "action",
		"cls" : null,
		"width" : "10%",
		render:function(data, type, row){
			var display = "";
			if(data){
				if(data == 1){//开始
					display = locale.get({lang: "action_start"});
				}else if(data == 2){//结束
					display = locale.get({lang: "action_end"});
				}else{
					return display;
				}
			}
			return display;
		}
	},{                                           
		"title":locale.get({lang:"report_time"}),  //时间
		"dataIndex" : "time",
		"cls" : null,
		"width" : "20%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
		}
	},{                                           
		"title":locale.get({lang:"broadcast_duration"}),  //时长
		"dataIndex" : "duration",
		"cls" : null,
		"width" : "15%",
		render:function(data, type, row){
			if(data){
				if(data == 0){
					return "";
				}else{
					var display = "";
					var day = Math.floor(data / 86400);  
					var hour = Math.floor((data - day*86400) / 3600);  
					var minute = Math.floor((data - day*86400 - hour*3600) / 60);  
					var second = (data - day*86400 - hour*3600 - minute * 60);
					var arry = [day, hour, minute, second];
					var unit = ["day", "hour", "minute", "second"];
					//去除高位0，直到不是0为止
					var flag = false;
					for(var i =0; i< 4; i++){
						if (arry[i] > 0 || flag) {
							display += arry[i] + locale.get({lang:unit[i]});
							flag = true;
						}else{
							flag = false;
						}
					}
					return display;
				}
			}
		}
	},{                                           
		"title":locale.get({lang:"create_time"}),  //创建时间
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "20%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
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
					id : "broadcast_list_bar",
					"class" : null
				},
				table : {
					id : "broadcast_list_table",
					"class" : null
				},
				paging : {
					id : "broadcast_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			
			$("#broadcast_list").css("width",$(".wrap").width());
			$("#broadcast_list_paging").css("width",$(".wrap").width());
			
			$("#broadcast_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#broadcast_list").height();
		    var barHeight = $("#broadcast_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#broadcast_list_table").css("height",tableHeight);
			
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
				selector : "#broadcast_list_table",
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
			var height = $("#broadcast_list_table").height()+"px";
	        $("#broadcast_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			cloud.util.mask("#broadcast_list_table");
        	var self = this;
            var assetSearch = $("#assetSearch").val();
        	
			self.searchData = {
				"assetId":assetSearch
			};
			Service.getBroadcastHistory(self.searchData,limit,cursor,function(data){
				 var total = data.result.length;
				 self.pageRecordTotal = total;
	        	 self.totalCount = data.result.length;
        		 self.listTable.render(data.result);
	        	 self._renderpage(data, 1);
	        	 cloud.util.unmask("#broadcast_list_table");
			 }, self);
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#broadcast_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#broadcast_list_table");
        				Service.getBroadcastHistory(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   cloud.util.unmask("#broadcast_list_table");
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
				selector : "#broadcast_list_bar",
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  }/*,
					  add:function(){
						    if (this.addMedias) {
	                            this.addMedias.destroy();
	                        }
	                        this.addMedias = new addMedias({
	                            selector: "body",
	                            events: {
	                                "getMediasList": function() {
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
	                        	var mediasId = selectedResouces[0]._id;
	                        	if (this.modifyMedias) {
		                            this.modifyMedias.destroy();
		                        }
	                        	 this.modifyMedias = new addMedias({
	 	                            selector: "body",
	 	                            mediasId:mediasId,//媒体库ID
	 	                            events: {
	 	                                "getMediasList": function() {
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
	                                                Service.deleteMedias(_id, function(data) {
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
					  }*/
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