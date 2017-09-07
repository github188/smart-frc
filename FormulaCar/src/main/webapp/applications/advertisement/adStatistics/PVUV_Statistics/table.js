/**
 * Created by zhang on 14-9-4.
 */
define(function(require){
    var Button = require("cloud/components/button");
    var ContentTable = require("../../../components/content-table");
    var TagOverview = require("../../../components/tag-overview");
    var subTable = require("./rightTab");

    var Service = require("./service");
    var pvuvService =require("./pvuvService");
    require("cloud/lib/plugin/jquery.qtip");

    require("./table.css");


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
            this.data = this.options.data;
            this._render();

            locale.render({
                element : this.element
            });

        },

        _render:function(){
            var self = this;
            this.element.addClass("pvuvStaContent");
            this.container = $("<div class='pvuvSta-container'></div>").appendTo(this.element);

              this._renderContent(this.data.adId,this.data.adName);
        },


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
        /**
         *
         * @param siteId
         * @private
         */

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