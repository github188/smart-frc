define(function(require) {
	var cloud = require("cloud/base/cloud");
	var html = require("text!./staff.html");
	var NoticeBar = require("./notice-bar");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var Window = require('cloud/components/window');
	var Edit = require("./edit");
	var Service = require("../../../service");
	require("../css/table.css");
	var columns = [{
		"title":locale.get({lang:"automat_staff_number"}),
		"dataIndex" : "number",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"automat_staff_name"}),
		"dataIndex" : "name",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"automat_staff_phone"}),
		"dataIndex" : "phone",
		"cls" : null,
		"width" : "20%"
	},{
		"title":locale.get({lang:"status"}),
		"dataIndex" : "state",
		"cls" : null,
		"width" : "10%",
		render:function(data, type, row){
			if(data == "0"){
				return locale.get({lang:"automat_staff_on_position"});
			}else{
				return locale.get({lang:"automat_staff_not_on_position"});
			}
		}
	},{
		"title":locale.get({lang:"description"}),
		"dataIndex" : "descript",
		"cls" : null,
		"width" : "20%"
	}];
	
	var staff = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = null;
			this.pageDisplay = 30;
			this.elements = {
				toolbar : {
					id : "dispatching-staff-toolbar"
				},
				table : {
					id : "dispatching-staff-table"
				},
				paging : {
					id : "dispatching-staff-paging"
				}
			};
			this.winHeight = 324;
	        this.winWidth = 400;
	        
	        /*this.currentInput = null;
	        this.searchInput = null;
	        this.searchSelect = null;
	        this.currentSelect = null;*/
	        
			this.render();
		},
		render:function(){
			this._renderHtml();
			//this.renderLayout();
			this._renderTable();
			this._renderNoticeBar();
		
		},
		_renderHtml : function() {
			this.element.html(html);
		},
		renderLayout : function() {
			if (this.layout) {
				this.layout.destory();
			}
			$("#dispatching-staff").css({"position":"relative",
									"height":$("#col_slide_main").height()-$("#topTab").height()});
			this.layout = $("#dispatching-staff").layout({
				defaults : {
                    togglerLength_open: 50,
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    spacing_open: 0,
                    spacing_closed: 1,
                    togglerLength_closed: 50,
                    resizable: false,
                    slidable: false,
                    closable: false
				},
				north : {
					paneSelector : "#" + this.elements.toolbar.id,
					size : "50"
				},
				center : {
					paneSelector : "#" + this.elements.table.id
				},
				south : {
					paneSelector : "#" + this.elements.paging.id,
					size : "52"
				}
			});
			$("#"+this.elements.toolbar.id).css({"line-height":"30px","padding-left":"10px;"});
		},
		_renderTable : function() {
			this.table = new Table({
				selector : "#" + this.elements.table.id,
				columns : [columns].flatten(),
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox:"full",
				events : {
				   onRowClick: function(data) {
                   },
                   onRowRendered: function(tr, data, index) {
                        var self = this;
                    },
                   scope: this
				}
			});

			this.loadTableData();
		},
    	_renderNoticeBar : function() {
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#" + this.elements.toolbar.id,
				events : {
					query: function(){
						var condition = $("#automat_staff_search_options option:selected").val();
						var value = $("#search-input").val();
						/*self.searchInput = value;
						self.searchSelect = condition;*/
						
						cloud.util.mask("#content-table-content");
						var pageDisplay = self.pageDisplay;
						Service.getDeliveryInfo(condition,value,0, pageDisplay, function(data) {
							var total = data.total;
							this.totalCount = data.result.length;
					        data.total = total;
					        self.table.render(data.result);
					        self._renderpage(data, 1);
					        cloud.util.unmask("#content-table-content");
						});
						/*Service.getDeliveryById(selectedResouces[0]._id,function(data){
							$("#automat_staff_name").val(data.result.name);
                        	$("#automat_staff_number").val(data.result.number);
                        	$("#automat_staff_phone").val(data.result.phone);
                        	$("#automat_staff_description").val(data.result.descript);
						},self)*/
					},
					"add":function(){
						self.showEditView("save");
					},
					"modify":function(){
						var selectedResouces = self.getSelectedResources();
						if (selectedResouces.length === 0) {
							dialog.render({lang:"please_select_at_least_one_config_item"});
							return;
						}else{
							if(selectedResouces.length > 1){
	 						  dialog.render({lang:"automat_model_select_only_one"});
	 						  return;
							}
							self.showEditView("update",selectedResouces[0]._id);
							Service.getDeliveryById(selectedResouces[0]._id,function(data){
								$("#automat_staff_name").val(data.result.name);
	                        	$("#automat_staff_number").val(data.result.number);
	                        	$("#automat_staff_phone").val(data.result.phone);
	                        	$("#automat_staff_description").val(data.result.descript);
							},self)
						}
					},
					"drop":function(){
						var idsArr = self.getSelectedResources();
						if(idsArr.length == 0){
							dialog.render({lang:"automat_select_least_one"});
							return;
						}else{
							dialog.render({
			    				lang:"affirm_delete",
			    				buttons: [{
			    					lang:"affirm",
			    					click:function(){
			    						 var selectedResouces = self.getSelectedResources();
			   	                 	  if (selectedResouces.length === 0) {
			   	                 		  dialog.render({lang:"please_select_at_least_one_config_item"});
			   		 				  }else{
			   		 					 for(var i=0;i<selectedResouces.length;i++){
			   		 				    	 var _id = selectedResouces[i]._id;
			   		 				    	 Service.deleteDelivery(_id,function(data){
			   		 				    		 self.loadTableData();
			   		 				    		 dialog.render({lang:"deletesuccessful"});
			   		 				    	 });
			   		 				     }
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
		showEditView:function(type,_id){
			var self = this;
			if(this.editWindow){
				this.editWindow = null;
			}
            this.editWindow =  new Window({
                container : "body",
                title : locale.get("automat_add_or_modify_staff"),
                top: "center",
                left: "center",
                height:300,
				width: 600,
                mask: true,
                blurClose:true,
                events : {
                    "onClose": function() {
                        self.window = null;
                    },
                    scope : this
                }
            })
            this.editWindow.show();
            this.setEditContent(type,_id);
		},
		setEditContent:function(type,_id){
			var self = this;
			this.editContentContainer =$("<div id='add_or_edit_staff' style='border-top: 1px solid #f2f2f2;'></div>");

	        this.editWindow.setContents(this.editContentContainer);
	        this.editContent = new Edit({
                container : "#add_or_edit_staff",
                height:300,
				width: 600,
                events : {
                    "click": function() {
                    	if(type == "save"){
                    		var name = $("#automat_staff_name").val();
                        	var number = $("#automat_staff_number").val();
                        	var phone = $("#automat_staff_phone").val();
                        	var description = $("#automat_staff_description").val();
                        	Service.addDelivery(name,number,phone,description,function(data){
                        		if(data.error!=null){
                        			
                        		}else{
                        			self.editWindow.destroy();
                        			self.loadTableData();
                        		}
                        	},self);
                    	}else if(type == "update"){
                    		var name = $("#automat_staff_name").val();
                        	var number = $("#automat_staff_number").val();
                        	var phone = $("#automat_staff_phone").val();
                        	var description = $("#automat_staff_description").val();
                        	Service.updateDelivery(_id,name,number,phone,description,function(data){
                        		if(data.error!=null){
                        			
                        		}else{
                        			self.editWindow.destroy();
                        			self.loadTableData();
                        		}
                        	},self);
                    	}
                    	
                     },
                     scope : this
                 }
            });
			
		},
		getSelectedResources: function() {
        	var self = this;
        	var rows = self.table.getSelectedRows();
        	var selectedRes = new Array();
        	rows.each(function(row){
        		selectedRes.push(self.table.getData(row));
        	});
        	return selectedRes;
        },
        loadTableData : function() {
        	cloud.util.mask("#content-table-content");
        	var self = this;
			var pageDisplay = this.pageDisplay;
			Service.getDeliveryInfo(null,null,0, pageDisplay, function(data) {
				var total = data.total;
				this.totalCount = data.result.length;
		        data.total = total;
		        self.table.render(data.result);
		        self._renderpage(data, 1);
		        cloud.util.unmask("#content-table-content");
			});
		},
        _renderpage:function(data, start){
        	var self = this;
        	if(this.page){
        		this.page.reset(data);
        	}else{
        		this.page = new Paging({
        			selector : $("#" + this.elements.paging.id),
        			data:data,
    				current:start,
    				total:data.total,
    				limit:self.pageDisplay,
        			requestData:function(options,callback){
        				var condition = $("#automat_staff_search_options option:selected").val();
						var value = $("#search-input").val();
						/*self.currentInput = value;
						self.currentSelect = condition;*/
						
        				Service.getDeliveryInfo(condition,value,options.cursor,options.limit, function(data){
							 callback(data);
	        			});
        			},
        			turn:function(data, nowPage){
        			    self.totalCount = data.result.length;
        			    self.table.clearTableData();
        			    self.table.render(data.result);
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
        }
	});
	return staff;
});