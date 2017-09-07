define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./distributionMan.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../../../service");
    var columns = [{
		"title":locale.get({lang:"ad_filename"}),//机构简称
		"dataIndex": "name",
		"cls": null,
		"width": "100%"
	}];
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.versionId = options.id;
            this.appsA = options.appsA;
            this.apps = [];
            this.appChoose = [];
            this.appNames = [];
            this._renderWindow();
            
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: locale.get({lang: "version_distribution"}),
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
            $("#saveBase").val(locale.get({lang: "save"}));
            $("#ui-window-content").css("overflow","hidden");
            $("#verificationBase").val(locale.get({lang: "version_verificationBase"}));
            this.getModelData();
            this.renderTable();
            this._renderBtn();
            if(this.versionId){
            	this.getData();
            }
            
        },
        getData:function(){
        	var self = this;
        	Service.getVersionDistributionById(self.versionId,function(data){
        		$("#oName").val(data.result.oName==null?"":data.result.oName);
        		$("#server").val(data.result.server==null?"":data.result.server);
        		$("#model").val(data.result.name);
        		$("#versions").val(data.result.version);
        		     
        		$("#versionModel").find("option[value='"+data.result.versionmodel+"']").attr("selected",true);
        		$("#desc").val(data.result.desc);
        		$("#modelHidden").val(data.result.name);
        		$("#versionHidden").val(data.result.version);
                
        		var version_config = data.result.config.configName;
        		$("#modelName").css("display","none");
        		$("#version").css("display","none");
        		$("#model").css("display","block");
        		$("#versions").css("display","block");

        		var version = data.result.version;
        		var modelName = data.result.name;
        		$("#version_config").empty();
        		$("#version_config").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        		Service.getVersionInfo(0, -1,function(data) {
        			var modelData = data;
            		if(modelData.result && modelData.result.length > 0 ){
            			for(var i=0;i<modelData.result.length;i++){
            				if(modelData.result[i].name == modelName){
            					var versions = modelData.result[i].versions;
            					if(versions && versions.length > 0){
            						for(var j=0;j<versions.length;j++){
            							if(versions[j].version == version){
            								var apps = versions[j].apps;
            								var configs = versions[j].config;
            								for(var k=0;k<configs.length;k++){
            									if(version_config == configs[k].configName){
            										$("#version_config").append("<option selected='selected' value='" +configs[k].configId + "'>" +configs[k].configName+"</option>");
            									}else{
            										$("#version_config").append("<option value='" +configs[k].configId + "'>" +configs[k].configName+"</option>");
            									}
            									
            								}
            								
            								
            								/*var config = {
            										fileId:versions[j].config.configId,
            										name:versions[j].config.configName
            								};
            								apps.push(config);*/
            								self.listTable.render(apps);
            								var len = self.appChoose.length;
            								
            								for(var m=0;m<len;m++){
            									$("#"+self.appChoose[m]).click();
            								}
            							}
            						}
            					}
            				}
            			}
            		}
        		});
        		
        		
        	});
        },
        _renderBtn: function() {
        	var self = this;
        	
        	$("#saveBase").bind("click", function() {
        		var oName = $("#oName").val();
        		var name = "";
        		var version="";
        		var versionModel = $("#versionModel").find("option:selected").val();
        		var desc = $("#desc").val();
        		if(self.versionId){
        			name = $("#modelHidden").val();
        			version = $("#versionHidden").val();
        		}else{
        			name = $("#modelName").find("option:selected").text();
        			version = $("#version").find("option:selected").val();
        		}
        		var config = {};
        		config.configId = $("#version_config").find("option:selected").val();
        		config.configName = $("#version_config").find("option:selected").text();
        		
        		var server = $("#server").val();
        		
        		var idsArr = self.getSelectedResources();
        		if (idsArr.length == 0) {
                    dialog.render({lang: "please_select_at_least_one_config_item"});
                    return;
                }else{
                	for (var i = 0; i < idsArr.length; i++) {
                        var configObj ={};
                		configObj.name =  idsArr[i].name;
                		configObj.fileId = idsArr[i].fileId;
                		self.apps.push(configObj);
                    }
                }
        		if(desc==null||desc.replace(/(^\s*)|(\s*$)/g,"")==""){
           			dialog.render({lang:"please_enter_version_desc"});
           			return;
           		}
        		if(name==null || name == 0){
           			dialog.render({lang:"please_select_version_model_at_least_one"});
           			return;
           		}
        		if(version==null  || version == 0){
           			dialog.render({lang:"pleast_select_version_at_least_one"});
           			return;
           		}
        		if(versionModel==null  || versionModel == 0){
           			dialog.render({lang:"pleast_select_model_at_least_one"});
           			return;
           		}
        		if($("#version_config").find("option:selected").val() == 0 || $("#version_config").find("option:selected").val() == null){
        			dialog.render({lang:"pleast_select_version_config_at_least_one"});
           			return;
        		}
        		if(server==null||server.replace(/(^\s*)|(\s*$)/g,"")==""){
           			dialog.render({lang:"please_enter_server_name"});
           			return;
           		}
        		if(oName==null||oName.replace(/(^\s*)|(\s*$)/g,"")==""){
           			dialog.render({lang:"please_enter_organization_name"});
           			return;
           		}
        		var executeOName = "inhand";
        		var domain = window.location.host;
        		if(domain == "longyuniot.com"){
        			executeOName = "aucma";
    			}else if(domain == "www.dfbs-vm.com"){
    				executeOName = "fuji";
    			}
        		var finalData = {
        				oName:oName,
        				executeOName:executeOName,
        				name:name,
        				version:version,
        				config:config,
        				server:server,
        				apps:self.apps,
        				versionmodel:versionModel,
        				desc:desc
        				
        		};
        		var oidFalse = $("#oidVer").val();
        		if(oidFalse){
        			if(oidFalse == "false"){
            			dialog.render({lang:"please_make_sure_that_the_organization_is_correct"});
            			return;
            		}else if(oidFalse=="true"){
            		}
        		}else{
        			dialog.render({lang:"please_verify_the_mechanism_for_short"});
        			return;
        		}
        		
        		
        		
        		if(self.versionId){
        			Service.updateVersionDistribution(self.versionId,finalData,function(data){
        				if (data.error_code == null && data.result) {						
        					self.fire("getVersionList");
                			self.adWindow.destroy();
						}else if(data.error_code == "70030"){
							dialog.render({lang: "version_desc_exists"});
							return ;
						}
            			
            		});
        		}else{
        			Service.addVersionDistribution(finalData,function(data){
        				if (data.error_code == null && data.result) {						
        					self.fire("getVersionList");
                			self.adWindow.destroy();
						}else if(data.error_code == "70030"){
							dialog.render({lang: "version_desc_exists"});
							return ;
						}
            		});
        		}
        		
        	});
        	$("#verificationBase").bind("click", function() {
        		var oName = $("#oName").val();
        		var server = $("#server").val();
        		if(server==null||server.replace(/(^\s*)|(\s*$)/g,"")==""){
           			dialog.render({lang:"please_enter_server_name"});
           			return;
           		}
        		if(oName==null||oName.replace(/(^\s*)|(\s*$)/g,"")==""){
           			dialog.render({lang:"please_enter_organization_name"});
           			return;
           		}
        		
        		Service.verificationOid(oName,server,function(data){
        			
        			if(data.result){
        				if(data.result.oid){
        					if(data.result.oid == "error"){
        						$("#oidVer").val("false");
            					$("#right").css("display","none");
            					$("#error").css("display","block");
            					dialog.render({lang:"please_make_sure_that_the_organization_is_correct"});
        					}else{
        						$("#oidVer").val("true");
            					$("#error").css("display","none");
            					$("#right").css("display","block");
            					dialog.render({lang:"verify_is_ok"});
        					}
        				}
        			}
        		});
        	});
        	$("#modelName").change(function(){
        		var modelId = $(this).children('option:selected').val();
        		$("#version").empty();
        		$("#version").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        		if(modelId == 0){
        			$("#version option[value='0']").attr("selected","selected");
        			$("#server").val("");
        		}
        		Service.getVersionInfo(0, -1,function(data) {
        			var modelData = data;
            		if(modelData.result && modelData.result.length > 0 ){
            			for(var i=0;i<modelData.result.length;i++){
            				if(modelData.result[i]._id == modelId){
            					var versions = modelData.result[i].versions;
            					var configs = modelData.result[i].config;
            					if(versions && versions.length > 0){
            						for(var j=0;j<versions.length;j++){
            							$("#version").append("<option value='" +versions[j].version + "'>" +versions[j].version+"</option>");
            						}
            					}
            					
            					//$("#server").val(modelData.result[i].server);
            				}
            			}
            		}
        		});
        	});
        	$("#version").change(function(){
        		var version = $(this).children('option:selected').val();
        		var modelId = $("#modelName").find("option:selected").val();
        		$("#version_config").empty();
        		$("#version_config").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        		Service.getVersionInfo(0, -1,function(data) {
        			var modelData = data;
            		if(modelData.result && modelData.result.length > 0 ){
            			for(var i=0;i<modelData.result.length;i++){
            				if(modelData.result[i]._id == modelId){
            					var versions = modelData.result[i].versions;
            					if(versions && versions.length > 0){
            						for(var j=0;j<versions.length;j++){
            							if(versions[j].version == version){
            								var apps = versions[j].apps;
            								var configs = versions[j].config;
            								for(var k=0;k<configs.length;k++){
            									$("#version_config").append("<option value='" +configs[k].configId + "'>" +configs[k].configName+"</option>");
            								}
            								/*var config = {
            										fileId:versions[j].config.configId,
            										name:versions[j].config.configName
            								};
            								apps.push(config);*/
            								self.listTable.render(apps);
            							}
            						}
            					}
            				}
            			}
            		}
        		});
        	});
        },
        getModelData:function(){
        	var self = this;
        	$("#modelName").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        	$("#version").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        	if(self.appsA){
        		for(var n=0;n<self.appsA.length;n++){
        			
        			self.appNames.push(self.appsA[n].name);
        			
        		}
        	}
        	
        	Service.getVersionInfo(0, -1,function(data) {
				
			    if(data.result && data.result.length > 0 ){
			    	for(var i=0;i<data.result.length;i++){
			    		$("#modelName").append("<option value='" +data.result[i]._id + "'>" +data.result[i].name+"</option>");
			    	}
			    }
			});
        	
        },
        renderTable:function(){
        	var self = this;
        	this.listTable = new Table({
				selector : "#versionlist",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "full",
				events : {
					 onRowClick: function(data) {
						    this.listTable.unselectAllRows();
	                        var rows = this.listTable.getClickedRow();
	                        this.listTable.selectRows(rows);
						    
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        
	                        var name = data.name;
	                        var but = $(tr).find('a').attr('id');
	                        if(self.appNames.length > 0){
	                        	
	                        	if(self.appNames.indexOf(name) != -1){
		                        	self.appChoose.push(but);  
		                        }
	                        	
	                        }
	                       
	                    },
	                   scope: this
				}
			});
        	
        },
        getSelectedResources: function() {
            var self = this;
            var rows = self.listTable.getSelectedRows();
            var selectedRes = new Array();
            rows.each(function(row) {
                selectedRes.push(self.listTable.getData(row));
            });
            return selectedRes;
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