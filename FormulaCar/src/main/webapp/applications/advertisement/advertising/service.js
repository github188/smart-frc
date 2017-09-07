define(function(require){
    require("cloud/base/cloud");


    var Service = Class.create({
        tag:{},
        initialize:function(options){
            cloud.util.defaults(options,{
                resourceType:"default",
                getUrl:"api/automat/list_new",
                postUrl:"api/automat/overview",
                deleteUrl:"api/sites/"
            });
            if(options.deleteFun){
                this.deleteResources = this[options.deleteFun];
            }
            this.options = options;
        },
        getResourceType: function() {
            return this.resourceType;
        },
        getTableResourcesById:function(ids, callback,context){
            if (this.lastGetResroucesRequest) {
                this.lastGetResroucesRequest.abort();
            }
            var self = this;
            ids = cloud.util.makeArray(ids);

            cloud.Ajax.request({
                url:self.options.postUrl,
                type:"post",
                parameters:{
                    verbose:100,
                    limit:0
                },
                data:{
                    resourceIds:ids
                },
                success:function(data){
                    self.lastGetResroucesRequest = null;
                    callback.call(context || self, data.result);
                }
            });
        },

        setParameter:function(data){
            this.param = data;
        },

        clearParmetter:function(){
            this.param = null;
        },

        getTableResources:function(start , limit ,callback ,context){
            if (this.lastGetResroucesRequest) {
//                this.lastGetResroucesRequest.abort();
            }
            var param = cloud.util.defaults(this.param || {},{
                verbose: 100,
                cursor: start,
                limit:limit
            })
            var self = this;
            this.lastGetResroucesRequest=cloud.Ajax.request({
                url:self.options.getUrl,
                type: "get",
                parameters:param,
                success: function(data) {
                    self.tag.total = data.total;
                    callback.call(context || this, data);
                }
            });

//            this.clearParmetter();

            return this.lastGetResroucesRequest;

        },
        deleteResources : function(ids, callback, context) {
            var self = this;
            ids = cloud.util.makeArray(ids);
            var count = ids.length;
            var res = new Array();
            // ids = ids.without(ids[0])
            // console.log(ids, "ids to del");
            var deleteAll = 0;
            ids.each(function(id, index) {
                cloud.Ajax.request({
                    url : self.options.deleteUrl + id,
                    type : "delete",
                    parameters : {
//                        delete_all : deleteAll
                    },
                    error : function(data) {
                        count--;
                    },
                    success : function(data) {
                        // console.log("delete"+id+"success");
                        if (data.result) {
                            res.push(data.result);
                            count--;
                            // console.log(data.result.id, "del suc");
                            // callback.call(context || this,
                            // cloud.util.makeArray(data.result.id));
                            if (count === 0) {
                                callback.call(context || this, res);
                            }
                        }
                    }
                });
            });
        },
        deleteMate:function(ids,callback,context){
            ids = cloud.util.makeArray(ids);
            cloud.Ajax.request({
                url:"api/banner/del",
                type:"post",
                parameters:{},
                data:{
                    ids:ids
                },
                success:function(data){
                    callback.call(context|| this, data.result);
                }
            });

        },
        getMedia:function(id,callback,context){
            if(this.getMediaRequest){
                this.getMediaRequest.abort()
            }
            this.getMediaRequest = cloud.Ajax.request({
                url:"api/banner/meta",
                type:"get",
                parameters:{
                    _id:id
                },
                success:function(data){
                    callback.call(context || this, data);
                },
                error:function(data){
                    //console.log(data)
                }
            });
        },
        updateMate:function(param,callback,context){
            if(this.updateMateRequest){
                this.updateMateRequest.abort()
            }
            this.updateMateRequest = cloud.Ajax.request({
                url:"api/banner/update",
                type:"post",
                parameters:param,
//                data:,
                success:function(data){
                    callback.call(context || this, data);
                }
            });
        },
        editProject:function(obj,callback,context){
            if(this.editProjectRequest){
                this.editProjectRequest.abort()
            }
            this.editProjectRequest = cloud.Ajax.request({
                url:"api/ad/"+obj._id,
                type:"put",
                parameters:{},
                data:{
                    name:obj.name
                },
                success:function(data){
                    callback.call(context || this, data)
                }
            });
        },
        createProject:function(name,callback,context){
            if(this.createProjectRequest){
                this.createProjectRequest.abort()
            }
            this.createProjectRequest = cloud.Ajax.request({
                url:"api/ad",
                type:"post",
                parameters:{},
                data:{
                    name:name
                },
                success:function(data){
                    callback.call(context || this, data)
                }
            });
        },

        getPublishData:function(id,callback,context){
            if(this.getPublishDataRequest){
                this.getPublishDataRequest.abort()
            }
            this.getPublishDataRequest = cloud.Ajax.request({
                url:"api/ad/publish",
                type:"get",
                parameters:{
                    adId:id
                },
                success:function(data){
                    callback.call(context || this, data)
                }
            });
        },
        publishAd:function(obj,callback,context){
            if(this.publishAdRequest){
                this.publishAdRequest.abort()
            }
            this.publishAdRequest = cloud.Ajax.request({
                url:"api/ad/publish",
                type:"post",
                parameters:{
                    adId:obj.adId,
                    desc_name:'desc',
                    desc_suffix:"JSON"
                },
                data:{
                    desc:obj.desc,
                    oids:obj.oids,
                    bannerIds:obj.bannerIds
                },
                success:function(data){
                    callback.call(context || this, data)
                }
            });
        }

    });
    return Service;
});