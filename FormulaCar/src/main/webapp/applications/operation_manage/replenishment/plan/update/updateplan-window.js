define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./updateplan.html");
    var Table = require("cloud/components/table");
    var Paging = require("cloud/components/paging");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
    var Service = require("../service");
    var warehouse=require("../warehouse/list.js");
    var DevicelistInfo = require("../config/deviceList");

    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);

			this._id = options.planId;
			this.userId = options.userId;
			this.warehouseId=options.warehouseId;
			this.lineIds = [];
			this.executivePersonId = null;
			this.equipstatus = [];
			this.languge = localStorage.getItem("language");
			this._renderWindow();
			this._renderData();
			locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: locale.get({lang: "update_replenish_plan"}),
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
                        self.fire("getplanList");
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
            this.adWindow.show();
            $("#nextBase").val(locale.get({lang: "next_step"}));
        	if(self.languge == "en"){
          		 this._renderwarehousehtml();
           	}
            
        },
        _renderwarehousehtml:function(){
        	var tr = $("#tableid tbody tr").eq(-2);
        	var trhtml="<tr>"+
	                "<td width='15%'><label style='color:red;'>*</label>&nbsp;&nbsp;<label>"+locale.get({lang:'warehouse_address'})+"</label></td>"
	               +"<td><select  id='warehouse_address'  multiple='multiple'  style='width:170px;height: 28px;'></select>"
	               +"<span id='address_add_button'></span>"
	               + "</td>"
	               +"</tr>";
        	tr.after(trhtml);
        	
        },
        _render:function(){
			//this._renderHtml();
        	var self = this;
			this._renderBtn();
			$(function(){
				$("#executiveTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd")).datetimepicker({
					format:'Y/m/d',
					step:1,
					startDate:'-1970/01/08',
					lang:locale.current() === 1 ? "en" : "ch",
					timepicker: false,
					onShow: function() {
                        $(".xdsoft_calendar").show();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    },
                    onClose: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    }
				});
				//$("#startTime").val("");

			});
	  	
			require(["cloud/lib/plugin/jquery.multiselect"], function() {

            	$("#executive_person").multiselect({
                    header: false,
                    noneSelectedText: locale.get({lang: "please_select_executive_person"}),
                    selectedText: "# " + locale.get({lang: "is_selected"}),
                    multiple: false,
                    selectedList: 1,
                    minWidth: 200,
                    height: 150
                });
                $("#replenishline").multiselect({
                    header: true,
                    checkAllText: locale.get({lang: "check_all"}),
                    uncheckAllText: locale.get({lang: "uncheck_all"}),
                    noneSelectedText: locale.get({lang: "automat_line"}),
                    selectedText: "# " + locale.get({lang: "is_selected"}),
                    minWidth: 200,
                    height: 150
                });
                if(self.languge == "en"){
            	$("#warehouse_address").multiselect({
                    header: false,
                    noneSelectedText: locale.get({lang: "please_select_warehouse_address"}),
                    selectedText: "# " + locale.get({lang: "is_selected"}),
                    multiple: false,
                    selectedList: 1,
                    minWidth: 200,
                    height: 150
                });
                
                }
			 });
			   
                Service.getUserInfo(0, 1000,function(data) {
    				if(data && data.result){
    					
    					var len = data.result.length;
    					for(var i=0;i<len;i++){
    						if(data.result[i]._id == self.executivePersonId.toUpperCase()){
    							$("#executive_person").append("<option id='"+data.result[i]._id+"' value='"+data.result[i].email+"' selected='selected'>"+data.result[i].name+"</option>");
    						}else{
    							$("#executive_person").append("<option id='"+data.result[i]._id+"' value='"+data.result[i].email+"'>"+data.result[i].name+"</option>");
    						}
    						
    					}
    					
    					$("#executive_person").multiselect('refresh');
    					
    				}
    			});
            	if(self.languge == "en"){
        			this.bindEvent();
        			this._renderGetWarehouse();
        		}
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
                    var searchData = {
            				"lineId":lineIds
            		};

                	Service.getAllLine(searchData,-1,0,function(lineData){
                		if (lineData && lineData.result.length > 0) {
                			self.lineData = lineData.result;
                            for (var j = 0; j < lineData.result.length; j++) {
                            	if($.inArray(lineData.result[j]._id,self.lineIds) > -1){
                            		$("#replenishline").append("<option value='" + lineData.result[j]._id + "' selected='selected'>" + lineData.result[j].name + "</option>");
                            	}else{
                            		$("#replenishline").append("<option value='" + lineData.result[j]._id + "'>" + lineData.result[j].name + "</option>");
                            	}
                                
                            }
                            $("#replenishline").multiselect('refresh');
                            
                        }
      			    }, self);

                	
                });
            
	
		
		},
		_renderHtml : function() {
			this.element.html(html);
		},
		stripscript:function(s){ 
		    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]") 
		    var rs = ""; 
		    for (var i = 0; i < s.length; i++) { 
		      rs = rs+s.substr(i, 1).replace(pattern, ''); 
		    } 
		    return rs; 
		},
		bindEvent: function() {
			var self = this;
        	if(self.addressBtn){
        	}else{
        		self.addressBtn = new Button({
                    text: locale.get({lang: "edit"}),
                    container: $("#address_add_button"),
                    events: {
                        click: function() {                    
                       	 if (self.warehouse_listPage) {
                        		  self.warehouse_listPage.destroy();
                            }
                            this.warehouse_listPage = new warehouse({
                                selector: "body",
                                events: {
                                    "getWarehouseList": function() { 
                                    	self._renderGetWarehouse();
                                    }
                                }
                            });     
                        }
                    }
                }); 
        	}
		},
		
		_renderGetWarehouse:function(){
			var self=this;
			Service.getWarehouseList("",0,0,function(data){
				if(data && data.result){
					var len = data.result.length;
					for (var i= 0; i < len; i++) {
						if(data.result[i]._id==self.warehouseId){
							$("#warehouse_address").append("<option id='"+data.result[i]._id+"' value='"+data.result[i].address+"' selected='selected'>"+data.result[i].name+"</option>");
						}else{
							$("#warehouse_address").append("<option id='"+data.result[i]._id+"' value='"+data.result[i].address+"'>"+data.result[i].name+"</option>");
						}
						
					}
					$("#warehouse_address").multiselect('refresh');
				}
			});
		},
		_renderData:function(){
			
			var self = this;
			Service.getReplenishPlanById(self._id,function(data){

				$("#planNumber").val(data.result.number);
				
				$("#planRemark").val(data.result.remark);
				$("#executiveTime").val(cloud.util.dateFormat(new Date(data.result.executiveTime),"yyyy/MM/dd"));
				//self.userId = data.result.executivePersonId;
				
				self.executivePersonId = data.result.executivePersonId;
				if (data.result.lineIds && data.result.lineIds.length > 0) {
					self.lineIds = data.result.lineIds;
                    
                }
				
				var arr = [];
				if(data.result.equipStatus){
					
					for(var i=0;i<data.result.equipStatus.length;i++){
						arr[i] = data.result.equipStatus[i].assetId;
						
					}
					self.equipstatus = data.result.equipStatus;
					
				}
				self.assetIds = arr;
				
				self._render();
			});
			
			
		},

        _renderBtn: function() {
        	var self = this;
        	$("#nextBase").bind("click", function() {

        		var number = $("#planNumber").val();
        		var remark = $("#planRemark").val();
        		var executiveTime = $("#executiveTime").val();
        		
        		
        		if(executiveTime){
        			executiveTime = (new Date(executiveTime)).getTime()/1000;
        		}
        		/*if(name == null || name.replace(/(^\s*)|(\s*$)/g,"")==""){
        			dialog.render({lang:"please_enter_plan_name"});
           			return;
        		}*/
        		var executivePersonId = $("#executive_person").find("option:selected").attr('id');
        		var executivePersonEmail = $("#executive_person").find("option:selected").val();
        		var executivePersonName = $("#executive_person").find("option:selected").text();
        		var warehouseId;
        		var warehouseName;
        		if(self.languge == "en"){
        			warehouseId = $("#warehouse_address").find("option:selected").attr('id');
            		warehouseName =  $("#warehouse_address").find("option:selected").text();
        		}
        
        		var replenishLine = $("#replenishline").multiselect("getChecked").map(function() {//线路
                    return this.value;
                }).get();
        		
        		if(executivePersonId == null || executivePersonId == ""){
        			dialog.render({lang:"please_select_executive_person"});
           			return;
        		}
        		if(replenishLine.length == 0){
        			dialog.render({lang:"please_select_replenish_line"});
           			return;
        		}
        		
        		var replenishLineName = $("#replenishline").find("option:selected");
                var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
                var userName = cloud.storage.sessionStorage("accountInfo").split(",")[5].split(":")[1];
                var email = cloud.storage.sessionStorage("accountInfo").split(",")[2].split(":")[1];
                self.basedata={
                		executivePersonId:executivePersonId,
                		executivePerson:executivePersonName,
                		executiveTime:executiveTime,
                		lineIds:replenishLine,
                		createPersonId:userId,
                		createPerson:userName,
                		number:number,
                		remark:remark,
                	    cpemail:email,
                	    epemail:executivePersonEmail,
                	    warehouseId:warehouseId,
                	    warehouseName:warehouseName
                };
                
                var line = [];
                for(var m=0;m<replenishLine.length;m++){
                	var info = {
                			"lineId":replenishLine[m],
                			"lineName":replenishLineName.eq(m).text()
                	}
                	line.push(info);
                }
                self.line = line;
            						
				$("#devicelist").css("display", "block");

                $("#baseInfo").css("display", "none");
                $("#tab1").removeClass("active");
                $("#tab2").addClass("active");
                this.Devicelist = new DevicelistInfo({
                    selector: "#devicelistInfo",
                    automatWindow: self.adWindow,
                    assetIds:self.assetIds,
                    basedata:self.basedata,
                    lines:self.line,
                    planId:self._id,
                    equipstatus:self.equipstatus,
                    events: {
                        "getplanList": function() {
                            self.fire("getplanList");
                        }
                    }
                });

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