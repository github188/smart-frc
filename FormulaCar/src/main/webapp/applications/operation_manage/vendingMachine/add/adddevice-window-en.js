define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./addDevice_en.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../service");
    var gmap = require("../map/map");
    require("../add/css/default.css");
    require("../add/js/scrollable");
    var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
    var eurl;
	if(oid == '0000000000000000000abcde'){
	     eurl = "mapi";
	}else{
	     eurl = "api";
	}
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this._renderWindow();
            this.data = {};
            this.modelListData = [];
            this.cidCount = 0;
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            var title = locale.get({lang: "add_new_automat"});

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
            //
            $("#nextBase").val(locale.get({lang: "next_step"}));
            $("#lastBase").val(locale.get({lang: "price_step"}));
            $("#nextBase2").width(150);
            $("#saveBase2").val(locale.get({lang: "material_configuration"}))
            $("#addCid").val(locale.get({lang: "add_cid"}));

            $("#saveBase").val(locale.get({lang: "save"}));
            
            this._renderMap();//加载点位地图
            this.uploadButton=new Button({
                container:$("#select_file_button"),
                text:locale.get("upload_files"),
                lang : "{title:select_file,text:select_file}"
            });
            this.initUploader();
            this.renderCidBtn();
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
                                        "<td><input type='text' class='input' id='cid"+self.cidCount+"_assetId' name='cid"+self.cidCount+"_assetId' style='width:200px;height:30px;'/></td>"+
                                    "</tr>"+
                                    "<tr>"+
                                    "<td width='30%'><label style='color:red;'></label><label><span lang='text:device_shelf_number'>"+locale.get({lang: "vmc_cabinat_num"})+"</span></label></td>"+
                                    "<td><input type='text' class='input' id='cid"+self.cidCount+"_vmcNum' name='cid"+self.cidCount+"_vmcNum' style='width:200px;height:30px;'/></td>"+
                                    "</tr>"+
                                    "<tr height='45px'>"+
                                    "<td width='30%'><label style='color:red;'></label><label><span lang='text:vender'>"+locale.get({lang: "plug_in"})+"</span></label></td>"+
                                    "<td><select class='automat-info-select' id='cid"+self.cidCount+"_plugIn' style='width:200px;border-radius: 4px;height: 35px;'>" +
                                    		"<option value='1'>"+locale.get({lang: "yesText"})+"</option>" +
                                    		"<option value='0'>"+locale.get({lang: "noText"})+"</option>" +
                                    		"</select></td>"+
                                        
                                    "</tr>"+
                                    "<tr height='45px'>"+
                                    "<td width='30%'><label style='color:red;'></label><label><span lang='text:vender'>"+locale.get({lang: "serial"})+"</span></label></td>"+
                                    "<td><select class='automat-info-select' id='cid"+self.cidCount+"_serial' style='width:200px;border-radius: 4px;height: 35px;'>" +
                                            "<option value='ttyO3'>ttyO3</option>" +
                            		        "<option value='ttyO4'>ttyO4</option>" +
                            		        "<option value='ttyO5'>ttyO5</option>" +
                                    		"<option value='ttyO6'>ttyO6</option>" +
                                    		"<option value='ttyO7'>ttyO7</option>" +
                                    		"</select></td>"+
                                        
                                    "</tr>"+
                                    "<tr height='45px'>"+
                                    "<td width='30%'><label style='color:red;'></label><label><span lang='text:vender'>"+locale.get({lang: "vender"})+"</span></label></td>"+
                                    "<td><select class='automat-info-select' id='cid"+self.cidCount+"_vender' style='width:200px;border-radius: 4px;height: 35px;'></select></td>"+
                                    
                                "</tr>"+
                                "<tr height='45px'>"+
                                    "<td width='30%'><label style='color:red;'></label><label><span lang='text:automat_vendor_type'>"+locale.get({lang: "automat_vendor_type"})+"</span></label></td>"+
                                    "<td><select class='automat-info-select' id='cid"+self.cidCount+"_machineType' style='width:200px;border-radius: 4px;height: 35px;'></select></td>"+
                                    
                                "</tr>"+
                                    "<tr height='45px'>"+
                                        "<td width='30%'><label style='color:red;'></label><label><span lang='text:model'>"+locale.get({lang: "model"})+"</span></label></td>"+
                                        "<td><select class='automat-info-select' id='cid"+self.cidCount+"_model' style='width:200px;border-radius: 4px;height: 35px;'></select></td>"+
                                    "</tr>"+
            	                    "<tr height='45px'>"+
            	                        "<td width='30%'><label style='color:red;'></label><label><span lang='text:upload_model_files'>"+locale.get({lang: "upload_model_files"})+"</span></label></td>"+
            	                        "<td><span id='cid"+self.cidCount+"_select_file_button'></span><span id='cid"+self.cidCount+"_fileName' title='' style='white-space: nowrap;text-overflow: ellipsis;overflow: hidden;width: 120px;display: inline-block;line-height: 22px;position: relative;top: 6px;'></span><input type='hidden' id='cid"+self.cidCount+"_fileId' name='cid"+self.cidCount+"_fileId' /></td>"+
            	                    "</tr>" +
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
                    		var language = locale._getStorageLang();
                    		
                    		
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
                    			
                    			for(var l=0;l<types.length;l++){	
                        		   	 if(language!="en"){

                            			$("#cid"+e.data.count+"_machineType").append("<option value='"+types[l].type+"'>"+types[l].typeName+"</option>");
                            			
                    				}else{
                    					if (types[l].type=="1") {
                    						$("#cid"+e.data.count+"_machineType").append("<option value='"+types[l].type+"'>Beverage machine</option>");
											
										}else if(types[l].type=="2"){
											$("#cid"+e.data.count+"_machineType").append("<option value='"+types[l].type+"'>Snack machine</option>");
										}
                    					
                    				}
                        		}
                    			
                    			$("#cid"+e.data.count+"_machineType").bind("change",{count:e.data.count,vender:vender},function(a){
                    				
                            		$("#cid"+a.data.count+"_model").empty();
                            		$("#cid"+a.data.count+"_model").append("<option value='0'>-------"+locale.get({lang: "please_select_model"})+"-------</option>");
            						var machineType = $(this).children('option:selected').val();
            						
            						var models = self.modelMap[a.data.vender+"@"+machineType];
            						for(var n=0;n<models.length;n++){
                            			
                            			$("#cid"+a.data.count+"_model").append("<option value='"+models[n].modelId+"'>"+models[n].modelName+"</option>");
                            			
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
                            
                            self.initCidUploader(self.cidCount);
                            
                            
                    	});
                		
                		
                	}
                	
                }
        	})
        },

        initCidUploader:function(count){
            var self=this;
            var button = "uploadButton"+count;
            var uploader = "uploader"+count;
            this.button=new Button({
                container:$("#cid"+count+"_select_file_button"),
                text:locale.get("upload_files"),
                lang : "{title:select_file,text:select_file}"
            });
            
            this.uploader = new Uploader({
                browseElement: $("#cid"+count+"_select_file_button"),
                url: "/mapi/file",
                autoUpload: true,
                filters: [{
                    title: "Image files or compress package",
                    extensions: "jpg,gif,png,zip,rar,7z,tar,gz"
                }],
                maxFileSize: "100mb",
                events: {
                	"onError": function(err){

					},
					"onFilesAdded" : function(file){

						var name=file[0].name;
						$("#cid"+count+"_fileName").text(name);
						$("#cid"+count+"_fileName").attr("title",name);
					},
                    "onFileUploaded": function(response, file){
                    	if ($.isPlainObject(response)){
                    		if(response.error){
                    			dialog.render({lang:"upload_files_failed"});
							}else{
								
								var src= cloud.config.FILE_SERVER_URL + "/mapi/file/" +response.result._id + "?access_token=" + cloud.Ajax.getAccessToken();
		                        $("#cid"+count+"_fileId").val(response.result._id);
		                        
							}
                    	}

                    },
                    "beforeFileUpload":function(){

					}
                }
            });
        },
        initUploader:function(){
            var self=this;
            this.uploader = new Uploader({
                browseElement: $("#select_file_button"),
                url: "/mapi/file",
                autoUpload: true,
                filters: [{
                    title: "Image files or compress package",
                    extensions: "jpg,gif,png,zip,rar,7z,tar,gz"
                }],
                maxFileSize: "100mb",
                events: {
                	"onError": function(err){

					},
					"onFilesAdded" : function(file){

						var name=file[0].name;
						$("#fileName").text(name);
						$("#fileName").attr("title",name);
					},
                    "onFileUploaded": function(response, file){
                    	if ($.isPlainObject(response)){
                    		if(response.error){
                    			dialog.render({lang:"upload_files_failed"});
							}else{
								
								var src= cloud.config.FILE_SERVER_URL + "/mapi/file/" +response.result._id + "?access_token=" + cloud.Ajax.getAccessToken();
		                        $("#fileId").val(response.result._id);
		                        
							}
                    	}

                    },
                    "beforeFileUpload":function(){

					}
                }
            });
        },
        getAllSite: function(siteId, map) {
            var self = this;
            if(siteId){
            	Service.getSiteById(siteId,function(data){
                	
                	$("#siteId").append("<option value='" + data.result._id + "' selected='selected' lineId='" + data.result.lineId + "' lineName='" + data.result.lineName + "' loc='" + data.result.address + "' lat='" + data.result.location.latitude + "' lng='" + data.result.location.longitude + "' >" + data.result.name + "</option>");
                	var loc = data.result.address;
                    var lng = data.result.location.longitude;
                    var lat = data.result.location.latitude;
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
                 }, self); 
	                 
       	    });
            
        },
        getAllModel: function() {
            var self = this;
            
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
                		
                		console.log(data);
                		self.modelListData = data.result;
                		$("#automat_vender").empty();
                		$("#automat_vender").append("<option value='0'>-------"+locale.get({lang: "please_select_vender"})+"-------</option>");
                		$("#automat_machineType").empty();
                		$("#automat_machineType").append("<option value='0'>-------"+locale.get({lang: "please_select_machinetype"})+"-------</option>");
                		$("#automat_model").empty();
                		$("#automat_model").append("<option value='0'>-------"+locale.get({lang: "please_select_model"})+"-------</option>");
                		
                		var language = locale._getStorageLang();
                		for(var key in self.venderMap){
                			var number = key.split('@')[1];
                			var ven = key.split('@')[0];
                		    $("#automat_vender").append("<option value='"+number+"'>"+ven+"</option>");
                			
                		}
                		$("#automat_vender").bind("change",function(){
                			
                			$("#automat_machineType").empty();
                    		$("#automat_machineType").append("<option value='0'>-------"+locale.get({lang: "please_select_machinetype"})+"-------</option>");
                    		$("#automat_model").empty();
                    		$("#automat_model").append("<option value='0'>-------"+locale.get({lang: "please_select_model"})+"-------</option>");
                			
                			var num = $(this).children('option:selected').val();
                			vender = $(this).children('option:selected').text();
                			
                			var types = self.venderMap[vender+"@"+num];
                			
                			for(var l=0;l<types.length;l++){
                    			if(language!="en"){

                					$("#automat_machineType").append("<option value='"+types[l].type+"'>"+types[l].typeName+"</option>");
                        			
                				}else{
                					if (types[l].type=="1") {
                						$("#automat_machineType").append("<option value='"+types[l].type+"'>Beverage machine</option>");
										
									}else if(types[l].type=="2"){
										$("#automat_machineType").append("<option value='"+types[l].type+"'>Snack machine</option>");
									}
                					
                				}
                    			//$("#automat_machineType").append("<option value='"+types[l].type+"'>"+types[l].typeName+"</option>");
                    			
                    		}
                			
                			$("#automat_machineType").bind("change",{vender:vender},function(a){
                				
                        		$("#automat_model").empty();
                        		$("#automat_model").append("<option value='0'>-------"+locale.get({lang: "please_select_model"})+"-------</option>");
        						var machineType = $(this).children('option:selected').val();
        						
        						var models = self.modelMap[vender+"@"+machineType];
        						for(var n=0;n<models.length;n++){
                        			
                        			$("#automat_model").append("<option value='"+models[n].modelId+"'>"+models[n].modelName+"</option>");
                        			
                        		}
        						
        						
        					});
                			
                			
                			
                		});
                		
                		
                		
                	}
                    
                }
            });           
            
        },
        loadDeviceData: function(map) {
            var self = this;
            	
            $("#assetId").removeAttr("disabled");
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
                }, self);
	    		self.getAllSite("", map);
	    		self.getAllModel();
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
            this.map = new gmap.Map({
				selector : this.element.find("#container")
			});
            
            this._renderBtn(this.map);//各个按钮事件
            this.loadDeviceData(this.map);//获取该售货机的基本信息
            
        },
        getAddressBylonlat:function(event){//根据经纬度获取地址信息
			var self = this;
			var geocoder = new google.maps.Geocoder();
		    geocoder.geocode({location: new google.maps.LatLng(event.lonLat.lat, event.lonLat.lon)}, function geoResults(result, status) {
			    if (status == google.maps.GeocoderStatus.OK) {
			    	  var pos = "";
			          pos = result[0].formatted_address;
			          $("#suggestId").val(pos);
			          
			          self.bubble.open(self.map,self.marker);
			          
			          document.getElementById("info-serial-deviceType").innerHTML= pos ;
			          
				}else{
					 
			    }
	        });
		},
        _renderBtn: function(map) {
            var self = this;
            //获取点位输入框事件并定位
            $("#siteId").bind('change', function() {
            	$("#siteId").css("border-color", "");
            	
                var siteId = $("#siteId").find("option:selected").val();
                var inpuValue = $("#siteId").find("option:selected").attr("loc");
                var lng = $("#siteId").find("option:selected").attr("lng");
                var lat = $("#siteId").find("option:selected").attr("lat");
               // var location = newdata.results[0].geometry.location;
				 
				  if(lng && lat){
					  $("#lng").val(lng);
					  $("#lat").val(lat);
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
            });
           
            $("#lastBase").bind("click", function() {
            	
            	$("#cidConfig").css("display", "none");
                $("#baseInfo").css("display", "block");
                $("#tab1").addClass("active");
                $("#tab2").removeClass("active");
            	
            });
            
            $("#nextBase").bind("click", function() {
            	
            	self.renderMasterInfo();
            	
            });
            //货道配置
            $("#saveBase2").bind("click", function() {
            	var assetId = $("#assetId").val();
            	self.renderUpdateMachine();
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
            })
            //保存
            $("#saveBase").bind("click", function() {
                var flag = true;
                self.renderUpdateMachine();
            });

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
		//主柜
		renderMasterInfo:function(){
			var self = this;

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
            
            var modelPicId = $("#fileId").val();
            var modelPicName = $("#fileName").text();
            
            if(assetId == null||assetId.replace(/(^\s*)|(\s*$)/g,"")==""){
				dialog.render({lang:"automat_no_not_exists"});
				return;
			}
            if (deviceName == null || deviceName.replace(/(^\s*)|(\s*$)/g,"")=="") {
                dialog.render({lang: "automat_name_not_exists"});
                return;
            }
            
            if(modelId == 0 && (modelPicId == null || modelPicId.replace(/(^\s*)|(\s*$)/g,"")=="")){
            	dialog.render({lang: "model_not_exists"});
                return;
            }
            
            if (siteName == null || siteName.replace(/(^\s*)|(\s*$)/g,"")=="") {
            	
            	$("#siteId").css("border-color","red");
                dialog.render({lang: "automat_enter_name"});
                return;
            }
            if (lng == null || lng == "" || lat == null || lat == ""||lng=="undefined"||lat=="undefined") {
                dialog.render({lang: "points_not_null"});
                return;
            }
            var payStyle = $("#payStyle").multiselect("getChecked").map(function() {//支付方式
                var title;
                if (this.title == "WeChat") {
                    title = "WECHAT";
                } else if (this.title == "Alipay") {
                	title = "ALIPAY";
                } else if (this.title == "Baidu Wallet") {
                	title = "BAIDU";
                }else if (this.title == "Best Pay") {
                	title = "BESTPAY";
                }else if (this.title == "JD Pay") {
                	title = "JDPAY";
                }else if (this.title == "Vip Pay") {
                	title = "VIPPAY";
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
            
           
            if(modelId == 0 || modelId == "0"){
            	modelConfigsNew.modelPicId = modelPicId;
            	modelConfigsNew.modelPicName = modelPicName;
            }else{
            	modelConfigsNew.modelId = modelId;
                modelConfigsNew.modelName = modelName;
                modelConfigsNew.masterTypeNew = masterTypeNew;
                modelConfigsNew.vender = vender;
                modelConfigsNew.venderNum = venderNum;
                data.config = {
                    	vender:	vender
                };
                data.masterType = masterTypeNew;
            }
            
            
            data.modelConfigsNew = modelConfigsNew;
            
            
            if (lineId && lineId!="undefined") { 
                data.lineId = lineId;
            }
            if (lineName && lineName!="undefined") {
                data.lineName = lineName;
            } 
            
            
            data.payConfig = payStyle;
            data.name = deviceName;
            
            data.assetId = assetId;
            
            self.automatData = data;
            //根据机型确定goodsConfigsNew
            Service.getModelByModelId(eurl,modelId, function(data) {
            	console.log(data);
            	if(data.result && data.result.shelves){
            		if(data.result.shelves.length>0){
            			var goodsConfigsNew = [];
            			for(var i=0;i<data.result.shelves.length;i++){
            				if(data.result.shelves[i].length>0){
            					for(var j=0;j<data.result.shelves[i].length;j++){
            						var shelves={
            								location_id:data.result.shelves[i][j].shelvesId,
            								status:1
            						};
            						goodsConfigsNew.push(shelves);
            					}
            				}
            			}
            			console.log(goodsConfigsNew);
            			self.automatData.goodsConfigsNew = goodsConfigsNew;
            			self.automatData.goodsConfigs = goodsConfigsNew;
            		}
            	}
            });
            
            
            //
            $("#cidConfig").css("display", "block");
            $("#baseInfo").css("display", "none");
            $("#tab1").removeClass("active");
            $("#tab2").addClass("active");
            
			
		},
		
        renderUpdateMachine: function() {
            var self = this;

            console.log(self.automatData);
            
            var cidArr = [];
            
            var ContainerDto = [];
            
            
            $(".cidinfo").each(function(){
            	
            	var container = {};
            	
            	var id = $(this).attr('id');

            	var cid = $("#"+id+"_assetId").val();//货柜编号
            	
            	var venderNum = $("#"+id+"_vender").val();
                var vender = $("#"+id+"_vender").find("option:selected").text();
                
                var type = $("#"+id+"_machineType").val();
            	
            	
            	var modelId = $("#"+id+"_model").val();
                var modelName = $("#"+id+"_model").find("option:selected").text();
                
                var modelPicId = $("#"+id+"_fileId").val();
                var modelPicName = $("#"+id+"_fileName").text();
                
                var vmcNum = $("#"+id+"_vmcNum").val();
                var serial = $("#"+id+"_serial").find("option:selected").val();
                var plugIn = $("#"+id+"_plugIn").find("option:selected").val();
                if(cid == null||cid.replace(/(^\s*)|(\s*$)/g,"")==""){
    				dialog.render({lang:"cid_not_null"});
    				return;
    			}
                //货柜编号不能相同
                if($.inArray(cid,cidArr) > -1){
                	dialog.render({lang: "cid_num_same"});
                    return;
                }
                
                cidArr.push(cid);
                
                if(modelId == 0 && (modelPicId == null || modelPicId.replace(/(^\s*)|(\s*$)/g,"")=="")){
                	dialog.render({lang: "model_not_exists"});
                    return;
                }
                
                container.cid = cid;
                
                container.serial = serial;
                container.vmcNum = vmcNum;
                container.plugIn = plugIn;
                if(modelId == 0 || modelId == "0"){
                	container.modelPicId = modelPicId;
                    container.modelPicName = modelPicName;
                }else{
                	container.modelId = modelId;
                    container.modelName = modelName;
                    container.type = type;
                    container.vender = vender;
                    container.venderNum = venderNum;
                }
                Service.getModelByModelId(eurl,modelId, function(data) {
                	console.log(data);
                	if(data.result && data.result.shelves){
                		if(data.result.shelves.length>0){
                			var containersNew = [];
                			for(var i=0;i<data.result.shelves.length;i++){
                				if(data.result.shelves[i].length>0){
                					for(var j=0;j<data.result.shelves[i].length;j++){
                						var shelves={
                								location_id:data.result.shelves[i][j].shelvesId,
                								status:1
                						};
                						containersNew.push(shelves);
                					}
                				}
                			}
                			container.shelves = containersNew;
                		}
                	}
                });
                ContainerDto.push(container);
            	
            });
            if (ContainerDto.length>0) {
                  self.automatData.containersNew = ContainerDto;
            }
          
            
            var cpemail = cloud.storage.sessionStorage("accountInfo").split(",")[2].split(":")[1];
            var createPerson = cloud.storage.sessionStorage("accountInfo").split(",")[5].split(":")[1];
            self.automatData.cpemail = cpemail;
            self.automatData.createPerson = createPerson;
            
            console.log(self.automatData);
            self.renderAdd(self.automatData);

        },
        renderAdd: function(subData) {
            var self = this;
                       
            //判断该点位下是否挂有售货机
            Service.getSiteByNameFormDeviceList(subData.siteName, function(data) {
            	           	
                if (data.result) {//该点位已挂售货机
                    dialog.render({lang: "automat_point_linked"});
                    return;
                } else {//该点位没有挂售货机
                        //添加售货机
                        Service.addAutomatDevice(subData, function(data) {
                            if (data.error_code == null) {
                                cloud.util.unmask("#baseInfo");
                                self.automatWindow.destroy();
                                self.fire("getDeviceList");
                            } else if (data.error_code == "21322") {//售货机名称已存在
                                dialog.render({lang: "automat_name_exists"});
                                return;
                            } else if (data.error_code == "70002") {//售货机编号已存在
                                dialog.render({lang: "automat_goods_model_assertid_exists"});
                                return;
                            }
                        }, self);
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
