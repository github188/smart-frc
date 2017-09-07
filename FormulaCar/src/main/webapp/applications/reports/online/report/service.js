/**
 * @author PANJC
 *
 */
define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function(){
            this.type = "onlineReport";
            this.resourceType = 23;
        },

        getResourceType: function(){
            return this.resourceType;
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
        getDevicesList:function(paramObj,cursor,limit,lineIds,callback){
            var paramObj = paramObj ? paramObj : {};
            if(paramObj.online === undefined){
                delete paramObj.online;
            }
            paramObj["pic_id"] = 0;
            paramObj["verbose"] = 100;
            paramObj["cursor"] = cursor;
            paramObj["limit"] = limit;
            paramObj["lineId"] = lineIds;
            cloud.Ajax.request({
                url:"api/automat/list_new",
                type:"GET",
                dataType:"JSON",
                parameters:paramObj,
                success: function(data){
                    var result = data.result;
                    result.total = data.total;
                    result.online = data.online;
                    if(!!callback){
                        callback(result,data);
                    }
                }
            });
        },

        getOnlineInfo:function(paramObj,devicesArr,callback){
            var idArr = [];
            $.each(devicesArr,function(index,obj){
                idArr.push(obj._id);
            });
            cloud.Ajax.request({
                url:"api/online_stat/list",
                type:"POST",
                dataType:"JSON",
                parameters:paramObj,
                data:{
                    resourceIds:idArr,
                    verbose:100
                },
                success: function(data){
                    var data = data.result;
                    for(var i=0,ilen=data.length;i<ilen;i++){
                        for(var j=0,jlen=devicesArr.length;j<jlen;j++){
                            if(data[i]["deviceId"] === devicesArr[j]["_id"]){
                                data[i]["siteName"] = devicesArr[j]["siteName"];
                                data[i]["deviceName"] = devicesArr[j]["name"];
                                data[i]["assetId"] = devicesArr[j]["assetId"];
                                break;
                            }
                        }
                    }
                    if(!!callback){
                        callback(data);
                    }
                }
            });
        }

    });

    return new Service();

});