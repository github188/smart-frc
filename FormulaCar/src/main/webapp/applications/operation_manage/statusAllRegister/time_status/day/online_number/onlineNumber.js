define(function(require){
	require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	var detailWin = require("../newWin/detailWin");
	var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
	var Window = require('cloud/components/window');
	require("../css/style.css");
	var Service = require('../../../../service');
	var winHeight = 524;
    var winWidth = 1100;
    var COLOR = {
        light:"#578ebe",
        mid:"#8775a7",
        dark:"#be5851"

    };
    var COLUMNS = [{
        "title": "SIM卡号",
        "dataIndex": "simId",
        "width": "20%",
        "lang":"{text:sim_number}"
    },{
        "title": "热点名",
        "dataIndex": "deviceName",
        "width": "20%",
        "lang":"{text:site_name}"
    },{
        "title": "流量",
        "dataIndex": "useFlow",
        "width": "20%",
        "lang":"{text:flow}",
        render:function(value,type,obj){
            var val = value*1024*1024 //MB -> B
            var used = cloud.util.unitConversion(val)
            var max = cloud.util.unitConversion(obj.packFlow*1024*1024);
            return used+" / "+max;
        }

    },{
        "title": "资费(基本+超额)",
        "dataIndex": "overMoney",
        "width": "20%",
        "lang":"{text:charges}",
        render:function(value,type,obj){
            var cost = (value + obj.basicMoney).toFixed(2);
            return cost+" ("+obj.basicMoney.toFixed(2)+"+"+ value.toFixed(2) +")";
        }
    },{
        "title": "使用套餐",
        "dataIndex": "packName",
        "width": "20%",
        "lang":"{text:pack_name}"
    }];
	var transactionCount = Class.create(cloud.Component,{
		
		initialize:function($super,options){
			$super(options);
		    this._render();
		},
		_render:function(){
			this.renderContent();
			this.loadData();
		},
		renderContent:function(){
			var self = this;
			//console.log("online number width："+this.element.width());
			//console.log("online number width："+this.element.width()*0.5);
            var width = this.element.width() *0.5;
            this.element.addClass("weightContainer");
            var html = "<div class='sta-box-transaction-number sta-box'>" +
                "<div class='sta-box-title'>"+locale.get("automat_online_number")+"</div>" +
                "<div class='sta-box-info'>" +
                "<div class='sta-box-marker' style='float:left'>" +
                "<img src='./rainbowStatistics/apStatistics/img/active_user.png'>" +
                "</div>" +
                "<div class='sta-box-details'><span class='stay-number stay-max' id='numbers'></span></div>" +
                "</div>" +
                "</div>";
            this.element.html(html);
            this.element.find(".sta-box-transaction-number").width(width).bind("click",function(){
                //self._renderAndOpenWin();
            }).hover(function(){
                    $(this).addClass("hover-shadow");
                },function(){
                    $(this).removeClass("hover-shadow");
                });
		},
		loadData:function(){
			Service.getOnlineStatistic(function(data){
				if(data.result && data.result.sum){
					$("#numbers").text(data.result.sum);
				}else{
					$("#numbers").text("0");
				}
			});
		},
		_renderAndOpenWin : function(){
            var self = this;
            if(!this.window){
                this.window =  new Window({
                    container : "body",
                    title : locale.get("user_stay_time"),
                    top: "center",
                    left: "center",
                    height: winHeight,
                    width: winWidth,
                    mask: true,
                    blurClose:true,
//                    content : self.options.winContent,
                    events : {
                        "onClose": function() {
                            self.window = null;
                        },
//                        "afterShow": function(){
//                            this.fire("onWinShow");
//                        },
//                        "afterCreated":function(){
//                            this.fire("onAfterCreated")
//                        },

                        scope : this
                    }
                })
            }
            this.window.show();

            this.setWindowContent();

        },
        setWindowContent:function(){
        	this.winTCContainer =$("<div class='total-User-container'></div>")
            .height(winHeight-50).width(winWidth-20);

	        this.window.setContents(this.winTCContainer);
	        
	        /*this.transactionCountTable = new transactionCountTable({
                container : ".total-User-container"
            });*/
	        this.detailWin = new detailWin({
                container : ".total-User-container",
                width:winWidth-20,
                height:winHeight-50
            });
        },
        destroy:function(){
			if (this.window && (!this.window.destroyed)) {
	            this.window.destroy();
	        }
				
			if(this.detailWin){
				this.detailWin.destroy();
				this.detailWin = null;
			}
		}
	});
	return transactionCount;
})