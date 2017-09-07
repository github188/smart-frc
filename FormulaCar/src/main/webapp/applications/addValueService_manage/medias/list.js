define(function(require){
	require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var Service = require("./service");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var addMedias = require("./update/medias-window");
	var columns = [ {
		"title":locale.get({lang:"material_name"}),//素材名称
		"dataIndex" : "mediaName",
		"cls" : null,
		"width" : "20%"
	},{
		"title":locale.get({lang:"type"}),//素材类型
		"dataIndex" : "mediaType",
		"cls" : null,
		"width" : "10%",
		 render: function(data, type, row) {
                var display = "";
                if (data) {
                	dataArr=data.split("_");
                    display = dataArr[0];
                    if(display == "1"){
                    	display = locale.get({lang: "imageGridTitle"});
                    }else if(display == "2"){
                    	display = locale.get({lang: "material_video"});
                    }else if(display == "3"){
                    	display = locale.get({lang: "ad_txt"});
                    }
                }
                return display;
            }
    },{
		"title":locale.get({lang:"file_source"}),//文件来源
		"dataIndex" : "fileSource",
		"cls" : null,
		"width" : "10%",
		 render: function(data, type, row) {
                var display = "";
                if (data) {
                    if(data == "1"){
                    	display = "本地文件";
                    }else if(data == "2"){
                    	display = "远程文件";
                    }
                }
                return display;
            }
    },{
		"title":locale.get({lang:"ad_filename"}),//文件名称
		"dataIndex" : "fileName",
		"cls" : null,
		"width" : "20%",
	},{
		"title":locale.get({lang:"ad_preview"}),//文件预览
		"dataIndex" : "mediaType",
		"cls" : null,
		"width" : "20%",
        render:function(data, type, row){
			    var productsImage = locale.get({lang:"products"});
			    var  display = "";
			    if(data){
                	dataArr=data.split("_");
	                display = dataArr[0];
                    if(display == "1" ){
                    	if(dataArr[1]!=null && dataArr[1]!="" ){
                    	var src = cloud.config.FILE_SERVER_URL + "/api/file/" + dataArr[1] + "?access_token=" + cloud.Ajax.getAccessToken();
    	                display = new Template(
    	                    "<img id='img_"+dataArr[1]+"' src='" + src + "' style='width:40px;height:40px;cursor: pointer;'/>")
    	                    .evaluate({
    	                        status : productsImage
    	                    });
                    	}else{
                    		display = ""
                    	}
                    }else if(display == "2"){
                    	if(dataArr[1]!=null && dataArr[1]!="" ){
                    	var src ="../applications/advertisement/adStatistics/PVUV_Statistics/img/play-button.jpg";
    	                display = new Template(
    	                    "<img id='img_"+dataArr[1]+"' src='" + src + "' style='width:40px;height:40px;cursor: pointer;'/>")
    	                    .evaluate({
    	                        status : productsImage
    	                    });
                    	}else{
                    		display = ""
                    	}  
                    }else if(display == "3"){
                    	display = "";
                    }
			    }
            return display;
        }
    },{                                           
		"title":locale.get({lang:"create_time"}),  //创建时间
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "20%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
		}
	}];
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
	        this.element.html(html);
	        this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "medias_list_bar",
					"class" : null
				},
				table : {
					id : "medias_list_table",
					"class" : null
				},
				paging : {
					id : "medias_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			
			$("#medias_list").css("width",$(".wrap").width());
			$("#medias_list_paging").css("width",$(".wrap").width());
			
			$("#medias_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#medias_list").height();
		    var barHeight = $("#medias_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#medias_list_table").css("height",tableHeight);
			
			$("#fullbg").css("width",$(".container-bd").width()); 
			$("#fullbg").css("height","425px"); 
			
			$("#checkimg").css("width",$(".container-bd").width()); 
			$("#checkimg").css("height","425px"); 
			
			this._renderTable();
			this._renderNoticeBar();
			
		},
		stripscript:function(s){ 
		    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]") 
		    var rs = ""; 
		    for (var i = 0; i < s.length; i++) { 
		      rs = rs+s.substr(i, 1).replace(pattern, ''); 
		    } 
		    return rs; 
		},
		_renderTable : function() {
			this.listTable = new Table({
				selector : "#medias_list_table",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "full",
				events : {
					 onRowClick: function(data) {
						    this.listTable.unselectAllRows();
	                        var rows = this.listTable.getClickedRow();
	                        this.listTable.selectRows(rows);
	                        dataArr=data.mediaType.split("_");
			        		 if(dataArr[0] == 1){//图片
			        			 var lefts =($(".container-bd").width() - $("#img_preview").width())/2;
			        			 var tops =($("#user-content").height() - $("#img_preview").height())/2;
			        			 $("#img_preview").css("margin-left",lefts);
			        			 $("#img_preview").css("top",tops);
			        			 
			        			 var src2 = cloud.config.FILE_SERVER_URL + "/api/file/" + dataArr[1]+ "?access_token=" + cloud.Ajax.getAccessToken();
		    					 $("#img_"+dataArr[1]).bind('click',{src:src2},function(e){
					        			 var bh = $("body").height(); 
						        		 var bw = $("body").width(); 
					        			 $("#fullbg").css("display","block"); 
					        			
					        			 $("#img_preview").attr("src",e.data.src);
					        			 $("#medias_list").css("opacity","0.3");
						        		 $("#img_preview").show();
		    					  });
			        		 }else if(dataArr[0] == 2){//视频
			        			 var src2 = cloud.config.FILE_SERVER_URL + "/api/file/" + dataArr[1] + "?access_token=" + cloud.Ajax.getAccessToken();
			        			 
			        			 var lefts =($(".container-bd").width() - $("#vi_preview").width())/2;
			        			 $("#vi_preview").css("margin-left",-lefts);
			        			 
			        			 $("#img_"+dataArr[1]).bind('click',{src:src2},function(e){
				        			 var bh = $("body").height(); 
					        		 var bw = $("body").width(); 
				        			 
				        			 $("#checkimg").css("display","block"); 
				        			 
				        			 $("#vi_preview").attr("src",e.data.src);
				        			 $("#medias_list").css("opacity","0.3");
					        		 $("#vi_preview").show();
				        		
		    					  });
	                		 }
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                    },
	                   scope: this

				}

			});
			var height = $("#medias_list_table").height()+"px";
	        $("#medias_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			cloud.util.mask("#medias_list_table");
        	var self = this;
            var mediasSearch = $("#mediasSearch").val();
        	var mediasValue = $("#mediasValue").val();
        	if(mediasValue){
        		mediasValue = self.stripscript(mediasValue);
        	}
        	var mediaName = null;
            var fileName = null;
	        if (mediasSearch) {
	            if (mediasSearch == 0) {//素材名称
	            	mediaName = mediasValue;
	            } else if (mediasSearch == 1) {
	            	fileName = mediasValue;//文件名称
	            }
	        }
        	
			self.searchData = {
				"mediaName":mediaName,
				"fileName":fileName
			};
			Service.getAllMedia(self.searchData,limit,cursor,function(data){
				 var total = data.result.length;
				 self.pageRecordTotal = total;
	        	 self.totalCount = data.result.length;
        		 self.listTable.render(data.result);
	        	 self._renderpage(data, 1);
	        	 cloud.util.unmask("#medias_list_table");
			 }, self);
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#medias_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#medias_list_table");
        				Service.getAllMedia(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   cloud.util.unmask("#medias_list_table");
        				});
        			},
        			turn:function(data, nowPage){
        			    self.totalCount = data.result.length;
        			    self.listTable.clearTableData();
        			    self.listTable.render(data.result);
        				self.nowPage = parseInt(nowPage);
        			},
        			events : {
        			    "displayChanged" : function(display){
        			        self.display = parseInt(display);
        			    }
        			}
        		});
        		this.nowPage = start;
        	}
        }, 
        _renderNoticeBar:function(){
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#medias_list_bar",
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  },
					  add:function(){
						    if (this.addMedias) {
	                            this.addMedias.destroy();
	                        }
	                        this.addMedias = new addMedias({
	                            selector: "body",
	                            events: {
	                                "getMediasList": function() {
	                                	self.loadTableData($(".paging-limit-select").val(),0);
	                                }
	                            }
	                        });
					  },
					  modify:function(){
						    var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length == 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else if (selectedResouces.length >= 2) {
	                            dialog.render({lang: "select_one_gateway"});
	                        } else {
	                        	var mediasId = selectedResouces[0]._id;
	                        	if (this.modifyMedias) {
		                            this.modifyMedias.destroy();
		                        }
	                        	 this.modifyMedias = new addMedias({
	 	                            selector: "body",
	 	                            mediasId:mediasId,//媒体库ID
	 	                            events: {
	 	                                "getMediasList": function() {
	 	                                	self.loadTableData($(".paging-limit-select").val(),0);
	 	                                }
	 	                            }
	 	                        });
	                        }
					  },
					  drop:function(){
						  var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length === 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else {
	                            dialog.render({
	                                lang: "affirm_delete",
	                                buttons: [{
	                                        lang: "affirm",
	                                        click: function() {
	                                            for (var i = 0; i < selectedResouces.length; i++) {
	                                                var _id = selectedResouces[i]._id;
	                                                Service.deleteMedias(_id, function(data) {
	                                                });
	                                            }
	                                            self.loadTableData($(".paging-limit-select").val(),0);
	                                            dialog.render({lang: "deletesuccessful"});
	                                            dialog.close();
	                                        }
	                                    },
	                                    {
	                                        lang: "cancel",
	                                        click: function() {
	                                            dialog.close();
	                                        }
	                                    }]
	                            });
	                        }
					  }
				}
			});
		},
		getSelectedResources: function() {
            var self = this;
            var rows = self.listTable.getSelectedRows();
            var selectedRes = new Array();
            rows.each(function(row) {
                selectedRes.push(self.listTable.getData(row));
            });
            return selectedRes;
        }  
	});
	return list;
});