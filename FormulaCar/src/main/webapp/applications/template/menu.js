define(function(require){
    require("cloud/base/cloud");
    var MenuHtml=require("text!./menu.html");
    require("./css/material.css");
    require("./css/media.css");
    require("./css/media_list.css");
    require("./css/media_editor.css");
    require("./css/media_edit.css");
    require("./css/common.css"); 
    var Menu = Class.create(cloud.Component,{
        initialize : function($super, options){
            $super(options);
            this.element.html(MenuHtml);
			locale.render({element:this.element});
			this._draw();
			this.bindEvents();
        },
        _draw:function(){
            
        	 var lis = this.options.lis;
        	 var head = this.options.head;
             
			 for(var i=0;i<lis.length;i++){
				 var li = lis[i];
				 var j=i+1;
				 if( i == 0){
					 $("#all").append(
							 "<li  id='"+li+"' data-index='"+i+"' class='tab_nav first js_top  selected' data-id='media10'>"+
							          "<a id='tab_"+j+"' style='text-decoration: none;'>"+locale.get({lang:li})+"</a>"+
							  "</li>"
					 );
				 }else{
					 $("#all").append(
							 "<li  id='"+li+"' data-index='"+i+"' class='tab_nav  js_top' data-id='media2'>"+
							          "<a id='tab_"+j+"' style='text-decoration: none;'>"+locale.get({lang:li})+"</a>"+
							  "</li>"
					 );
				 }
			 }
          
        },
        bindEvents:function(){
        	  var self = this;
              var $lis = this.element.find(".tab_navs li");
             
              $lis.bind("click",function(e){
            	  $(".tab_navs li").removeClass("selected");
                  $(this).addClass("selected");
            	  self.fire("click", e.currentTarget.id);
              });
              
              $(".col-slide-menu").mouseover(function (){
          		
            	  $(".menu-bar").css("overflow","auto");
            	  $(".menu-bar").find("dl").css("width","auto");
        	  }).mouseout(function (){
        		
        		  $(".menu-bar").css("overflow","hidden");
        		  $(".menu-bar").find("dl").css("width","100%");
        	  });
        }

      
    });

    return Menu;
});