define(function(require) {
    require("cloud/base/cloud");
    var Common = require("../../common/js/common");
    var Service = Class.create({
        initialize: function(){
        },
        getLinesByUserId: function(userId, callback, context) {
        	cloud.Ajax.request({
	    	      url:"api/smartUser/"+userId,
		    	  type : "GET",
		    	  success : function(data) {
		    		  if(data && data.result && data.result.area){
		    			  cloud.Ajax.request({
			   	    	      url:"api/automatline/list",
					    	  type : "GET",
					    	  parameters : {
					    		  areaId: data.result.area,
					    		  cursor:0,
					    		  limit:-1
			                  },
					    	  success : function(data) {
					    		  callback.call(context || this, data);
					    	  }
		    			  });
		    		  }else{
		    			  callback.call(context || this, data); 
		    		  }
		    	  }
          });
        },
        createTradeExcel: function(lineIds,sn,time,assetId,language,callback,context) {
   			var parameters = {};
   			if(time != null){
   				parameters.time = time;
   			}
   			
   			if(lineIds != null && lineIds.length >0){
   				parameters.lineId = lineIds;
   			}
   			
   			if(sn != null && sn != ""){
   				parameters.serialNumber = sn;
   			}
   			if(assetId != null && assetId != ""){
   				parameters.assetId = assetId;
   			}
   			if (language!=null&&language!="") {
   				parameters.language=language;
			}
   	    	cloud.Ajax.request({
   	    	   url : "api/vmreports/trade/create",
	   	       type : "get",
	   	       parameters : parameters,
	   	       success : function(data) {
	   	              callback.call(context || this, data);
	   	        }
	   	    });
		},
		createReplenishExcel: function(oid,time,ids,language,callback,context) {
   			var parameters = {};
   			if (oid != null && oid != "") {
   				parameters.oid = oid;
			}
   			if (time != null && time != "") {
   				parameters.time = time;
			}
   			if(ids != null && ids.length >0){
   				parameters.ids = ids;
   			}

   			if (language!=null&&language!="") {
   				parameters.language=language;
			}
   	    	cloud.Ajax.request({
   	    	   url : "api/vmreports/replenish/record",
	   	       type : "get",
	   	       parameters : parameters,
	   	       success : function(data) {
	   	              callback.call(context || this, data);
	   	        }
	   	    });
		},
		findTradeExcel:function(time,report_name,callback,context){
			cloud.Ajax.request({
                url : "api/vmreports/findTradeExcel",
                type : "get",
                parameters : {
                	path : "/home/replenish/"+time+"/"+report_name
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		 },
        getTradeList:function(start,limit,lineIds, sn,assetId,callback, context) {
   			var parameters = {};

   			
   			if(lineIds != null && lineIds.length >0){
   				parameters.lineId = lineIds;
   			}
   			
   			if(sn != null && sn != ""){
   				parameters.serialNumber = sn;
   			}
   			if(assetId != null && assetId != ""){
   				parameters.assetId = assetId;
   			}
   			var aucmas = 0;
        	var currentHost=window.location.hostname;
        	if(currentHost == "longyuniot.com"){//澳柯玛longyuniot.com
        		aucmas = 1;
        	}
   			
   	    	cloud.Ajax.request({
   	    		url : "api/order/list",
	   	        type : "post",
	   	        parameters : {
                   cursor : start,
                   limit:limit,
                   aucmas:aucmas
                },
	   	        data : parameters,
	   	        success : function(data) {
	   	              callback.call(context || this, data);
	   	        }
	   	    });
		},
        getAllOrgan:function(callback,context){
         	var self = this;
            cloud.Ajax.request({
                url: "mapi/organization/list",
                type: "get",
                parameters: {
                	limit:-1,
                	cursor:0,
                	verbose:100
                },
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
       },
        getAllLineStocks:function(searchData,limit,cursor,callback,context){
        	 var self = this;
           searchData.limit = limit;
           searchData.cursor = cursor;
           cloud.Ajax.request({
               url: "api/replenishv2/linelist",
               type: "GET",
               parameters: searchData,
               success: function(data) {
                   callback.call(context || self, data);
               }
           });
         },
         getAllLineStocksV3:function(searchData,limit,cursor,callback,context){
        	 var self = this;
           searchData.limit = limit;
           searchData.cursor = cursor;
           cloud.Ajax.request({
               url: "api/replenishv3/linelist",
               type: "GET",
               parameters: searchData,
               success: function(data) {
                   callback.call(context || self, data);
               }
           });
         },
        getAutomatByUserId: function(userId, callback, context) {
        	cloud.Ajax.request({
	    	      url:"api/smartUser/"+userId,
		    	  type : "GET",
		    	  success : function(data) {
		    		  if(data && data.result && data.result.area){
		    			  cloud.Ajax.request({
			   	    	      url:"api/automatline/list",
					    	  type : "GET",
					    	  parameters : {
					    		  areaId: data.result.area,
					    		  cursor:0,
					    		  limit:-1
			                  },
					    	  success : function(linedata) {
					    		  if(linedata && linedata.result && linedata.result.length > 0){
					    			  var lineIds=[];
					                  if(linedata.result && linedata.result.length>0){
					 	    			  for(var i=0;i<linedata.result.length;i++){
					 	    				  lineIds.push(linedata.result[i]._id);
					 	    			  }
					                  }
					    			  searchData = {
					    					  "lineId": lineIds,
					    					  "cursor":0,
								    		  "limit":-1
					    			  }
					    			  cloud.Ajax.request({
					    	                url: "api/automat/list_new",
					    	                type: "GET",
					    	                parameters: searchData,
					    	                success: function(data) {
					    	                    callback.call(context || self, data);
					    	                }
					    	            });
					    		  }else{
					    			  callback.call(context || this, data); 
					    		  }
					    		  
					    	  }
		    			  });
		    		  }else{
		    			  callback.call(context || this, data); 
		    		  }
		    	  }
          });
        },
        getCount: function(searchData,callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/automat/count",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getAllModel: function(url,limit, cursor,search,searchValue, callback, context) {
            var self = this;
            
            if (search == 0) {
            	
            		var parameters = {
                            cursor: cursor,
                            limit: limit,
                            vender: searchValue
                        };	
            	
                
            } else if (search == 1) {
                var parameters = {
                    cursor: cursor,
                    limit: limit,
                    name: searchValue
                };
            } else if (search == 2) {
            	if(searchValue == locale.get({lang: "drink_machine"})){
            		var parameters = {
                            cursor: cursor,
                            limit: limit,
                            machineType: 1
                        };
            		
            	}else if(searchValue == locale.get({lang: "spring_machine"})){
            		var parameters = {
                            cursor: cursor,
                            limit: limit,
                            machineType: 2
                        };
            	}else if(searchValue == locale.get({lang: "grid_machine"})){
            		var parameters = {
                            cursor: cursor,
                            limit: limit,
                            machineType: 3
                        };
            	}else if(searchValue == "Beverage machine"){
                		var parameters = {
                                cursor: cursor,
                                limit: limit,
                                machineType: 4
                         };
            	}else if(searchValue == "Snack machine"){
            		var parameters = {
                            cursor: cursor,
                            limit: limit,
                            machineType: 5
                     };
            	}else if(searchValue == "Combo Vending Machine"){
            		var parameters = {
                            cursor: cursor,
                            limit: limit,
                            machineType: 6
                     };
            	}else{
            		var parameters = {
                            cursor: cursor,
                            limit: limit,
                            machineType: 0
                        };
            		
            	}
                
            }
            var modelUrl = '';
			if(url =='api'){
				modelUrl = "api/model/list";
			}else{
				modelUrl= "mapi/vmmodel/list";
			}
            cloud.Ajax.request({
                url: modelUrl,
                type: "GET",
                parameters:parameters,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getAllInbox: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "api/inbox/list",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        deleteInboxById: function(id, callback, context) {
            cloud.Ajax.request({
                url: "api/inbox/" + id,
                type: "DELETE",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        deleteGrade: function(id, callback, context) {
            cloud.Ajax.request({
                url: "api/remote/" + id +"/device",
                type: "DELETE",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAllGrade: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "api/remote/list/device",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        addGrade:function(data,callback,context){
        	cloud.Ajax.request({
				url:"api/remote/device",
				type : "post",
				data:data,
				success: function(data) {
	                callback.call(context || self, data);
	            },
	            error: function(data) {
	                callback.call(context || self, data);
	            }
			});
        },
        getTaskInfoById: function(id, callback, context) {
            
            cloud.Ajax.request({
                url: "api/remote/"+id+"/control",
                type: "GET",
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        setRemoteConfig:function(data,callback,context){
        	var dt = {};
        	dt.files = data;
        	cloud.Ajax.request({
				url:"api/remote/setconfig",
				type : "post",
				data:dt,
				success: function(data) {
	                callback.call(context || self, data);
	            },
	            error: function(data) {
	                callback.call(context || self, data);
	            }
			});
        },
        addRemoteTask:function(data,callback,context){
        	cloud.Ajax.request({
				url:"api/remote/control",
				type : "post",
				data:data,
				success: function(data) {
	                callback.call(context || self, data);
	            },
	            error: function(data) {
	                callback.call(context || self, data);
	            }
			});
        },
        updateGrade: function(contentData, id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/remote/" + id +"/device",
                type: "PUT",
                data: contentData,
                success: function(data) {
                    callback.call(context || self, data);
                },
                error: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getGradeById: function(id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/remote/" + id +"/device",
                type: "GET",
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getAllAutomatsByPage: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            searchData.verbose = 5;
            cloud.Ajax.request({
                url: "api/automat/list_new",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        updateArea:function(id,areaData,callback,context){
			cloud.Ajax.request({
                url : "api/areaMan/"+id,
                type : "PUT",
                data:areaData,
                success : function(data) {
                    callback.call(context || this, data);
                },
                error: function(data) {
                    callback.call(context || this, data);
                }
            });
		},
        getAreaById:function(id,callback,context){
        	cloud.Ajax.request({
				url:"api/areaMan/"+id,
				type : "GET",
				success:function(data){
					callback.call(context || this,data);
				}
			});
        },
        getLineById:function(id,callback,context){
        	cloud.Ajax.request({
				url:"api/automatline/"+id,
				type : "GET",
				success:function(data){
					callback.call(context || this,data);
				}
			});
        },
        addArea:function(areaData,callback,context){
			cloud.Ajax.request({
                url : "api/areaMan/add",
                type : "POST",
                data:areaData,
                success : function(data) {
                    callback.call(context || this, data);
                },
                error: function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		updateLine:function(id,areaData,callback,context){
			cloud.Ajax.request({
                url : "api/automatline/"+id,
                type : "PUT",
                data:areaData,
                success : function(data) {
                    callback.call(context || this, data);
                },
                error: function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		addLine:function(contentData,callback,context){
	        	var self = this;
	            cloud.Ajax.request({
	                url: "api/automatline",
	                type: "POST",
	                data:contentData,
	                success: function(data) {
	                    callback.call(context || self, data);
	                },
	                error:function(data){
	                	callback.call(context || self, data);
	                }
	            });
	    },
	    getAreaByUserId: function(userId, callback, context) {
	     	cloud.Ajax.request({
	    	      url:"api/smartUser/"+userId,
		    	  type : "GET",
		    	  success : function(data) {
		    		   callback.call(context || this, data); 
		          }
            });
	    },
	    getAreaDataByUserId: function(userId, callback, context) {
        	cloud.Ajax.request({
  	    	      url:"api/smartUser/"+userId,
  		    	  type : "GET",
  		    	  success : function(data) {
  		    		//console.log(data);
  		    		  var roleType = permission.getInfo().roleType;
  		    		  if(data && data.result && data.result.area && data.result.area.length>0 && roleType != 51 || roleType == 51){
  		    			  
  		    			  var searchData = {};
  		    			  if(roleType != 51){
  		    				searchData = {
  	  		    					"areaId":data.result.area
  	  		    			  };
  		    			  }
  		    			  
	  		              searchData.limit = -1;
	  		              searchData.cursor = 0;
	  		              cloud.Ajax.request({
	  		                  url: "api/areaMan/list",
	  		                  type: "GET",
	  		                  parameters: searchData,
	  		                  success: function(data) {
	  		                      callback.call(context || self, data);
	  		                  }
	  		              });
  		    		  }else{
  		    			  callback.call(context || this, data); 
  		    		  }
  		    	  }
          });
        },
        getAllArea:function(searchData,limit,cursor,callback,context){
          	 var self = this;
             searchData.limit = limit;
             searchData.cursor = cursor;
             cloud.Ajax.request({
                 url: "api/areaMan/list",
                 type: "GET",
                 parameters: searchData,
                 success: function(data) {
                     callback.call(context || self, data);
                 }
             });
        },
       
        getAllLine:function(searchData,limit,cursor,callback,context){
          	 var self = this;
             searchData.limit = limit;
             searchData.cursor = cursor;
             cloud.Ajax.request({
                 url: "api/automatline/list",
                 type: "GET",
                 parameters: searchData,
                 success: function(data) {
                     callback.call(context || self, data);
                 }
             });
        },
        deleteLineByIds: function(ids, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/automatline/delBatch",
                type: "post",
                parameters: {
                    "ids": ids
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        deleteAreaByIds: function(ids, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/areaMan/delBatch",
                type: "post",
                parameters: {
                    "ids": ids
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAllCode:function(searchData,limit,cursor,callback,context){
          	 var self = this;
             searchData.limit = limit;
             searchData.cursor = cursor;
             cloud.Ajax.request({
                 url: "api/order/codes",
                 type: "GET",
                 parameters: searchData,
                 success: function(data) {
                     callback.call(context || self, data);
                 }
             });
        },
        getAllDeviceReconciliation:function(searchData,limit,cursor,callback,context){
          	 var self = this;
             searchData.limit = limit;
             searchData.cursor = cursor;
             cloud.Ajax.request({
                 url: "api/reconciliation/list",
                 type: "GET",
                 parameters: searchData,
                 success: function(data) {
                     callback.call(context || self, data);
                 }
             });
        },
        getReconciliationRecordDetail:function(id,callback,context){
        	cloud.Ajax.request({
				url:"api/reconciliation/"+id+"/reconciliation",
				type : "GET",
				success:function(data){
					callback.call(context || this,data);
				}
			});
        },
        getRecordDetail:function(id,callback,context){
        	cloud.Ajax.request({
				url:"api/replenish/"+id+"/record",
				type : "GET",
				success:function(data){
					callback.call(context || this,data);
				}
			});
        },
        getRecordDetailV2:function(id,callback,context){
        	cloud.Ajax.request({
				url:"api/replenishv2/"+id+"/record",
				type : "GET",
				success:function(data){
					callback.call(context || this,data);
				}
			});
        },
        getRecordDetailV3:function(id,callback,context){
        	cloud.Ajax.request({
				url:"api/replenishv3/"+id+"/record",
				type : "GET",
				success:function(data){
					callback.call(context || this,data);
				}
			});
        },
        getAllDeviceReplenishment:function(searchData,limit,cursor,callback,context){
       	 var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "api/replenish/recordlist",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
       },
       getAllDeviceReplenishmentV2:function(searchData,limit,cursor,callback,context){
         	 var self = this;
              searchData.limit = limit;
              searchData.cursor = cursor;
              cloud.Ajax.request({
                  url: "api/replenishv2/recordlist",
                  type: "GET",
                  parameters: searchData,
                  success: function(data) {
                      callback.call(context || self, data);
                  }
              });
         },
         getAllDeviceReplenishmentV3:function(searchData,limit,cursor,callback,context){
         	 var self = this;
              searchData.limit = limit;
              searchData.cursor = cursor;
              cloud.Ajax.request({
                  url: "api/replenishv3/recordlist",
                  type: "GET",
                  parameters: searchData,
                  success: function(data) {
                      callback.call(context || self, data);
                  }
              });
         },
         getAllLineReplenishmentV3:function(searchData,limit,cursor,callback,context){
         	 var self = this;
              searchData.limit = limit;
              searchData.cursor = cursor;
              cloud.Ajax.request({
                  url: "api/replenishv3/line/recordlist",
                  type: "GET",
                  parameters: searchData,
                  success: function(data) {
                      callback.call(context || self, data);
                  }
              });
         },
        getLineInfoByUserId:function(id,callback,context){
        	cloud.Ajax.request({
				url:"api/automatline/"+id+"/line",
				type : "GET",
				parameters:{
					limit:-1,
					cursor:0
				},
				success:function(data){
					callback.call(context || this,data);
				}
			});
        },
        getUserMessage:function(callback,context){
        	cloud.Ajax.request({
				url:"api2/users/this",
				type : "GET",
				parameters:{
					verbose:100
				},
				success:function(data){
					callback.call(context || this,data);
				}
			});
        },
        getHistoryStatistic:function(startTime,endTime,callback,context){
        	cloud.Ajax.request({
                url : "api/tradeStatistic/history",
                type : "get",
                parameters : {
                	startTime : startTime,
                	endTime:endTime
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getTradeStatistic:function(callback,context){
			cloud.Ajax.request({
                url : "api/tradeStatistic/day",
                type : "get",
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		getOnlineStatistic:function(callback,context){
			cloud.Ajax.request({
                url : "api/OnlineStatistic/day",
                type : "get",
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		getOnlineHistoryStatistic:function(startTime,endTime,callback,context){
        	cloud.Ajax.request({
                url : "api/OnlineStatistic/history",
                type : "get",
                parameters : {
                	startTime : startTime,
                	endTime:endTime
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        //获取告警列表
        getAlarmInfo: function(start,limit,state, callback, context) {
   			cloud.Ajax.request({
                url : "api/smart_alarm/list",
                type : "get",
                parameters : {
                    cursor : start,
                    limit:limit,
                    state:state
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
   		},
   		//修改告警信息
   		updateAlarm:function(event_id,callback,context){
   			cloud.Ajax.request({
                url : "api/smart_alarm/",
                parameters : {
                	event_id : event_id
                },
                type : "PUT",
                success : function(data) {
                	  callback.call(context || this,data);
                }
            });
   		},
   	    getAlarmList: function(start,limit,state,type,startTime,endTime, search,searchValue,lineIds,eventStatus,callback, context) {
   	    	var parameters = {};
   	    	parameters.level = type;
   	    	if(startTime != null && endTime != null && startTime != '' && endTime != ''){
   	    		parameters.startTime = startTime;
   	    		parameters.endTime = endTime;
   	    	}
   	    	if(search == 0 && searchValue != ''){
   	    		parameters.siteName = searchValue;
   	    	}
   	    	if(search == 1 && searchValue != ''){
   	    		parameters.assetId = searchValue;
   	    	}
   	    	if(lineIds != null){
   	    		parameters.lineId = lineIds;
   	    	}
   	    	if(eventStatus != null){
   	    		parameters.event_status = eventStatus;
   	    	}
   	    	parameters.limit = limit;
   	    	parameters.cursor = start;
   	    	
   	    	cloud.Ajax.request({
   	    		url : "api/smart_alarm/list",
	   	        type : "get",
	   	        parameters : parameters,
	   	        success : function(data) {
	   	              callback.call(context || this, data);
	   	        }
	   	    });
		},
		addModel:function(url,data,callback,context){
			var modelUrl = '';
			if(url =='api'){
				modelUrl = "api/model/add";
			}else{
				modelUrl= "mapi/vmmodel/add";
			}
			cloud.Ajax.request({
                url : modelUrl,
                type : "post",
                data:data,
                success : function(data) {
                    callback.call(context || this, data);
                },
                error:function(data){
              	  callback.call(context || this, data);
              }
            });
		},
		updateModel:function(url,_id,data,callback,context){
			var modelUrl = '';
			if(url =='api'){
				modelUrl = "api/model/"+_id;
			}else{
				modelUrl= "mapi/vmmodel/"+_id;
			}
			var self = this;
			cloud.Ajax.request({
                url : modelUrl,
                type : "put",
                data:data,
                success : function(data) {
                    callback.call(context || this, data);
                },error:function(data){
                	callback.call(context || self, data);
                }
            });
		},
		getModelById:function(url,id,callback,context){
			var modelUrl = '';
			if(url =='api'){
				modelUrl = "api/model/"+id;
			}else{
				modelUrl= "mapi/vmmodel/"+id;
			}
			cloud.Ajax.request({
                url : modelUrl,
                type : "get",
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		getModelInfo: function(type,value,start,limit,callback, context) {
			var parameters = {
				"cursor" : start,
                "limit":limit
			}
			if(type=="0"){
				parameters.name = value;
			}else if(type == "1"){
				parameters.number = value;
			}else if(type == "2"){
				parameters.manufacturer = value;
			}
   			cloud.Ajax.request({
                url : "api/model/list",
                type : "get",
                parameters : parameters,
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
   		},
   		deleteModel :function(url,id,callback,context){
   			var modelUrl = '';
   			if(url =='api'){
   				modelUrl = "api/model/"+id;
   			}else{
   				modelUrl= "mapi/vmmodel/"+id;
   			}
     	    cloud.Ajax.request({
   	    	  url:modelUrl,
		    	  type : "DELETE",
		    	  success : function(data) {
           	            callback.call(context || this,data);
                   },
     	          error:function(data){
           	            callback.call(context || this, data);
                   }
          });
   		},
   		addDelivery:function(name,number,phone,description,callback,context){
			cloud.Ajax.request({
                url : "api/delivery/add",
                type : "post",
                data:{
                	"name":name,
                	"number":number,
                	"phone":phone,
                	"descript":description
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		updateDelivery:function(_id,name,number,phone,description,callback,context){
			cloud.Ajax.request({
                url : "api/delivery/"+_id,
                type : "put",
                data:{
                	"name":name,
                	"number":number,
                	"phone":phone,
                	"descript":description
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		getDeliveryById:function(id,callback,context){
			cloud.Ajax.request({
                url : "api/delivery/"+id,
                type : "get",
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		getDeliveryInfo: function(type,value,start,limit,callback, context) {
			var parameters = {
				"cursor" : start,
                "limit":limit
			}
			if(type=="0"){
				parameters.name = value;
			}else if(type == "1"){
				parameters.phone = value;
			}else if(type == "2"){
				parameters.number = value;
			}
   			cloud.Ajax.request({
                url : "api/delivery/list",
                type : "get",
                parameters : parameters,
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
   		},
   		deleteDelivery :function(id,callback,context){
     	    cloud.Ajax.request({
   	    	  url:"api/delivery/"+id,
		    	  type : "DELETE",
		    	  success : function(data) {
           	      callback.call(context || this,data);
             }
          });
   		},
   		getRecordDetailV2ById:function(id,callback,context){
		    cloud.Ajax.request({
                url:"api/replenishv2/"+id,
                type : "GET",
                success:function(data){
                    callback.call(context || this,data);
                }
            });
		},
		getRecordDetailV3ById:function(id,callback,context){
		    cloud.Ajax.request({
                url:"api/replenishv3/"+id,
                type : "GET",
                success:function(data){
                    callback.call(context || this,data);
                }
            });
		},
     getDispatchInfo: function(start,limit,callback, context) {
   			cloud.Ajax.request({
                url : "api/delivery/list",
                type : "get",
                parameters : {
                    cursor : start,
                    limit:limit
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
   		},
   	 deleteDispatch :function(id,callback,context){
     	    cloud.Ajax.request({
     	    	  url:"api/delivery/"+id,
  		    	  type : "DELETE",
  		    	  success : function(data) {
             	      callback.call(context || this,data);
               }
            });
       },
       getVenderList: function(url,limit,start,name,callback, context) {
           cloud.Ajax.request({
               url: url+"/modelVender/list",
               type: "get",
               parameters: {
                   cursor: start,
                   limit: limit,
                   name:name
               },
               success: function(data) {
                   callback.call(context || this, data);
               }
           });
       },
       introducedModels: function(id, callback, context) {
           
           cloud.Ajax.request({
               url: "api/model/"+id+"/introduced",
               type: "get", 
               async: false, //同步执行
               success: function(data) {
                   callback.call(context || this, data);
               }
           });
       },
       getAllUnCreateModel: function(url,limit,start,state,callback, context) {
           cloud.Ajax.request({
               url: url+"/modeltreat/list",
               type: "get",
               parameters: {
                   cursor: start,
                   limit: limit,
                   state:state
               },
               success: function(data) {
                   callback.call(context || this, data);
               }
           });
       },
       getUncreateModelById:function(eurl,id,callback,context){
			cloud.Ajax.request({
                url : eurl+"/modeltreat/"+id,
                type : "get",
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		updateUncreateModel:function(eurl,_id,data,callback,context){
			cloud.Ajax.request({
                url : eurl+"/modeltreat/"+_id,
                type : "put",
                data:data,
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		sendEmailOfModel:function(model,cid,assetId,cpemail,Language,callback,context){
			cloud.Ajax.request({
                url : "mapi/modelEmail/send",
                type : "get",
                parameters: {
                	model: model,
                	cid: cid,
                	assetId:assetId,
                	cpemail:cpemail,
                	Language:Language
                	
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		existsAutomat:function(id,callback,context){
			cloud.Ajax.request({
                url : "api/model/"+id+"/exists",
                type : "get",      
                success : function(data) {
                    callback.call(context || this, data);
                },
                error: function(data) {
	                callback.call(context || self, data);
	            }
            });
		}
    });

    return new Service();
    
});