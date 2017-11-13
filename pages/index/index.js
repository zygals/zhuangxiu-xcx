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
    this.getAdvs();
    this.getDecorate();
    this.getInfo();
  },
  getAdvs() {
    var that =this;
    wx.request({
      url: WXURL + 'ad/index',
      success: (res)=> {
        that.setData({
          advs: res.data.data
        })
      }
    })
  },
  getDecorate() {
    var that = this;
    wx.request({
      url: WXURL + 'article/index_show',
      success: (res) => {
        that.setData({
          decorate: res.data.data
        })
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 调用用户信息
  getInfo: function () {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        that.setData({
          userInfo: userInfo,

        });
        //将用户信息：头像和昵称发送服务器
        var username = wx.getStorageSync('username');
        if (!username) {
          app.register();
          username = wx.getStorageSync('username')
        }
        common.httpP('user/save', {
          'username': username,
          'vistar': userInfo.avatarUrl,
          'nickname': userInfo.nickName,
          'sex': userInfo.gender,
        }, function (res) {

        });
      },
      //如果不同意则提示用户设置为同意
      fail: function () {
        wx.openSetting({
          success: function (data) {
            if (data) {
              if (data.authSetting["scope.userInfo"] == true) {
                that.getInfo();
              } else {
                wx.showModal({
                  title: '授权提醒',
                  content: '为了您更好的体验，请同意授权登录',
                })
              }
            }
          }
        })
      }
    })
  },
  /**
     * 用户点击右上角分享
     */
  onShareAppMessage: function () {

  }
})
