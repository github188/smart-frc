define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function() {
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
        getLineInfoByUserId: function(id, callback, context) {
            cloud.Ajax.request({
                url: "api/automatline/" + id + "/line",
                type: "GET",
                parameters: {
                    limit: -1,
                    cursor: 0
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getUserMessage: function(callback, context) {
            cloud.Ajax.request({
                url: "api2/users/this",
                type: "GET",
                parameters: {
                    verbose: 100
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        updateAutomatByGoodsId:function(data, callback, context){
        	cloud.Ajax.request({
                url: "api/automat/goods",
                type: "PUT",
                data: data,
                success: function(data) {
                    callback.call(context || this, data);
                },
                error: function(data) {
                    callback.call(context || this, data);
                }
            });
        	
        },
        getAreaByUserId: function(userId, callback, context){
       	  cloud.Ajax.request({
       	      url:"api/smartUser/"+userId,
   	    	  type : "GET",
   	    	  success : function(data) {
   	    		  
   	    			callback.call(context || this, data); 

   	    	  }
           });
         },
        getAutoByGoodsId: function(goods_id,lineIds,assetId,callback, context) {
            cloud.Ajax.request({
                url: "api/automat/goods",
                type: "GET",
                parameters: {
                	goods_id: goods_id,
                	lineId:lineIds,
                	assetId:assetId
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getUserMessage: function(callback, context) {
            cloud.Ajax.request({
                url: "api2/users/this",
                type: "GET",
                parameters: {
                    verbose: 100
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        createGoodsExcel: function(eurl,time,name,number,manufacturer,type,language, reportName,callback, context) {
   			var parameters = {};
   			if(time != null && time != ""){
   				parameters.time = time;
   			}
   			if(name != null && name != ""){
   				parameters.name = name;
   			}
   			if(number != null && number != ""){
   				parameters.number = number;
   			}
   			if(manufacturer != null && manufacturer != ""){
   				parameters.manufacturer = manufacturer;
   			}
   			if(type != null && type != ""){
   				parameters.type = type;
   			}
   			if(language != null && language != ""){
   				parameters.language = language;
   			}
   			
   			if(reportName != null && reportName != ""){
   				parameters.reportName = reportName;
   			}
   			
   	    	cloud.Ajax.request({
   	    	   url : eurl+"/vmreports/goods",
	   	       type : "get",
	   	       parameters : parameters,
	   	       success : function(data) {
	   	              callback.call(context || this, data);
	   	        }
	   	    });
		},
		createGoodsXml: function(eurl,oid,time,name,number,manufacturer,type,language, reportName,callback, context) {
   			var parameters = {};
   			if(oid != null && oid != ""){
   				parameters.oid = oid;
   			}
   			if(time != null && time != ""){
   				parameters.time = time;
   			}
   			if(name != null && name != ""){
   				parameters.name = name;
   			}
   			if(number != null && number != ""){
   				parameters.number = number;
   			}
   			if(manufacturer != null && manufacturer != ""){
   				parameters.manufacturer = manufacturer;
   			}
   			if(type != null && type != ""){
   				parameters.type = type;
   			}
   			if(language != null && language != ""){
   				parameters.language = language;
   			}
   			
   			if(reportName != null && reportName != ""){
   				parameters.reportName = reportName;
   			}
   			//parameters.access_token = cloud.Ajax.getAccessToken();
   			
   	    	cloud.Ajax.request({
   	    	   url : eurl+"/goodsxml/exReportXML",
	   	       type : "get",
	   	       parameters : parameters,
	   	       success : function(data) {
	   	              callback.call(context || this, data);
	   	        }
	   	    });
		},
		findGoodsExcel:function(eurl,time,report_name,callback,context){
			cloud.Ajax.request({
                url : eurl+"/vmreports/findTradeExcel",
                type : "get",
                parameters : {
                	path : "/home/goods/"+time+"/"+report_name
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		 },
		 findGoodsXml:function(eurl,time,report_name,callback,context){
				cloud.Ajax.request({
	                url : eurl+"/goodsxml/findGoodsXML",
	                type : "get",
	                parameters : {
	                	path : "/usr/share/nginx/html/"+time+"/"+report_name
	                },
	                success : function(data) {
	                    callback.call(context || this, data);
	                }
	            });
			 },
        
        getActiviteGoodsByDeviceIds: function(ids, callback, context) {
            cloud.Ajax.request({
                url: "api/automat/getGoodsByDeviceIds",
                type: "GET",
                parameters: {
                    ids: ids
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getUserMessage:function(callback, context) {
            cloud.Ajax.request({
                url: "api2/users/this",
                type: "GET",
                parameters: {
                    verbose: 100
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getGoodsTypeInfo: function(url,callback, context) {
            cloud.Ajax.request({
                url: url+"/goods/type",
                type: "get",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        addGoodsType: function(url,typeData, callback, context){
        	cloud.Ajax.request({
                url: url+"/goodstype/add",
                type: "POST",
                data: typeData,
                success: function(data) {
                    callback.call(context || this, data);
                },
                error: function(data) {
                    callback.call(context || this, data);
                }
            });
        	
        },
        updateGoodsType:function(url,id, typeData, callback, context){
        	cloud.Ajax.request({
                url: url+"/goodstype/"+id,
                type: "PUT",
                data: typeData,
                success: function(data) {
                    callback.call(context || this, data);
                },
                error: function(data) {
                    callback.call(context || this, data);
                }
            });
        	
        },
        getGoodsTypeById:function(url,id, callback, context){
        	cloud.Ajax.request({
                url: url+"/goodstype/"+id,
                type: "get",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        	
        },

        getGoodsTypeList: function(url,limit,start,name,callback, context) {
            cloud.Ajax.request({
                url: url+"/goodstype/list",
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
        deleteGoodsTypeById:function(url,id, callback, context){
        	cloud.Ajax.request({
                url:  url +"/goodstype/"+id,
                type: "delete",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        	
        },
        addActivityInfo: function(activityData, callback, context) {
            cloud.Ajax.request({
                url: "api/activity/add",
                type: "POST",
                data: activityData,
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        updateActivityInfo: function(id, activiteData, callback, context) {
            cloud.Ajax.request({
                url: "api/activity/" + id,
                type: "PUT",
                data: activiteData,
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getActivite: function(id, callback, context) {
            cloud.Ajax.request({
                url: "api/activity/" + id,
                type: "get",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        deleteActivityById: function(id, callback, context) {
            cloud.Ajax.request({
                url: "api/activity/" + id,
                type: "DELETE",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAutomatInfo: function(start, limit, callback, context) {
            cloud.Ajax.request({
                url: "api/automat/list_new",
                type: "get",
                parameters: {
                    cursor: start,
                    limit: limit
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getActivityList: function(start, limit, name, status, starts, end, callback, context) {
            cloud.Ajax.request({
                url: "api/activity/list",
                type: "get",
                parameters: {
                    cursor: start,
                    limit: limit,
                    name: name,
                    startTime: starts,
                    endTime: end,
                    status: status
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getActivityInfo: function(start, limit, status, callback, context) {
            cloud.Ajax.request({
                url: "api/activity/list",
                type: "get",
                parameters: {
                    cursor: start,
                    limit: limit,
                    status: status
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getActivityInfoByName: function(start, limit, name, status, callback, context) {
            cloud.Ajax.request({
                url: "api/activity/list",
                type: "get",
                parameters: {
                    cursor: start,
                    limit: limit,
                    name: name,
                    status: status
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getGoodsInfo: function(start, limit, callback, context) {
            cloud.Ajax.request({
                url: "gapi/goods/list",
                type: "get",
                parameters: {
                    cursor: start,
                    limit: limit
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        deleteGoods: function(url,id, callback, context) {
            cloud.Ajax.request({
                url: url + "/goods/"+id,
                type: "DELETE",
                success: function(data) {
                    callback.call(context || this, data);
                },
                error: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        addGoods: function(url,goodsData, callback, context) {
            cloud.Ajax.request({
                url: url+"/goods/add",
                type: "POST",
                data: goodsData,
                success: function(data) {
                    callback.call(context || this, data);
                },
                error: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getGoodsById: function(url,id, callback, context) {
            cloud.Ajax.request({
                url: url+"/goods/" + id,
                type: "GET",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getdeviceByName: function(name, start, limit, callback, context) {
            cloud.Ajax.request({
                url: "api/automat/nameorAssertId",
                type: "get",
                parameters: {
                    cursor: start,
                    limit: limit,
                    name: name
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getGoodsByName: function(name, start, limit, callback, context) {
            cloud.Ajax.request({
                url: "gapi/goods/list",
                type: "get",
                parameters: {
                    cursor: start,
                    limit: limit,
                    name: name
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        updateGoods: function(url,id, goodsData, callback, context) {
            cloud.Ajax.request({
                url: url+"/goods/" + id,
                type: "PUT",
                data: goodsData,
                success: function(data) {
                    callback.call(context || this, data);
                },
                error: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getGoodsList: function(url, start, limit, type, search, searchValue, callback, context) {
            if (type == 0) {
                if (search == 0) {
                    var parameters = {
                        cursor: start,
                        limit: limit,
                        number: searchValue
                    };
                } else if (search == 1) {
                    var parameters = {
                        cursor: start,
                        limit: limit,
                        name: searchValue
                    };
                } else if (search == 2) {
                    var parameters = {
                        cursor: start,
                        limit: limit,
                        manufacturer: searchValue
                    };
                }
            } else {
                if (search == 0) {
                    var parameters = {
                        cursor: start,
                        limit: limit,
                        type: type,
                        number: searchValue
                    };
                } else if (search == 1) {
                    var parameters = {
                        cursor: start,
                        limit: limit,
                        type: type,
                        name: searchValue
                    };
                } else if (search == 2) {
                    var parameters = {
                        cursor: start,
                        limit: limit,
                        type: type,
                        manufacturer: searchValue
                    };
                }
            }



            cloud.Ajax.request({
                url: url+ "/goods/list",
                type: "get",
                parameters: parameters,
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        addActivityTask: function(id, callback, context) {
            cloud.Ajax.request({
                url: "api/taskActivity/add",
                type: "POST",
                parameters: {
                    id: id
                },
                success: function(data) {
                    callback.call(context || this, data);
                },
                error: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAdminToken: function(callback) {
            var param = {
                client_id: "000017953450251798098136",
                client_secret: "08E9EC6793345759456CB8BAE52615F3",
                grant_type: "password",
                username: "admin", //注册邮箱
                password: "123456", //账号密码
                password_type: "1"
            };
            cloud.Ajax.request({
                url: "oauth2/access_token",
                type: "POST",
                contentType:"application/x-www-form-urlencoded; charset=UTF-8",
                parameters: param,
                success: function(data) {
                    callback.call(this, data);
                }
            });
        },
        getAdminGoodsList: function(searchData, start, limit, callback, context) {
            searchData.limit = limit;
            searchData.cursor = start;
            //console.log(" searchData  ",searchData);
            cloud.Ajax.request({
                url: "gapi/goods/admin/list",
                type: "get",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAdminGoodsTypeInfo: function(callback, context) {
            cloud.Ajax.request({
                url: "gapi/goods/admin/type",
                type: "get",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        
        //引入管理员下的商品
        introducedGoods: function(url,id,adminToken, callback, context) {
            
            cloud.Ajax.request({
                url: url+"/goods/"+id+"/introduced?adminToken=",
                type: "get", 
                async: false, //同步执行
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        deleteImageById:function(url,id, callback, context){
        	cloud.Ajax.request({
                url:  url+id,
                type: "delete",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        	
        },
    });

    return new Service();

});