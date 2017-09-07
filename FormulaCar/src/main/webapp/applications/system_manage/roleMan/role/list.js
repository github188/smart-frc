define(function(require) {
	var cloud = require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var html = require("text!./list.html");
	require("cloud/lib/plugin/jquery-ui");
	var NoticeBar = require("./notice-bar");
	var _Window = require("cloud/components/window");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var validator = require("cloud/components/validator");
	var Service = require("../../service");
	var AddRole = require("./roleMan/roleMan-window");
	var ModifyRole = require("./roleMan/roleManUpdate-window");
	var dateConvertor = function(name, type, data) {
		if ("display" == type) {
			return cloud.util.dateFormat(new Date(name), "yyyy-MM-dd hh:mm:ss");
		} else {
			return name;
		}
	};
	
	var columns = [{
		"title":locale.get({lang:"role_name1"}),
		"dataIndex": "name",
		"width": "25%",
		render: function(name, type, data) {
			if(data.name === "admin"){
			    return locale.get({lang:"organization_manager"});
			}else if(data.name === "DeviceManager"){
			    return locale.get({lang:"device_manager"});
			}else if(data.name === "DeviceSense"){
			    return locale.get({lang:"device_sense"});
			}else{
			    return data.name;
			}
		}
	},
	 {
		"title":locale.get({lang:"create_time"}),
		"dataIndex": "createTime",
		"cls": null,
		"width": "35%",
		render: dateConvertor
	}, {
		"title":locale.get({lang:"update_time"}),
		"dataIndex": "updateTime",
		"cls": null,
		"width": "35%",
		render: dateConvertor
	}];
	var list = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = null;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "role_list_bar",
					"class" : null
				},
				table : {
					id : "role_list_table",
					"class" : null
				},
				paging : {
					id : "role_list_paging",
					"class" : null
				}
			};
			this.render();
		},
		render:function(){
			this._renderHtml();
			
			$("#role_list").css("width",$(".wrap").width());
			$("#role_list_paging").css("width",$(".wrap").width());
			
			$("#role_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#role_list").height();
		    var barHeight = $("#role_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#role_list_table").css("height",tableHeight);
			
			this._renderTable();
			this._renderNoticeBar();
			
		},
		_renderHtml : function() {
			this.element.html(html);
		},
		_renderTable : function() {
			this.listTable = new Table({
				selector : "#role_list_table",
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
			var height = $("#role_list_table").height()+"px";
	        $("#role_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable:function() {
			this.loadData();
		},
		loadData:function() {
			cloud.util.mask("#role_list_table");
			var self = this;
			var pageDisplay = this.pageDisplay;
			Service.getRoleInfo(0, pageDisplay,function(data) {
				var total = data.total;
				this.totalCount = data.result.length;
		        data.total = total;
		        self.listTable.render(data.result);
		        self._renderpage(data, 1);
		        cloud.util.unmask("#role_list_table");
			});
						
		},
		 _renderpage:function(data, start){
	        	var self = this;
	        	if(this.page){
	        		this.page.reset(data);
	        	}else{
	        		this.page = new Paging({
	        			selector : $("#role_list_paging"),
	        			data:data,
	    				current:1,
	    				total:data.total,
	    				limit:this.pageDisplay,
	        			requestData:function(options,callback){
	        				cloud.util.mask("#role_list_table");
	        				Service.getRoleInfo(options.cursor, options.limit,function(data){
   							   callback(data);
   							cloud.util.unmask("#role_list_table");
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
				selector : "#role_list_bar",
				events : {
					  query: function(name){//查询
						  cloud.util.mask("#role_list_table");
							var pageDisplay = 30;
							Service.getRoleList(name,0, pageDisplay,function(data) {
								var total = data.total;
								this.totalCount = data.result.length;
						        data.total = total;
						        self.listTable.render(data.result);
						        self._renderpage(data, 1);
						        cloud.util.unmask("#role_list_table");
							});
					  },
					  add:function(){//添加
						    var selfs = this;
				            if (this.window) {
				            	this.window.destroy();
				            }
			                var windowContent = $("<div>").addClass("overview-window-el").css({height : "100%"});
			                this.window = new _Window({
			                    container: "body",
			                    title: locale.get({lang:"add_role"}),
			                    top: "center",
			                    left: "center",
			                    height: 650,
			                    width: 1400,
			                    mask: true,
			                    drag:true,
			                    content: windowContent,
			                    events: {
			                        "onClose": function() {
			                            this.window.destroy();
			                        },
			                        scope: this
			                    }
			                });
			                this.window.show();
			                
			                this.smartRole = new AddRole({
			                    container : windowContent,
			                    events: {
			                        "onClose": function() {
			                            selfs.window.destroy();
			                            self.loadData();
			                        }
			                    }
			                });
					  },
					  modify:function(){//修改
						  var selfs = this;
						     var selectedResouces = self.getSelectedResources();
	                 		 if (selectedResouces.length === 0) {
		 							dialog.render({lang:"please_select_at_least_one_config_item"});
		 				     }else if(selectedResouces.length >= 2){
		 				    	    dialog.render({lang:"select_one_gateway"});
		 				     }else{
		 				    	var _id= selectedResouces[0]._id;
		 				    	var name = selectedResouces[0].name;
		 				    	
		 				    	if(name == "admin"){
		 				    		dialog.render({lang:"role_alerady_max"});
		 				    		
		 				    	}else{
		 				    		if(this.window){
			 				    		this.window.destroy();
			 				    	}
					                var windowContent = $("<div>").addClass("overview-window-el").css({height : "100%"});
					                this.window = new _Window({
					                    container: "body",
					                    title: locale.get({lang:"role_detail"}),
					                    top: "center",
					                    left: "center",
					                    height: 650,
					                    width: 1400,
					                    mask: true,
					                    drag:true,
					                    content: windowContent,
					                    events: {
					                        "onClose": function() {
					                            this.window.destroy();
					                            
					                        },
					                        scope: this
					                    }
					                });
					                this.window.show();
					                this.modifyRole = new ModifyRole({
					                    container : windowContent,
					                    id:_id,
					                    events: {
					                        "onClose": function() {
					                        	 selfs.window.destroy();
					                        	 self.loadData();
					                        }
					                    }
					                });
		 				    		
		 				    	}
		 				    	
	 				    		
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
						 				    	 Service.deleteRole(_id,function(data){
						 				    		 self.loadData();
							 				    	 dialog.render({lang:"deletesuccessful"});
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