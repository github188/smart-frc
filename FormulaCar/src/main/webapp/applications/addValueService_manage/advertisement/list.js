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
	var AddAdvertise = require("./update/updateAdvertise-window");
	var putonAdvertise = require("./update/puton-window");
	var columns = [ {
		"title":locale.get({lang:"advertise_name"}),//广告名称
		"dataIndex" : "adName",
		"cls" : null,
		"width" : "40%"
	},{
		"title":locale.get({lang:"state"}),//状态
		"dataIndex" : "status",
		"cls" : null,
		"width" : "20%",
		render: statusConvertor
	},{
		"title":locale.get({lang:"running_time"}),//投放日期
		"dataIndex" : "pushTime",
		"cls" : null,
		"width" : "20%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
		}
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
	function statusConvertor(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 1:
                    display = locale.get({lang: "has_been_delivery"});
                    break;
                case 2:
                    display = locale.get({lang: "has_no_delivery"});
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
					id : "advertise_list_bar",
					"class" : null
				},
				table : {
					id : "advertise_list_table",
					"class" : null
				},
				paging : {
					id : "advertise_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			
			$("#advertise_list").css("width",$(".wrap").width());
			$("#advertise_list_paging").css("width",$(".wrap").width());
			
			$("#advertise_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#advertise_list").height();
		    var barHeight = $("#advertise_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#advertise_list_table").css("height",tableHeight);
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
				selector : "#advertise_list_table",
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
			var height = $("#advertise_list_table").height()+"px";
	        $("#advertise_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			cloud.util.mask("#advertise_list_table");
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
                    self.deviceIds = deviceIds;
                    var name = $("#name").val();
                	if(name){
                		name = self.stripscript(name);
                	}
        			self.searchData = {
        				"name":name,
        				"deviceIds":deviceIds
        			};

                	Service.getAllAd(self.searchData,limit,cursor,function(data){
       				 var total = data.result.length;
       				 self.pageRecordTotal = total;
       	        	 self.totalCount = data.result.length;
               		 self.listTable.render(data.result);
       	        	 self._renderpage(data, 1);
       	        	 cloud.util.unmask("#advertise_list_table");
      			    }, self);
                
            }, self);
        	
			
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#advertise_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#advertise_list_table");
        				Service.getAllAd(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   cloud.util.unmask("#advertise_list_table");
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
				selector : "#advertise_list_bar",
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  },
					  puton:function(){
						  var selectedResouces = self.getSelectedResources();
	                      if (selectedResouces.length == 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                      }else if (selectedResouces.length >= 2) {
	                            dialog.render({lang: "select_one_gateway"});
	                      } else {
	                    	  var status = selectedResouces[0].status;
	                    	  var _id = selectedResouces[0]._id;
	                    	  
	                    	  if (this.puton) {
	 	                           this.puton.destroy();
	 	                      }
	 	                      this.puton = new putonAdvertise({
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
					  add:function(){
						    if (this.addAdvertise) {
	                            this.addAdvertise.destroy();
	                        }
	                        this.addAdvertise = new AddAdvertise({
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
	                        	 if (this.addAdvertise) {
	 	                            this.addAdvertise.destroy();
	 	                        }
	                        	 var deviceList = selectedResouces[0].deviceList;
	                        	
	 	                        this.addAdvertise = new AddAdvertise({
	 	                            selector: "body",
	 	                            adId:_id,//广告ID
	 	                            deviceList:deviceList,
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
	                                                Service.deleteAd(_id, function(data) {
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