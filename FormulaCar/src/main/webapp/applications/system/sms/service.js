/**
 * Created by kkzhou on 14-9-15.
 */
define(function(require){
    require("cloud/base/cloud");
    var Service=Class.create({
        initialize:function(){
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
            !config.url && delete config.url;
            !config.account && delete config.account;
            !config.passwd && delete config.passwd;
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

        }
    });
    return new Service();
});