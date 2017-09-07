/**
 * Created by zhouyunkui on 14-6-25.
 */
define(function(require){
    var cloud=require("cloud/base/cloud");
    var resourceType=88;
    var Service=Class.create({
        initialize:function(options){
            this.type="blacklist";
            this.resourceType=resourceType;
        },
        getResourceType:function(){
          return resourceType;
        },
        deleteResources:function(ids,callback,context){
            var param={};
            for(var i=0;i<ids.length;i++){
                cloud.Ajax.request({
                    url:"api/black_white/"+ids[i],
                    type:"DELETE",
                    success:function(data){
//                        var idArr=data.result.pluck("_id");
                        var idArr=[];
                        idArr[0]=data.result._id;
                        callback(idArr);
                    }
                })
            }
        },
        addResource:function(data,callback,context){
            if(this.lastGetResroucesRequest){
                this.lastGetResroucesRequest.abort();
            }
            this.lastGetResroucesRequest=cloud.Ajax.request({
                url:"api/black_white",
                type:"POST",
                data:data,
                success:function(returnData){
                    callback.call(context||this,returnData);
                }
            })
        },
        getVisitor_black_list:function(start,limit,callback,context){
            if(this.lastGetResroucesRequest){
                this.lastGetResroucesRequest.abort();
            }

            this.lastGetResroucesRequest=cloud.Ajax.request({
                url:"api/black_white",
                type:"GET",
                dataType:"JSON",
                parameters:{
                    type:2,
                    blackOrWhite:1,
                    verbose:100,
                    cursor:start,
                    limit:limit
                },
                success:function(data){
                    callback.call(context || this,data);
                }
            })
        },
        getVisitor_white_list:function(start,limit,callback,context){
            if(this.lastGetResroucesRequest){
                this.lastGetResroucesRequest.abort();
            }

            this.lastGetResroucesRequest=cloud.Ajax.request({
                url:"api/black_white",
                type:"GET",
                dataType:"JSON",
                parameters:{
                    type:2,
                    blackOrWhite:0,
                    verbose:100,
                    cursor:start,
                    limit:limit
                },
                success:function(data){
                    callback.call(context || this,data);
                }
            })
        },

        getWebsite_black_list:function(start,limit,callback,context){
            if(this.lastGetResroucesRequest){
                this.lastGetResroucesRequest.abort();
            }

            this.lastGetResroucesRequest=cloud.Ajax.request({
                url:"api/black_white",
                type:"GET",
                dataType:"JSON",
                parameters:{
                    type:1,
                    blackOrWhite:1,
                    verbose:100,
                    cursor:start,
                    limit:limit
                },
                success:function(data){
                    callback.call(context || this,data);
                }
            })
        },
        getWebsite_white_list:function(start,limit,callback,context){
            if(this.lastGetResroucesRequest){
                this.lastGetResroucesRequest.abort();
            }

            this.lastGetResroucesRequest=cloud.Ajax.request({
                url:"api/black_white",
                type:"GET",
                dataType:"JSON",
                parameters:{
                    type:1,
                    blackOrWhite:0,
                    verbose:100,
                    cursor:start,
                    limit:limit
                },
                success:function(data){
                    callback.call(context || this,data);
                }
            })
        },

        getMac_black_list:function(start,limit,callback,context){
            if(this.lastGetResroucesRequest){
                this.lastGetResroucesRequest.abort();
            }

            this.lastGetResroucesRequest=cloud.Ajax.request({
                url:"api/black_white",
                type:"GET",
                dataType:"JSON",
                parameters:{
                    type:3,
                    blackOrWhite:1,
                    verbose:100,
                    cursor:start,
                    limit:limit
                },
                success:function(data){
                    callback.call(context || this,data);
                }
            })
        },
        getMac_white_list:function(start,limit,callback,context){
            if(this.lastGetResroucesRequest){
                this.lastGetResroucesRequest.abort();
            }

            this.lastGetResroucesRequest=cloud.Ajax.request({
                url:"api/black_white",
                type:"GET",
                dataType:"JSON",
                parameters:{
                    type:3,
                    blackOrWhite:0,
                    verbose:100,
                    cursor:start,
                    limit:limit
                },
                success:function(data){
                    callback.call(context || this,data);
                }
            })
        }

    });
    return new Service();
})