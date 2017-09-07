define(function(require) {

	var gisUrl = "./monitor/gis";
	var languge = localStorage.getItem("language");
	if (languge == "en") {
		gisUrl = "./monitor/gis_en";
	}
	//监控(首页)
	var monitor = {
		name: "monitor",
		order: 0,
		id: "smartvm-monitor",
		subNavs: [{ // 电子地图
			name: "apGis",
			order: 0,
			defaultOpen: true,
			defaultShow: true,
			url: gisUrl
		}]
	};
	//店面
	var storefront = {
		name: "storefront",
		order: 1,
		id: "smartvm-point",
		subNavs: [{
			name: "point_manage",
			order: 0,
			defaultOpen: false,
			defaultShow: true,
			subModule: [
				{
					name: "area_manage", //区域管理
					defaultShow: true,
					order: 0,
					operation: ["r", "w"],
					url: "./operation_manage/area/areaMain.js"
				}, {
					name: "line_manage", //经销商管理
					defaultShow: true,
					order: 1,
					operation: ["r", "w"],
					url: "./operation_manage/line/lineMain.js"
				}, {
					name: "site_manage", //店面管理
					defaultShow: true,
					order: 2,
					operation: ["r", "w"],
					url: "./operation_manage/automat/automat_site_manage/siteMain.js"
				}
			]
		}]
	};
	//赛台
	var the_stage = {
		name: "the_stage",
		order: 2,
		id: "smartvm-smartVm",
		subNavs: [{
			name: "smartVm_manage",
			order: 0,
			defaultOpen: false,
			defaultShow: true,
			subModule: [{ //二级菜单
				name: "vendingMachine_manage", //赛台管理
				defaultShow: true,
				order: 0,
				operation: ["r", "w"],
				url: "./operation_manage/vendingMachine/vendingMachineMain.js"
			}, {
				name: "model_manage", //机型管理
				defaultShow: true,
				order: 1,
				operation: ["r", "w"],
				url: "./operation_manage/model/modelMain.js"
			}, {
				name: "inbox", //工控机
				defaultShow: true,
				order: 3,
				subApp: [{
					name: "automat_dominate_list", //设备列表
					order: 0,
					defaultShow: true,
					operation: ["r"],
					url: "./operation_manage/inboxMan/control/inboxMain.js"
				}, {
					name: "upgrade", //远程升级
					order: 1,
					defaultShow: true,
					operation: ["r", "w"],
					url: "./operation_manage/deviceUpgrade/upgradeMain.js"
				}, {
					name: "online_statistics", //在线统计
					order: 2,
					defaultShow: true,
					operation: ["r"],
					url: "./reports/online/report/contentMain.js"
				}, {
					name: "signal_statistics", //信号统计
					order: 4,
					defaultShow: true,
					operation: ["r"],
					url: "./trade_manage/statistics/signalStatistics/contentMain.js"
				}]
			}]
		}]
	};
	//统计
	var statistics = {
		name: "statistics",
		order: 1,
		id: "smartvm-statistics",
		subNavs: [{
			name: "statistics_manage",
			order: 0,
			defaultOpen: false,
			defaultShow: true,
			subModule: [{
				name: "data_analysis", //数据分析
				defaultShow: true,
				order: 0,
				url: "",
				subApp: [{ //三级菜单
					name: "all_cars", //跑车量汇总
					order: 0,
					defaultShow: true,
					operation: ["r"],
					url: "./operation_manage/status/statistics/statisticsMain.js"
				}, {
					name: "all_register", //注册量汇总
					order: 1,
					defaultShow: true,
					operation: ["r"],
					url: "./trade_manage/statistics/tradeStatistics/tradeStatisticsMain.js"
				}, {
					name: "active_time_graph", //活跃时间汇总
					order: 2,
					defaultShow: true,
					operation: ["r"],
					url: "./trade_manage/statistics/goodsStatistics/goodsStatisticsMain.js"
				}, {
					name: "active_storefront", //活跃店面
					order: 3,
					defaultShow: true,
					operation: ["r"],
					url: "./trade_manage/statistics/deviceStatistics/statisticsMain.js"
				}, {
					name: "active_agency", //畅销路线
					order: 4,
					defaultShow: true,
					operation: ["r"],
					url: "./trade_manage/statistics/lineStatistics/statisticsMain.js"
				}]
			}, { //二级菜单
				name: "cars_detail", //跑车明细
				defaultShow: true,
				order: 1,
				url: "",
				subApp: [{ //三级菜单
					name: "cars_detail", //跑车明细
					order: 0,
					defaultShow: true,
					operation: ["r", "w"],
					url: "./trade_manage/tradeDetail/list/tradeMain.js"
				}]
			}, {
				name: "transaction_report", //报表中心
				defaultShow: true,
				order: 3,
				url: "",
				subApp: [{
					name: "agency_statistics", //经销商统计
					order: 0,
					defaultShow: true,
					operation: ["r"],
					url: "./reportCenter/lineTurnoverStatistics/lineTurnoverMain.js"
				}, {
					name: "storefront_statistics", //店面统计
					order: 1,
					defaultShow: true,
					operation: ["r"],
					url: "./reportCenter/siteTurnoverStatistics/siteTurnoverMain.js"
				}, {
					name: "stage_time_statistics", //赛台时间统计
					order: 2,
					defaultShow: true,
					operation: ["r"],
					url: "./reportCenter/deviceTimeStatistics/deviceStatisticsMain.js"
				}]
			}]
		}]
	};
	//告警  
	var alarm = {
		name: "alarm",
		order: 3,
		id: "smartvm-alarm",
		subNavs: [{
			name: "alarm_manage",
			order: 0,
			defaultOpen: false,
			defaultShow: true,
			subModule: [{ //二级菜单
				name: "event_list", //事件列表
				defaultShow: true,
				order: 0,
				operation: ["r"],
				url: "event_manage/event/eventMain.js"
			}, {
				name: "maintenance_list",   //维护列表
				defaultShow: true,
				order: 1,
				operation: ["r","w"],
				url: "event_manage/maintenance/maintenanceMain.js"
			}, {
				name: "alarm_list", //告警列表
				defaultShow: true,
				order: 2,
				operation: ["r", "w"],
				url: "event_manage/alarm/alarmMain.js"
			}]
		}]
	};

	//系统
	var system = {
		name: "system_vm",
		order: 1,
		id: "smartvm-system_vm",
		subNavs: [{
			name: "system_manage",
			order: 0,
			defaultOpen: false,
			defaultShow: true,
			subModule: [{ //二级菜单
				name: "permission_assignment", //权限分配
				defaultShow: true,
				order: 0,
				url: "",
				subApp: [{
					name: "role_manage", //角色管理
					defaultShow: true,
					order: 0,
					operation: ["r", "w"],
					url: "./system_manage/roleMan/role/roleMain.js"
				}, {
					name: "user_manager", //用户管理
					defaultShow: true,
					order: 1,
					operation: ["r", "w"],
					url: "./system_manage/userMan/user/userMain.js"
				}]
			}, {
				name: "payment_allocation", //支付配置
				defaultShow: true,
				order: 1,
				url: "",
				subApp: [{ //三级菜单
					name: "WeChat_payment", //微信支付
					order: 0,
					defaultShow: true,
					operation: ["r", "w"],
					url: "./system_manage/payMan/wechat_pay/wechatMain.js"
				}, {
					name: "Alipay", //支付宝
					order: 1,
					defaultShow: true,
					operation: ["r", "w"],
					url: "./system_manage/payMan/ali_pay/alipayMain.js"
				}, {
					name: "Baidu_Wallet", //百度钱包
					order: 2,
					defaultShow: true,
					operation: ["r", "w"],
					url: "./system_manage/payMan/baidu_pay/baiduMain.js"
				}, {
					name: "Wing_payment", //翼支付
					order: 3,
					defaultShow: true,
					operation: ["r", "w"],
					url: "./system_manage/payMan/best_pay/bestMain.js"
				}, {
					name: "Jingdong_Wallet", //京东钱包
					order: 4,
					defaultShow: true,
					operation: ["r", "w"],
					url: "./system_manage/payMan/jd_pay/jdMain.js"
				}, {
					name: "Vip_payment", //会员支付
					order: 5,
					defaultShow: true,
					operation: ["r", "w"],
					url: "./system_manage/payMan/vip_pay/vipMain.js"
				}, {
					name: "UnionPay_payment", //银联支付
					order: 6,
					defaultShow: true,
					operation: ["r", "w"],
					url: "./system_manage/payMan/unionPay_pay/unionPayMain.js"
				}, {
					name: "QrcodePay_payment", //扫码支付
					order: 6,
					defaultShow: true,
					operation: ["r", "w"],
					url: "./system_manage/payMan/qrcodePay_pay/qrcodePayMain.js"
				}]
			}, {
				name: "parameter_config", //开发配置
				defaultShow: true,
				order: 2,
				operation: ["r", "w"],
				url: "./system_manage/developmentMan/developmentMain.js"
			}, {
				name: "secure_login", //微信绑定
				defaultShow: true,
				order: 3,
				operation: ["r"],
				url: "./system_manage/secureLogin/secureLoginMain.js"
			}, {
				name: "operation_log", //操作日志
				defaultShow: true,
				order: 4,
				operation: ["r"],
				url: "./system_manage/logMan/operating/logMain.js"
			}]
		}]
	};
	var wechatApp = {
		name: "wechatApp",
		order: 1,
		id: "smartvm-app",
		subNavs: [{
			name: "wechatapp_manage",
			order: 0,
			defaultOpen: false,
			defaultShow: true,
			subModule: [{ //二级菜单
				name: "wechat_operation_center", //
				defaultShow: false,
				order: 0,
				url: "",
				subApp: [{
					name: "wechat_deliver_plan", //
					defaultShow: true,
					order: 0,
					operation: ["r", "w"],
					url: ""
				}, {
					name: "wechat_replenish_management", //
					defaultShow: true,
					order: 1,
					operation: ["r", "w"],
					url: ""
				}, {
					name: "wechat_network_monitor", //
					defaultShow: true,
					order: 2,
					operation: ["r"],
					url: ""
				}, {
					name: "wechat_operation_report", //
					defaultShow: true,
					order: 3,
					operation: ["r"],
					url: ""
				}]
			}, { //二级菜单
				name: "wechat_data_center", //
				defaultShow: false,
				order: 1,
				url: "",
				subApp: [{
					name: "wechat_sales_report", //
					defaultShow: true,
					order: 0,
					operation: ["r"],
					url: ""
				}, {
					name: "wechat_month_report", //
					defaultShow: true,
					order: 1,
					operation: ["r"],
					url: ""
				}, {
					name: "wechat_trade_record", //
					defaultShow: true,
					order: 2,
					operation: ["r"],
					url: ""
				}]
			}]
		}]
	};
	//只有admin能看到
	var adminView = {
		name: "adminManage",
		order: 1,
		id: "smartvm-admin",
		subNavs: [{
			name: "admin_manage",
			order: 0,
			defaultOpen: false,
			defaultShow: true,
			subModule: [{
				name: "data_analysis", //数据分析
				defaultShow: true,
				order: 0,
				url: "",
				subApp: [{ //三级菜单
					name: "transaction_summary", //交易汇总
					order: 0,
					defaultShow: true,
					operation: ["r"],
					url: "./operation_manage/admin/statistics/statisticsMain.js"
				}, {
					name: "best_selling_organ_chart", //畅销机构图表
					order: 1,
					defaultShow: true,
					operation: ["r"],
					url: "./operation_manage/admin/trade/statisticsMain.js"
				}, {
					name: "delivery_failure_chart", //出货失败图表
					order: 2,
					defaultShow: true,
					operation: ["r"],
					url: "./operation_manage/admin/DeliveryFailureStatistics/statisticsMain.js"
				}]
			}, { //二级菜单
				name: "oid_manage", //机构管理
				defaultShow: true,
				order: 1,
				operation: ["r", "w"],
				url: "./system_manage/oidMan/oidMain.js"
			}, {
				name: "product_manage", //商品管理
				defaultShow: true,
				order: 2,
				operation: ["r", "w"],
				url: "./products_manage/product/list/productMain.js"
			}, {
				name: "model_manage", //机型管理
				defaultShow: true,
				order: 3,
				operation: ["r", "w"],
				url: "./operation_manage/model/modelMain.js"
			}]
		}]
	};
	var appConfig = {
		modules: [monitor, storefront, the_stage, statistics, alarm, system, adminView]
	}

	return appConfig;
})