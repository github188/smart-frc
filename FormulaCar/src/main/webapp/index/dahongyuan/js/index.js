//ie6,7,8判断
var bua=navigator.userAgent;
/*
var isFirefox=bua.indexOf("Firefox");
var isChrome=bua.indexOf("Chrome");
*/
//浏览器判断
var reg=new RegExp("MSIE ([6-8][/.0-9]{0,})");
var result=reg.exec(bua);
		function _verifyBrowser(){
			if(result){
    		   return false;
    	   	}
			else {
				return true;
			}
		};
		var flag=_verifyBrowser();
		function renderTip(){
	         	$("<div id='tip_top' class='tip_top'></div>").appendTo("body")
				.css({"height":(document.documentElement.clientHeight/2),"width":document.documentElement.clientWidth,"top":-(document.documentElement.clientHeight/2)})
				.animate({top:"0px"},300,function(){
	         		$("<div id='tip_content' class='tip_content'></div>").html("<div class='text_div_1'><image class='inhand_logo' src='./images/Logo-InHand.png' />" +
	         				"<p class='text_title'>浏览器不受支持</p>" +
	         				"<p class='text_content'>使用当前浏览器，无法获得最佳体验，建议使用最新的" +
							"<a class='browser_link' href='http://www.firefox.com.cn'>Firefox</a>或" +
	         				"<a class='browser_link' href='http://www.google.cn/intl/zh-CN/chrome/browser/'>Chrome</a>浏览器</p></div>"+
	         				"<div class='text_div_2'>" +
	         				"<p class='text_title'>Browser Tip</p>" +
	         				"<p class='text_content'>Suggest to select the latest version of " +
	         				"<a class='browser_link' href='http://www.mozilla.org/en-US/firefox/new/'>Firefox</a> or " +
	         				"<a class='browser_link' href='https://www.google.com/intl/en/chrome/browser/'>Chrome</a> browser</p></div>"
	         				).appendTo("body").css({
	         			"top":((document.documentElement.clientHeight/2)-125)+"px",
	         			"left":((document.documentElement.clientWidth/2)-225)+"px"});
	         		$("<div class='ignore_button'></div>").appendTo($("#tip_content")).text("Skip").mouseover(function(){
	         			$(this).css({
	         				"cursor":"pointer",
	         				"font-weight":"bold"
	         			})
	         			.mousedown(function(){
	         				$(this).css({
	         					"border-right":"2px solid #dddddd",
	         			    	"border-bottom":"2px solid #dddddd"
	         				})
	         			})
	         			.mouseout(function(){
	         				$(this).css({
	         					"border-right":"2px solid #7E807C",
	             			    "border-bottom":"2px solid #7E807C",
	             			    "font-weight":"normal"
	         				})
	         			})
	         		}).click(function(){
	         			$("#tip_bottom").animate({top:(document.documentElement.clientHeight)+"px"},300,function(){$(this).remove()});
	             		$("#tip_top").animate({top:-(document.documentElement.clientHeight/2)+"px"},300,function(){$(this).remove()});
	             		$("#tip_content").fadeOut(300,function(){$(this).remove()});
	         		})
	         	});
	         	$("<div id='tip_bottom' class='tip_bottom'></div>").appendTo("body").css({"height":(document.documentElement.clientHeight/2),"width":document.documentElement.clientWidth,"top":document.documentElement.clientHeight}).animate({top:(document.documentElement.clientHeight/2)+"px"},300)
			};
