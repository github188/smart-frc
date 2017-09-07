/**
 * Created by zhang on 14-10-10.
 */
define(function(require){
    require("cloud/base/cloud");
    var html=require("text!./partials/ITview.html");
    var service = require("./service");
    var MaterialView = require("./lib/materialView");
    var DATA = [{
        _id:"1",
        title:"标题1",
        author:"作者1",
        summary:"摘要1",
        showInContent:false,
        content:"正文1",
        originalLink:"http://www.baidu.com",
        mediaUri:"53BCAD0D0CF2028D1EF1FE93",
        mediaType:"news",
        groupId:undefined,
        state:1,
        isCover:true,
        createTime:1413020118150,
        updateTime:1413020118150
    },{
        _id:"2",
        title:"标题2",
        author:"作者2",
        summary:"摘要2",
        showInContent:false,
        content:"正文2",
        originalLink:"http://www.tuicool.com/",
        mediaUri:"53BCAD0D0CF2028D1EF1FE93",
        mediaType:"news",
        groupId:undefined,
        state:1,
        isCover:true,
        createTime:1413020118150,
        updateTime:1413020118150
    },{
        _id:"3",
        title:"多图文标题1",
        author:"多图文作者1",
        summary:"多图文摘要1",
        showInContent:false,
        content:"多图文正文1",
        originalLink:"http://www.qq.com/",
        mediaUri:"53BCAD0D0CF2028D1EF1FE93",
        mediaType:"news",
        groupId:"3",
        state:1,
        isCover:true,
        createTime:1413020118150,
        updateTime:1413020118150
    },{
        _id:"4",
        title:"多图文标题2",
        author:"多图文作者2",
        summary:"多图文摘要2",
        showInContent:false,
        content:"多图文正文2",
        originalLink:"http://www.qq.com/",
        mediaUri:"53BCAD0D0CF2028D1EF1FE93",
        mediaType:"news",
        groupId:"3",
        state:1,
        isCover:false,
        createTime:1413020118150,
        updateTime:1413020118150
    },{
        _id:"5",
        title:"多图文标题3",
        author:"多图文作者3",
        summary:"多图文摘要3",
        showInContent:false,
        content:"多图文正文3",
        originalLink:"http://www.qq.com/",
        mediaUri:"53BCAD0D0CF2028D1EF1FE93",
        mediaType:"news",
        groupId:"3",
        state:1,
        isCover:false,
        createTime:1413020118150,
        updateTime:1413020118150
    }];
    var View =  Class.create(cloud.Component,{
        initialize : function($super, options){
            $super(options);
            this.service = service;
            this._render();
            this._bindEvents();
        },

        _procData:function(datas){
            var newDatas = [],
                groupIds = [],
                groups = [];
            datas.each(function(one){
                if(one.groupId){
                    groupIds.push(one.groupId);
                    groups.push(one);
                }else{
                    newDatas.push(one);
                }
            });
            groupIds = cloud.util.uniqueArray(groupIds);
            groupIds.each(function(id){
                var group = groups.findAll(function(one){
                    return one.groupId == id;
                });
                group.length>0 && newDatas.push(group);
            });
            return newDatas
        },


        _render : function(){
            var self = this;
            this.element.html(html);

            var containers = this.element.find(".inner");
            this.materialview = [];

            this.service.getMaterial({type:"news"},function(data){
                var newData = self._procData(data);
//            console.log("newData",newData);

                /* this.materialview[0] = new MaterialView({
                 container: $(containers[0]),
                 datatype :"1",
                 viewtype :"edit",
                 data:DATA[0],
                 events:{
                 "delete":function(){
                 //                        self.materialview[0].destory();
                 },
                 "edit":function(data){
                 self.fire("edit",data);
                 }
                 }

                 });
                 this.materialview[1] = new MaterialView({
                 container: $(containers[1]),
                 datatype :"1",
                 viewtype:"normal",
                 data:DATA[1]
                 });
                 this.materialview[2] = new MaterialView({
                 container: $(containers[2]),
                 datatype:"1",
                 viewtype:"select",
                 data:DATA[1],
                 events:{
                 "beforeSelect":function(data){
                 self.beforeSelect(data);
                 }
                 }
                 }).module;
                 this.materialview[3] = new MaterialView({
                 container: $(containers[0]),
                 datatype:"1",
                 viewtype:"select",
                 data:DATA[0],
                 events:{
                 "beforeSelect":function(data){
                 self.beforeSelect(data);
                 }
                 }
                 }).module;*/
                newData.each(function(one,index){
                    var index = index % 3;
                    var module = new MaterialView({
                        container: $(containers[index]),
                        viewtype :"edit",
                        data:one,
                        events:{
                            "delete":function(datas){
                                dialog.render({
//                                    lang:"",
                                    text:"确认删除？",
                                    buttons:[{
                                        lang: "yes",
                                        click: function(){
                                            if(datas.length>0){
                                                var ids = datas.collect(function(one){
                                                    return one._id;
                                                });
                                            }else{
                                                var ids = [datas._id];
                                            }
                                            self.service.delMaterial(ids,function(data){
                                                //console.log("delete ok",data);
                                                self.fire("reRender");
                                            });
                                            dialog.close();
                                        }
                                    }, {
                                        lang: "no",
                                        click: function(){
                                            dialog.close();
                                        }
                                    }]
                                });

                            },
                            "edit":function(data){
                                self.fire("edit",data);
                            }
                        }
                    }).module;
                    self.materialview.push(module);
                });

                self.element.find("#js_listCount").text(self.materialview.length);
            });


        },

        beforeSelect:function(data){
            //console.log("select :",data);
            this.selectArr.collect(function(one){
                one.setSelect(false);
            });
        },

        _bindEvents:function(){
            var self = this;
            var $addSingle = this.element.find(".icon_appmsg_create.single").parent();
            var $addMulti = this.element.find(".icon_appmsg_create.multi").parent();

            $addSingle.bind("click",function(){
                self.fire("new",1);
            });
            $addMulti.bind("click",function(){
                self.fire("new",2);
            });
        },

        destroy : function($super){
//            this.element.remove();
            $super();
        }
    });

    return View
});