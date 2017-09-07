define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function() {
            this.map = $H(this.map);
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
        getOidNameByOid:function(id,callback,context){
   			cloud.Ajax.request({
   			     url: "/api2/organizations/"+id,
                 type:"GET",
                 dataType: "json",
                 parameters: {
                     verbose: 100
                 },
                 success : function(data) {
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
        updateGoods: function(id, goodsData, callback, context) {
            cloud.Ajax.request({
                url:"api/goods/" + id,
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
        getAllAutomatsByPage: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            searchData.verbose = 100;
            cloud.Ajax.request({
                url: "api/automat/list_new",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getTemplateInfoById:function(id,callback,context){
   			cloud.Ajax.request({
                url : "api/automat/"+id+"/channelModel",
                type : "get",
                success : function(data) {
                	  callback.call(context || this,data);
                }
            });
   		},
        updateTemplateInfo:function(id,data,callback,context){
   			cloud.Ajax.request({
                url : "api/automat/"+id+"/channelModel",
                data : data,
                type : "put",
                success : function(data) {
                	  callback.call(context || this,data);
                }
            });
   		},
        deleteTemplateInfo:function(id,callback,context){
     	    cloud.Ajax.request({
   	    	  url:"api/automat/"+id+"/channelModel",
		    	  type : "DELETE",
		    	  success : function(data) {
           	      callback.call(context || this,data);
             }
          });
        },
        addTemplateInfo:function(data,callback,context){
   			cloud.Ajax.request({
                url : "api/automat/channelModel",
                data : data,
                type : "post",
                success : function(data) {
                	  callback.call(context || this,data);
                }
            });
   		},
        getAllTemplateList:function(start,limit,search,searchValue,callback,context){
        	
        	if (search == 0) {
                var parameters = {
                    cursor: start,
                    limit: limit,
                    name: searchValue
                };
            } else if (search == 1) {
                var parameters = {
                    cursor: start,
                    limit: limit,
                    vender: searchValue
                };
            } else if (search == 2) {
                var parameters = {
                    cursor: start,
                    limit: limit,
                    modelName: searchValue
                };
            }

   			cloud.Ajax.request({
                url : "api/automat/list/channelModel",
                type : "get",
                parameters: parameters,
                success : function(data) {
                    callback.call(context || this, data);
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
   		getAllModelList: function(url,modelId,machineType,vender,callback,context) {

   			cloud.Ajax.request({
                url : url+"/model/list",
                type : "get",
                parameters: {
                	modelIds: modelId,
                	machineType: machineType,
                    vender: vender
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
   		},
        getModelInfo: function(start,limit,callback, context) {
   			cloud.Ajax.request({
                url : "api/model/list",
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
   		getModelById:function(id,callback,context){
			cloud.Ajax.request({
                url : "api/model/"+id,
                type : "get",
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		getGoodsById: function(id, callback, context) {
            cloud.Ajax.request({
                url: "api/goods/" + id,
                type: "GET",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
		getGoodslist:function(name,start,limit,callback,context){
        	var self = this;
    		cloud.Ajax.request({
    			url:"api/goods/list",
    			type:"get",
    			parameters: {
    				"sort":1,
                    "name": name,
                    "limit":limit,
                    "cursor":start
                },
    			success:function(data){
					callback.call(context ||this, data);
    			}
    		});
        },
		
    });

    return new Service();
});