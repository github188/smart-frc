define(function(require){
	require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var Service = require("../discount/service");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
    var discountMan = require("./perferenceMan/perferenceMan-window.js");
	
	var columns = [ {
		"title":locale.get({lang:"name1"}),//名称
		"dataIndex" : "name",
		"cls" : null,
		"width" : "20%"
	},{
		"title":locale.get({lang:"discount_percentages"}),//折扣比例
		"dataIndex" : "basicConfig",
		"cls" : null,
		"width" : "15%",
		render:function(data){
			if(data){
				return data.coupon/100+locale.get({lang:"discount_percent_off"});
			}
		}
	},{                                             
		"title":locale.get({lang:"discount_threshold_amount"}),//折扣门槛金额
		"dataIndex" : "basicConfig",
		"cls" : null,
		"width" : "20%",
		render:function(data){
			if(data){
				return  locale.get({lang:"orders_over"})+data.threshold/100+locale.get({lang:"yuan"});
			}
		}
	},{                                             //开始时间
		"title":locale.get({lang:"start_time"}),
		"dataIndex" : "basicConfig",
		"cls" : null,
		"width" : "15%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data.startTime), "yyyy-MM-dd");
			}
		}
	},{                                             //结束时间
		"title":locale.get({lang:"end_time"}),
		"dataIndex" : "basicConfig",
		"cls" : null,
		"width" : "15%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data.endTime), "yyyy-MM-dd");
			}
		}
	},{                                             //创建时间
		"title":locale.get({lang:"create_time"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "15%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
		}
	}, {
        "title": "",
        "dataIndex": "id",
        "cls": "_id" + " " + "hide"
    }];
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
	        this.element.html(html);
	        this.status =options.status;
	        this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "discount_perference_bar",
					"class" : null
				},
				table : {
					id : "discount_perference_table",
					"class" : null
				},
				paging : {
					id : "discount_perference_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			
			$("#discount_perference_list").css("width",$(".wrap").width());
			$("#discount_perference_paging").css("width",$(".wrap").width());
			$("#discount_perference_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			var listHeight = $("#discount_perference_list").height();
		    var barHeight = $("#discount_perference_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#discount_perference_table").css("height",tableHeight);
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
				selector : "#discount_perference_table",
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
			var height = $("#discount_perference_table").height()+"px";
	        $("#discount_perference_table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			cloud.util.mask("#discount_perference_table");
        	var self = this;
        	var name = $("#name").val();
        	if(name){
        		name = self.stripscript(name);
        	}
        	self.searchData = {};
        	if(name){
        		self.searchData.name = name;
        	}
        	self.searchData.status = self.status;
        	self.searchData.type = 2;//活动类型 1、立减 2、折扣
			Service.getAllDiscount(self.searchData,limit,cursor,function(data){
				 var total = data.result.length;
				 self.pageRecordTotal = total;
	        	 self.totalCount = data.result.length;
        		 self.listTable.render(data.result);
	        	 self._renderpage(data, 1);
	        	 cloud.util.unmask("#discount_perference_table");
			 }, self);
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#discount_perference_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				Service.getAllDiscount(self.searchData, options.limit,options.cursor,function(data){
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
        _renderNoticeBar:function(){
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#discount_perference_bar",
				status:self.status,
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  },
					 
					  add:function(){
						    if (this.addDiscount) {
	                            this.addDiscount.destroy();
	                        }
	                        this.addDiscount = new discountMan({
	                            selector: "body",
	                            events: {
	                                "getDiscountList": function() {
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
	                        	 if (this.updateDiscount) {
	 	                            this.updateDiscount.destroy();
	 	                        }
	 	                        this.updateDiscount = new discountMan({
	 	                            selector: "body",
	 	                            discountId:_id,
	 	                            events: {
	 	                                "getDiscountList": function() {
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
	                                                Service.deleteDiscount(_id, function(data) {
	                                                	self.loadTableData($(".paging-limit-select").val(),0);
	                                                });
	                                                
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
					  },
					  stop:function(){
						    var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length === 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else {
	                            dialog.render({
	                                lang: "affirm_pause",
	                                buttons: [{
	                                        lang: "affirm",
	                                        click: function() {
	                                            for (var i = 0; i < selectedResouces.length; i++) {
	                                                var _id = selectedResouces[i]._id;
	                                                var finalData={
	                                                		status:3,
	                                                		type:2
	                                                }
	                                                Service.updateDiscount(finalData,_id,function(data){
	                                                	self.loadTableData($(".paging-limit-select").val(),0);
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
					  },
					  active:function(){
						    var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length === 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else {
	                            dialog.render({
	                                lang: "affirm_recover",
	                                buttons: [{
	                                        lang: "affirm",
	                                        click: function() {
	                                            for (var i = 0; i < selectedResouces.length; i++) {
	                                                var _id = selectedResouces[i]._id;
	                                                var finalData={
	                                                		status:2,
	                                                		type:2
	                                                }
	                                                Service.updateDiscount(finalData,_id,function(data){
	                                                	self.loadTableData($(".paging-limit-select").val(),0);
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