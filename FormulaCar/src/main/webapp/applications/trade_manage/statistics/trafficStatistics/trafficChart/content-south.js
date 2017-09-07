define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var html = require("text!./content-south.html");
	var rightHtml = require("text!./content-south-right.html");
	var Table = require("cloud/components/table");
	var rightCss = require("../../css/online-noticebar.css");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var Service = require("../../service");
	var ContentChart = require("./content-chart");
	
	var columns=[{
		"title":locale.get({lang:"network"}),//网络
		"dataIndex" : "online",
		"cls" : null,
		"width" : "10%",
		 render: function(data, type, row) {
             var display = "";
             if ("display" == type) {
                 switch (data) {
                     case 1:
                         var offlineStr = locale.get({lang: "offline"});
                         display += new Template(
                                 "<div  style = \"display : inline-block;\" class = \"cloud-table-offline\" title = \"#{status}\"}></div>")
                                 .evaluate({
                             status: offlineStr
                         });
                         break;
                     case 0:
                         var onlineStr = locale.get({lang: "online"});
                         display += new Template(
                                 "<div  style = \"display : inline-block;\" class = \"cloud-table-online\" title = \"#{status}\"}></div>")
                                 .evaluate({
                             status: onlineStr
                         });
                         break;
                     default:
                         break;
                 }
                 return display;
             } else {
                 return data;
             }
         }
	},{
		"title":locale.get({lang:"traffic_automat_number"}),
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "25%"
	},{
		"title":locale.get({lang:"inbox_sn"}),//sn
		"dataIndex" : "sn",
		"cls" : null,
		"width" : "25%"
	}];
	
	var ContentSouth = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.ids = $A();
			this.Service = new Service();
			this.elements = {
					box:{
						id:"content-south",
						"class":null
					},
					left:{
						id:"content-south-left",
						"class":null
					},
					right:{
						id:"content-south-right",
						"class":null
					},
					paging:{
						id:"content-south-paging",
						"class":null
					},
					table:{
						id:"content-south-table",
						"class":null
					}
			};
			this.display = 30;
			this.pageDisplay = 30;
			this._render();
		},
		
		_render:function(){
			this._renderHtml();
			this._renderLayout();
			this._renderLeft();
		    this._renderRight();
			this.obj1 = {
			};
			this.tempObj1=this.obj1;
			this.load(this.obj1);
			this._renderContentChart();
			this._events();
	       
		},
		_renderHtml:function(){
			this.element.html(html);
			$("#content").css("width",$(".wrap").width());
            $("#content-south").css("width",$(".wrap").width());
            $("#content").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
            $("#content-south-paging").css("width",$(".wrap").width());
            $("#content-south-paging").css("height","28px");
            
            $("#content-south-right").css("width",$("#content").width() - 420);
            $("#content-south-left").css("height",$("#content").height() - $("#content-bar").height());
            $("#content-south-right").css("height",$("#content-south-left").height());
            $("#traffic-chart-right-content").css("height",$("#content-south-left").height());
			
		    var listHeight = $("#content-south-left").height();
		    
	        var barHeight = $("#content-south-paging").height();
		    var tableHeight=listHeight  -barHeight;
		    $("#content-south-table").css("height",tableHeight);
		    
		    $("#content-south").css("height",$("#content").height() - $("#content-bar").height());
		    
		    var height = $("#content-south-table").height()+"px";
	        $("#content-south-table-table").freezeHeader({ 'height': height });
		},
		_events:function(){
			var self = this;
			$("#noticebar-online-input").live("click",function(){
				self.obj1=self.tempObj1;
				var thisChecked = $(this).attr("checked");
				var offlineChecked = $("#noticebar-offline-input").attr("checked");
				if(thisChecked === "checked" && offlineChecked === "checked"){
					self.obj1.online = [];
				}else if(thisChecked === "checked"){
					self.obj1.online = [1];
				}else if(offlineChecked === "checked"){
					self.obj1.online = [0];
				}
			});
			$("#noticebar-offline-input").live("click",function(){
				self.obj1=self.tempObj1;
				var thisChecked = $(this).attr("checked");
				var onlineChecked = $("#noticebar-online-input").attr("checked");
				if(thisChecked === "checked" && onlineChecked === "checked"){					
					self.obj1.online = [];
				}else if(thisChecked === "checked"){
					self.obj1.online = [0];
				}else if(onlineChecked === "checked"){
					self.obj1.online = [1];
				}
			});
		},
		_renderLayout:function(){
			var self = this;
			this.layout = this.element.layout({
                defaults: {
                    paneClass: "pane",
                    togglerLength_open: 50,
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    spacing_open: 1,
                    spacing_closed: 1,
                    togglerLength_closed: 50,
                    resizable: false,
                    slidable: false,
                    closable: false
                },
                west: {
                    paneSelector: "#" + this.elements.left.id,
                    size: 420
                },
                center: {
                    paneSelector: "#" + this.elements.right.id
                }        
		
			});
		this.leftlayout = this.element.find("#" +this.elements.left.id).layout({
			defaults: {
				paneClass: "pane",
				togglerLength_open: 50,
				togglerClass: "cloud-layout-toggler",
				resizerClass: "cloud-layout-resizer",
				spacing_open: 0,
				spacing_closed: 1,
				togglerLength_closed: 50,
				resizable: false,
				slidable: false,
				closable: false
			},
			center: {
				paneSelector: "#" + this.elements.table.id
			},
			south: {
				paneSelector: "#" + this.elements.paging.id,
				size: 38
			},
			onresize_end : function(){
				self.contentChart.resizeChart(); 
        	}
			});
			var height = this.element.find("#" + this.elements.left.id).height();
			this.display = Math.ceil((height-60)/34-1);
		},
		_renderLeft:function(){
			var self = this;
			this.left = new Table({
				selector: this.element.find("#" + this.elements.table.id),
				columns: columns,
				datas: [],
                pageSize: 100,
                autoWidth: false,
                checkbox : "single",
                pageToolBar: false,
                events: {
                	  onRowClick: function(data) { 
                          this.listTable.unselectAllRows();
                          var rows = this.listTable.getClickedRow();
                          this.listTable.selectRows(rows);
                          
                          $("tr").css("border-bottom","0px");
                          
                      },
                    onRowRendered: function(tr, data, index) {
                    	 if(index == 0){
                    		self.ids.push(data.sn);
                     		this.contentChart.addSeries({
                                 resourceId : data.sn,
                                 name : data.name,
                                 step : "left"
                             });
                     		 $(tr).addClass("cloud-table-shadow");
                    	 }
                    },
                    onRowCheck : function(isSelected, rowEl, data){
                         
                    	if (isSelected && this.contentChart){
                    		self.ids.push(data.sn);
                    		this.contentChart.addSeries({
                                resourceId : data.sn,
                                name : data.name,
                                step : "left"
                            });
                    	}else if (this.contentChart){
                    		var len = self.ids.length;
                    		for(var i = 0 ; i < len ; i++) {
                    			if(data.sn === self.ids[i]) {
                    				self.ids.splice(i, 1);
                    				break ;
                    			}
                    		}
                    		this.contentChart.removeSeries([data.sn]);
                    	}
                    },
                    scope: this
                }
			});
			
		},
		_renderRight:function(){
			$("#content-south-right").html(rightHtml);
			
		},
		_renderContentChart : function(){
			this.contentChart = new ContentChart({
	            container : "#traffic-chart-right-content",
	            service : this.Service,
	            intervalButtons : [{
	                name : "24" + locale.get("_hours"),
	                value : 24 * 3600
	            },{
	                name : "7" + locale.get("_days"),
	                value : 24 * 3600 * 7
	            },{
	                name : "30" + locale.get("_days"),
	                value : 24 * 3600 * 30
	            }],
	            chart : {
	                title : locale.get({lang:"traffic_statistics_curve"}),
	                tooltips : {
	                	formatter:function(){
	                		var value = this.y;
	                		return cloud.util.dateFormat(new Date(this.x/1000),"yyyy-MM-dd hh:mm:ss")+"<br/>"+ this.series.name+"的流量值为"+value+"KB";
	                	}
            		},
	                yAxis : {
	                	min : 0,
	                    "title" : locale.get({lang:"inbox_traffic"})
	                }
	            }
	        })
		},
		load:function(listObj){
			var self = this;
			var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
			var roleType = permission.getInfo().roleType;
			self.Service.getAutomatByUserId(userId, function(data) {
           	 
			    var assetIds=[];
                if(data.result && data.result.length>0){
	    			  for(var i=0;i<data.result.length;i++){
	    				assetIds.push(data.result[i].assetId);
	    			  }
                }
                var online = [];
                var $onlineInput = $("#noticebar-online-input");
				var $offlineInput = $("#noticebar-offline-input");
				if($onlineInput.attr("checked") == "checked" && $offlineInput.attr("checked") == "checked"){
					online = [];
				}else if($onlineInput.attr("checked") == "checked"){
					online = [0];
				}else if($offlineInput.attr("checked") == "checked"){
					online = [1];
				}else{
					online = [];
				}
				var assetId = $(".notice-bar-search-input").val();

                var arr = [];

                if(roleType == 51){
                	arr.push(assetId);
                }else if(assetIds.length == 0){
                	arr = ["000000000000000000000000"];
                }else if(assetId == null || assetId.replace(/(^\s*)|(\s*$)/g,"")==""){
                	arr = assetIds;
                }else if($.inArray(assetId,assetIds) > -1){
                	arr.push(assetId);
                }
    			 self.searchData={
    					 "online":online,
    					 "assetId":arr
    			 }

                	self.Service.getAllInbox(self.searchData,30,0,function(data){
    					self._renderPagin(data);
    					cloud.util.unmask();
    			    });
                
            }, self);
			
			
		},
		_renderPagin:function(data){
        	var self = this;
        	$("#" + this.elements.paging.id).empty();
        	this.paging = null;
        	this.paging = new Paging({
				selector:"#" + this.elements.paging.id,
				data:data,
				current:1,
				total:data.total,
				limit:30,
				requestData:function(options,success){
					cloud.util.mask("#content-south-table");
					var $onlineInput = $("#noticebar-online-input");
					var $offlineInput = $("#noticebar-offline-input");
					if($onlineInput.attr("checked") == "checked" && $offlineInput.attr("checked") == "checked"){
						self.obj1 = {};
					}else if($onlineInput.attr("checked") == "checked"){
						self.obj1=self.tempObj1;
						self.obj1.online = [1];
					}else if($offlineInput.attr("checked") == "checked"){
						self.obj1=self.tempObj1;
						self.obj1.online = [0];
					}else{
						self.obj1=self.tempObj1;
						self.obj1.online = [];
					}
					self.Service.getAllInbox(self.searchData,options.limit,options.cursor,function(returnData){
						success(returnData);
						cloud.util.unmask("#content-south-table");
					});
				},
				turn:function(returnData){
					var len = self.ids.length;
					for(var i = 0 ; i < len ; i++) {
						self.contentChart.removeSeries(self.ids[i]);
					}
					self._loadData(returnData.result);
					self.unmask();
				}
			});
        	$("#" + this.elements.paging.id).children().css("margin-left","10px");
        },
		_loadData:function(data){
			this.left.clearTableData();
			this.left.add(data);
		},
		destroy:function(){
			this.left.clearTableData();
			this.left.destroy();
			if (this.paging) {
				this.paging.destroy();
				this.paging=null;
			}
		}
	});
	return ContentSouth;
});