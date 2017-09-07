/**
 * Created by zhouyunkui on 14-6-10.
 */
define(function(require){
    var cloud=require("cloud/base/cloud");
//    require("./droplist.css")
    var GroupDropList=Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            //jquery对象
//            options.beforeElement;
            this.options=options;
            this.clickedItem=options.clickedItem;
            this.drawPannel();
            this.getAllGroupInfo();
            this.eleArr=[];
//            this.drawHTML();
//            this.dropListPannel.appendTo(options.selector);
        },
        drawPannel:function(){
            var self=this;
            self.dropListPannel=$("<div></div>").css({
                "position":"absolute",
                "z-index":"2",
                "background-color":"rgb(188, 188, 188)",
                "border":"1px solid rgb(188, 188, 188)",
                "border-radius":"4px",
//                "height":"200px",
                "width":"255px",
                "padding-bottom":"5px"
//                "overflow-y":"scroll",
//                "overflow-x":"hidden",
//                "height":"200px"
            });
            self.dropListPannel.appendTo(self.options.selector);
        },
        //去获取所有分组的信息
        getAllGroupInfo:function(){
            var self=this;
            cloud.Ajax.request({
                url:"api/wifi_user_group",
                type:"GET",
                parameters:{
                    limit:0,
                    verbose:100
                },
                success:function(data){
                    //存储分组信息
//                    this.groupData=data.result.pluck("_id");
                    self.groupData=[];
                    //加入用户黑名单信息
                    var userBlackList={
                        "name":locale.get("visitor_blacklist"),
                        "id":2
                    };
                    var nonGroupList={
                        "name":locale.get("non_group_user"),
                        "id":"system"
                    };
                    self.groupData.push(userBlackList);
                    if(self.clickedItem.options._id!="system"){
                        self.groupData.push(nonGroupList);
                    }
                    for(var i=0;i<data.total;i++){
                        if(self.clickedItem.options._id!=data.result[i]._id){
                            var tempObj={};
                            tempObj.name=data.result[i].name;
                            tempObj.id=data.result[i]._id;
                            self.groupData.push(tempObj);
                        }
                    }
                    self.drawHTML();
                },
                error:function(data){

                }
            })
        },
        drawHTML:function(){
            var self=this;
            document.body.addEventListener("click",function(e){
                if(self.dropListPannel&&e.target!=self.dropListPannel[0]){
                     self.dropListPannel.remove();
                     self.dropListPannel=null;
                }
            },false)
            var dropListContent=$("<ul></ul>").css({
                "width":"250px",
                "background-color":"rgb(188, 188, 188)"
            });
            dropListContent.appendTo(self.dropListPannel);
            var size=self.groupData.length;
            for(var i=0;i<size;i++){
                var liElement=$("<li></li>");
                self.eleArr[i]=liElement;
                self.eleArr[i].attr("id",i);
                self.eleArr[i].css({
                    "line-height":"20px",
                    "padding-left":"5px",
                    "margin-top":"5px",
                    "margin-left":"5px"
                }).click(function(event){
                        self.dropListPannel.remove();
                        self.dropListPannel=null;
                        self.fire("afterclick",self.eleArr[event.target.id].data);
                    }).mouseover(function(){
                        $(this).css({
                            "cursor":"pointer",
                            "background-color":"rgb(188, 188, 188)"
//                            "border":"1px solid rgb(255,255,255)"
                        })
                    }).mouseout(function(){
                        $(this).css({
                            "cursor":"pointer",
                            "background-color":"rgb(255,255,255)"
                        })
                    }).css({
                        "text-align":"center",
                        "border-radius":"4px",
                        "background-color":"rgb(255,255,255)"
                    });
                self.eleArr[i].data=self.groupData[i];
                self.eleArr[i].text(liElement.data.name);
                self.eleArr[i].appendTo(dropListContent);
            };
            var height=self.dropListPannel.height();
            if(height>200){
                self.dropListPannel.css({
//                    "scrollbar-face-color":"rgb(255,255,255)",
//                    "scrollbar-highlight-color": "rgb(255,255,255)",
//                    "scrollbar-shadow-color": "rgb(255,255,255)",
//                    "scrollbar-3dlight-color": "rgb(255,255,255)",
//                    "scrollbar-arrow-color": "rgb(255,255,255)",
//                    "scrollbar-track-color": "rgb(255,255,255)",
//                    "scrollbar-darkshadow-color":"rgb(255,255,255)",
//                    "scrollbar-base-color":"rgb(255,255,255)",
                    "overflow-y":"scroll",
                    "overflow-x":"hidden",
                    "height":"200px"
                })
            }
        },
        destroy:function(){
            if(this.dropListPannel){
                this.dropListPannel.remove();
            }
        }
    });
    return GroupDropList;
})