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
	var UserMan = require("./userManage-window.js");
	var columns = [{
		"title":locale.get({lang:"user_name"}),
		"dataIndex": "name",
		"cls": null,
		"width": "20%"
	},{
		"title":locale.get({lang:"email"}),
		"dataIndex": "email",
		"cls": null,
		"width": "20%"
	},{
		"title":locale.get({lang:"state"}),
		"dataIndex": "state",
		"cls": "state",
		"width": "10%",
		render: function (value, type) {
			if(type === "display"){
				var status = null;
				switch(value){
					case -1:
						status = locale.get("logouted");
						break;
					case 0:
						status = locale.get("logined");
						break;
					default:
						status = locale.get("locked");
						break;
				}
				return status;
			}else{
				return value;
			}
		}
	},{
		"title":locale.get({lang:"role"}),
		"dataIndex": "roleName",
		width: "20%",
		render: function (value) {
			if(value == 'admin'){
				return locale.get({lang:"organization_manager"});
			}else if(value  === "DeviceManager"){
			    return locale.get({lang:"device_manager"});
		    }else if(value  === "DeviceSense"){
			    return locale.get({lang:"device_sense"});
		    }else{
			    return value ;
			}
		}
	}, {
		"title":locale.get({lang:"create_time"}),
		"dataIndex": "createTime",
		width: "15%",
		render: function (value, type) {
			if(type === "display"){
				return cloud.util.dateFormat(new Date(value), "yyyy-MM-dd hh:mm:ss");
			}else{
				return value;
			}
		}
	},{
		"title":locale.get({lang:"login_times"}),
		"dataIndex":"totalLogin",
		"cls": null,
		"width": "15%"
	}];
	var list = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "user_list_bar",
					"class" : null
				},
				table : {
					id : "user_list_table",
					"class" : null
				},
				paging : {
					id : "user_list_paging",
					"class" : null
				}
			};
			this.render();
		},
		render:function(){
			this._renderHtml();
			
			$("#user_list").css("width",$(".wrap").width());
			$("#user_list_paging").css("width",$(".wrap").width());
			
			$("#user_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#user_list").height();
		    var barHeight = $("#user_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#user_list_table").css("height",tableHeight);
			
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
			this.listTable = new Table({
				selector : "#user_list_table",
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
			var height = $("#user_list_table").height()+"px";
	        $("#user_list_table-table").freezeHeader({ 'height': height });

			this.setDataTable();
		},
		setDataTable : function() {
			this.loadData();
		},
		loadData : function() {
			cloud.util.mask("#user_list_table");
			var self = this;
			var pageDisplay = self.display;
			Service.getUserInfo(0, pageDisplay,function(data) {
				var total = data.total;
				this.totalCount = data.result.length;
		        data.total = total;
		        self.listTable.render(data.result);
		        self._renderpage(data, 1);
		        cloud.util.unmask("#user_list_table");
			});
						
		},
		 _renderpage:function(data, start){
	        	var self = this;
	        	if(this.page){
	        		this.page.reset(data);
	        	}else{
	        		this.page = new Paging({
	        			selector : $("#user_list_paging"),
	        			data:data,
	    				current:1,
	    				total:data.total,
	    				limit:this.pageDisplay,
	        			requestData:function(options,callback){
	        				cloud.util.mask("#user_list_table");
	        				Service.getUserInfo(options.cursor, options.limit,function(data){
   							   callback(data);
   							cloud.util.unmask("#user_list_table");
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
		_renderNoticeBar : function() {
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#user_list_bar",
				events : {
					  query: function(name){//查询
						  cloud.util.mask("#user_list_table");
						    var pageDisplay = self.display;
						    if(name){
								name = self.stripscript(name);
							}
							Service.getUserList(name,0, pageDisplay,function(data) {
								var total = data.total;
								this.totalCount = data.result.length;
						        data.total = total;
						        self.listTable.render(data.result);
						        self._renderpage(data, 1);
						        cloud.util.unmask("#user_list_table");
							});
					  },
					  add:function(){//添加
						      if(this.addPro){
	                  			this.addPro.destroy();
	                  		  }
	                  		  this.addPro = new UserMan({
	                  			selector:"body",
	                  			events : {
	                  				"getUsersList":function(){
	                  					$("tr").css("border-bottom","0px");
	                  					self.loadData();
	                  				}
	                  			}
	                  		  });
					  },
					  modify:function(){//修改
						  var selectedResouces = self.getSelectedResources();
	                 		 if (selectedResouces.length === 0) {
		 							dialog.render({lang:"please_select_at_least_one_config_item"});
		 				     }else if(selectedResouces.length >= 2){
		 				    	    dialog.render({lang:"select_one_gateway"});
		 				     }else{
		 				    	var _id= selectedResouces[0]._id;
		 				    	this.modifyPro = new UserMan({
		                  			selector:"body",
		                  			id:_id,
		                  			events : {
		                  				"getUsersList":function(){
		         	                        $("tr").css("border-bottom","0px");
		                  					self.loadData();
		                  				}
		                  			}
		                  	    });	
		 				    	
		 					 }
					  },
					  drop:function(){//删除
						  var selectedResouces = self.getSelectedResources();
	  	                  if (selectedResouces.length === 0) {
	  	                 	  dialog.render({lang:"please_select_at_least_one_config_item"});
	  		 			  }else{
	  		 				  dialog.render({
				    				lang:"affirm_delete",
				    				buttons: [{
				    					lang:"affirm",
				    					click:function(){
				    						for(var i=0;i<selectedResouces.length;i++){
						 				    	 var _id = selectedResouces[i]._id;
						 				    	 var email = selectedResouces[i].email;
						 				    	 Service.deleteUser(_id,function(data){
						 				    		Service.deleteSmartUser(_id,email,function(data){
						 				    			self.loadData();
								 				    	dialog.render({lang:"deletesuccessful"});
						 				    		});
						 				    	 });
						 				     }	
				    						dialog.close();
				    					}
				    				},
				    				{
				    					lang:"cancel",
				    					click:function(){
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
        	self.listTable && self.listTable.getSelectedRows().each(function(row){
        		selectedRes.push(self.listTable.getData(row));
        	});
        	return selectedRes;
        }
	});
	return list;
});