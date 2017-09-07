define(function(require) {
    require("cloud/base/cloud");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./list.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    var Service = require("../service");
    var NoticeBar = require("./notice-bar");
    var SelfConfigInfo = require("../goodsConfig/selfConfig");
    var CoffeeSelfConfigInfo = require("../coffeeGoodsConfig/selfConfig");
    var columns = [{
        "title": locale.get({lang: "network"}),
        "dataIndex": "online",
        "cls": null,
        "width": "16%",
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
        "title": locale.get({lang: "numbers"}),
        "dataIndex": "assetId",
        "cls": null,
        "width": "28%"
    }, {
        "title": locale.get({lang: "organization"}),
        "dataIndex": "siteName",
        "cls": null,
        "width": "28%"
    }, {
        "title": locale.get({lang: "automat_line"}),
        "dataIndex": "lineName",
        "cls": null,
        "width": "28%"
    }];
   
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(html);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
                bar: {
                    id: "deviceVending_list_bar",
                    "class": null
                },
                table: {
                    id: "deviceVending_list_table",
                    "class": null
                },
                paging: {
                    id: "deviceVending_list_paging",
                    "class": null
                }
            };
            this._render();
        },
        _render: function() {
			$("#deviceVending_list_paging").css("width",$(".wrap").width()*0.25);
			$("#deviceVending_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height());
			
		    var listHeight = $("#deviceVending_list").height();
	        var barHeight = $("#deviceVending_list_bar").height()*2;
		    var tableHeight=listHeight - barHeight;
		    $("#deviceVending_list_table").css("height",tableHeight);
		    
		    require(["cloud/base/fixTableHeaderV"], function(Account){
            	var height = $("#deviceVending_list_table").height()+"px";
      	        $("#deviceVending_list_table-table").freezeHeaderV({ 'height': height });
            });
		    
		    this._renderNoticeBar();
            this._renderTable();
        },
        
        stripscript: function(s) {
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '');
            }
            return rs;
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
            }else if(type==5){
            	type = locale.get({lang: "wine_machine"});
            }
        	return type;
        },
        /**
         * 展示货道信息
         */
        renderShelfConfig:function(data){
        	var self = this;
        	$("#shelf_right").html("");
        	cloud.util.mask("#shelf_right");
        	
        	if(data.result.masterType == 4){
        		this._renderCoffeeSelfConfig();
        	    var masterType = self.getMachineType(data.result.masterType);
        		if(data.result.goodsConfigsNew){
                    self.CoffeeSelfConfig.getTab(data.result.goodsConfigsNew,data.result.modelConfigsNew,data.result.assetId+"("+masterType+")");
                }else{
                    self.CoffeeSelfConfig.getTab(data.result.goodsConfigs,data.result.modelConfigsNew,data.result.assetId+"("+masterType+")");
                }
                
               
                self.CoffeeSelfConfig.setconfig(data.result.assetId,masterType);
                self.CoffeeSelfConfig.getData(data.result);
                   
                if(data.result.containersNew){
                    self.CoffeeSelfConfig.getOtherTab(data.result.containersNew);
                }else{
                    self.CoffeeSelfConfig.getOtherTab(data.result.containers);
                }
        	}else{
        		this._renderSelfConfig();
        		var masterType = self.getMachineType(data.result.masterType);
        		if(data.result.goodsConfigsNew){
                    self.SelfConfig.getTab(data.result.goodsConfigsNew,data.result.assetId+"("+masterType+")");
                }else{
                    self.SelfConfig.getTab(data.result.goodsConfigs,data.result.assetId+"("+masterType+")");
                }
                
                var masterType = self.getMachineType(data.result.masterType);
                self.SelfConfig.setconfig(data.result.assetId,masterType);
                self.SelfConfig.getData(data.result);
                   
                if(data.result.containersNew){
                    self.SelfConfig.getOtherTab(data.result.containersNew);
                }else{
                    self.SelfConfig.getOtherTab(data.result.containers);
                }
        	}
            
            cloud.util.unmask("#shelf_right");
        },
        /**
         * 判断当前配置和运行配置是否相同
         */
        checkConfig:function(data){
    		var masterflag = true;  
    		var containerflag = true;
    		//主柜
    		var goodsConfigs = null;
    		var goodsConfigsNew = null;
    		if(data.goodsConfigs){
    			goodsConfigs = data.goodsConfigs;
    		}else{
    			masterflag = false;
    		}
    		if(data.goodsConfigsNew){
    			goodsConfigsNew = data.goodsConfigsNew;
    		}else{
    			masterflag = false;
    		}
    		if(goodsConfigsNew){
    			if(goodsConfigs.length != goodsConfigsNew.length){
        			masterflag = false;
        		}else{
        			for(var i=0;i<goodsConfigs.length;i++){
        				if(goodsConfigsNew[i].location_id != goodsConfigs[i].location_id){
        					masterflag = false;
    						break;
    					}
    					if(goodsConfigsNew[i].goods_id != goodsConfigs[i].goods_id){
    						masterflag = false;
    						break;
    					}
    					if(goodsConfigsNew[i].price != goodsConfigs[i].price){
    						masterflag = false;
    						break;
    					}
    					if(goodsConfigsNew[i].imagemd5 != goodsConfigs[i].imagemd5){
    						masterflag = false;
    						break;
    					}
        			}
        		}
    		}
    		
    		//辅柜
    		var containerconfig=null;
    		var containerconfignew =null;
    		if(data.containers){
    		    containerconfig = data.containers;
    		}else{
				containerflag = false;
			}
    		if(data.containersNew){
    			containerconfignew = data.containersNew;
     		}else{
				containerflag = false;
			}
    		if(containerconfig && containerconfignew){
    			if(containerconfig.length != containerconfignew.length){
    				containerflag = false;
    			}else{
            		for(var i=0;i<containerconfig.length;i++){
            			if(containerconfig[i].type != containerconfignew[i].type){
    						containerflag = false;
    					}
            			if(containerconfig[i].cid != containerconfignew[i].cid){
    						containerflag = false;
    					}else{
    						var cshelves = containerconfig[i].shelves;
    						var cshelvesnew = containerconfignew[i].shelves;
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
    		}else if(containerconfig == null  && containerconfignew == null){
    			containerflag = true;
    		}
    		
    		if(masterflag && containerflag){
    			return true;
    		}else{
    			return false;
    		}
        },
       _renderSelfConfig:function(){
       	 this.SelfConfig = new SelfConfigInfo({
                selector: "#shelf_right"
         });
       },
       _renderCoffeeSelfConfig:function(){

         	 this.CoffeeSelfConfig = new CoffeeSelfConfigInfo({
              selector: "#shelf_right"
           });
         },
       _renderWhetherToSynchronize:function(assetId){
    	   var self = this;
           Service.getAutomatsByAssetId(assetId, function(data) {
           	console.log(data);
           	if(data && data.result){
           	  var flag = self.checkConfig(data.result);//判断当前配置和运行配置是否相同
           	  if(!flag){
           		  dialog.render({
           			  lang:"whether_to_synchronize",
           			  buttons: [{
     					      text: "确定",
                             click: function() {
                           	  var subdata = {};
                             	  subdata.goodsConfigsNew = data.result.goodsConfigs;
                             	  if(data.result.containers){
                             		subdata.containersNew = data.result.containers;
                             	  }
                             	 var languge = localStorage.getItem("language");
                             	 if(languge=="en"){
                             		dialog.close();
                             		data.result.goodsConfigsNew = data.result.goodsConfigs;
                                 	  if(data.result.containers){
                                 		 data.result.containersNew = data.result.containers;
                                 	  }
                                 	self.renderShelfConfig(data);//展示货道信息
                             	 }else{
                             	       Service.updateAutomat(data.result._id, subdata, function(edata) {
                                           if (edata.error_code == null && edata.result) {
                                           	dialog.close();
                                           	self.renderShelfConfig(edata);//展示货道信息
                                           } else{
                                               dialog.render({lang: "synchronize_failed"});
                                               return;
                                           }
                                           
                                       }, self);
                             	 }
                          
                             }
 				          },{
 					         text: "取消",
                             click: function() {
                                 dialog.close();
                                 self.renderShelfConfig(data);//展示货道信息
                                
                             }
 				         }],
 				        width:450,
 	    				height:180
 				     });
           	  }else{
           		  self.renderShelfConfig(data);//展示货道信息
           	  }
           	}else{
           		dialog.render({lang: "the_vending_machine_number_you_entered_does_not_exist"});
           	}
           });
       },
        _renderTable: function() {
        	var self = this;
            this.listTable = new Table({
                selector: "#deviceVending_list_table",
                columns: columns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox: "none",
                events: {
                    onRowClick: function(data) { 
                        this.listTable.unselectAllRows();
                        var rows = this.listTable.getClickedRow();
                        this.listTable.selectRows(rows);
                        
                        $("tr").css("border-bottom","0px");
                        $(".cloud-table-shadow").css("border-bottom","2px solid #419277");
                        $("#shelf_right").html("");
                        
                        var assetId = data.assetId;
                        self._renderWhetherToSynchronize(assetId);
                    },
                    onRowRendered: function(tr, data, index) {
                        var self = this;
                        if(index == 0){
                        	var assetId = data.assetId;
                            self._renderWhetherToSynchronize(assetId);
                            $(tr).addClass("cloud-table-shadow");
                            $(tr).css("border-bottom","2px solid #419277");
                        }
                       
                    },
                    scope: this
                }
            });
           
            this.setDataTable();
        },
        setDataTable: function() {
            this.loadTableData(30, 0, "");
        }, 
        loadTableData: function(limit, cursor, areaVal) {
            cloud.util.mask("#deviceVending_list_table");
	        var self = this;
            
	        var search = $("#search").val();
	        var searchValue = $("#searchValue").val();
	        if (searchValue) {
	           searchValue = self.stripscript(searchValue);
	        }
            
	        var siteName = null;
	        var assetId = null;
	        var lineId = "";
	        
	        if (search == 0) {
	               assetId = searchValue;
	        } else if (search == 1) {
	               siteName = searchValue;
	        }else if (search == 2) {
	        	   if($("#userline").attr("multiple") != undefined){
		            	lineId = $("#userline").multiselect("getChecked").map(function() {
		                      return this.value;
		                  }).get();
		           }
	        }
	        var shelf_manage_assetId = localStorage.getItem("shelf_manage_assetId");
            if(shelf_manage_assetId){
            	assetId = shelf_manage_assetId;
            }
	                  
	        var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
	        var roleType = permission.getInfo().roleType;
	        Service.getAreaByUserId(userId,function(areadata){
	              var areaIds=[];
	              if(areadata && areadata.result && areadata.result.area && areadata.result.area.length>0){
	                  areaIds = areadata.result.area;
	              }
	              if(roleType == 51){
	                  areaIds = [];
	              }
	                      
	              if(roleType != 51 && areaIds.length == 0){
	                  areaIds = ["000000000000000000000000"];
	              }
	              cloud.Ajax.request({
	      	   	       url:"api/automatline/list",
	      			   type : "GET",
	      			   parameters : {
	      			       areaId: areaIds,
	      			       cursor:0,
	      			       limit:-1
	      	           },
	      			   success : function(linedata) {
	      				  var lineIds=[];
 			    		  if(linedata && linedata.result && linedata.result.length>0){
 			    			  for(var i=0;i<linedata.result.length;i++){
 			    				  lineIds.push(linedata.result[i]._id);
 			    			  }
 		                   }
 			    		  
 			    		  if(roleType == 51 ){
 			    			  lineIds = [];
 			              }
 			    		  if(lineId.length != 0){
 			    			  lineIds = lineId;
 			    		  }
 			    		  
 			    		  if(roleType != 51 && lineIds.length == 0){
 			    			   lineIds = ["000000000000000000000000"];
 			    		  }
 			                self.lineIds = lineIds;
	      			                
	      			         self.searchData = {
	      			                "siteName": siteName,
	      			                "assetId": assetId,
	      			                "lineId": lineIds
	      			         };
	      			            	 
	      			         Service.getAllAutomatsByPage(self.searchData, limit, cursor, function(data) {
	      			                      var total = data.result.length;
	      			                      self.pageRecordTotal = total;
	      			                      self.totalCount = data.result.length;
	      			                     
	      			                      self.listTable.render(data.result);
	      			                      self._renderpage(data, 1);
	      			                      localStorage.setItem("shelf_manage_assetId","");
	      			                      cloud.util.unmask("#deviceVending_list_table");
	      			         }, self);  
	      			     }
	       			});
	           });

        },
        _renderpage: function(data, start) {
            var self = this;
            if (self.page) {
                self.page.reset(data);
            } else {
                self.page = new Paging({
                    selector: $("#deviceVending_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                    	cloud.util.mask("#deviceVending_list_table");
                        Service.getAllAutomatsByPage(self.searchData, options.limit, options.cursor, function(data) {
                        	
                            self.pageRecordTotal = data.total - data.cursor;
                            callback(data);
                            cloud.util.unmask("#deviceVending_list_table");
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
		   if($("#deviceVending_list_paging .paging-box")[0]){
			   var id = $("#deviceVending_list_paging .paging-box")[0].id;
			    $("#"+id).removeClass("paging-box");
			    $("#"+id).css("margin","0 auto");
			    $("#"+id).css("margin-top","3px");
			    $("#"+id).css("height","23px");
			    $("#"+id).css("margin-left","12%");
		   }
		   
        },
        _renderNoticeBar: function() {
            var self = this;
            this.noticeBar = new NoticeBar({
                selector: "#deviceVending_list_bar",
                events: {
                    query: function() {
                    	self.loadTableData(30, 0, "");
                    },
                   
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
        }  
    });
    return list;
});