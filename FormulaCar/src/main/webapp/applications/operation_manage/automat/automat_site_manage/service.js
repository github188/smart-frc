/**
 * service 关联后台数据库操作
 */
define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        siteUrl: "api/automatsite",
        type: "site",
        initialize: function() {
            this.map = $H(this.map);
        },
        getAllLines:function(searchData,limit,cursor,callback,context){
        	 var self = this;
           searchData.limit = limit;
           searchData.cursor = cursor;
           cloud.Ajax.request({
               url: "api/basic/dealer/list",
               type: "GET",
               parameters: searchData,
               success: function(data) {
                   callback.call(context || self, data);
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
        getAreaInfo: function(start, limit, callback, context) {
            cloud.Ajax.request({
                url: "api/smartArea",
                type: "get",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getSiteById: function(id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: self.siteUrl + "/" + id,
                type: "GET",
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        
        getAllSitesByPage: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: self.siteUrl + "/list",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        addSite: function(contentData, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: self.siteUrl,
                type: "POST",
                data: contentData,
                success: function(data) {
                    callback.call(context || self, data);
                },
                error: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        updateSite: function(contentData, id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: self.siteUrl + "/" + id,
                type: "PUT",
                data: contentData,
                success: function(data) {
                    callback.call(context || self, data);
                }, error: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        deleteSite: function(id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: self.siteUrl + "/" + id,
                type: "delete",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        deleteSiteByIds: function(ids, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: self.siteUrl + "/delBatch",
                type: "post",
                parameters: {
                    "ids": ids
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAllPlaceGoogle:function(inpuValue,callback, context) {
        	cloud.Ajax.request({
				url:"api/map/google/place/queryautocomplete",
				type : "GET",
				parameters:{
					inputValue:inpuValue
				},
				success:function(data){
					callback.call(context || this,data);
				}
			});
        },
        getlatlonByAddress:function(name,callback, context) {
        	cloud.Ajax.request({
				url:"api/map/google/geocode",
				type : "GET",
				parameters:{
					address:name
				},
				success:function(data){
					callback.call(context || this,data);
				}
			});
        },
        getAllPlace:function(inpuValue,callback, context) {
        	cloud.Ajax.request({
				url:"api/map/baidu/getAllplace",
				type : "GET",
				parameters:{
					inputValue:inpuValue
				},
				success:function(data){
					callback.call(context || this,data);
				}
			});
        },
        getSiteByName: function(name,callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/automatsite/name",
                type: "GET",
                parameters: {
                    name: name
                },
                success: function(data) {
                    callback.call(context || self, data);
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
        getAllLine:function(searchData,callback, context) {
        	cloud.Ajax.request({
				url:"api/automatline/all",
				type : "GET",
				parameters:{
					name:searchData.name
				},
				success:function(data){
					callback.call(context || this,data);
				}
			});
        }
    });

    return new Service();
});