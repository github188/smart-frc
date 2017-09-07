/**
 * Created by zhang on 14-7-21.
 */
define(function(require){
    require("cloud/base/cloud");
    var Service = Class.create({

        getPackages:function(callback,context){
            var self = this;
            if(this.lastGetPackRequest){
                this.lastGetPackRequest.abort();
            }
            this.lastGetPackRequest = cloud.Ajax.request({
                url:"api/flow/packs",
                type:"GET",
                success:function(data){

                    self.lastGetPackRequest = null;

                    callback.call(context || this, data);
                }
            });

        },
        
        updatePackage:function(data,callback,context){
            var self = this;
            if(this.lastupdatePackRequest){
                this.lastupdatePackRequest.abort();
            }
            this.lastupdatePackRequest = cloud.Ajax.request({
                url:"api/flow/updatepack",
                parameters:{
                    type:data.type
                },
                data:{
                    packageId:data.packageId,
                    name:data.name,
                    basicprice:data.basicprice,
                    overprice:data.overprice,
                    flow:data.flow,
                    isdefault:data.isdefault
                },
                type:"post",
                success:function(data){

                    self.lastupdatePackRequest = null;

                    callback.call(context || this, data);
                }
            });
        },
        
        addPackage:function(data,callback,context){
            var self = this;
            if(this.lastaddPackRequest){
                this.lastaddPackRequest.abort();
            }
            this.lastaddPackRequest = cloud.Ajax.request({
                url:"api/flow/newpack",
                parameters:{
                    type:data.type
                },
                data:{
                    name:data.name,
                    basicprice:data.basicprice,
                    overprice:data.overprice,
                    flow:data.flow,
                    isdefault:data.isdefault
                },
                type:"post",
                success:function(data){

                    self.lastaddPackRequest = null;

                    callback.call(context || this, data);
                }
            });
        },

        getSIM:function(data,callback,errorCallback,context){
            var self = this;
            if(this.lastGetSIMRequest){
                this.lastGetSIMRequest.abort();
            }

            data.limit = data.limit ? data.limit : 30 ;
            data.cursor = data.cursor ? data.cursor : 0;

            this.lastGetSIMRequest = cloud.Ajax.request({
                url:"api/flow/month",
                parameters:{
                    limit : data.limit,
                    cursor : data.cursor
                },
                data:{
                    over : data.over,
                    time : data.time,
                    packageIds : data.packageIds,
                    simId : data.simId
                },
                type:"post",
                success:function(returnData){
                    returnData.limit = data.limit;
                    returnData.cursor = data.cursor;
//                    returnData.total = 93;

                    self.lastGetSIMRequest = null;

                    callback.call(context || this, returnData);
                },
                error:function(err){
                    self.lastGetSIMRequest = null;

                    errorCallback.call(context || this, err);
                }
            });
        },

        changePackage:function(data,callback,context){
            var self = this;
            if(this.lastChangePackRequest){
                this.lastChangePackRequest.abort();
            }
            this.lastChangePackRequest =cloud.Ajax.request({
                url:"api/flow/changesimpack",
                parameters:{
                    type : 1
                },
                data:{
                    packageId : data.packageId,
                    simId : data.simId
                },
                type:"post",
                success:function(data){

                    self.lastChangePackRequest = null;

                    callback.call(context || this, data);
                }
            })
        }

    });

    return  new Service();
});