define(function(require) {
	var cloud = require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
    var _Window = require("cloud/components/window");
	var winHtml = require("text!./relateAutomat.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	require("./css/common.css");
	var Service = require("../service");
	
	var columns = [{
        "title": locale.get({lang: "network"}),
        "dataIndex": "online",
        "cls": null,
        "width": "6%",
        render: function(data, type, row) {
            var display = "";
            if ("display" == type) {
                switch (data) {
                    case 1:
                        var offlineStr = locale.get({lang: "offline"});
                        display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-offline\" title = \"#{status}\"}></div>")
                                .evaluate({
                            status: offlineStr
                        });
                        break;
                    case 0:
                        var onlineStr = locale.get({lang: "online"});
                        display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-online\" title = \"#{status}\"}></div>")
                                .evaluate({
                            status: onlineStr
                        });
                        break;
                    default:
                        break;
                }
                return display;
            } else {
                return data;
            }
        }
    }, {
        "title": locale.get({lang: "automat_no1"}),
        "dataIndex": "assetId",
        "cls": null,
        "width": "15%"
    }, {
        "title": locale.get({lang: "automat_name"}),
        "dataIndex": "name",
        "cls": null,
        "width": "15%"
    }, {
        "title": locale.get({lang: "automat_site_name"}),
        "dataIndex": "siteName",
        "cls": null,
        "width": "17%"
    }, {
        "title": locale.get({lang: "automat_line"}),
        "dataIndex": "lineName",
        "cls": null,
        "width": "17%"
    },{
        "title": locale.get({lang: "create_time"}),
        "dataIndex": "createTime",
        "cls": null,
        "width": "20%",
        render: function(data, type, row) {
            return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
        }
    }, {
        "title": locale.get({lang: "synchronization"}),
        "dataIndex": "",
        "cls": null,
        "width": "10%"
    }];
  
    var config = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.templateId = options.templateId;
            this.element.html(winHtml);
            
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
                table: {
                    id: "device_list_table",
                    "class": null
                },
                paging: {
                    id: "device_list_paging",
                    "class": null
                }
            };
            locale.render({element: this.element});
            this.automatWindow = options.automatWindow;
            this.subData = options.subData;
            this.tempData = options.tempData;
            this.buttonAutomatId = [];
            
            this.relateAutomatA = [];
            if(this.tempData && this.tempData.relateAutomat){
            	this.relateAutomatA = this.tempData.relateAutomat;
            }
            
            this.relateIds = [];
            if(this.relateAutomatA != null && this.relateAutomatA.length>0){
            	for(var i=0;i<this.relateAutomatA.length;i++){
            		this.relateIds.push(this.relateAutomatA[i].automatid);
            	}
            }
         
            this.render();
            
            
        },
        render: function() {
        	var self = this;
        	$("#lastStep").val(locale.get({lang: "price_step"}));
        	$("#saveBase").val(locale.get({lang: "price_finished"}));
            this.sumitButtonClick();//点击 完成  按钮
            this.lastSetpButtonClick();//点击 上一步 按钮
            this.renderDeviceTable();
            
            var languge = localStorage.getItem("language");
            if (languge == "en") {
            	$("#button_op").css("width","100%");
            }
            $("#relate-cid-cancel").bind('click',function(){
            	
            	$("#cidA").hide();
            	
            });
            console.log(self.relateIds);
            $("#relate-cid-save").bind('click',function(){
            	
            	var cid = [];
            	var automatid = $("#master").attr("name");
            	var input = $("#cidT").find("input");
            	
            	
            	$("#cidT input").each(function(){
            	    if ($(this).is(':checked')) {
            	    	cid.push($(this).attr("id"));
            	    } 

            	});
            	
            	if(cid.length > 0){
            		
            		for(var i=0;i<self.buttonAutomatId.length;i++){
            			
            			if(automatid == self.buttonAutomatId[i].automatid){
            				var buttonid = self.buttonAutomatId[i].buttonid;
            				var td = $("#"+buttonid).parent().parent().find('td');
            				var span = $(td[7]).find('span');
            				
            				if(span.length <= 0){
            					
            					$(td[7]).append("<span class='mask-pin'></span>");
            				}else{
            					$(span).css('display','inline-block');
            					
            				}
            				
            			}
            			
            		}
            	}else{
                    for(var i=0;i<self.buttonAutomatId.length;i++){
            			
            			if(automatid == self.buttonAutomatId[i].automatid){
            				var buttonid = self.buttonAutomatId[i].buttonid;
            				var td = $("#"+buttonid).parent().parent().find('td');
            				var span = $(td[7]).find('span');
            				
            				if(span.length > 0){
            					$(span).css('display','none');
            				}
            				
            				
            			}
            			
            		}
            		
            	}
        		var relate = {
            			automatid:automatid,
            			cid:cid
            	}
            	
        		for(var m=0;m<self.relateAutomatA.length;m++){
        			if(automatid == self.relateAutomatA[m].automatid){
        				self.relateAutomatA.splice(m,1);
        				self.relateIds.splice(m,1);
        			}
        		}
        		
            	self.relateAutomatA.push(relate);

            	$("#cidA").hide();
            	
            });
        },
        renderDeviceTable:function(){
        	var self=this;
            this.listTable = new Table({
                selector: "#device_list_table",
                columns: columns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox: "full",
                events: {
                    onRowClick: function(data) { 
                    	var self = this;
                    	
                        this.listTable.unselectAllRows();
                        var rows = this.listTable.getClickedRow();
                        this.listTable.selectRows(rows);
                        $("#cidT").html("");
                        var machineType = self.subData.machineType;
                        if(machineType == data.masterType){
                        	$("#cidT").append("<tr><td style='padding: 10px 15px;'>" +
                        			"<lable for='master' style='width: 80px;position: absolute;'>"+data.assetId+"</lable>" +
                        			"<input id='master' name='"+data._id+"' type='checkbox' style='height:20px;width:20px;margin-left:80px' />" +
                        			"</td></tr>");
                        }
                        
                        
                        if(data.containers != null && data.containers.length > 0){
                        	var len = data.containers.length;
                        	for(var i=0;i<len;i++){
                        		var cid = data.containers[i].cid;
                        		var type = data.containers[i].type;
                        		if(type == machineType){
                        			$("#cidT").append("<tr><td style='padding: 10px 15px;'>" +
                                			"<lable for='"+cid+"' style='width: 80px;position: absolute;'>"+cid+"</lable>" +
                                			"<input id='"+cid+"' type='checkbox' style='height:20px;width:20px;margin-left:80px' />" +
                                			"</td></tr>");
                        		}
                        		
                        	}
                        	
                        }
                        
                        for(var j=0;j<self.relateAutomatA.length;j++){
                        	
                        	if(data._id == self.relateAutomatA[j].automatid){
                        		for(var n=0;n<self.relateAutomatA[j].cid.length;n++){
                        			
                        			$("#"+self.relateAutomatA[j].cid[n]).attr("checked",true);
                        		}
                        		
                        	}
                        	
                        }
                        $("#cidA").show();
                    },
                    onRowRendered: function(tr, data, index) {
                        var self = this;   
                    	var buttonIdData = {};
                        var buttonid = $(tr).find('a').attr('id');
                        var automatid = data._id;
                        buttonIdData.buttonid = buttonid;
                        buttonIdData.automatid = automatid;
                        self.buttonAutomatId.push(buttonIdData);
                        
                        var id = data._id;
                        var td = $(tr).find('td');
                        var span = $(td[7]).find('span');
                        console.log(self.relateIds);
                        if($.inArray(id,self.relateIds) > -1){
                        	if(span.length == 0){
                        		$(td[7]).append("<span class='mask-pin'></span>");
                        	}else{
                        		$(span).css('display','inline-block');
                        	}
                        	
                        }
                       
             
                    },
                    scope: this
                }
            });
            var height = $("#device_list_table").height()+"px";
	        $("#device_list_table-table").freezeHeader({ 'height': height });
            this.setDataTable();
        },
        setDataTable: function() {
            this.loadTableData(30, 0);
        }, 
        loadTableData: function(limit, cursor) {
            cloud.util.mask("#device_list_table");
            var self = this;
            self.searchData = {};
            
            if(self.subData.machineType == "3" || self.subData.machineType == 3){
            	self.searchData.machineType = 3;
            }else{
            	self.searchData.vender = self.subData.vender;
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
                self.searchData.lineId = lineIds;
                Service.getAllAutomatsByPage(self.searchData, limit, cursor, function(data) {
                    var total = data.result.length;
                    self.automatData = data.result;
                    self.pageRecordTotal = total;
                    self.totalCount = data.result.length;
                    self.listTable.render(data.result);
                    self._renderpage(data, 1);
                    cloud.util.unmask("#device_list_table");
                }, self);        
            });
        },
        _renderpage: function(data, start) {
            var self = this;
            if (self.page) {
                self.page.reset(data);
            } else {
                self.page = new Paging({
                    selector: $("#device_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                    	cloud.util.mask("#device_list_table");
                        Service.getAllAutomatsByPage(self.searchData, options.limit, options.cursor, function(data) {
                        	
                            self.pageRecordTotal = data.total - data.cursor;
                            callback(data);
                            cloud.util.unmask("#device_list_table");
                        });
                    },
                    turn: function(data, nowPage) {
                    	
                        self.totalCount = data.result.length;
                        self.listTable.clearTableData();
                        self.listTable.render(data.result);
                        self.nowPage = parseInt(nowPage);
                        
                    },
                    events: {
                        "displayChanged": function(display) {
                            self.display = parseInt(display);
                        }
                    }
                });
                this.nowPage = start;
            }
        },
        sumitButtonClick: function() {
            var self = this;
            var relateAutomat = new Array();
        	
        	
            $("#saveBase").bind("click", function() {
            	
            	console.log(self.automatData);
            	console.log(self.relateAutomatA);
            	console.log(self.buttonAutomatId);
            	var selectedResouces = self.getSelectedResources();
            	var flag = true;
            	var RelateAutomat = {};
				var rcv;
				var relateA = [];
            	for (var i = 0; i < selectedResouces.length; i++) {
                    var _id = selectedResouces[i]._id;

                    for(var j=0;j<self.automatData.length;j++){
                    	
                    	if(_id == self.automatData[j]._id){
                    		
                    		
                    		
                    		for(var k=0;k<self.relateAutomatA.length;k++){
                    			
                    			if(_id == self.relateAutomatA[k].automatid){
                    				
                    				relateA.push(self.relateAutomatA[k]);
                    				for(var m=0;m<self.relateAutomatA[k].cid.length;m++){
                    					
                    					if(self.relateAutomatA[k].cid[m] == "master"){
                    						
                    						if(self.automatData[j].goodsConfigsNew){
                    							if(self.subData.machineType == self.automatData[j].masterType && self.compareShelf(self.automatData[j].goodsConfigsNew)){
                        							
                        							
                        							//flag = true;
                        							
                        							
                        						}else{
                        							flag = false;
                        							
                        						}
                    							
                    						}else{
                    							
                    							if(self.subData.machineType == self.automatData[j].masterType && self.compareShelf(self.automatData[j].goodsConfigs)){
                        							
                        							
                        							//flag = true;
                        							
                        							
                        						}else{
                        							flag = false;
                        							
                        						}
                    						}
                    						
                    						
                    					}else{
                    						
                    						if(self.automatData[j].containersNew){
                    							for(var n=0;n<self.automatData[j].containersNew.length;n++){
                        							
                        							if(self.relateAutomatA[k].cid[m] == self.automatData[j].containersNew[n].cid){
                        								
                        								if(self.subData.machineType == self.automatData[j].containersNew[n].cid && self.compareShelf(self.automatData[j].containersNew[n].shelves)){
                        									//flag = true;
                        								}else{
                        									flag = false;
                        								}
                        							}
                        							
                        						}
                    						}else{
                    							for(var n=0;n<self.automatData[j].containers.length;n++){
                        							
                        							if(self.relateAutomatA[k].cid[m] == self.automatData[j].containers[n].cid){
                        								
                        								if(self.subData.machineType == self.automatData[j].containers[n].cid && self.compareShelf(self.automatData[j].containers[n].shelves)){
                        									//flag = true;
                        								}else{
                        									flag = false;
                        								}
                        							}
                        							
                        						}
                    						}
                    						
                    						
                    					}
                    				}
                    				
                    				rcv = true;
                    				break;
                    				
                    			}else{
                    				rcv = false;
                    			}
                    			
                    		}
                    		
                    	}
                    }
                    
                }
            	
            	if(selectedResouces.length != 0 && (!rcv || !flag) ){
            		
            		dialog.render({lang: "automat_shelf_not_same"});
                    return;
            		
            	}else{
            		
            		self.subData.relateAutomat = relateA;
                    console.log(self.subData);
            		if(self.templateId){
            			Service.updateTemplateInfo(self.templateId,self.subData, function(data) {
                            if (data.error_code == null) {
                                cloud.util.unmask("#deviceForm");
                                self.automatWindow.destroy();
                                self.fire("rendTableData");
                            } else if (data.error_code == "70024") {//模板名称已存在
                                dialog.render({lang: "automat_name_exists"});
                                return;
                            }
                        }, self);
            			
            		}else{
            			Service.addTemplateInfo(self.subData, function(data) {
                            if (data.error_code == null) {
                                cloud.util.unmask("#deviceForm");
                                self.automatWindow.destroy();
                                self.fire("rendTableData");
                            } else if (data.error_code == "70024") {//模板名称已存在
                                dialog.render({lang: "automat_name_exists"});
                                return;
                            }
                        }, self);
            		}
            		
            		
            		
            	}
            	
            	
            });
        },
        compareShelf: function(data){
        	
        	var self = this;
        	var count = 0;
        	console.log(self.subData);
        	if(data != null && self.subData.shelves.length == data.length){
        		
        		for(var i =0;i<self.subData.shelves.length;i++){
        			
        			var location_id = self.subData.shelves[i].shelvesId;
        			for(var j=0;j<data.length;j++){
        				if(data[j].location_id == location_id){
        					count++;
        					break;
        				}
        				
        			}
        			
        			
        		}
        		
        		if(count == data.length){
        			return true;
        		}else{
        			return false;
        		}
        	}else{
        		return false;
        	}
        	
        },
        lastSetpButtonClick: function() {
            $("#lastStep").bind("click", function() {
                $("#relateAutomatConfig").css("display", "none");
                $("#baseInfo").css("display", "block");
                $("#tab2").removeClass("active");
                $("#tab1").addClass("active");
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
        }
      
    });
    return config;
});