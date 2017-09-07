//DN4二级菜单入口的权限类型配置
define(function(require) {
	return {
		monitor: {
			apGis: [1010]
		},
		storefront: {
			point_manage: [1200]
		},
		the_stage: {
			smartVm_manage: [1300]
		},
		product: {
			product_manage: [1400]
		},
		statistics: {
			statistics_manage: [1500]
		},
		replenish: {
			replenish_manage: [1600]
		},
		reconciliation: {
			reconciliation_manage: [1700]
		},
		alarm: {
			alarm_manage: [1800]
		},
		services: {
			services_manage: [1900]
		},

		system_vm: {
			system_manage: [2000]
		},
		wechatApp: {
			wechatapp_manage: [2100]
		}

	};
});