/**
 * Created by zhang on 14-8-27.
 */
define(function(require){
    require("cloud/base/cloud");
    var datas = require("./data");
    var resourceType = 14;
    var AllSite = ""

    // 标签-所有现场
    var allSite = {
        _id : 1,
        name : locale.get({
            lang : "all_site"
        }),
        description : "",
        status : "inherent",
        selectable : false,
        favor : false,
        /**
         * Load id array.
         *
         * @param {Object}
         *        callback
         */
        loadResourcesData : function(start, limit, callback, context) {
            cloud.Ajax.request({
                url : "api/sites",
                type : "get",
                parameters : {
                    limit : limit,
                    cursor : start,
                    verbose : 1
                },
                success : function(data) {
                    data.result = data.result.pluck("_id");
                    allSite.total = data.total;
                    callback.call(context || this, data);
                    // callback.call(context || this, data.result.pluck("_id"));
                }
            });
        },
        loadAllSiteData : function(siteName,start, limit, callback, context) {
            cloud.Ajax.request({
                url : "api/sites",
                type : "get",
                parameters : {
                    limit : limit,
                    cursor : start,
                    verbose : 1,
                    name:siteName
                },
                success : function(data) {
                    data.result = data.result.pluck("_id");
                    allSite.total = data.total;
                    callback.call(context || this, data);
                    // callback.call(context || this, data.result.pluck("_id"));
                }
            });
        }
    };

    // 标签-无标签现场
    var noneTagSite = {
        _id : 2,
        name : locale.get({
            lang : "untagged_site"
        }),
        description : "",
        status : "inherent",
        selectable : false,
        favor : false,
        /**
         * Load id array.
         *
         * @param {Object}
         *        callback
         */
        loadResourcesData : function(start, limit, callback, context) {
            cloud.Ajax.request({
                url : "api/tags/none/resources",
                type : "get",
                parameters : {
                    limit : limit,
                    cursor : start,
                    type : resourceType
                },
                success : function(data) {
                    noneTagSite.total = data.total;
                    // console.log("data",data);
                    // callback.call(context || this, data.result);
                    callback.call(context || this, data);
                }
            });
        }
    };

    //标签-在线现场
    var tagOnline = {
        _id : 3,
        name : locale.get("online_site"),
        description : "online",
        status : "inherent",
        selectable : false,
        favor : false,
        /**
         * Load id array.
         *
         * @param {Object}
         *        callback
         */
        loadResourcesData : function(start, limit, callback, context) {
            cloud.Ajax.request({
                url : "api/sites",
                type : "get",
                parameters : {
                    limit : limit,
                    cursor : start,
                    verbose : 1,
                    online : 1
                },
                success : function(data) {
                    data.result = data.result.pluck("_id");
                    tagOnline.total = data.total;
                    callback.call(context || this, data);
                }
            });
        }
    };

    //标签-离线现场
    var tagOffline = {
        _id : 4,
        name : locale.get("offline_site"),
        description : "offline",
        status : "inherent",
        selectable : false,
        favor : false,
        /**
         * Load id array.
         *
         * @param {Object}
         *        callback
         */
        loadResourcesData : function(start, limit, callback, context) {
            cloud.Ajax.request({
                url : "api/sites",
                type : "get",
                parameters : {
                    limit : limit,
                    cursor : start,
                    verbose : 1,
                    online : 0
                },
                success : function(data) {
                    data.result = data.result.pluck("_id");
                    tagOffline.total = data.total;
                    callback.call(context || this, data);
                }
            });
        }
    };

    var Service = Class.create({
        loadTagUrl : "api/site_tags",
        netTags : [ tagOnline, tagOffline ],//在关状态标签
        inherentTags : [ allSite, noneTagSite, tagOnline, tagOffline ],//内置标签

        getResourceType : function() {
            return resourceType;
        },

        getTags : function(callback, context) {
            var self = this;
            cloud.Ajax.request({
                url : self.loadTagUrl,
                type : "GET",
                parameters : {
                    verbose : 100
                },
                success : function(data) {

                    var tags = [ self.inherentTags, data.result ].flatten();
                    callback.call(context || self, tags);
                }
            });
        },

        /**
         * 用于content-table请求数据
         */
        getTableResources : function(start, limit, callback, context) {
            if (this.lastGetResroucesRequest) {
                this.lastGetResroucesRequest.abort();
            }
            var self = this;

            this.getResourcesIds(start, limit, function(ids) {
                var total = ids.total;
                var cursor = ids.cursor;
                if (ids.result) {
                    ids = ids.result;
                }
                this.lastGetResroucesRequest = cloud.Ajax.request({
                    url : "api/sites/list",
                    type : "post",
                    parameters : {
                        verbose : 100,
                        limit : limit
                    },
                    data : {
                        resourceIds : ids
                    },
                    success : function(data) {
                        if(start==0){
                            data.result.unshift({
                                _id : AllSite,
                                name : locale.get("all_site")
                            })
                        }
                        data.total = total;
                        data.cursor = cursor;
                        self.lastGetResroucesRequest = null;
                        callback.call(context || this, data);
                    }
                });
            }, this);
        },


        getSitelistByName:function(name,start, limit, callback,context) {
            cloud.Ajax.request({
                url : "api/sites",
                type : "get",
                parameters:{
                    name:name,
                    cursor:start,
                    limit:limit,
                    verbose:100
                },
                success : function(data) {
                    if(name == null && start == 0){
                        data.result.unshift({
                            _id : AllSite,
                            name : locale.get("all_site")
                        })
                    }
                    callback.call(context || this, data);
                }
            });
        },
        //site list end

        //content start





    });

    return  new Service()
});