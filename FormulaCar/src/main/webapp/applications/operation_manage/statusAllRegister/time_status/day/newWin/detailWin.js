define(function(require){
	require("cloud/base/cloud");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var transactionInfo = require('./info');
	var tcHtml = require("text!./detailWin.html");
	var Content = require("../content/content");
	
	var COLOR = Highcharts.getOptions().colors[0];
	var columns_by_automat = [ {
		"title":locale.get({lang:"automat_no"}),
		"dataIndex" : "automatNo",
		"cls" : null,
		"width" : "20%"
	}, {
		"title":locale.get({lang:"automat_name"}),
		"dataIndex" : "automatName",
		"cls" : null,
		"width" : "40%"
	}, {
		"title":locale.get({lang:"automat_of_group"}),
		"dataIndex" : "automatGroup",
		"cls" : null,
		"width" : "20%"
	}, {
		"title":locale.get({lang:"automat_online_state"}),
		"dataIndex" : "automatOS",
		"cls" : null,
		"width" : "20%"
	}];
	var columns_by_group = [ {
		"title":locale.get({lang:"automat_group_name"}),
		"dataIndex" : "automatGroupName",
		"cls" : null,
		"width" : "25%"
	}, {
		"title":locale.get({lang:"automat_group_desc"}),
		"dataIndex" : "automaGroupDesc",
		"cls" : null,
		"width" : "50%"
	}, {
		"title":locale.get({lang:"automat_of_group"}),
		"dataIndex" : "automatGroupCount",
		"cls" : null,
		"width" : "25%"
	}];
	
	var win = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
            this.element.html(tcHtml);
            this.elements = {
				content : {
					id : "content-table"
				},
				info : {
					id : "info-table"
				}
			};
            this.type = options.type;
            if(this.type == null||this.type == undefined){
            	this.type = "automat";
            }
		    this._render(options.height);
		},
		_render:function(height){
			this._renderLayout(height);
			this._renderContent(height);
			this._renderTransactionInfo(this.type);
		},
		layoutHideInfo : function() {
			this.layout.hide("east");
		},
		layoutOpenInfo : function() {
			this.layout.open("east");
		},
		_renderLayout : function(height) {
			var self = this;
			$("#content-table").css({"position":"relative"});
			$("#content-table").css("height",height*0.7+"px");
			$("#info-table").css("height",height);
			$("#transcation_count").css("height",height);
			this.layout = $("#transcation_count").layout({
				defaults : {
					paneClass : "pane",
					togglerClass : "cloud-layout-toggler",
					resizerClass : "cloud-layout-resizer",
					spacing_open: 1,
                    spacing_closed: 1,
                    togglerLength_closed: 50,
					togglerTip_open:locale.get({lang:"close"}),
                    togglerTip_closed:locale.get({lang:"open"}),  
					resizable : false,
					slidable : false
				},
				center : {
					paneSelector : "#content-table",
					onresize :function(){
						var width = $("#content-table").width();
						self.content._changeChartSize(width);
					}
				},
				east : {
					paneSelector : "#info-table",
					initClosed : true,
					size : 308
				}
			});this.layout.hide("east");
		},
		_renderContent : function(height) {
			var self = this;
			this.content = new Content({
				selector: "#"+this.elements.content.id,
				height:height,
				columns_by_automat:columns_by_automat,
				columns_by_group:columns_by_group,
				events:{
					"click":function(type,tab){
						if(tab == "tab"){
							self.layout.hide("east");
						}else{
							self._renderTransactionInfo(type);
							
							self.layout.open("east");
						}
						
						//console.log($("#"+self.elements.content.id).width()-$("#"+self.elements.info.id).width());
						//callback($("#"+self.elements.content.id).width()-$("#"+self.elements.info.id).width());
					}
				}
			});
		},
		_renderTransactionInfo : function(type){
			this.info = new transactionInfo({
				selector:"#"+this.elements.info.id,
				type:type
			});
		},
		_renderChart:function(){
			this.element.find("#transaction_count_chart").highcharts("StockChart",{
                chart: {
                    zoomType: 'x'
                },
                navigator:{
                    enabled:false
                },
                rangeSelector:{
                    enabled:false
                },
                scrollbar:{
                    enabled:false
                },
                credits:{
                    enabled:false
                },
                exporting:{
                    enabled:false
                },
                legend: {
                    enabled: false
                },
                plotOptions:{
                    area:{
                        marker:{
                            lineWidth: 2,
                            fillColor: 'white',
                            lineColor:COLOR,
                            enabled: true
                        },
                        lineWidth : 2,
                        dataGrouping:{
                            approximation:"high",
                            groupPixelWidth:10,

                            units: [
                                ["day",[1,7]],
                                ["month",[1]]
                            ]

                        }
                    }
                },
                xAxis:{
                    dateTimeLabelFormats: {
                        second: '%H:%M:%S',
                        minute: '%H:%M',
                        hour: '%H:%M',
                        day: '%m-%d',
                        week: '%m-%d',
                        month: '%Y-%m',
                        year: '%Y'
                    },
                    type : "datetime"

                },
                yAxis: [{
                    labels: {
                        align:"left",
                        x: 0,
                        y: 0,
                        style: {
                            color: COLOR
                        }
                    },
                    min:0,
                    minPadding:5,
                    title: {
                        text: '',
                        style: {
                            color: COLOR
                        }
                    }
                }],
                tooltip: {
                    shared: true
                }
            });
			this.loadChartData();
		},
		//刷新
		loadChartData:function(){
        	 this.chart = this.element.find("#transaction_count_chart").highcharts();
             var result=[10,8,20,100,60];
             var online_rateChart = this.chart.get("automat_transaction_count");
             if(online_rateChart){	
            	 online_rateChart.setData(result);
             }else{
                this.chart.addSeries({              
                         id:"automat_transaction_count",
                         //name: locale.get("online_rate"),
                         color: COLOR,
                         type: 'area',//区域图（area）
                         data: result,
                         tooltip: {
                             valueSuffix: locale.get("ren")
                         }
                });
             }
        },
        loadTableData : function() {
        	var self = this;
			var pagenew='';
			var data = {"total":7,"result":[
			                                {"automatNo":"0001","automatName":"望京科技园启明国际大厦1层","automatGroup":"启明国际大厦","automatOS":"在线"},
			                                {"automatNo":"0002","automatName":"望京科技园启明国际大厦2层","automatGroup":"启明国际大厦","automatOS":"在线"},
			                                {"automatNo":"0003","automatName":"望京科技园启明国际大厦3层","automatGroup":"启明国际大厦","automatOS":"在线"},
			                                {"automatNo":"0004","automatName":"望京科技园启明国际大厦M层","automatGroup":"启明国际大厦","automatOS":"在线"},
			                                {"automatNo":"0005","automatName":"望京科技园启明国际大厦8层","automatGroup":"启明国际大厦","automatOS":"在线"},
			                                {"automatNo":"0006","automatName":"望京科技园启明国际大厦11层","automatGroup":"启明国际大厦","automatOS":"在线"},
			                                {"automatNo":"0007","automatName":"望京科技园启明国际大厦15层","automatGroup":"启明国际大厦","automatOS":"在线"}
			                                ],"limit":7,"cursor":0};
			var total = data.result.length;
        	self.totalCount = data.result.length;
        	data.total = total;
			self.content.render(data.result);
			self._renderpage(data, 1);
		},
        _renderpage:function(data, start){
        	var self = this;
        	if(this.page){
        		this.page.reset(data);
        	}else{
        		this.page = new Paging({
        			selector : $("#" + this.elements.transaction_count_paging_el),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				var data = {"total":7,"result":[
						                                {"automatNo":"0001","automatName":"望京科技园启明国际大厦1层","automatGroup":"启明国际大厦","automatOS":"在线"},
						                                {"automatNo":"0002","automatName":"望京科技园启明国际大厦2层","automatGroup":"启明国际大厦","automatOS":"在线"},
						                                {"automatNo":"0003","automatName":"望京科技园启明国际大厦3层","automatGroup":"启明国际大厦","automatOS":"在线"},
						                                {"automatNo":"0004","automatName":"望京科技园启明国际大厦M层","automatGroup":"启明国际大厦","automatOS":"在线"},
						                                {"automatNo":"0005","automatName":"望京科技园启明国际大厦8层","automatGroup":"启明国际大厦","automatOS":"在线"},
						                                {"automatNo":"0006","automatName":"望京科技园启明国际大厦11层","automatGroup":"启明国际大厦","automatOS":"在线"},
						                                {"automatNo":"0007","automatName":"望京科技园启明国际大厦15层","automatGroup":"启明国际大厦","automatOS":"在线"}
						                                ],"limit":7,"cursor":0};
        				callback(data);
        				/*service.getUserMessage(function(data) {
        					 if(data.result){
        						 var oid = data.result.oid;//机构ID
        				         $.ajax({
        						   type : 'GET',
        						   url : '/purchase_rainbow/yt/purchase/order?cursor='+options.cursor+'&limit='+options.limit+"&oid="+oid,
        						   async : false,
        						   dataType : "json",
        						   success : function(data) {
        							   callback(data);
        						   }
        					    });
        					 }
        				});*/

        			},
        			turn:function(data, nowPage){
        			    self.totalCount = data.result.length;
        			    self.tcTable.clearTableData();
        			    self.tcTable.render(data.result);
        				self.nowPage = parseInt(nowPage);
        			},
        			events : {
        			    "displayChanged" : function(display){
        			        self.display = parseInt(display);
        			    }
        			}
        		});
        		this.nowPage = start;
        	}
        },
		destroy:function(){
			if (this.layout && (!this.layout.destroyed)) {
	            this.layout.destroy();
	        }
				
			if(this.content){
				this.content.destroy();
				this.content = null;
			}
		}
	});
	return win;
})