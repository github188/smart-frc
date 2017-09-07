define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./updatelottery.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../service");
    var SelfConfigInfo = require("../config/selfConfig");
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
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.lotteryId = options.lotteryId;
            this._renderWindow();
            this.basedata = {};
            this.deviceLists = [];
            this.devicesId = [];
            this.deviceChoose = [];
            this.lotteryData = {};
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: locale.get({lang: "lottery_configuration"}),
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
            $("#nextBase").val(locale.get({lang: "next_step"}));
            
            this.renderLotteryTable();
            this._renderBtn();
        },
 
        renderLotteryTable:function(){
        	var self=this;
        	
        	Service.getLotteryConfigById(self.lotteryId,function(data) {
        		
        		if(data.result){
        			var lotteryname = data.result.lotteryName;
        			var probalility = data.result.config.probalility;
        			var desc = data.result.desc;
        			var autoRun = data.result.autoRun;
        			var canBuy = data.result.canBuy;
//        			var devices = data.result.devices;
//        			for(var i = 0;i<devices.length;i++){
//        				var deviceid = devices[i].deviceId;
//        				self.devicesId.push(deviceid);
//        			}
        			if(autoRun == "1"){
        				$("#autoRun").attr("checked", true);
        			}
        			if(canBuy == "1"){
        				$("#canBuy").attr("checked",true);
        			}
        			
        			$("#lotteryName").val(lotteryname);
        			$("#probalility").val(probalility);
        			$("#desc").val(desc);
        			self.lotteryData = data.result;
        			
        		}
              
            }, self);
        	
        	
//            this.listTable = new Table({
//                selector: "#devicelist",
//                columns: columns,
//                datas: [],
//                pageSize: 100,
//                autoWidth: false,
//                pageToolBar: false,
//                checkbox: "full",
//                events: {
//                    onRowClick: function(data) { 
//                    	
//                        this.listTable.unselectAllRows();
//                        var rows = this.listTable.getClickedRow();
//                        this.listTable.selectRows(rows);
//                    },
//                    onRowRendered: function(tr, data, index) {
//                        var self = this;      
//                        var deviceid = data._id;
//                        var but = $(tr).find('a').attr('id');
//                        
//                        if(self.devicesId.indexOf(deviceid) != -1){
//
//                        	self.deviceChoose.push(but);                       	
//                        }
//                        
//                    },
//                    scope: this
//                }
//            });
//
//            this.setDataTable();
            
            
        },
        setDataTable: function() {
            this.loadTableData(50, 0);
        }, 
        loadTableData: function(limit, cursor) {
            cloud.util.mask("#devicelist");
            var self = this;
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getLinesByUserId(userId,function(linedata){
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
                 if(linedata!=null){
	               	  self.searchData = {
	                           	"online":"0",
	                           	"lineId": lineIds
	                       };
                 }else{
	               	  self.searchData = {
	                           	"online":"0"
	                       };
                 }
                 
                 Service.getAllAutomatsByPage(self.searchData, limit, cursor, function(data) {
                     var total = data.result.length;
                     self.pageRecordTotal = total;
                     self.totalCount = data.result.length;
                     self.listTable.render(data.result);  
                     
                     var deviceChooseLen = self.deviceChoose.length;
                     
                     for(var m=0;m<deviceChooseLen;m++){
                     	$("#"+self.deviceChoose[m]).click();
                     }
                     cloud.util.unmask("#devicelist");
                 }, self);
            });
        },
        _renderBtn: function() {
        	var self = this;
        	$("#probalility").bind('keyup',function(){
	        	this.value=this.value.replace(/[^\.\d]/g,"");
	        	this.value=this.value.replace(".","");
	        	if(this.value < 1 || this.value >=1000){
	        		this.value = "";
	        	}
	        });
        	$("#nextBase").bind("click", function() {
        		
        		self.deviceLists = [];      		
        		var lotteryName = $("#lotteryName").val();
        		var probalility = $("#probalility").val();
        		var autoRun = $("#autoRun").attr("checked") ? $("#autoRun:checked").val() : "0";
        		var canBuy = $("#canBuy").attr("checked") ? $("#canBuy:checked").val() :　"0";
        		var desc = $("#desc").val();
                if(lotteryName==null||lotteryName.replace(/(^\s*)|(\s*$)/g,"")==""){
           			dialog.render({lang:"please_enter_lottery_name"});
           			return;
           		}
                if(probalility==null||probalility.replace(/(^\s*)|(\s*$)/g,"")==""){
           			dialog.render({lang:"please_enter_lottery_probalility"});
           			return;
           		}
                self.basedata={
                		lotteryName:lotteryName,
                		desc:desc,
                		probalility:probalility,
                		autoRun:autoRun,
                		canBuy:canBuy
                };
//                var deviceArr = self.getSelectedResources();
                
//                if (deviceArr.length == 0) {
//                    dialog.render({lang: "please_select_at_least_one_config_item"});
//                    return;
//                }else{
//                	for (var i = 0; i < deviceArr.length; i++) {
//                        var id = deviceArr[i]._id;
//                        var configObj ={};
//                		configObj.gwId = deviceArr[i].gwId;
//                		configObj.deviceId = id;
//                		self.deviceLists.push(configObj);
//                    }
//                }
//                if(self.deviceLists && self.deviceLists.length >0){
//                	var matchObj = {};
//                	var isNextStep = true;
//                	var flag = 0;
//                	var matchResult = {};
//                	var matchDeviceArray = [];
//            		for(var i=0;i<self.deviceLists.length;i++){
//            			var deviceId = self.deviceLists[i].deviceId;
//            			Service.getAutomatById(deviceId, function(data) {
//            				self.number = flag;
//            				matchDeviceArray.push(data.result._id);
//            				if(self.number == 0){
//            					matchResult[data.result._id] = true;
//            					matchObj.masterType = data.result.masterType;
//            					matchObj.config = data.result.config;
//            					matchObj.goodsConfigs = data.result.goodsConfigs;
//            					if(data.result.containers){
//            						matchObj.containers = data.result.containers;
//            					}
//            				}else{
//            					if(matchObj.config && matchObj.config.vender != data.result.config.vender){
//            						isNextStep = false;
//            					}
//            					if(matchObj.masterType && matchObj.masterType != data.result.masterType){
//            						isNextStep = false;
//            					}
//            					if(matchObj.goodsConfigs && matchObj.goodsConfigs.length != data.result.goodsConfigs.length){
//            						isNextStep = false;
//            					}
//            					if(matchObj.containers && !data.result.containers){
//            						isNextStep = false;
//            					}
//            					if(!matchObj.containers && data.result.containers){
//            						isNextStep = false;
//            					}
//            					if(matchObj.containers && data.result.containers && matchObj.containers.length != data.result.containers.length){
//            						isNextStep = false;
//            					}
//            					//判断主柜中的货道配置是否一至
//            					if(matchObj.goodsConfigs){
//            						var shelvesObj = {};
//            						
//            						for(var ii = 0;ii<matchObj.goodsConfigs.length;ii++){
//            							var goodsConfig = matchObj.goodsConfigs[ii];
//            							shelvesObj[goodsConfig.location_id] = goodsConfig;
//            						}
//            						
//            						for(var iii = 0;iii< data.result.goodsConfigs.length;iii++){
//            							var goodsConfig = data.result.goodsConfigs[iii];
//            							if(!shelvesObj[goodsConfig.location_id]){
//            								isNextStep = false;
//            							}else{
//            								if(goodsConfig.goods_id){
//                								if(!shelvesObj[goodsConfig.location_id].goods_id){
//                									isNextStep = false;
//                								}else{
//                									if(goodsConfig.goods_id != shelvesObj[goodsConfig.location_id].goods_id){
//                        								isNextStep = false;
//                        							}
//                								}
//                							}else{
//                								if(shelvesObj[goodsConfig.location_id].goods_id){
//                									isNextStep = false;
//                								}
//                							}              							               							            								
//            							}          							
//            						}
//            					}
//            					
//            					//判断挂载柜中的配置信息是否一至
//            					if(matchObj.containers && data.result.containers){
//            						var containerObj = {};
//            						for(var c=0;c<matchObj.containers.length;c++){
//            							var container = matchObj.containers[c];
//            							var notEqual = 0;
//            							for(var c1=0;c1<data.result.containers.length;c1++){
//            								var container1 = data.result.containers[c1];
//            								if(container.type == container1.type){
//            									//比较商品信息
//            									var containerShelves = container.shelves;
//            									var csObj = {};
//            									for(var cs=0;cs<containerShelves.length;cs++){
//            										var goodsConfig = containerShelves[cs];
//            										csObj[goodsConfig.location_id] = goodsConfig;
//            									}
//            									
//            									var containerShelves1 = container1.shelves;
//            									for(var cs1 = 0;cs1<containerShelves1.length;cs1++){
//            										var goodsConfig = containerShelves1[cs1];
//            										if(!csObj[goodsConfig.location_id]){
//            											isNextStep = false;
//            										}
//            										if(goodsConfig.goods_id){
//            											if(!csObj[goodsConfig.location_id].goods_id){
//            												isNextStep = false;
//            											}
//            										}
//            										if(!goodsConfig.goods_id){
//            											if(csObj[goodsConfig.location_id].goods_id){
//            												isNextStep = false;
//            											}
//            										}
//            										if(goodsConfig.goods_id && csObj[goodsConfig.location_id].goods_id ){
//            											if(goodsConfig.goods_id != csObj[goodsConfig.location_id].goods_id){
//            												isNextStep = false;
//            											}
//            										}
//            									}
//            									
//            									data.result.containers.splice(c1,1);
//            									c1 --;
//            								}else{
//            									notEqual ++;
//            								}
//            							}
//            							//第一个售货机中的一个货柜和第二信售货机中货柜类型完全不一样
//            							if(notEqual == data.result.containers.length){
//            								isNextStep = false;
//            								break;
//            							}
//            						}
//            					}
//            				}
//            				matchResult[data.result._id] = isNextStep;
//            				//当所有设备都为true后，构造列表数据
//            				var isNextStepBoolean = true;
//            				
//            				var counters = [];
//            				
//            				if(self.number == self.deviceLists.length-1){
//            					for(var m=0;m<matchDeviceArray.length;m++){
//            						var deviceId = matchDeviceArray[m];
//            						if(!matchResult[deviceId]){
//            							isNextStepBoolean = false;
//            						}
//            					}
//            					if(isNextStepBoolean){
//            						if(matchObj.goodsConfigs){
//            							var deviceShelvesArray = [];
//            							var counter = {};
//                        				counter.cid = "master";
//                        				counter.type = 1;
//                						for(var mo=0;mo<matchObj.goodsConfigs.length;mo++){
//                							var goodsConfig = matchObj.goodsConfigs[mo];
//                							if(goodsConfig.goods_id){
//                								var shelves = {};
//                								shelves.machineType = "master";
//                    							shelves.location_id = goodsConfig.location_id;
//                    							shelves.goods_id = goodsConfig.goods_id;
//                    							shelves.goods_name = goodsConfig.goods_name;
//                    							shelves.price = goodsConfig.price;
//                    							shelves.img = goodsConfig.img;
//                    							shelves.type = matchObj.masterType;
//                    							deviceShelvesArray.push(shelves);
//                							}
//                						}
//                						counter.channels = deviceShelvesArray;
//                						counters.push(counter);
//            						}
//            						
//                					if(matchObj.containers){
//                						
//                						for(var mc=0;mc<matchObj.containers.length;mc++){
//                							var deviceShelvesArray = [];
//                							var counter = {};
//                							var container = matchObj.containers[mc];
//                							var shelvesArray = container.shelves;
//                							counter.cid = container.cid;
//                            				counter.type = container.type;
//                							for(var sh=0;sh<shelvesArray.length;sh++){
//                								var goodsConfig = shelvesArray[sh];
//                								if(goodsConfig.goods_id){
//                									var shelves = {};
//                    								shelves.machineType = "container";
//                    								shelves.location_id =goodsConfig.location_id;
//                    								shelves.goods_id = goodsConfig.goods_id;
//                    								shelves.goods_name = goodsConfig.goods_name;
//                    								shelves.price = goodsConfig.price;
//                    								shelves.img = goodsConfig.img;
//                    								shelves.type = container.type;
//                    								deviceShelvesArray.push(shelves);
//                								}
//                							}
//                							if(deviceShelvesArray.length > 0){
//                								counter.channels = deviceShelvesArray;
//                        						counters.push(counter);
//                							}
//                							
//                						}
//                						
//                					}
                					$("#devicelist").css("display", "block");
                	                $("#selfConfig").css("display", "none");
                	                $("#baseInfo").css("display", "none");
                	                $("#tab1").removeClass("active");
                	                $("#tab2").addClass("active");
                	                this.Devicelist = new DevicelistInfo({
                	                    selector: "#devicelistInfo",
                	                    automatWindow: self.adWindow,
                	                    //deviceList:self.deviceLists,
                	                    //shelvesList:deviceShelvesArray,
                	                    //countersList:counters,
                	                    basedata:self.basedata,
                	                    lotteryData:self.lotteryData,
                	                    events: {
                	                        "rendTableData": function() {
                	                            self.fire("getlotteryList");
                	                        }
                	                    }
                	                });
//                	                if(self.lotteryData != null){
//                	                var lotteryDevices = self.lotteryData.devices;
//            		        	    var chooseDevices = self.deviceLists;
//            		        	
//            			        	if(lotteryDevices.length != chooseDevices.length){
//            			        		devicecol = false;		        		
//            			        	}else{
//            			        		
//            			        		for(var e=0;e<lotteryDevices.length;e++){
//            			        			for(var c=0;c<chooseDevices.length;c++){
//            			        				if(lotteryDevices[e].deviceId == chooseDevices[c].deviceId){
//            			        					devicecol = true;
//            			        					break;
//            			        				}else{
//            			        					devicecol = false;
//            			        				}
//            			        				
//            			        			}	        			
//            			        			if(!devicecol){
//            			        				break;
//            			        			}
//            			        		}
//            			        	 }
//                	                }
//                	                if(!devicecol){
//                	                	self.lotteryData = null;
//                	                }
//                	                this.SelfConfig = new SelfConfigInfo({
//                	                    selector: "#selfConfigInfo",
//                	                    automatWindow: self.adWindow,
//                	                    deviceList:self.deviceLists,
//                	                    //shelvesList:deviceShelvesArray,
//                	                    countersList:counters,
//                	                    basedata:self.basedata,
//                	                    lotteryData:self.lotteryData,
//                	                    events: {
//                	                        "rendTableData": function() {
//                	                            self.fire("getlotteryList");
//                	                        }
//                	                    }
//                	                });
                					//将deviceShelvesArray 传过下一个界面中显示货道的列表信息
                					
//            					}else{
//            						//去掉loading效果
//            						//给出alert提示所选择的售货配置不相同
//            						dialog.render({lang: "choose_automat_config_diff"});
//            					}
//            				}
//            				flag ++;
//            			});
//            		}
//            	}
        	});
        },
//        getSelectedResources: function() {
//            var self = this;
//            var rows = self.listTable.getSelectedRows();
//            var selectedRes = new Array();
//            rows.each(function(row) {
//                selectedRes.push(self.listTable.getData(row));
//            });
//            return selectedRes;
//        },  
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