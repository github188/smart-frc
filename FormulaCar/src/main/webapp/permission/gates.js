//DN4二级菜单入口的权限类型配置
define(function(require) {
	return {
		monitor: {
			apGis: [1010]
		},
		storefront: {   //店面管理
			point_manage: [1200]  
		},
		the_stage: {    //赛台
			smartVm_manage: [1300]
		},
		statistics: {   //统计
			statistics_manage: [1500]
		},
		alarm: {    //告警
			alarm_manage: [1800]
		},
		services : {
			services_manage : [ 1900 ]
		},
		system_vm: { //系统管理
			system_manage: [2000]
		}

	};
});