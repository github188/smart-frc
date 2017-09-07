/**
 * Created by Inhand on 15-3-13.
 */
define(function(require){
    var cloud = require("cloud/base/cloud");
    var Service = Class.create({
        initialize:function(){

        },
        getAdStati:function(opt,callback,context){
            if(this.getAdStatiRequest){
                this.getAdStatiRequest.abort()
            }
            var self = this;
            this.getAdStatiRequest = cloud.Ajax.request({
                url:'api/banner/pvuvs',
                type:'get',
                parameters:{
                    verbose:100
                },
                success:function(data){
//                    self.tag.total = data.total;
                    callback.call(context||this,data);
                }
            });
        }

    });

    return new Service()

});