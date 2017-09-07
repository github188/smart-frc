define(function(require) {
	require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    var volumes = require("./volumes");//成交量
    var transaction_amount = require("./transaction_amount");//成交金额
    var online_number = require("./online_number");//在线数
    var online_rate = require("./online_rate");//在线率
    require("./css/content.css");
    var Map = $H({
        volumes:40,   
    });
	var history = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
	        locale.render({
                element : this.element
            });
			this.render();
			this.draw();
		},
		render:function(){
            this.element.addClass("ApStaContent");
            this.container = $("<div class='ApSta-container'></div>").appendTo(this.element);
            this.clearContainer();
			this.dashcontainer = $("<div class='Stat-container unselectable'></div>").appendTo(this.container);
		},
		draw:function(){
			
			this.draw_volumes();//成交量
			this.draw_transaction_amount();//成交金额
			this.draw_online_number();//在线数
			this.draw_online_rate();//在线率
		},
		draw_volumes:function(){	
			if(this.volumes){
				this.volumes.destroy();
		    }
			this.volumes = new volumes({
				"container":this.dashcontainer
			});
		},
		draw_transaction_amount:function(){
			if(this.transaction_amount){
				this.transaction_amount.destroy();
		    }
			this.transaction_amount = new transaction_amount({
				"container":this.dashcontainer
			});
		},
		draw_online_number:function(){
			if(this.online_number){
				this.online_number.destroy();
		    }
			this.online_number = new online_number({
				"container":this.dashcontainer
			});
		},
		draw_online_rate:function(){
			if(this.online_rate){
				this.online_rate.destroy();
		    }
			this.online_rate = new online_rate({
				"container":this.dashcontainer
			});
		},
	    clearContainer:function(){
	        this.volumes && this.volumes.destroy();
	        this.transaction_amount && this.transaction_amount.destroy();
	        this.container && this.container.empty();
	    }
	});
	return history;
});
