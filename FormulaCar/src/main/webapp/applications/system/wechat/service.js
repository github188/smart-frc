/**
 * Created by kkzhou on 14-9-15.
 */
define(function(require){
    require("cloud/base/cloud");
    var Service=Class.create({
        initialize:function(){
        },
        //被添加消息自动回复
        //获取消息
        getAddedAutoReply:function(callback,context){
            cloud.util.mask("body");
            cloud.Ajax.request({
                type:"GET",
                url:"api/",
                success:function(data){
                    callback.call(context,data);
                    cloud.util.unmask("body");
                },
                error:function(err){
                    cloud.util.unmask("body");
                    dialog.render({
                        "text":locale.get(err.error_code)
                    })
                }
            });
        },
        //消息自动回复
        //获取消息
        getMessageAutoReply:function(callback,context){
            cloud.util.mask("body");
            $.ajax({
                type:"GET",
                url:"system/wechat/json/message_auto.json",
                success:function(data,statusText){
                    if(typeof data=="string"){
                        data=JSON.parse(data);
                    }
                    callback.call(context,data);
                    cloud.util.unmask("body");
                },
                error:function(xhr,err){

                }
            });
        },
        //获取热点的用户关注数信息
        getHotSpotWechatUser:function(param,callback,context){
            var self=this;
            cloud.util.mask("body");
            cloud.Ajax.request({
                type:"GET",
                url:"api/wifi/stat",
                parameters:param,
                success:function(data){
                    callback.call(context,data);
                    cloud.util.unmask("body");
                },
                error:function(err){
                    cloud.util.unmask("body");
                    dialog.render({
                        "text":locale.get(err.error_code)
                    });
                }
            })
        },
        //自定义菜单请求
        getMenu:function(callback,context){
            cloud.util.mask("body");
            cloud.Ajax.request({
                type:"GET",
                url:"api/wechat_menu",
//                contentType:"application/json",
                success:function(data){
                    callback.call(context,data);
                    cloud.util.unmask("body");
                },
                error:function(err){
                    cloud.util.unmask("body");
                    dialog.render({
                        "text":locale.get(err.error_code)
                    })
                }
            })
        },
        //创建素材
        createTextMaterial:function(data,callback,context){
            cloud.util.mask("body");
            cloud.Ajax.request({
                type:"PUT",
                url:"api/wechat/metadata",
                data:data,
                success:function(data){
                    callback.call(context,data);
//                    cloud.util.unmask("body");
                },
                error:function(err){
                    cloud.util.unmask("body");
                    dialog.render({
                        "text":locale.get(err.error_code)
                    })
                }
            });
        },
        //绑定关系
        tieMenuToMaterial:function(data,callback,context){
            cloud.util.mask("body");
            cloud.Ajax.request({
                type:"POST",
                url:"api/wechat/metadata/bind",
                data:data,
                success:function(data){
                    callback.call(context,data);
                    cloud.util.unmask("body");
                },
                error:function(err){
                    cloud.util.unmask("body");
                    dialog.render({
                        "text":locale.get(err.error_code)
                    })
                }
            })
        },
        //获取素材
        getMaterial:function(type,callback,context){
//            cloud.util.mask("body");
//            $.ajax({
//                type:"GET",
//                url:"system/wechat/json/picAndMes.json",
////                parameters:{
////                    type:type
////                },
//                success:function(data,statusText){
//                    if(typeof data=="string"){
//                        data=JSON.parse(data);
//                    }
//                    callback.call(context,data);
//                    cloud.util.unmask("body");
//                },
//                error:function(xhr,err){
//
//                }
//            });
            cloud.util.mask("#ui-window-content .media_dialog");
            cloud.Ajax.request({
                type:"GET",
                url:"api/wechat/metadata",
                parameters:type,
                success:function(data){
                    callback.call(context,data);
                    cloud.util.unmask("#ui-window-content .media_dialog");
                },
                error:function(err){
                    dialog.render({
                        "text":locale.get(err.error_code)
                    })
                }
            });
        },
        //获取单个素材
        getSingleMaterial:function(param,callback,context){
            cloud.util.mask("body");
//            $.ajax({
//                type:"GET",
//                url:"system/wechat/json/singleMaterial.json",
//                success:function(data,statusText){
//                    if(typeof data=="string"){
//                        data=JSON.parse(data);
//                    }
//                    callback.call(context,data);
//                    cloud.util.unmask("body");
//                },
//                error:function(xhr,err){
//
//                }
//            })
            cloud.Ajax.request({
                type:"GET",
                url:"api/wechat/metadata/event",
//                contentType:"",
                parameters:param,
                success:function(data){
                    callback.call(context,data);
                    cloud.util.unmask("body");
                },
                error:function(err){
                    cloud.util.unmask("body")
                    dialog.render({
                        "text":locale.get(err.error_code)
                    })
                }
            });
        },
        //自定义菜单请求
        deleteMenu:function(callback,context){
            cloud.Ajax.request({
                type:"DELETE",
                contentType:"application/json",
                url:"api/wechat_menu",
                success:function(data){
                    callback.call(context,data);
                },
                error:function(err){
                    dialog.render({
                        "text":locale.get(err.error_code)
                    })
                }
            })
        },
        //自定义菜单请求
        updateMenu:function(menudata,callback,context){
            cloud.util.mask("body");
            cloud.Ajax.request({
                type:"POST",
                url:"api/wechat_menu",
                contentType:"application/json",
                data:menudata,
                success:function(data){
                    callback.call(context,data);
                    cloud.util.unmask("body");
                },
                error:function(err){
                    cloud.util.unmask("body");
                    dialog.render({
                        "text":locale.get(err.error_code)
                    })
                }
            })
        },
        //二维码请求
        getSiteList:function(callback,context){
            cloud.util.mask("body");
            cloud.Ajax.request({
                type:"GET",
                url:"api/sites",
                parameters:{
                    limit:0,
                    verbose:100,
                    cursor:0
                },
                success:function(data){
                    callback.call(context,data);
                    cloud.util.unmask("body");
                },
                error:function(err){
                    cloud.util.unmask("body");
                    dialog.render({
                        "text":locale.get(err.error_code)
                    })
                }
            })
        },
        //二维码请求
        getQrCode:function(siteid,callback,context){
            cloud.util.mask("body");
            cloud.Ajax.request({
                type:"GET",
                url:"api/wechat_qrcode",
                parameters:{
                    site_id:siteid
                },
                success:function(data){
                    callback.call(context,data);
                    cloud.util.unmask("body");
                },
                error:function(err){
                    cloud.util.unmask("body");
                    dialog.render({
                        "text":locale.get(err.error_code)
                    })
                }
            })
        },
        //二维码请求
        createQrCode:function(siteid,callback,context){
            cloud.util.mask("body");
            cloud.Ajax.request({
                type:"POST",
                url:"api/wechat_qrcode",
                parameters:{
                    site_id:siteid
                },
                success:function(data){
                    callback.call(context,data);
                    cloud.util.unmask("body");
                },
                error:function(err){
                    cloud.util.unmask("body");
                    dialog.render({
                        "text":locale.get(err.error_code)
                    });
                }
            })
        },
        //add by zyl
        //get weixin config
        getWxConfig:function(callback, context){
            cloud.Ajax.request({
                type:"get",
                url:"api/wechat_config",
                success:function(data){
                    callback.call(context || this, data);
                    cloud.util.unmask("body");
                },
                error:function(err){
                    dialog.render({
                        "text":locale.get(err.error_code)
                    });
                }
            })
        },
        //create(set) weixin config
        createWxConfig:function(config, callback, context){
            cloud.Ajax.request({
                type : "POST" ,
                url : "api/wechat_config",
                data : config,
                success : function(data){
                    callback.call(context || this,data);
                },
                error:function(err){
                    dialog.render({
                        "text":locale.get(err.error_code)
                    });
                }
            })

        },
        //sms
        //get sms config
        getSmsConfig:function(callback, context){
            cloud.Ajax.request({
                type:"get",
                url:"api/sms_config",
                success:function(data){
                    callback.call(context || this,data);
                },
                error:function(err){
                    dialog.render({
                        "text":locale.get(err.error_code)
                    });
                }
            })
        },
        //create(set) sms config
        createSmsConfig:function(config, callback, context){
            cloud.Ajax.request({
                type : "POST" ,
                url : "api/sms_config",
                data : config,
                success : function(data){
                    callback.call(context || this,data);
                },
                error:function(err){
                    dialog.render({
                        "text":locale.get(err.error_code)
                    });
                }
            })

        },
        getRules:function(callback,context){
            cloud.Ajax.request({
                type:"get",
                url:"api/wechat/reply",
                parameters:{
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
        }
    });
    return new Service();
});