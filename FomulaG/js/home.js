$(function () {
	var paramObj = GetRequest();
	
	var openid = paramObj.openid;
	
	var $preview = $('.preview-image');
	$('.image-item img').on('click', function () {
		var src = $(this).attr('src');
		$preview.css('background-image', `url(${src})`).show();
	});
	$preview.on('click', function () {
		$(this).css('background-image', 'none').hide();
	});

	$('.image-remove').on('click', function () {
		var $that = $(this);
		$('.popwin-wrapper').css('display', 'block');
		$('.accept').one('click', function (e) {
			var imageKey = $that.parent().attr('data-key');
			var postData = JSON.stringify({
				imageKey: imageKey
			});
			$.ajax({
				url: '/image',
				method: 'DELETE',
				data: postData,
				contentType: 'application/json',
				success: function (result) {
						if (result.status == 'success') {
						$('.message-success').css('display', 'block');
						$('.popwin').css('display', 'none');
						setTimeout(function () {
							$('.popwin-wrapper').css('display', 'none');
							$that.parent().remove();
							$('.message-success').css('display', 'none');
							$('.popwin').css('display', 'block');
						}, 800);
					} else {
						$('.message-fail').css('display', 'block');
						$('.popwin').css('display', 'none');
						setTimeout(function () {
							$('.popwin-wrapper').css('display', 'none');
							$('.message-fail').css('display', 'none');
							$('.popwin').css('display', 'block');
						}, 800);
					}
				}			
			});
		});
	});

	
  
	$('.reject').on('click', function () {
		$('.popwin-wrapper').css('display', 'none');
		$('.accept').off('click');
	});

	$('.popwin-wrapper').on('click', function () {
		$(this).css('display', 'none');
		$('.accept').off('click');
	});

	$('.popwin').on('click', function (e) {
		e.stopPropagation();
	});
});

var GetRequest = function() {
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}
