define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./updateUpgrade.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../../service");
    var DeviceList = require("./deviceList/list");
    var UploadFile  = require("./uploadFile/uploadFile-window");
	require("./css/default.css");
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
            this.adId = options.adId;
            this._renderWindow();
            this.data = null;
            this.appList = [];
            this.firmwareList = [];
            this.deviceLists = [];
            this.vmcList = [];
            this.vender = null;
            this.deviceIds = [];
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: locale.get({lang: "upgrade"}),
                top: "center",
                left: "center",
                height: 600,
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
            $("#ui-window-content").css("overflow", "hidden");
            $("#deviceList").css("display", "none");
            $("#upload").val(locale.get({lang: "add_menu"}));
            $("#nextBase").val(locale.get({lang: "next_step"}));
            $("#lastBase").val(locale.get({lang: "price_step"}));
            $("#saveBase").val(locale.get({lang: "save"}));
            $("#nowBase").val(locale.get({lang: "immediate_upgrade"}));
            $("#comBase").val(locale.get({lang: "temporary_storage"}));
            var language = locale._getStorageLang();
            if(language =='en'){
            	this._renderGetVender();
            }else{
            	 var currentHost=window.location.hostname;
             	if(currentHost == "longyuniot.com"){
             		$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
             		$("#vender").append("<option value='aucma'>"+locale.get({lang: "vender_name_aucma"})+"</option>");
                 }else if(currentHost == "www.dfbs-vm.com"){
                 	$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
                 	$("#vender").append("<option value='fuji'>"+locale.get({lang: "vender_name_fuji"})+"</option>");
                 }else {
                 	$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
                 	$("#vender").append("<option value='aucma'>"+locale.get({lang: "vender_name_aucma"})+"</option>");
                 	$("#vender").append("<option value='fuji'>"+locale.get({lang: "vender_name_fuji"})+"</option>");
                 	$("#vender").append("<option value='easy_touch'>"+locale.get({lang: "vender_name_easy_touch"})+"</option>");
                 	$("#vender").append("<option value='junpeng'>"+locale.get({lang: "vender_name_junpeng"})+"</option>");
                 	$("#vender").append("<option value='baixue'>"+locale.get({lang: "vender_name_baixue"})+"</option>");
                 	$("#vender").append("<option value='leiyunfeng'>"+locale.get({lang: "leiyunfeng"})+"</option>");
                 }
                 
            }
           
            this._renderBtn();
            if(this.adId){
            	this.getData();
            }
        },
        getData:function(){
        	var self = this;
        	Service.getGradeById(self.adId,function(data){
    			$("#upgradeName").val(data.result.upgradeName==null?"":data.result.upgradeName);
        	    $("#content_desc").val(data.result.content_desc==null?"":data.result.content_desc);
    			$("#upgradeType option[value='"+data.result.upgradeType+"']").attr("selected","selected");
    			
    			$("#vender option[value='"+data.result.vender+"']").attr("selected","selected");
    			
    			$("#editConfig").html('');
    			
    			if(data.result.upgradeType == 1){//app升级
    				var mediaList = data.result.appList;
    				if(mediaList && mediaList.length > 0){
        				for(var i=0;i<mediaList.length;i++){
        					 var firemwareName = mediaList[i].appName;
        					 var FileId = mediaList[i].appFileId;
        					 var md5 = mediaList[i].md5;
        					 var length = mediaList[i].length;
        					 if(length == null){
        						 length = "";
        					 }
        					 var fileName = mediaList[i].fileName;
                    		 $("#editConfig").append("<tr id='"+FileId+"'>"
              						+"<td class='channelTable'>"
              						+  "<label id='"+firemwareName+":"+FileId+"'  name='"+firemwareName+"_"+FileId+"'>"+firemwareName+"</label>"
              						+"</td>"
              						+"<td class='channelTable'>"
              						+  "<label id='"+md5+":"+fileName+":"+length+"'  name='"+md5+"_"+fileName+"_"+length+"'>"+fileName+"</label>"
              						+"</td>"
              						+"<td class='channelTable'><span id='delete_"+FileId+"' name='"+FileId+"' class='delcls' style='cursor: pointer;'>删除</span></td>"
              						+"</tr>");
                     		 $(".delcls").bind('click',{fileId:FileId},function(e){
                     			$(this).parent().parent().remove();
             					 
             			     });
        				}
        			}
    			}else if(data.result.upgradeType == 2){//固件升级
    				var mediaList = data.result.firmwareList;
    				if(mediaList && mediaList.length > 0){
        				for(var i=0;i<mediaList.length;i++){
        					 var firemwareName = mediaList[i].firemwareName;
        					 var FileId = mediaList[i].firmwareFileId;
        					 var md5 = mediaList[i].md5;
        					 var fileName = mediaList[i].fileName;
        					 var length = mediaList[i].length;
        					 if(length == null){
        						 length = "";
        					 }
                    		 $("#editConfig").append("<tr id='"+FileId+"'>"
              						+"<td class='channelTable'>"
              						+  "<label id='"+firemwareName+":"+FileId+"'  name='"+firemwareName+"_"+FileId+"'>"+firemwareName+"</label>"
              						+"</td>"
              						+"<td class='channelTable'>"
              						+  "<label id='"+md5+":"+fileName+":"+length+"'  name='"+md5+"_"+fileName+"_"+length+"'>"+fileName+"</label>"
              						+"</td>"
              						+"<td class='channelTable'><span id='delete_"+FileId+"' name='"+FileId+"' class='delcls' style='cursor: pointer;'>删除</span></td>"
              						+"</tr>");
                    		 $(".delcls").bind('click',{fileId:FileId},function(e){
                    			 $(this).parent().parent().remove();
             					 
             			     });
        				}
        			}
    			}else if(data.result.upgradeType == 3){//vmc升级
    				var mediaList = data.result.vmcList;
    				if(mediaList && mediaList.length > 0){
        				for(var i=0;i<mediaList.length;i++){
        					 var vmcName = mediaList[i].vmcName;
        					 var FileId = mediaList[i].vmcFileId;
        					 var md5 = mediaList[i].md5;
        					 var fileName = mediaList[i].fileName;
        					 var length = mediaList[i].length;
        					 if(length == null){
        						 length = "";
        					 }
                    		 $("#editConfig").append("<tr id='"+FileId+"'>"
              						+"<td class='channelTable'>"
              						+  "<label id='"+vmcName+":"+FileId+"'  name='"+vmcName+"_"+FileId+"'>"+vmcName+"</label>"
              						+"</td>"
              						+"<td class='channelTable'>"
              						+  "<label id='"+md5+":"+fileName+":"+length+"'  name='"+md5+"_"+fileName+"_"+length+"'>"+fileName+"</label>"
              						+"</td>"
              						+"<td class='channelTable'><span id='delete_"+FileId+"' name='"+FileId+"' class='delcls' style='cursor: pointer;'>删除</span></td>"
              						+"</tr>");
                    		 $(".delcls").bind('click',{fileId:FileId},function(e){
                    			 $(this).parent().parent().remove();
             					 
             			     });
        				}
        			}
    			}
    			
    			var alldeviceLists = data.result.deviceList;
    			if(alldeviceLists && alldeviceLists.length > 0){
    				for(var i=0;i<alldeviceLists.length;i++){
    					var id = alldeviceLists[i].deviceId;
    					self.deviceIds.push(id);
    				}
    			}
    			self.deviceLists = alldeviceLists;
    		})
        },
        _renderBtn: function() {
        	var self = this;
        	//暂存
            $("#comBase").bind("click", function() {
            	var upgradeName = $("#upgradeName").val();
            	var upgradeType = $("#upgradeType").val();//类型
            	var content_desc = $("#content_desc").val();
            	var vender = $("#vender").find("option:selected").val();//厂家
            	
            	
                if(upgradeName==null||upgradeName.replace(/(^\s*)|(\s*$)/g,"")==""){
           			dialog.render({lang:"please_enter_upgrade_name"});
           			return;
           		}
                if(vender == null || vender == 0){
       			    dialog.render({lang: "please_select_vender"});
                    return;
       		    }
                if(content_desc==null||content_desc.replace(/(^\s*)|(\s*$)/g,"")==""){
           			dialog.render({lang:"please_enter_content_desc"});
           			return;
           		}
				var appList=[];
				var firmwareList=[];
				var vmcList=[];
                
				var tableObj = document.getElementById("editConfig"); 
				if(tableObj && tableObj.rows.length >0 ){
					for(var i=0;i<tableObj.rows.length;i++){//行 
						var configObj ={};
						if(upgradeType == 1){//app升级
								configObj.appName = tableObj.rows[i].cells[0].children[0].id.split(":")[0];
							    configObj.appFileId = tableObj.rows[i].cells[0].children[0].id.split(":")[1];
							    configObj.md5 = tableObj.rows[i].cells[1].children[0].id.split(":")[0];
							    configObj.fileName = tableObj.rows[i].cells[1].children[0].id.split(":")[1];
							    configObj.length = tableObj.rows[i].cells[1].children[0].id.split(":")[2];
							    
						}else if(upgradeType == 2){//固件升级
								configObj.firemwareName = tableObj.rows[i].cells[0].children[0].id.split(":")[0];
							    configObj.firmwareFileId = tableObj.rows[i].cells[0].children[0].id.split(":")[1];
							    configObj.md5 = tableObj.rows[i].cells[1].children[0].id.split(":")[0];
							    configObj.fileName = tableObj.rows[i].cells[1].children[0].id.split(":")[1];
							    configObj.length = tableObj.rows[i].cells[1].children[0].id.split(":")[2];
						}else if(upgradeType == 3){//vmc升级
							configObj.vmcName = tableObj.rows[i].cells[0].children[0].id.split(":")[0];
						    configObj.vmcFileId = tableObj.rows[i].cells[0].children[0].id.split(":")[1];
						    configObj.md5 = tableObj.rows[i].cells[1].children[0].id.split(":")[0];
						    configObj.fileName = tableObj.rows[i].cells[1].children[0].id.split(":")[1];
						    configObj.length = tableObj.rows[i].cells[1].children[0].id.split(":")[2];
					}
							
						if(upgradeType == 1){
							appList.push(configObj);
						}else if(upgradeType == 2){
							firmwareList.push(configObj);
						}else if(upgradeType == 3){
							vmcList.push(configObj);
						}
						
					}
				}else{
					dialog.render({lang:"please_add_material"});
           			return;
				}
				              
                self.vender = vender;
        		var status = 2;
        		var finalData = {
        				upgradeName:upgradeName,
        				upgradeType:upgradeType,
        				content_desc:content_desc,
        				firmwareList:firmwareList,
        				appList:appList,
        				vmcList:vmcList,
        				deviceList:self.deviceLists,
        				status:status,
        				vender:vender
        		};
        		if(self.adId){
        			Service.updateGrade(finalData,self.adId,function(data){
            			self.fire("getAdvertiseList");
            			self.adWindow.destroy();
            		});
        		}else{
        			Service.addGrade(finalData,function(data){
            			self.fire("getAdvertiseList");
            			self.adWindow.destroy();
            		});
        		}
				
            });
        	
        	//保存
        	$("#saveBase").bind("click", function() {
        		var upgradeName = $("#upgradeName").val();//名称
        		var upgradeType = $("#upgradeType").val();//类型
        		var content_desc = $("#content_desc").val();
        		self.deviceLists = [];
        		var idsArr = self.deviceList.getSelectedResources();
        		if (idsArr.length != 0){
                	for (var i = 0; i < idsArr.length; i++) {
                        var id = idsArr[i]._id;
                        var configObj ={};
                		configObj.deviceName =  idsArr[i].name;
                		configObj.gwId = idsArr[i].gwId;
                		configObj.deviceId = id;
                		self.deviceLists.push(configObj);
                    }
                }
        		var status = 2;
        		var finalData = {
        				upgradeName:upgradeName,
        				upgradeType:upgradeType,
        				content_desc:content_desc,
        				firmwareList:self.firmwareList,
        				appList:self.appList,
        				vmcList:self.vmcList,
        				deviceList:self.deviceLists,
        				status:status,
        				vender:self.vender
        		};
        		if(self.adId){
        			Service.updateGrade(finalData,self.adId,function(data){
            			self.fire("getAdvertiseList");
            			self.adWindow.destroy();
            		});
        		}else{
        			Service.addGrade(finalData,function(data){
            			self.fire("getAdvertiseList");
            			self.adWindow.destroy();
            		});
        		}
        		
        	});
        	//立即升级
        	$("#nowBase").bind("click", function() {
        		var upgradeName = $("#upgradeName").val();//名称
        		var upgradeType = $("#upgradeType").val();//类型
        		var content_desc = $("#content_desc").val();
        		self.deviceLists = [];
        		var idsArr = self.deviceList.getSelectedResources();
        		if (idsArr.length == 0) {
                    dialog.render({lang: "please_select_at_least_one_config_item"});
                    return;
                }else{
                	for (var i = 0; i < idsArr.length; i++) {
                        var id = idsArr[i]._id;
                        var configObj ={};
                		configObj.deviceName =  idsArr[i].name;
                		configObj.gwId = idsArr[i].gwId;
                		configObj.deviceId = id;
                		self.deviceLists.push(configObj);
                    }
                }
        		var status = 1;
        		var finalData = {
        				upgradeName:upgradeName,
        				upgradeType:upgradeType,
        				content_desc:content_desc,
        				firmwareList:self.firmwareList,
        				appList:self.appList,
        				vmcList:self.vmcList,
        				deviceList:self.deviceLists,
        				status:status,
        				vender:self.vender
        		};
        		if(self.adId){
        			Service.updateGrade(finalData,self.adId,function(data){
            			self.fire("getAdvertiseList");
            			self.adWindow.destroy();
            		});
        		}else{
        			Service.addGrade(finalData,function(data){
            			self.fire("getAdvertiseList");
            			self.adWindow.destroy();
            		});
        		}
        		
        	});
        	//下一步
            $("#nextBase").bind("click", function() {
            	var upgradeName = $("#upgradeName").val();
            	var upgradeType = $("#upgradeType").val();//类型
            	var content_desc = $("#content_desc").val();
            	var vender = $("#vender").find("option:selected").val();//厂家
            	
                if(upgradeName==null||upgradeName.replace(/(^\s*)|(\s*$)/g,"")==""){
           			dialog.render({lang:"please_enter_upgrade_name"});
           			return;
           		}
                if(vender == null || vender == 0){
       			    dialog.render({lang: "please_select_vender"});
                    return;
       		    }
                if(content_desc==null||content_desc.replace(/(^\s*)|(\s*$)/g,"")==""){
           			dialog.render({lang:"please_enter_content_desc"});
           			return;
           		}
                self.appList=[];
                self.firmwareList=[];
                self.vmcList=[];
				var tableObj = document.getElementById("editConfig"); 
				if(tableObj && tableObj.rows.length >0 ){
					for(var i=0;i<tableObj.rows.length;i++){//行 
						var configObj ={};
						if(upgradeType == 1){//app升级
								configObj.appName = tableObj.rows[i].cells[0].children[0].id.split(":")[0];
							    configObj.appFileId = tableObj.rows[i].cells[0].children[0].id.split(":")[1];
							    configObj.md5 = tableObj.rows[i].cells[1].children[0].id.split(":")[0];
							    configObj.fileName = tableObj.rows[i].cells[1].children[0].id.split(":")[1];
							    configObj.length = tableObj.rows[i].cells[1].children[0].id.split(":")[2];
						}else if(upgradeType == 2){//固件升级
								configObj.firemwareName = tableObj.rows[i].cells[0].children[0].id.split(":")[0];
							    configObj.firmwareFileId = tableObj.rows[i].cells[0].children[0].id.split(":")[1];
							    configObj.md5 = tableObj.rows[i].cells[1].children[0].id.split(":")[0];
							    configObj.fileName = tableObj.rows[i].cells[1].children[0].id.split(":")[1];
							    configObj.length = tableObj.rows[i].cells[1].children[0].id.split(":")[2];
						}else if(upgradeType == 3){//vmc升级
							configObj.vmcName = tableObj.rows[i].cells[0].children[0].id.split(":")[0];
						    configObj.vmcFileId = tableObj.rows[i].cells[0].children[0].id.split(":")[1];
						    configObj.md5 = tableObj.rows[i].cells[1].children[0].id.split(":")[0];
						    configObj.fileName = tableObj.rows[i].cells[1].children[0].id.split(":")[1];
						    configObj.length = tableObj.rows[i].cells[1].children[0].id.split(":")[2];
						}
							
						if(upgradeType == 1){
							self.appList.push(configObj);
						}else if(upgradeType == 2){
							self.firmwareList.push(configObj);
						}else if(upgradeType == 3){
							self.vmcList.push(configObj);
						}
						
					}
				}else{
					dialog.render({lang:"please_add_material"});
           			return;
				}
				
				$("#deviceList").css("display", "block");
                $("#baseInfo").css("display", "none");
                $("#tab1").removeClass("active");
                $("#tab2").addClass("active");
                
                self.vender = vender;
                self.renderDeviceList();
				
            });
            //上一步
            $("#lastBase").bind("click", function() {
            	$("#deviceList").css("display", "none");
                $("#baseInfo").css("display", "block");
                $("#tab1").addClass("active");
                $("#tab2").removeClass("active");
            });
            $("#upload").click(function(){
        		if (this.uploadPro) {
                    this.uploadPro.destroy();
                }
                this.uploadPro = new UploadFile({
                    selector: "body",
                    events: {
                    	 "uploadSuccess":function(files) {
                    		 for(var i=0;i<files.length;i++){
                    			 $("#editConfig").append("<tr id='"+files[i].fileid+"'>"
                  						+"<td class='channelTable'>"
                  						+  "<label id='"+files[i].firemwareName+":"+files[i].fileid+"'  name='"+files[i].firemwareName+"_"+files[i].fileid+"'>"+files[i].firemwareName+"</label>"
                  						+"</td>"
                  						+"<td class='channelTable'>"
                  						+  "<label id='"+files[i].md5+":"+files[i].fileName+":"+files[i].length+"'  name='"+files[i].md5+"_"+files[i].fileName+"_"+files[i].length+"'>"+files[i].fileName+"</label>"
                  						+"</td>"
                  						+"<td class='channelTable'><span id='delete_"+files[i].fileid+"' name='"+files[i].fileid+"' class='delcls' style='cursor: pointer;'>删除</span></td>"
                  						+"</tr>");
                    			 
                    		 }
                    		 
                    		 $(".delcls").bind('click',function(){
                     			 $(this).parent().parent().remove();
             			     });
                    	 }
                    }
                });
        	});
        },
		_renderGetVender:function(){
			
			var self = this;
        	$("#vender").html("");
			$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
			Service.getVenderList(eurl,0,0,'',function(data) {
				if(data.result){
					for(var i=0;i<data.result.length;i++){
						$("#vender").append("<option value='" +data.result[i].name + "'>" +data.result[i].name+"</option>");
					}
					
				}
				
			});
			
		},
        renderDeviceList:function(){
        	 var self = this;
        	 
             this.deviceList = new DeviceList({
                 selector: "#list",
                 adWindow: self.adWindow,
                 vender:self.vender,
                 deviceIds:self.deviceIds,
                 events: {
                     "rendTableData": function() {
                         
                     }
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