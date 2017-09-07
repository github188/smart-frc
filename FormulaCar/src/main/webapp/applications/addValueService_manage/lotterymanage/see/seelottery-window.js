define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./seelottery-window.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../service");
    var DevicelistInfo = require("../config/update_device");
    var columns = [{
        "title": locale.get({lang: "automat_no1"}),
        "dataIndex": "assetId",
        "cls": null,
        "width": "25%"
    }, {
        "title": locale.get({lang: "automat_name"}),
        "dataIndex": "name",
        "cls": null,
        "width": "25%"
    }, {
        "title": locale.get({lang: "automat_site_name"}),
        "dataIndex": "siteName",
        "cls": null,
        "width": "25%"
    }, {
        "title": locale.get({lang: "automat_line"}),
        "dataIndex": "lineName",
        "cls": null,
        "width": "25%"
    },{
        "title": "",
        "dataIndex": "id",
        "cls": "_id" + " " + "hide"
    }];
    
    var goodsputcolumns = [{
        "title": "货柜编号",
        "dataIndex": "cid",
        "cls": null,
        "width": "20%"
    }, {
        "title": "货道号",
        "dataIndex": "channelId",
        "cls": null,
        "width": "20%"
    }, {
        "title": "图片",
        "dataIndex": "img",
        "cls": null,
        "width": "20%",
        render:function(data, type, row){
			    var productsImage = locale.get({lang:"products"});
			    var  display = "";
			    if(data){
			    	var src = cloud.config.FILE_SERVER_URL + "/api/file/" +data + "?access_token=" + cloud.Ajax.getAccessToken();
	                display += new Template(
	                    "<img src='"+src+"' style='width: 18px;height: 25px;'/>")
	                    .evaluate({
	                        status : productsImage
	                    });
			    }
            return display;
        }
    }, {
        "title": "商品名称",
        "dataIndex": "goodsName",
        "cls": null,
        "width": "20%"
    }, {
        "title": "价格",
        "dataIndex": "price",
        "cls": null,
        "width": "20%"
    },{
        "title": "",
        "dataIndex": "id",
        "cls": "_id" + " " + "hide"
    }];
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.lotteryId = options.lotteryId;
            this.lotteryName = options.lotteryName;
            this._renderWindow();
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: locale.get({lang: "lottery_configuration"})+" ["+this.lotteryName+"]",
                top: "center",
                left: "center",
                height: 650,
                width: 1000,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                    "onClose": function() {
                        this.adWindow.destroy();
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
            this.adWindow.show();
            this.renderDeviceList();
            this.renderPutGoodsList();
            this.renderGetGoodsList();
            this.renderLottery();
        },
        renderLottery:function(){
        	var self=this;
        	Service.getLotteryConfigById(self.lotteryId,function(data) {
        		console.log(data);
        		//基本信息
        		$("#lotteryName").text(data.result.lotteryName);
        		$("#probalility").text(data.result.config.probalility+"‰");
        		var autoRun = data.result.autoRun;
    			var canBuy = data.result.canBuy;
    			if(autoRun == "1"){
    				$("#autoRun").attr("checked", true);
    			}
    			if(canBuy == "1"){
    				$("#canBuy").attr("checked",true);
    			}
    			$("#desc").text(data.result.desc);
    			
    			
    			var devices = data.result.devices;
    			var deviceId =[];
    			for(var i = 0;i<devices.length;i++){
    				deviceId.push(devices[i].deviceId);
    			}
    			
    			var participate = data.result.config.participate;//抽奖配置
    			var conversion = data.result.config.conversion;//兑奖配置
    			
    			var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
                var roleType = permission.getInfo().roleType;
                Service.getLinesByUserId(userId,function(linedata){
                	 cloud.util.mask("#deviceList");
                	 cloud.util.mask("#putLotteryList");
                	 cloud.util.mask("#getLotteryList");
                	  var lineIds=[];
                      if(linedata.result && linedata.result.length>0){
     	    			  for(var i=0;i<linedata.result.length;i++){
     	    				  lineIds.push(linedata.result[i]._id);
     	    			  }
                      }
                      if(roleType == 51){
    		    			 lineIds = [];
                       }
                      if(roleType != 51 && lineIds.length == 0){
    	                    lineIds = ["000000000000000000000000"];
    	              }
                      self.searchData = {
                          	"online":"0",
                          	"lineId": lineIds,
                      };                       
                       Service.getAllAutomatsByPage(self.searchData, 10000, 0, function(data) {
                    	  console.log(data);
                          if(data.result && data.result.length>0){
                        	  var deviceArray=[];
                        	  var putGoods=[];
                        	  var getGoods=[];
                        	  for(var i=0;i<deviceId.length;i++){
                        		  for(var j=0;j<data.result.length;j++){
                        			  if(deviceId[i] == data.result[j]._id){
                        				  var obj = {
                        						  assetId:data.result[j].assetId,
                        						  name:data.result[j].name,
                        						  siteName:data.result[j].siteName,
                        						  lineName:data.result[j].lineName
                        				  };
                        				  deviceArray.push(obj);
                        				  //抽奖
                        				  if(participate && participate.length>0){
                                    		  for(var k=0;k<participate.length;k++){
                                    		    if(participate[k].cid == "master"){
                                    		    	for(var m=0;m<participate[k].channels.length;m++){
                                    		    		for(var n=0;n<data.result[j].goodsConfigs.length;n++){
                                        		    		if(participate[k].channels[m].channelId == data.result[j].goodsConfigs[n].location_id){
                                        		    			if(data.result[j].goodsConfigs[n].goods_id){
                                        		    				var obj ={
                                            		    					cid:data.result[j].assetId,
                                            		    					channelId:participate[k].channels[m].channelId,
                                            		    					goodsName:data.result[j].goodsConfigs[n].goods_name,
                                            		    					price:data.result[j].goodsConfigs[n].price/100,
                                            		    					img:data.result[j].goodsConfigs[n].img
                                            		    			 };
                                            		    			 putGoods.push(obj);
                                        		    			}
                                        		    			 
                                        		    		}
                                        		    	}
                                    		    	}
                                    		    }else{
                                    		    	if(data.result[j].containers){
                                    		    		for(var m=0;m<data.result[j].containers.length;m++){
                                    		    			if(participate[k].cid == data.result[j].containers[m].cid){
                                    		    				for(var n=0;n<participate[k].channels.length;n++){
                                    		    					for(var l=0;l<data.result[j].containers[m].shelves.length;l++){
                                    		    						if(participate[k].channels[n].channelId == data.result[j].containers[m].shelves[l].location_id){
                                    		    							if(data.result[j].containers[m].shelves[l].goods_id){
                                    		    								 var obj ={
                                                           		    					cid:data.result[j].containers[m].cid,
                                                           		    					channelId:participate[k].channels[n].channelId,
                                                           		    					goodsName:data.result[j].containers[m].shelves[l].goods_name,
                                                           		    					price:data.result[j].containers[m].shelves[l].price/100,
                                                           		    			 		img:data.result[j].containers[m].shelves[l].img
                                                           		    			  };
                                                           		    			  putGoods.push(obj);
                                    		    							}
                                                   		    		}
                                    		    					}
                                        		    			}
                                    		    			}
                                    		    		}
                                    		    	}
                                    		    }
                                    		  }
                                    	  }
                        				  //兑奖
                        				  if(conversion && conversion.length>0){
                                    		  for(var k=0;k<conversion.length;k++){
                                    		    if(conversion[k].cid == "master"){
                                    		    	for(var m=0;m<conversion[k].channels.length;m++){
                                    		    		for(var n=0;n<data.result[j].goodsConfigs.length;n++){
                                        		    		if(conversion[k].channels[m].channelId == data.result[j].goodsConfigs[n].location_id){
                                        		    			if(data.result[j].goodsConfigs[n].goods_id){
                                        		    				var obj ={
                                            		    					cid:data.result[j].assetId,
                                            		    					channelId:conversion[k].channels[m].channelId,
                                            		    					goodsName:data.result[j].goodsConfigs[n].goods_name,
                                            		    					price:data.result[j].goodsConfigs[n].price/100,
                                            		    					img:data.result[j].goodsConfigs[n].img
                                            		    			 };
                                            		    			 getGoods.push(obj);
                                        		    			}
                                        		    		}
                                        		    	}
                                    		    	}
                                    		    }else{
                                    		    	if(data.result[j].containers){
                                    		    		for(var m=0;m<data.result[j].containers.length;m++){
                                    		    			if(conversion[k].cid == data.result[j].containers[m].cid){
                                    		    				for(var n=0;n<conversion[k].channels.length;n++){
                                    		    					for(var l=0;l<data.result[j].containers[m].shelves.length;l++){
                                    		    						if(participate[k].channels[n].channelId == data.result[j].containers[m].shelves[l].location_id){
                                    		    							if(data.result[j].containers[m].shelves[l].goods_id){
                                    		    								var obj ={
                                                           		    					cid:data.result[j].containers[m].cid,
                                                           		    					channelId:conversion[k].channels[n].channelId,
                                                           		    					goodsName:data.result[j].containers[m].shelves[l].goods_name,
                                                           		    					price:data.result[j].containers[m].shelves[l].price/100,
                                                           		    					img:data.result[j].containers[m].shelves[l].img
                                                           		    			 };
                                                           		    			getGoods.push(obj);
                                    		    							}
                                                   		    		  }
                                    		    					}
                                        		    			}
                                    		    			}
                                    		    		}
                                    		    	}
                                    		    }
                                    		  }
                                    	  }
                        			  }
                        		  }
                        	  }
                        	  self.DeviceListTable.render(deviceArray);
                        	  self.PutGoodsLisTable.render(putGoods);
                        	  self.GetGoodsLisTable.render(getGoods);
                        	  cloud.util.unmask("#deviceList");
                        	  cloud.util.unmask("#putLotteryList");
                        	  cloud.util.unmask("#getLotteryList");
                        	  
                        	  $("#deviceList").css("height",$("#deviceList-table").height());
                        	  $("#putLotteryList").css("height",$("#putLotteryList-table").height());
                        	  $("#getLotteryList").css("height",$("#getLotteryList-table").height());
                          }
                       }, self);
                });
                
        	});
        },
        renderDeviceList:function(){
        	 this.DeviceListTable = new Table({
                 selector: "#deviceList",
                 columns: columns,
                 datas: [],
                 pageSize: 100,
                 autoWidth: false,
                 pageToolBar: false,
                 events: {
                     onRowClick: function(data) { 
                         this.adDetaillistTable.unselectAllRows();
                         var rows = this.listTable.getClickedRow();
                         this.adDetaillistTable.selectRows(rows);
                     },
                     onRowRendered: function(tr, data, index) {
                         var self = this; 
                     },
                     scope: this
                 }
             });
        },
        renderPutGoodsList:function(){
       	 this.PutGoodsLisTable = new Table({
             selector: "#putLotteryList",
             columns: goodsputcolumns,
             datas: [],
             pageSize: 100,
             autoWidth: false,
             pageToolBar: false,
             events: {
                 onRowClick: function(data) { 
                     this.adDetaillistTable.unselectAllRows();
                     var rows = this.listTable.getClickedRow();
                     this.adDetaillistTable.selectRows(rows);
                 },
                 onRowRendered: function(tr, data, index) {
                     var self = this; 
                 },
                 scope: this
             }
         });
       },
       renderGetGoodsList:function(){
         	 this.GetGoodsLisTable = new Table({
                 selector: "#getLotteryList",
                 columns: goodsputcolumns,
                 datas: [],
                 pageSize: 100,
                 autoWidth: false,
                 pageToolBar: false,
                 events: {
                     onRowClick: function(data) { 
                         this.adDetaillistTable.unselectAllRows();
                         var rows = this.listTable.getClickedRow();
                         this.adDetaillistTable.selectRows(rows);
                     },
                     onRowRendered: function(tr, data, index) {
                         var self = this; 
                     },
                     scope: this
                 }
             });
        },
        destroy: function() {
            if (this.window) {
                this.window.destroy();
            } else {
                this.window = null;
            }
        }
    });
    return updateWindow;
});