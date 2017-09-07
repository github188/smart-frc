define(function(require) {
	var cloud = require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
    var _Window = require("cloud/components/window");
	var winHtml = require("text!./selectAutomat.html");
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
            this.element.html(winHtml);
            this.templateId = options.templateId;
            this.relateAutomat = options.relateAutomat;
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
            this.nowConfig = options.nowConfig;//当前模板的货道配置信息
            
            this.updateAutomatArray=[];
            this.buttonAutomatId = [];
            
            this.relate = [];
            
            this.relateIds = [];
            if(this.relateAutomat != null && this.relateAutomat.length>0){
            	for(var i=0;i<this.relateAutomat.length;i++){
            		this.relateIds.push(this.relateAutomat[i].automatid);
            		this.relate.push(this.relateAutomat[i]);
            	}
            	
            }
            if(this.relate && this.relate.length>0){
     			for(var k=0;k<this.relate.length;k++){
     				this.updateAutomatArray.push(this.relate[k]);
     			}
     		}
            
            $("#lastStep").val(locale.get({lang: "price_step"}));
        	$("#saveBase").val(locale.get({lang: "price_finished"}));
        	
            this.render();
        },
        render: function() {
        	var self = this;
        	this.renderDeviceTable();
        	this.bindEvent();
        },
        bindEvent:function(){
        	 var self = this;
        	 $("#saveBase").bind("click", function() {
        		 self.nowConfig.relateAutomat = self.updateAutomatArray;
        		 console.log(self.nowConfig);
        		 if(self.templateId){
        			 Service.updateTemplateInfo(self.templateId,self.nowConfig, function(data) {
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
        			 Service.addTemplateInfo(self.nowConfig, function(data) {
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
        	 });
        	 $("#relate-cid-save").bind('click',function(){
        		 var cid = [];
        		 var assetId = "";
        		 var deviceId="";
        		 $("#cidT input").each(function(){
             	    if ($(this).is(':checked')) {
             	    	var config={
             	    	    assetId:$(this).attr("name"),//售货机编号
             	    	    deviceId:$(this).attr("deviceId"),//售货机ID
             	    		cid:$(this).attr("id"),//货柜编号
             	    		shelfCount:$(this).attr("shelfCount"),//货柜数量是否一致
             	    		shelfNumber:$(this).attr("shelfNumber")//货柜编号是否一致
             	    	};
             	    	cid.push(config);
             	    	assetId = $(this).attr("name");//售货机编号
             	    	deviceId = $(this).attr("deviceId");
             	    }else{
             	    	console.log(self.updateAutomatArray);
             	    	if(self.updateAutomatArray && self.updateAutomatArray.length>0){
             	    		for(var m=0;m<self.updateAutomatArray.length;m++){
             	    			if(self.updateAutomatArray[m].automatid == $(this).attr("deviceId")){
             	    				if(self.updateAutomatArray[m].cid.length>0){
             	    					for(var n=0;n<self.updateAutomatArray[m].cid.length;n++){
             	    						if(self.updateAutomatArray[m].cid[n] == $(this).attr("id")){
             	    							self.updateAutomatArray[m].cid.splice(n, 1);
             	    						}
             	    					}
             	    				}
             	    			}
             	    		}
             	    		for(var m=0;m<self.updateAutomatArray.length;m++){
             	    			if(self.updateAutomatArray[m].cid.length == 0){
             	    			   for(var ii=0;ii<self.buttonAutomatId.length;ii++){
             	 	        			if(self.updateAutomatArray[m].automatid == self.buttonAutomatId[ii].id){
             	 	        				var buttonid = self.buttonAutomatId[ii].buttonid;
             	            				var td = $("#"+buttonid).parent().parent().find('td');
             	            				$(td[7]).html("");
             	 	        			}
             	 	        		}
             	    			   self.updateAutomatArray.splice(m, 1);
             	    			}
             	    		}
             	    	}
             	    	console.log(self.updateAutomatArray);
             	    } 
             	});
        		var ok_flag_count = true;
        	    var ok_flag_number = true;
        		if(cid.length>0){
        			 var cids=[];
        			 for(var i=0;i<cid.length;i++){
        				 if(cid[i].shelfCount == "false"){//货柜数量不一致
        					 ok_flag_count = false;
                     		 var b =  locale.get({lang: "the_count_of_containers_and_templates_are_not_consistent"});
                     		 var message = cid[i].cid+b;
                     	     dialog.render({text:message});
        	    			 return;
        				 }
        				 if(cid[i].shelfNumber == "false"){//货柜编号不一致
        					 ok_flag_number = false;
                     		 var b =  locale.get({lang: "the_number_of_containers_and_templates_are_not_consistent"});
                     		 var message = cid[i].cid+b;
                     	     dialog.render({text:message});
        	    			 return;
        				 }
        				 cids.push(cid[i].cid);
        			 }
        			
        			 if(ok_flag_count && ok_flag_number){
     	        		var passAutomat={
     	        				automatid:deviceId,
     	        				cid:cids
     	        		};
     	        		var fg = false;
     	        		for(var s=0;s<self.updateAutomatArray.length;s++){
     	        			var temp = self.updateAutomatArray[s];
     	        			if(temp.automatid == deviceId){
     	        				fg = true;
     	        				self.updateAutomatArray[s] = passAutomat;
     	        			}
     	        			
     	        		}
     	        		if(!fg){
     	        			self.updateAutomatArray.push(passAutomat);
     	        		}
     	        		
     	        		
     	        	 }
 	        		 for(var ii=0;ii<self.buttonAutomatId.length;ii++){
 	        			if(assetId == self.buttonAutomatId[ii].assetId){
 	        				var buttonid = self.buttonAutomatId[ii].buttonid;
            				var td = $("#"+buttonid).parent().parent().find('td');
            				var span = $(td[7]).find('span');
            				if(span.length <= 0){
            					$(td[7]).append("<span class='mask-pin'></span>");
            				}else{
            					$(span).css('display','inline-block');
            				}
 	        			}
 	        		}
        		}
        		 $("#cidA").hide();
        	 });
        	 
        	 $("#lastStep").bind("click", function() {
                 $("#relateAutomatConfig").css("display", "none");
                 $("#baseInfo").css("display", "block");
                 $("#tab2").removeClass("active");
                 $("#tab1").addClass("active");
             });
        	 $("#relate-cid-cancel").bind('click',function(){
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
                        self.tbSelectedAutomatConfig(data);
                    },
                    onRowRendered: function(tr, data, index) {
                    	 var self = this;   
                       	 var buttonIdData = {};
                         var buttonid = $(tr).find('a').attr('id');
                         var assetId = data.assetId;
                         buttonIdData.buttonid = buttonid;
                         buttonIdData.assetId = assetId;
                         buttonIdData.id = data._id;
                         self.buttonAutomatId.push(buttonIdData);
                         
                         var id = data._id;
                         var td = $(tr).find('td');
                         var span = $(td[7]).find('span');
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
        tbSelectedAutomatConfig:function(data){
        	var self = this;
        	
        	$("#cidT").html("");
        	var machineType = self.nowConfig.machineType;
        	var shelfCount  = false;//货道数量
        	var shelfNumber = false;//货道编号
        	
        	var nowShelvesArray=[];//当前模板的货道编号
        	if(self.nowConfig.shelves.length>0){
        		for(var i=0;i<self.nowConfig.shelves.length;i++){
        			nowShelvesArray.push(self.nowConfig.shelves[i].shelvesId);
        		}
        	}
        	
        	//判断选中的售货机的主柜 和 当前模板的 是否一致
        	if(machineType == data.masterType){ //货柜类型一致
        		if(data.goodsConfigsNew.length == self.nowConfig.shelves.length){//货道数量一致
        			shelfCount=true;
        			
        			var masterShelvesArray=[];//当前主柜的货道编号
                	if(data.goodsConfigsNew.length>0){
                		for(var i=0;i<data.goodsConfigsNew.length;i++){
                			masterShelvesArray.push(data.goodsConfigsNew[i].location_id);
                		}
                	}
                	
        			if(masterShelvesArray.sort().toString() == nowShelvesArray.sort().toString() ){//货柜编号一致
        				shelfNumber = true;
                	}else{
                		shelfNumber = false;
                	}
        		}else{
        			shelfCount=false;
        		}
        		
        		var checked = false;
        		
        		if(self.updateAutomatArray.length>0){
        			for(var i=0;i<self.updateAutomatArray.length;i++){
        				if(self.updateAutomatArray[i].automatid == data._id){
        					if(self.updateAutomatArray[i].cid.length>0){
        						for(var j=0;j<self.updateAutomatArray[i].cid.length;j++){
        							if(self.updateAutomatArray[i].cid[j] == data.assetId){
        								checked = true;
        							}
        						}
        					}
        				}
        			}
        		}
        		
            	$("#cidT").append("<tr><td style='padding: 10px 15px;'>" +
            			"<lable for='master' style='width: 80px;position: absolute;'>"+data.assetId+"</lable>" +
            			"<input id='"+data.assetId+"' name='"+data.assetId+"' deviceId='"+data._id+"'  shelfCount='"+shelfCount+"' shelfNumber='"+shelfNumber+"' type='checkbox' style='height:20px;width:20px;margin-left:80px' />" +
            			"</td></tr>");
            	if(checked){
            		$("#"+data.assetId).attr("checked","true");
            	}else{
            		if($("#"+data.assetId).attr("checked")){
            			$("#"+data.assetId).removeAttr("checked");
            		}
            	}
            }
        	//判断选中的售货机的辅柜 和 当前模板的 是否一致
        	if(data.containersNew != null && data.containersNew.length > 0){
            	var len = data.containersNew.length;
            	for(var i=0;i<len;i++){
            		var cid = data.containersNew[i].cid;
            		var type = data.containersNew[i].type;
            		
            		if(type == machineType){//货柜类型一致
            			if(data.containersNew[i].shelves.length == self.nowConfig.shelves.length){//货道数量一致
                			shelfCount=true;
                			var fuguiShelvesArray=[];//当前主柜的货道编号
                        	if(data.containersNew[i].shelves.length>0){
                        		for(var j=0;j<data.containersNew[i].shelves.length;j++){
                        			fuguiShelvesArray.push(data.containersNew[i].shelves[j].location_id);
                        		}
                        	}
                        	if(fuguiShelvesArray.sort().toString() == nowShelvesArray.sort().toString() ){//货柜编号一致
                				shelfNumber = true;
                        	}else{
                        		shelfNumber = false;
                        	}
                			
                		}else{
                			shelfCount=false;
                		}
            			
            			var checked = false;
                		
                		if(self.updateAutomatArray.length>0){
                			for(var i=0;i<self.updateAutomatArray.length;i++){
                				if(self.updateAutomatArray[i].automatid == data._id){
                					if(self.updateAutomatArray[i].cid.length>0){
                						for(var j=0;j<self.updateAutomatArray[i].cid.length;j++){
                							if(self.updateAutomatArray[i].cid[j] == cid){
                								checked = true;
                							}
                						}
                					}
                				}
                			}
                		}
                		
            			$("#cidT").append("<tr><td style='padding: 10px 15px;'>" +
                    			"<lable for='"+cid+"' style='width: 80px;position: absolute;'>"+cid+"</lable>" +
                    			"<input id='"+cid+"' name='"+data.assetId+"' deviceId='"+data._id+"'  shelfCount='"+shelfCount+"' shelfNumber='"+shelfNumber+"' type='checkbox' style='height:20px;width:20px;margin-left:80px' />" +
                    			"</td></tr>");
            			if(checked){
                    		$("#"+cid).attr("checked","true");
                    	}else{
                    		if($("#"+cid).attr("checked")){
                    			$("#"+cid).removeAttr("checked");
                    		}
                    	}
            		}
            	}
            }
        	$("#cidA").show();
        },
        setDataTable: function() {
            this.loadTableData(30, 0);
        }, 
        loadTableData: function(limit, cursor) {
            cloud.util.mask("#device_list_table");
            var self = this;
            self.searchData = {};
            
            if(self.nowConfig.machineType == "3" || self.nowConfig.machineType == 3){
            	self.searchData.machineType = 3;
            }else{
            	self.searchData.vender = self.nowConfig.vender;//根据厂家过滤
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