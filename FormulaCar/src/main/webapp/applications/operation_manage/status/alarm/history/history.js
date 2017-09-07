define(function(require) {
	var cloud = require("cloud/base/cloud");
	var html = require("text!./history.html");
	require("cloud/lib/plugin/jquery-ui");
	var NoticeBar = require("./notice-bar");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var validator = require("cloud/components/validator");
	var Service = require("../../../service");
	var columns = [/*{
		"title":locale.get({lang:"automat_event_type"}),
		"dataIndex" : "event_type",
		"cls" : null,
		"width" : "10%",
		render:stateConvertor
	}, */{
		"title":locale.get({lang:"automat_createTime"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "15%",
		render:dateConvertor
	}, {
		"title":locale.get({lang:"history_removal"}),
		"dataIndex" : "endTime",
		"cls" : null,
		"width" : "15%",
		render:dateConvertor
	}, {
		"title":locale.get({lang:"automat_siteName"}),
		"dataIndex" : "siteName",
		"cls" : null,
		"width" : "10%"
	}, {
		"title":locale.get({lang:"automat_deviceName"}),
		"dataIndex" : "deviceName",
		"cls" : null,
		"width" : "15%"
	},{
		"title":locale.get({lang:"automat_event_code"}),
		"dataIndex" : "event_type",
		"cls" : null,
		"width" : "15%",
		render:codeConvertor
	}, {
		"title":locale.get({lang:"automat_event_desc"}),
		"dataIndex" : "event_desc",
		"cls" : null,
		"width" : "20%"
	}, {
		"title":locale.get({lang:"automat_level"}),
		"dataIndex" : "level",
		"cls" : null,
		"width" : "10%",
		render:levelConvertor
    },{
		"title" : "",
		"dataIndex" : "id",
		"cls" : "_id" + " " + "hide"
	} ];
	function dateConvertor(value, type) {
		if(type === "display"){
			return cloud.util.dateFormat(new Date(value), "yyyy-MM-dd hh:mm:ss");
		}else{
			return value;
		}
	}
	function levelConvertor(value,type){
		var display = "";
		if("display"==	type){
			switch (value) {
			case 1:
				display = locale.get({lang:"event_warn"});
				break;
			case 2:
				display = locale.get({lang:"event_admonish"});
				break;
			case 3:
				display = locale.get({lang:"event_minor_alarm"});
				break;
			case 4:
				display = locale.get({lang:"event_important_warning"});
				break;
				default:
					break;
			}
			return display;
		}else{
			return value;
		}
	}
	function codeConvertor(value,type){
		var display = "";
		if("display"==	type){
			switch (value) {
			      case 1:
			  	      display = locale.get({lang:"be_out_of_stock"});//缺货
				      break;
			      case 2:
				      display = locale.get({lang:"the_lack_of_currency"});//缺币
				      break;
			      case 3:
				      display = locale.get({lang:"breakdown"});//故障
				      break;
			      case 4:
				      display = locale.get({lang:"10002"});//网络异常
				      break;
			      case 5:
				      display = locale.get({lang:"the_local_cargo_road_of_the_vending_machine_is_changed"});//售货机本地货道发生变化事件
				      break
			      default:
				      break;
			}
			return display;
		}else{
			return value;
		}
	}
	function stateConvertor(value,type){
		var display = "";
		if("display"==	type){
			switch (value) {
				case 1:
					display = locale.get({lang:"event_event"});
					break;
				case 2:
					display = locale.get({lang:"event_alarm"});
					break;
				default:
					break;
			}
			return display;
		}else{
			return value;
		}
	};
	var history = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "history-bar",
					"class" : null
				},
				table : {
					id : "history-table",
					"class" : null
				},
				paging : {
					id : "history-paging",
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
			this.historyTable = new Table({
				selector : "#history-table",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "full",
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
			 var self = this;
			 var pageDisplay = this.display;
			 var type=$("#type").val();
             var startTime=$("#startTime").val();
             var endTime=$("#endTime").val();
             var search=$("#search").val();
             var searchValue=$("#searchValue").val();
             
             var start ='';
             if(startTime){
            	 start = (new Date(startTime)).getTime()/1000;  
             }else{
				  start =null;
			  }
             var end ='';
             if(endTime){
            	 end = (new Date(endTime)).getTime()/1000;  
             }else{
            	 end =null;
			  }
             if(search){
            	 
             }else{
            	 search = 0;
             }
             if(type){
            	 
             }else{
            	 type = 0;
             }
             if(searchValue){
            	 searchValue = self.stripscript(searchValue);
 			 }
            cloud.util.mask("#history-table");
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getLinesByUserId(userId,function(linedata){
                 var lineIds=[];
                 if(linedata.result && linedata.result.length>0){
	    			  for(var i=0;i<linedata.result.length;i++){
	    				  lineIds.push(linedata.result[i]._id);
	    			  }
                 }
                 if(roleType == 51){
		    			 lineIds = [];
                 }
                 if(roleType != 51 && lineIds.length == 0){
                	 lineIds = ["000000000000000000000000"];
	             }
                 self.lineIds = lineIds;
                 
	             Service.getAlarmList(0, pageDisplay,1,type,start,end, search,searchValue,self.lineIds,null,function(data) {
					var total = data.total;
				    this.totalCount = data.result.length;
	                data.total = total;
	                self.historyTable.render(data.result);
	                self._renderpage(data, 1);
	                cloud.util.unmask("#history-table");
				 });
            });
						
		},
		 _renderpage:function(data, start){
	        	var self = this;
	        	if(this.page){
	        		this.page.reset(data);
	        	}else{
	        		this.page = new Paging({
	        			selector : $("#history-paging"),
	        			data:data,
	    				current:1,
	    				total:data.total,
	    				limit:this.pageDisplay,
	        			requestData:function(options,callback){
	        				cloud.util.mask("#history-table");
	        				 var type=$("#type").val();
	        	             var startTime=$("#startTime").val();
	        	             var endTime=$("#endTime").val();
	        	             var search=$("#search").val();
	        	             var searchValue=$("#searchValue").val();
	        	             
	        	             var start ='';
	        	             if(startTime){
	        	            	 start = (new Date(startTime)).getTime()/1000;  
	        	             }else{
	        					  start =null;
	        				  }
	        	             var end ='';
	        	             if(endTime){
	        	            	 end = (new Date(endTime)).getTime()/1000;  
	        	             }else{
	        	            	 end =null;
	        				  }
	        	             if(search){
	        	            	 
	        	             }else{
	        	            	 search = 0;
	        	             }
	        	             if(type){
	        	            	 
	        	             }else{
	        	            	 type = 0;
	        	             }
	        	             if(searchValue){
	        	            	 searchValue = self.stripscript(searchValue);
	        	 			 }
	        	             Service.getAlarmList(options.cursor, options.limit,1,type,start,end, search,searchValue,self.lineIds,null,function(data) {
    							   callback(data);
    							   cloud.util.unmask("#history-table");
	        				 });

	        			},
	        			turn:function(data, nowPage){
	        			    self.totalCount = data.result.length;
	        			    self.historyTable.clearTableData();
	        			    self.historyTable.render(data.result);
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
				selector : "#history-bar",
				events : {
					query: function(type,startTime,endTime,search,searchValue){//查询
						 var pageDisplay =  self.display;
						 var start ='';
						 
						 var start ='';
	        	         if(startTime){
	        	             start = (new Date(startTime)).getTime()/1000;  
	        	         }else{
	        				 start =null;
	        		     }
						 if(searchValue){
							 searchValue = self.stripscript(searchValue);
						 }
						 
						 if(searchValue){
							 searchValue = self.stripscript(searchValue);
						 }
						 if(endTime){
					    	 var end = (new Date(endTime)).getTime()/1000;
							 if(endTime>startTime){
								 cloud.util.mask("#history-table");
								 Service.getAlarmList(0, pageDisplay,1,type,start,end, search,searchValue,self.lineIds,null,function(data) {
									 var total = data.result.length;
									 this.totalCount = data.result.length;
									 data.total = total;
									 self.historyTable.render(data.result);
									 self._renderpage(data, 1);
									 cloud.util.unmask("#history-table");
							    });
							 }else{
								dialog.render({lang:"endtime_greater_starttime"});
							 }
						 }else{
					    	 var end =null;
					    	 cloud.util.mask("#history-table");
							 Service.getAlarmList(0, pageDisplay,1,type,start,end, search,searchValue,self.lineIds,null,function(data) {
								 var total = data.result.length;
								 this.totalCount = data.result.length;
								 data.total = total;
								 self.historyTable.render(data.result);
								 self._renderpage(data, 1);
								 cloud.util.unmask("#history-table");
						    });
					     }
						 
					  }
					}
			});
		}
	});
	return history;
});