//执行浏览器判断
$(function(){
	if(!flag){
		renderTip();
	}
});
//如果有accessToken则自动跳转到平台内
if(sessionStorage.getItem("accessToken")){
	location.href = "../../applications";
};
//locale 国际化对象，具体方法含义参照项目中的文档
	 var packages={
		"default":"base",
		"base":"language"
	};
	var locale = {
		browserLang:"",
		userLang:"",
		localLang:"",
		storageLang:"",
		langArr:["en","zh_CN"],
		langPacks:{},
		packUrl:"",
		element:"*",
		pos:packages["default"],
		lang:"",
		_setBrowserLang:function(){
			var browser = navigator.language || navigator.browserLanguage;
			var browserLang = browser.toLowerCase().substring(0,2);
			var langArr = this.langArr;
			var arrCurrent;
			for(var num = 0;num < langArr.length;num++){
				arrCurrent = langArr[num].toLowerCase().substring(0,2);
				if(browserLang == arrCurrent){
					this.browserLang = langArr[num];
					return;
				}
			}
		},
		_setUserLang:function(opt){
			var langArr = this.langArr;
			for(var num = 0;num < langArr.length;num++){
				if(langArr[num].toLowerCase().indexOf(opt.toLowerCase()) > -1){
					this.userLang = langArr[num];
					return;
				}
			}
		},
		_setStorageLang:function(opt){
			this.storageLang = opt;
		},
		_setLocalLang:function(){
			if(this.storageLang && this.userLang){
				this.localLang = this.userLang;
			}else if(this.storageLang && !this.userLang){
				this.localLang = this.storageLang;
			}else if(!this.storageLang && this.userLang){
				this.localLang = this.userLang;
			}else{
				this.localLang = this.browserLang;
			}
			this._setStorage(this.localLang);
		},
		_setLang:function(){
			if(!this.browserLang){
				this._setBrowserLang();
			}
			if(!this.storageLang){
				this._setStorageLang(localStorage.getItem("language"));
			}
			if(this.lang){
				this._setUserLang(this.lang);
			}
			this._setLocalLang();
		},
		_setStorage:function(lang){
			this._setStorageLang(lang);
			localStorage.setItem("language",lang);
		},
		_getStorageLang:function(){
			return localStorage.getItem("language");
		},
		_loadPack:function(callback){
			var self = this;
			var url = this.packUrl + "/" + this.storageLang + "/lang.js";
			$.ajax({
				  url: url,
				  dataType: "script",
				  async: false,
				  success: function(){
						self._cacheLangPacks();
						if(callback){
							if($.isArray(callback)){
								for(var num=0;num<callback.length;num++){
									callback[num]();
								}
							}else{
								callback();
							}
						}
					}
			});
		},
		_hasPacks:function(){
			var langPacks = this.langPacks;
			for(var attr in langPacks){
				if(attr == this.storageLang){
					for(var _attr in langPacks[attr]){
						if(_attr == this.pos){
							return true;
						}
					}
				}
			}
		},
		_cacheLangPacks:function(){
			var langName,langObj;
			var pos = this.pos;
			var langPacks = this.langPacks;
			for(var attr in lang){
				langName = attr;
				langObj = lang[attr];
			}
			if(langPacks[langName]){
				langPacks[langName][pos] = langObj;
			}else{
				langPacks[langName] = {};
				langPacks[langName][pos] = langObj;
			}
			this.langPacks = langPacks;
		},
		_getPackUrl:function(){
			if(this.pos){
				packUrl = packages[this.pos];
				if(packUrl){
					this.packUrl = packUrl;
				}else{
					this.pos = packages["default"];
					this.packUrl = packages[this.pos];
				}
			}else{
				this.pos = packages["default"];
				this.packUrl = packages[this.pos];
			}
		},
		_languageIsCorrect:function(){
			if(!this.storageLang || !this._getStorageLang()){
				return false;
			}else{
				if(this.lang && this.lang != this.storageLang){
					return false;
				}else{
					return true;
				}
			}
		},
		_get:function(opt,variableArr){
			var self = this;
			var obj = {};
			if(opt && $.isPlainObject(opt)){
				obj.str = opt.lang;
				this.pos = opt.pos ? opt.pos : "base";
			}else{
				obj.str = opt;
				this.pos = "base";
			}
			if(!this._languageIsCorrect()){
				this._setLang();
			}
			if(this._hasPacks()){
				self.str = variableArr ? this._result(obj,variableArr) : this._result(obj);
			}else{
				this._getPackUrl();
				variableArr ? this._loadPack(function(){self.str = self._result(obj,variableArr);}) : this._loadPack(function(){self.str = self._result(obj);});
			};
			return self.str;
		},
		get:function(opt,variableArr){
			return this._get(opt,variableArr);
		},
		_render:function(opt){
			var self = this;
			if(opt.method == "render"){
				this.pos = opt.pos ? opt.pos : "base";
				this.element = opt.element ? opt.element : "*";
			}else if(opt.method == "set"){
				this.lang = opt.lang ? opt.lang : "zh_CN";
				this.pos = opt.pos ? opt.pos : "base";
				this.element = "*";
			}
			if(!this._languageIsCorrect()){
				this._setLang();
			}
			if(this._hasPacks()){
				this._each(self.element);
			}else{
				this._getPackUrl();
				this._loadPack(function(){self._each(self.element);});
			};
		},
		render:function(opt){
			if(opt && $.isPlainObject(opt)){
				opt.method = "render";
				this._render(opt);
			}else{
				this._render({method:"render"});
			}
		},
		set:function(opt){
			if(opt && $.isPlainObject(opt)){
				opt.method = "set";
				this._render(opt);
			}
		},
		_each:function(){
			var self = this;
			var element = this.element;
			var storageLang = self.storageLang;
			var langPacks = self.langPacks;
			var $dom;
			if(typeof this.element == "string"){
				$dom = $(element);
			}else{
				$dom = element;
			}
			$dom.find("[lang]").each(function(){
				var $this = $(this);
				var langContent = $this.attr("lang").toLowerCase();
				var semiIndex = langContent.indexOf(";");
				var lbracketIndex = langContent.indexOf("{");
				var strlen = langContent.length;
				var colonIndex,attrId,attrValue,dicKey;
				if(lbracketIndex > -1){
					var rbracketIndex = langContent.indexOf("}");
					if(semiIndex > -1){
						langContent = langContent.substring(lbracketIndex+1,semiIndex);
					}else{
						langContent = langContent.substring(lbracketIndex+1,rbracketIndex);
					}
					attrArr = langContent.split(",");
					for(var num=0,arrLen=attrArr.length;num<arrLen;num++){
						attr = attrArr[num];
						colonIndex = attr.indexOf(":");
						attrId = attr.substring(0,colonIndex);
						attrValue = attr.substring(colonIndex+1);
						result = self._result({str:attrValue});
						self._return({$this:$this,attrId:attrId,str:result});
					}
				}else if(langContent){
					colonIndex = langContent.indexOf(":");
					if(semiIndex > -1){
						attrId = langContent.substring(0,colonIndex);
						attrValue = langContent.substring(colonIndex+1,strlen-1);
					}else{
						attrId = langContent.substring(0,colonIndex);
						attrValue = langContent.substring(colonIndex+1);
					}
					result = self._result({str:attrValue});
					self._return({$this:$this,attrId:attrId,str:result});
				}
			});
		},
		_result:function(obj,variableArr){
			var pos = this.pos;
			var langPacks = this.langPacks;
			var storageLang = this.storageLang;
			var attrValue = obj.str.toString();
			var str = "";
			if(attrValue.indexOf("+") > -1){
				var arr = [];
				var current;
				arr = attrValue.split("+");
				for(var num=0;num<arr.length;num++){
					current = arr[num];
					if(storageLang == "en"){
						if(current.match(/\W/)){
							str += current + " ";
						}else{
							str += langPacks[storageLang][pos][current] + " ";
						}
					}else{
						if(current.match(/\W/)){
							str += current;
						}else{
							str += langPacks[storageLang][pos][current];
						}
					}
				}
				str = str.replace(/\s$/g,"");
			}else{
				str = langPacks[storageLang][pos][attrValue];
			}
			if(variableArr && str){
				for(var num=0;num<variableArr.length;num++){
					if(str.indexOf("{"+num+"}") > -1){
						str = str.replace("{"+num+"}",variableArr[num]);
					}
				};
			}
			return str;
		},
		_return:function(obj){
			var $this = obj.$this;
			var attrId = obj.attrId;
			var str = obj.str;
			switch(attrId){
				case "text":
					$this.text(str);
					break;
				case "value":
					$this.val(str);
					break;
				case "title":
					$this.attr("title",str);
					break;
				case "alt":
					$this.attr("alt",str);
					break;
				case "placeholder":
					$this.attr("placeholder",str);
					break;
			}
		},
		current:function(){
			var lang = this._getStorageLang();
			switch(lang){
				case "en":
					return 1;
					break;
				case "zh_CN":
					return 2;
					break;
			}
		}
	};
