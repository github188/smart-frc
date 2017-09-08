define(function(require) {
	// permission id 592
	var apps = {

		"default": [3, 5, 6, 7, 83, 84, 516, 517, 518, 587],

		apGis: {
			show: [1011],
			read: [1010, 1011, 555, 563, 544, 520, 660, 661],
			write: []
		},
		
		area_manage: {
			show: [1201],
			read: [1200, 1201, 3000],
			write: [3001]
		},
		storefront_management: {
			show: [1202],
			read: [1200, 1202, 559, 551],
			write: [560, 561, 562]
		},
		agency_management: {
			show: [1203],
			read: [1200, 1203, 563, 559],
			write: [564, 565, 566, 554]
		},
		//售货机
		stage_management: {
			show: [1301],
			read: [1300, 1301, 555, 559, 539, 588],
			write: [556, 557, 558, 563, 539, 6000],
			confirm: [568]
		},

		channel_manage: {
			show: [1302],
			read: [1300, 1302, 555, 559, 539, 588],
			write: [556, 557, 558, 563, 539, 6001]
		},
		channelTemplate_manage: {
			show: [1303],
			read: [1300, 1303, 567],
			write: [569, 570, 571, 513, 555]
		},
		model_manage: {
			show: [1304],
			read: [1300, 1304, 513],
			write: [512, 514, 515]
		},
		upgrade: {
			show: [1305],
			read: [1300, 1305, 504, 500],
			write: [505, 506, 507, 555, 559]
		},
		automat_dominate_list: {
			show: [1306],
			read: [1300, 1306, 548],
			write: []
		},
		online_statistics: {
			show: [1307],
			read: [1300, 1307, 11, 81, 555],
			write: []
		},
		signal_statistics: {
			show: [1308],
			read: [1300, 1308, 548, 549, 100],
			write: []
		},
		flow_statistics: {
			show: [1309],
			read: [1300, 1309, 548, 549, 701],
			write: []
		},


		//商品
		product_manage: {
			show: [1401],
			read: [1400, 1401, 527],
			write: [526, 528, 529, 574, 575, 576, 577, 578, 6002],
			import: [530]
		},
		price_manage: {
			show: [1402],
			read: [1400, 1402, 527],
			write: [526, 528, 529, 574, 575, 576, 577, 578, 6003],
			import: [530]
		},


		oid_manage: {
			show: [1403],
			read: [1400, 1403, 527],
			write: [526, 528, 529, 574, 575, 576, 577, 578, 6004],
			import: [530]
		},

		//统计
		cars_detail: {
			show: [1501],
			read: [1500, 1501, 524, 525, 559, 527],
			write: [522, 523]
		},

		all_cars: {
			show: [1502],
			read: [1500, 1502, 540, 544, 541, 542, 543, 555, 524],
			write: []
		},
		automat_trade_count: {
			show: [1513],
			read: [1500, 1502, 540, 544, 541, 542, 543, 555, 524],
			write: []
		},
		all_register: {
			show: [1503],
			read: [1500, 1503, 545, 555],
			write: []
		},
		best_selling_organ_chart: {
			show: [1504],
			read: [1500, 1504, 547, 555],
			write: []
		},
		delivery_failure_chart: {
			show: [1505],
			read: [1500, 1505, 548, 555],
			write: []
		},
		active_time_graph: {
			show: [1506],
			read: [1500, 1506, 546],
			write: []
		},
		active_storefront: {
			show: [1507],
			read: [1500, 1507, 547, 555],
			write: []
		},
		active_agency: {
			show: [1508],
			read: [1500, 1508, 600, 601, 602],
			write: []
		},
		stage_time_statistics: {
			show: [1509],
			read: [1500, 1509, 544],
			write: []
		},
		commodity_time_period_statistics: {
			show: [1510],
			read: [1500, 1510, 544],
			write: []
		},
		storefront_statistics: {
			show: [1511],
			read: [1500, 1511, 544],
			write: []
		},
		agency_statistics: {
			show: [1512],
			read: [1500, 1512, 544],
			write: []
		},
		all_register_statistcs: {
			show: [1514],
			read: [1500, 1502, 540, 544, 541, 542, 543, 555, 524],
			write: []
		},
		//补货
		inventory_status_old: { //库存状态
			show: [1604],
			read: [1600, 1604, 572, 559],
			write: []
		},
		replenish_management: { //补货管理
			show: [1601],
			read: [1600, 1601, 572, 851, 855],
			write: [850, 852, 853, 854, 6005]
		},
		stock_management: { //出库管理
			show: [1602],
			read: [1600, 1602, 851, 855],
			write: [850, 852, 853, 854, 6006]
		},
		replenishment_record: { //补货记录
			show: [1603],
			read: [1600, 1603, 572, 559],
			write: []
		},
		replenishment_record_old: { //补货记录(旧)
			show: [1604],
			read: [1600, 1604, 572, 559],
			write: []
		},
		//对账
		replenishment_reconciliation: { //对账
			show: [1701],
			read: [1700, 1701, 572, 559],
			write: []
		},
		query_has_been_settled: {
			show: [1702],
			read: [1700, 1702, 670],
			write: []
		},
		query_not_settled: {
			show: [1703],
			read: [1700, 1703, 670],
			write: [671]
		},
		//告警
		event_list: {
			show: [1801],
			read: [1800, 1801, 520],
			write: []
		},
		alarm_list: {
			show: [1802],
			read: [1800, 1802, 520],
			write: [519, 521]
		},
		maintenance_list: {
			show: [1803],
			read: [1800, 1802, 520],
			write: []
		},
		//增值服务
		advertisement_release: {
			show: [1901],
			read: [1900, 1901, 500],
			write: [501, 502, 503, 555, 559]
		},
		media_library: {
			show: [1902],
			read: [1900, 1902, 581, 582],
			write: [580, 583, 584, 585, 6007]
		},
		advertisement_broadcast: {
			show: [1907],
			read: [1900, 1907, 581, 582, 691],
			write: [580, 583, 584, 585, 6008]
		},
		advertising_is_playing: {
			show: [1906],
			read: [1900, 1906, 555, 559, 539, 588],
		},
		lottery_allocation: {
			show: [1903],
			read: [1900, 1903, 508],
			write: [509, 510, 511, 555]
		},

		special_offer: {
			show: [1904],
			read: [1900, 1904, 810, 812],
			write: [811, 813, 814, 815, 816]
		},
		pickup_code_management: {
			show: [1905],
			read: [1900, 1905, 901],
			write: [900, 902, 903]
		},

		//系统
		role_manage: {
			show: [2001],
			read: [2000, 2001, 5, 7],
			write: [8]
		},
		user_manager: {
			show: [2002],
			read: [2000, 2002, 5, 7],
			write: [1107, 6]
		},

		WeChat_payment: {
			show: [2003],
			read: [2000, 2003, 532],
			write: [531, 533]
		},
		Baidu_Wallet: {
			show: [2004],
			read: [2000, 2004, 536],
			write: [534, 535]
		},
		Wing_payment: {
			show: [2005],
			read: [2000, 2005, 610],
			write: [611, 612]
		},
		Jingdong_Wallet: {
			show: [2006],
			read: [2000, 2006, 615],
			write: [616, 617]
		},

		Vip_payment: {
			show: [2007],
			read: [2000, 2007, 620],
			write: [621, 622]
		},
		UnionPay_payment: {
			show: [2008],
			read: [2000, 2008, 701],
			write: [700, 702]
		},
		QrcodePay_payment: {
			show: [2013],
			read: [2000, 2008, 905],
			write: [904, 906]
		},
		Alipay: {
			show: [2009],
			read: [2000, 2009, 538],
			write: [537]
		},
		operation_log: {
			show: [2010],
			read: [2000, 2010, 39, 40, 81],
			write: []
		},
		parameter_config: {
			show: [2011],
			read: [2000, 2011, 822],
			write: [820, 821]
		},
		secure_login: {
			show: [2012],
			read: [2000, 2012],
			write: []
		},


		wechat_replenish_management: {
			show: [2101],
			read: [2100, 2101, 660, 572, 851],
			write: [850, 852, 853, 854, 6009]
		},
		/*		wechat_mytask : {
					show : [ 2001 ],
					read : [ 2000, 2001, 660,661,559 ],
					write : [ 800 ]
				},*/

		wechat_deliver_plan: {
			show: [2102],
			read: [2100, 2102, 851, 855],
			write: [850, 852, 853, 854, 6010]
		},
		wechat_network_monitor: {
			show: [2103],
			read: [2100, 2103, 555, 559],
			write: []
		},
		wechat_operation_report: {
			show: [2104],
			read: [2100, 2104, 544, 547, 555, 559, 600],
			write: []
		},
		wechat_sales_report: {
			show: [2105],
			read: [2100, 2105, 544, 555, 559, 600],
			write: []
		},
		wechat_month_report: {
			show: [2106],
			read: [2100, 2106, 544, 559],
			write: []
		},
		wechat_trade_record: {
			show: [2107],
			read: [2100, 2107, 524, 559],
			write: []
		}

		// 公告
	}

	return apps;

});