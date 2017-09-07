/**
 * Created by zhang on 14-9-4.
 */
define(function(require){
    var Button = require("cloud/components/button");
    var ContentTable = require("../../components/content-table");
    var TagOverview = require("../../components/tag-overview");
    var subTable = require("./rightTab");

    var Service = require("./service");
    var pvuvService =require("./pvuvService");
    require("cloud/lib/plugin/jquery.qtip");

    require("./table.css");

    var AllSite = "";

    var columns = [
        {
            "title": "状态",
            "dataIndex": "online",
            "lang":"{text:state}",
            "cls": null,
            "width": "17%",
            render:function(data, type, row){
                var display = "";
                if ("display" == type) {
                    switch (data) {
                        case 1:
                            var onlineStr = locale.get({lang:"online"});
                            display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-online\" title = \"#{status}\"}></div>")
                                .evaluate({
                                    status : onlineStr
                                });
                            break;
                        case 0:
                            var offlineStr = locale.get({lang:"offline"});
                            display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-offline\" title = \"#{status}\"}></div>")
                                .evaluate({
                                    status : offlineStr
                                });
                            break;

                        default:
                            break;
                    }
                    return display;
                } else {
                    return data;
                }
            }
        } , {
            "title": "热点名称",
            "dataIndex": "name",
            "width": "83%",
            "lang":"{text:site_name}"
        }];

    var Ndistribution = function(x){
        var left = 1/(Math.pow(2*Math.PI,0.5));
        var right = Math.exp(Math.pow(x,2)/-2);
        return left*right;
    };

    var getArr = function(x){
        return $R(-20,20).collect(function(one){
            return Ndistribution(one/10) * x
        });
    };




    var Content = Class.create(cloud.Component,{
        initialize:function($super,options){
            this.moduleName = "pvuvSta";
            $super(options);

            this.service = Service;
            this.pvuvService = pvuvService;
            this._render();

            locale.render({
                element : this.element
            });

        },

        //left site table start
        _render:function(){
            var self = this;
            this.element.addClass("pvuvStaContent");
            this.left = $("<div class='pvuvStaleft'></div>").appendTo(this.element);
            this.leftSide = $("<div class='pvuvSta-left'></div>").appendTo(this.left).height(this.element.height());
            this.container = $("<div class='pvuvSta-container'></div>").appendTo(this.element);
            this.leftbar = $("<div class='pvuvSta-bar'><img src='rainbowStatistics/PVUV_Statistics/img/br_next.png'></div>").appendTo(this.left);

            this.leftSide.hover(function(){
                self._animate(true);
            },function(){
                self._animate(false);
            });

            this.leftbar.hover(function(){
                self._animate(true);
            });

            this._renderList();
            this._renderToolbar();
        },

        _animate:function(flag){
            var self = this;
            if(flag == "left" || flag == false){
                setTimeout(function(){
                    self.leftSide.stop().animate({
                        left:"-300px"
                    },300,"swing");
                    self.leftbar.stop().animate({
                        left:"0px",
                        opacity:"1"
                    },300,"swing");
                },200);
            }

            if(flag == "right" || flag == true){
                self.leftSide.stop().animate({
                    left : "0px"
                },300,"swing");
                self.leftbar.stop().animate({
                    left:"300px",
                    opacity:"0"
                },300,"swing");
            }
        },

        _renderList:function(){
            var self = this;
            this.siteList = new ContentTable({
                selector: this.leftSide,
                toolbarFeatrues : false,
                rowSelectModel : "none",
                service: this.service,
                contentColumns: columns,
                events : {
                    click:function(id,data){
                        self._renderContent(id,data.name);
                        self._animate(false);
                    }

                }
            });

            this._renderContent(AllSite,locale.get("all_site"));
            setTimeout(function(){
                self.leftSide.stop().animate({
                    left:'-300px'
                },500,"swing");
                self.leftbar.stop().animate({
                    left:"0px",
                    opacity:"1"
                },500,"swing");
            },1500,"swing");
        },

        _renderToolbar:function(){
            /* toolbar start */
            var toolbar = this.siteList.getToolbar();
            var tagBtn = new Button({
                imgCls: "cloud-icon-label",
                lang:"{title:tag}",
                id: this.moduleName + "-tag-button"
            });

            var tagLabel = $("<span>").addClass("pvuvSta-sitelist-tb-item").text(locale.get("tag+:"));
            this.tagName = $("<span>").addClass("pvuvSta-sitelist-tb-item").text("");

            toolbar.appendLeftItems([tagBtn, tagLabel, this.tagName]);

            var tagContent = $("<div id='pvuvSta-tag-overview'>")//.appendTo(this.element);

            tagContent.hover(function(){
                self._animate(true);
            });

            this.createTagOverview(tagBtn, tagContent);

            this._renderSearchBar(toolbar);
        },

        _renderSearchBar:function(toolbar){
            var self = this;
            var rightContainer = $("<div class='pvuvSta-toolbar-search'></div>");

            var pattern=/^[a-zA-Z0-9_\-\u4e00-\u9fa5]+$/i;

            var display = this.siteList.display;

            var refreshPage=function(data,value){
                self.value = value;
                var contentTable=self.siteList;
                contentTable.page.reset(data);
                contentTable.nowPage = 1;
//					contentTable._renderPaging(Math.ceil(total/display),1,display);
                self.service.getResourcesIds=function(start, limit, callback, context) {
                    cloud.Ajax.request({
                        url : "api/sites",
                        type : "get",
                        parameters:{
                            name:value,
                            cursor:start,
                            limit:limit,
                            verbose:1
                        },
                        success : function(data) {
                            data.result = data.result.pluck("_id");
                            callback.call(context || this, data);
                        }
                    });
                };
            };

            var searchContent = $("<input type='text'>").width(120).appendTo(rightContainer)
                .bind("keyup",function(e){
                    if(e.keyCode == 13){
                        var value = $(this).val().replace(/\s/g,"").match(pattern);
                        self.service.getSitelistByName(value,0,display,function(data){
                            self.siteList.content.render(data.result);
                            refreshPage(data,value);
                        });
                    }
                });

            var searchBtn = new Button({
                container:rightContainer,
//                imgCls: "cloud-icon-label",
//                lang:"{title:tag}",
                text : locale.get("query"),
                events:{
                    click:function(){
                        var value = searchContent.val().replace(/\s/g,"").match(pattern);
                        self.service.getSitelistByName(value,0,display,function(data){
                            self.siteList.content.render(data.result);
                            refreshPage(data,value);
                        });
                    }
                }
            });
            searchBtn.element.css("margin","0 0 5px 5px");

            toolbar.leftDiv.after(rightContainer);
            toolbar.rightDiv.remove();

            this.SearchBar = rightContainer;
        },

        togglerSearchBar:function(show){
            if(show){
                this.SearchBar.show();
            }else{
                this.SearchBar.hide();
            }
        },

        createTagOverview: function(btn, tagContent) {
            this.tagOverview = new TagOverview({
                events: {
                    "click": function(tag,tagobj){
                        var self = this;
                        self.togglerSearchBar(tag._id == 1);
                        this.mask();
                        this.tagName.text(tagobj.name);
                        this.tagId = tagobj._id;
                        //get the resources ids in the tag, then use content module to render these resources.
                        this.service.getResourcesIds = tag.loadResourcesData;
                        this.siteList.render(this.service,tag,function(){
                            self.unmask();
//                            var data = self.siteList.getContentData();
                        });
                    },
                    "update":function(tag){
                        if(tag._id == this.tagId){
                            this.tagName.text(tag.name);
                        }
                    },
                    scope: this
                },
                service: this.service,
                selector: tagContent
            });

            //bind a qtip window on the tag bubbon, to show tag overview component.
            btn.element.qtip({
                content: {
                    text: tagContent
                },
                position: {
                    my: "top left",
                    at: "bottom middle"
                },
                show: {
                    event: "click"
                },
                events: {
                    render: function() {
                        //before render, set the tag overview component's position to the visiable window.
                        tagContent.css({
                            marginLeft: 0
                        });
                    }
                },
                hide: {
                    event: "click unfocus"
                },
                style: {
                    classes: "qtip-shadow cloud-qtip qtip-rounded",
                    def: false
                }
            });
        },

        reloadTags : function(notRefreshContent){
            this.tagOverview.loadTags(notRefreshContent);
        },

        //left site tabel end

        _renderContent:function(siteId,siteName){
            this.clearContainer();
            this.siteName = $("<div class='pvuvSta-name'>"+siteName+"</div>").appendTo(this.container);
            this.dashcontainer = $("<div class='Stat-container'></div>").appendTo(this.container);
            this.scrollbar = $("<div class='Stat-scrollbar unselectable'></div>").appendTo(this.dashcontainer);
            this.subcontent = $("<div class='Stat-content'></div>").appendTo(this.dashcontainer);

            this._renderScrollbar(siteId);

            this._renderSubContent(siteId);
        },

        _renderSubContent:function(siteId){
            var self = this;
            this.subTab = new subTable({
                selector:self.subcontent,
                siteId:siteId,
                events:{
                    "updateTypeName":function(data){
                        var res = self.scrollbarArr.find(function(one){
                            if(one.data.id == data.id){
                                return one
                            }
                        });
                        res.updateName(data.name);
                    }
                }
            });

        },

        _renderScrollbar:function(siteId){
            var self = this;
            var leftBtn = $("<div class='scrollbar-left-button scroll-button'></div>").appendTo(this.scrollbar);
            var rightBtn = $("<div class='scrollbar-right-button scroll-button'></div>").appendTo(this.scrollbar);
            var itemsContainer = $("<div class='scrollbar-items-container'></div>").appendTo(this.scrollbar);
            var itemsContent = $("<div class='scrollbar-items-content'></div>").appendTo(itemsContainer);

            var scrollInterval = null;
            var mouseInterval = null;
            leftBtn.hover(function() {
                scrollInterval = setInterval(function() {
                    itemsContainer.scrollLeft(itemsContainer.scrollLeft() - 10);
                }, 20);
                $(this).addClass("scroll-btn-hover");
            }, function() {
                clearInterval(scrollInterval);
                $(this).removeClass("scroll-btn-hover");
            }).mousedown(function() {
                    mouseInterval = setInterval(function() {
                        itemsContainer.scrollLeft(itemsContainer.scrollLeft() - 50);
                    }, 20);
                }).mouseup(function() {
                    clearInterval(mouseInterval);
                }).mouseout(function(){
                    clearInterval(mouseInterval);
                });

            rightBtn.hover(function() {
                scrollInterval = setInterval(function() {
                    itemsContainer.scrollLeft(itemsContainer.scrollLeft() + 10);
                }, 20);
                $(this).addClass("scroll-btn-hover");
            }, function() {
                clearInterval(scrollInterval);
                $(this).removeClass("scroll-btn-hover");
            }).mousedown(function() {
                    mouseInterval = setInterval(function() {
                        itemsContainer.scrollLeft(itemsContainer.scrollLeft() + 50);
                    }, 20);
                }).mouseup(function() {
                    clearInterval(mouseInterval);
                }).mouseout(function(){
                    clearInterval(mouseInterval);
                });


            var arr = getArr(20);
            this.scrollbar.mousewheel(function(){
                if(arguments[1]>0){//1 up
                    var i = 0;
                    var clickInterval = setInterval(function(){
                        if(i<arr.length){
                            itemsContainer.scrollLeft(itemsContainer.scrollLeft() - arr[i]);
                            i++;
                        }else{
                            clearInterval(clickInterval);
                        }
                    },10)

                }else if(arguments[1]<0){//-1 down
                    var j = 0;
                    var clickInterval = setInterval(function(){
                        if(j<arr.length){
                            itemsContainer.scrollLeft(itemsContainer.scrollLeft() + arr[j]);
                            j++;
                        }else{
                            clearInterval(clickInterval);
                        }
                    },10)
                }
            });

            var scrollbarArr = [];
            this.scrollbarArr = scrollbarArr;

            this.pvuvService.getTypes(siteId,function(datas){
//                console.log(datas);
                datas.each(function(one){
                    var scrollitem = new scrollItem({
                        container : itemsContent,
                        data:one,
                        events:{
                            "click":function(data){
//                                console.log(data);
                                self.subTab.renderTable(data);
                            }
                        }
                    });
                    scrollbarArr.push(scrollitem)
                });
                var length = scrollbarArr.length;
                itemsContent.width(350*length);
                if(scrollbarArr[0]){
                    scrollbarArr[0].element.click();
                    if(itemsContent.width() < itemsContainer.width()){
                        leftBtn.hide();
                        rightBtn.hide();
                    }
                }else{
//                    leftBtn.hide();
//                    rightBtn.hide();
                    self.dashcontainer.empty();
                    self.dashcontainer.text(locale.get("no_data")).css({
                        "font-size":"22px",
                        "text-align":"center",
                        "color": "rgb(143, 139, 139)"
                    });

                }
            });

        },

        clearContainer:function(){

            this.container && this.container.empty();
        },

        destroy:function($super){

            $super()
        }
    });
    var data = [{
        last: {pv:1, uv:1, date:1409068800000},
        tId: "1",
        tName: "www.baidu.com",
        total: {pv:9480, uv:475},
        updateTime: 1409192227764
    }];

    var data2 = [{
        data:[{
            date:"今日",
            pv:"-",
            terminaluv: "-",
            useruv: "-"
        },{
            date:"昨日",
            pv:"-",
            terminaluv: "-",
            useruv: "-"
        },{
            date:"总计",
            pv:"9480",
            terminaluv: "475",
            useruv: "-"
        }],
        id:1,
        name:"www.baidu.com"
    }]



    var scrollItem = Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);

            this.data = options.data
            this._render();



        },
        updateName:function(name){
            this.element.find(".scroll-item-title").text(name);
        },
        _render:function(){
            var self = this;
            var html = "<div class='scroll-item-title'>"+this.data.name+"</div>" +
                "<div class='scroll-item-info'></div>"
            this.element.html(html);
            this.element.addClass("scroll-item").bind("click",function(){
                self.fire("click",self.data);
            }).hover(function(){
                    $(this).css("opacity","1");
                },function(){
                    $(this).css("opacity","0.8");
                });
            this._renderInfo()
        },
        _renderInfo:function(){
            var container = this.element.find(".scroll-item-info");
            var leftInfo = $("<div class='scroll-info-left item-info'><span>PV</span></div>").appendTo(container);
            var rightInfo = $("<div class='scroll-info-right item-info'><span>UV</span></div>").appendTo(container);

            this.data.data.each(function(one,index){
                if(index == 0 || index == 2){
                    var $left = $("<div></div>").appendTo(leftInfo);
                    var $right = $("<div></div>").appendTo(rightInfo);
                    $("<span class='scroll-left-pv'>"+one.pv+"</span>").appendTo($left);
                    $("<span class='scroll-left-date'>"+one.date+"</span>").appendTo($left);
                    $("<span class='scroll-right-terminauv'>"+one.terminaluv+"</span>").appendTo($right);
                }
            });

        },
        destroy:function($super){
            $super()
        }
    })

    return Content;
});