/**
 * Created by zhang on 14-10-11.
 */
define(function(require){
    require("cloud/base/cloud");
    var Service=Class.create({
        initialize:function(){
        },

        getMaterial:function(data, callback, context){


            cloud.Ajax.request({
                type:"GET",
                url:"api/wechat/metadata",
                parameters:{
                    type: data.type || "news"
                },
                success:function(data){
                    //临时方案cover --> isCover
                    data.result.each(function(one){
                        one.isCover = one.cover;
                    });
                    callback.call(context,data.result);
                },
                error:function(err){

                }
            });

        },
        addMaterial:function(data, callback, context){

            data.collect(function(one){
                if(one._id){
                    delete one._id
                }
            });
            data = JSON.stringify(data);

            cloud.Ajax.request({
                type:"put",
                url:"api/wechat/metadata",
                parameters:{
//                    type: data.type || "news"
                },
                data:data,
                success:function(data){
                    callback.call(context,data);
                },
                error:function(err){

                }
            });
        },
        updateMaterial:function(data, callback, context){
            data.collect(function(one){
                var length = one._id.toString().length;
                if(length == 13){
                    delete one._id;
                }/*else if(one.id.toString().length == 24){
                    one.id = one._id;
                }*/
            });

            data = JSON.stringify(data);

            cloud.Ajax.request({
                type:"post",
                url:"api/wechat/metadata",
                parameters:{
//                    type: data.type || "news"
                },
                data:data,
                success:function(data){
                    callback.call(context,data);
                },
                error:function(err){

                }
            });
        },
        delMaterial:function(data, callback, context){
            data = JSON.stringify(data);
            cloud.Ajax.request({
                type:"delete",
                url:"api/wechat/metadata",
                parameters:{
//                    type: data.type || "news"
                },
                data:data,
                success:function(data){
                    callback.call(context,data);
                },
                error:function(err){

                }
            });
        }

    });

    return new Service()
});