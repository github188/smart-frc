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
		subNavs: [{ //概览
			name: "apGis",
			order: 0,
			defaultOpen: true,
			defaultShow: true,
			url: "./home_manage/homeMain.js"
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
			subModule: [{
				name: "area_manage", //区域管理
				defaultShow: true,
				order: 0,
				operation: ["r", "w"],
				url: "./operation_manage/area/areaMain.js"
			}, {
				name: "agency_management", // 经销商管理
				defaultShow: true,
				order: 1,
				operation: ["r", "w"],
				url: "./operation_manage/line/lineMain.js"
			}, {
				name: "storefront_management", // 店面管理
				defaultShow: true,
				order: 2,
				operation: ["r", "w"],
				url: "./operation_manage/automat/automat_site_manage/siteMain.js"
			}]
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
					name: "stage_management", //赛台管理
					defaultShow: true,
					order: 0,
					operation: ["r", "w"],
					url: "./operation_manage/vendingMachine/vendingMachineMain.js"
				},
				{
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
						},
						 {
							name: "flow_statistics", //流量统计
							order: 3,
							defaultShow: true,
							operation: ["r"],
							url: "./trade_manage/statistics/trafficStatistics/trafficMain.js"
						},
						{
							name: "signal_statistics", //信号统计
							order: 4,
							defaultShow: true,
							operation: ["r"],
							url: "./trade_manage/statistics/signalStatistics/contentMain.js"
						}
					]
				}
			]
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
					// 跑车量汇总
					name: "all_cars",
					order: 0,
					defaultShow: true,
					operation: ["r"],
					url: "./operation_manage/status/statistics/statisticsMain.js"
				}, {
					// 交易汇总
					name: "automat_trade_count",
					order: 1,
					defaultShow: true,
					operation: ["r"],
					url: "./operation_manage/statusSale/statistics/statisticsMain.js"
				}, {
					// 注册量汇总
					name: "all_register",
					order: 2,
					defaultShow: true,
					operation: ["r"],
					url: "./trade_manage/statistics/tradeStatistics/tradeStatisticsMain.js"
				}, {
					// 活跃时间汇总
					name: "active_time_graph",
					order: 3,
					defaultShow: true,
					operation: ["r"],
					url: "./trade_manage/statistics/goodsStatistics/goodsStatisticsMain.js"
				}, {
					// 活跃店面
					name: "active_storefront",
					order: 4,
					defaultShow: true,
					operation: ["r"],
					url: "./trade_manage/statistics/deviceStatistics/statisticsMain.js"
				}, {
					// 畅销线路
					name: "active_agency",
					order: 5,
					defaultShow: true,
					operation: ["r"],
					url: "./trade_manage/statistics/lineStatistics/statisticsMain.js"
				}, {
					// 注册用户量汇总
					name: "all_register_statistcs",
					order: 5,
					defaultShow: true,
					operation: ["r"],
					url: "./operation_manage/statusAllRegister/statistics/statisticsMain.js"
				}]
			}, { //二级菜单
				// 跑车明细
				name: "cars_detail",
				defaultShow: true,
				order: 1,
				url: "",
				subApp: [{ //三级菜单
					// 跑车明细
					name: "cars_detail",
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
						// 经销商统计
						name: "agency_statistics",
						order: 0,
						defaultShow: true,
						operation: ["r"],
						url: "./reportCenter/lineTurnoverStatistics/lineTurnoverMain.js"
					}, {
						// 店面统计
						name: "storefront_statistics",
						order: 1,
						defaultShow: true,
						operation: ["r"],
						url: "./reportCenter/siteTurnoverStatistics/siteTurnoverMain.js"
					}, {
						// 赛台时间统计
						name: "stage_time_statistics",
						order: 2,
						defaultShow: true,
						operation: ["r"],
						url: "./reportCenter/deviceTimeStatistics/deviceStatisticsMain.js"
					}
				]
			}]
		}]
	};
	//告警
	var alarm = {
		name: "alarm",
		order: 1,
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
				name: "maintenance_list", //维护列表
				defaultShow: true,
				order: 1,
				operation: ["r", "w"],
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
				}, {
					name: "IcbcPay_payment", //工行 融e联支付
					order: 6,
					defaultShow: true,
					operation: ["r", "w"],
					url: "./system_manage/payMan/icbcPay_pay/icbcPayMain.js"
				}, {
					name: "Dragon_payment", //建行 龙支付
					order: 7,
					defaultShow: true,
					operation: ["r", "w"],
					url: "./system_manage/payMan/dragon_pay/dragonPayMain.js"
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
			}, {
				name: "billManage", //账单
				defaultShow: true,
				order: 5,
				operation: ["r"],
				url: "",
				subApp: [{ //二级菜单
					name: "unpay_bill_manage", //待付款账单
					defaultShow: true,
					order: 1,
					operation: ["r", "w"],
					url: "./bill_manage/unpay/unpayOrderMain.js"
				}, {
					name: "all_bill_manage", //所有账单
					defaultShow: true,
					order: 2,
					operation: ["r", "w"],
					url: "./bill_manage/all/allOrderMain.js"
				}, {
					name: "bill_desc", //计费方式
					defaultShow: true,
					order: 3,
					operation: ["r", "w"],
					url: "./bill_manage/payDetail/payDetailMain.js"
				}]
			}, {
				name: "help_document", //帮助文档
				defaultShow: true,
				order: 6,
				operation: ["r"],
				url: "./system_manage/helpDocMan/helpMain.js"
			}, {
				name: "update_desc", //关于平台
				defaultShow: true,
				order: 7,
				operation: ["r"],
				url: "./system_manage/updateDesc/updateDescMain.js"
			}]
		}]
	};
	var appConfig = {
		modules: [monitor, storefront, the_stage, statistics, alarm, system]
	}

	return appConfig;
})