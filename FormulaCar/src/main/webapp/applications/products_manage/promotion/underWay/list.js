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
	var AddActivity = require("./add/addActivity-window");
	var UpdateActivity = require("./update/updateActivity-window");
	//var SeeActivity = require("./activityDetail-window");
	var Service = require("../../service");
	
	var columns = [{
		"title":locale.get({lang:"price_activity_name"}),
		"dataIndex" : "name",
		"cls" : null,
		"width" : "25%"
	}, {
		"title":locale.get({lang:"start_time"}),
		"dataIndex" : "startTime",
		"cls" : null,
		"width" : "25%",
		render:dateConvertor
	}, {
		"title":locale.get({lang:"end_time"}),
		"dataIndex" : "endTime",
		"cls" : null,
		"width" : "25%",
		render:dateConvertor
	},/* {
		"title":locale.get({lang:"sales_promotion_machine_quantity"}),
		"dataIndex" : "automatInfo",
		"cls" : null,
		"width" : "18%",
		render:function(data, type, row){
			 var display ="0";
			 if(data){
				 if(data.length){
					display = data.length;
				 }
			 }
			 return display;
		}
	}, {
		"title":locale.get({lang:"promotion_commodity_quantity"}),
		"dataIndex" : "goodsInfo",
		"cls" : null,
		"width" : "12%",
		render:function(data, type, row){
			 var display ="0";
			 if(data){
				 if(data.length){
					display = data.length;
				 }
			 }
			 return display;
		}
	},*/{
		"title":locale.get({lang:"price_activity_descript"}),
		"dataIndex" : "descript",
		"cls" : null,
		"width" : "25%"
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
	
	var list = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "underWay_list_bar",
					"class" : null
				},
				table : {
					id : "underWay_list_table",
					"class" : null
				},
				paging : {
					id : "underWay_list_paging",
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
				selector : "#underWay_list_table",
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
			cloud.util.mask("#underWay_list_table");
			var self = this;
			var pageDisplay = self.display;
			var status=1;
			
			 var startTime=$("#startTime").val();
             var endTime=$("#endTime").val();
             var name=$("#name").val();
             if(name){
 				name = self.stripscript(name);
 			 }
              var start ='';
              var end ='';
			  if(startTime){
				  start = (new Date(startTime)).getTime()/1000; 
			  }else{
				  start =null;
			  }
			  if(endTime){
				  end = (new Date(endTime)).getTime()/1000; 
			  }else{
				  end =null;
			  }
			  
			  Service.getActivityList(0, pageDisplay,name,status,start,end,function(data) {
				 	var total = data.total;
					this.totalCount = data.result.length;
			        data.total = total;
			        self.listTable.render(data.result);
			        self._renderpage(data, 1);
			        cloud.util.unmask("#underWay_list_table");
			  });
			/*Service.getActivityInfo(0, pageDisplay,status,function(data) {
				console.log(data);
				var total = data.total;
				this.totalCount = data.result.length;
		        data.total = total;
		        self.listTable.render(data.result);
		        self._renderpage(data, 1);
		        cloud.util.unmask("#underWay_list_table");
			});*/
						
		},
		 _renderpage:function(data, start){
	        	var self = this;
	        	if(this.page){
	        		this.page.reset(data);
	        	}else{
	        		this.page = new Paging({
	        			selector : $("#underWay_list_paging"),
	        			data:data,
	    				current:1,
	    				total:data.total,
	    				limit:this.pageDisplay,
	        			requestData:function(options,callback){
	        				 var status=1;
	        				
	        				 var startTime=$("#startTime").val();
	        	             var endTime=$("#endTime").val();
	        	             var name=$("#name").val();
	        	             if(name){
	        	 				name = self.stripscript(name);
	        	 			 }
	        	              var start ='';
	        	              var end ='';
	        				  if(startTime){
	        					  start = (new Date(startTime)).getTime()/1000; 
	        				  }else{
	        					  start =null;
	        				  }
	        				  if(endTime){
	        					  end = (new Date(endTime)).getTime()/1000; 
	        				  }else{
	        					  end =null;
	        				  }
	        				  
	        				  Service.getActivityList(options.cursor, options.limit,name,status,start,end,function(data) {
	        					  callback(data);
	        				  });
	        				/*Service.getActivityInfo(options.cursor, options.limit,status,function(data){
	   							   callback(data);
		        			});*/

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
				selector : "#underWay_list_bar",
				events : {
					  query: function(name,startTime,endTime){//查询
							 var pageDisplay = self.display;
							 var status =1;
							 if(name){
									name = self.stripscript(name);
							 }
							 var start ='';
							  if(startTime){
								  start = (new Date(startTime)).getTime()/1000; 
							  }else{
								  start =null;
							  }
						     if(endTime){
						    	 var end = (new Date(endTime)).getTime()/1000;
								if(endTime>startTime){
									cloud.util.mask("#underWay_list_table");
									Service.getActivityList(0, pageDisplay,name,status,start,end,function(data) {
										 var total = data.total;
										 this.totalCount = data.result.length;
									     data.total = total;
										 self.listTable.render(data.result);
										 self._renderpage(data, 1);
										 cloud.util.unmask("#underWay_list_table");
								    });
								}else{
									dialog.render({lang:"endtime_greater_starttime"});
								}
						     }else{
						    	 var end =null;
						    	 cloud.util.mask("#underWay_list_table");
						    	 Service.getActivityList(0, pageDisplay,name,status,start,end,function(data) {
									 var total = data.total;
									 this.totalCount = data.result.length;
								     data.total = total;
									 self.listTable.render(data.result);
									 self._renderpage(data, 1);
									 cloud.util.unmask("#underWay_list_table");
							    });
						     }
							
							 
					  },
					  add:function(){//添加
						  if(this.addActivity){
							  this.addActivity.destroy();
	                  	  }
	                  	  this.addActivity = new AddActivity({
	                  		  selector:"body",
		                  		events : {
	                  				"getList":function(){
	                  					 self.loadData();
	                  				}
	                  			}
	                  	  });						  
						  
					  },
					  modify:function(){//修改
						var selectedResouces = self.getSelectedResources();
                 		 if (selectedResouces.length === 0) {
	 							dialog.render({lang:"please_select_at_least_one_config_item"});
	 				     }else{
	 				    	this.updateActivity = new UpdateActivity({
		                  		  selector:"body",
		                  		  ids:selectedResouces[0]._id,
			                  		events : {
		                  				"getGoodsList":function(){
		                  					 self.loadData();
		                  				}
		                  			}
		                  		  
		                  	  });	
	 					 }
						 
					  },
					  see:function(){//查看
						  /*var selectedResouces = self.getSelectedResources();
						  
						  if (selectedResouces.length === 0) {
	 							dialog.render({lang:"please_select_at_least_one_config_item"});
	 				      }else if(selectedResouces.length >= 2){
	 				    	    dialog.render({lang:"select_one_gateway"});
	 				      }else{
	 				    	  var _id = selectedResouces[0]._id;
		 					  if(this.seeActivity){
								  this.seeActivity.destroy();
		                  	  }
		                  	  this.seeActivity = new SeeActivity({
		                  		  selector:"body",
		                  		  activityId:_id
		                  	  });		 
		 				  }*/
					  },
					  end:function(){//结束
						  var selectedResouces = self.getSelectedResources();
	                 	  if (selectedResouces.length === 0) {
	                 		  dialog.render({lang:"please_select_at_least_one_config_item"});
		 				  }else{
		 					 dialog.render({
				    				lang:"affirm_end",
				    				buttons: [{
				    					lang:"affirm",
				    					click:function(){
				    						for(var i=0;i<selectedResouces.length;i++){
						 				    	 var _id = selectedResouces[i]._id;
						 				    	 var data={
						 				    			endStyle:"1",
						 				    			status:"0"
						 				    	 };
						 				    	 Service.updateActivityInfo(_id,data,function(data){
							 				    		 self.loadData();
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