define(function(require){
	require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var Service = require("../service");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var UpgradeMan = require("./update/updateUpgrade-window");
	var putonAdvertise = require("./update/puton-window");
	var columns = [ {
		"title":locale.get({lang:"upgrade_name"}),//升级名称
		"dataIndex" : "upgradeName",
		"cls" : null,
		"width" : "30%"
	},{
		"title":locale.get({lang:"type"}),//升级类型
		"dataIndex" : "upgradeType",
		"cls" : null,
		"width" : "30%",
		render: typeConvertor
	},{
		"title":locale.get({lang:"state"}),//状态
		"dataIndex" : "status",
		"cls" : null,
		"width" : "20%",
		render: statusConvertor
	},{                                             //创建时间
		"title":locale.get({lang:"create_time"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "20%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
		}
	}];
	function typeConvertor(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 1:
                    display = locale.get({lang: "automat_app_upgrade"});//app升级
                    break;
                case 2:
                    display = locale.get({lang: "firmware_upgrade"});//固件升级
                    break;
                case 3:
                    display = locale.get({lang: "vmc_upgrade"});//VSI升级
                    break;
                default:
                    break;
            }
            return display;
        } else {
            return value;
        }
    }
	function statusConvertor(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 1:
                    display = locale.get({lang: "has_been_upgrade"});
                    break;
                case 2:
                    display = locale.get({lang: "temporary_storage"});
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
					id : "upgrade_list_bar",
					"class" : null
				},
				table : {
					id : "upgrade_list_table",
					"class" : null
				},
				paging : {
					id : "upgrade_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			$("#upgrades_list").css("width",$(".wrap").width());
			$("#upgrade_list_paging").css("width",$(".wrap").width());
			$("#upgrades_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			var listHeight = $("#upgrades_list").height();
		    var barHeight = $("#upgrade_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#upgrade_list_table").css("height",tableHeight);
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
				selector : "#upgrade_list_table",
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
			var height = $("#upgrade_list_table").height()+"px";
	        $("#upgrade_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			cloud.util.mask("#upgrade_list_table");
        	var self = this;
        	var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
        	var roleType = permission.getInfo().roleType;
            Service.getAutomatByUserId(userId, function(data) {
           		    var deviceIds=[];
                    if(data.result && data.result.length>0){
   	    			  for(var i=0;i<data.result.length;i++){
   	    				deviceIds.push(data.result[i]._id);
   	    			  }
                    }
                    //self.assetIds = assetIds;
                    if(roleType != 51 && deviceIds.length == 0){
                    	deviceIds = ["000000000000000000000000"];
                    }
                    var name = $("#name").val();
                	if(name){
                		name = self.stripscript(name);
                	}
        			self.searchData = {
        				"name":name,
        				"deviceIds":deviceIds
        			};

                	Service.getAllGrade(self.searchData,limit,cursor,function(data){
       				 var total = data.result.length;
       				 self.pageRecordTotal = total;
       	        	 self.totalCount = data.result.length;
               		 self.listTable.render(data.result);
       	        	 self._renderpage(data, 1);
       	        	 cloud.util.unmask("#upgrade_list_table");
      			    }, self);
            }, self);
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#upgrade_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#upgrade_list_table");
        				Service.getAllGrade(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   cloud.util.unmask("#upgrade_list_table");
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
				selector : "#upgrade_list_bar",
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  },
					  upgrade:function(){
						  var selectedResouces = self.getSelectedResources();
	                      if (selectedResouces.length == 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                            return;
	                      }else if (selectedResouces.length >= 2) {
	                            dialog.render({lang: "select_one_gateway"});
	                            return;
	                      } else {
	                    	  var status = selectedResouces[0].status;
	                    	  var _id = selectedResouces[0]._id;
	                    	  var deviceList = selectedResouces[0].deviceList;
	                    	  if(deviceList.length == 0){
	                    		  dialog.render({lang: "upgrade_device_empty"}); 
	                    		  return;
	                    	  }
	                    	  if (this.puton) {
	 	                           this.puton.destroy();
	 	                      }
	 	                      this.puton = new putonAdvertise({
	 	                            selector: "body",
	 	                            adId:_id,//升级ID
	 	                            events: {
	 	                                "getAdvertiseList": function() {
	 	                                	self.loadTableData($(".paging-limit-select").val(),0);
	 	                                }
	 	                            }
	 	                       });
	                      }
					  },
					  add:function(){
						    if (this.addUpgrade) {
	                            this.addUpgrade.destroy();
	                        }
	                        this.addUpgrade = new UpgradeMan({
	                            selector: "body",
	                            events: {
	                                "getAdvertiseList": function() {
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
	                        	 if (this.updateUpgrade) {
	 	                            this.updateUpgrade.destroy();
	 	                        }
	 	                        this.updateUpgrade = new UpgradeMan({
	 	                            selector: "body",
	 	                            adId:_id,//广告ID
	 	                            events: {
	 	                                "getAdvertiseList": function() {
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
	                                                Service.deleteGrade(_id, function(data) {
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