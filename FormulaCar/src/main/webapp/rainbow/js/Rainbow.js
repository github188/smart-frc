/**
 * Created by zhouyunkui on 14-7-2.
 */
    var packages={
            default:"base",
            base:"language"
        };
    Rainbow={
        locale:{
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
        },
        cloud:{
            //设置请求的域名或ip(如果有端口，则也应该加上)
            inPortalApiHost:"http://api.m.inhand.com.cn:5280",
            platformApiHost:"http://10.5.101.230:8080",
            //设置页面的机构id
            organId:"53a8346e4023194511000055",
            //设置手机账号登录时，需要向平台发送的client_id和client_secret
            clientId:"539ea49d3273d8193c353ecc",
            clientSecret:"08E9EC6793125651287CB8BAE52615E2",
            //设置手机账号登录(区别于第三方登录方式)成功后的，应该跳转到的页面(可自定义)
            afterLoginSucessPage:"http://c2.inhandnetworks.com",
            //此为密码加密的前缀
            preStr:"dajianzi2b",
            //(client-gateway)获取手机码api的uri
            getSmsCodeApiUri:"/api/gateway/sms_code",
            //(client-Authserver)手机账号登录授权api的uri
            phoneLoginCodeApiUri:"/WifiUser/api/wifi_authenticate",
            //(client-gateway)手机账号登录获取token api的uri
            phoneLoginTokenApiUri:"/api/gateway/access_token",
            md5:(function(str) {
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
            })()
        }
    };