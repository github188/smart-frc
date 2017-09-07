define(function(require) {
    require("cloud/base/cloud");
    
    var transLocale = function(one){
    	var paramObj = one.params;
    	$.each(paramObj, function(i,val){
    		var paramStr = paramObj[i]?(paramObj[i]).replace(/ /g, "_"):paramObj[i]="";
    		//遍历参数---以防用户创建的资源与其他国际化名相同--最大化 保证 不会出现问题
    		switch (paramStr) {
			case "apply_config":
			case "auto_create_site":
			case "config_synchro_status":
			case "cost_timing_statistics":
			case "device_function_test":
			case "evt_files":
			case "flow_timing_statistics":
			case "get_formatting_parameters":
			case "import_upgrade_file":
			case "inrouter_certificate_profile":
			case "interactive_command":
			case "periodic_cleaning_access_token":
			case "remote_control":
			case "run_config_apply":
			case "sms_apply_config":
			case "tendency_chart":
			case "upload_files":
			case "visit_timing_statistics":
			case "vpn_link_order":
			case "vpn_temporary_channel_config":
			case "zip_format_config_file":
			case "set_running_config":
			case "get_running_config":
			case "set_ovdp_config":
			case "get_ovdp_config":
			case "device_upgrade":
			case "calculate_traffic":
			case "inform_new_task":
			case "check_channel_status":
			case "calculate_bill":
			case "calculate_api_access":
			case "check_token_expired":
			case "batch_favor":
			case "batch_share":
			case "batch_import_gateway_device":
			case "download_template_file":
			case "import_sn_file":
				paramObj[i] = locale.get(paramStr);
				break;
			default:
				break;
		}
    	});
		var localeName = locale.get(one.code, paramObj);
		one.content = localeName ? localeName : one.content;
	};
    
    var Service = Class.create({
        initialize: function(){
        },
        getDragonpayConfig:function(name,configflag,areaIds,callback,context){
		    cloud.Ajax.request({
                url : "api/dragon",
                type : "get",
                parameters : {
               	 name:name,
               	 configflag:configflag,
               	 areas:areaIds
                },
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
	   },
	   createDragonpayConfig:function(name,wechatObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
	               url : "api/dragon/add",
	               type : "post",
	               data:wechatObj,
	               parameters : {
	              	     name:name,
	              	     configflag:configflag,
	          		     areas:areaIds
	               },
	               success : function(data) {
	                   callback.call(context || this, data);
	               }
	           });
		},
		updateDragonpayConfig:function(id,name,wechatObj,configflag,areaIds,callback,context){
			cloud.Ajax.request({
                url : "api/dragon/"+id,
                type : "put",
                data:wechatObj,
                parameters : {
               	     name:name,
               	     configflag:configflag,
               		 areas:areaIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
    });

    return new Service();
    
});