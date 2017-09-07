define(function(require) {
    require("cloud/base/cloud");
    var resourceType = 2;
    var noGroupUser = {
        _id: "system",
        name: locale.get({lang:"non_group_user"}),
//        description: "",
        status: "inherent",
        selectable: false,
        favor:false,
        shared:false,
        /**
         * Load id array.
         * @param {Object} callback
         */
        loadResourcesData: function(start, limit,callback, context) {
            cloud.Ajax.request({
                url: "api/wifi_user",
                type: "get",
				parameters: {
                    limit: limit,
                    cursor: start,
                    groupId:"system"
//                    verbose: 1
                },
                success: function(data) {
					data.result = data.result.pluck("_id");
                    noGroupUser.total = data.total;
                    callback.call(context || this, data);
                }
            });
        }
    };
    //单独处理社交账户和手机账户由于账户显示字段不同的问题(手机是phone,社交是name),统一为一个字段,accountName
    var difCount=function(data){
        var result=data.result;
        result.each(function(one){
            if(one.type==1){
                one.accountName=one.phone;
            }else if(one.type==2){
                one.accountName=one.name;
            }
        });
        return data;
    };
    var Service = Class.create({
        inherentTags: [noGroupUser],
        loadTagUrl: "api/wifi_user_group",
        type: "user",
        resourceType: resourceType,
        initialize: function() {
            this.map = $H(this.map);
        },

        getTags: function(callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: self.loadTagUrl,
                type: "GET",
                parameters: {
					limit:0,
                    verbose: 100
                },
                success: function(data) {
                	var tags = [self.inherentTags, data.result].flatten();
                    callback.call(context || self, tags);
                }
            });
        },

        getResourceType: function() {
            return this.resourceType;
        },
		getResourcesIds: function(start, limit, callback, context){
            cloud.Ajax.request({
                url: "api/wifi_user",
                type: "get",
                success: function(data) {
                    callback.call(context || this, data.result.pluck("_id"));
                }
            });
        },
        
        getTableResourcesById: function(ids, callback, context) {
            if (this.lastGetResroucesRequest) {
                this.lastGetResroucesRequest.abort();
            }
            var self = this;
            ids = cloud.util.makeArray(ids);
//            console.log(ids,"ids");
            this.lastGetResroucesRequest = cloud.Ajax.request({
                url: "api/wifi_user",
                type: "post",
                parameters: {
                    verbose: 100
                },
                data: {
                    resourceIds: ids
                },
                success: function(data) {
                    self.lastGetResroucesRequest = null;
                    var data=difCount(data);
                    callback.call(context || this, data.result);
                }
            });
        },
        
        //get content resources by resource ids array.
        getTableResources: function(start, limit, callback, context) {
            if (this.lastGetResroucesRequest) {
                this.lastGetResroucesRequest.abort();
            }
            var self = this;

            this.getResourcesIds(start,limit,function(ids) {
            	var total = ids.total;
            	var cursor = ids.cursor;
				if(ids.result){
					ids = ids.result;
				}
                this.lastGetResroucesRequest = cloud.Ajax.request({
                    url: "api/wifi_user",
                    type: "post",
                    parameters: {
                        verbose: 100,
                        limit:limit
                    },
                    data: {
                        resourceIds: ids
                    },
                    success: function(data) {
                    	data.total = total;
                    	data.cursor = cursor;
                        self.lastGetResroucesRequest = null;
                        var data=difCount(data);
                        callback.call(context || this, data);
                    }
                });
            }, this);
        },
        deleteResources: function(ids, callback, context) {
            ids = cloud.util.makeArray(ids);
            var delIds = $A();
            var count = ids.size();
            if(count >0){
            	ids.each(function(id, index){
            		cloud.Ajax.request({
            			url:"api/wifi_user/"+id,
            			type:"delete",
            			success:function(data){
            				count--;
            				if (data.result && data.result._id) {
            					delIds.push(data.result._id);
            				}
            				if(count === 0){
            					callback.call(context ||this, delIds);
            				}
            			},
            			error:function(data){
            				count--;
            				dialog.render({lang:"delete_failed"});
            				if(count === 0){
            					callback.call(context ||this, []);
            				}
            			}
            		});
            	});
            }else{
	            callback.call(context ||this, []);
            }
        }
    });

    return new Service();
});