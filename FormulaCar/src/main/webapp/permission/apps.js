define(function(require) {
	// permission id 592
	var apps = {

		"default": [3, 5, 6, 7, 83, 84, 516, 517, 518, 587],

		apGis: {   // 概览
			show: [1011],
			read: [1010, 1011, 555, 563, 544, 520, 660, 661],
			write: []
		},
		
		area_manage: {  //区域管理
			show: [1201],
			read: [1200, 1201, 3000],
			write: [3001]
		},
		storefront_management: {   // 店面管理
			show: [1202],
			read: [1200, 1202, 559, 551],
			write: [560, 561, 562]
		},
		agency_management: {  // 经销商管理
			show: [1203],
			read: [1200, 1203, 563, 559],
			write: [564, 565, 566, 554]
		},
	
		stage_management: {  //赛台管理
			show: [1301],
			read: [1300, 1301, 555, 559, 539, 588],
			write: [556, 557, 558, 563, 539, 6000],
			confirm: [568]
		},

		model_manage: { //机型管理
			show: [1304],
			read: [1300, 1304, 513],
			write: [512, 514, 515]
		},
		upgrade: {   //远程升级
			show: [1305],
			read: [1300, 1305, 504, 500],
			write: [505, 506, 507, 555, 559]
		},
		automat_dominate_list: {  //设备列表
			show: [1306],
			read: [1300, 1306, 548],
			write: []
		},
		online_statistics: {  //在线统计
			show: [1307],
			read: [1300, 1307, 11, 81, 555],
			write: []
		},
		signal_statistics: {   //信号统计
			show: [1308],
			read: [1300, 1308, 548, 549, 100],
			write: []
		},
		flow_statistics: {   //流量统计
			show: [1309],
			read: [1300, 1309, 548, 549, 701],
			write: []
		},

		//统计
		all_cars: {   // 跑车量汇总
			show: [1502],
			read: [1500, 1502, 540, 544, 541, 542, 543, 555, 524],
			write: []
		},
		automat_trade_count: {  // 交易汇总
			show: [1513],
			read: [1500, 1502, 540, 544, 541, 542, 543, 555, 524],
			write: []
		},
		all_register: {   // 注册量汇总
			show: [1503],
			read: [1500, 1503, 545, 555],
			write: []
		},
		active_time_graph: {  // 活跃时间汇总
			show: [1506],
			read: [1500, 1506, 546],
			write: []
		},
		active_storefront: {  // 活跃店面
			show: [1507],
			read: [1500, 1507, 547, 555],
			write: []
		},
		active_agency: {  // 畅销线路
			show: [1508],
			read: [1500, 1508, 600, 601, 602],
			write: []
		},
		all_register_statistcs: {   // 注册用户量汇总
			show: [1514],
			read: [1500, 1502, 540, 544, 541, 542, 543, 555, 524],
			write: []
		},
		
		
		cars_detail: {    //跑车明细
			show: [1501],
			read: [1500, 1501, 524, 525, 559, 527],
			write: [522, 523]
		},
		
		agency_statistics: {  //经销商统计
			show: [1512],
			read: [1500, 1512, 544],
			write: []
		},
		
		storefront_statistics: {  //店面统计
			show: [1511],
			read: [1500, 1511, 544],
			write: []
		},
		
		stage_time_statistics: {   //赛台时间统计
			show: [1509],
			read: [1500, 1509, 544],
			write: []
		},
		
		
		//告警
		event_list: {   //事件列表
			show: [1801],
			read: [1800, 1801, 520],
			write: []
		},
		alarm_list: {  //告警列表
			show: [1802],
			read: [1800, 1802, 520],
			write: [519, 521]
		},
		maintenance_list: {  //维护列表
			show: [1803],
			read: [1800, 1802, 520],
			write: []
		},
		
		//增值服务
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
		operation_log : {
			show : [ 2010 ],
			read : [ 2000, 2010, 39, 40, 81 ],
			write : []
		},
		rfd_manage: {
			show: [2002],
			read: [2000, 2002, 3008],
			write: [3009]
		}

	}

	return apps;

});