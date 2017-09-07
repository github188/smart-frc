define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var html = require("text!./device.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	var Service = require("../../../../service");
	require("../../css/tab.css");
	var goodsConfigInfo=require("../goods/goodsConfig");
	
	var columns = [{
		"title":locale.get({lang:"automat_no1"}),
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "30%"
	}, {
		"title":locale.get({lang:"automat_name"}),
		"dataIndex" : "name",
		"cls" : null,
		"width" : "40%"
	},{
		"title":locale.get({lang:"automat_cargo_road_config"}),
		"dataIndex" : "goodsConfigs",
		"cls" : null,
		"width" : "30%",
		 render:function(data, type, row){
			 var display ="";
			 var flags=false;
			 if(data){
				 if(data.length){
					 for(var i=0;i<data.length;i++){
						 if(data[i] !=null){
							 flags =true;
							 break;
						 }
					 }
				 }
			 }
			 
			 if(!flags){
				 var result = locale.get({lang:"have_not_config"});
				 display += new Template("<label style=' font-weight:bolder;color: rgb(236, 69, 189);'>"+result+"</label>")
                 .evaluate({
                     status : result
                 });
			 }else{
				 var result = locale.get({lang:"have_config"});
				 display += new Template("<label>"+result+"</label>")
                 .evaluate({
                     status : result
                 });
			 }
			 return display;
		 }
	}];
    var columns_selected=[{
	 "title": locale.get("trade_automat_number"),
	 "dataIndex" : "vmId",
	 "width": "50%"
	},
	{
	 "title": locale.get("automat_name"),
	 "dataIndex" : "name",
	 "field": "name",
	 "width": "50%"						     
	}];
	var deviceConfig = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.activityId = options.activityId;
			this.activityWindow = options.activityWindow;
		    this.element.html(html);
			locale.render({element:this.element});
			this._render();
		},
		_render:function(){
			this.display = 30;
			this.pageDisplay = 30;
			$("#beforeStep").val(locale.get({lang:"price_step"}));
			$("#nextStep").val(locale.get({lang:"next_step"}));
			$("#que").val(locale.get({lang:"query"}));
			$("#que_text").attr('placeholder',locale.get({lang:"query_by_name_or_assertId"}));
			this._renderDevice_left_table();
			this._renderDevice_content_table();
			this._renderBindEvent();
		},
		stripscript:function(s){ 
		    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]") 
		    var rs = ""; 
		    for (var i = 0; i < s.length; i++) { 
		      rs = rs+s.substr(i, 1).replace(pattern, ''); 
		    } 
		    return rs; 
		},
		//商品
		_renderGoodsConfig:function(activityId){
			var self = this;
			this.goodsConfig = new goodsConfigInfo({
      			selector:"#goodsConfig",
      			activityId:activityId,
      			activityWindow:this.activityWindow,
      			events : {
      				"rendTableData":function(){
      					self.fire("getActivityList");
      				}
      			}
      	    });
		},
		_renderBindEvent:function(){
			var self = this;
			//点击 上一步
			$("#beforeStep").bind("click",function(){
				$("#deviceConfig").css("display","none");
				$("#baseInfo").css("display","block");
				$("#tab2").removeClass("active");
				$("#tab1").addClass("active");
			});
			
			//点击 下一步
			$("#nextStep").bind("click",function(){
				var deviceTable_content=self.deviceSelectedtable.getAllData();
				if(deviceTable_content.length>0){
					$("#deviceConfig").css("display","none");
					$("#goodsConfig").css("display","block");
					$("#tab2").removeClass("active");
					$("#tab3").addClass("active");
					self._renderGoodsConfig(self.activityId);
				}else{
					dialog.render({lang:"automat_in_the_activities"});
				}
			});
			
            $("#addDevice").bind("click",function(){
            	var selectedResouces = self.getSelectedResources_left();
            	if(selectedResouces.length == 0){
            		dialog.render({lang:"please_select_at_least_one_config_item"});
            		return;
            	}else{
            		for(var k=0;k<selectedResouces.length;k++){
            			 var flags=false;
            			 var data = selectedResouces[k].goodsConfigs;
            			 if(data == null || data == undefined){
            			 }else if(data && data.length>0){
            				 if(data.length){
                				 for(var m=0;m<data.length;m++){
                					if(data[m] !=null){
                						flags =true;
                						break;
                				    }
                				}
                			}
            			 }
            		     if(!flags){
            		    	break;
                     	 }
                	}
            	}
            	if(!flags){
            		dialog.render({lang:"please_make_sure_that_every_machine_you_choose_has_been_configured_to"});
            		return;
             	}
            	
            	var obj=[];
				Service.getActivite(self.activityId,function(data){
					var automatobj = [];
					var goodsInfo = [];
					var ooo = {};
					var check_same=false;
					
					if(data.result.automatInfo==undefined){
						for(var i=0;i<selectedResouces.length;i++){
							ooo={
							      'deviceId':selectedResouces[i]._id,
								  'vmId':selectedResouces[i].assetId,
							      'name':selectedResouces[i].name	
								};
							automatobj.push(ooo);
							}
					}else{
						automatobj=data.result.automatInfo;
						for(var i=0;i<selectedResouces.length;i++){
							for(var j=0;j<automatobj.length;j++){
								if(automatobj[j].vmId==selectedResouces[i].assetId){
									check_same=true;
								}
							}
							if(check_same!=true){
							ooo={
								'deviceId':selectedResouces[i]._id,
								'vmId':selectedResouces[i].assetId,
								'name':selectedResouces[i].name
								};
							automatobj.push(ooo);
							}
							check_same=false;
					   }
					}
					if(data.result.goodsInfo){
						goodsInfo = data.result.goodsInfo;
					}
					var activityData={
							endTime:data.result.endTime,
							goodsInfo:goodsInfo,
							automatInfo:automatobj
					};
				    Service.updateActivityInfo(self.activityId,activityData,function(data) {
							self.deviceSelectedtable.render(data.result.automatInfo);
				    });
				});
			});
            
            $("#removeDevice").bind("click",function(){
            	var selectedResouces = self.getSelectedResources_content();
            	if(selectedResouces.length == 0){
            		dialog.render({lang:"please_select_at_least_one_config_item"});
            		return;
            	}
            	var obj=[];
				Service.getActivite(self.activityId,function(data){
					obj=data.result.automatInfo;
					for(var i=0;i<selectedResouces.length;i++){
						for(var j=0;j<obj.length;j++){
							if(obj[j].deviceId==selectedResouces[i].deviceId){
								obj.splice(j,1);
							}
						}
					}
					data.result.automatInfo=obj;
					var newdata =data;
					Service.updateActivityInfo(self.activityId,newdata.result,function(data) {
					if(data){
						    Service.getActivite(self.activityId,function(data){
							   self.deviceSelectedtable.render(data.result.automatInfo);
							});
						}
					});
				});
			});
            $("#que").bind("click",function(){
            	cloud.util.mask("#con2_left");
				var que_val=$("#que_text").val();
				if(que_val){
					   que_val = self.stripscript(que_val);
			 	}
				Service.getdeviceByName(que_val,0, self.display,function(data){
					var total = data.total;
					this.totalCount = data.result.length;
			        data.total = total;
			        self.devicetable.render(data.result);
			        self._renderDevicepage(data, 1);
			        cloud.util.unmask("#con2_left");
				});
			});
		},
		getSelectedResources_content:function(){
	        var self = this;
	        var selectedRes = $A();
	        self.deviceSelectedtable && self.deviceSelectedtable.getSelectedRows().each(function(row){
	        	selectedRes.push(self.deviceSelectedtable.getData(row));
	        });
	        return selectedRes;
	    },
		getSelectedResources_left:function(){
	        var self = this;
	        var selectedRes = $A();
	        self.devicetable && self.devicetable.getSelectedRows().each(function(row){
	        	selectedRes.push(self.devicetable.getData(row));
	        });
	        return selectedRes;
	    },
	    _renderDevice_content_table:function(){
	    	var self = this;
			self.deviceSelectedtable = new Table({
				selector:"#con3_content",
				limit:100,
				checkbox:"full",
				count:false,
				mask:true,
				page:false,
				columns:columns_selected
			});
	    },
		_renderDevice_left_table:function(){
			this.devicetable = new Table({
				selector:"#con3_left",
				limit:100,
				checkbox:"full",
				count:false,
				mask:true,
				page:false,
				columns:columns,
				events : {
					 onRowClick: function(data) {
	                 },
	                 onRowRendered: function(tr, data, index) {
	                     var self = this;
	                 },
	                 scope: this
				}
			});
			this.loadData();
		},
		loadData:function(){
			cloud.util.mask("#con3_left");
			var self = this;
			var que_val=$("#que_text").val();
			if(que_val){
				   que_val = self.stripscript(que_val);
		 		}
			Service.getdeviceByName(que_val,0, self.display,function(data){
				var total = data.total;
				this.totalCount = data.result.length;
		        data.total = total;
		        self.devicetable.render(data.result);
		        self._renderDevicepage(data, 1);
		        cloud.util.unmask("#con3_left");
			});
		},
		_renderDevicepage:function(data, start){
        	var self = this;
        	 $("#left_bottom").empty();
        		this.page = new Paging({
        			selector : $("#left_bottom"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				var que_val=$("#que_text").val();
        				if(que_val){
        					   que_val = self.stripscript(que_val);
        			 		}
        				Service.getdeviceByName(que_val,options.cursor, options.limit,function(data){
						   callback(data);
        				});

        			},
        			turn:function(data, nowPage){
        			    self.totalCount = data.result.length;
        			    self.devicetable.clearTableData();
        			    self.devicetable.render(data.result);
        				self.nowPage = parseInt(nowPage);
        			},
        			events : {
        			    "displayChanged" : function(display){
        			        self.display = parseInt(display);
        			    }
        			}
        		});
        		this.nowPage = start;
        }
	});
	return deviceConfig;
});