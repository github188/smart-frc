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

	var AddReplenishPlan = require("./add/addplan-window");
	var UpdateReplenishPlan = require("./update/updateplan-window");
	var SeePlan = require("./see/seeplan-window");
	var columns = [ {
		"title":locale.get({lang:"replenish_plan_number"}),//名称
		"dataIndex" : "number",
		"cls" : null,
		"width" : "20%"
	},{
		"title":locale.get({lang:"replenish_plan_executive_person"}),//
		"dataIndex" : "executivePerson",
		"cls" : null,
		"width" : "20%"
	},{                                             
		"title":locale.get({lang:"replenish_plan_create_person"}),
		"dataIndex" : "createPerson",
		"cls" : null,
		"width" : "20%"
	},{
		"title":locale.get({lang:"replenish_plan_complete_rate"}),//
		"dataIndex" : "completeRate",
		"cls" : null,
		"width" : "20%"
	},{
		"title":locale.get({lang:"state"}),//
		"dataIndex" : "status",
		"cls" : null,
		"width" : "20%",
		render:function(data, type, row){
			if(data == 1){
				return locale.get({lang:"complete"});
			}else{
				return locale.get({lang:"unfinished"});
			}
		}
		
	},{                                             //
		"title":locale.get({lang:"replenish_plan_create_time"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "20%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
		}
	},{                                             //
		"title":locale.get({lang:"replenish_plan_executive_time"}),
		"dataIndex" : "executiveTime",
		"cls" : null,
		"width" : "20%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd");
			}
		}
	},{                                             //
		"title":locale.get({lang:"replenish_plan_complete_time"}),
		"dataIndex" : "completeTime",
		"cls" : null,
		"width" : "20%",
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
	        this.display = 30;
			this.pageDisplay = 30;
			this.totalNum = 0;
			this.elements = {
				bar : {
					id : "replenishplan_list_bar",
					"class" : null
				},
				table : {
					id : "replenishplanry_list_table",
					"class" : null
				},
				paging : {
					id : "replenishplan_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			$("#replenishplan_list").css("width",$(".wrap").width());
			$("#replenishplan_list_paging").css("width",$(".wrap").width());
			
			$("#replenishplan_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#replenishplan_list").height();
		    var barHeight = $("#replenishplan_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#replenishplan_list_table").css("height",tableHeight);
			

		    
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
				selector : "#replenishplan_list_table",
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
			var height = $("#replenishplan_list_table").height()+"px";
	        $("#replenishplan_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			cloud.util.mask("#replenishplan_list_table");
        	var self = this;
        	var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
        	var roleType = permission.getInfo().roleType;
            var personId = "";
        	
            if(roleType != 51){
            	personId = userId;
            }
            var name = $("#name").val();
        	if(name){
        		name = self.stripscript(name);
        	}
        	
			self.searchData = {
				"name":name,
				"personId":personId
			};

        	Service.getAllReplenishPlanV2(self.searchData,limit,cursor,function(data){
			 var total = data.result.length;
			 
			 self.totalNum = total;
			 
			 self.pageRecordTotal = total;
        	 self.totalCount = data.result.length;
       		 self.listTable.render(data.result);
        	 self._renderpage(data, 1);
        	 cloud.util.unmask("#replenishplan_list_table");
		    }, self);
                
			
			
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#replenishplan_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#replenishplan_list_table");
        				Service.getAllReplenishPlanV2(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   cloud.util.unmask("#replenishplan_list_table");
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
				selector : "#replenishplan_list_bar",
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  },
					 
					  add:function(){
						    if (this.addReplenishPlan) {
	                            this.addReplenishPlan.destroy();
	                        }
	                        this.addReplenishPlan = new AddReplenishPlan({
	                            selector: "body",
	                            number:self.totalNum,
	                            events: {
	                                "getplanList": function() {
	                                	self.loadTableData($(".paging-limit-select").val(),0);
	                                }
	                            }
	                        });
					  },
					  see: function() {
	                        var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length === 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                            return;
	                        } else if (selectedResouces.length >= 2) {
	                            dialog.render({lang: "select_one_gateway"});
	                            return;
	                        } else {
	                            var _id = selectedResouces[0]._id;
	                            var assetId=selectedResouces[0].assetId;
	                            if (this.seePlan) {
	                                this.seePlan.destroy();
	                            }

	                            var com = selectedResouces[0].completeRate;
	                            
	                            if(com == "100%"){
	                            	dialog.render({lang: "end_replenish"});
		                            return;
	                            }else if(com != "0%"){
	                            	dialog.render({lang: "starting_replenish"});
		                            return;
	                            }
                                this.seePlan = new SeePlan({
                                    selector: "body",
                                    planId: _id,
                                    data:selectedResouces[0],
                                    events: {
                                    	"getplanList": function() {
	 	                                	self.loadTableData($(".paging-limit-select").val(),0);
	 	                                }
                                    }
                                });
	                            
	                        }
	                    },
					  modify:function(){
						    var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length == 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else if (selectedResouces.length >= 2) {
	                            dialog.render({lang: "select_one_gateway"});
	                        } else {
	                        	var _id = selectedResouces[0]._id;
	                        	 if (this.updateReplenishPlan) {
	 	                            this.updateReplenishPlan.destroy();
	 	                        }
	                        	var executivePersonId = selectedResouces[0].executivePersonId;
	                        	var warehouseId=selectedResouces[0].warehouseId;
	 	                        this.updateReplenishPlan = new UpdateReplenishPlan({
	 	                            selector: "body",
	 	                            planId:_id,//
	 	                            userId:executivePersonId,
	 	                           warehouseId:warehouseId,
	 	                            events: {
	 	                                "getplanList": function() {
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
	                                        	var ids = [];
	                                            for (var i = 0; i < selectedResouces.length; i++) {
	                                                var _id = selectedResouces[i]._id;
	                                                ids[i] = _id;
	                                            }
	                                            Service.deleteReplenishPlanV2(ids, function(data) {
                                                	self.loadTableData($(".paging-limit-select").val(),0);
                                                });
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