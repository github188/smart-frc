define(function(require){
	var cloud = require("cloud/base/cloud");
	var html = require("text!./content.html");
	require("cloud/lib/plugin/jquery-ui");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var validator = require("cloud/components/validator");
	require("cloud/components/chart");
	require("../css/default.css");
	
	var columns = [{
		"title":locale.get({lang:"thumbnail"}),
		"dataIndex" : "goodsImage",
		"cls" : null,
		"width" : "15%",
		render:function(data, type, row){
			 var productsImage = locale.get({lang:"products"});
			 //var src= cloud.config.FILE_SERVER_URL + "/api/file/" +data + "?access_token=" + cloud.Ajax.getAccessToken();
			 var display = "";
			 switch (data) {
             case "1":
                 display += new Template(
                     "<img src='/FormulaCar/applications/siteDetail/img/arrowhead-242x362.png' style='width: 30px;height: 30px;'/>")
                     .evaluate({
                         status : productsImage
                     });
                 break;
             case "2":
                 display += new Template(
                 "<img src='/FormulaCar/applications/siteDetail/img/bhongcha.zip.2.png' style='width: 30px;height: 30px;'/>")
                     .evaluate({
                         status : productsImage
                     });
                 break;
             case "3":
                 display += new Template(
                 "<img src='/FormulaCar/applications/siteDetail/img/coke-242x362.png' style='width: 30px;height: 30px;'/>")
                     .evaluate({
                         status : productsImage
                     });
                 break;
             default:
                 break;
           }
			
		    return display;
		}
	},{
		"title":locale.get({lang:"automat_name_of_commodity"}),
		"dataIndex" : "goodsName",
		"cls" : null,
		"width" : "40%"
	},{
		"title":locale.get({lang:"sold"}),
		"dataIndex" : "soldNumber",
		"cls" : null,
		"width" : "20%"
	},{
		"title":locale.get({lang:"the_remaining_number"}),
		"dataIndex" : "number",
		"cls" : null,
		"width" : "25%"
	},{
		"title" : "",
		"dataIndex" : "id",
		"cls" : "_id" + " " + "hide"
	} ];
	
	var content = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.display = 30;
			this.pageDisplay = 30;
			
			this.elements = {
				bar : {
				    id : "automat_content_top",
					"class" : null
			     },
					
				table : {
					id : "automat_content_table",
					"class" : null
				},
				paging : {
					id : "automat_content_paging",
					"class" : null
				}
			};
			this._render();
		},
		_render:function(){
			this._renderHtml();
			this._renderTable();
			this.editTemperture();
			this.getData();
		},
		_renderHtml : function() {
			this.element.html(html);
			locale.render({element:this.element});
			$("#values").text("5");
			$("#util").text("℃");
		},
		getData:function(){
			var myDate = new Date();
			var myHour = myDate.getHours()+1;
			var ret = [];
			var maxValue=[];
		    for (var i = 0; i < myHour; i++) {
		        ret[i]= parseInt(myHour * Math.random());
		        maxValue[i]=15;
		    }
		    //console.log(ret);
			var data = [{
	            name: locale.get("maximum_temperature"),
	            data: maxValue
	        }, {
	            name: locale.get("normal_temperature"),
	            data: ret
	        }];
			$("#maxTemperture").val("15");
			this.loadChart(data);
		},
		loadChart:function(data){
			$('#echart-content').highcharts({
				    chart: {
	    	            type: 'spline',
	    	            height:200,
	                    width:500
	    	        },
			        title: {
			            text: '',
			            x: -20
			        },
			        xAxis: {
			            categories: ["0:00","1:00","2:00","3:00","4:00","5:00","6:00","7:00","8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"]
			        },
			        yAxis: {
			            title: {
			                text: 'Temperature (°C)'
			            },
			            plotLines: [{
			                value: 0,
			                width: 1,
			                color: '#808080'
			            }]
			        },
			        tooltip: {
			            valueSuffix: '°C'
			        },
			        legend: {
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
                    plotOptions: {
                        series: {
                            marker: {
                                enabled: false /*数据点是否显示*/
                            },
                        }
                    },
			        series: data
			    });
		},
		onTemperature:function(){
			var time = $("#maxTemperture").val();
			var newTime =parseInt(time);
			if(!time.empty()){
				var myDate = new Date();
				var myHour = myDate.getHours()+1;
				var ret = [];
				var maxValue=[];
			    for (var i = 0; i < myHour; i++) {
			        ret[i]= parseInt(myHour * Math.random());
			        maxValue[i]=newTime;
			    }
			    //console.log(ret);
				var data = [{
		            name: locale.get("maximum_temperature"),
		            data: maxValue
		        }, {
		            name: locale.get("normal_temperature"),
		            data: ret
		        }];
				//console.log(data);
				$("#editTem").data("qtip").hide();
				this.loadChart(data);
			}else{
				dialog.render({lang:"max_temperture_cannot_be_empty"});
			}
		},
		editTemperture:function(){
			var self = this;
			this.createForm = $("<form style='width: 290px;'>").addClass(this.moduleName + "-create-form ui-helper-hidden tag-overview-form");
            $("<label>").attr("for", "maxTemperture").text(locale.get({lang:"upper_limit_temperature"})).appendTo(this.createForm);
            $("&nbsp;<input type='text' style='width: 70px;'>").attr("id", "maxTemperture").appendTo(this.createForm);
            new Button({
                container: this.createForm,
                imgCls: "cloud-icon-yes",
                events: {
                    click: this.onTemperature,
                    scope: this
                }
            });
            this.createForm.appendTo(this.element);
            
            $("#editTem").qtip({
                content: {
                    text: this.createForm
                },
                position: {
                    my: "top left",
                    at: "bottom middle"
                },
                show: {
                    event: "click"
                },
                hide: {
                    event: "click unfocus"
                },
                style: {
                    classes: "qtip-shadow qtip-light"
                },
				events: {
					visible: function(){
						
					}
				},
                suppress:false
            });
		},
		_renderTable : function() {
			this.listTable = new Table({
				selector : "#automat_content_table",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "none",
				events : {
					 onRowClick: function(data) {
	                    	
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                    },
	                   scope: this
				}
			});
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadData();
		},
		loadData : function() {
			var self=this;
			var data={
					"total": 14, 
					"cursor": 0, 
					"limit": 30,
					"result":[{"goodsImage":"1","goodsName":"Iced Black Tea","soldNumber":"2","number":"10"},
					          {"goodsImage":"2","goodsName":"Mirinda","soldNumber":"9","number":"3"},
					          {"goodsImage":"3","goodsName":"Orange juice","soldNumber":"10","number":"2"}
					         ]
			};
			var total = data.total;
			this.totalCount = data.result.length;
	        data.total = total;
	        self.listTable.render(data.result);
	        self._renderpage(data, 1);
		},
	    _renderpage:function(data, start){
	        	var self = this;
	        	if(this.page){
	        		this.page.reset(data);
	        	}else{
	        		this.page = new Paging({
	        			selector : $("#automat_content_paging"),
	        			data:data,
	    				current:1,
	    				total:data.total,
	    				limit:this.pageDisplay,
	        			requestData:function(options,callback){
	        			},
	        			turn:function(data, nowPage){
	        			    self.totalCount = data.result.length;
	        			    self.listTable.clearTableData();
	        			    self.listTable.render(data.result);
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
	        }
	});	
	return content;
    
});