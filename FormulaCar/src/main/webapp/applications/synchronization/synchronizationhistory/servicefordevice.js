/**
 * Created by zhouyunkui on 14-7-6.
 */
define(function(require){
    var cloud=require("cloud/base/cloud");
    var Service=Class.create({
        initialize: function() {
            this.map = $H(this.map);
        },
        getDeviceHistory:function(opt,callback,context){
            cloud.Ajax.request({
                url:"api/content_sync/log",
                type:"GET",
                parameters:opt,
                success:function(data){
                    callback.call(context||this,data);
                },
                error:function(err){

                }
            })
        }
    });
    return new Service();
})