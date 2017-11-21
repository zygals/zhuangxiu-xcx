//index.js
//获取应用实例
const app = getApp();
const IMGURL = app.globalData.imgUrl;
const WXURL = app.globalData.wxUrl;
const common = require('../../utils/util.js');

Page({
  data: {
    advs: [],
    decorate:[],
    duration: 1000,
    interval: 3000,
    indicatorColor: '#fff',
    indicatorActiveColor: '#d1a87a',
    autoplay: true,
    circular: true,
    message: '公益验房',
    indicatorDots: true,
    IMGURL:IMGURL
  },
  onLoad: function () {
    
  },
  getAdvs() {
	  var advs=[];
	  if(advs=wx.getStorageSync('advs')){
		  this.setData({
			  advs: advs
		  })
		  return ;
	  }
	  
    var that =this;
    wx.request({
      url: WXURL + 'ad/index',
      success: (res)=> {
        that.setData({
          advs: res.data.data
        })
		wx.setStorage({
			key: 'advs',
			data: res.data.data,
		})
      }
    })
  },
  getDecorate() {
    var that = this;
	var decorate = [];
	if (decorate = wx.getStorageSync('articles_index')) {
		this.setData({
			decorate: decorate
		})
		return;
	}
    wx.request({
      url: WXURL + 'article/index_show',
      success: (res) => {
        that.setData({
          decorate: res.data.data
        })
		//缓存
		wx.setStorage({
			key: 'articles_index',
			data: res.data.data,
		})
      }
	
    })
  },
onShow:function(){
	this.getAdvs();
	this.getDecorate();
},
onPullDownRefresh(){
	// this.getAdvs();
	// this.getDecorate();
	// wx.stopPullDownRefresh();
},
  /**
     * 用户点击右上角分享
     */
  onShareAppMessage: function () {

  }
  
})
