define(function(require) {
    var cloud = require("cloud/base/cloud");
    var Common = require("../../../../common/js/common");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./seeDevice.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../service");
    var gmap = require("../map/map");

    require("../add/css/default.css");
    require("../add/js/scrollable");
    var SelfConfigInfo = require("./selfConfig");
    var SelfDetailInfo = require("./DetailInfo/info");
    var SelfStatusInfo = require("./StatusInfo/info");
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.deviceId = options.deviceId;
            this.deviceIdArr = options.deviceIdArr;
            this.automatNo=options.automatNo;
            this._renderWindow();
         
           
            this.data = null;
            $("#left").mouseover(function (){
		    	$("#left").css("opacity","0.6");		    	
			}).mouseout(function (){
				$("#left").css("opacity","1");
			});
            $("#right").mouseover(function (){
		    	$("#right").css("opacity","0.6");		    	
			}).mouseout(function (){
				$("#right").css("opacity","1");
			});

        	if(this.deviceId == this.deviceIdArr[0]){
        		$("#left").hide();
        	}
        	if(this.deviceId == this.deviceIdArr[this.deviceIdArr.length - 1]){
        		$("#right").hide();
        	}
            $("#left").bind('click',{self:this},function(e){
            	$("#right").show();
            	var idArry = e.data.self.deviceIdArr;
            	for(var i=0;i<idArry.length;i++){
            		if(e.data.self.deviceId == idArry[i]){          			
            			if(i != 0){
            				e.data.self.deviceId = idArry[i-1];
            				break;
            			}         			
            		}
            	}
            	if(e.data.self.deviceId == idArry[0]){
            		$("#left").hide();
            	}
            	e.data.self._renderMap();
            	
            });
            
            $("#right").bind('click',{self:this},function(e){
            	$("#left").show();
            	var idArry = e.data.self.deviceIdArr;           	
            	for(var i=0;i<idArry.length;i++){
            		if(e.data.self.deviceId == idArry[i]){         			
            			if(i != idArry.length - 1){
            				e.data.self.deviceId = idArry[i+1];
            				break;          				
            			}else{
            				$("#right").hide();
            			}        			
            		}
            	}  
            	if(e.data.self.deviceId == idArry[idArry.length - 1]){
            		$("#right").hide();
            	}
            	e.data.self._renderMap();
            	
            });
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.automatWindow = new _Window({
                container: "body",
                title:locale.get({lang: "all_automat_detailed_information"})+" ["+locale.get({lang: "automat_no3"})+this.automatNo+"]",
                top: "center",
                left: "center",
                height: 620,
                width: 1000,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                    "onClose": function() {
                        this.automatWindow.destroy();
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
            this.modelChange = 1;
            this.automatWindow.show();
            $("#detailInfo").css("display", "none");
            $("#nextBase").val(locale.get({lang: "next_step"}));
            this.renderSecondSelfConfig();
            this.renderDetailSelfConfig();//详细信息
            this.renderStatusSelfConfig();//状态信息
            this._renderMap();//加载点位地图

        },
        getSite: function(siteName, map) {
            var self = this;
            Service.getSiteByName(siteName, function(siteData) {
            	
                if (siteData.result) {
                    var loc = siteData.result.address;
                    var lng = siteData.result.location.longitude;
                    var lat = siteData.result.location.latitude;
                    if(lng && lat){
						  
						  var icon = "../images/green.png";
						  if(self.marker){
							self.marker.destroy();
						  }
						  var cp={
								  lat:lat,
								  lon:lng
						  };
						  self.map.setCenter(cp);
						  self.map.setZoom(15);
						  self.marker = map.addMarker({
							  position:new gmap.LonLat(lng,lat),
							  title : "",
							  draggable : true,  //控制是否可拖动
							  icon : require.toUrl(icon),    //自定义的一个图片
							  visible:true
						 });	
					  }
                }
            }, self);
        },
        loadDeviceData: function(map) {
            var self = this;
            cloud.util.mask("#deviceForm");
            Service.getAutomatById(self.deviceId, function(data) {
                self.data = data;
                
                if(data.result.online == 1){
                	   $("#onlines").val(locale.get({lang: "offline"}));
                }else if(data.result.online == 0){
                	   $("#onlines").val(locale.get({lang: "online"}));
                }
                if(data.result.config){
                	if(data.result.config.vender){
                		var venderName = data.result.config.vender;
                		venderName = Common.getLangVender(venderName);
                		$("#vender").val(venderName);
                	}
                }
                $("#createTime").attr("value", data.result.createTime == null ? "" : cloud.util.dateFormat(new Date(data.result.createTime), "yyyy-MM-dd hh:mm:ss"));
                $("#suggestId").attr("value", data.result.siteName == null ? "" : data.result.siteName);//点位名称
                $("#siteName").attr("value", data.result.siteName == null ? "" : data.result.siteName);//点位名称
                $("#siteId").attr("value", data.result.siteId == null ? "" : data.result.siteId);//点位ID
                $("#deviceName").attr("value", data.result.name == null ? "" : data.result.name);//售货机名称
                $("#assetId").val(data.result.assetId == null ? "" : data.result.assetId);//售货机编号
                $("#line").attr("value", data.result.lineName == null ? "" : data.result.lineName);//线路
                $("#lineId").attr("value", data.result.lineId == null ? "" : data.result.lineId);//线路ID
                self.getSite(data.result.siteName, map);
                if(document.getElementById("biaoHaoLabel")) { 
                	  $("#biaoHaoLabel").remove();
                  }
                 $("#autoBianHao").append("<label id='biaoHaoLabel'>["+data.result.assetId+"]：</label>");
                $(".ui-window-title-name").html(locale.get({lang: "all_automat_detailed_information"})+" ["+locale.get({lang: "automat_no3"})+data.result.assetId+"]");
                if(data.result.vendingState && data.result.vendingState.temperState){
                	$("#autoNo").css("display","block");
                }else{
                	$("#autoNo").css("display","none");
                }
                var masterType = data.result.masterType;
                
                if(masterType==1){
                	masterType = locale.get({lang: "drink_machine"});
                }else if(masterType==2){
                	masterType = locale.get({lang: "spring_machine"});
                }else if(masterType==3){
                	masterType = locale.get({lang: "grid_machine"});
                }
                self.SelfConfig.setconfig(data.result.assetId,masterType);
                if (data.result.goodsConfigs) {
                    self.goodsConfigs = data.result.goodsConfigs;
                    if(data.result.vendingState){
                    	if(data.result.vendingState.shelvesState){//售货机货道状态
                    		self.SelfConfig.getTab(data.result.goodsConfigs,data.result.vendingState.shelvesState);
                    	}else{
                    		self.SelfConfig.getTab(data.result.goodsConfigs,null);
                    	}
                    }else{
                    	self.SelfConfig.getTab(data.result.goodsConfigs,null);
                    }
                    
                }
                if (data.result.containers) {//货柜
                    if(data.result.vendingState){
                    	if(data.result.vendingState.shelvesState){//售货机货道状态
                    		self.SelfConfig.getOtherTab(data.result.containers,data.result.vendingState.shelvesState);
                    	}else{
                    		self.SelfConfig.getOtherTab(data.result.containers,null);
                    	}
                    }else{
                    	self.SelfConfig.getOtherTab(data.result.containers,null);
                    }
                }
                
                if(data.result.inboxConfig){//inbox基本信息
                	self.selfDetailInfo.getData(data.result.inboxConfig,data.result.vendingState);
                }
                
                if(data.result.vendingState){//inbox状态信息
                	self.selfStatusInfo.getData(data.result.vendingState);
                }else{
                	self.selfStatusInfo.getData(null);
                }
                
                var payConfig = data.result.payConfig;
                var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
                cloud.Ajax.request({
  	    	      url:"api/smartUser/"+userId,
  		    	  type : "GET",
  		    	  success : function(data) {
  		    		var areaId = "";
  		    		if(data && data.result && data.result.area){
  		    			areaId = data.result.area[0];
  		    		}
                    Service.getPayStylelist(0,areaId, function(payStyleData) {
                        require(["cloud/lib/plugin/jquery.multiselect"], function() {
                            $("#payStyle").multiselect({
                                header: true,
                                checkAllText: locale.get({lang: "check_all"}),
                                uncheckAllText: locale.get({lang: "uncheck_all"}),
                                noneSelectedText: locale.get({lang: "all_payment_types"}),
                                selectedText: "# " + locale.get({lang: "is_selected"}),
                                minWidth: 170,
                                height: 120
                            });
                        });
                        if (payStyleData && payStyleData.result.length > 0) {
                            for (var i = 0; i < payStyleData.result.length; i++) {
                                var name;
                                var payType;
                                if (payStyleData.result[i].name == "wechat") {
                                    name = "WeChat";
                                    payType = "WECHAT";
                                } else if (payStyleData.result[i].name == "alipay") {
                                    name = "Alipay";
                                    payType = "ALIPAY";
                                } else if (payStyleData.result[i].name == "baidu") {
                                    name = "Baidu Wallet";
                                    payType = "BAIDU";
                                }else if (payStyleData.result[i].name == "bestpay") {
                                    name = "Best Pay";
                                    payType = "BESTPAY";
                                }else if (payStyleData.result[i].name == "jdpay") {
                                    name = "JD Pay";
                                    payType = "JDPAY";
                                }else if (payStyleData.result[i].name == "vippay") {
                                    name = "Vip Pay";
                                    payType = "VIPPAY";
                                }
                                $("#payStyle").append("<option value='" + payStyleData.result[i]._id + "' pay='" + payType + "'>" + name + "</option>");
                            }
                        }
                        if (payConfig && payConfig.length > 0) {
                            for (var i = 0; i < payConfig.length; i++) {
                                $('#payStyle option').each(function() {
                                    if (payConfig[i].payId == this.value) {
                                        this.selected = true;
                                    }
                                });
                            }
                        }
                    });
  		    	  }
                });
                
                cloud.util.unmask("#deviceForm");
            }, self);
        },
        getCenter: function(map, cp, text) {
            var geoc = new BMap.Geocoder();
            geoc.getLocation(cp, function(rs) {
                var addComp = rs.addressComponents;
                var address = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                if (text) {
                    address = text;
                }
//                $("#suggestId").val(address);

                var opts = {
                    width: 200, // 信息窗口宽度
                    height: 30, // 信息窗口高度
                    title: "当前位置", // 信息窗口标题
                    enableMessage: true, //设置允许信息窗发送短息
                    message: ""
                }
                var infoWindow = new BMap.InfoWindow(address, opts);  // 创建信息窗口对象 
                map.openInfoWindow(infoWindow, cp); //开启信息窗口
            });
        },
        renderSecondSelfConfig: function() {
            var self = this;
            if(this.SelfConfig){
            	this.SelfConfig.destroy();
            }
            this.SelfConfig = new SelfConfigInfo({
                selector: "#selfConfigInfo",
                automatWindow: self.automatWindow,
                deviceId:self.deviceId,
                events: {
                    "rendTableData": function() {
                        self.fire("getDeviceList");
                    }
                }
            });
        },
        renderDetailSelfConfig: function() {
            var self = this;
            this.selfDetailInfo = new SelfDetailInfo({
                selector: "#selfDetailInfo",
                automatWindow: self.automatWindow,
                events: {
                    "rendTableData": function() {
                        self.fire("getDeviceList");
                    }
                }
            });
        },
        renderStatusSelfConfig: function() {
            var self = this;
            this.selfStatusInfo = new SelfStatusInfo({
                selector: "#selfStatusInfo",
                automatNo: this.automatNo,
                automatWindow: self.automatWindow,
                events: {
                    "rendTableData": function() {
                        self.fire("getDeviceList");
                    }
                }
            });
        },
        _renderMap: function() {
            var self = this;
            
            this.map = new gmap.Map({
				selector : this.element.find("#container")
			});
            this.loadDeviceData(this.map);//获取该售货机的基本信息

            //下一步
            $("#nextBase").bind("click", function() {
                $("#detailInfo").css("display", "block");
                $("#baseInfo").css("display", "none");
                $("#tab1").removeClass("active");
                $("#tab2").addClass("active");
            });
            $("#tab1").bind("click", function() {
                $("#baseInfo").css("display", "block");
                $("#detailInfo").css("display", "none");
                $("#statusInfo").css("display", "none");
                $("#selfConfig").css("display", "none");
                $("#tab2").removeClass("active");
                $("#tab3").removeClass("active");
                $("#tab4").removeClass("active");
                $("#tab1").addClass("active");
            });
            $("#tab2").bind("click", function() {
                $("#detailInfo").css("display", "block");
                $("#baseInfo").css("display", "none");
                $("#statusInfo").css("display", "none");
                $("#selfConfig").css("display", "none");
                $("#tab1").removeClass("active");
                $("#tab3").removeClass("active");
                $("#tab4").removeClass("active");
                $("#tab2").addClass("active");
            });
            $("#tab3").bind("click", function() {
                $("#statusInfo").css("display", "block");
                $("#baseInfo").css("display", "none");
                $("#detailInfo").css("display", "none");
                $("#selfConfig").css("display", "none");
                $("#tab1").removeClass("active");
                $("#tab2").removeClass("active");
                $("#tab4").removeClass("active");
                $("#tab3").addClass("active");
            });
            $("#tab4").bind("click", function() {
                $("#selfConfig").css("display", "block");
                $("#baseInfo").css("display", "none");
                $("#detailInfo").css("display", "none");
                $("#statusInfo").css("display", "none");
                $("#tab1").removeClass("active");
                $("#tab2").removeClass("active");
                $("#tab3").removeClass("active");
                $("#tab4").addClass("active");
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