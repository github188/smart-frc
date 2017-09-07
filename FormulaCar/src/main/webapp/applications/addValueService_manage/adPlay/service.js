define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
    	automatUrl: "api/automat",
        type: "automat",
        initialize: function() {
            this.map = $H(this.map);
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
         getAllAutomatsByPage: function(searchData, limit, cursor, callback, context) {
             var self = this;
             searchData.limit = limit;
             searchData.cursor = cursor;
             searchData.vflag = 1;
             searchData.adflag = 1;
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
         getAllAutomatIds: function(searchData, limit, cursor, callback, context) {
             var self = this;
             searchData.limit = limit;
             searchData.cursor = cursor;
             searchData.vflag = 0;
             cloud.Ajax.request({
                 url: "api/automat/list_new",
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
        getAutomatById: function(id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/automat/" + id,
                type: "GET",
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        
    });

    return new Service();
});