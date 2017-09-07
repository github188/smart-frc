define(function(require){
	require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	var transactionCount = require("./transaction_count/count");
	var transactionMoney = require("./transaction_money/money");
	var onlineNumber = require("./online_number/onlineNumber");
	var onlineRate = require("./online_rate/onlineRate");
	var Table = require("cloud/components/table");
	var Window = require('cloud/components/window');
	var html = require("text!./day.html");
	var winHeight = 524;
    var winWidth = 1100;
    var COLOR = {
        light:"#578ebe",
        mid:"#8775a7",
        dark:"#be5851"
    };
	var day = Class.create(cloud.Component,{
		
		initialize:function($super,options){
			$super(options);
            this.element.html(html);
			this.elements = {
				transaction_count_el:"transaction_count",
				transaction_money_el:"transaction_money",
				online_rate_el:"online_rate",
				online_number_el:"online_number"
			};
		    this._render();
		},
		_render:function(){
			this.renderContent();
			//this.renderContent();
			
		},
		renderContent:function(){
			var self = this;
			/*成交量*/
			if(this.transactionCount){
				this.transactionCount.destroy();
			}
			this.transactionCount = new transactionCount({
                container : "#"+self.elements.transaction_count_el
            });
			if(this.transactionMoney){
				this.transactionMoney.destroy();
			}
			/*成交金额*/
			this.transactionMoney = new transactionMoney({
                container : "#"+self.elements.transaction_money_el
            });
			if(this.onlineNumber){
				this.onlineNumber.destroy();
			}
			/*在线数*/
			this.onlineNumber = new onlineNumber({
                container : "#"+self.elements.online_number_el
            });
			if(this.onlineRate){
				this.onlineRate.destroy();
			}
			/*在线率*/
			this.onlineRate = new onlineRate({
                container : "#"+self.elements.online_rate_el
            });
		}
	});
	return day;
})