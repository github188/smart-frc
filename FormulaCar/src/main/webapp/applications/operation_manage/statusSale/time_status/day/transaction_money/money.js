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
            var width = this.element.width() * 2/3;
            this.element.addClass("weightContainer");
            var html = "<div class='sta-box-transaction-money sta-box' id='amounts'>" +
                "<div class='sta-box-title'>"+locale.get("automat_transaction_money")+"&nbsp;&nbsp;"+locale.get({lang:"money_yuan"})+"</div>" +
                "<div class='sta-box-info'>" +
                "<div class='sta-box-marker' style='float:left'>" +
                "<img src='./rainbowStatistics/apStatistics/img/clock.png'>" +
                "</div>" +
                "<div class='sta-box-details'><span class='stay-number stay-max' id='amount'></span></div>" +
                "</div>" +
                "</div>";
            this.element.html(html);
            this.element.find(".sta-box-transaction-money").width(width).bind("click",function(){
                //self._renderAndOpenWin();
            }).hover(function(){
                    $(this).addClass("hover-shadow");
                },function(){
                    $(this).removeClass("hover-shadow");
                });
		},
		loadData:function(){
			cloud.util.mask("amounts");
			Service.getTradeStatistic(function(data){
				cloud.util.unmask("amounts");
				if(data.result && data.result.amountSum){
					$("#amount").text(data.result.amountSum/100);
				}else{
					$("#amount").text("0");
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