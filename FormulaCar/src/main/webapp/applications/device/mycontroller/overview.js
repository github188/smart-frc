define(function(require) {
	require("cloud/base/cloud");
	var OverviewTemplate = require("../../template/overview");
	var Button = require("cloud/components/button");
	var _Window = require("cloud/components/window");
	var InfoModule = require("./info");
	var service = require("./service");
	var TagManager = require("../../components/tag-manager");
	require("../resources/css/toolbar-search.css");
	//var BatchImport = require("./batch-import");
	
	var MyControllerOverView = Class.create(cloud.Component, {
		initialize: function($super, options) {
			var self = this;
			this.moduleName = "mydevice-overview";
			$super(options);
			var controlConfig = permission.app("_controller");
			if(!controlConfig.read) {
				return ;
			}

			this.infoModule = null;
			this.element.empty().addClass("cloud-application mydevice-overview");
			this.overview = new OverviewTemplate({
				selector: this.element,
				service: service,
				infoModule: function() {
					if (self.infoModule === null) {
						self.infoModule = new InfoModule({
							selector: "#overview-info"
						});
					}
					return self.infoModule;
				},
				events : {
				    "afterSelect" : function(resources){
				        var isAllGateway = this.verifyGateway(resources);
				        var isSameModel = this.verifySameModel(resources)
				        if (isAllGateway && isSameModel){
				            this.configBtn.show();
				        }else{
				            this.configBtn.hide();
				        }
				    },
				    scope : this
				}
			});

			this.addToolbarItems();
			this.gatewayMgr = null;
			this.window = null;
			cloud.locale = locale;
			this._renderSearch(this.toolbar);
			
			locale.render({element:this.element});
			
			$("#tag-overview-itembox").find(".cloud-item").live("click",function(){
				if($(this).attr("id") == "tag-overview-tag-1"){
					$("#toolbar-search-box").show();
				}else{
					$("#toolbar-search-box").hide();
				}
			});
			this.empower();
		},
		
		empower: function() {
			var controllerConfig = permission.app("_controller");
			if(!controllerConfig.write) {
				this.overview.contentModule.addBtn.hide();
				this.overview.contentModule.deleteBtn.hide();
			}
//			this.overview.contentModule.addBtn.disable();
//			this.overview.contentModule.deleteBtn.disable();
		},

		verifiedDeviceModel: function(ids, busi) {
			var res_length = ids.length;
			var num = 0;
			var result = true;
			var device_model = null;
			var self = this;
			service.getTableResourcesById(ids, function(resources) {
		        var modelId = resources.first().modelId;
                if (resources.all(function(resource) {
                    return resource.modelId == modelId;
                })) {
                    self.renderAndOpenGatewayManage(busi, resources);
                } else {
//	                  alert("Select the same model device , Please!");
                }
			}, this);
		},
		
		verifySameModel : function(resources){
		    if (resources.length == 0){
		        return true;
		    }
		    var modelId = resources.first().modelId;
		    if (resources.all(function(resource) {
                return resource.modelId == modelId;
            })) {
		        return true;
		    }else {
		        return false;
		    }
		},
		
		verifyGateway : function(resources){
		    var result = true;
		    
		    var plcIds = resources.pluck("plcId");
		    plcIds.find(function(plcId){
		        if (plcId != 0) {
		            result = false;
		            return true;
		        }
		    });
//		    console.log(result, "verifyGateway");
		    return result;
		},
		
		hideConfigIcon:function(){
			var self = this;
			var ids = self.overview.contentModule.getSelectedResources();
			if(ids == 0){
				$(".dev-overview-configMgr").removeAttr("style");
				return;
			}
			
			service.getTableResourcesById(ids, function(resources) {
				var modelId = resources.first().modelId;
				if (resources.all(function(resource) {
					return resource.modelId == modelId;
				})&&resources.all(function(resource){
					return resource.plcId == 0;
				})) {
					$(".dev-overview-configMgr").removeAttr("style");
				} else {
					$(".dev-overview-configMgr").css("display","none");
				}
			}, this);
		},
		addToolbarItems: function() {
			var self = this;
			var toolbar = this.overview.getToolbar();
			var configBtn = new Button({
				imgCls: "cloud-icon-config",
				title: locale.get("gateway_management"),
				//lang:"{title:gateway+management}",
				cls:"dev-overview-configMgr",
				id:"dev-overview-gatewayConfigMgr",
				events: {
					click: function() {
						var selectedResouces = this.overview.contentModule.getSelectedResources();
						if (selectedResouces.length == 0) {
//							alert("At least select one item , Please!");
							dialog.render({lang:"please_select_at_least_one_config_item"});
						} else {
							this.verifiedDeviceModel(selectedResouces, "config");
						}
					},
					scope: this
				}
			});
//			var upgradeBtn = new Button({
//				imgCls: "cloud-icon-upgrade",
//				title: "升级",
//				events: {
//					click: function() {
//						var selectedResouces = this.overview.contentModule.getSelectedResources();
//						if (selectedResouces.length == 0) {
//							alert("At least select one item , Please!");
//						} else {
//							this.verifiedDeviceModel(selectedResouces, "upgrade");
//						}
//					},
//					scope: this
//				}
//			});
			var labelBtn = new Button({
				imgCls: "cloud-icon-label",
				title: "批量标签",
				lang:"{title:batch_tag}",
				events: {
					click: function() {
						var selectedResouces = this.overview.contentModule.getSelectedResources();
						if (selectedResouces.length == 0) {
//							alert("At least select one item , Please!");
							dialog.render({lang:"please_select_at_least_one_config_item"});
						} else {
							service.getTableResourcesById(selectedResouces, function(_resources) {
								var resources = new Hash();
								_resources.each(function (resource) {
									resources.set(resource._id, resource.name);
								});
								self.renderTagManager(resources.toObject());
								
							}, this);
							// this.renderTagManager();
						}
					},
					scope: this
				}
			});
			
			var importBtn = new Button({
				imgCls: "cloud-icon-daoru",
				title: locale.get("batch_import"),
				lang:"{title:batch_import}",
				events: {
					click: function() {
						this.renderBatchImport(); 
					},
					scope: this
				}
			});
			this.configBtn = configBtn;
			
			toolbar.appendRightItems([labelBtn], -1);
			this.toolbar = toolbar;
		},
		
		renderBatchImport : function(){
			var self = this;
			if (this.batchImport){
				this.batchImport.destroy();
			}
			this.batchImport = new BatchImport({
				events : {
					"onBatchImportSuc" : function(){
//						console.log("onBatchImportSuc");
						self.overview.reloadTags();
					}
				}
			});
//			this.batchImport.on()
		},
		
		renderAndOpenGatewayManage: function(busi, resources, model) {
			var self = this;
			if (!this.window) {
				this.window = new _Window({
					container: "body",
					title: locale.get("gateway_management"),//"网关管理",
					lang:"{title:gateway_management}",
					top: "center",
					left: "center",
					cls:"mydevice-overvier-configMgr",
					height: 600,
					width: 1300,
					mask: true,
					drag:true,
					content: "<div id='overview-window-el'></div>",
					events: {
						"onClose": function() {
							this.gatewayMgr.destroy();
							this.gatewayMgr = null;
							this.window = null;
						},
						scope: this
					}
				});
				require(["../gateway-manage/gateway-manage"], function(GatewayManage) {
					self.gatewayMgr = new GatewayManage({
						selector: self.window.element.find("#overview-window-el"),
						business: busi,
						resources: resources,
						modelId: resources.first().modelId
					});
				});
				this.window.show();
			} else {
//				require(["../gateway-manage/gateway-manage"], function(GatewayManage) {
//					self.gatewayMgr = new GatewayManage({
//						selector: self.window.element.find("#overview-window-el"),
//						business: busi,
//						resources: resources,
//						modelId: resources.first().modelId
//					});
//				});
//				this.window.show();
			}
		},

		renderTagManager: function(resources) {
			var self = this;
			if (this.tagManager){
				this.tagManager.destroy();
			}
			this.tagManager = new TagManager({
				obj: resources
			});
			this.tagManager.on({
				"onComplete" : function(){
					self.overview && (self.overview.reloadTags("clicked"));
				}
			});
		},
		_renderSearch:function(toolbar){
			var self = this;
			var elements = {
					box:"toolbar-search-box",
					hint:"toolbar-search-hint",
					input:"toolbar-search-input",
					button:"toolbar-search-button"
			}
			//draw search
			var toolbarElement = "#" + toolbar.id;
			var toolbarLeftElement = "." + $(toolbar["leftDiv"][0]).attr("class");
			var toolbarRightElement = "." + $(toolbar["rightDiv"][0]).attr("class");
			var searchBox = $("<form>").attr("id",elements.box).attr("class",elements.box);
			var $hint = $("<input>").attr("type","text").attr("id",elements.hint).attr("class",elements.hint).attr("lang","value:enter_the_controller_name");
			var $input = $("<input>").attr("type","text").attr("id",elements.input).attr("class",elements.input).css("display","none");
			var $button = $("<input>").attr("type","button").attr("id",elements.button).attr("class",elements.button);
			searchBox.append($hint).append($input).append($button);
			$(toolbarElement).find(toolbarLeftElement).after(searchBox);
			var updateCount=function(returnData){
				var contentOverview=self.overview.contentModule;
				var itermbox=self.overview.contentModule.itembox;
				var display=contentOverview.display;
				var currentCount;
				if(returnData.total<=display){
					currentCount=returnData.total;
				}
				else{
					currentCount=display;
				}
				itermbox.selectedItemsCount=0;
				itermbox.size=currentCount;
				contentOverview.updateCountInfo();
			};
			var refreshPage=function(data){
				var contentOverview=self.overview.contentModule;
				contentOverview.page.reset(data);
				service.getResourcesIds=function(start, limit, callback, context){
		            cloud.Ajax.request({
		                url : "api/machines",
		                type : "get",
		                parameters:{
		                	name:inputValue,
		                	cursor:start,
		                	limit:limit,
		                	verbose:1
		                },
		                success : function(data) {
		                	data.result = data.result.pluck("_id");
		                    callback.call(context || this, data);
		                }
		            });
		        
				} 
			};
			//search event
				$("#" + elements.hint).click(function(){
					$(this).hide();
					$("#" + elements.input).show().focus();
				});
				var searchFunction=function(){
					var display = self.overview.contentModule.display;
					self.overview.options.service.getResourcesIds=service.getResourcesIds;
					self.overview.hideInfo();
					cloud.util.mask(self.element);
					$("#" + elements.hint).hide();
					$("#" + elements.input).show().focus();
					var pattern=/^[a-zA-Z0-9_\-\u4e00-\u9fa5]+$/i;
					inputValue = $("#" + elements.input).val().replace(/\s/g,"");
					var param = {
							verbose:100,
							limit:display
//							plc_id:-1
					};
					inputValue=inputValue.match(pattern);					
					if(inputValue!==null&&inputValue.length !== 0){
						inputValue=inputValue.toString();
						param.name = inputValue; 
					}
					Model.machine({
						method:"query_list",
						param:param,
						success:function(data){
//							console.log(data);
							data.result.each(function(one){
								one.description = one.model;
							});
//							self.overview.contentModule.itembox.clear();
							var resourceData = self.overview.contentModule.processData(data.result);
							self.overview.contentModule.itembox.render(resourceData);
							updateCount(data);
							refreshPage(data);
							cloud.util.unmask();
						}
					})
				};
				$("#"+elements.input).keypress(function(event){
					if(event.keyCode==13){
						searchFunction();
					}						
			});
			$("#"+elements.button).click(searchFunction);
		},

		destroy: function() {
			$("#" + this.infoModule.id).empty();
			this.element.removeClass("mydevice-overview cloud-application");
			this.overview.destroy();
			if (this.gatewayMgr) {
				if (this.gatewayMgr.destroy) {
					this.gatewayMgr.destroy();
				}
			}
			//if (this.tagManager != null) this.tagManager.destroy();
			if (this.infoModule.destroy) this.infoModule.destroy();
		}		
	});
	return MyControllerOverView;
});