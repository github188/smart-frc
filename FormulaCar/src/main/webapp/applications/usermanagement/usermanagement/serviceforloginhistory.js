define(function(require) {
    require("cloud/base/cloud");
    var resourceType = 88;
    var Service = Class.create({
        type: "loginDetail",
        resourceType: resourceType,
        initialize: function() {
            this.map = $H(this.map);
        },
        getUserLoginDetail:function(param,callback,context){
            cloud.util.mask("#winContent");
            cloud.Ajax.request({
                url:"api/wifi/access/user",
                parameters:param
//                {
//                    "id":"",
//                    "start_time":"",
//                    "end_time":"",
//                    "cursor":"",
//                    "limit":""
//                }
                ,
                success:function(data){
                    callback(data,context||this);
                    cloud.util.unmask("#winContent");
                },
                error:function(data){
                    cloud.util.unmask("#winContent");
                }
            })
        },
        getCurrentTraffic:function(ids,callback,context){
            cloud.util.mask("#winContent");
            cloud.Ajax.request({
                url:"api/wifi/user/traffic",
                type:"POST",
                data:ids,
                success:function(data){
                    callback.call(context||this,data);
                    cloud.util.unmask("#winContent");
                },
                error:function(data){
                    cloud.util.unmask("#winContent");
                }
            })
        }
    });

    return new Service();
});