define(function(require) {
	var cloud = require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var html = require("text!./list.html");
	require("cloud/lib/plugin/jquery-ui");
	var NoticeBar = require("./notice-bar");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var validator = require("cloud/components/validator");
	var Service = require("../../service");
	var ManReminder = require("./manReminder-win");

	var columns = [{
		"title":"订阅者姓名",
		"dataIndex" : "name",
		"cls" : null,
		"width" : "10%"
	},{
		"title":"邮箱",
		"dataIndex" : "email",
		"cls" : null,
		"width" : "15%"
	},{
		"title":"手机号",
		"dataIndex" : "phone",
		"cls" : null,
		"width" : "10%"
	},{
		"title":"关注的告警类型",
		"dataIndex" : "type",
		"cls" : null,
		"width" : "25%",
		render: function(data, type, row) {
            var display = "";
            if (data && data.length>0) {
            	for(var i=0;i<data.length;i++){
	               if(data[i] == 9001){
	              	   display =display +  "系统故障 ";
	               }else if(data[i] == 9002){
	              	   display = display + "纸币器故障 ";
	               }else if(data[i] == 9003){
	              	   display = display + "硬币器故障 ";
	               }else if(data[i] == 9004){
	              	   display = display + "通讯故障 ";
	               }else if(data[i] == 90051){
	              	   display = display + "网络连接异常 "
	               }else if(data[i] == 90052){
	              	   display = display + "缺货 ";
	               }else if(data[i] == 90053){
	              	   display = display + "流量告警 ";
	               }
            	}
            } else {
                display = '';
            }
            return display;
        }
    },{
		"title":"关注所有售货机",
		"dataIndex" : "deviceFlag",
		"cls" : null,
		"width" : "10%",
		render: function(data, type, row) {
			var display = "";
			if(data == "0"){
				display="是";
			}else{
				display="否";
			}
			return display;
		}
	},
    
	{
		"title":"通知方式",
		"dataIndex" : "style",
		"cls" : null,
		"width" : "15%",
		render: function(data, type, row) {
            var display = "";
            if (data && data.length>0) {
            	for(var i=0;i<data.length;i++){
            		if(data[i] == "1"){
                   	   display = display + "邮件 "
                    }else if(data[i] == "2"){
                   	   display = display + "微信推送 ";
                    }else if(data[i] == "3"){
                   	   display = display + "短信 ";
                    }
            	}
               
            } else {
                display = '';
            }
            return display;
        }
	}, {                                            
		"title":locale.get({lang:"create_time"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "15%",
		render:function(data, type, row){
			return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
		}
	}];
	
	var reminderlist = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = 30;
			this.pageDisplay = 30;
			
			this.elements = {
				bar : {
					id : "reminder_list_bar",
					"class" : null
				},
				table : {
					id : "reminder_list_table",
					"class" : null
				},
				paging : {
					id : "reminder_list_paging",
					"class" : null
				}
			};
			this.render();
		},
		render:function(){
			this._renderHtml();
			$("#reminder_list").css("width",$(".wrap").width());
			$("#reminder_list_paging").css("width",$(".wrap").width());
			
			$("#reminder_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#reminder_list").height();
		    var barHeight = $("#reminder_list_bar").height();
		    var pageHeight = $("#reminder_list_paging").height();
			var tableHeight=listHeight - barHeight - pageHeight - 5;
			
			$("#reminder_list_table").css("height",tableHeight);
			
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
			this.reminderlistTable = new Table({
				selector : "#reminder_list_table",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "single",
				events : {
					 onRowClick: function(data) {
	                    	
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                    },
	                   scope: this
				}
			});
			var height = $("#reminder_list_table").height()+"px";
	        $("#reminder_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadData(0,30);
		},
		loadData : function(cursor,limit) {
			 var self = this;
			 var name = $("#names").val();
			 var email = $("#emails").val();
			 var phone = $("#phones").val();
			 var types = $("#type").multiselect("getChecked").map(function() {
	                return this.value;
		        }).get();
			 self.searchData={
					 name: name,
					 email:email,
					 phone:phone,
					 type:types
             };
			            
			 Service.getreminderList(self.searchData, limit, cursor, function(data) {
			      var total = data.result.length;
			      self.pageRecordTotal = total;
			      self.totalCount = data.result.length;
			                  
			      self.reminderlistTable.render(data.result);
			      self._renderpage(data, 1);
			      cloud.util.unmask("#reminder_list_table");
			  }, self);  
			             
		},
		 _renderpage:function(data, start){
	        	var self = this;
	        	if(this.page){
	        		this.page.reset(data);
	        	}else{
	        		this.page = new Paging({
	        			selector : $("#reminder_list_paging"),
	        			data:data,
	    				current:1,
	    				total:data.total,
	    				limit:this.pageDisplay,
	        			requestData:function(options,callback){
	        				cloud.util.mask("#reminder_list_table");
	                        Service.getreminderList(self.searchData, options.limit, options.cursor, function(data) {
	                            self.pageRecordTotal = data.total - data.cursor;
	                            callback(data);
	                            cloud.util.unmask("#reminder_list_table");
	                        });
	        			},
	        			turn:function(data, nowPage){
	        			    self.totalCount = data.result.length;
	        			    self.reminderlistTable.clearTableData();
	        			    self.reminderlistTable.render(data.result);
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
		_renderNoticeBar : function() {
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#reminder_list_bar",
				events : {
					  query: function(){//查询
						  self.loadData(0,$(".paging-limit-select").val());
					  },
					  add:function(){
						  if (this.addReminder) {
	                            this.addReminder.destroy();
	                       }
						  this.addReminder = new ManReminder({
                             selector: "body",
                             events: {
                                 "getReminderList": function() {
                                	 self.loadData(0,$(".paging-limit-select").val());
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
	                        	var deviceIds = selectedResouces[0].deviceIds;
	                        	if (this.modifyPro) {
		                            this.modifyPro.destroy();
		                        }
		                        this.modifyPro = new ManReminder({
		                             selector: "body",
		                             id: _id,
		                             deviceIds:deviceIds,
		                             events: {
		                                "getReminderList": function() {
		                                	 self.loadData(0,$(".paging-limit-select").val());
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
		                                                Service.deleteReminder(_id, function(data) {
		                                                	self.loadData(0,$(".paging-limit-select").val());
		                                                });
		                                          }
	                                        	  self.loadData(0,$(".paging-limit-select").val());
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
		getSelectedResources:function(){
        	var self = this;
        	var selectedRes = $A();
        	self.reminderlistTable && self.reminderlistTable.getSelectedRows().each(function(row){
        		selectedRes.push(self.reminderlistTable.getData(row));
        	});
        	return selectedRes;
        }
	});
	return reminderlist;
});