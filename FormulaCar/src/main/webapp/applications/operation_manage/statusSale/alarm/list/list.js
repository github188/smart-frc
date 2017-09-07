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
	var Service = require("../../../service");
	var columns = [
	/*{ 
		"title":locale.get({lang:"automat_event_type"}),
		"dataIndex" : "event_type",
		"cls" : null,
		"width" : "10%",
		render:stateConvertor
	},*/ {
		"title":locale.get({lang:"site_name"}),
		"dataIndex" : "siteName",
		"cls" : null,
		"width" : "15%"
	}, {
		"title":locale.get({lang:"automat_assetId"}),
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "15%"
	},{
		"title":locale.get({lang:"automat_event_code"}),
		"dataIndex" : "event_type",
		"cls" : null,
		"width" : "10%",
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
		"title":locale.get({lang:"automat_event_status"}),
		"dataIndex" : "event_status",
		"cls" : null,
		"width" : "10%",
		render:statusConvertor
    }, {
		"title":locale.get({lang:"content_description"}),
		"dataIndex" : "content_desc",
		"cls" : null,
		"width" : "20%"
    },{
		"title" : "",
		"dataIndex" : "id",
		"cls" : "_id" + " " + "hide"
	} ,{
		"title":locale.get({lang:"automat_createTime"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "15%",
		render:dateConvertor
	}];
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
	function statusConvertor(value,type){
		var display = "";
		var value = parseInt(value);
		if("display"==	type){
			switch (value) {
				case 0:
					display = locale.get({lang:"automat_event_status_0"});
					break;
				case 1:
					display = locale.get({lang:"automat_event_status_1"});
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
					display = "售货机应用";//售货机本地货道发生变化事件
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
				case 0:
					display = locale.get({lang:"event_event"});
					break;
				case 1:
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
	var alarmlist = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = 30;
			this.pageDisplay = 30;
			
			this.elements = {
				bar : {
					id : "automat_list-bar",
					"class" : null
				},
				table : {
					id : "automat_list-table",
					"class" : null
				},
				paging : {
					id : "automat_list-paging",
					"class" : null
				}
			};
			this.render();
		},
		render:function(){
			this._renderHtml();
			$("#automats_list").css("width",$(".wrap").width());
			$("#automat_list-paging").css("width",$(".wrap").width());
			
			$("#automats_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#automats_list").height();
		    var barHeight = $("#automat_list-bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#automat_list-table").css("height",tableHeight);
			
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
			this.alarmlistTable = new Table({
				selector : "#automat_list-table",
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
			this.loadData(0,30);
		},
		loadData : function(cursor,limit) {
			
			 var self = this;
			 var pageDisplay = this.display;
			 var type=$("#type").val();
            // var startTime=$("#startTime").val();
            // var endTime=$("#endTime").val();
             var search=$("#search").val();
             var searchValue=$("#searchValue").val();
             var startTime=$("#times_date").val();
             var endTime=$("#times_enddate").val();
             var start = '';
             var end = '';
             if(startTime){
             	start = (new Date(startTime + " 00:00:00")).getTime() / 1000;
              //   end = (new Date(startTime + " 23:59:59")).getTime() / 1000;
             }
             if(endTime!=""){
                 end = (new Date(endTime + " 23:59:59")).getTime() / 1000;
             }   
             
//             var start ='';
//             if(startTime){
//            	 start = (new Date(startTime)).getTime()/1000;  
//             }else{
//				  start =null;
//			  }
//             var end ='';
//             if(endTime){
//            	 end = (new Date(endTime)).getTime()/1000;  
//             }else{
//            	 end =null;
//			  }
             if(searchValue){
            	 searchValue = self.stripscript(searchValue);
 			 }
             if(search){
            	 
             }else{
            	 search = 0;
             }
             if(type){
            	 
             }else{
            	 type = 0;
             }
             
            cloud.util.mask("#automat_list-table");
            
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

            	 Service.getAlarmList(cursor, limit,0,type,start,end, search,searchValue,self.lineIds,null,function(data) {
      				
      				var total = data.total;
      				this.totalCount = data.result.length;
      		        data.total = total;
      		        self.alarmlistTable.render(data.result);
      		        self._renderpage(data, 1);
      		        cloud.util.unmask("#automat_list-table");
      			 });
                 
            });
			
		   
						
		},
		 _renderpage:function(data, start){
	        	var self = this;
	        	if(this.page){
	        		this.page.reset(data);
	        	}else{
	        		this.page = new Paging({
	        			selector : $("#automat_list-paging"),
	        			data:data,
	    				current:1,
	    				total:data.total,
	    				limit:this.pageDisplay,
	        			requestData:function(options,callback){
	        				cloud.util.mask("#automat_list-table");
	        				 var type=$("#type").val();
	        	            // var startTime=$("#startTime").val();
	        	           //  var endTime=$("#endTime").val();
	        	             var search=$("#search").val();
	        	             var searchValue=$("#searchValue").val();
	        	             var startTime=$("#times_date").val();
	        	             var endTime=$("#times_enddate").val();
	        	             var start = '';
	        	             var end = '';
	        	             if(startTime){
	        	             	start = (new Date(startTime + " 00:00:00")).getTime() / 1000;
	        	               //  end = (new Date(startTime + " 23:59:59")).getTime() / 1000;
	        	             }
	        	             if(endTime){
	        	                 end = (new Date(endTime + " 23:59:59")).getTime() / 1000;
	        	             } 
//	        	             var start ='';
//	        	             if(startTime){
//	        	            	 start = (new Date(startTime)).getTime()/1000;  
//	        	             }else{
//	        					  start =null;
//	        				  }
//	        	             var end ='';
//	        	             if(endTime){
//	        	            	 end = (new Date(endTime)).getTime()/1000;  
//	        	             }else{
//	        	            	 end =null;
//	        				  }
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
	        				  Service.getAlarmList(options.cursor, options.limit,0,type,start,end, search,searchValue,self.lineIds,null,function(data) {
      							   callback(data);
      							 cloud.util.unmask("#automat_list-table");
	        				   });
	        			},
	        			turn:function(data, nowPage){
	        			    self.totalCount = data.result.length;
	        			    self.alarmlistTable.clearTableData();
	        			    self.alarmlistTable.render(data.result);
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
				selector : "#automat_list-bar",
				events : {
					  query: function(type,startTime,endTime,search,searchValue){//查询
						  self.loadData(0,$(".paging-limit-select").val());
						 
					  },
					  update:function(){//修改
						  var selectedResouces = self.getSelectedResources();
	                 	  if (selectedResouces.length === 0) {
	                 		  dialog.render({lang:"please_select_at_least_one_config_item"});
		 				  }else{
		 					 for(var i=0;i<selectedResouces.length;i++){
		 				    	 var _id = selectedResouces[i].event_id;
		 				    	 Service.updateAlarm(_id,function(data){
		 				    		 self.loadData();
		 				    		 dialog.render({lang:"update_success"});
		 				    	 });
		 				     }
		 				  }
					  }
					}
			});
		},
		getSelectedResources:function(){
        	var self = this;
        	var selectedRes = $A();
        	self.alarmlistTable && self.alarmlistTable.getSelectedRows().each(function(row){
        		selectedRes.push(self.alarmlistTable.getData(row));
        	});
        	return selectedRes;
        }
	});
	return alarmlist;
});