//validator 插件的封装对象,具体方法含义参照项目中的文档
var validator={
		storageLang:null,
		langPacks:{},
		element:null,
		elements:[],
		validation:null,
		render:function(element,paramObj){
			this._cacheElements(element,paramObj);
			this._cacheStorageLang();
//			this.hideAll();
//			this._destroy();
			this._render();
		},
		_cacheStorageLang:function(){
			var lang = this._returnStorageLang();
			if(!this.storageLang){
				this.storageLang = lang ? lang : "zh_CN";
			}else{
				if(this.storageLang != lang){
					this.storageLang = lang ? lang : "zh_CN";
				}
			}
		},
		_cacheElements:function(element,paramObj){
			var self = this;
			this.element = element;
			var elements = this.elements;
			var defaultObj = {
				fadeDuration: 0,
				showOneMessage:true,
				focusFirstField:true,
				customFunctions:{
					cloudInput:function(field, rules, i, options){
						var nohtml  = new RegExp("(<[^>]+>)|(&gt|&lt|&amp|&quot|&nbsp)");
						if( nohtml.test(field.val()) ){
							return options.allrules.nohtml.alertText;
						}
						return true;
					}
				}
			};
			paramObj = $.extend(paramObj,defaultObj);
			if(elements.length > 0){
				var count = 0;
				$.each(elements,function(index,obj){
					if(element == obj.element){
						var currentParamObj = obj.paramObj;
						var newParamObj = $.extend(currentParamObj,paramObj);
						self.elements[index]["paramObj"] = newParamObj;
						count++;
					}
				});
				if(count === 0){
					this.elements.push({element:element,paramObj:paramObj});
				}
			}else{
				this.elements.push({element:element,paramObj:paramObj});
			}
		},
		result:function(element){
			if(this.validation){
				if(element){
					return $(element).validationEngine('validate');
				}else{
					return $(this.element).validationEngine('validate');
				}
			}
		},
		prompt:function(element,obj){
			$(element).validationEngine("showPrompt",obj.text,"load",obj.promptPosition?obj.promptPosition:"topLeft",true);
		},
		hide:function(element){
			if(element){
				$(element).validationEngine('hide');
			}else{
				$(this.element).validationEngine('hide');
			}
		},
		hideAll:function(element){
			if(element){
				$(element).validationEngine('hideAll');
			}else{
				var elements = this.elements;
				if(this.validation){
					$.each(elements,function(index,obj){
						$(obj.element).validationEngine('hideAll');
					});
				}
			}
		},
		_destroy:function(){
			var elements = this.elements;
			if(this.validation){
				this.validation = null;
				$.each(elements,function(index,obj){
					$(obj.element).validationEngine('detach');
				});
			}
		},
		_render:function(){
			var storageLang = this.storageLang;
			var hasPack = function(){
				var langPacks = self.langPacks;
				for(var attr in langPacks){
					if(attr == storageLang){
						return true;
					}
				}
			};
			if(hasPack()){
				this._renderForm();
			}else{
				this._loadPack();
			}
		},
		_returnStorageLang:function(){
			return localStorage.getItem("language");
		},
		_renderForm:function(){
			var self = this;
			var elements = this.elements;
			self._returnAllRules();
			$.each(elements,function(index,obj){
				self.validation = $(obj.element).validationEngine('attach',obj.paramObj);
			});
		},
		_loadPack:function(){
			var self = this;
			var url = "language/"+ self.storageLang + "/validationengine.lang.js";
			$.getScript(url,function(data){
				self._cacheLangPacks();
				self._renderForm();
			});
		},
		_returnAllRules:function(){
			var self = this;
			var returnAllRules = function(){
				$.validationEngineLanguage.allRules = self.langPacks[self.storageLang];
			};
			return returnAllRules();
		},
		_cacheLangPacks:function(){
			var self = this;
			var lang = $.validationEngineLanguage;
			var langName,langObj;
			for(var attr in lang){
				langName = attr;
				langObj = lang[attr];
			}
			self.langPacks[langName] = langObj;
		}
};
//nav对象 为“首页|注册|映翰通”中的"首页"添加选中效果
function FnNav(){
	this.pageNum=0;
	this.page={
		0:"#home-nav-index",
		1:"#home-nav-login",
		2:"#home-nav-reg",
		3:"#home-nav-devforum",
		4:"#home-nav-aboutus"
	};
	this.setCurrent=function(){
		$(this.page[this.pageNum]).addClass("home-nav-a-current");
	};
}
//header对象 为"中文|English"点击操作添加css效果，以及设置本地语言
function FnHeader(){
this.zh=$("#lang-en");
this.en=$("#lang-zh");
this._promptCurrentLang=function(){
        	var lang = localStorage.getItem("language");
        	if(lang=="en"){
        		$("#lang-zh").css("color","#555");
        		$("#lang-en").css("color","#0EA0F5");
        	}else if(lang=="zh_CN"){
        		$("#lang-zh").css("color","#0EA0F5");
        		$("#lang-en").css("color","#555");
        	}
        };
this.zh.bind("click",function(){
    			locale.set({lang:"en"});
    			validator.render(validator.element,validator.paramObj);
    			header._promptCurrentLang();
    		});
this.en.bind("click",function(){
    			locale.set({lang:"zh_CN"});
    			validator.render(validator.element,validator.paramObj);
    			header._promptCurrentLang();
				});
}
//FnIndex(index对象)首页对象包含ForgetPassword（忘记密码页对象）、Register(注册页对象)
function FnIndex(){
	var self=this;
	//统计用户登录失败次数（在当前页面统计，刷新或离开即重置）
	if(!localStorage.getItem("failedTimes")){
		this.failedTimes=0;
		localStorage.setItem("failedTimes",self.failedTimes);
	}
	else{
		this.failedTimes=localStorage.getItem("failedTimes",self.failedTimes);
	}
	//获取并显示验证码
	this._showAuthcode=function(){
				var option={};
				option.url="/api/captchas";
				option.success=function(data){
					 var imgUrl = "/api/captchas/" + data._id;
	                 $("#home-verimg").children("img").attr("src", imgUrl).attr("picid",data.pictureId);
				};
				$.ajax(option);
	        };
	//登录框中的验证码行
	this.veriyCodeLine=$("#home-content-login-vercode").hide();
	if(self.failedTimes>=2){
		self.veriyCodeLine.show();
		$("#home-content-login").height(260+32);
		self._showAuthcode();
	}
//md5加密方法
this.md5=(function(str) {
		var hex_chr = "0123456789abcdef";
		function rhex(num) {
			str = "";
			for ( var j = 0; j <= 3; j++) {
				str += hex_chr.charAt((num >> (j * 8 + 4)) & 15)+ hex_chr.charAt((num >> (j * 8)) & 15);
			}
			return str;
		}
		function str2blks_MD5(str) {
			nblk = ((str.length + 8) >> 6) + 1;
			blks = new Array(nblk * 16);
			for ( var i = 0; i < nblk * 16; i++) {
				blks[i] = 0;
			}
			for (i = 0; i < str.length; i++) {
				blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
			}
			blks[i >> 2] |= 128 << ((i % 4) * 8);
			blks[nblk * 16 - 2] = str.length * 8;
			return blks;
		}
		function add(x, y) {
			var lsw = (x & 65535) + (y & 65535);
			var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return (msw << 16) | (lsw & 65535);
		}
		function rol(num, cnt) {
			return (num << cnt) | (num >>> (32 - cnt));
		}
		function cmn(q, a, b, x, s, t) {
			return add(rol(add(add(a, q), add(x, t)), s), b);
		}
		function ff(a, b, c, d, x, s, t) {
			return cmn((b & c) | ((~b) & d), a, b, x, s, t);
		}
		function gg(a, b, c, d, x, s, t) {
			return cmn((b & d) | (c & (~d)), a, b, x, s, t);
		}
		function hh(a, b, c, d, x, s, t) {
			return cmn(b ^ c ^ d, a, b, x, s, t);
		}
		function ii(a, b, c, d, x, s, t) {
			return cmn(c ^ (b | (~d)), a, b, x, s, t);
		}
		function MD5(str) {
			x = str2blks_MD5(str);
			var a = 1732584193;
			var b = -271733879;
			var c = -1732584194;
			var d = 271733878;
			for ( var i = 0; i < x.length; i += 16) {
				var olda = a;
				var oldb = b;
				var oldc = c;
				var oldd = d;
				a = ff(a, b, c, d, x[i + 0], 7, -680876936);
				d = ff(d, a, b, c, x[i + 1], 12, -389564586);
				c = ff(c, d, a, b, x[i + 2], 17, 606105819);
				b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
				a = ff(a, b, c, d, x[i + 4], 7, -176418897);
				d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
				c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
				b = ff(b, c, d, a, x[i + 7], 22, -45705983);
				a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
				d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
				c = ff(c, d, a, b, x[i + 10], 17, -42063);
				b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
				a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
				d = ff(d, a, b, c, x[i + 13], 12, -40341101);
				c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
				b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
				a = gg(a, b, c, d, x[i + 1], 5, -165796510);
				d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
				c = gg(c, d, a, b, x[i + 11], 14, 643717713);
				b = gg(b, c, d, a, x[i + 0], 20, -373897302);
				a = gg(a, b, c, d, x[i + 5], 5, -701558691);
				d = gg(d, a, b, c, x[i + 10], 9, 38016083);
				c = gg(c, d, a, b, x[i + 15], 14, -660478335);
				b = gg(b, c, d, a, x[i + 4], 20, -405537848);
				a = gg(a, b, c, d, x[i + 9], 5, 568446438);
				d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
				c = gg(c, d, a, b, x[i + 3], 14, -187363961);
				b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
				a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
				d = gg(d, a, b, c, x[i + 2], 9, -51403784);
				c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
				b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
				a = hh(a, b, c, d, x[i + 5], 4, -378558);
				d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
				c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
				b = hh(b, c, d, a, x[i + 14], 23, -35309556);
				a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
				d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
				c = hh(c, d, a, b, x[i + 7], 16, -155497632);
				b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
				a = hh(a, b, c, d, x[i + 13], 4, 681279174);
				d = hh(d, a, b, c, x[i + 0], 11, -358537222);
				c = hh(c, d, a, b, x[i + 3], 16, -722521979);
				b = hh(b, c, d, a, x[i + 6], 23, 76029189);
				a = hh(a, b, c, d, x[i + 9], 4, -640364487);
				d = hh(d, a, b, c, x[i + 12], 11, -421815835);
				c = hh(c, d, a, b, x[i + 15], 16, 530742520);
				b = hh(b, c, d, a, x[i + 2], 23, -995338651);
				a = ii(a, b, c, d, x[i + 0], 6, -198630844);
				d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
				c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
				b = ii(b, c, d, a, x[i + 5], 21, -57434055);
				a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
				d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
				c = ii(c, d, a, b, x[i + 10], 15, -1051523);
				b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
				a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
				d = ii(d, a, b, c, x[i + 15], 10, -30611744);
				c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
				b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
				a = ii(a, b, c, d, x[i + 4], 6, -145523070);
				d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
				c = ii(c, d, a, b, x[i + 2], 15, 718787259);
				b = ii(b, c, d, a, x[i + 9], 21, -343485551);
				a = add(a, olda);
				b = add(b, oldb);
				c = add(c, oldc);
				d = add(d, oldd);
			}
			return rhex(a) + rhex(b) + rhex(c) + rhex(d);
		}

		if (!String.prototype.md5) {
			String.prototype.md5 = function() {
				return MD5(this).toUpperCase();
			};
		}
		return function(str){
			return MD5(str).toUpperCase();
		};
	})();
//密码输入框切换效果
this._showPasswordInput=function(focus){
	$("#home-input-pwd-text").hide();
     $("#home-input-pwd-password").show();
      if(focus){
       $("#home-input-pwd-password").focus();
       }
};
//验证码输入框切换效果
this._showVercodeInput=function(focus){
        	$("#home-input-ver-default").hide();
        	$("#home-input-ver-custom").show();
        	if(focus){
        		$("#home-input-ver-custom").focus();
        	}
        };
//将ajax的请求主体序列化为url编码格式
this.makeParamToQueryString=function(param){
	var arr = [];
	for(var attr in param){
		if($.isArray(param[attr])){
			arr.push(attr + "=" + param[attr].join(","));
		}else{
			arr.push(attr + "=" + param[attr]);
		}
	}
	return arr.join("&");
};
//首页登录方法，参数afterLoginSuccess为rememberMe对象的一个方法
//afterLoginSuccess:登录成功才写入cookie
this._login=function(afterLoginSuccess){
			$("#home-input-submit").unbind();
        	var self = this;
            var username = $("#home-input-user").val();
            var password = $("#home-input-pwd-password").val();
            var pictureId = $("#home-verimg").children("img").attr("picid");
            var code = $("#home-input-ver-custom").val();
            var errorFun = function(error){
            	self._showAuthcode();
            };
			var option={};
			option.param={
				client_id:"000017953450251798098136",
				client_secret:"08E9EC6793345759456CB8BAE52615F3",
				grant_type:"password",
				username:username,
				password:"",
				password_type:"",
				varificationCode:code,
				picId:pictureId,
				language:locale.current()
			};
			if(self.failedTimes<2){
				delete option.param.varificationCode;
				delete option.param.picId;
				option.param.password_type="2";
				option.param.password=self.md5(password);
			}else{
				option.param.password_type="3";
				option.param.password=self.md5(self.md5(password)+pictureId);
			}
				option.data=encodeURIComponent("clientSecret")+"="+encodeURIComponent("08E9EC6793345759456CB8BAE52615F3");
				option.url="/oauth2/access_token"+"?"+self.makeParamToQueryString(option.param);
				option.type="POST";
				option.contentType="application/x-www-form-urlencoded";
				option.dataType="JSON";
				option.processData=false;
				option.timeout=1200000;
				option.error=function(error){
			};
			option.success=function(data){
				 $("#home-input-submit").bind("click",function(){
		            	self._showPasswordInput();
		            	self._showVercodeInput();
		            	if(validator.result("#formID") && $("body").find(".inhand-dialog").length == 0 && $("body").find(".ui-window-content").length == 0){
		            		self._login(afterLoginSuccess);
		            	}
		            });
				if(data.error){
				//添加错误提示
				$("#tips-content").html(locale.get(data.error_code)+"<span></span>"+"!").show();
				if(data.error_code=="21304"){
					var start=data.error.indexOf("(");
					var end=data.error.indexOf(")");
					var seconds=data.error.substring(start+1,end);
					try{
						var secondNum=parseInt(seconds);
						var $span=$("#tips-content span");
						var clearinter=setInterval(
							function(){
								if(secondNum<0){
								clearInterval(clearinter);
								$("#tips-content").empty();
							}else{
								$span.text(":"+secondNum--+"s")
							}
						},"1000");
					}catch(e){
					}
				}
				//统计失败次数
				(function(){
//					var countFail=localStorage.getItem("failedTimes");
					self.failedTimes++;
					localStorage.setItem("failedTimes",self.failedTimes)
//					self.failedTimes=localStorage.getItem("failedTimes");
					if(self.failedTimes>=2){
						self.veriyCodeLine.show();
						$("#home-content-login").height(260+32);
						self._showAuthcode();
					}
				})();
			}
			else{
				//登录成功后，在跳转之前，记录必要的信息到本地和cookie中
				sessionStorage.setItem("accessToken",data.access_token);
				sessionStorage.setItem("refreshToken",data.refresh_token);
				self.failedTimes=localStorage.getItem("failedTimes");
				if(self.failedTimes<2){
					self.failedTimes=0;
					localStorage.setItem("failedTimes",self.failedTimes);
				}
				afterLoginSuccess(username,password);
				var indexUrl=localStorage.getItem("indexURL");
				if(indexUrl!="www"){
					location.replace("../../applications/index_1.html")
				}else{
					location.replace("../applications/index_1.html");
				}
			}
		};
		$.ajax(option);
        };
//忘记密码模态框对象
function ForgetPassword(){
	var self=this;
	//忘记密码框的html结构对象
	this.$forgetHtml=$("<div class='forget-window' id='forget-window'>"+
"<div lang='text:forget_pwd_prompt' class='forget-notice' style='padding-right:5px;line-height:20px;'></div>"+
"<form id='forget-password-formid' class='forget-form' action=''>"+
"<ul class='forget-form-ul'><li>"+
"<p lang='text:email' class='forget-row-title'></p>"+
"<input autocomplete='off' id='forget-input-email' class='validate[required,custom[email]s] forget-row-input-email' name='' type='text' />"+
"</li>"+
"<li>"+
"<p lang='text:security_code' class='forget-row-title'></p>"+
"<input autocomplete='off' id='forget-input-vcode-default' class='forget-row-input-vcode-default' type='text' lang='value:case_insensitive'/>"+
"<input autocomplete='off' id='forget-input-vcode-custom' style='display:none;' class='validate[required,custom[systemAuthcode]] forget-row-input-vcode-custom' type='text' />"+
"<p style='margin-left:10px;'><a><img style='border:1px solid #ddd' id='imgVcode' src='' lang='title:click_to_change'/></a></p>"+
"<p style='display:none;margin-left:10px;'><a lang='text:vague' id='refreshImgVcode' class='refreshImgVcode'></a></p>"+
"</li>"+
"<li class='tips-button-line'>"+
"<p class='forget-row-title'></p>"+
"<button id='forget-button-sure' lang='text:reset_password' class='forget-button-sure'></button></p>"+
"<span class='forgetpwd-tips'></span>"+
"</li>"+
"</ul>"+
"</form>"+
"</div>");
//将忘记密码模态框显示出来
	this.showHtml=function(){
		var self=this;
		//忘记密码框的模态框
		self.$motai=$('<div>').appendTo("body").append(this.$forgetHtml)
								.css({"position":"fixed","top":"0px","left":"0px","width":"100%"/*document.body.clientWidth||document.documentElement.clientWidth*/,"height":"100%"/*document.body.clientHeight||document.documentElement.clientHeight*/,"background-color":"rgba(0,0,0,0.5)"})
								.bind("click",function(e){
									//当点击忘记密码框之外的地方，整个模态框消失
									if(e.target==$(this)[0]){
										$(this).fadeOut("500",function(){
											self.$motai.remove();
											//解除所有通过bind绑定的事件
											self.$motai.find("*").unbind();
											self.$motai=null;
											//如果有按钮上的等待定时器，则清除该定时器
											if(self.textloop){
												clearInterval(self.textloop);
											}
										});
									}
								});
		$(window).bind("keydown",function(e){
			//当用户按下Esc键的时候，判断是否清除忘记密码模态框
			if(self.$motai&&e.keyCode=="27"){
				self.$motai.fadeOut("500",function(){
					self.$motai.remove();
					self.$motai.find("*").unbind();
					self.$motai=null;
					if(self.textloop){
						clearInterval(self.textloop);
					}
				});
			}else if(self.$motai&&e.keyCode=="13"){
				//当用户按下enter键时，判断是否触发“重置密码”按钮的click事件
				$("#forget-button-sure").trigger("click");
			}
		});
		var width=self.$motai.width();
		var height=self.$motai.height();
		var $forgetHtmlWidth=$(".forget-window").width();
		//设置忘记密码框，在模态框中的位置
		this.$forgetHtml.css({"position":"absolute","top":-(height/3)+"px","left":(width-$forgetHtmlWidth)/2+"px"});
		this.$forgetHtml.animate({"top":(height/3)+"px"},"1000",function(){
			locale.render({element:"#forget-window"});
			self._showAuthcode();
		});
	};
	//获取并显示验证码图片
	this._showAuthcode=function(){
		var option={};
		option.url="/api/captchas";
		option.type="GET";
		option.contentType="application/json;charset=UTF-8";
		option.success=function(data){
			self.picId=data.pictureId;
			var imgUrl = "/api/captchas/" + data._id;
			$("#imgVcode").attr("src", imgUrl);
		};
		$.ajax(option);
	};
	//验证码输入框的切换效果
	this._showVercodeInput=function(bool){
    	$("#forget-input-vcode-default").hide();
    	$("#forget-input-vcode-custom").show();
    	if(focus){
    		$("#forget-input-vcode-custom").focus();
    	}
	};
	//请求发出后，按钮上面显示的等待状态，$obj是目标按钮
	this.onHandleRequestEffect=function($obj){
		var self=this;
		var count=0;
		$obj.text("·");
		self.textloop=setInterval(textloop,"500");
		function textloop(){
			if(count==3){
				count=0;
				$obj.text("·");
			}else{
				count++;
				var text=$obj.text();
				for(var i=0;i<count;i++){
					text=text+"·";
				}
				$obj.text(text);
			}
		}
	};
	//给忘记密码框上的html组件绑定事件
	this.event=function(){
		var self=this;
		$("#imgVcode").bind("click",function(){
			self._showAuthcode();
		});
		$("#refreshImgVcode").bind("click",function(){
			self._showAuthcode();
		});
		//“重置密码”按钮的事件处理函数
		var buttonClickHandler=function(e){
			//阻止button标签的默认行为
			e.preventDefault();
			self._showVercodeInput();
			if(validator.result("#forget-password-formid")){
				//将“重置按钮”的事件处理程序解绑，以解决用户在当前请求未返回前，多次点击多次请求
				$(this).unbind().bind("click",function(e){
					e.preventDefault();
				});
				var $obj=$("#forget-button-sure");
				//按钮上的等待效果
				self.onHandleRequestEffect($obj);
				var username = $.trim($("#forget-input-email").val());
				var picId = self.picId;
				var varificationCode = $.trim($("#forget-input-vcode-custom").val());
				var requestJson = {
						"username":username,
						"picId":picId,
						"varificationCode":varificationCode
				};
				requestJson = JSON.stringify(requestJson);
				var option={};
				option.url="/api2/forgotten_password?language=" + locale.current();
				option.type="POST";
				option.data=requestJson;
				option.dataType="json";
				option.contentType="application/json";
				option.error=function(){
					$("#forget-button-sure").bind("click",buttonClickHandler);
					if(self.textloop){
						clearInterval(self.textloop);
						var langstr=$obj.attr("lang");
						var index=langstr.indexOf(":");
						$obj.text(locale.get(langstr.substring(index+1)));
					}
				};
				option.success=function(data){
					if(self.textloop){
						clearInterval(self.textloop);
						var langstr=$obj.attr("lang");
						var index=langstr.indexOf(":");
						$obj.text(locale.get(langstr.substring(index+1)));
					};
					if(data.error){
						$("li span.forgetpwd-tips").html("<p>"+locale.get(data.error_code)+"!</p>");
						self._showAuthcode();
					}else{
						var $successSend=$("<div></div>").html(locale.get("password_has_been_sent_to_the_email")+"!").css({
							"margin":"30px auto",
							"line-height":"35px",
							"color":"#5F962E",
							"font-size":"20px",
							"font-weight":"bold",
							"background":"url('images/home-bg.png') 0 -16px no-repeat"
						});
						self.$motai.find("#forget-window").empty().append($successSend);
					};
					$("#forget-button-sure").bind("click",buttonClickHandler);
				};
				$.ajax(option);
			}
		};
		$("#forget-button-sure").bind("click",buttonClickHandler);
		 //在输入框中给出提示
		$("#forget-input-vcode-default").focus(function(){
			self._showVercodeInput(true);
		});
	}
};
//注册页对象
function Register(){
	var self=this;
	//注册框对象的html结构
	this.$registHtml=$("<form class='content-main form-for-registe' id='form-for-registe'>"+
							"<div class='title-for-company' lang='{text:itkdn_device_cloud}'></div>"+
							"<div class='regist-title' lang='{text:regist_title}'></div>"+
							"<ul>"+
								"<li class='form-line-wrapper' id='emailname-line'>"+
									"<label for='emailname' class='label-for-input' lang='{text:email}'></label>"+
									"<input autocomplete='off' type='text' class='validate[required,maxSize[50],custom[email]]' id='emailname' lang='{placeholder:enter_email}'/>"+
								"</li>"+
								"<li class='form-line-wrapper' style='display:none'>"+
									"<label for='regist-user-password' class='label-for-input' lang='{text:set_code}'></label>"+
									"<input autocomplete='off' type='text' id='regist-user-password' class='regist-user-password validate[required]' lang={placeholder:enter_password}/>"+
								"</li>"+
								"<li class='form-line-wrapper' style='display:none'>"+
									"<label for='confirm-user-password' class='label-for-input' lang='{text:confirm_password}'></label>"+
									"<input autocomplete='off' type='text' id='confirm-user-password' class='confirm-user-password validate[required]' lang='{placeholder:confirm_password}'/>"+
								"</li>"+
								"<li class='form-line-wrapper'>"+
									"<label for='username' class='label-for-input' lang='{text:username}'></label>"+
									"<input autocomplete='off' type='text' class='validate[required,maxSize[30]]' id='username' lang='{placeholder:enter_username}'/>"+
								"</li>"+
								"<li class='form-line-wrapper'>"+
									"<label for='organizationname' class='label-for-input' lang='{text:orgnization}'></label>"+
									"<input autocomplete='off' type='text' class='validate[required,maxSize[30]] ' id='organizationname' lang='{placeholder:enter_organization_name}'/>"+
								"</li>"+
								"<li class='form-line-wrapper secure-code-wrapper'>"+
									"<label for='regist-secure-code' class='label-for-input label-secure-code' lang='{text:captcha}'></label>"+
									"<input autocomplete='off' class='input-checkcode validate[required,custom[systemAuthcode]]' id='regist-secure-code' type='text' lang='{placeholder:please_input_captcha}'/>"+
									"<span class='simg-holder cover-img-holder'><a href='#'><img id='imgVcode' src='' lang='title:click_to_change' /></a></span>"+
								"</li>"+
								"<li class='form-line-wrapper for-service-rule'>"+
									"<button class='float-right button-immeditately-regist' id='button-immeditately-regist' lang='text:regist_immeditately'></button> "+
									"<p class='bottom-service-rule' lang='{text:rule_legend}'></p>"+
								"</li>"+
							"</ul>"+
						"</form>");
	//将注册框对象添加到模态对象中，并显示模态对象
	this.showHtml=function(){
		self.$motai=$("<div>").appendTo("body")
		.append(self.$registHtml)
		.css({"position":"absolute","top":"0px","left":"0px","width":"100%"/*document.body.clientWidth||document.documentElement.clientWidth*/,"height":"100%"/*document.body.clientHeight||document.documentElement.clientHeight*/,"background-color":"rgba(0,0,0,0.5)"})
		.bind("click",function(e){
									//当点击对象是模态层而不是注册框对象时，隐藏整个模态
									if(e.target==$(this)[0]){
										$(this).fadeOut("500",function(){
											self.$motai.remove();
											self.$motai.find("*").unbind();
											self.$motai=null;
											if(self.timeloop){
												clearInterval(self.timeloop);
											}
										});
									}
								});
		$(window).bind("keydown",function(e){
			//当用户按下Esc键，并且注册模态对象存在，清除注册模态对象
			if(self.$motai&&e.keyCode=="27"){
				self.$motai.fadeOut("500",function(){
					self.$motai.remove();
					//解绑所有通过bind绑定的事件处理程序
					self.$motai.find("*").unbind();
					self.$motai=null;
					//如果定时器timeloop存在，则清除
					if(self.timeloop){
						clearInterval(self.timeloop);
					};
					//如果定时器textloop存在，则清除
					if(self.textloop){
						clearInterval(self.textloop);
					};
				});
			}else if(self.$motai&&e.keyCode=="13"){
				//当用户按下enter键，判断是否触发“立即注册”按钮click的处理程序
				$("#button-immeditately-regist").trigger("click");
			}
		});
		var width=self.$motai.width();
		var height=self.$motai.height();
		var $registHtmlWidth=$(".form-for-registe").width();
		//设置注册框对象，在模态对象中的初始位置
		this.$registHtml.css({"position":"absolute","top":-(height/2)+"px","left":(width-$registHtmlWidth)/2+"px"});
		this.$registHtml.animate({"top":(height/6)+"px"},"1000",function(){
			locale.render({element:"#form-for-registe"});
			var language=localStorage.getItem("language");
			$("<a href='' target='_blanket' class='anchor-service-rule'></a>").attr('href','service/'+language.toLowerCase()+".html").appendTo($(".bottom-service-rule")).html("&nbsp;"+locale.get("term_service"));
			self._showAuthcode();
			self.autoEmail=new FnEmailAutocomplete(
				{
				email:["qq.com","inhand.com.cn","126.com","163.com","sina.com","hotmail.com","gmail.com","sohu.com","139.com","189.cn","wo.com.cn"],
				$emailInput:$("#emailname"),
				$emailLi:$("#emailname-line")
			},null);
			self.autoEmail.events();
		});
	};
	//获取并显示验证码
	this._showAuthcode=function(){
		var option={};
		option.url="/api/captchas";
		option.type="GET";
		option.contentType="application/json;charset=UTF-8";
		option.success=function(data){
			self.picId=data.pictureId;
			var imgUrl = "/api/captchas/" + data._id;
			$("#imgVcode").attr("src", imgUrl);
		};
		$.ajax(option);
	};
	//请求发出后，按钮上的等待效果，$obj请求发出的按钮对象
	this.onHandleRequestEffect=function($obj){
		var count=0;
		$obj.text("·");
		self.textloop=setInterval(textloop,"500");
		function textloop(){
			if(count==3){
				count=0;
				$obj.text("·");
			}else{
				count++;
				var text=$obj.text();
				for(var i=0;i<count;i++){
					text=text+"·";
				}
				$obj.text(text);
			}
		}
	};
	//为注册页面上的html组件绑定事件处理程序
	this.event=function(){
		var self=this;
        $("#imgVcode").bind("click",function(){
        	self._showAuthcode();
        });
        //处理按钮的事件绑定和解绑，主要是为了阻止button标签的默认行为和用户在一次请求未返回的情况多次点击，导致多次请求的情况
        this.buttonClickBindAndUnbind=function(e){
        	var $obj=$("#button-immeditately-regist");
        	e.preventDefault();
        	if(self.autoEmail&&self.autoEmail.$html.css("display")=="none"){
            	if(validator.result("#form-for-registe")){
            		$obj.unbind().bind("click",function(e){
            			e.preventDefault();
            		});
            		self._registe($obj);
            	}
        	}
        };
        $("#button-immeditately-regist").bind("click",function(e){self.buttonClickBindAndUnbind(e)});
	};
	//注册提交,$obj按钮对象
	this._registe=function($obj){
		var self=this;
		//提示信息元素，如果有则在重新发请求时，清除
		var tips=$(".regist-tips");
		if(tips){
			tips.remove();
		};
		//设置按钮上的等待效果
		self.onHandleRequestEffect($obj);
		var email=$("#emailname").val();
		var userpassword=$("#regist-user-password").val();
		var username=$("#username").val();
		var organname=$("#organizationname").val();
		var varificationCode=$("#regist-secure-code").val();
		var picId=self.picId;
		var option={};
		option.data={
			email:email,
			username:username,
//			userpassword:userpassword,
			name:organname,
			varificationCode:varificationCode,
			picId:picId,
			question:"",
			answer:"",
			questionId:1
		};
		option.data=JSON.stringify(option.data);
		option.url="/api2/organizations?language=" + locale.current();
		option.type="POST";
		option.dataType="json";
		option.contentType="application/json;charset=UTF-8";
		//将这些信息保存在对象属性中，以便resendEmail使用
		self.option=option;
		option.error=function(){
			$("#button-immeditately-regist").bind("click",function(e){self.buttonClickBindAndUnbind(e)});
			//当textloop定时器存在时，清除，并重置按钮中的文字
			if(self.textloop){
				clearInterval(self.textloop);
				var langstr=$obj.attr("lang");
				var index=langstr.indexOf(":");
				$obj.text(locale.get(langstr.substring(index+1)));
			};
		};
		option.success=function(data){
			//当textloop定时器存在时，清除，并重置按钮中的文字
			if(self.textloop){
				clearInterval(self.textloop);
				var langstr=$obj.attr("lang");
				var index=langstr.indexOf(":");
				$obj.text(locale.get(langstr.substring(index+1)));
			};
			if(data.error){
				self._showAuthcode();
				$("#button-immeditately-regist").bind("click",function(e){self.buttonClickBindAndUnbind(e)});
				if(data.error_code==20007){
					if(data.error.indexOf("@")>-1){
						$("#emailname").after("<span class='regist-tips'>"+locale.get("email_already_exists")+"</span>");
					}else{
						$("#organizationname").after("<span class='regist-tips'>"+locale.get("organ_already_exists")+"</span>");
					}
				}else if(data.error_code==20013){
					$("#regist-secure-code").after("<span class='regist-tips'>"+locale.get(data.error_code+"")+"</span>");
				}
			}else{
				//注册成功页面html对象
	        	var registSuccess=$("<div class='registration-success-prompt' lang='text:registration_success_prompt'></div><button class='btn-send-email-again' lang='{text:send_email_again}'></button><button class='btn-sign-in-platform' lang='{text:sign_in_platform}'></button>").hide();
	    		self.$registHtml.find("ul").fadeOut("500").remove().end().append(registSuccess);
	    		registSuccess.fadeIn("500");
	    		locale.render({element:self.$registHtml});
	    		self.$registHtml.find("div.regist-title").text(locale.get("regist_success"));
	    		//对“再发一封邮件”按钮的显示内容以及事件处理程序进行控制
	    		function resendEmail(e){
	        		e.preventDefault();
	        		var option=self.option;
	        		option.error=function(){};
	        		option.success=function(data){
	        			if(data.error){

	        			}else{
	        				$("button.btn-send-email-again").unbind().bind("click",function(e){
	        					e.preventDefault();
	        				});
	        				var timeSeconds=120;
	        				$("<span class='timing'></span>").text("("+timeSeconds+"s)").appendTo($("button.btn-send-email-again"));
	        				self.timeloop=setInterval(countFn,"1000");
	        				//倒计时，并绑定事件
	        				function countFn(){
	        					if(timeSeconds==0){
	        						clearInterval(self.timeloop);
	        						$("span.timing").remove();
	        						$("button.btn-send-email-again").bind("click",function(e){
	        							resendEmail(e);
	        						})
	        					}else{
	        						timeSeconds--;
		        					$("span.timing").text("("+timeSeconds+"s)");
	        					}
	        				};
	        			}
	        		};
	        		$.ajax(option);
	    		};
	    		$("button.btn-send-email-again").bind("click",function(e){resendEmail(e)});
	    		//登录按钮的click事件处理程序
	    		$("button.btn-sign-in-platform").bind("click",function(e){
	    			e.preventDefault();
	    			self.$motai.fadeOut("500",function(){
						self.$motai.remove();
						self.$motai=null;
						self.$motai.find("*").unbind();
						if(self.timeloop){
							clearInterval(self.timeloop);
						}
					});
	    		});
			}
		};
		$.ajax(option);
	};
};
//为页面上的html组件绑定事件处理程序,afterLoginSuccess为remberMe的方法
this._effects=function(afterLoginSuccess){
			var self = this;
            $("#home-login-forget").bind("click", function(){
            	if(self.forgetPass){
            		self.forgetPass=null;
            	}
            	self.forgetPass=new ForgetPassword();
            	self.forgetPass.showHtml();
            	self.forgetPass.event();
            });
            $("#home-nav-reg").bind("click",function(){
            	if(self.register){
            		self.register=null;
            	}
            	self.register=new Register();
            	self.register.showHtml();
            	self.register.event();
        		validator.render("#form-for-registe",{
                	promptPosition:"topRight",
                	scroll: false
        		});
            });
            $("#home-input-submit").bind("click",function(){
            	self._showPasswordInput();
            	self._showVercodeInput();
            	if(validator.result("#formID") && $("body").find(".inhand-dialog").length == 0 && $("body").find(".ui-window-content").length == 0){
            		self._login(afterLoginSuccess);
            	}
            }).mouseover(function(){
            	$(this).css({"background":"#0EA0F5"});
            }).mouseout(function(){
            	$(this).css({"background":"#0EA0F5"});
            });
            //监听主页的按键，如果为enter并且注册和忘记密码对象都不在，则执行登录操作
            $("body").bind("keydown",function(event){
        		if(/*$("body").find(".inhand-dialog")*/(!self.register||self.register.$motai==null)&&(!self.forgetPass||self.forgetPass.$motai==null)&& $("body").find(".ui-window-content").length == 0){
        			if(event.keyCode == 13){
        				self._showPasswordInput();
                    	self._showVercodeInput();
        				if(validator.result("#formID")){
        					self._login(afterLoginSuccess);
        				}
        			}
        		}
            });
};
//为主页上的html组件对象绑定事件处理程序
this._events=function(){
        	var self = this;
			sessionStorage.setItem("failedTimes",self.failedTimes)
        	$("#home-verimg").children("img").click(function(){
                self._showAuthcode();
            });
        	// 在输入框中给出提示
            $("#home-input-pwd-text").focus(function(){
            	self._showPasswordInput(true);
            });

            $("#home-input-ver-default").focus(function(){
            	self._showVercodeInput(true);
            });

            $("#home-content-bottom-div-center-text-button-DT").click(function(){
            	if(locale.current() === 1){
            		window.open('http://www.inhandnetworks.com/index.php/zh/products/device-networks-cloud/introduction.html','_blank');
            		return;
            	}
            	window.open('http://www.inhand.com.cn/index.php/zh/products/device-network/device-touch.html','_blank');
            }).mouseover(function(){
            	$(this).css("background","#0EA0F5");
            }).mouseout(function(){
            	$(this).css("background","#0EA0F5");
            });

            $("#home-content-bottom-div-center-text-button-DS").click(function(){
            	if(locale.current() === 1){
            		window.open('http://www.inhandnetworks.com/index.php/zh/products/device-networks-cloud/introduction.html','_blank');
            		return;
            	}
            	window.open('http://www.inhand.com.cn/index.php/zh/products/device-network/device-sense.html','_blank');
            }).mouseover(function(){
            	$(this).css("background","#0EA0F5");
            }).mouseout(function(){
            	$(this).css("background","#0EA0F5");
            });

            $("#home-content-bottom-div-center-text-button-DM").click(function(){
            	if(locale.current() === 1){
            		window.open('http://www.inhandnetworks.com/index.php/zh/products/device-networks-cloud/introduction.html','_blank');
            		return;
            	}
            	window.open('http://www.inhand.com.cn/index.php/zh/products/device-network/device-manager.html','_blank');
            }).mouseover(function(){
            	$(this).css("background","#0EA0F5");
            }).mouseout(function(){
            	$(this).css("background","#0EA0F5");
            });
        };
}
//---------------------------------------------------新加功能---------------------------------------
//邮箱自动补全，注册登录都要用
//emailAutocompletion对象
function FnEmailAutocomplete(option,rememberMe){
	var self=this;
	//样本邮箱
	this.email=option.email;
	this.$emailInput=option.$emailInput;
	this.$emailLi=option.$emailLi;
	this.$html=$("<ul id='email-auto-completion'>").addClass("email-auto-completion").appendTo(this.$emailLi).hide();
	this.isSonOfFnRemember=rememberMe instanceof FnRememberMe;
	if(self.isSonOfFnRemember){
		self.$html.css({
			"top":"17px",
			"width":"175px"
		})
	}else{
		self.$html.css({
			"top":"34px",
			"width":"270px",
			"left":"210px"
		})
	}
	this.$html.currentChildren=0;
	this.$html.currentLi=0;
	if(self.isSonOfFnRemember){
		this.switchPwdAndCheckboxByEmail=function (tempRex){
			if(self.inputText==rememberMe.loginInfo.username){
				rememberMe.checkboxInput[0].checked=true;
				rememberMe.passwordInput.val(rememberMe.loginInfo.password).show();
				$("#home-input-pwd-text").hide();
				validator.hide(rememberMe.passwordInput);
			}else if(self.inputText!=rememberMe.loginInfo.username&&tempRex.test(rememberMe.loginInfo.username)){
				rememberMe.passwordInput.val("").hide();
				$("#home-input-pwd-text").show();
				rememberMe.checkboxInput[0].checked=false;
			}
		};
	}
	this.getInputText=function(e){
		self.$html.empty();
		self.inputText=self.$emailInput.val();
		var regStr=self.inputText;
		//利用输入框中的内容来即时创建一个正则对象去与样本邮箱进行匹配，匹配成功的样本邮箱显示出来
		var tempRex=new RegExp("^"+regStr);
		if(self.switchPwdAndCheckboxByEmail){
			self.switchPwdAndCheckboxByEmail(tempRex);
		}
		var atPos=self.inputText.lastIndexOf("@");
		var prePos=self.inputText.indexOf("@");
		var textLength=self.inputText.length;
		var stringAfterAt=self.inputText.substring(atPos+1);
		var stringBeforeAt=self.inputText.substring(0,atPos+1);
		var regex=new RegExp("^("+stringAfterAt+")");
		var indexArr=$.inArray(stringAfterAt,self.email);
		if(indexArr==-1){
			if(atPos>-1&&prePos==atPos&&atPos!=0){
				$("<li lang='text:select_email' id='select_email'>").text(locale.get("select_email")).appendTo(self.$html);
				//形成匹配的样本邮箱选择面板
				$.each(self.email,function(n,value){
				var flag=regex.test(value);
				if(flag){
					$("<li>").html(stringBeforeAt+value).appendTo(self.$html).mousedown(function(){
						var email=$(this).text();
						self.$emailInput.val(email);
						if(self.isSonOfFnRemember){
							if(email==rememberMe.loginInfo.username){
								rememberMe.checkboxInput[0].checked=true;
								rememberMe.passwordInput.val(rememberMe.loginInfo.password).show();
								$("#home-input-pwd-text").hide();
							}else{
								rememberMe.checkboxInput[0].checked=false;
								rememberMe.passwordInput.val("").hide();
								$("#home-input-pwd-text").show();
							}
						}
						validator.result(self.$emailInput);
						self.$html.empty().hide();
					}).mouseover(function(){
						$(".li-mouseover-style").removeClass("li-mouseover-style");
						$(this).addClass("li-mouseover-style");
					}).mouseout(function(){
						$(this).removeClass("li-mouseover-style");
					});
				};
			});
				//如果样本邮箱面板有内容则显示，并对当前背景变黑的选项的索引进行记录
				if(self.$html.children().size()>1){
					self.$html.show();
					if(self.$html.currentChildren!=self.$html.children().size()){
						self.$html.currentLi=0;
					}
					self.$html.currentChildren=self.$html.children().size();
				}else{
					self.$html.hide();
					//当前样本邮箱中的样本邮箱数
					self.$html.currentChildren=0;
					//当前背景变黑的样本邮箱索引
					self.$html.currentLi=0;
				}
				//如果按键是方向键向下，且样本邮箱面板存在，则让当前下一个样本邮箱变黑
				if(e.keyCode=="40"&&self.$html.css("display")!='none'){
					self.$html.children().eq(self.$html.currentLi).removeClass("li-mouseover-style");
					if(self.$html.currentLi==self.$html.currentChildren-1){
						self.$html.currentLi=0;
					}
					self.$html.currentLi++;
					self.$html.children().eq(self.$html.currentLi).addClass("li-mouseover-style");
				}else if(e.keyCode=="38"&&self.$html.css("display")!='none'){
					//如果按键是方向键向上，且样本邮箱面板存在，则让当前上一个样本邮箱变黑
					self.$html.children().eq(self.$html.currentLi).removeClass("li-mouseover-style");
					if(self.$html.currentLi==1){
						self.$html.currentLi=self.$html.currentChildren;
					}
					self.$html.currentLi--;
					self.$html.children().eq(self.$html.currentLi).addClass("li-mouseover-style");
				}else if(e.keyCode=="13"&&self.$html.currentLi!=0){
					//如果按键是enter键，且当前变黑的选项索引不为0，则将这个样本邮箱填入输入框，并且与cookie中的信息进行比较
					//如果与cookie中的username相同则，自动填写密码
					var email=self.$html.children().eq(self.$html.currentLi).text();
					self.$emailInput.val(email);
					self.inputText=self.$emailInput.val();
					var regStr=self.inputText;
					var tempRex=new RegExp("^"+regStr);
					if(self.switchPwdAndCheckboxByEmail){
						self.switchPwdAndCheckboxByEmail(tempRex);
					}
					//样本邮箱面板消失
					self.$html.empty().hide();
				}
			}
		}
	};
	this.checkfn=function(e){
					if(self.$html.css("display")!="none"){
						if(e.keyCode=="40"||e.keyCode=="38"){
							e.preventDefault();
						}
						//阻止事件冒泡，减少影响范围
						e.stopPropagation();
					}
					//在事件发生0.1秒后再去获取输入框中的值,keydown事件发生在输入框内容改变之前
					setTimeout(function(){self.getInputText(e)},"100");
				};
	this.checkWhenChange=this.checkfn;
	this.checkWhenFocus=this.checkfn;
	this.checkWhenBlur=function(){
			self.$html.empty().hide();
		};
	//为邮件输入框对象绑定keydown、focus、blur的事件处理程序
	this.events=function(){
					this.$emailInput.bind("keydown",this.checkWhenChange).bind("focus",this.checkWhenFocus).bind("blur",this.checkWhenBlur);
				};
};
//记住密码功能
//rememberMe对象
function FnRememberMe(){
	var self=this;
	this.checkboxInput=$("#remember-me");
	this.passwordInput=$("#home-input-pwd-password");
	this.usernameInput=$("#home-input-user");
	//自动填写用户名和密码
	this.autoSetLoginInfo=function(){
		var cookieStr=document.cookie;
		this.loginInfo={};
		if(cookieStr){
			var cookieArr=cookieStr.split("^");
			$.each(cookieArr,function(n,value){
				if(value.indexOf('username')!=-1){
					var arr=value.split("=");
					self.loginInfo.username=arr[1];
				}else if(value.indexOf('password')!=-1){
					var arr=value.split("=");
					self.loginInfo.password=arr[1];
				}else if(value.indexOf('expires')!=-1){
					var arr=value.split("=");
					self.loginInfo.expires=arr[1];
				}
			});
			if(self.loginInfo){
				this.usernameInput.val(self.loginInfo.username);
				this.passwordInput.val(self.loginInfo.password).show();
				$("#home-input-pwd-text").hide();
				this.checkboxInput.attr("checked",true);
			}
		}
};
	//登录成功后，如果点击了“记住我”，则将用户名和密码写入cookie
	this.afterLoginSuccess=function(username,password){
		if(self.checkboxInput[0].checked){
			var date = new Date();
			date.setDate(date.getDate() + 3650);
			document.cookie="username="+username+"^password="+password+";expires=" + date.toGMTString();
		}else{
			//如果输入框中的用户名和cookie中的用户名一致，但未点击“记住我”，则清除cookie
			if(username==self.loginInfo.username){
				var date=new Date("1970-1-1 00:00.000");
				document.cookie="username="+""+"^password="+";expires=" + date.toGMTString();
			}
		}
	};
};
//各对象加上交互
locale.render();
validator.render("#formID",{
	promptPosition:"centerTop",
	scroll:false
});
//首页、注册、映翰通
var nav=new FnNav();
nav.setCurrent();
//中文|English
var header=new FnHeader();
header._promptCurrentLang();
//记住我
var rememberMe=new FnRememberMe();
rememberMe.autoSetLoginInfo();
//邮箱自动补全
var emailAutocompletion=new FnEmailAutocomplete({
	email:["qq.com","inhand.com.cn","126.com","163.com","sina.com","hotmail.com","gmail.com","sohu.com","139.com","189.cn","wo.com.cn"],
	$emailInput:$("#home-input-user"),
	$emailLi:$("#home-content-login-user")
},rememberMe);
emailAutocompletion.events();
//首页
var index=new FnIndex();
index._effects(rememberMe.afterLoginSuccess);
index._events();