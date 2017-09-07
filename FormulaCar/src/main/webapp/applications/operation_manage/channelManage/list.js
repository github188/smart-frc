define(function(require) {
	var cloud = require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
    var Common = require("../../../common/js/common");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./list.html");
    var NoticeBar = require("./notice-bar");
    var Button = require("cloud/components/button");
    var Service = require("./service");
    var SelfConfigInfo = require("./goodsConfig/selfConfig");
   
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(html);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
                bar: {
                    id: "channel_list_bar",
                    "class": null
                },
                table: {
                    id: "channel_list_table",
                    "class": null
                }
            };
            this._render();
        },
        _render: function() {
        	$("#channel_list").css("width",$(".wrap").width());
			
			$("#channel_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#channel_list").height();
		    var barHeight = $("#channel_list_bar").height();
			var tableHeight=listHeight - barHeight;
			$("#channel_list_table").css("height",tableHeight);
		    this._renderDefault();
            this._renderNoticeBar();
        },
        stripscript: function(s) {
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '');
            }
            return rs;
        },
        _renderSelfConfig:function(){
        	 this.SelfConfig = new SelfConfigInfo({
                 selector: "#channel_list_table"
             });
        },
        _renderDefault:function(){
        	$("#channel_list_table").append("<div style='text-align: center;margin: 40px;height: 200px;'>"+
        			                        "<div style=' margin:0 auto; width:300px; height:200px;'><table style='width: 100%;height: 100%;text-align: left;'>"+
        			                        "<tr style='height:30px;'><td><label><span>操作步骤</span></label></td></tr>"+
        			                        "<tr style='height:30px;'><td><label><span>1.输入售货机编号</span></label></td></tr>"+
        			                        "<tr style='height:30px;'><td><label><span>2.点击[&nbsp;查询&nbsp;]按钮</span></label></td></tr>"+
        			                        "<tr style='height:30px;'><td><label><span>3.修改货道信息</span></label></td></tr>"+
        			                        "<tr style='height:30px;'><td><label><span>4.点击[&nbsp;保存&nbsp;]按钮</span></label></td></tr>"+
        			                        "</table></div>"+
        			                        "</div>");
        },
        _renderNoticeBar: function() {
            var self = this;
            this.noticeBar = new NoticeBar({
                selector: "#channel_list_bar",
                events: {
                	query: function() {//查询
                		var assetId = $("#assetId").val();
                		if(assetId){
                		}else{
                			dialog.render({lang: "enter_assetId"});
                			return;
                		}
                        Service.getAutomatsByAssetId(assetId, function(data) {
                        	console.log(data);
                        	
                        	if(data && data.result){
                        	  var flag = self.checkConfig(data.result);//判断当前配置和运行配置是否相同
                        	  if(!flag){
                        		  dialog.render({
                        			  lang:"whether_to_synchronize",
                        			  buttons: [{
                  					      lang: "affirm",
                                          click: function() {
                                        	  var subdata = {};
                                          	  subdata.goodsConfigsNew = data.result.goodsConfigs;
                                          	  if(data.result.containers){
                                          		subdata.containersNew = data.result.containers;
                                          	  }
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
              				          },{
              					         lang: "cancel",
                                         click: function() {
                                              dialog.close();
                                              self.renderShelfConfig(data);//展示货道信息
                                             
                                          }
              				         }]
              				     });
                        	  }else{
                        		  self.renderShelfConfig(data);//展示货道信息
                        	  }
                        	}else{
                        		dialog.render({lang: "the_vending_machine_number_you_entered_does_not_exist"});
                        	}
                        });
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
            }
        	return type;
        },
        /**
         * 展示货道信息
         */
        renderShelfConfig:function(data){
        	var self = this;
        	$("#channel_list_table").html("");
        	this._renderSelfConfig();
        	 
            if(data.result.goodsConfigsNew){
                self.SelfConfig.getTab(data.result.goodsConfigsNew);
            }else{
                self.SelfConfig.getTab(data.result.goodsConfigs);
            }
            
            var masterType = self.getMachineType(data.result.masterType);
            self.SelfConfig.setconfig(data.result.assetId,masterType);
            self.SelfConfig.getData(data.result);
               
            if(data.result.containersNew){
                self.SelfConfig.getOtherTab(data.result.containersNew);
            }else{
                self.SelfConfig.getOtherTab(data.result.containers);
            }
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
    		}
    		
    		if(masterflag && containerflag){
    			return true;
    		}else{
    			return false;
    		}
        },
    });
    return list;
});