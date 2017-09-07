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
	var Service = require("../service");
	 //计算时间---将秒换算成XX小时XX分钟XX秒
    function computationTime(seconds){
        seconds *= 1;
        var strTime = "";
        if(seconds < 60){
            strTime = seconds + locale.get("seconds");
        }else if(seconds >= 60 && seconds < 3600){
            strTime += saveInteger(seconds % (60 * 60) / 60) + locale.get("minutes");
            strTime += seconds % 60 + locale.get("seconds");
        }else if(seconds > 3600 && seconds < 3600 * 24){
            strTime += saveInteger(seconds / (60 * 60)) + locale.get("hours");
            strTime += saveInteger(seconds % (60 * 60) / 60) + locale.get("minutes");
            strTime += seconds % 60 + locale.get("seconds");
        }else{
            strTime += saveInteger(seconds / (60 * 60 * 24)) + locale.get("days");
            strTime += saveInteger(seconds / (60 * 60) % 24) + locale.get("hours");
            strTime += saveInteger(seconds % (60 * 60) / 60) + locale.get("minutes");
            strTime += seconds % 60 + locale.get("seconds");
        }
        return strTime;
    }

    function saveInteger(data){
        data += "";
        if(data.indexOf(".") > 0){
            data = data.substring(0,data.indexOf("."));
        }
        return data;
    }

	var columns = [{
		"title":locale.get({lang:"alarm_produce_time"}),//产生时间
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "12%",
		render:dateConvertor
    },
	{
		"title":locale.get({lang:"line_man_name"}),//线路名称
		"dataIndex" : "lineName",
		"cls" : null,
		"width" : "10%"
	}, {
		"title":locale.get({lang:"site_name"}),//点位名称
		"dataIndex" : "siteName",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"trade_automat_number"}),//售货机编号
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "10%"
	}, {
		"title":locale.get({lang:"traffic_automat_name"}),//售货机名称
		"dataIndex" : "deviceName",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"alarm_type"}),//告警类型
		"dataIndex" : "event_class",
		"cls" : null,
		"width" : "10%",
		 render: function(data, type, row) {
             var display = "";
             if (data) {
                if(data == 9001){
               	   display = locale.get({lang: "automat_system_failure"});//系统故障
                }else if(data == 9002){
               	   display = locale.get({lang: "automat_note_machine_fault"});//纸币器故障
                }else if(data == 9003){
               	   display = locale.get({lang: "automat_coin_device_failure"});//硬币器故障
                }else if(data == 9004){
               	   display = locale.get({lang: "automat_communication_failure"});//通讯故障
                }else if(data == 90051){
               	   display = locale.get({lang: "network_connection_exception"});//网络连接异常
                }else if(data == 90052){
               	   display = locale.get({lang: "be_out_of_stock"});//缺货
                }
             } else {
                 display = '';
             }
             return display;
         }
	},{
		"title":locale.get({lang:"automat_content"}),//告警内容
		"dataIndex" : "content",
		"cls" : null,
		"width" : "10%",
		render: function (data, type, row){
			 var display ='';
			 if(row.event_class == 90052){
				 if(row.cid){
					 if(row.assetId == row.cid){
						 display = locale.get({lang:"automat_cargo_road_id"})+data+locale.get({lang:"goods_out_of_stock"});
					 }else{
						 display=locale.get({lang:"device_shelf_number"})+row.cid+","+data+locale.get({lang:"goods_out_of_stock"});
					 }
				 }
			 }else{
				    if(data == "90011"){
		           	   display = locale.get({lang:"90011"});
		            }else if(data == "90012"){
		           	   display = locale.get({lang:"90012"});
		            }else if(data == "90013"){
		           	   display = locale.get({lang:"90013"});
		            }else if(data == "90014"){
		           	   display = locale.get({lang:"90014"});
		            }else if(data == "90015"){
		           	   display = locale.get({lang:"90015"});
		            }else if(data == "90016"){
		           	   display = locale.get({lang:"90016"});
		            }else if(data == "90021"){
		           	   display = locale.get({lang:"90021"});
		            }else if(data == "90022"){
		           	   display = locale.get({lang:"90022"});
		            }else if(data == "90023"){
		           	   display = locale.get({lang:"90023"});
		            }else if(data == "90024"){
		           	   display = locale.get({lang:"90024"});
		            }else if(data == "90025"){
		           	   display = locale.get({lang:"90025"});
		            }else if(data == "90026"){
		           	   display = locale.get({lang:"90026"});
		            }else if(data == "90027"){
		           	   display = locale.get({lang:"90027"});
		            }else if(data == "90028"){
		         	   display = locale.get({lang:"90028"});
		            }else if(data == "90031"){
		           	   display = locale.get({lang:"90031"});
		            }else if(data == "90032"){
		           	   display = locale.get({lang:"90032"});
		            }else if(data == "90033"){
		           	   display = locale.get({lang:"90033"});
		            }else if(data == "90034"){
		           	   display = locale.get({lang:"90034"});
		            }else if(data == "90035"){
		           	   display = locale.get({lang:"90035"});
		            }else if(data == "90036"){
		           	   display = locale.get({lang:"90036"});
		            }else if(data == "90037"){
		           	   display = locale.get({lang:"90037"});
		            }else if(data == "90038"){
		           	   display = locale.get({lang:"90038"});
		            }else if(data == "90039"){
		           	   display = locale.get({lang:"90039"});
		            }else if(data == "900311"){
		           	   display = locale.get({lang:"900311"});
		            }else if(data == "90041"){
		           	   display = locale.get({lang:"90041"});
		            }else if(data == "90042"){
		           	   display = locale.get({lang:"90042"});
		            }else if(data == "90043"){
		           	   display = locale.get({lang:"90043"});
		            }else if(data == "90044"){
		           	   display = locale.get({lang:"90044"});
		            }else if(data == "90045"){
		           	   display = locale.get({lang:"90045"});
		            }else if(data == "90046"){
		           	   display = locale.get({lang:"90046"});
		            }else if(data == "90047"){
		           	   display = locale.get({lang:"90047"});
		            }else if(data == "90048"){
		           	   display = locale.get({lang:"90048"});
		            }
			 }
			 
            return display;
        }
    }, {
		"title":locale.get({lang:"alarm_level"}),//告警级别
		"dataIndex" : "la",
		"cls" : null,
		"width" : "10%",
		 render: function(data, type, row) {
			 var display = "";
			 
			 if(data){
				var level = data.level;
				var state = data.action;
				if(level){
					if(level == 3){
						var bgcolor = "red"; 
						
					    display = "<table style='width:100%;height: 100%;background:"+bgcolor+";color:white;'>"+
					               "<tr>"+
					               "<td style='text-align: center; vertical-align: middle;'>"+
					               locale.get({lang:"event_minor_alarm"})+
					               "</td>"+
					               "</tr>"+
					               "</table>";
					}else if(level == 2){
						var bgcolor = "#ff9933"; 

						 display = "<table style='width:100%;height: 100%;background:"+bgcolor+";color:white;'>"+
					               "<tr>"+
					               "<td style='text-align: center; vertical-align: middle;'>"+
					               locale.get({lang:"event_important_warning"})+
					               "</td>"+
					               "</tr>"+
					               "</table>";
					}else if(level == 1){
						var bgcolor = "#ffd700"; 

						 display = "<table style='width:100%;height: 100%;background:"+bgcolor+";color:white;'>"+
					               "<tr>"+
					               "<td style='text-align: center; vertical-align: middle;'>"+
					               locale.get({lang:"event_admonish"})+
					               "</td>"+
					               "</tr>"+
					               "</table>";
					}
					
				}else{
					display = '';
				}
				
			 }else{
				 display = '';
			 }
			 return display;
		 }
	},{
		"title":locale.get({lang:"duration_time"}),//持续时间
		"dataIndex" : "startTime",
		"cls" : null,
		"width" : "10%",
		 render: function (data, type, row){
			 var display ='';
			 if(row && row.endTime){//结束
				 display = row.endTime - data;
			 }
             return computationTime(display);
         }
    }, {
		"title":locale.get({lang:"state"}),//状态
		"dataIndex" : "action",
		"cls" : null,
		"width" : "10%",
		render:stateConvertor
    },{
		"title" : "",
		"dataIndex" : "id",
		"cls" : "_id" + " " + "hide"
	}];
	function dateConvertor(value, type) {
		if(type === "display"){
			return cloud.util.dateFormat(new Date(value), "yyyy-MM-dd hh:mm:ss");
		}else{
			return value;
		}
	}
	function stateConvertor(value,type){
		var display = "";
		var value = parseInt(value);
		if("display"==	type){// 1 产生状态  2 自动恢愎   3  手动恢愎
			switch (value) {
				case 1:
					display = locale.get({lang:"alarm_produce"});
					break;
				case 2:
					display = "<div style='float:left;line-height: 36px;'><span>"+locale.get({lang:"automatic_recovery"})+"</span></div><div class='repair'></div>";

					break;
				/*case 3:
					display = "<div style='float:left;'><span>"+locale.get({lang:"manual_recovery"})+"</span></div><div class='repair'></div>";
					//display = "<span>"+locale.get({lang:"manual_recovery"})+"</span><span class='repair'></span>";*/

					break;
				default:
					break;
			}
			return display;
		}else{
			return value;
		}
	}
	
	var alarmlist = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = 30;
			this.pageDisplay = 30;
			
			this.elements = {
				bar : {
					id : "alarm_list_bar",
					"class" : null
				},
				table : {
					id : "alarm_list_table",
					"class" : null
				},
				paging : {
					id : "alarm_list_paging",
					"class" : null
				}
			};
			this.render();
		},
		render:function(){
			this._renderHtml();
			$("#alarm_list").css("width",$(".wrap").width());
			$("#alarm_list_paging").css("width",$(".wrap").width());
			
			$("#alarm_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#alarm_list").height();
		    var barHeight = $("#alarm_list_bar").height();
		    var pageHeight = $("#alarm_list_paging").height();
			var tableHeight=listHeight - barHeight - pageHeight - 5;
			
			$("#alarm_list_table").css("height",tableHeight);
			
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
				selector : "#alarm_list_table",
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
			var height = $("#alarm_list_table").height()+"px";
	        $("#alarm_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadData(0,30);
		},
		loadData : function(cursor,limit) {
			 var self = this;
            var areaId = "";
	         var lineId = "";
	            
	         if($("#userarea").attr("multiple") != undefined){
	            areaId = $("#userarea").multiselect("getChecked").map(function() {//
		                return this.value;
		        }).get();
	            lineId = $("#lineIds").multiselect("getChecked").map(function() {//
	                    return this.value;
	            }).get();
	         }

            var lineFlag = 1;
            if(areaId.length != 0){
             	   if($("#userline").find("option").length <=0){
                  	lineFlag = 0;
                  }
            }
              var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
              var roleType = permission.getInfo().roleType;
              Service.getAreaByUserId(userId,function(areadata){
           	   var areaIds=[];
                  if(areadata && areadata.result && areadata.result.area && areadata.result.area.length>0){
                  	areaIds = areadata.result.area;
                  }
                  if(roleType == 51){
                  	areaIds = [];
                  }
                  if(areaId.length != 0){
                  	areaIds = areaId;
                  }
                  
                  if(roleType != 51 && areaIds.length == 0){
                  	areaIds = ["000000000000000000000000"];
                  }
                  cloud.Ajax.request({
  	   	    	      url:"api/automatline/list",
  			    	  type : "GET",
  			    	  parameters : {
  			    		  areaId: areaIds,
  			    		  cursor:0,
  			    		  limit:-1
  	                  },
  			    	  success : function(linedata) {
  			    		  var lineIds=[];
			    		  if(linedata && linedata.result && linedata.result.length>0){
			    			  for(var i=0;i<linedata.result.length;i++){
			    				  lineIds.push(linedata.result[i]._id);
			    			  }
		                   }
			    		  
			    		  if(roleType == 51 && areaId.length == 0){
			    			  lineIds = [];
			              }
			    		  if(lineId.length != 0){
			    			  lineIds = lineId;
			    		  }else{
			    			  if(lineFlag == 0){
			    				  lineIds = ["000000000000000000000000"];
			    			  }
			    		  }
			    		  
			    		  if(roleType != 51 && lineIds.length == 0){
			    			   lineIds = ["000000000000000000000000"];
			    		  }
			              self.lineIds = lineIds;
			              
			             var pageDisplay = self.display;
			             cloud.util.mask("#alarm_list_table");
			             var assetId = $("#assetId").val();
			             var siteName = $("#siteName").val();
			             var state = $("#state").find("option:selected").val();
			             var level = $("#level").find("option:selected").val();
			             var type = $("#type").find("option:selected").val();
			             
			             var startTime=$("#times_date").val();
			             var endTime=$("#times_enddate").val();
			             var start = '';
			             var end = '';
			             if(startTime){
			             	start = (new Date(startTime + " 00:00:00")).getTime() / 1000;
			             }
			             if(endTime){
			                 end = (new Date(endTime + " 23:59:59")).getTime() / 1000;
			             }   
			             
			             if(state && state!=0){
			             }else{
			            	 state='';
			             }
			             if(level && level!=0){
			             }else{
			            	 level='';
			             }
			             if(type && type!=0){
			             }else{
			            	 type='';
			             }
			             self.searchData={
			            		 assetId:assetId,
			            		 siteName:siteName,
			            		 action:state,
			            		 level:level,
			            		 event_class:type,
			            		 startTime:start,
			            		 endTime:end,
			            		 lineId: lineIds,
			            		 event_type:2//告警
			             };
			             Service.getAlarmList(self.searchData, limit, cursor, function(data) {
			                   var total = data.result.length;
			                   self.pageRecordTotal = total;
			                   self.totalCount = data.result.length;
			                  
			                   self.alarmlistTable.render(data.result);
			                   self._renderpage(data, 1);
			                   cloud.util.unmask("#alarm_list_table");
			             }, self);  
			             
  			    	  }
                  });  
              });
		},
		/*loadData : function(cursor,limit) {
			 var self = this;
			 require(["cloud/lib/plugin/jquery.multiselect"], function() {
				  var lineIds = $("#lineIds").multiselect("getChecked").map(function() {//线路
	                    return this.value;
	                }).get();
				  cloud.util.mask("#alarm_list_table");
		             var assetId = $("#assetId").val();
		             var siteName = $("#siteName").val();
		             var state = $("#state").find("option:selected").val();
		             var level = $("#level").find("option:selected").val();
		             var type = $("#type").find("option:selected").val();
		             
		             var startTime=$("#times_date").val();
		             var endTime=$("#times_enddate").val();
		             var start = '';
		             var end = '';
		             if(startTime){
		             	start = (new Date(startTime + " 00:00:00")).getTime() / 1000;
		             }
		             if(endTime){
		                 end = (new Date(endTime + " 23:59:59")).getTime() / 1000;
		             }   
		             
		             if(state && state!=0){
		             }else{
		            	 state='';
		             }
		             if(level && level!=0){
		             }else{
		            	 level='';
		             }
		             if(type && type!=0){
		             }else{
		            	 type='';
		             }
		             self.searchData={
		            		 assetId:assetId,
		            		 siteName:siteName,
		            		 action:state,
		            		 level:level,
		            		 event_class:type,
		            		 startTime:start,
		            		 endTime:end,
		            		 lineId: lineIds,
		            		 event_type:2//告警
		             };
		             Service.getAlarmList(self.searchData, limit, cursor, function(data) {
		                   var total = data.result.length;
		                   self.pageRecordTotal = total;
		                   self.totalCount = data.result.length;
		                  
		                   self.alarmlistTable.render(data.result);
		                   self._renderpage(data, 1);
		                   cloud.util.unmask("#alarm_list_table");
		             }, self);  
			 });
            
						
		},*/
		 _renderpage:function(data, start){
	        	var self = this;
	        	if(this.page){
	        		this.page.reset(data);
	        	}else{
	        		this.page = new Paging({
	        			selector : $("#alarm_list_paging"),
	        			data:data,
	    				current:1,
	    				total:data.total,
	    				limit:this.pageDisplay,
	        			requestData:function(options,callback){
	        				cloud.util.mask("#alarm_list_table");
	                        Service.getAlarmList(self.searchData, options.limit, options.cursor, function(data) {
	                            self.pageRecordTotal = data.total - data.cursor;
	                            callback(data);
	                            cloud.util.unmask("#alarm_list_table");
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
				selector : "#alarm_list_bar",
				events : {
					  query: function(){//查询
						  self.loadData(0,$(".paging-limit-select").val());
					  },
					  recovery:function(){
						  var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length === 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else if (selectedResouces.length >= 2) {
	                            dialog.render({lang: "select_one_gateway"});
	                        } else {
	                        	var _id = selectedResouces[0]._id;
	                        	if(selectedResouces[0].action){
	                        		if(selectedResouces[0].action =='2' || selectedResouces[0].action =='3'){
	                        			 dialog.render({lang: "this_alarm_is_automatically_restored"});
		                                 return;
	                        		}else{
	                        			 dialog.render({
			                                 lang: "confirm_recovery",
			                                 buttons: [{
			                                         lang: "affirm",
			                                         click: function() {
			                                             cloud.util.mask("#alarm_list_table");
			                                             Service.updateAlarm(_id, function(data) {
			             	                        		cloud.util.unmask("#alarm_list_table");
			             	                        		self.loadData(0,$(".paging-limit-select").val());
			             	                        	});
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