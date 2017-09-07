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
	var contractMan = require("./edit/contract_manage_window");
	var contractView = require("./view/contract_view_window");
	var contractdeliveryMan = require("./delivery/deliveryAndHistory");

	var columns = [ 
 	{
		"title":locale.get({lang:"launch_certificate_number"}),//编号
		"dataIndex" : "number",
		"cls" : null,
		"width" : "15%"
	},
	{                                             //合作方式
		"title":locale.get({lang:"cooperation_mode"}),
		"dataIndex" : "style",
		"cls" : null,
		"width" : "10%",
		render:statusConvertor
	},{
		"title":locale.get({lang:"rent_collection_date"}),//租金起收日
		"dataIndex" : "startTime",
		"cls" : null,
		"width" : "15%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd");
			}else{
				return '-';
			}
		}
	},{
		"title":locale.get({lang:"rent_deadline"}),//租金截止日
		"dataIndex" : "endTime",
		"cls" : null,
		"width" : "15%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd");
			}else{
				return '-';
			}
		}
	},{
		"title":locale.get({lang:"rent_delivery_date"}),//租金交付日
		"dataIndex" : "deliveryDate",
		"cls" : null,
		"width" : "15%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd");
			}else{
				return '-';
			}
		}
	},{
		"title":locale.get({lang:"rent_collection_day"}),//租金催收日
		"dataIndex" : "collectionDay",
		"cls" : null,
		"width" : "15%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd");
			}else{
				return '-';
			}
		}
	},{
		"title":locale.get({lang:"contract_createTime"}),//合同创建日期
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
	function statusConvertor(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 1:
                    display = locale.get({lang: "contract_lease"});//租赁
                    break;
                case 2:
                    display = locale.get({lang: "contract_buy"});//购买
                    break;
                default:
                    break;
            }
            return display;
        } else {
            return value;
        }
    }
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
	        this.element.html(html);
	        this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "contract_list_bar",
					"class" : null
				},
				table : {
					id : "contract_list_table",
					"class" : null
				},
				paging : {
					id : "contract_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			
			$("#contracts_list").css("width",$(".wrap").width());
			$("#contract_list_paging").css("width",$(".wrap").width());
			$("#contracts_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			var listHeight = $("#contracts_list").height();
		    var barHeight = $("#contract_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#contract_list_table").css("height",tableHeight);
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
				selector : "#contract_list_table",
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
			var height = $("#contract_list_table").height()+"px";
	        $("#contract_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			cloud.util.mask("#contract_list_table");
        	var self = this;
        	var number = $("#number").val();
        	self.searchData={
        			number:number
            };
        	Service.getContractList(self.searchData, limit, cursor, function(data) {
                var total = data.result.length;
                self.pageRecordTotal = total;
                self.totalCount = data.result.length;
                self.datas = data.result;
                
                self.listTable.render(data.result);
                self._renderpage(data, 1);
                cloud.util.unmask("#contract_list_table");
          }, self); 
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#contract_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#contract_list_table");
        				Service.getContractList(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   cloud.util.unmask("#contract_list_table");
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
				selector : "#contract_list_bar",
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  },
					  view:function(){
						    var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length == 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else if (selectedResouces.length >= 2) {
	                            dialog.render({lang: "select_one_gateway"});
	                        } else {
	                        	var _id = selectedResouces[0]._id;
	                        	 if (this.viewContract) {
	 	                            this.viewContract.destroy();
	 	                        }
	 	                        this.viewContract = new contractView({
	 	                            selector: "body",
	 	                            id:_id,
	 	                            events: {
	 	                                "getcontractList": function() {
	 	                                	self.loadTableData($(".paging-limit-select").val(),0);
	 	                                }
	 	                            }
	 	                        });
	                        }
					  },
					  add:function(){
						    if (this.addContract) {
	                            this.addContract.destroy();
	                        }
	                        this.addContract = new contractMan({
	                            selector: "body",
	                            events: {
	                                "getcontractList": function() {
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
	                        	 if (this.updateContract) {
	 	                            this.updateContract.destroy();
	 	                        }
	 	                        this.updateContract = new contractMan({
	 	                            selector: "body",
	 	                            id:_id,
	 	                            events: {
	 	                                "getcontractList": function() {
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
	                                                Service.deleteContract(_id, function(data) {
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
					  exports:function(){
						     var language = locale._getStorageLang() === "en" ? 1 : 2;
	                    	 var host = cloud.config.FILE_SERVER_URL;
	                    	 var reportName = "ContractReport.xls";
	                    	 var url = host + "/api/vmreports/contract?report_name=" + reportName;
	                         var parameters = "&access_token=" + cloud.Ajax.getAccessToken();                  
	                             
	                    	 cloud.util.ensureToken(function() {
	                    	      window.open(url+parameters, "_self");
	                    	 });        
					  },
					  pay:function(){
						    var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length == 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else if (selectedResouces.length >= 2) {
	                            dialog.render({lang: "select_one_gateway"});
	                        } else {
	                        	var _id = selectedResouces[0]._id;
	                        	var style = selectedResouces[0].style;
	                        	if(style == 2){
	                        		 dialog.render({lang: "the_contract_does_not_need_to_delivery"});
	                                 return;
	                        	}
	                        	
	                        	if (this.deliveryContract) {
	 	                            this.deliveryContract.destroy();
	 	                        }
	 	                        this.deliveryContract = new contractdeliveryMan({
	 	                            selector: "body",
	 	                            id:_id,
	 	                            events: {
	 	                                "getcontractList": function() {
	 	                                	self.loadTableData($(".paging-limit-select").val(),0);
	 	                                }
	 	                            }
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