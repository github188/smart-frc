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
    var Service = require("../../service");

    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            if(window.location.hostname == "www.dfbs-vm.com"){
        		this.hostsf = 1;
        	}else{
        		this.hostsf = 0;
        	}
			this._id = options.planId;
            
			this.lineIds = [];

			this._renderWindow();
			this._renderData();
			this._renderBtn();
			locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: locale.get({lang: "update_deliver_plan"}),
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
            
        },

        _renderBtn:function(){

        	var self = this;
        	$("#save").on('click',function(){
        		
				var planTotal = 0;
				var deliverTotal = 0;
				var cancelTotal = 0;
				
				var goodsInventorys = [];
				
				var tableObj = document.getElementById("goodsInventory"); 
				
				if(tableObj && tableObj.rows.length >0 ){
					for(var i=0;i<tableObj.rows.length -1;i++){//行 
						var goodsObj ={};

						goodsObj.goodsName = tableObj.rows[i].cells[0].innerText;
						goodsObj.planSum = parseInt(tableObj.rows[i].cells[1].innerText);
						
						if($(tableObj.rows[i].cells[2].children[0]).val() != ""){
							goodsObj.deliverSum = parseInt($(tableObj.rows[i].cells[2].children[0]).val());
						}else{
							goodsObj.deliverSum = 0;
						}
						
						if($(tableObj.rows[i].cells[3].children[0]).val() != ""){
							goodsObj.cancelSum = parseInt($(tableObj.rows[i].cells[3].children[0]).val());
						}else{
							goodsObj.cancelSum = 0;
						}
						
								
						planTotal += goodsObj.planSum;
						deliverTotal += goodsObj.deliverSum;
						cancelTotal += goodsObj.cancelSum;
						
						goodsInventorys.push(goodsObj);
					}
				}
				var inventory = {
						planTotal:planTotal,
						deliverTotal:deliverTotal,
						cancelTotal:cancelTotal,
						goodsInventory:goodsInventorys
						
				};
				if(self.hostsf == 1){
					if(self.status == 0 || self.status == 3){
						self.basedata.status = self.status + 1;
						self.basedata.executiveTime = (new Date()).getTime()/1000;
		        	}
				}else{
					if(self.status == 0 || self.status == 1){
						self.basedata.status = self.status + 1;
						self.basedata.executiveTime = (new Date()).getTime()/1000;
		        	}
				}
				
				self.basedata.inventory = inventory;
				Service.updateDeliverPlan(self._id,self.basedata, function(data) {
                	
                    if(data.error_code == null){
                    	self.adWindow.destroy();
                        self.fire("getplanList");
                	}
                    
                });
        		
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

		_renderData:function(){
			
			var self = this;
			Service.getDeliverPlanById(self._id,function(data){

				console.log(data);
				if(data && data.result){
					self.basedata = data.result;
					self._renderTable(data.result);
				}
				
			});
			
			
		},
        _renderTable:function(data){
        	var self = this;
        	$("#goodsInventory").html('');
        	var status = data.status;
        	self.status = status;
        	if(self.hostsf == 1){
        		if(status == 0){
            		$("#save").val(locale.get({lang: "confirm_deliver"}));
            	}else if(status == 3){
            		$("#save").val(locale.get({lang: "back_confirm"}));
            	}else{
            		$("#save").val(locale.get({lang: "save"}));
            	}
        	}else{
        		if(status == 0){
            		$("#save").val(locale.get({lang: "confirm_deliver"}));
            	}else if(status == 1){
            		$("#save").val(locale.get({lang: "back_confirm"}));
            	}else{
            		$("#save").val(locale.get({lang: "save"}));
            	}
        	}
    		
        	
        	if(data.inventory != null){
        		
        		var deliverTotal = data.inventory.deliverTotal;
        		var cancelTotal = data.inventory.cancelTotal;
        		var planTotal = data.inventory.planTotal;
        		
        		var goodslist = data.inventory.goodsInventory;
        		if(goodslist != null && goodslist.length>0){
        			for(var i=0;i<goodslist.length;i++){
        				if(goodslist[i].deliverSum == null){
        					goodslist[i].deliverSum = 0;
        				}
        				if(goodslist[i].cancelSum == null){
        					goodslist[i].cancelSum = 0;
        				}
        				
        				$("#goodsInventory").append("<tr style='height: 40px;'>" +
        						"<td>"+goodslist[i].goodsName+"</td>" +
        						"<td>"+goodslist[i].planSum+"</td>" +
        						"<td><input type='text' class='deliverinput' value='"+goodslist[i].deliverSum+"' style='ime-mode:disabled;' onpaste='return false;'  onkeypress='if(event.keyCode >=48 && event.keyCode <=57){return true;}else{return false;}'/></td>" +
        						"<td><input type='text' class='backinput' value='"+goodslist[i].cancelSum+"' style='ime-mode:disabled;' onpaste='return false;'  onkeypress='if(event.keyCode >=48 && event.keyCode <=57){return true;}else{return false;}'/></td>" +
        						"</tr>");
        				
        				
        				
        				if(i == goodslist.length -1){
        					$("#goodsInventory").append("<tr style='height: 60px;border-top: 1px solid #ddd;'>" +
            						"<td style='font-size: 13px;'>"+locale.get({lang: "forecast_replenish_total"})+"</td>" +
            						"<td style='font-size: 13px;'>"+planTotal+"</td>" +
            						"<td style='font-size: 13px;'><input id='totaldeliver' type='text' value='"+deliverTotal+"' style='ime-mode:disabled;' onpaste='return false;'  onkeypress='if(event.keyCode >=48 && event.keyCode <=57){return true;}else{return false;}'/></td>" +
            						"<td style='font-size: 13px;'><input id='totalback' type='text' value='"+cancelTotal+"' style='ime-mode:disabled;' onpaste='return false;'  onkeypress='if(event.keyCode >=48 && event.keyCode <=57){return true;}else{return false;}'/></td>" +
            						"</tr>");
        				}
        			}
        			
        			$(".deliverinput").on('input',function(e){
        		    	var all = 0;
        		    	
        		    	$(".deliverinput").each(function(){
        		    		if($(this).val() != ""){
        		    			all += parseInt($(this).val());
        		    		}
        		    		
        		    	});
        		    	
        		    	$("#totaldeliver").val(all);
        		    });
        			$(".backinput").on('input',function(e){
        		    	var all2 = 0;
        		    	
        		    	$(".backinput").each(function(){
        		    		if($(this).val() != ""){
        		    			all2 += parseInt($(this).val());
        		    		}
        		    		
        		    	});
        		    	
        		    	$("#totalback").val(all2);
        		    });
        			if(self.hostsf == 1){
            			if(data.status < 2){
            				
            				$(".backinput").each(function(){
            		    		$(this).attr("readonly","true");
            		    	});
            				$("#totalback").attr("readonly","true");
            				
            			}
            			if(data.status >=1){
            				$(".deliverinput").each(function(){
            		    		$(this).attr("readonly","true");
            		    	});
            				$("#totaldeliver").attr("readonly","true");
            			}
            			if(status == 4){
            				$(".backinput").each(function(){
            		    		$(this).attr("readonly","true");
            		    	});
            				$("#totalback").attr("readonly","true");
            			}
            			
            			if(data.status == 2 || data.status == 3){
            				
        					$(".backinput").each(function(){
        			    		$(this).attr("readonly","true");
        			    	});
        					$("#totalback").attr("readonly","true");
            				
            				
            			}
        			}else{
        				$(".backinput").each(function(){
        		    		$(this).attr("readonly","true");
        		    	});
        				$("#totalback").attr("readonly","true");
        				
        				$(".deliverinput").each(function(){
        		    		$(this).attr("readonly","true");
        		    	});
        				$("#totaldeliver").attr("readonly","true");
        			}

        			
        		}
        		
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
