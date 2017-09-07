define(function(require) {
	var cloud = require("cloud/base/cloud");
	var html = require("text!./list.html");
	require("cloud/lib/plugin/jquery-ui");
	var NoticeBar = require("./notice-bar");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var validator = require("cloud/components/validator");
	var Service = require("../../service");
	var SeeActivity = require("./seeActivity-window");
	var columns = [{
		"title":locale.get({lang:"price_activity_name"}),
		"dataIndex" : "name",
		"cls" : null,
		"width" : "20%"
	}, {
		"title":locale.get({lang:"price_activity_createTime"}),
		"dataIndex" : "startTime",
		"cls" : null,
		"width" : "15%",
		render:dateConvertor
	}, {
		"title":locale.get({lang:"price_activity_endTime"}),
		"dataIndex" : "endTime",
		"cls" : null,
		"width" : "15%",
		render:dateConvertor
	}, {
		"title":locale.get({lang:"price_activity_endWay"}),
		"dataIndex" : "endStyle",
		"cls" : null,
		"width" : "15%",
		render:stateConvertor
	},{
		"title":locale.get({lang:"price_activity_descript"}),
		"dataIndex" : "descript",
		"cls" : null,
		"width" : "35%"
	},{
		"title" : "",
		"dataIndex" : "id",
		"cls" : "_id" + " " + "hide"
	} ];
	function dateConvertor(value, type) {
		if(type === "display"){
			if(value){
				return cloud.util.dateFormat(new Date(value), "yyyy-MM-dd hh:mm:ss");
			}else{
				return '';
			}
		}else{
			return value;
		}
	}
	function stateConvertor(value,type){
		var display = "";
		if("display"==	type){
			switch (value) {
				case "0":
					display = locale.get({lang:"automatically"});
					break;
				case "1":
					display = locale.get({lang:"manual"});
					break;
				default:
					break;
			}
			return display;
		}else{
			return value;
		}
	}
	var list = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "end_list_bar",
					"class" : null
				},
				table : {
					id : "end_list_table",
					"class" : null
				},
				paging : {
					id : "end_list_paging",
					"class" : null
				}
			};
			this.render();
		},
		render:function(){
			this._renderHtml();
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
				selector : "#end_list_table",
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

			this.setDataTable();
		},
		setDataTable : function() {
			this.loadData();
		},
		loadData : function() {
			cloud.util.mask("#end_list_table");
			var self = this;
			var pageDisplay = self.display;
			var name= $("#name").val();
			if(name){
				name = self.stripscript(name);
			}
			var status=0;
			Service.getActivityInfoByName(0, pageDisplay,name,status,function(data) {
				var total = data.total;
				this.totalCount = data.result.length;
		        data.total = total;
		        self.listTable.render(data.result);
		        self._renderpage(data, 1);
		        cloud.util.unmask("#end_list_table");
			});
						
		},
		 _renderpage:function(data, start){
	        	var self = this;
	        	if(this.page){
	        		this.page.reset(data);
	        	}else{
	        		this.page = new Paging({
	        			selector : $("#end_list_paging"),
	        			data:data,
	    				current:1,
	    				total:data.total,
	    				limit:this.pageDisplay,
	        			requestData:function(options,callback){
	        				var status=0;
	        				var name= $("#name").val();
	        				if(name){
	        					name = self.stripscript(name);
	        				}
	        				Service.getActivityInfoByName(options.cursor, options.limit,name,status,function(data) {
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
		_renderNoticeBar : function() {
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#end_list_bar",
				events : {
					  query: function(name){//查询
						    cloud.util.mask("#end_list_table");
						    var pageDisplay = self.display;
							var status=0;
							if(name){
								name = self.stripscript(name);
							}
							Service.getActivityInfoByName(0, pageDisplay,name,status,function(data) {
								var total = data.total;
								this.totalCount = data.result.length;
						        data.total = total;
						        self.listTable.render(data.result);
						        self._renderpage(data, 1);
						        cloud.util.unmask("#end_list_table");
							});
					  },
					  see:function(){//查看
                           var selectedResouces = self.getSelectedResources();
						  
						  if (selectedResouces.length === 0) {
	 							dialog.render({lang:"please_select_at_least_one_config_item"});
	 				      }else if(selectedResouces.length >= 2){
	 				    	    dialog.render({lang:"select_one_gateway"});
	 				      }else{
	 				    	  var _id = selectedResouces[0]._id;
		 					  if(this.seeEndActivity){
								  this.seeEndActivity.destroy();
		                  	  }
		                  	  this.seeEndActivity = new SeeActivity({
		                  		  selector:"body",
		                  		  activityId:_id
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