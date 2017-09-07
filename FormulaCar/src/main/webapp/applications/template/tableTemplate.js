define(function(require) {
	 var cloud = require("cloud/base/cloud");
	 require("cloud/lib/plugin/jquery.layout");
	 var htmls = require("text!./tableTemplate.html");
	 require("./css/table.css"); 
	 var TableTemplate = Class.create(cloud.Component, {
		 initialize: function($super, options) {
			 $super(options);
			 this.element.html(htmls);
			 locale.render({element:this.element});
			 this._draw();
			 this.bindEvents();
		 },
		 _draw: function() {
			 
			 $(".workspace-wrapper").css("height",$("#user-content").height()-30);
			 $(".col-slide-menu").css("height",$("#user-content").height()-40);
			 $(".col-slide-main").css("height",$("#user-content").height()-40);
			 $(".menu-bar").css("height",$("#user-content").height()-40);
			 var dls = this.options.dl;
			 for(var i=0;i<dls.length;i++){
				 var dt = dls[i].dt;
				 var dds = dls[i].dd;
				 if( i == 0){
					 $(".menu-bar").append(
							 "<dl class='menu0' id='"+dt+"'>"+
							     "<dt class='menu-title'>"+
							          "<i class='dt-title'></i>"+
							          "<span>"+locale.get({lang:dt})+"</span>"+
							      "</dt>"+
							  "</dl>"
					 );
				 }else{
					 $(".menu-bar").append(
							 "<dl class='menu' id='"+dt+"'>"+
							    "<dt class='menu-title'>"+
							         "<i class='dt-title'></i>"+
							         "<span>"+locale.get({lang:dt})+"</span>"+
							     "</dt>"+
							 "</dl>"
					 );
				 }
				
				 
				 for(var j=0;j<dds.length;j++){
					 if(dds[j][1]){
						 $("#"+dt).append(
							"<dd class='menu-item' id='"+dds[j][0]+"'>"+
								 "<a>"+locale.get({lang:dds[j][0]})+"</a>"+
							"</dd>"
						 );
					 }else{
						 $("#"+dt).append(
							"<dd class='menu-item-none' id='"+dds[j][0]+"'>"+
								 "<span>"+locale.get({lang:dds[j][0]})+"</span>"+
							"</dd>"
						 ); 
						 
					 }
					 
				 }
			 }
		 },
		 bindEvents:function(){
	            var self=this;
	            self.element.find(".col-slide-menu .menu-item").bind({
	                "click":function(e){
	                    $(".col-slide-menu .menu-item").removeClass("item-selected item-mouseover");
	                    $(this).addClass("item-selected");
	                    self.fire("click", e.currentTarget.id);
	                },
	                "mouseover":function(e){
	                    if(!$(this).hasClass("item-selected")){
	                        $(this).addClass("item-mouseover");
	                    }
	                },
	                "mouseout":function(e){
	                    $(this).removeClass("item-mouseover");
	                }
	            }).end()
	            $(".menu0 dd:first").click();
	        }

     });
     return TableTemplate;
});