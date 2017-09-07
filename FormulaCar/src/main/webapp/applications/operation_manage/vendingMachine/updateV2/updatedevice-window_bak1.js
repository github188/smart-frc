define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./updateDevice.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../service");
    require("http://api.map.baidu.com/api?v=1.4&key=5rCA4tslqZE5Ip5ew5pudaSb&callback=initialize");
    require("../add/css/default.css");
    require("../add/js/scrollable");
    var SelfConfigInfo = require("../goodsConfig/selfConfig");
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.onlineType = options.onlineType;
            this.deviceId = options.deviceId;
            this._renderWindow();
            this.data = {};
            this.cidCount = 0;
            this.automatData = {};
            this.modelIdArr = [];//机型ID列表
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            var title = locale.get({lang: "update_automat"});

            this.automatWindow = new _Window({
                container: "body",
                title: title,
                top: "center",
                left: "center",
                height: 620,
                width: 1000,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                 	"beforeClose":function(){
                		if(self.automatWindow.body){
                			 dialog.render({lang: "sure_close_window",buttons: [{
                    			 lang: "affirm",
                    			 click:function(){
                    				 dialog.close();
                    				 self.automatWindow.destroy();
                                     cloud.util.unmask();
                    			 }
                    		 	},
                    		 	{
                					
               					 lang: "cancel",
                                 click: function() {
                                           dialog.close();
                                           
                                       }
                    		 	}]}
                    		 );
                			 return false;
                		}
                	
                		 return true;
                	},
                    "onClose": function() {
                        this.automatWindow.destroy();
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
            this.modelChange = 1;
            this.automatWindow.show();

            $("#lastBase").val(locale.get({lang: "previous_page"}));
            $("#nextBase").val(locale.get({lang: "next_step"}));
            $("#nextBase2").val(locale.get({lang: "material_configuration"}));
            $("#addCid").val(locale.get({lang: "add_cid"}));
            	
            $("#selfConfig").css("display", "block");

            if(self.onlineType && self.onlineType == 1){
            	$("#paystyle").css("display", "none");
            }
            
            $("#saveBase").val(locale.get({lang: "save"}));
            
            this.renderSecondSelfConfig();
            this._renderMap();//加载点位地图
            this.init();
        },
        init:function(){
        	var currentHost=window.location.hostname;
        	if(currentHost == "longyuniot.com"){
        		$("#automat_vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        		$("#automat_vender").append("<option value='aucma'>"+locale.get({lang: "vender_name_aucma"})+"</option>");
            }else if(currentHost == "www.dfbs-vm.com"){
            	$("#automat_vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
            	$("#automat_vender").append("<option value='fuji'>"+locale.get({lang: "vender_name_fuji"})+"</option>");
            }else {
            	$("#automat_vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
            	$("#automat_vender").append("<option value='aucma'>"+locale.get({lang: "vender_name_aucma"})+"</option>");
            	$("#automat_vender").append("<option value='fuji'>"+locale.get({lang: "vender_name_fuji"})+"</option>");
            	$("#automat_vender").append("<option value='easy_touch'>"+locale.get({lang: "vender_name_easy_touch"})+"</option>");
            	$("#automat_vender").append("<option value='junpeng'>"+locale.get({lang: "vender_name_junpeng"})+"</option>");
            	$("#automat_vender").append("<option value='baixue'>"+locale.get({lang: "vender_name_baixue"})+"</option>");
            	$("#automat_vender").append("<option value='leiyunfeng'>"+locale.get({lang: "leiyunfeng"})+"</option>");
            }
        },
      //添加挂载柜
        renderCidBtn:function(){
        	var self = this;       
        	
        	cloud.Ajax.request({
                url: "api/model/formatlist",
                type: "GET",
                parameters:{},
                success: function(data) {
                	
                	if(data && data.result){
                		self.modelListData = data.result;
                		//增加货柜
                    	$("#addCid").bind("click",function(){
                    		self.cidCount ++;
                    		
                    		var count = self.cidCount;
                    		
                    		$("#cidConfigInfo").append("<div class='cidinfo' id='cid"+self.cidCount+"' class='cidinfo'>" +
                    				"<table width='100%;'>" +
                    				"<tr>"+
                                        "<td width='30%'><label style='color:red;'>*</label><label><span lang='text:device_shelf_number'>"+locale.get({lang: "device_shelf_number"})+"</span></label></td>"+
                                        "<td><input type='text' class='input'  id='cid"+self.cidCount+"_assetId' name='cid"+self.cidCount+"_assetId' style='width:200px;height:30px;'/></td>"+
                                    "</tr>"+
                                    "<tr height='45px'>"+
                                    "<td width='30%'><label style='color:red;'></label><label><span lang='text:vender'>"+locale.get({lang: "vender"})+"</span></label></td>"+
                                    "<td><select class='automat-info-select'  id='cid"+self.cidCount+"_vender' style='width:200px;border-radius: 4px;height: 35px;'></select></td>"+
                                    
                                "</tr>"+
                                "<tr height='45px'>"+
                                    "<td width='30%'><label style='color:red;'></label><label><span lang='text:automat_vendor_type'>"+locale.get({lang: "automat_vendor_type"})+"</span></label></td>"+
                                    "<td><select class='automat-info-select'  id='cid"+self.cidCount+"_machineType' style='width:200px;border-radius: 4px;height: 35px;'></select></td>"+
                                    
                                "</tr>"+
                                    "<tr height='45px'>"+
                                        "<td width='30%'><label style='color:red;'>*</label><label><span lang='text:model'>"+locale.get({lang: "model"})+"</span></label></td>"+
                                        "<td><select class='automat-info-select'  id='cid"+self.cidCount+"_model' style='width:200px;border-radius: 4px;height: 35px;'></select></td>"+
                                    "</tr>"+
            	                    "<tr>"+
            	                    "<span class='delspan"+self.cidCount+" delete_cid'></span>"+
            	                    "</tr>"+
                    				"</table>" +
                    				"</div>");
                    		
                    		//机型                  		                   		
                    		
                    		self.venderMap = {};
                    		self.modelMap = {};
                    		for(var i=0;i<self.modelListData.length;i++){
                    			var vender = self.modelListData[i].vender;
                    			var venderNum = self.modelListData[i].venderNum;
                    			var types = self.modelListData[i].typeInfos;
                    			var typeA = [];
                    			for(var m=0;m<types.length;m++){
                    				var info = {};
                    				info.type = types[m].type;
                    				info.typeName = types[m].typeName;
                    				typeA.push(info);
                    				
                    				var models = types[m].modelInfos;
                    				self.modelMap[vender+"@"+types[m].type] = models;
                    			}
                    			self.venderMap[vender+"@"+venderNum] = typeA;
                    		}
                    		
                    		
                    		$("#cid"+self.cidCount+"_vender").empty();
                    		$("#cid"+self.cidCount+"_vender").append("<option value='0'>-------"+locale.get({lang: "please_select_vender"})+"-------</option>");
                    		$("#cid"+self.cidCount+"_machineType").empty();
                    		$("#cid"+self.cidCount+"_machineType").append("<option value='0'>-------"+locale.get({lang: "please_select_machinetype"})+"-------</option>");
                    		$("#cid"+self.cidCount+"_model").empty();
                    		$("#cid"+self.cidCount+"_model").append("<option value='0'>-------"+locale.get({lang: "please_select_model"})+"-------</option>");
                    		
                    		
                    		for(var key in self.venderMap){
                    			var number = key.split('@')[1];
                    			var ven = key.split('@')[0];
                    		    $("#cid"+self.cidCount+"_vender").append("<option value='"+number+"'>"+ven+"</option>");
                    			
                    		}
                    		$("#cid"+self.cidCount+"_vender").bind("change",{count:self.cidCount},function(e){
                    			
                    			$("#cid"+e.data.count+"_machineType").empty();
                        		$("#cid"+e.data.count+"_machineType").append("<option value='0'>-------"+locale.get({lang: "please_select_machinetype"})+"-------</option>");
                        		$("#cid"+e.data.count+"_model").empty();
                        		$("#cid"+e.data.count+"_model").append("<option value='0'>-------"+locale.get({lang: "please_select_model"})+"-------</option>");
                    			
                    			var num = $(this).children('option:selected').val();
                    			var vender = $(this).children('option:selected').text();
                    			
                    			var types = self.venderMap[vender+"@"+num];
                    			if(types && types.length>0){
                    				for(var l=0;l<types.length;l++){
                            			$("#cid"+e.data.count+"_machineType").append("<option value='"+types[l].type+"'>"+types[l].typeName+"</option>");
                            		}
                    			}
                    			
                    			
                    			$("#cid"+e.data.count+"_machineType").bind("change",{count:e.data.count},function(a){
                    				
                            		$("#cid"+a.data.count+"_model").empty();
                            		$("#cid"+a.data.count+"_model").append("<option value='0'>-------"+locale.get({lang: "please_select_model"})+"-------</option>");
            						var vendert = $("#cid"+a.data.count+"_vender").children('option:selected').text();
                            		var machineType = $(this).children('option:selected').val();
            						
            						var models = self.modelMap[vendert+"@"+machineType];
            						if(models && models.length>0){
            							for(var n=0;n<models.length;n++){
                                			$("#cid"+a.data.count+"_model").append("<option value='"+models[n].modelId+"'>"+models[n].modelName+"</option>");
                                		}
            						}
            					});
                    		});
                    		
                    		//删除货柜
                    		$(".delspan"+self.cidCount).bind("click",{count:self.cidCount},function(e){
                    			
                        		$("#cid"+e.data.count).remove();
                        		
                        	});
                    		//鼠标经过事件
                            $(".delspan"+self.cidCount).bind("mouseover",{count:self.cidCount},function(e){
                    			
                            	$(".delspan"+e.data.count).removeClass("delete_cid");
                		    	$(".delspan"+e.data.count).addClass("delete_cid_tp");
                        		
                        	});
                            $(".delspan"+self.cidCount).bind("mouseout",{count:self.cidCount},function(e){
                    			
                            	$(".delspan"+e.data.count).removeClass("delete_cid_tp");
                		    	$(".delspan"+e.data.count).addClass("delete_cid");
                        		
                        	});
                    		
                            $("#cid"+self.cidCount).find('table').css("margin-top","-30px");
                            
                            
                            
                    	});
                		
                    	
                    	
                    	
                    	if(self.data && self.data.result.containersNew){
                    		
                    		for(var x=0;x<self.data.result.containersNew.length;x++){
                    			
                    			var tempData = self.data.result.containersNew[x];
                    			var modelId = tempData.modelId;
                    			var venderNum = tempData.venderNum;
                    			var machineType = tempData.type;
                    			var cid = tempData.cid;
                    			var modelPicId = tempData.modelPicId;
                    			if(modelId != null || modelPicId != null){
                    				$("#addCid").click();
                    				$("#cid"+self.cidCount+"_assetId").val(cid);
                    				$("#cid"+self.cidCount+"_vender").val(venderNum);
                    				$("#cid"+self.cidCount+"_vender").change();
                    				$("#cid"+self.cidCount+"_machineType").val(machineType);
                    				$("#cid"+self.cidCount+"_machineType").change();
                    				$("#cid"+self.cidCount+"_model").val(modelId);
                    				
                    				$("#cid"+self.cidCount+"_assetId").attr("readonly",true);
                    				$("#cid"+self.cidCount+"_vender").attr("disabled",true);
                    				$("#cid"+self.cidCount+"_machineType").attr("disabled",true);
                    				$("#cid"+self.cidCount+"_model").attr("disabled",true);
                    			}
                    			
                    		}
                    		
                    	}
                		
                	}
                	
                }
        	})
        },

        getAllSite: function(siteId, map) {
            var self = this;
            if(siteId){
            	Service.getSiteById(siteId,function(data){
                	
                	$("#siteId").append("<option value='" + data.result._id + "' selected='selected' lineId='" + data.result.lineId + "' lineName='" + data.result.lineName + "' loc='" + data.result.address + "' lat='" + data.result.location.latitude + "' lng='" + data.result.location.longitude + "' >" + data.result.name + "</option>");
                	var loc = data.result.address;
                    var lng = data.result.location.longitude;
                    var lat = data.result.location.latitude;
                    if (lng != "" && lat != "") {
                        map.clearOverlays(); //清除
                        var new_point = new BMap.Point(lng, lat);
                        self.getCenter(map, new_point, loc);
                        var marker = new BMap.Marker(new_point);       // 创建标注
                        map.addOverlay(marker);                        // 将标注添加到地图中
                        map.panTo(new_point);
                       // marker.enableDragging();  //可拖拽
                        //标注拖拽后的位置
                       // marker.addEventListener("dragend", function(e) {
                       //   self.getCenter(map, e.point, '');
                       //});
                    }
                });
            }
            
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
       	    var roleType = permission.getInfo().roleType;
       	    Service.getLinesByUserId(userId,function(linedata){
                 var lineIds=[];
                 if(linedata && linedata.result && linedata.result.length>0){
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
                 self.lineIds = lineIds;
            	 Service.getAllEnableSitesByPage({"lineId":lineIds}, -1, 0, function(siteData) {
                     if (siteData.result && siteData.result.length > 0) {
                         for (var i = 0; i < siteData.result.length; i++) {
                             $("#siteId").append("<option value='" + siteData.result[i]._id + "'  lineId='" + siteData.result[i].lineId + "' lineName='" + siteData.result[i].lineName + "' loc='" + siteData.result[i].address + "' lat='" + siteData.result[i].location.latitude + "' lng='" + siteData.result[i].location.longitude + "' >" + siteData.result[i].name + "</option>");
                         }
                     }
                     //$("#siteId").val(siteId);
                     var lng = $("#siteId").find("option:selected").attr("lng");
                     var lat = $("#siteId").find("option:selected").attr("lat");
                     var loc = $("#siteId").find("option:selected").attr("loc");
                     if (lng != "" && lat != "") {
                         map.clearOverlays(); //清除
                         var new_point = new BMap.Point(lng, lat);
                         self.getCenter(map, new_point, loc);
                         var marker = new BMap.Marker(new_point);       // 创建标注
                         map.addOverlay(marker);                        // 将标注添加到地图中
                         map.panTo(new_point);
                        // marker.enableDragging();  //可拖拽
                         //标注拖拽后的位置
                        // marker.addEventListener("dragend", function(e) {
                        //     self.getCenter(map, e.point, '');
                        // });
                     }
                 }, self); 
	                 
       	    });
            
        },
        getAllModel: function(modelConfigsNew) {
            var self = this;
            if(modelConfigsNew != null){
    			self.vender = modelConfigsNew.vender;
    			self.machineType = modelConfigsNew.masterTypeNew;
    			self.modelId = modelConfigsNew.modelId;
    		}
            
            cloud.Ajax.request({
                url: "api/model/formatlist",
                type: "GET",
                parameters:{},
                success: function(data) {
                	
                	if(data && data.result){
                		
                		
                		self.venderMap = {};
                		self.modelMap = {};
                		for(var i=0;i<data.result.length;i++){
                			var vender = data.result[i].vender;
                			var venderNum = data.result[i].venderNum;
                			var types = data.result[i].typeInfos;
                			var typeA = [];
                			for(var m=0;m<types.length;m++){
                				var info = {};
                				info.type = types[m].type;
                				info.typeName = types[m].typeName;
                				typeA.push(info);
                				
                				var models = types[m].modelInfos;
                				self.modelMap[vender+"@"+types[m].type] = models;
                			}
                			self.venderMap[vender+"@"+venderNum] = typeA;
                		}
                		
                		self.modelListData = data.result;
                		//$("#automat_vender").empty();
                		//$("#automat_vender").append("<option value='0'>-------"+locale.get({lang: "please_select_vender"})+"-------</option>");
                		$("#automat_machineType").empty();
                		$("#automat_machineType").append("<option value='0'>-------"+locale.get({lang: "please_select_machinetype"})+"-------</option>");
                		$("#automat_model").empty();
                		$("#automat_model").append("<option value='0'>-------"+locale.get({lang: "please_select_model"})+"-------</option>");
                		
                		
                		/*for(var key in self.venderMap){
                			var number = key.split('@')[1];
                			var ven = key.split('@')[0];
                			if(self.vender == ven){
                				$("#automat_vender").append("<option value='"+number+"' selected='selected'>"+ven+"</option>");
                			}else{
                				$("#automat_vender").append("<option value='"+number+"'>"+ven+"</option>");
                			}
                		}*/
                		$("#automat_vender").bind("change",{machineType:self.machineType,modelId:self.modelId},function(e){
                			
                			$("#automat_machineType").empty();
                    		$("#automat_machineType").append("<option value='0'>-------"+locale.get({lang: "please_select_machinetype"})+"-------</option>");
                    		$("#automat_model").empty();
                    		$("#automat_model").append("<option value='0'>-------"+locale.get({lang: "please_select_model"})+"-------</option>");
                			
                			var num = $(this).children('option:selected').val();
                			var vender = $(this).children('option:selected').text();
                			
                			var types = self.venderMap[vender+"@"+num];
                			if(types && types.length>0){
                				for(var l=0;l<types.length;l++){
                        			if(e.data.machineType == types[l].type){
                        				$("#automat_machineType").append("<option value='"+types[l].type+"' selected='selected'>"+types[l].typeName+"</option>");
                        			}else{
                        				$("#automat_machineType").append("<option value='"+types[l].type+"'>"+types[l].typeName+"</option>");
                        			}
                        		}
                			}
                			
                			
                			$("#automat_machineType").bind("change",{modelId:e.data.modelId,vender:vender},function(a){
                				
                        		$("#automat_model").empty();
                        		$("#automat_model").append("<option value='0'>-------"+locale.get({lang: "please_select_model"})+"-------</option>");
        						var machineType = $(this).children('option:selected').val();
        						//var vender = $(this).children('option:selected').text();
        						
        						var models = self.modelMap[a.data.vender+"@"+machineType];
        						if(models && models.length>0){
        							for(var n=0;n<models.length;n++){
                            			if(a.data.modelId == models[n].modelId){
                            				$("#automat_model").append("<option value='"+models[n].modelId+"' selected='selected'>"+models[n].modelName+"</option>");
                            			}else{
                            				$("#automat_model").append("<option value='"+models[n].modelId+"'>"+models[n].modelName+"</option>");
                            			}
                            		}
        						}
        					});
                			//初始化类型
                			if(self.machineType != null){
                				$("#automat_machineType").change();
                			}
                			
                		});
                		
                		if(self.vender != null){
                			$("#automat_vender").change();
                		}
                		
                	}
                    
                }
            });           
            
        },
        getMachineType:function(type){
        	
        	if(type==1){
        		type = locale.get({lang: "drink_machine"});
            }else if(type==2){
            	type = locale.get({lang: "spring_machine"});
            }else if(type==3){
            	type = locale.get({lang: "grid_machine"});
            }else if(type==4){
            	type = locale.get({lang: "coffee_machine"});
            }
        	
        	return type;
        	
        },
        loadDeviceData: function(map) {
            var self = this;
           
            cloud.util.mask("#deviceForm");
            Service.getAutomatById(self.deviceId, function(data) {
                self.data = data;
                var searchData = {};
                var siteId = data.result.siteId;
                $("#siteNameOld").val(data.result.siteName);
                $("#deviceName").attr("value", data.result.name == null ? "" : data.result.name);//售货机名称
                $("#assetId").val(data.result.assetId == null ? "" : data.result.assetId);//售货机编号
                 
                $("#fileId").val(data.result.modelPicId == null ? "":data.result.modelPicId);//机型图片
                $("#fileName").text(data.result.modelPicName == null ? "":data.result.modelPicName);
                console.log(data.result.modelConfigsNew);
                //Object {modelId: "57f864750cf2c264fb2b5948", modelName: "AUCMA工装2", masterTypeNew: 1, vender: "澳柯玛", venderNum: "aucma"}
                if(data.result.modelConfigsNew){
                	 $("#automat_vender option[value='"+data.result.modelConfigsNew.venderNum+"']").attr("selected","selected");
                	 $("#automat_machineType option[value='"+data.result.modelConfigsNew.masterTypeNew+"']").attr("selected","selected");
                	 $("#automat_model option[value='"+data.result.modelConfigsNew.modelId+"']").attr("selected","selected");
                }
                $("#alipay_store_id").val(data.result.alipay_store_id == null ? "":data.result.alipay_store_id);
                //self.modelId = data.result.modelId;
                //self.modelName = data.result.modelName;
                
                self.getAllSite(siteId, map);
                
                self.getAllModel(data.result.modelConfigsNew);
                
                
                var masterType = self.getMachineType(data.result.masterType);
          
                
                self.SelfConfig.setconfig(data.result.assetId,masterType);
                
                
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
                                    name = "微信";
                                    payType = "WECHAT";
                                } else if (payStyleData.result[i].name == "alipay") {
                                    name = "支付宝";
                                    payType = "ALIPAY";
                                } else if (payStyleData.result[i].name == "baidu") {
                                    name = "百付宝";
                                    payType = "BAIDU";
                                }else if (payStyleData.result[i].name == "bestpay") {
                                    name = "翼支付";
                                    payType = "BESTPAY";
                                }else if (payStyleData.result[i].name == "jdpay") {
                                    name = "京东支付";
                                    payType = "JDPAY";
                                }else if (payStyleData.result[i].name == "vippay") {
                                    name = "会员支付";
                                    payType = "VIPPAY";
                                }else if (payStyleData.result[i].name == "UNIONPAY") {
                                    name = "银联支付";
                                    payType = "UNIONPAY";
                                }
                                $("#payStyle").append("<option value='" + payStyleData.result[i]._id + "' pay='" + payType + "'>" + name + "</option>");
                            }
                        }
                        if (payConfig && payConfig.length > 0) {
                        	//console.log(payConfig);
                        	$("#store_id").css("display","none");
                            for (var i = 0; i < payConfig.length; i++) {
                                $('#payStyle option').each(function() {
                                    if (payConfig[i].payId == this.value) {
                                        this.selected = true;
                                    }
                                    if(payConfig[i].payName == "ALIPAY"){
                                    	$("#store_id").css("display","block");
                                    }
                                });
                            }
                        }

                    }, self);
  		    	   }
                });
                
                    self.renderCidBtn();
                
                
                    cloud.util.unmask("#deviceForm");
                }, self);

        },
        renderSecondSelfConfig: function() {
            var self = this;

            self.SelfConfig = new SelfConfigInfo({
                selector: "#selfConfigInfo",
                automatWindow: self.automatWindow,
                events: {
                    "rendTableData": function() {
                        self.fire("getDeviceList");
                    }
                }
            });
        },
        getCenter: function(map, cp, text) {
            var geoc = new BMap.Geocoder();
//            var suggestId = $("#suggestId").val();
            var suggestId = $("#loc").val();
            geoc.getLocation(cp, function(rs) {
                var addComp = rs.addressComponents;

                var address = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                if (text) {
                    address = text;
                }
                if (suggestId == null || suggestId == "") {
                    $("#loc").val(address);
                }

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
        _renderMap: function() {
            var self = this;
            var map = new BMap.Map("container");          // 创建地图实例  
            var point = new BMap.Point(116.404, 39.915);  // 创建点坐标  
            map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别  
            map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
            map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
            var opts = {type: BMAP_NAVIGATION_CONTROL_LARGE}
            map.addControl(new BMap.NavigationControl(opts));


            //移动地图 时将定位到当前视野的中心点
            /*map.addEventListener("dragend", function showInfo() {
                var cp = map.getCenter();
                map.clearOverlays();                    //清除
                var marker = new BMap.Marker(cp);       // 创建标注
                map.addOverlay(marker);                 // 将标注添加到地图中
//                $("#lng").val(cp.lng);
//                $("#lat").val(cp.lat);

                self.getCenter(map, cp, '');

                //marker.enableDragging();  //可拖拽
                //标注拖拽后的位置
               // marker.addEventListener("dragend", function(e) {
//                    $("#lng").val(e.point.lng);
//                    $("#lat").val(e.point.lat);
                   // self.getCenter(map, e.point, '');
               // });
            });*/
            
            this._renderBtn(map);//各个按钮事件
            this.loadDeviceData(map);//获取该售货机的基本信息
            
        },
        loadApplication: function(application) {
            var msg = this.msgToSend;
            this.msgToSend = null;            
            var appUrl = application.url;
        	cloud.util.setCurrentApp(application);
            if (this.currentApplication && Object.isFunction(this.currentApplication.destroy)) {
                this.currentApplication.destroy();
                this.currentApplication = null;
            }           
            if (appUrl.endsWith(".html")) {
                $("#user-content").load(appUrl);
                this.appNow = application;
                msg && this.sendMsg(application.name, msg);
            } else {
                cloud.util.mask("#user-content");
                this.requestingApplication = appUrl;
                require([appUrl], function(Application) {
                    //judge if the previous requesting application is canceled.
                    if (this.requestingApplication === appUrl) {
                        if (this.currentApplication && Object.isFunction(this.currentApplication.destroy)) {
                            this.currentApplication.destroy();
                            this.currentApplication = null;
                        }
                        $("#user-content").empty();
                        cloud.util.unmask("#user-content");
                        if (Application) {
                            this.currentApplication = new Application({
                                container: "#user-content"
                            });
                            this.appNow = application;
                            msg && this.sendMsg(application.name, msg);
                        }
                    }else{
                        console.log("app ignored: " + appUrl)
                    }
                }.bind(this));
            }
        },
        _renderBtn: function(map) {
            var self = this;
            $("#payStyle").bind('change', function() {
            	 var payStyle = $("#payStyle").multiselect("getChecked").map(function() {//支付方式
                     var title;
                     if (this.title == "微信") {
                         title = "WECHAT";
                     } else if (this.title == "支付宝") {
                         title = "ALIPAY";
                     } else if (this.title == "百付宝") {
                         title = "BAIDU";
                     }else if (this.title == "翼支付") {
                         title = "BESTPAY";
                     }else if (this.title == "京东支付") {
                         title = "JDPAY";
                     }else if (this.title == "会员支付") {
                     	title = "VIPPAY";
                     }else if (this.title == "银联支付") {
                         title = "UNIONPAY";
                     }
                     var pay = title;
                     return pay;
                 }).get();
            	if(payStyle.indexOf("ALIPAY") == 0){
            		$("#store_id").css("display","block");
            	}else{
            		$("#store_id").css("display","none");
            	}
            	
            });
            //获取点位输入框事件并定位
            $("#siteId").bind('change', function() {
            	$("#siteId").css("border-color", "");
            	
                var siteId = $("#siteId").find("option:selected").val();
                var inpuValue = $("#siteId").find("option:selected").attr("loc");
                var lng = $("#siteId").find("option:selected").attr("lng");
                var lat = $("#siteId").find("option:selected").attr("lat");
                if (lng && lat) {
                    map.centerAndZoom(new BMap.Point(lng, lat), 16); //设置中心点
                    map.clearOverlays(); //清除
                    var new_point = new BMap.Point(lng, lat);
                    self.getCenter(map, new_point, inpuValue);
                    var marker = new BMap.Marker(new_point);       // 创建标注
                    map.addOverlay(marker);                        // 将标注添加到地图中
                    map.panTo(new_point);
                   // marker.enableDragging();  //可拖拽
                    //标注拖拽后的位置
                    //marker.addEventListener("dragend", function(e) {
//                                    $("#lng").val(e.point.lng);
//                                    $("#lat").val(e.point.lat);
                       // self.getCenter(map, e.point, '');
                    //});
                }
            });

            $("#lastBase").bind("click", function() {
            	
            	$("#cidConfig").css("display", "none");
                $("#baseInfo").css("display", "block");
                $("#tab1").addClass("active");
                $("#tab2").removeClass("active");
            	
            });
            //下一步
            $("#nextBase2").bind("click", function() {
            	//self.judgeGoodsConfig();
            	var assetId = $("#assetId").val();
            	
            	 var t = self.renderCidInfo();
                 if(t.cid == 1){
                 	dialog.render({lang:"cid_not_null"});
     				return;
                 }
                 if(t.scid == 1){
                 	dialog.render({lang: "cid_num_same"});
                 	return;
                 }
                 if(t.model == 1){
                 	dialog.render({lang: "model_not_null"});
                 	return;
                 }
                 Service.updateAutomat(self.deviceId, self.automatData, function(data) {
                     if (data.error_code == null) {
                         self.automatWindow.destroy();
                     } else if (data.error_code == "20007") {
                         dialog.render({lang: "automat_name_exists"});
                         return;
                     } else if (data.error_code == "20020") {//该点位已挂售货机
                         dialog.render({lang: "automat_point_linked"});
                         return;
                     }
                 }, self);
                 
            	
            	self.automatWindow.destroy();
            	
            	localStorage.setItem("shelf_manage_assetId",assetId);
            	
            	var obj={
            			name: "channel_manage", 
            			order: 0, 
            			defaultOpen: true,
            			defaultShow: true,
            			url: "../../../operation_manage/channelManageV2/channelManageMain.js"
            	};
            	self.loadApplication(obj);
            });
            
            $("#nextBase").bind("click", function() {
            	
            	self.renderMasterInfo();
            	
            });

            //保存
            $("#saveBase").bind("click", function() {
                
                self.renderUpdateMachine(true);
            });

        },
        //判断货柜展示情况
        renderShelfConfig:function(subdata){
        	 var self = this;
        	 
        	 cloud.Ajax.request({
                 url: "api/model/list",
                 type: "GET",
                 parameters:{
                 	cursor:0,
                 	limit:-1,
                 	modelIds:self.modelIdArr
                 },
                 success: function(data) {
                 	
                 	var modelMap = {};
                 	for(var i=0;i<data.result.length;i++){
                 		var ves = [];
                 		if(data.result[i].shelves && data.result[i].shelves.length>0){
                 			for(var k=0;k<data.result[i].shelves.length;k++){
                 				var shelves_1 = data.result[i].shelves[k];
                 				if(shelves_1.length>0){
                 					for(var x=0;x<shelves_1.length;x++){
                 						var sf = {};
                 						sf.location_id = shelves_1[x].shelvesId;
                 						sf.status = "1";
                 						ves.push(sf);
                 					}
                 				}
                 				
                 			}
                 			
                 		}
                 		modelMap[data.result[i]._id] = ves;
                 	}
                	
                	if(subdata.result.modelConfigsNew){
                		if(subdata.result.modelConfigsNew.masterTypeNew){
                			self.SelfConfig.setconfig(subdata.result.assetId,self.getMachineType(subdata.result.modelConfigsNew.masterTypeNew));
                		}
                		
                		if(self.automatData.modelConfigsNew.modelId == subdata.result.modelConfigsNew.modelId && subdata.result.goodsConfigsNew && subdata.result.goodsConfigsNew.length>0){
                			
                		}else{
                			subdata.result.goodsConfigsNew = modelMap[self.automatData.modelConfigsNew.modelId];
                		}
                		
                	}else{
                        if(self.automatData.modelConfigsNew){
                        	if(self.automatData.modelConfigsNew.masterTypeNew){
                        		self.SelfConfig.setconfig(subdata.result.assetId,self.getMachineType(self.automatData.modelConfigsNew.masterTypeNew));
                        	}
                        	
                        	subdata.result.goodsConfigsNew = modelMap[self.automatData.modelConfigsNew.modelId];
                		}
                        
                	}
                	
                	
                	var cf = [];
                	if(self.automatData.containersNew){
                		
                		var containers = subdata.result.containersNew;
        				var containersF = self.automatData.containersNew;
        				
        				
        				for(var j=0;j<containersF.length;j++){
        					
        					var modelIdF = containersF[j].modelId;
        					console.log(modelIdF);
        					
        					if(modelIdF != null){
        						containersF[j].shelves = modelMap[modelIdF];
        						if(containers!="undefined"&&containers!=null){
        							for(var h=0;h<containers.length;h++){
            							var modelId = containers[h].modelId;
            							if(modelId == modelIdF && containers[h].shelves.length>0){
            								containersF[j].shelves = containers[h].shelves;
            								break;
            							}
            							
            						}
        						}
        					
        					}
        					cf.push(containersF[j]);
        				}
        				subdata.result.containersNew = cf;
                	}else{
                		//删除有机型的挂载货柜
                		var containers = subdata.result.containersNew;
                		if(containers!="undefined"&&containers!=null){
                			var cf = [];
                    		for(var j=0;j<containers.length;j++){
                    			var modelId = containers[j].modelId;
                    			if(!modelId){
                    				cf.push(containers[j]);
                    			}
                    			
                    		}
                    		if(cf.length==0){
                    			cf=undefined;
                    		}
                    		subdata.result.containersNew = cf;
                		}
                		
                	}
                	
                     
                	self.SelfConfig.flag = true;
                	self.setSelfConfig(subdata);
                	self.renderUpdateMachine(false);
                 }
             });
        	
        	
        	
        	//self.SelfConfig.flag = true;
        	//self.setSelfConfig(data);
        	//self.renderUpdateMachine(false);
        	
        	
        	
        },
        judgeGoodsConfig: function(){
			var self = this;

            var goodflag = true;
            var containerflag = true;
            var s = self.renderCidInfo();
            if(s.cid == 1){
            	dialog.render({lang:"cid_not_null"});
				return;
            }
            if(s.scid == 1){
            	dialog.render({lang: "cid_num_same"});
            	return;
            }
            /*if(s.model == 1){
            	dialog.render({lang: "model_not_null"});
            	return;
            }*/
            Service.getAutomatById(self.deviceId, function(data) {
            	
            	
            	var goodsconfig = data.result.goodsConfigs;
    			if(goodsconfig){
    				if(data.result.goodsConfigsNew){
        				var goodsconfignew = data.result.goodsConfigsNew;
        				if(goodsconfig.length != goodsconfignew.length){              						
        					goodflag = false;
        				}else{
        					for(var i=0;i<goodsconfig.length;i++){
        						if(goodsconfignew[i].location_id != goodsconfig[i].location_id){
        							
        							goodflag = false;
        							break;
        						}
        						if(goodsconfignew[i].goods_id != goodsconfig[i].goods_id){
        							
        							goodflag = false;
        							break;
        						}
        						if(goodsconfignew[i].price != goodsconfig[i].price){
        							
        							goodflag = false;
        							break;
        						}
        						if(goodsconfignew[i].imagemd5 != goodsconfig[i].imagemd5){
        							
        							goodflag = false;
        							break;
        						}
        						
        					}
        				
        				if(data.result.containers){
        					var containerconfig = self.data.result.containers;
        					if(data.result.containersNew){
        						
        						var containerconfignew = data.result.containersNew;
        						if(containerconfig.length != containerconfignew.length){
        							containerflag = false;
        						}else{
        							for(var j=0;j<containerconfig.length;j++){
        								if(containerconfig[j].type != containerconfignew[j].type){
        									containerflag = false;
        								}
        								if(containerconfig[j].cid != containerconfignew[j].cid){
        									containerflag = false;
        								}else{
        									var cshelves = containerconfig[j].shelves;
        									var cshelvesnew = containerconfignew[j].shelves;
        									if(cshelves.length != cshelvesnew.length){
        										containerflag = false;
        									}else{
        										for(var n=0;n<cshelves.length;n++){
        											
        											if(cshelvesnew[n].location_id != cshelves[n].location_id){
        												
        												containerflag = false;
        		        								break;
        		        							}
        		        							if(cshelvesnew[n].goods_id != cshelves[n].goods_id){
        		        								
        		        								containerflag = false;
        		        								break;
        		        							}
        		        							if(cshelvesnew[n].price != cshelves[n].price){
        		        								
        		        								containerflag = false;
        		        								break;
        		        							}
        		        							if(cshelvesnew[n].imagemd5 != cshelves[n].imagemd5){
        		        								
        		        								containerflag = false;
        		        								break;
        		        							}
        											
        											
        										}
        										
        										
        									}
        									
        									
        								}
        								
        							}
        							
        						}											
        						
        					}else{
        						containerflag = false;
        						
        					}
        									
        				}
        				
        			  }
        			
        			}else{
        				
        				goodflag = false;
        			}
    				
    				
    			}
    			
    			
    			if(!goodflag || !containerflag){
    				
    				dialog.render({lang:"whether_to_synchronize",buttons: [{
    					lang: "affirm",
                        click: function() {

                        	var subdata = {};
                        	
                        	subdata.goodsConfigsNew = data.result.goodsConfigs;
                        	if(data.result.containers){
                        		subdata.containersNew = data.result.containers;
                        	}
                            Service.updateAutomat(self.deviceId, subdata, function(edata) {
                                if (edata.error_code == null && edata.result) {
                                	dialog.close();
                                	
                                	self.renderShelfConfig(edata);
                                	
                                	
                                } else{//
                                    dialog.render({lang: "synchronize_failed"});
                                    
                                    return;
                                }
                                
                            }, self);
                        	
                        }
    					
    				    },{
    					
    					 lang: "cancel",
                            click: function() {
                                dialog.close();
                                self.renderShelfConfig(data);
                            }
    				}]
    				});
            		    
    				
    			}else{
    				self.renderShelfConfig(data);
    			}
            	
            },self);
			
			
		},
		setSelfConfig: function(newdata){
			var self = this;
			//if (newdata.result.goodsConfigs) {
            	if(newdata.result.goodsConfigsNew){
            		 self.goodsConfigs = newdata.result.goodsConfigs;
            		// self.goodsConfigs = newdata.result.goodsConfigsNew;
                     self.SelfConfig.getTab(newdata.result.goodsConfigsNew);
            	}else{
            		 self.goodsConfigs = newdata.result.goodsConfigs;
                     self.SelfConfig.getTab(newdata.result.goodsConfigs);
            	}
               
            //}
            //if (newdata.result.containers) {//货柜
            	if(newdata.result.containersNew){
            		self.containers = newdata.result.containers;
            		//self.containers = newdata.result.containersNew;
                    self.SelfConfig.getOtherTab(newdata.result.containersNew);
            	}else{
            		self.containers = newdata.result.containers;
                    self.SelfConfig.getOtherTab(newdata.result.containers);
            	}
            	
           // }
			
		},
		renderMasterInfo:function(){
			var self = this;
			self.modelIdArr = [];
			
			var assetId = $("#assetId").val();//售货机编号
            var deviceName = $("#deviceName").val();//售货机名称
            var siteId = $("#siteId").val();//点位名称
            var siteName = $("#siteId").find("option:selected").text();//点位名称 
            var lng = $("#siteId").find("option:selected").attr("lng");
            var lat = $("#siteId").find("option:selected").attr("lat");
            var lineId = $("#siteId").find("option:selected").attr("lineId");//线路ID 
            var lineName = $("#siteId").find("option:selected").attr("lineName");//线路名称
            
            var venderNum = $("#automat_vender").val();
            var vender = $("#automat_vender").find("option:selected").text();
            
            var masterTypeNew = $("#automat_machineType").val();
            
            var modelId = $("#automat_model").val();
            var modelName = $("#automat_model").find("option:selected").text();
            
            var alipay_store_id = $("#alipay_store_id").val();
            
            
            if(assetId == null||assetId.replace(/(^\s*)|(\s*$)/g,"")==""){
				dialog.render({lang:"automat_no_not_exists"});
				return;
			}
            if (deviceName == null || deviceName.replace(/(^\s*)|(\s*$)/g,"")=="") {
                dialog.render({lang: "automat_name_not_exists"});
                return;
            }
            
            /*if(modelId == 0 && self.data.result.modelConfigsNew!=null){
            	dialog.render({lang: "model_not_null"});
                return;
            }*/
            
            if (siteName == null || siteName.replace(/(^\s*)|(\s*$)/g,"")=="") {
            	
            	$("#siteId").css("border-color","red");
                dialog.render({lang: "automat_enter_name"});
                return;
            }
            if (lng == null || lng == "" || lat == null || lat == "") {
                dialog.render({lang: "points_not_null"});
                return;
            }
            var payStyle = $("#payStyle").multiselect("getChecked").map(function() {//支付方式
                var title;
                if (this.title == "微信") {
                    title = "WECHAT";
                } else if (this.title == "支付宝") {
                    title = "ALIPAY";
                } else if (this.title == "百付宝") {
                    title = "BAIDU";
                }else if (this.title == "翼支付") {
                    title = "BESTPAY";
                }else if (this.title == "京东支付") {
                    title = "JDPAY";
                }else if (this.title == "会员支付") {
                	title = "VIPPAY";
                }else if (this.title == "银联支付") {
                    title = "UNIONPAY";
                }
                var pay = {
                    payId: this.value,
                    payName: title
                };
                return pay;
            }).get();
            //添加点位 
            var data = {};
            var location = {};
            location.longitude = lng;
            location.latitude = lat;
            location.region = "";
            data.location = location;//经纬度 
            
            data.siteId = siteId;
            data.siteName = siteName;//点位名称
            
            var modelConfigsNew = {};
            var config = {};
            if(modelId != 0){
            	self.modelIdArr.push(modelId);
            	modelConfigsNew.modelId = modelId;
                modelConfigsNew.modelName = modelName;
                
                modelConfigsNew.masterTypeNew = masterTypeNew;
                modelConfigsNew.vender = vender;
                modelConfigsNew.venderNum = venderNum;
                
                data.modelConfigsNew = modelConfigsNew;
                if(self.data && self.data.result && self.data.result.config){
                	config = self.data.result.config;
                }
                config.vender = venderNum;
                data.config = config;
                data.masterType = masterTypeNew;
            }else{
            	 self.modelIdArr.push(null);
            	 //data.modelConfigsNew = {};
            }
            

            if (lineId && lineId!="undefined") { 
                data.lineId = lineId;
            }
            if (lineName && lineName!="undefined") {
                data.lineName = lineName;
            } 
            
            
            data.payConfig = payStyle;
            data.name = deviceName;
            
            data.assetId = assetId;  
            data.alipay_store_id = alipay_store_id;
            
            $("#nextBase2").css("display","block");

            self.automatData = data;
            console.log(self.automatData);
            //
            $("#cidConfig").css("display", "block");
            $("#baseInfo").css("display", "none");
            $("#tab1").removeClass("active");
            $("#tab2").addClass("active");
            
			
		},
		renderCidInfo:function(){
			var self = this;
            var cidArr = [];
            var ContainerDto = [];
            var flag = {};
            flag.cid = 0;
            flag.scid = 0;
            flag.model = 0;
            $(".cidinfo").each(function(){
            	
            	var container = {};
            	
            	var id = $(this).attr('id');

            	var cid = $("#"+id+"_assetId").val();//货柜编号
            	
            	var venderNum = $("#"+id+"_vender").val();
                var vender = $("#"+id+"_vender").find("option:selected").text();
                
                var type = $("#"+id+"_machineType").val();
            	
            	
            	var modelId = $("#"+id+"_model").val();
                var modelName = $("#"+id+"_model").find("option:selected").text();                
                
                if(cid == null||cid.replace(/(^\s*)|(\s*$)/g,"")==""){
                	flag.cid = 1;
    				
    			}
                //货柜编号不能相同
                if($.inArray(cid,cidArr) > -1){
                	flag.scid = 1;
                }
                
                cidArr.push(cid);
                //新增加的机器不能为空，旧版本可以
                if(modelId == 0 && self.data.result.modelConfigsNew!=null){
                	flag.model = 1;
                }
                
                if(modelId != 0){
                	container.cid = cid;
                    
                	container.modelId = modelId;
                    container.modelName = modelName;
                    
                    container.type = type;
                    container.vender = vender;
                    container.venderNum = venderNum;
                    
                    ContainerDto.push(container);
                	
                    self.modelIdArr.push(modelId);
                }else{
                	self.modelIdArr.push(null);
                }
                
            });
            if(ContainerDto.length>0){
            	self.automatData.containersNew = ContainerDto;
            }else{
            	self.automatData.containersNew = undefined;
            }
            return flag;

		},
        renderUpdateMachine: function(flag) {
            var self = this;

            var t = self.renderCidInfo();
            if(t.cid == 1){
            	dialog.render({lang:"cid_not_null"});
				return;
            }
            if(t.scid == 1){
            	dialog.render({lang: "cid_num_same"});
            	return;
            }
            if(t.model == 1){
            	dialog.render({lang: "model_not_null"});
            	return;
            }
            self.renderUpdate(flag, self.automatData);
            
        },
        renderUpdate: function(flag, subdata) {
            var self = this;
            var goodsConfigs = self.goodsConfigs;
            //修改售货机
            subdata.goodsConfigs = goodsConfigs;
            subdata.containers = self.containers;
         
                    if (flag) {//点击“保存"按钮
                        cloud.util.mask("#baseInfo");
                        Service.updateAutomat(self.deviceId, subdata, function(data) {
                            if (data.error_code == null) {
                                self.automatWindow.destroy();
                                self.fire("getDeviceList");
                                dialog.render({lang: "automat_goods_model_update_success"});
                            } else if (data.error_code == "20007") {
                                dialog.render({lang: "automat_name_exists"});
                                return;
                            } else if (data.error_code == "20020") {//该点位已挂售货机
                                dialog.render({lang: "automat_point_linked"});
                                return;
                            }
                            cloud.util.unmask("#baseInfo");
                        }, self);
                    } else {
                        var siteNameOld= $("#siteNameOld").val();

                    	if(subdata.siteName == siteNameOld){
                    	    $("#selfConfig").css("display", "block");
                    	    $("#cidConfig").css("display", "none");
                    		$("#tab2").removeClass("active");
                    	    $("#tab3").addClass("active");
                    		 
                    	     subdata._id = self.deviceId;
                    		 self.SelfConfig.getData(subdata);
                    		 subdata._id = self.deviceId;
                    		 self.SelfConfig.getData(subdata);
                    		}else{
                    			Service.getSiteByNameFormDeviceList(subdata.siteName, function(data) {
                    				 if (data.result) {
                    				     dialog.render({lang: "automat_point_linked"});
                    				     return;
                    			     } else {
                    				     $("#selfConfig").css("display", "block");
                    				     $("#cidConfig").css("display", "none");
                    				     $("#tab2").removeClass("active");
                    				     $("#tab3").addClass("active");
                    				
                    				     subdata._id = self.deviceId;
                    				     self.SelfConfig.getData(subdata);
                    				  }
                    			 });
                    		}
                    }  
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
