define(function(require) {
    require("cloud/base/cloud");

    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./saleList.html");
    var Service = require("../service");
    //var NoticeBar = require("./notice-bar");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    require("../config/css/common.css");
    //require("./js/jquery-1.3.2.min");
    //require("./js/scripts-pack");
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this._id = options.id;
			
			this.element.html(html);

		    this._render();
		    locale.render({element: this.element});
		},
		_render:function(){
			this._renderData();
			this._renderBtn();
		},
		stripscript:function(s){ 
		    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]") 
		    var rs = ""; 
		    for (var i = 0; i < s.length; i++) { 
		      rs = rs+s.substr(i, 1).replace(pattern, ''); 
		    } 
		    return rs; 
		},
		_renderBtn: function(){
			var self = this;
            $("#sale_last_step").bind("click", function() {
            	$("#devicelist").css("display", "block");
                //$("#baseInfo").css("display", "none");
                $("#salelist").css("display", "none");
                $("#tab3").removeClass("active");
                $("#tab2").addClass("active");
                //$("#tab1").removeClass("active");
            });
            
          //保存
            $("#sale_save").bind("click", function() {
            	
                console.log(self.finalData);
            	Service.addReplenishPlan(self.finalData, function(data) {
                    self.automatWindow.destroy();
                    self.fire("getplanList");
                });
                
            	
            	
            });
			
		},
        _renderData:function(){
			
			var self = this;
			Service.getReplenishPlanById(self._id,function(data){
				
				$("#planName3").val(data.result.name);
				$("#executiveTime3").val(cloud.util.dateFormat(new Date(data.result.executiveTime),"yyyy/MM/dd"));
				$("#executivePerson3").val(data.result.executivePerson);
				self.saleData = data.saleData;
				self._renderDiv();
				
			});
			
			
		},
		_renderDiv : function() {
			var self = this;
			for(var i = 0;i < self.saleData.length;i ++){
				
				var deviceHtml = "";
				if(self.saleData[i].deviceList.length > 0){
					var len = self.saleData[i].deviceList.length;
					 
					for(var j = 0;j < len;j ++){
						var data = self.saleData[i].deviceList[j];
						var stateHtml = "";
						var state = data.state;
						if(state == 1){
							stateHtml = "<td style='font-size:12px;display:block'><span class='correct'></span></td>";
						}else if(state == 0){
							stateHtml = "<td style='font-size:12px;display:block'><span class='incorrect'></span></td>";
						}
						deviceHtml += "<tr id='"+data.assetId+"'>" +
								"<td style='font-size:12px'>" +data.assetId+
								"</td><td style='font-size:12px'>" +data.siteName+
								"</td><td style='font-size:12px'>" +data.saleNum+
								"</td><td style='font-size:12px'>" +data.cashMoney+
								"</td><td style='font-size:12px'>" +data.ncashMoney+
								"</td>" +
								stateHtml+
								"</tr>";
						
						
					}
					
				}
				
				var rate = Math.round(self.saleData[i].numShu / self.saleData[i].num * 10000) / 100.00 + "%";
				$("#sale_list").append("<div style='margin: 20px;'>" +
						"<span class='linecell' id='span_"+i+"'><span style='font-size: 14px;font-weight: bold;    margin-top: -6px;float: left;margin-left: 0px;    width: 5em;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow: ellipsis;overflow: hidden;'>" +self.saleData[i].lineName+
						"</span><span style='color: #3CB371;font-weight: bold;float: left;    margin-top: -2px;margin-left: 10px;float: right;position: absolute;'>" +self.saleData[i].moneyShu+"&nbsp;"+locale.get({lang: "rmb"})+"/&nbsp;"+self.saleData[i].moneys+"&nbsp;"+locale.get({lang: "rmb"})+"</span>" +
						"<span style='color: #3CB371;font-weight: bold;float: left;margin-left: -66px;margin-top: 15px;    margin-right: 10px;'>" +self.saleData[i].numShu+"&nbsp;&nbsp;/&nbsp;&nbsp;"+self.saleData[i].num+"</span>" +
						
						"<div class='cent'><p>" +
						"<div class='Bars'>" +
						"<div style='width: "+rate+";'>" +
						"<span>"+rate+"</span>" +
						"</div></div></p></div>" +
						"</span>" +
						"<table class='gridtable' id='table_"+i+"'><thead><tr style='border-bottom: 2px solid #ddd;'><th><span>"+locale.get({lang: "automat_no1"})+"</span><span class='vending'></span></th><th><span>"+locale.get({lang: "site"})+"</span><span class='site'></span></th><th><span>"+locale.get({lang: "shelf_platformsalenum"})+"</span><span class='sales'></span></th><th><span height: 20px;display: inline-block;>"+locale.get({lang: "cash_sale_money"})+"</span><span class='cash'></span></th><th><span>"+locale.get({lang: "nocash_sale_money"})+"</span><span class='card'></span></th><th><span>"+locale.get({lang: "replenish_state"})+"</span><span class='state'></span></th></tr></thead>" +
						"<tbody>" +deviceHtml+
						"</tbody>" +
						"</table>" +
						
						"</div>");
				$("#sale_list").append("<div style='border-right: 1px solid #C5C1AA;height: 450px;width: 1px;margin-left: 202px;margin-top: -102px;'></div>");
				
				
				$("#span_"+i).bind("click",{i:i},function(e){
						
					$(".gridtable").css("display","none");
					$("#table_"+e.data.i).css("display","block");
					
					//$(".linecell").css("border-right","2px solid #C5C1AA");
					//$(this).css("border-right","1px solid white");
					
					$(".linecell").css("background-color","#ddd");
					$(this).css("background-color","white");
					
					$(".linecell").css("cursor","pointer");
					$(this).css("cursor","text");
				})
				
				
				
			}

			$("#sale_list tbody tr").mouseover(function (){
		    	$(this).css("background-color","#f7f7f9");
			}).mouseout(function (){
				$(this).css("background-color","white");
			});
			
		
			
			$("#span_0").click();
		},
		
		getSelectedResources: function() {
        	var self = this;
        	var rows = self.listTable.getSelectedRows();
        	var selectedRes = new Array();
        	rows.each(function(row){
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
	return list;
});