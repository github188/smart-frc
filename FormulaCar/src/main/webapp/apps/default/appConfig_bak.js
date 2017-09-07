define(function(require) {
	
	var gisUrl = "./monitor/gis";
	var languge = localStorage.getItem("language");
    if (languge == "en") {
    	gisUrl = "./monitor/gis_en";
    }
    //监控(首页)
	var monitor = {
		name : "monitor",
		order : 0,
		id:"smartvm-monitor",
		subNavs : [ {// 电子地图
			name : "apGis",
			order : 0,
			defaultOpen : true,
			defaultShow : true,
			url : gisUrl
		} ]
	};
	//组织
	var organization = {
		name : "organization",
		order :1,
		id:"smartvm-organization",
		subNavs:[{
			name:"organization_manage",
			order : 0,
			defaultOpen : false,
			defaultShow : true,
			subModule:[
		/*	{            //二级菜单
				name : "organization_structure_manage", //组织结构管理 
				defaultShow : true,
				order : 0,
				operation:["r","w"],
				url : "./structure_manage/structure/structureMain.js"
			},*/
			{                       
				name : "area_manage", //区域管理
				defaultShow : true,
				order : 0,
				operation:["r","w"],
				url : "./operation_manage/area/areaMain.js"
			},{
				name : "line_manage", //线路管理
				defaultShow : true,
				order : 1,
				operation:["r","w"],
				url : "./operation_manage/line/lineMain.js"
			},{
				name:"site_manage",//点位管理
				defaultShow : true,
				order : 2,
				operation:["r","w"],
				url : "./operation_manage/automat/automat_site_manage/siteMain.js"
			},{
				name:"role_manage",//角色管理
				defaultShow : true,
				order : 3,
				operation:["r","w"],
				url : "./system_manage/roleMan/role/roleMain.js"
			},{
				name:"user_manager",//用户管理
				defaultShow : true,
				order : 4,
				operation:["r","w"],
				url : "./system_manage/userMan/user/userMain.js"
			}]
		}]
	};
	//售货机
	var smartVm={
		name : "smartVm",
		order :2,
		id:"smartvm-smartVm",
		subNavs:[{
			name:"smartVm_manage",
			order : 0,
			defaultOpen : false,
			defaultShow : true,
			subModule:[{                         //二级菜单
				name : "vendingMachine_manage", //售货机管理
				defaultShow : true,
				order : 0,
				operation:["r","w"],
				url : "./operation_manage/vendingMachine/vendingMachineMain.js"
			},{
				name : "model_manage", //机型管理
				defaultShow : true,
				order : 1,
				operation:["r","w"],
				url : "./operation_manage/model/modelMain.js"
			},{
				name:"channelTemplate_manage",//料道管理
				defaultShow : true,
				order : 2,
				operation:["r","w"],
				url : "./operation_manage/channelTemplateV2/channelMain.js"
			},{
				name:"inbox",//工控机
				defaultShow : true,
				order : 3,
				url : "",
				subApp : [ {                              //三级菜单
					name : "inbox_manage",     //工控机管理
					order : 0,
					defaultShow : true,
					operation:["r","w"],
					url : "./operation_manage/inboxMan/control/inboxMain.js"
				},{
					name : "upgrade",     //远程升级
					order : 0,
					defaultShow : true,
					operation:["r","w"],
					url : "./operation_manage/deviceUpgrade/upgradeMain.js"
				}]
			}]
		}]
	};
	//商品
	var product = {
			name : "product",
			order :1,
			id:"smartvm-product",
			subNavs:[{
				name:"product_manage",
				order : 0,
				defaultOpen : false,
				defaultShow : true,
				subModule:[{                         //二级菜单
					name : "product_manage", //商品管理
					defaultShow : true,
					order : 0,
					operation:["r","w"],
					url : "./products_manage/product/list/productMain.js"
				}
//				,{
//					name : "type_manage", //类型管理
//					defaultShow : true,
//					order : 1,
//					operation:["r","w"],
//					url : ""
//				}
//				,{
//					name:"brand_manage",//品牌管理
//					defaultShow : true,
//					order : 2,
//					operation:["r","w"],
//					url : ""
//				}
				]
			}]
	 };
	//统计
	var statistics = {
			name : "statistics",
			order :1,
			id:"smartvm-statistics",
			subNavs:[{
				name:"statistics_manage",
				order : 0,
				defaultOpen : false,
				defaultShow : true,
				subModule:[{                         //二级菜单
					name : "transaction_flow", //交易流水
					defaultShow : true,
					order : 0,
					url : "",
					subApp : [{                              //三级菜单
						name : "transaction_detail",     //交易明细
						order : 0,
						defaultShow : true,
						operation:["r","w"],
						url : "./trade_manage/tradeDetail/list/tradeMain.js"
					},{
						name : "pick_up_code",     //取货码
						order : 0,
						defaultShow : true,
						operation:["r"],
						url : "./operation_manage/code/codeMain.js"
					}]
				},{
					name : "data_analysis", //数据分析
					defaultShow : true,
					order : 1,
					url : "",
					subApp : [ {                              //三级菜单
						name : "transaction_summary",     //交易汇总
						order : 0,
						defaultShow : true,
						operation:["r"],
						url : "./operation_manage/status/statistics/statisticsMain.js"
					},{
						name : "best_selling_time_chart",     //畅销时间图表
						order : 1,
						defaultShow : true,
						operation:["r"],
						url : "./trade_manage/statistics/tradeStatistics/tradeStatisticsMain.js"
					},{
						name : "popular_goods",     //畅销商品
						order : 2,
						defaultShow : true,
						operation:["r"],
						url : "./trade_manage/statistics/goodsStatistics/goodsStatisticsMain.js"
					},{
						name : "best_seller_point",     //畅销点位
						order : 3,
						defaultShow : true,
						operation:["r"],
						url : "./trade_manage/statistics/deviceStatistics/statisticsMain.js"
					},{
						name : "best_selling_line",     //畅销线路
						order : 4,
						defaultShow : true,
						operation:["r"],
						url : "./trade_manage/statistics/lineStatistics/statisticsMain.js"
					}]
				},{
					name:"transaction_report",//报表中心
					defaultShow : true,
					order : 2,
					url : "",
					subApp : [{
							name : "line_turnover_summary",     //线路营业额汇总
							order : 0,
							defaultShow : true,
							operation:["r"],
							url :  "./reportCenter/lineTurnoverStatistics/lineTurnoverMain.js"
					    },{
							name : "point_to_point_turnover",     //点位营业额汇总
							order : 1,
							defaultShow : true,
							operation:["r"],
					 		url : "./reportCenter/siteTurnoverStatistics/siteTurnoverMain.js"
					    },{
							name : "device_time_period_statistics",     //售货机时间段统计
							order : 2,
							defaultShow : true,
							operation:["r"],
							url : "./reportCenter/deviceTimeStatistics/deviceStatisticsMain.js"
						}
					    /*,{
							name : "single_day_sales_statistics",     //售货机日销售统计
							order : 3,
							defaultShow : true,
							operation:["r"],
							url : "./reportCenter/deviceDayStatistics/deviceDayStatisticsMain.js"
					    }, {                             
							name : "commodity_sales_statistics",     //售货机商品销售统计
							order : 4,
							defaultShow : true,
							operation:["r"],
							url : "./reportCenter/deviceGoodsStatistics/deviceGoodsStatisticsMain.js"
					    }*/
					    ,{
							name : "commodity_time_period_statistics",     //商品时间段统计
							order : 5,
							defaultShow : true,
							operation:["r"],
							url : "./reportCenter/productTimeStatistics/ptStatisticsMain.js"
						}]
				},{
					name:"settlement",//结算 
					defaultShow : true,
					order : 3,
					url : "",
					subApp : [ {                              //三级菜单
						name : "query_not_settled",     //未结算查询
						order : 0,
						defaultShow : true,
						operation:["r"],
						url : "./operation_manage/settle/nosettleMain.js"
					},{
						name : "query_has_been_settled",     //已结算查询
						order : 1,
						defaultShow : true,
						operation:["r"],
						url : "./operation_manage/settle/settleMain.js"
					}]
				},{
					name:"equipment_statistics",//设备统计
					defaultShow : true,
					order : 4,
					url : "",
					subApp : [ {                              //三级菜单
						name : "online_statistics",     //在线统计
						order : 0,
						defaultShow : true,
						operation:["r"],
						url : "./reports/online/report/contentMain.js"
					},{
						name : "signal_statistics",     //信号统计
						order : 1,
						defaultShow : true,
						operation:["r"],
						url : "./trade_manage/statistics/signalStatistics/contentMain.js"
					},{
						name : "flow_statistics",     //流量统计
						order : 2,
						defaultShow : true,
						operation:["r"],
						url : "./trade_manage/statistics/trafficStatistics/trafficMain.js"
					}]
				}]
			}]
		};
	//库存
	var stock = {
			name : "stock",
			order :1,
			id:"smartvm-stock",
			subNavs:[{
				name:"stock_manage",
				order : 0,
				defaultOpen : false,
				defaultShow : true,
				subModule:[{                         //二级菜单
					name : "inventory_status", //库存状态
					defaultShow : true,
					order : 0,
					operation:["r","w"],
					url : "./operation_manage/replenishmentv2/reconciliation/reconciliationMan.js"
				},{
					name : "stock_management", //库存管理
					defaultShow : true,
					order : 1,
					operation:["r","w"],
					url : "./operation_manage/replenishmentv2/stock_manage/stockmanageMain.js"
				},{
					name : "replenish_forecast", //补货预测
					defaultShow : true,
					order : 2,
					operation:["r"],
					url : "./operation_manage/replenishmentv2/forecast/forecastMain.js"
				},/*{
					name : "replenishment_plan", //补货计划
					defaultShow : true,
					order : 3,
					operation:["r","w"],
					url : "./operation_manage/replenishmentv2/plan/planMain.js"
				},*/{
					name:"replenishment_record",//补货记录
					defaultShow : true,
					order : 4,
					operation:["r"],
					url : "./operation_manage/replenishmentv2/record/recordMain.js"
				},{
					name:"replenishment_reconciliation",//补货对账
					defaultShow : true,
					order : 5,
					operation:["r"],
					url : "./operation_manage/replenishmentv2/statement/statementMain.js"
				}]
			}]
	 };
/*	var stock = {
			name : "stock",
			order :1,
			id:"smartvm-stock",
			subNavs:[{
				name:"stock_manage",
				order : 0,
				defaultOpen : false,
				defaultShow : true,
				subModule:[{                         //二级菜单
					name : "inventory_status", //库存状态
					defaultShow : true,
					order : 0,
					operation:["r","w"],
					url : "./operation_manage/replenishment/reconciliation/reconciliationMan.js"
				},{
					name : "replenishment_plan", //补货计划
					defaultShow : true,
					order : 1,
					operation:["r","w"],
					url : "./operation_manage/replenishment/plan/planMain.js"
				},{
					name:"replenishment_record",//补货记录
					defaultShow : true,
					order : 2,
					operation:["r"],
					url : "./operation_manage/replenishment/record/recordMain.js"
				},{
					name:"replenishment_reconciliation",//补货对账
					defaultShow : true,
					order : 3,
					operation:["r"],
					url : "./operation_manage/replenishment/statement/statementMain.js"
				}]
			}]
	 };*/
	//告警  
	var alarm = {
			name : "alarm",
			order :1,
			id:"smartvm-alarm",
			subNavs:[{
				name:"alarm_manage",
				order : 0,
				defaultOpen : false,
				defaultShow : true,
				subModule:[{                         //二级菜单
					name : "event_list", //事件列表
					defaultShow : true,
					order : 0,
					operation:["r"],
					url : "event_manage/event/eventMain.js"
				},{
					name : "alarm_list", //告警列表
					defaultShow : true,
					order : 1,
					url : "event_manage/alarm/alarmMain.js"
				}]
			}]
	 };
	//增值服务
	var services={
			name : "services",
			order :1,
			id:"smartvm-services",
			subNavs:[{
				name:"services_manage",
				order : 0,
				defaultOpen : false,
				defaultShow : true,
				subModule:[{                         //二级菜单
					name : "media_library", //媒体库
					defaultShow : true,
					order : 0,
					operation:["r","w"],
					url : "./addValueService_manage/medias/mediasMain.js"
				},{                         //二级菜单
					name : "advertisement_release", //广告发布
					defaultShow : true,
					order : 1,
					operation:["r","w"],
					url : "./addValueService_manage/advertisement/adMain.js"
				},{
					name : "lottery_allocation", //抽奖配置
					defaultShow : true,
					order : 2,
					operation:["r","w"],
					url : "./addValueService_manage/lotterymanage/lotteryMain.js"
				},{
					name : "contract_management", //合同管理
					defaultShow : true,
					order : 3,
					operation:["r","w"],
					url : "./addValueService_manage/contractManage/contractMain.js"
				},{
					name:"special_offer",//优惠活动
					defaultShow : true,
					order : 4,
					operation:["r","w"],
					url : "./addValueService_manage/specialoffer/specialofferMain.js"
				},{
					name:"pickup_code_management",//取货码管理
					defaultShow : true,
					order : 5,
					operation:["r","w"],
					url : "./addValueService_manage/pickupCode/pickupCodeMain.js"
				}]
			}]
	};
	//系统
	var system={
			name : "system_vm",
			order :1,
			id:"smartvm-system_vm",
			subNavs:[{
				name:"system_manage",
				order : 0,
				defaultOpen : false,
				defaultShow : true,
				subModule:[{                         //二级菜单
					name : "payment_allocation", //支付配置
					defaultShow : true,
					order : 0,
					url : "",
					subApp : [ {                              //三级菜单
						name : "WeChat_payment",     //微信支付
						order : 0,
						defaultShow : true,
						operation:["r","w"],
						url : "./system_manage/payMan/wechat_pay/wechatMain.js"
					},{
						name : "Alipay",     //支付宝
						order : 1,
						defaultShow : true,
						operation:["r","w"],
						url : "./system_manage/payMan/ali_pay/alipayMain.js"
					},{
						name : "Baidu_Wallet",     //百度钱包
						order : 2,
						defaultShow : true,
						operation:["r","w"],
						url : "./system_manage/payMan/baidu_pay/baiduMain.js"
					},{
						name : "Wing_payment",     //翼支付
						order : 3,
						defaultShow : true,
						operation:["r","w"],
						url : "./system_manage/payMan/best_pay/bestMain.js"
					},{
						name : "Jingdong_Wallet",     //京东钱包
						order : 4,
						defaultShow : true,
						operation:["r","w"],
						url : "./system_manage/payMan/jd_pay/jdMain.js"
					},{
						name : "Vip_payment",     //会员支付
						order : 5,
						defaultShow : true,
						operation:["r","w"],
						url : "./system_manage/payMan/vip_pay/vipMain.js"
					}]
				},{
					name : "operation_log", //操作日志
					defaultShow : true,
					order : 1,
					operation:["r"],
					url : "./system_manage/logMan/operating/logMain.js"
				},{
					name : "parameter_config", //参数配置
					defaultShow : true,
					order : 2,
					operation:["r","w"],
					url : "./system_manage/developmentMan/developmentMain.js"
				},{
					name : "secure_login", //安全登录
					defaultShow : true,
					order : 3,
					operation:["r"],
					url : "./system_manage/secureLogin/secureLoginMain.js"
				}
//						,{
//					name:"version_download",//版本下载
//					defaultShow : true,
//					order : 2,
//					url : "./system_manage/lotterymanage/lotteryMain.js"
//				}
							]
			}]
	};
	var wechatApp = {
			name : "wechatApp",
			order :1,
			id:"smartvm-app",
			subNavs:[{
				name:"wechatapp_manage",
				order : 0,
				defaultOpen : false,
				defaultShow : true,
				subModule:[{                         //二级菜单
					name : "wechat_operation_center", //
					defaultShow : false,
					order : 0,
					url : "",
					subApp : [{
						name : "wechat_replenish_forecast", //
						defaultShow : true,
						order : 0,
						operation:["r"],
						url : ""
					},/*{
						name : "wechat_mytask", //
						defaultShow : true,
						order : 0,
						operation:["r","w"],
						url : ""
					},*/{                         
						name : "wechat_stock_status", //
						defaultShow : true,
						order : 1,
						operation:["r"],
						url : ""
					},{
						name : "wechat_network_monitor", //
						defaultShow : true,
						order : 2,
						operation:["r"],
						url : ""
					},{
						name:"wechat_operation_report",//
						defaultShow : true,
						order : 3,
						operation:["r"],
						url : ""
					}]
				},{                         //二级菜单
					name : "wechat_data_center", //
					defaultShow : false,
					order : 1,
					url : "",
					subApp : [{
						name:"wechat_sales_report",//
						defaultShow : true,
						order : 0,
						operation:["r"],
						url : ""
					},{
						name:"wechat_month_report",//
						defaultShow : true,
						order : 1,
						operation:["r"],
						url : ""
					},{
						name:"wechat_trade_record",//
						defaultShow : true,
						order : 2,
						operation:["r"],
						url : ""
					}]
				}]
			}]
		};
	
	
	//只有admin能看到
	var adminView = {
			name : "adminManage",
			order :1,
			id:"smartvm-admin",
			subNavs:[{
				name:"admin_manage",
				order : 0,
				defaultOpen : false,
				defaultShow : true,
				subModule:[{
					name : "data_analysis", //数据分析
					defaultShow : true,
					order : 0,
					url : "",
					subApp : [{                              //三级菜单
						name : "transaction_summary",     //交易汇总
						order : 0,
						defaultShow : true,
						operation:["r"],
						url : "./operation_manage/admin/statistics/statisticsMain.js"
					},{
						name : "best_selling_organ_chart",     //畅销机构图表
						order : 1,
						defaultShow : true,
						operation:["r"],
						url : "./operation_manage/admin/trade/statisticsMain.js"
					},{
						name : "delivery_failure_chart",     //出货失败图表
						order : 2,
						defaultShow : true,
						operation:["r"],
						url : "./operation_manage/admin/DeliveryFailureStatistics/statisticsMain.js"
					}]
				},{                         //二级菜单
					name : "oid_manage", //机构管理
					defaultShow : true,
					order : 1,
					operation:["r","w"],
					url : "./system_manage/oidMan/oidMain.js"
				},{
					name : "product_manage", //商品管理
					defaultShow : true,
					order : 2,
					operation:["r","w"],
					url : "./products_manage/product/list/productMain.js"
				},{
					name:"model_manage",//机型管理
					defaultShow : true,
					order : 3,
					operation:["r","w"],
					url : "./operation_manage/model/modelMain.js"
				}]
			}]
		};
	var appConfig = {
		modules : [ monitor, organization,smartVm,product,statistics,stock,alarm,services,system,wechatApp,adminView]
	}

	return appConfig;
})