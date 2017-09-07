define(function(require){
    var cloud=require("cloud/base/cloud");
    var Service=Class.create({
        initialize:function(){
           this.type="sync_tasks";
        },
        deleteResource:function(data,callback,context){
            cloud.Ajax.request({
                url:"api/content_sync/delJob",
                type:"POST",
                data:data,
                success:function(data){
                    callback.call(context||this,data);
                }
            })
        },
        addResource:function(data,callback,context){
            if(this.lastGetResroucesRequest){
                this.lastGetResroucesRequest.abort();
            }
            this.lastGetResroucesRequest=cloud.Ajax.request({
                url:"api/content_sync/newJob",
                type:"POST",
                data:data,
                success:function(returnData){
                    callback.call(context||this,returnData);
                }
            })
        },
        //TODO
        updateResource:function(data,callback,context){
            if(this.lastGetResroucesRequest){
                this.lastGetResroucesRequest.abort();
            }
            this.lastGetResroucesRequest=cloud.Ajax.request({
                url:"api/content_sync/updateJob",
                type:"POST",
                data:data,
                success:function(data){
                    callback.call(context||this,data);
                }
            });
        },
        pauseTasks:function(param,callback,context){
            cloud.Ajax.request({
                url:"api/content_sync/pauseJob",
                type:"POST",
                parameters:param,
                success:function(data){
                    callback.call(context||this,data);
                }
            });
        },
        recoverTasks:function(param,callback,context){
//            self.mask();
            cloud.Ajax.request({
                url:"api/content_sync/recoverJob",
                type:"POST",
                parameters:param,
                success:function(data){
                    callback.call(context||this.data);
                }
            });
        },
        get_sync_tasks_list:function(/*start,limit,*/callback,context){
            if(this.lastGetResroucesRequest){
                this.lastGetResroucesRequest.abort();
            };
            this.lastGetResroucesRequest=cloud.Ajax.request({
                url:"api/content_sync/jobs",
                type:"get",
                success:function(data){
                    callback.call(context||this,data);
                }
            })
        }
    });
    return new Service();
});
