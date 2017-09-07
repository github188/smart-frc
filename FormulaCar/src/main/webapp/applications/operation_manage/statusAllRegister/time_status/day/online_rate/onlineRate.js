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
			//console.log("online rete width："+this.element.width());
			//console.log("online rete width："+this.element.width()*2/3);
            var width = this.element.width() *2/3;
            this.element.addClass("weightContainer");
            var html = "<div class='sta-box-transaction-rate sta-box'>" +
                "<div class='sta-box-title'>"+locale.get("automat_online_rate")+"</div>" +
                "<div class='sta-box-info'>" +
                "<div class='sta-box-marker' style='float:left'>" +
                "<img src='./rainbowStatistics/apStatistics/img/ruler.png'>" +
                "</div>" +
                "<div class='sta-box-details'><span class='stay-number stay-max' id='rates'></span></div>" +
                "</div>" +
                "</div>";
            this.element.html(html);
            this.element.find(".sta-box-transaction-rate").width(width).bind("click",function(){
                //self._renderAndOpenWin();
            }).hover(function(){
                    $(this).addClass("hover-shadow");
                },function(){
                    $(this).removeClass("hover-shadow");
                });
		},
		loadData:function(){
			Service.getOnlineStatistic(function(data){
				if(data.result && data.result.onlineRate){
					$("#rates").text(data.result.onlineRate+"%");
				}else{
					$("#rates").text("0");
				}
			});
		},
		_renderAndOpenWin : function(){
            var self = this;
            if(!this.window){
                this.window =  new Window({
                    container : "body",
                    title : locale.get("automat_state_detail"),
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