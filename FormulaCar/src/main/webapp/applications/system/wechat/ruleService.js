/**
 * Created by zhang on 14-10-21.
 */
define(function(require){
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize:function(){
        },
        getMaterial:function(type,callback,context){
            cloud.Ajax.request({
                type:"GET",
                url:"api/wechat/metadata",
                parameters:type,
                success:function(data){
                    callback.call(context,data);
                },
                error:function(err){
                    dialog.render({
                        "text":locale.get(err.error_code)
                    })
                }
            });
        },
        getMaterialById:function(ids,callback,context){
            ids = JSON.stringify(ids);
            cloud.Ajax.request({
                type : "POST" ,
                url : "api/wechat/metadata/get",
                data : ids,
                success : function(data){
                    callback.call(context || this,data.result);
                },
                error:function(err){
                    dialog.render({
                        "text":locale.get(err.error_code)
                    });
                }
            });
        },
        createMaterial:function(data,callback,context){
            data = JSON.stringify(data);

            cloud.Ajax.request({
                type:"PUT",
                url:"api/wechat/metadata",
                data:data,
                success:function(data){
                    callback.call(context,data);
                },
                error:function(err){
                    dialog.render({
                        "text":locale.get(err.error_code)
                    })
                }
            });
        },
        getRules:function(callback,context){
            cloud.Ajax.request({
                type:"get",
                url:"api/wechat/reply",
                data:{
                    type:"text"
                },
                success:function(data){
                    callback.call(context,data);
                },
                error:function(err){
                    dialog.render({
                        "text":locale.get(err.error_code)
                    })
                }
            });
        },
        updateRule:function(data,callback,context){
            var data = JSON.stringify(data);
            cloud.Ajax.request({
                type:"post",
                url:"api/wechat/reply",
                data:data,
                success:function(data){
                    callback.call(context,data);
                },
                error:function(err){
                    dialog.render({
                        "text":locale.get(err.error_code)
                    })
                }
            });
        },
        createRule:function(data,callback,context){
            data = JSON.stringify(data);
            cloud.Ajax.request({
                type:"post",
                url:"api/wechat/metadata/bind",
                data:data,
                success:function(data){
                    callback.call(context,data);
                },
                error:function(err){
                    dialog.render({
                        "text":locale.get(err.error_code)
                    })
                }
            });
        },
        deleteRule:function(data,callback,context){
            data = JSON.stringify(data);
            cloud.Ajax.request({
                type:"delete",
                url:"api/wechat/reply",
                data:data,
                success:function(data){
                    callback.call(context,data);
                },
                error:function(err){
                    dialog.render({
                        "text":locale.get(err.error_code)
                    })
                }
            });
        }
    });
    return new Service();
});