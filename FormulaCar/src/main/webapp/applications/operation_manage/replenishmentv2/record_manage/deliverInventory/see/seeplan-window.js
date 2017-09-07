define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./seeplan.html");
    var Table = require("cloud/components/table");
    var Paging = require("cloud/components/paging");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
	require("cloud/components/print");
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

			this._id = options.planId;
            
			this.lineIds = [];

			this._renderWindow();
			this._renderData();
			
			locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: locale.get({lang: "see_bill_of_cargo"}),
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
            $("#save").val(locale.get({lang: "save"}));
            
        	//添加打印
        	$("#ui-window-title").append("<span class='printer' ></span>");
        	$(".printer").mouseover(function (){
        		$('.printer').css("opacity","1");
        	}).mouseout(function (){
        		$('.printer').css("opacity","0.7");
        	});

        	$(".printer").bind("click",function(){
        		$('.ui-window-content').printArea();
        		
        	});

        	$("#ui-window-title").css("height","30px");
            
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
        	
        	$("#goodsInventory").html('');
        	
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
        						"<td><input type='text' readonly='readonly' value='"+goodslist[i].deliverSum+"'/></td>" +
        						"<td><input type='text' readonly='readonly' value='"+goodslist[i].cancelSum+"'/></td>" +
        						"</tr>");
        				
        				
        				
        				if(i == goodslist.length -1){
        					$("#goodsInventory").append("<tr style='height: 60px;border-top: 1px solid #ddd;'>" +
            						"<td style='font-size: 13px;'>"+locale.get({lang: "forecast_replenish_total"})+"</td>" +
            						"<td style='font-size: 13px;'>"+planTotal+"</td>" +
            						"<td style='font-size: 13px;'><input type='text' readonly='readonly' value='"+deliverTotal+"'/></td>" +
            						"<td style='font-size: 13px;'><input type='text' readonly='readonly' value='"+cancelTotal+"'/></td>" +
            						"</tr>");
        					
        					$("#goodsInventory").append("<tr style='height: 60px;'>" +
            						"<td></td>" +
            						"<td></td>" +
            						"<td></td>" +
            						"<td style='font-size: 13px;'>"+locale.get({lang: "confirmor"})+"</td>" +
            						"</tr>");
        					
        				}
        			}
        			
        		}
        		
        	}
        	
        	
        	
        },
        _renderBtn: function() {
        	var self = this;

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
