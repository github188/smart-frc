(function($){
		$.fn.combox = function(options) {
			var defaults = {  
                borderCss: "combox_border",  
                inputCss: "combox_input",  
                buttonCss: "combox_button",  
                selectCss: "combox_select",
				datas:[],
				assetIds:[],
				ids:[]
            };
            var options = $.extend(defaults, options);
			
			function _initBorder($border) {//初始化外框CSS
				$("#combox").css({'display':'inline-block', 'position':'relative'}).addClass(options.borderCss);
				return $("#combox");
			}
			
			function _initInput($border){//初始化输入框
				$("#combox").html("");
				$("#combox").append('<input type="text" class="'+options.inputCss+'"/>');
				$("#combox").append('<font class="ficomoon icon-angle-bottom '+options.buttonCss+'" style="display:inline-block"></font>');
				//绑定下拉特效
				$("#combox font").bind('click', function() {
					var $ul = $("#combox").children('ul');
					if($ul.css('display') == 'none') {
						$ul.slideDown('fast');
						$(this).removeClass('icon-angle-bottom').addClass('icon-angle-top');
					}else {
						$ul.slideUp('fast');
						$(this).removeClass('icon-angle-top').addClass('icon-angle-bottom');
					}					
				});
				return $("#combox");//IE6需要返回值
			}
			
			function _initSelect($border) {//初始化下拉列表
				
				$("#combox").append('<ul id="combox_ul" style="position:absolute;left:-1px;display:none;overflow: auto;height: 160px;" class="'+options.selectCss+'">');
				
				return $("#combox");
			}
			this.each(function() {
				var _this = $(this);
				_this = _initBorder(_this);//初始化外框CSS
				_this = _initInput(_this);//初始化输入框
				_initSelect(_this);//初始化下拉列表
			});
		};
})(jQuery);