// pages/submit_from_deposit/submit_from_deposit.js

var common = require("../../utils/util.js");
var app = getApp();
const imgurl = app.globalData.imgUrl;
const wxurl = app.globalData.wxUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
	  imgurl: imgurl,
	  address: null,     //收货地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //改地址
  tapAddress: function (e) {
	  wx.navigateTo({
		  url: '/pages/address/address?from_=orderConfirm',
	  })
  },
  //取默认地址
  getAddress: function () {
	  var that = this;
	  var username = common.getUserName()
	  common.httpG('address/default_address', {
		  username: username
	  }, function (data) {
		  if (data.code == 0) {
			  that.setData({
				  address: data.data,
			  })
		  }
	  })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	  this.getAddress()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})