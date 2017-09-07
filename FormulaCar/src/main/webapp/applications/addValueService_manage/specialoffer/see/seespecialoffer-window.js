define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./seespecial.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../service");
    var columns = [{
        "title": "售货机编号",
        "dataIndex": "assetId",
        "cls": null,
        "width": "20%"
    }, {
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
        "title": "商品名称",
        "dataIndex": "goodsName",
        "cls": null,
        "width": "20%"
    }, {
        "title": "商品图片",
        "dataIndex": "imagepath",
        "cls": null,
        "width": "20%",
        render:function(data, type, row){
			    var productsImage = locale.get({lang:"products"});
			    var  display = "";
			    if(data){
			    	var src = cloud.config.FILE_SERVER_URL + "/api/file/" +data + "?access_token=" + cloud.Ajax.getAccessToken();
	                display += new Template(
	                    "<img src='"+src+"' style='width: 18px;height: 28px;'/>")
	                    .evaluate({
	                        status : productsImage
	                    });
			    }
            return display;
        }
    },{
        "title": "",
        "dataIndex": "id",
        "cls": "_id" + " " + "hide"
    }];
    
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.specialId = options.specialId;
            this.specialName = options.specialName;
            this._renderWindow();
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: this.specialName,
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
            this.renderData();
            this.renderDeviceList();
        },
        renderData:function(){
        	var self = this;
        	Service.getSpecialOfferById(self.specialId,function(data){
        		self.specialData = data.result;
        		$("#specialname").val(data.result.name);
        		$("#specialtype").val(data.result.type);
        		if(data.result.type == 3){//立减
        			$("#special_amount").val(data.result.config.amount);
        			$("#specialofferPayStyle").show();
        			$("#amount").show();
        			$("#getProduct").hide();
        			$("#notice").hide();
        			$("#notice1").hide();
        			$("#notice2").hide();
        		}else if(data.result.type == 4){//折扣
        			$("#special_scale").val(data.result.config.rate);
        			$("#specialofferPayStyle").show();
        			$("#scale").show();
        			$("#notice").hide();
        			$("#notice1").hide();
        			$("#notice2").hide();
        			$("#getProduct").hide();
        		}else if(data.result.type == 1){//送水
        			$("#wechat_appid").val(data.result.config.appId);
        			$("#wechat_appsecret").val(data.result.config.appSecret);
        			$("#appid").show();
        			$("#appsecret").show();
        			$("#notice").show();
        			$("#notice1").show();
        			$("#notice2").show();
        			$("#noticeDiv").show();
        			$("#getProduct").show();
        			$("#pickupMethod option[value='"+data.result.pickupMethod+"']").attr("selected","selected");
        		}else if(data.result.type == 2){
        			$("#specialofferPayStyle").show();
        			$("#notice").hide();
        			$("#notice1").hide();
        			$("#notice2").hide();
        			$("#getProduct").hide();
        		}
        		
				$("#startTime").val(cloud.util.dateFormat(new Date(data.result.startTime),"yyyy-MM-dd")).datetimepicker({
					format:'Y-m-d',
					step:1,
					startDate:'-1970-01-08',
					lang:locale.current() === 1 ? "en" : "ch",
					timepicker: false,
					onShow: function() {
                        $(".xdsoft_calendar").show();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy-MM-dd"));
                        
                        
                    },
                    onClose: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                    }
				});
				$("#endTime").val(cloud.util.dateFormat(new Date(data.result.endTime),"yyyy-MM-dd")).datetimepicker({
					format:'Y-m-d',
					step:1,
					startDate:'-1970-01-08',
					lang:locale.current() === 1 ? "en" : "ch",
					timepicker: false,
					onShow: function() {
                        $(".xdsoft_calendar").show();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy-MM-dd"));
                    },
                    onClose: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                    }
				});  
				
				var paystyle="";
				var payStyles = data.result.payStyles;
				if(payStyles != null && payStyles.length>0){
					for (var i = 0; i < payStyles.length; i++) {
                        if(payStyles[i] == 1){
                        	paystyle=paystyle+"百付宝 ";
                        }else if(payStyles[i] == 2){
                        	paystyle=paystyle+"微信支付 ";
                        }else if(payStyles[i] == 3){
                        	paystyle=paystyle+"支付宝 ";
                        }else if(payStyles[i] == 4){
                        	paystyle=paystyle+"现金 ";
                        }else if(payStyles[i] == 5){
                        	paystyle=paystyle+"刷卡 ";
                        }else if(payStyles[i] == 7){
                        	paystyle=paystyle+"取货码 ";
                        }else if(payStyles[i] == 8){
                        	paystyle=paystyle+"游戏 ";
                        }else if(payStyles[i] == 9){
                        	paystyle=paystyle+"声波支付 ";
                        }else if(payStyles[i] == 10){
                        	paystyle=paystyle+"POS机 ";
                        }else if(payStyles[i] == 11){
                        	paystyle=paystyle+"一卡通 ";
                        }else if(payStyles[i] == 12){
                        	paystyle=paystyle+"农行掌银 ";
                        }else if(payStyles[i] == 13){
                        	paystyle=paystyle+"微信反扫 ";
                        }else if(payStyles[i] == 14){
                        	paystyle=paystyle+"会员支付 ";
                        }else if(payStyles[i] == 15){
                        	paystyle=paystyle+"翼支付 ";
                        }else if(payStyles[i] == 16){
                        	paystyle=paystyle+"京东支付 ";
                        }else if(payStyles[i] == 19){
                        	paystyle=paystyle+"支付宝反扫 ";
                        }else if(payStyles[i] == 20){
                        	paystyle=paystyle+"积分兑换 ";
                        }else if(payStyles[i] == 21){
                        	paystyle=paystyle+"银联支付 ";
                        }else if(payStyles[i] == 23){
                        	paystyle=paystyle+"扫码支付 ";
                        }else if(payStyles[i] == 24){
                        	paystyle=paystyle+" 融e联 ";
                        }
                    }
				}
				$("#payStyle").val(paystyle);
				
				var deviceList=[];
	        	if(data.result.config && data.result.config.deviceConfig && data.result.config.deviceConfig.length>0){
	        		for(var i=0;i<data.result.config.deviceConfig.length;i++){
	        			if(data.result.config.deviceConfig[i].offerCids && data.result.config.deviceConfig[i].offerCids.length>0){
	        				for(var j=0;j<data.result.config.deviceConfig[i].offerCids.length;j++){
	        					if(data.result.config.deviceConfig[i].offerCids[j].channels && data.result.config.deviceConfig[i].offerCids[j].channels.length>0){
	        						for(var k=0;k<data.result.config.deviceConfig[i].offerCids[j].channels.length;k++){
	        							var deviceObj={};
	        		        			deviceObj.assetId = data.result.config.deviceConfig[i].assetId;
	    	        					deviceObj.cid=data.result.config.deviceConfig[i].offerCids[j].cid;
	        							deviceObj.channelId = data.result.config.deviceConfig[i].offerCids[j].channels[k].channelId;
	        							deviceObj.goodsId = data.result.config.deviceConfig[i].offerCids[j].channels[k].goodsId;
	        							deviceObj.goodsName = "";
	        							deviceObj.imagepath = "";
	        							deviceList.push(deviceObj);
	        						}
	        					}
	        				}
	        			}
	        		}
	        	}
	        	if(deviceList.length>0){
	        		self.searchData = {
                          	"online":"0"
                    };   
	        		cloud.util.mask("#deviceInfo");
	        		Service.getAllAutomatsByPage(self.searchData, 10000, 0, function(data_device) {
	        			 console.log(data_device);
	        			if(data_device.result && data_device.result.length>0){
	        				for(var i=0;i<deviceList.length;i++){
                      		  for(var j=0;j<data_device.result.length;j++){
                      			if(deviceList[i].assetId == data_device.result[j].assetId){
                      				 if(deviceList[i].cid == "master"){
                      					deviceList[i].cid = data_device.result[j].assetId;
                      				   if(data_device.result[j].goodsConfigs){
                      					 for(var n=0;n<data_device.result[j].goodsConfigs.length;n++){
                         		    		if(deviceList[i].channelId == data_device.result[j].goodsConfigs[n].location_id){
                         		    			if(data_device.result[j].goodsConfigs[n].goods_id){
                         		    				deviceList[i].goodsName = data_device.result[j].goodsConfigs[n].goods_name;
                     		        				deviceList[i].imagepath = data_device.result[j].goodsConfigs[n].img;
                         		    			}
                         		    		}
                         		    	}
                      				   }
                      				 }else{
                         		    	if(data_device.result[j].containers){
                        		    		for(var m=0;m<data_device.result[j].containers.length;m++){
                        		    			if(deviceList[i].cid == data_device.result[j].containers[m].cid){
                        		    				for(var n=0;n<data_device.result[j].containers[m].shelves.length;n++){
                        		    					if(deviceList[i].channelId == data_device.result[j].containers[m].shelves[n].location_id){
                        		    						deviceList[i].goodsName = data_device.result[j].containers[m].shelves[n].goodsName;
                            		        				deviceList[i].imagepath = data_device.result[j].containers[m].shelves[n].img;
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
	        			self.DeviceListTable.render(deviceList);
	        			cloud.util.unmask("#deviceInfo");
	        		});
	        	}
	        	
        	},self);
        },
        renderDeviceList:function(){
       	 this.DeviceListTable = new Table({
                selector: "#deviceInfo",
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