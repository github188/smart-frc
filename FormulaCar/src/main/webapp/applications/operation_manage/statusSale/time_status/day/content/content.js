/**
 * @author zhangcy
 * 
 */
define(function(require){
	var cloud = require("cloud/base/cloud");
	var html = require("text!./content.html");
	var Table = require("cloud/components/table");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Button = require("cloud/components/button");
	var Toolbar = require("cloud/components/toolbar");
	var Paging = require("cloud/components/paging");
	require("../css/table.css");
	var COLOR = Highcharts.getOptions().colors[0];
	var Content = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.columns_by_automat = options.columns_by_automat;
			this.columns_by_group = options.columns_by_group;
			this.businessType = options.businessType;
			this.elements = {
	           toolbar: this.id + "-toolbar",
	           content_automat: this.id + "-content-automat",
	           content_group: this.id + "-content-group",
	           paging: this.id + "-paging",
	           chart: this.id + "-chart"
	        };
			this.height = options.height;
			this.content = "";
			this.display = null;
			this.pageDisplay = 10;
			this._render();
		},
		
		_render:function(){
			this._renderHtml();
			this._renderLayout();
			this._renderContent();
		},
		_renderContent:function(){
			this._renderTableAutomat();
			this._renderTableGroup();
			this._renderChart();
			this._renderToolbar();
		},
		_renderHtml:function(){
			this.element.append(html);
		},
		_renderLayout:function(){
			$("#"+this.elements.toolbar).css("height",this.height*0.07);
			$("#"+this.elements.content_automat).css("height",this.height*0.5);
			$("#"+this.elements.content_group).css("height",0);
			$("#"+this.elements.paging).css("height",this.height*0.05);
			$("#"+this.elements.chart).css("height",this.height*0.3);
		},
		_changeChartSize:function(width){
			var chartWidth = width;
			var chartHeight = $("#"+this.elements.chart).height();
			this.chart.setSize(chartWidth, chartHeight);
		},
		_renderTableAutomat:function(){
			var self = this;
			this.content_automat = new Table({
				selector:"#"+this.elements.content_automat,
				columns:[this.columns_by_automat].flatten(),
				datas:[],
				pageSize:100,
				autoWidth:false,
				pageToolBar:false,
				checkbox:"full",
				events:{
					onRowClick: function(data,callback) {
						/*callback = function(width){
							var chartWidth = width;
							var chartHeight = $("#"+self.elements.chart).height();
							self.chart.setSize(chartWidth, chartHeight);
						};*/
						var type = "automat";
						self.fire("click",type);
                    },
                    onRowCheck : function(){
                    },
                    onCheckAll : function(selectedRows){
                    },
                    scope: this
				}
			});
			this.loadAuomatTableData();
		},
		_renderTableGroup:function(){
			var self = this;
			this.content_group = new Table({
				selector:"#"+this.elements.content_group,
				columns:[this.columns_by_group].flatten(),
				datas:[],
				pageSize:100,
				autoWidth:false,
				pageToolBar:false,
				checkbox:"full",
				events:{
					onRowClick: function(data,callback) {
						/*callback = function(width){
							var chartWidth = width;
							var chartHeight = $("#"+self.elements.chart).height();
							self.chart.setSize(chartWidth, chartHeight);
						};*/
						var type = "group";
						self.fire("click",type);
                    },
                    onRowCheck : function(){
                    },
                    onCheckAll : function(selectedRows){
                    },
                    scope: this
				}
			});
			this.loadGroupTableData();
		},
		_renderChart:function(){
			this.element.find("#"+this.elements.chart).highcharts("StockChart",{
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
        	 this.chart = this.element.find("#"+this.elements.chart).highcharts();
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
        loadAuomatTableData : function() {
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
			self.content_automat.render(data.result);
			self._renderpage(data, 1);
		},
		loadGroupTableData : function() {
        	var self = this;
			var pagenew='';
			var data = {"total":7,"result":[
			                                {"automatGroupName":"映翰通望京办公室","automaGroupDesc":"XXXXXX","automatGroupCount":"1"},
			                                {"automatGroupName":"百度上地办公室","automaGroupDesc":"XXXXXXXXXXX","automatGroupCount":"10"},
			                                {"automatGroupName":"摩托罗拉大厦","automaGroupDesc":"XXXXX","automatGroupCount":"3"},
			                                {"automatGroupName":"建外soho10号楼","automaGroupDesc":"XXXXXXXXXXXXXXXXXX","automatGroupCount":"5"},
			                                {"automatGroupName":"清华大学","automaGroupDesc":"XXXXXXXX","automatGroupCount":"2"},
			                                {"automatGroupName":"北京邮电大学","automaGroupDesc":"XXXXXXXXXXXXXXXXXXXXXXXXXXX","automatGroupCount":"6"}
			                                
			                                ],"limit":7,"cursor":0};
			var total = data.result.length;
        	self.totalCount = data.result.length;
        	data.total = total;
			self.content_group.render(data.result);
			self._renderpage(data, 1);
		},
        _renderpage:function(data, start){
        	var self = this;
        	if(this.page){
        		this.page.reset(data);
        	}else{
        		this.page = new Paging({
        			selector : $("#" + this.elements.paging),
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
        			    self.content_automat.clearTableData();
        			    self.content_automat.render(data.result);
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
        
		_renderToolbar:function(){
            var self = this;
            var $toolbar = $("#"+(this.elements.toolbar));
            var toolbarContainer = $("<span class='transaction-toolbar-container'></span>").appendTo($toolbar);
            var changespan1 = $("<span class='transaction-toolbar-changebtn'></span>").appendTo(toolbarContainer);
            var changeBtn1 = new Button({
                container:changespan1,
                text:locale.get("automat_by_device_name"),//"按自贩机:",
                events:{
                	"click":function(){
                		self.fire("click","automat","tab");
                		$("#"+self.elements.content_automat).show();
                		$("#"+self.elements.content_group).hide();
                		$("#"+self.elements.chart).show();
                		$("#"+self.elements.toolbar).css("height",self.height*0.07);
            			$("#"+self.elements.content_automat).css("height",self.height*0.58);
            			$("#"+self.elements.paging).css("height",self.height*0.05);
            			$("#"+self.elements.chart).css("height",self.height*0.3);
                	}
                }
            });
            var changespan2 = $("<span class='transaction-toolbar-changebtn'></span>").appendTo(toolbarContainer);
            var changeBtn2 = new Button({
                container:changespan2,
                text:locale.get("automat_by_group"),//"按分组",
                events:{
                	"click":function(){
                		self.fire("click","group","tab");
                		//console.log("按分组");
                		$("#"+self.elements.content_automat).hide();
                		$("#"+self.elements.content_group).show();
                		$("#"+self.elements.chart).hide();
                		$("#"+self.elements.toolbar).css("height",self.height*0.07);
            			$("#"+self.elements.content_group).css("height",self.height*0.88);
            			$("#"+self.elements.paging).css("height",self.height*0.05);
                	}
                }
            });

           
           // this._bindSelectEvent();

            //total
            //package
            var packageText = $("<span class='transaction-toolbar-package'></span>").appendTo(toolbarContainer);

            var packageSelect = $("<select id='transaction-toolbar-package'></select>").appendTo(toolbarContainer);
            var data = {"first":{"goupdId":"0","groupName":"组名0"},"second":{"goupdId":"1","groupName":"组名1"}}
            if(data!=null){
            	for(var index =0;index<2;index++){
            		
            		if(index == 0){
            			var obj = data.first;
            			//console.log(obj);
            			var opt1 = $("<option value=-1 selected='selected' >组名</option>");
            			packageSelect.append(opt1);
            			var opt = $("<option value=0 >组名1</option>");
                        packageSelect.append(opt);
            		}
            		if(index == 1){
            			var obj = data.second;
            			var opt = $("<option value=1>组名2</option>");
                        packageSelect.append(opt);
            		}
                }
            }
            

            this.packageSelect = packageSelect;

            //search input

            this.SearchInput = $("<input id='transaction-toolbar-name' placeholder='"+locale.get("automat_input_name_no_groupdname")+"'>").appendTo(toolbarContainer);

            var btndiv = $("<span class='transaction-toolbar-searchbtn'></span>").appendTo(toolbarContainer)
            var searchBtn = new Button({
                container:btndiv,
                text:locale.get("query"),
                events:{
                    click:function(){
                        self.queryData();
                    }
                }
            });


		},
        //old page
		_renderPagin:function(pagination){
			var self = this;
			if (this.paging) {
				this.paging.destroy();
			}
				this.paging = new Paginate({
					display: this.pageDisplay,
					count: pagination,
					start: 1,
					container: $("#" + this.elements.paging),
					events: {
						change: function(page) {
							self._turnPage(page);
						},
						scope: this
					}
				});
		},
		_turnPage:function(page){
			this.mask();
			this.fire("close");//点击翻页 关闭右侧Info模块 ---杨通
			this.service.getTasksList(this.opt,(page-1)*(this.display),this.display,function(data){
				this.totalCount = data.length;
                this.content_automat.clearTableData();
                this.content_group.render(data);
                this.unmask();
			},this);
		}
	});
	return Content;
});